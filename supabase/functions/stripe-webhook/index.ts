/*
  # Stripe Webhook Handler - Production Ready

  1. Webhook Security
    - Proper signature verification
    - Event handling for payment status updates
    - Error handling and logging

  2. Order Management
    - Updates order status based on payment events
    - Handles both success and failure scenarios
    - Maintains data consistency
*/

import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Helper function to verify Stripe webhook signature
async function verifyStripeSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )

    // Extract timestamp and signature from header
    const elements = signature.split(',')
    let timestamp = ''
    let v1Signature = ''

    for (const element of elements) {
      const [key, value] = element.split('=')
      if (key === 't') timestamp = value
      if (key === 'v1') v1Signature = value
    }

    if (!timestamp || !v1Signature) {
      return false
    }

    // Create the signed payload
    const signedPayload = `${timestamp}.${payload}`
    const expectedSignature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(signedPayload)
    )

    // Convert to hex string
    const expectedHex = Array.from(new Uint8Array(expectedSignature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    return expectedHex === v1Signature
  } catch (error) {
    console.error('Signature verification error:', error)
    return false
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405,
        headers: corsHeaders 
      })
    }

    const signature = req.headers.get('stripe-signature')
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    
    if (!signature) {
      console.error('Missing Stripe signature')
      return new Response('Missing signature', { 
        status: 400,
        headers: corsHeaders 
      })
    }

    if (!webhookSecret) {
      console.error('Webhook secret not configured')
      return new Response('Webhook not configured', { 
        status: 500,
        headers: corsHeaders 
      })
    }

    const body = await req.text()
    
    // Verify webhook signature for security
    const isValid = await verifyStripeSignature(body, signature, webhookSecret)
    if (!isValid) {
      console.error('Invalid webhook signature')
      return new Response('Invalid signature', { 
        status: 401,
        headers: corsHeaders 
      })
    }

    let event
    try {
      event = JSON.parse(body)
    } catch (err) {
      console.error('Invalid JSON:', err)
      return new Response('Invalid JSON', { 
        status: 400,
        headers: corsHeaders 
      })
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase configuration missing')
      return new Response('Database not configured', { 
        status: 500,
        headers: corsHeaders 
      })
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    console.log('Processing webhook event:', event.type, 'for:', event.data?.object?.id)

    // Handle different webhook events
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object
        
        console.log('Payment succeeded for payment intent:', paymentIntent.id)
        
        // Update order payment and status
        const { data: updatedOrder, error: updateError } = await supabase
          .from('orders')
          .update({ 
            payment_status: 'succeeded',
            order_status: 'confirmed',
            updated_at: new Date().toISOString()
          })
          .eq('payment_intent_id', paymentIntent.id)
          .select()

        if (updateError) {
          console.error('Error updating order for successful payment:', updateError)
          return new Response('Database error', { 
            status: 500,
            headers: corsHeaders 
          })
        }

        if (updatedOrder && updatedOrder.length > 0) {
          console.log('Successfully updated order:', updatedOrder[0].id)
        } else {
          console.warn('No order found for payment intent:', paymentIntent.id)
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const failedPayment = event.data.object
        
        console.log('Payment failed for payment intent:', failedPayment.id)
        
        // Update order to failed status
        const { data: updatedOrder, error: failError } = await supabase
          .from('orders')
          .update({ 
            payment_status: 'failed',
            order_status: 'canceled',
            updated_at: new Date().toISOString()
          })
          .eq('payment_intent_id', failedPayment.id)
          .select()

        if (failError) {
          console.error('Error updating order for failed payment:', failError)
          return new Response('Database error', { 
            status: 500,
            headers: corsHeaders 
          })
        }

        if (updatedOrder && updatedOrder.length > 0) {
          console.log('Successfully updated failed order:', updatedOrder[0].id)
        } else {
          console.warn('No order found for failed payment intent:', failedPayment.id)
        }
        break
      }

      case 'payment_intent.canceled': {
        const canceledPayment = event.data.object
        
        console.log('Payment canceled for payment intent:', canceledPayment.id)
        
        // Update order to canceled status
        const { error: cancelError } = await supabase
          .from('orders')
          .update({ 
            payment_status: 'canceled',
            order_status: 'canceled',
            updated_at: new Date().toISOString()
          })
          .eq('payment_intent_id', canceledPayment.id)

        if (cancelError) {
          console.error('Error updating canceled order:', cancelError)
          return new Response('Database error', { 
            status: 500,
            headers: corsHeaders 
          })
        }
        break
      }

      case 'payment_intent.requires_action': {
        const actionRequired = event.data.object
        console.log('Payment requires action for payment intent:', actionRequired.id)
        
        // Update order to processing status
        const { error: actionError } = await supabase
          .from('orders')
          .update({ 
            payment_status: 'processing',
            updated_at: new Date().toISOString()
          })
          .eq('payment_intent_id', actionRequired.id)

        if (actionError) {
          console.error('Error updating order requiring action:', actionError)
        }
        break
      }

      default:
        console.log('Unhandled webhook event type:', event.type)
        // Return success even for unhandled events to prevent retries
        break
    }

    return new Response('OK', { 
      status: 200,
      headers: corsHeaders 
    })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return new Response('Internal server error', { 
      status: 500,
      headers: corsHeaders 
    })
  }
})
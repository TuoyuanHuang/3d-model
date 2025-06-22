/*
  # Create Payment Intent and Order Edge Function - Fixed Payment Methods

  1. Fixed Payment Intent Creation
    - Removed conflicting payment_method_types
    - Using only automatic_payment_methods for better compatibility
    - Enhanced metadata for better tracking

  2. Security & Features
    - Server-side Stripe secret key usage
    - Database integration with RLS
    - Input validation and error handling
    - Support for multiple payment methods
*/

import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface CartItem {
  id: string;
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  selected_color?: string;
}

interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  productName: string;
  productId: string;
  quantity?: number;
  selectedColor?: string;
  deliveryMethod?: 'standard' | 'express';
  deliveryFee?: number;
  cartItems?: CartItem[];
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    postalCode?: string;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Parse request body
    const requestData: CreatePaymentIntentRequest = await req.json()

    // Validate required fields
    if (!requestData.amount || !requestData.currency || !requestData.productName || !requestData.customerInfo?.name || !requestData.customerInfo?.email) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get environment variables
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY not configured')
      return new Response(
        JSON.stringify({ error: 'Payment service not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase configuration missing')
      return new Response(
        JSON.stringify({ error: 'Database service not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get user from Authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Extract token and get user
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Prepare parameters for Stripe API - FIXED: Only use automatic_payment_methods
    const stripeParams = new URLSearchParams({
      amount: requestData.amount.toString(),
      currency: requestData.currency,
      'automatic_payment_methods[enabled]': 'true',
      'automatic_payment_methods[allow_redirects]': 'never',
      'metadata[productName]': requestData.productName,
      'metadata[customerName]': requestData.customerInfo.name,
      'metadata[customerEmail]': requestData.customerInfo.email,
      'metadata[deliveryMethod]': requestData.deliveryMethod || 'standard',
      'metadata[userId]': user.id,
      'metadata[orderId]': crypto.randomUUID(),
      receipt_email: requestData.customerInfo.email,
    })

    // Only add shipping information if all required fields are present and non-empty
    const hasCompleteShippingAddress = 
      requestData.customerInfo.address && 
      requestData.customerInfo.address.trim() !== '' &&
      requestData.customerInfo.city && 
      requestData.customerInfo.city.trim() !== '' &&
      requestData.customerInfo.postalCode && 
      requestData.customerInfo.postalCode.trim() !== ''

    if (hasCompleteShippingAddress) {
      stripeParams.append('shipping[name]', requestData.customerInfo.name)
      stripeParams.append('shipping[phone]', requestData.customerInfo.phone || '')
      stripeParams.append('shipping[address][line1]', requestData.customerInfo.address!)
      stripeParams.append('shipping[address][city]', requestData.customerInfo.city!)
      stripeParams.append('shipping[address][postal_code]', requestData.customerInfo.postalCode!)
      stripeParams.append('shipping[address][country]', 'IT')
    }

    // Create payment intent with Stripe API
    const stripeResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Stripe-Version': '2023-10-16',
      },
      body: stripeParams,
    })

    if (!stripeResponse.ok) {
      const errorData = await stripeResponse.text()
      console.error('Stripe API error:', errorData)
      return new Response(
        JSON.stringify({ error: 'Failed to create payment intent' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const paymentIntent = await stripeResponse.json()

    // Create order in database - only include shipping address if complete
    const shippingAddress = hasCompleteShippingAddress ? {
      address: requestData.customerInfo.address!,
      city: requestData.customerInfo.city!,
      postalCode: requestData.customerInfo.postalCode!,
      country: 'IT'
    } : null

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        customer_name: requestData.customerInfo.name,
        customer_email: requestData.customerInfo.email,
        customer_phone: requestData.customerInfo.phone || null,
        shipping_address: shippingAddress,
        total_amount: requestData.amount / 100, // Convert from cents to euros
        currency: requestData.currency,
        delivery_method: requestData.deliveryMethod || 'standard',
        delivery_fee: requestData.deliveryFee || 0,
        payment_intent_id: paymentIntent.id,
        payment_status: 'pending', // Will be updated by webhook
        order_status: 'processing'
      })
      .select()
      .single()

    if (orderError) {
      console.error('Database error creating order:', orderError)
      return new Response(
        JSON.stringify({ error: 'Failed to create order record' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create order items
    if (requestData.cartItems && requestData.cartItems.length > 0) {
      // Handle cart order - multiple items
      const orderItems = requestData.cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        selected_color: item.selected_color || null
      }))

      const { error: orderItemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (orderItemsError) {
        console.error('Database error creating order items:', orderItemsError)
      }
    } else {
      // Handle single product order
      const { error: orderItemError } = await supabase
        .from('order_items')
        .insert({
          order_id: order.id,
          product_id: requestData.productId,
          product_name: requestData.productName,
          quantity: requestData.quantity || 1,
          unit_price: requestData.amount / 100, // Convert from cents to euros
          selected_color: requestData.selectedColor || null
        })

      if (orderItemError) {
        console.error('Database error creating order item:', orderItemError)
      }
    }

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        orderId: order.id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in create-payment-intent function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
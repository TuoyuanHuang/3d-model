# Stripe Webhook Configuration Guide

## Step 1: Get Your Webhook Endpoint URL

Your webhook endpoint URL will be:
```
https://ddmkhgobkzpwlmzgxuzc.supabase.co/functions/v1/stripe-webhook
```

## Step 2: Configure Webhook in Stripe Dashboard

1. **Login to Stripe Dashboard**
   - Go to https://dashboard.stripe.com
   - Make sure you're in the correct account/mode (Live or Test)

2. **Navigate to Webhooks**
   - In the left sidebar, click "Developers"
   - Click "Webhooks"
   - Click "Add endpoint"

3. **Add Webhook Endpoint**
   - **Endpoint URL**: `https://ddmkhgobkzpwlmzgxuzc.supabase.co/functions/v1/stripe-webhook`
   - **Description**: "3D su Misura Order Updates"
   - **Events to send**: Select these specific events:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `payment_intent.canceled`
     - `payment_intent.requires_action`

4. **Save and Get Signing Secret**
   - Click "Add endpoint"
   - After creation, click on the webhook endpoint
   - In the "Signing secret" section, click "Reveal"
   - Copy the webhook signing secret (starts with `whsec_`)

## Step 3: Configure Environment Variables

1. **Go to Supabase Dashboard**
   - Navigate to https://supabase.com/dashboard
   - Select your project
   - Go to "Project Settings" → "Edge Functions"

2. **Add Environment Variable**
   - Click "Add new variable"
   - **Name**: `STRIPE_WEBHOOK_SECRET`
   - **Value**: The webhook signing secret from Stripe (starts with `whsec_`)
   - Click "Save"

## Step 4: Test the Webhook

1. **Make a Test Payment**
   - Go to your website and make a test purchase
   - Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date and any 3-digit CVC

2. **Check Webhook Logs**
   - In Stripe Dashboard → Webhooks → Your endpoint
   - Check the "Recent deliveries" section
   - Should show successful 200 responses

3. **Verify Order Status**
   - Check your admin dashboard
   - Order status should update from "processing" to "confirmed" after payment

## Step 5: Production Checklist

- [ ] Webhook endpoint added to Stripe
- [ ] Correct events selected (payment_intent.*)
- [ ] Webhook secret configured in Supabase
- [ ] Test payment completed successfully
- [ ] Order status updates correctly
- [ ] Webhook logs show 200 responses

## Troubleshooting

**Webhook Returns 500 Error:**
- Check Supabase Edge Function logs
- Verify environment variables are set correctly
- Ensure database permissions are correct

**Order Status Not Updating:**
- Check webhook event selection in Stripe
- Verify payment_intent_id matches between Stripe and database
- Check Supabase logs for database errors

**Webhook Signature Verification Fails:**
- Ensure webhook secret is copied correctly
- Check that the secret starts with `whsec_`
- Verify no extra spaces in the environment variable

## Security Notes

- Webhook signature verification is enabled for security
- Only events from Stripe will be processed
- All webhook events are logged for debugging
- Failed signature verification returns 401 Unauthorized

## Support

If you encounter issues:
1. Check Stripe webhook logs for delivery status
2. Check Supabase Edge Function logs for processing errors
3. Verify all environment variables are set correctly
4. Test with Stripe's webhook testing tool
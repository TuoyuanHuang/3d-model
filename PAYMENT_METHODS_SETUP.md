# Payment Methods Setup Guide

## Overview
Your 3D printing website now supports multiple payment methods:
- 💳 **Credit/Debit Cards** (Visa, Mastercard, American Express)
- 📱 **Apple Pay** (Safari on iOS/macOS)
- 🤖 **Google Pay** (Chrome and supported browsers)
- 🌍 **Local Payment Methods** (automatically enabled by region)

## Environment Variables Setup

### 1. Frontend Variables (Add to your `.env` file)
```bash
# Stripe Frontend
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here

# Supabase Frontend
VITE_SUPABASE_URL=https://ddmkhgobkzpwlmzgxuzc.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Backend Variables (Add to Supabase Edge Functions)

Go to **Supabase Dashboard** → **Project Settings** → **Edge Functions** → **Environment Variables**

Add these variables:

```bash
# Stripe Backend
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_signing_secret

# Supabase Backend
SUPABASE_URL=https://ddmkhgobkzpwlmzgxuzc.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Admin Security
ADMIN_MASTER_KEY=your-secret-master-key-2024
```

## Stripe Configuration

### 1. Enable Payment Methods in Stripe Dashboard

1. **Go to Stripe Dashboard** → **Settings** → **Payment methods**

2. **Enable these payment methods:**
   - ✅ Cards (Visa, Mastercard, American Express)
   - ✅ Apple Pay
   - ✅ Google Pay
   - ✅ Link (Stripe's one-click checkout)

3. **Configure Apple Pay:**
   - Add your domain: `your-domain.com`
   - Verify domain ownership
   - Upload Apple Pay certificate

4. **Configure Google Pay:**
   - Enable in Stripe Dashboard
   - No additional setup required

### 2. Update Stripe Settings

1. **Business Information:**
   - Company name: "3D su Misura"
   - Business type: "E-commerce"
   - Industry: "Manufacturing"

2. **Branding:**
   - Upload your logo
   - Set brand colors
   - Configure receipt appearance

## Payment Flow Features

### 🚀 **Enhanced User Experience**
- **One-Click Payments**: Apple Pay and Google Pay for returning customers
- **Smart Payment Detection**: Automatically shows available payment methods
- **Mobile Optimized**: Touch ID, Face ID, and fingerprint authentication
- **Secure Processing**: All payments processed through Stripe's secure infrastructure

### 🔒 **Security Features**
- **3D Secure**: Automatic fraud protection
- **Tokenization**: Card details never stored on your servers
- **Webhook Verification**: Cryptographic signature verification
- **PCI Compliance**: Stripe handles all PCI requirements

### 📱 **Mobile Payment Methods**

**Apple Pay Requirements:**
- Safari browser on iOS/macOS
- Touch ID, Face ID, or passcode enabled
- Card added to Apple Wallet

**Google Pay Requirements:**
- Chrome browser (or supported browser)
- Google account with payment method
- Android device with screen lock enabled

## Testing Payment Methods

### Test Cards (Use in Test Mode)
```bash
# Successful payments
4242 4242 4242 4242  # Visa
4000 0566 5566 5556  # Visa (debit)
5555 5555 5555 4444  # Mastercard

# Failed payments
4000 0000 0000 0002  # Card declined
4000 0000 0000 9995  # Insufficient funds

# 3D Secure authentication
4000 0025 0000 3155  # Requires authentication
```

### Test Apple Pay
1. Use Safari on iOS/macOS
2. Add test card to Apple Wallet
3. Test checkout flow

### Test Google Pay
1. Use Chrome browser
2. Sign in to Google account
3. Add test payment method
4. Test checkout flow

## Production Checklist

### ✅ **Stripe Configuration**
- [ ] Live API keys configured
- [ ] Payment methods enabled (Cards, Apple Pay, Google Pay)
- [ ] Webhooks configured and tested
- [ ] Business information completed
- [ ] Bank account connected for payouts

### ✅ **Environment Variables**
- [ ] Frontend variables in `.env`
- [ ] Backend variables in Supabase Edge Functions
- [ ] Webhook secret configured
- [ ] All keys are LIVE (not test) keys

### ✅ **Domain Setup**
- [ ] Apple Pay domain verified
- [ ] SSL certificate installed
- [ ] HTTPS enabled for all pages

### ✅ **Testing**
- [ ] Test card payments work
- [ ] Apple Pay works on Safari
- [ ] Google Pay works on Chrome
- [ ] Webhooks update order status
- [ ] Email receipts are sent

## Troubleshooting

### Apple Pay Not Showing
- Verify domain in Stripe Dashboard
- Check Safari browser and iOS/macOS device
- Ensure HTTPS is enabled
- Verify Apple Pay is set up in device settings

### Google Pay Not Showing
- Check Chrome browser
- Verify Google account has payment method
- Ensure site is served over HTTPS
- Check browser console for errors

### Payment Failures
- Check Stripe Dashboard logs
- Verify webhook configuration
- Check Supabase Edge Function logs
- Ensure all environment variables are set

## Support

For payment-related issues:
1. **Stripe Dashboard**: Check payment logs and webhook deliveries
2. **Supabase Logs**: Check Edge Function execution logs
3. **Browser Console**: Check for JavaScript errors
4. **Test Mode**: Always test in Stripe test mode first

## Security Best Practices

- ✅ Never expose secret keys in frontend code
- ✅ Always verify webhook signatures
- ✅ Use HTTPS for all payment pages
- ✅ Regularly rotate API keys
- ✅ Monitor Stripe Dashboard for suspicious activity
- ✅ Keep Stripe.js library updated
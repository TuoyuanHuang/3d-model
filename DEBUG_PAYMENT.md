# Payment Debug Guide

## Common Issues and Solutions

### 1. **"Cannot read properties of undefined"**
**Cause**: Missing environment variables or Stripe not loaded
**Solution**: 
- Check `.env` file has `VITE_STRIPE_PUBLISHABLE_KEY`
- Verify Stripe publishable key starts with `pk_`
- Check browser console for Stripe loading errors

### 2. **"Payment intent creation failed"**
**Cause**: Backend Edge Function issues
**Solution**:
- Check Supabase Edge Function logs
- Verify environment variables in Supabase dashboard
- Ensure `STRIPE_SECRET_KEY` is set correctly

### 3. **"Authorization header required"**
**Cause**: User not logged in or session expired
**Solution**:
- Ensure user is logged in before checkout
- Check session token is valid
- Redirect to login if session expired

### 4. **"Database error"**
**Cause**: RLS policies or database connection issues
**Solution**:
- Check user has permission to create orders
- Verify database schema is up to date
- Check Supabase connection

## Debug Steps

### 1. **Check Environment Variables**
```bash
# Frontend (.env file)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_... # or pk_test_...
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Backend (Supabase Edge Functions)
STRIPE_SECRET_KEY=sk_live_... # or sk_test_...
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. **Test Payment Flow**
1. **Login**: Ensure user is authenticated
2. **Add to Cart**: Add products to cart
3. **Checkout**: Fill required customer info
4. **Payment**: Use test card `4242 4242 4242 4242`

### 3. **Check Browser Console**
Look for these errors:
- Stripe loading errors
- Network request failures
- JavaScript errors

### 4. **Check Supabase Logs**
1. Go to Supabase Dashboard
2. Navigate to Edge Functions
3. Check `create-payment-intent` function logs
4. Look for error messages

### 5. **Test Cards**
```bash
# Success
4242 4242 4242 4242  # Visa
4000 0566 5566 5556  # Visa Debit

# Decline
4000 0000 0000 0002  # Generic decline
4000 0000 0000 9995  # Insufficient funds

# 3D Secure
4000 0025 0000 3155  # Requires authentication
```

## Quick Fixes

### Fix 1: Reset Stripe Elements
If payment form is not working, try refreshing the page to reload Stripe Elements.

### Fix 2: Clear Browser Cache
Clear browser cache and cookies, then try again.

### Fix 3: Check Network Tab
1. Open browser DevTools
2. Go to Network tab
3. Try payment
4. Check for failed requests (red entries)

### Fix 4: Verify User Session
```javascript
// Check in browser console
console.log('User:', user);
console.log('Session:', session);
console.log('Auth Token:', session?.access_token);
```

## Contact Support

If issues persist:
1. **Stripe Dashboard**: Check payment logs
2. **Supabase Dashboard**: Check Edge Function logs
3. **Browser Console**: Copy error messages
4. **Network Tab**: Check failed requests

## Test Checklist

- [ ] User is logged in
- [ ] Environment variables are set
- [ ] Stripe publishable key is correct
- [ ] Customer info form is filled
- [ ] Test card number is valid
- [ ] Network requests succeed
- [ ] No console errors
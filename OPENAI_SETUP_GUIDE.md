# OpenAI API Setup Guide

## ⚠️ Current Issue: Quota Exceeded

You're seeing this error:
```
429 You exceeded your current quota, please check your plan and billing details.
```

This means your OpenAI API key either:
1. Has no credits/quota remaining
2. Is on the free tier which has expired
3. Needs billing information added

## 🔧 How to Fix

### Option 1: Add Credits to Your OpenAI Account (RECOMMENDED)

1. **Go to OpenAI Platform**
   - Visit: https://platform.openai.com/account/billing

2. **Add Payment Method**
   - Click "Add payment method"
   - Enter your credit/debit card details
   - Save

3. **Add Credits**
   - Click "Add to credit balance"
   - Minimum: $5 (recommended: $10-20 for testing)
   - This will last for thousands of transactions

4. **Verify Your Account**
   - Check: https://platform.openai.com/account/usage
   - You should see available credits

5. **Test the Feature**
   - Restart your dev server: `npm run dev`
   - Try the AI Entry feature again

### Option 2: Create a New API Key

If your current key is from a free trial that expired:

1. **Go to API Keys Page**
   - Visit: https://platform.openai.com/api-keys

2. **Create New Key**
   - Click "+ Create new secret key"
   - Name it: "Expense Tracker Dev"
   - Copy the key (starts with `sk-...`)

3. **Update Your .env File**
   ```env
   OPENAI_API_KEY="sk-your-new-key-here"
   ```

4. **Restart Dev Server**
   ```bash
   npm run dev
   ```

### Option 3: Use Alternative AI Providers (FREE)

If you don't want to pay for OpenAI, you can use free alternatives:

#### A. Google Gemini (FREE)
- Free tier: 60 requests per minute
- Get API key: https://makersuite.google.com/app/apikey

#### B. Anthropic Claude (FREE Trial)
- $5 free credits
- Get API key: https://console.anthropic.com/

#### C. Hugging Face (FREE)
- Completely free
- Get API key: https://huggingface.co/settings/tokens

**Note**: Using alternatives requires code changes. Let me know if you want to implement any of these.

## 💰 Cost Breakdown

### OpenAI GPT-4o-mini Pricing:
- **Input**: $0.00015 per 1K tokens (~750 words)
- **Output**: $0.0006 per 1K tokens

### Typical Transaction Costs:
- Simple: "Lunch 250" = ~$0.0001
- Detailed: "Spent 2500 on groceries at BigBasket yesterday" = ~$0.0002
- Multiple: "Paid rent 15000 and electricity 2000" = ~$0.0003

### Monthly Estimates:
- **Light use** (50 transactions/month): ~$0.01
- **Medium use** (200 transactions/month): ~$0.04
- **Heavy use** (500 transactions/month): ~$0.10

**$10 credit = ~50,000 transactions!**

## 🔍 Check Your Current Status

### 1. Check API Key Status
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

If you get a 401 error, your key is invalid.
If you get a 429 error, you're out of quota.

### 2. Check Usage Dashboard
Visit: https://platform.openai.com/account/usage

You'll see:
- Current balance
- Usage this month
- Rate limits

### 3. Check Billing
Visit: https://platform.openai.com/account/billing/overview

You'll see:
- Payment methods
- Credit balance
- Billing history

## 🚀 Quick Start After Adding Credits

1. **Verify Credits Added**
   ```
   Go to: https://platform.openai.com/account/billing/overview
   You should see: "Credit balance: $X.XX"
   ```

2. **Restart Your App**
   ```bash
   # Stop the dev server (Ctrl+C)
   npm run dev
   ```

3. **Test the AI Feature**
   - Navigate to: http://localhost:3000/ai-entry
   - Type: "Spent 500 on groceries"
   - Should work now! ✅

## 🆘 Still Having Issues?

### Error: "Invalid API Key"
- Your key might be revoked
- Create a new one at: https://platform.openai.com/api-keys

### Error: "Rate Limit Exceeded"
- You're making too many requests
- Wait 1 minute and try again
- Free tier: 3 requests/minute
- Paid tier: 500 requests/minute

### Error: "Model Not Found"
- The model name might be wrong
- Current model: `gpt-4o-mini`
- Check available models: https://platform.openai.com/docs/models

## 📝 Alternative: Mock Mode for Testing

If you want to test the UI without OpenAI, I can add a "mock mode" that simulates AI responses without making API calls. Let me know if you want this!

## 🎯 Recommended Setup

For development and testing:
1. Add $10 to your OpenAI account
2. This will last for months of testing
3. Set up billing alerts at $5 and $8
4. Monitor usage weekly

For production:
1. Add $20-50 depending on expected users
2. Set up usage alerts
3. Implement rate limiting per user
4. Cache common responses

## 📞 Need Help?

If you're still stuck:
1. Check OpenAI Status: https://status.openai.com/
2. OpenAI Support: https://help.openai.com/
3. Or let me know and I can help troubleshoot!

---

**Next Step**: Add credits to your OpenAI account and restart the app!
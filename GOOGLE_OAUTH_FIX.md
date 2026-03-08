# Google OAuth Configuration Fix

## ⚠️ Issue Detected

Your Google OAuth redirect URI is incorrect. This will prevent Google sign-in from working.

## Current Configuration (INCORRECT)

```
Authorized redirect URIs:
http://localhost:3000
```

## Required Configuration (CORRECT)

```
Authorized redirect URIs:
http://localhost:3000/api/auth/callback/google
```

## How to Fix

### Step 1: Go to Google Cloud Console

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: **finance-tracker**
3. Go to **APIs & Services** > **Credentials**

### Step 2: Edit Your OAuth Client

1. Click on your OAuth 2.0 Client ID: **finance-tracker**
2. Scroll down to **Authorized redirect URIs**

### Step 3: Update the Redirect URI

1. **Remove** the current URI: `http://localhost:3000`
2. **Add** the correct URI: `http://localhost:3000/api/auth/callback/google`
3. Click **Save**

### Step 4: Update Your Client Secret

I've added your Client ID to the `.env` file. Now you need to add your Client Secret:

1. In Google Cloud Console, find your **Client secret** (it shows as `****YvXA`)
2. Click the copy icon to copy the full secret
3. Open your `.env` file
4. Replace `your-client-secret-here` with your actual client secret

Your `.env` should look like this:

```env
# Google OAuth
GOOGLE_CLIENT_ID="459371690049-rufbsdrt2c02qibi88fmit4trgaccpqd.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="paste-your-actual-secret-here"
```

### Step 5: Wait for Changes to Propagate

Google says: "It may take 5 minutes to a few hours for settings to take effect"

Usually it's instant, but if it doesn't work immediately, wait a few minutes.

## Complete Setup Checklist

- [x] Google OAuth client created
- [x] Client ID added to `.env`
- [ ] **Fix redirect URI** to `http://localhost:3000/api/auth/callback/google`
- [ ] **Add client secret** to `.env`
- [ ] Run `npm install` (if not done already)
- [ ] Run `npm run db:push` to create database tables
- [ ] Run `npm run dev` to start the application
- [ ] Test Google sign-in at `http://localhost:3000`

## Testing Google OAuth

After fixing the redirect URI and adding your client secret:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000`

3. You'll be redirected to `/auth/signin`

4. Click **"Sign in with Google"**

5. You should see the Google sign-in popup

6. After signing in, you'll be redirected back to the dashboard

## Troubleshooting

### Error: "redirect_uri_mismatch"

This means the redirect URI in Google Cloud Console doesn't match what NextAuth is using.

**Solution:** Make sure the redirect URI is exactly:
```
http://localhost:3000/api/auth/callback/google
```

### Error: "invalid_client"

This means the Client ID or Client Secret is incorrect.

**Solution:** 
1. Double-check your Client ID in `.env`
2. Copy the Client Secret again from Google Cloud Console
3. Make sure there are no extra spaces or quotes

### Google sign-in button doesn't work

**Solution:**
1. Check browser console for errors
2. Verify all environment variables are set
3. Restart the development server
4. Clear browser cookies and try again

## For Production Deployment

When you deploy to production, you'll need to add another redirect URI:

```
https://yourdomain.com/api/auth/callback/google
```

And update your `.env` file:

```env
NEXTAUTH_URL="https://yourdomain.com"
```

## Your Current Credentials

```
Client ID: 459371690049-rufbsdrt2c02qibi88fmit4trgaccpqd.apps.googleusercontent.com
Client Secret: (You need to copy this from Google Cloud Console)
```

## Next Steps

1. ✅ Fix the redirect URI in Google Cloud Console
2. ✅ Add your client secret to `.env`
3. ✅ Run `npm install`
4. ✅ Run `npm run db:push`
5. ✅ Run `npm run dev`
6. ✅ Test Google sign-in

---

**Need Help?** Check [AUTHENTICATION.md](./AUTHENTICATION.md) for detailed setup instructions.
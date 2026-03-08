# Vercel Deployment Guide - Personal Finance Tracker

## 🚀 Complete Vercel Setup Instructions

### Prerequisites

Before deploying to Vercel, ensure you have:
- ✅ GitHub account
- ✅ Vercel account (sign up at https://vercel.com)
- ✅ Neon PostgreSQL database (already set up)
- ✅ Google OAuth credentials (if using Google sign-in)

## 📋 Step-by-Step Deployment

### Step 1: Push Code to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Personal Finance Tracker"
   ```

2. **Create GitHub Repository**:
   - Go to https://github.com/new
   - Create a new repository (e.g., "personal-finance-tracker")
   - Don't initialize with README (you already have code)

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Import Project to Vercel

1. **Go to Vercel**: https://vercel.com/new

2. **Import Git Repository**:
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (leave as default)
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `.next` (auto-filled)

### Step 3: Environment Variables (CRITICAL!)

In Vercel project settings, add these environment variables:

#### Required Variables

```env
# Database (from your Neon dashboard)
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# NextAuth Configuration
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-generated-secret-here

# Google OAuth (if using Google sign-in)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

#### How to Get Each Variable:

**1. DATABASE_URL**:
- Go to your Neon dashboard: https://console.neon.tech
- Select your project
- Copy the connection string
- Should look like: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`

**2. NEXTAUTH_URL**:
- After first deployment, Vercel gives you a URL
- Format: `https://your-app-name.vercel.app`
- Update this after first deployment

**3. NEXTAUTH_SECRET**:
- Generate a secure random string
- Run this command locally:
  ```bash
  openssl rand -base64 32
  ```
- Or use: https://generate-secret.vercel.app/32
- Copy the generated string

**4. GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET**:
- Go to: https://console.cloud.google.com/apis/credentials
- Select your OAuth 2.0 Client
- Copy Client ID and Client Secret

### Step 4: Update Google OAuth Settings

**IMPORTANT**: After deploying to Vercel, update your Google OAuth settings:

1. **Go to Google Cloud Console**: https://console.cloud.google.com/apis/credentials

2. **Edit your OAuth 2.0 Client**

3. **Add Authorized JavaScript origins**:
   ```
   https://your-app-name.vercel.app
   ```

4. **Add Authorized redirect URIs**:
   ```
   https://your-app-name.vercel.app/api/auth/callback/google
   ```

5. **Save changes**

### Step 5: Deploy!

1. **Click "Deploy"** in Vercel

2. **Wait for build** (usually 2-3 minutes)

3. **Check deployment logs** for any errors

4. **Visit your site**: `https://your-app-name.vercel.app`

### Step 6: Post-Deployment Setup

#### Update NEXTAUTH_URL

1. **Copy your Vercel URL**: `https://your-app-name.vercel.app`

2. **Go to Vercel Project Settings** → Environment Variables

3. **Update NEXTAUTH_URL** with your actual Vercel URL

4. **Redeploy** (Vercel → Deployments → Click "..." → Redeploy)

#### Initialize Database

The database tables should already exist from local development. If not:

1. **Add build command in Vercel**:
   - Go to Project Settings → General
   - Build Command: `npx prisma generate && npm run build`

2. **Or run manually** after deployment:
   ```bash
   # In your local terminal
   DATABASE_URL="your-production-db-url" npx prisma db push
   ```

## 🔧 Vercel Configuration

### vercel.json (Optional)

Create this file in your project root for custom configuration:

```json
{
  "buildCommand": "npx prisma generate && npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

### Environment Variables Summary

| Variable | Where to Get | Required |
|----------|--------------|----------|
| `DATABASE_URL` | Neon Dashboard | ✅ YES |
| `NEXTAUTH_URL` | Your Vercel URL | ✅ YES |
| `NEXTAUTH_SECRET` | Generate random string | ✅ YES |
| `GOOGLE_CLIENT_ID` | Google Cloud Console | ⚠️ If using OAuth |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console | ⚠️ If using OAuth |

## 🐛 Troubleshooting

### Issue: "Database connection failed"

**Solution**:
1. Check `DATABASE_URL` is correct
2. Ensure it includes `?sslmode=require`
3. Verify Neon database is active
4. Check connection string has no extra spaces

### Issue: "NextAuth configuration error"

**Solution**:
1. Verify `NEXTAUTH_URL` matches your Vercel URL exactly
2. Ensure `NEXTAUTH_SECRET` is set
3. Check no trailing slashes in `NEXTAUTH_URL`

### Issue: "Google OAuth not working"

**Solution**:
1. Update Google OAuth redirect URIs with Vercel URL
2. Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
3. Check authorized origins include your Vercel domain
4. Wait 5 minutes for Google changes to propagate

### Issue: "Build failed - Prisma error"

**Solution**:
1. Add to build command: `npx prisma generate && npm run build`
2. Or add to `package.json`:
   ```json
   "scripts": {
     "build": "npx prisma generate && next build"
   }
   ```

### Issue: "Environment variables not working"

**Solution**:
1. Ensure variables are added in Vercel dashboard
2. Redeploy after adding variables
3. Check variable names match exactly (case-sensitive)
4. No quotes around values in Vercel UI

## 📊 Deployment Checklist

Before deploying:
- [ ] Code pushed to GitHub
- [ ] Neon database is active
- [ ] All environment variables ready
- [ ] Google OAuth credentials configured
- [ ] `.env.example` updated (don't commit `.env`)

During deployment:
- [ ] Project imported to Vercel
- [ ] Environment variables added
- [ ] Build successful
- [ ] No errors in deployment logs

After deployment:
- [ ] Update `NEXTAUTH_URL` with Vercel URL
- [ ] Update Google OAuth redirect URIs
- [ ] Test sign-in functionality
- [ ] Test creating transactions
- [ ] Verify database connection
- [ ] Check mobile responsiveness

## 🎯 Production Best Practices

### 1. Custom Domain (Optional)

1. **Buy domain** (e.g., from Namecheap, GoDaddy)
2. **Add to Vercel**:
   - Project Settings → Domains
   - Add your domain
   - Follow DNS configuration instructions
3. **Update environment variables**:
   - Change `NEXTAUTH_URL` to your custom domain
   - Update Google OAuth URIs

### 2. Analytics

Enable Vercel Analytics:
- Project Settings → Analytics
- Enable Web Analytics
- View traffic and performance metrics

### 3. Monitoring

Set up monitoring:
- Enable Vercel Speed Insights
- Monitor error logs in Vercel dashboard
- Set up alerts for deployment failures

### 4. Security

- ✅ Never commit `.env` file
- ✅ Use strong `NEXTAUTH_SECRET`
- ✅ Keep dependencies updated
- ✅ Enable HTTPS (automatic on Vercel)
- ✅ Review Vercel security headers

## 🚀 Continuous Deployment

Once set up, every push to GitHub automatically deploys:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Vercel automatically:
# 1. Detects push
# 2. Builds project
# 3. Runs tests
# 4. Deploys to production
```

## 📱 Testing Production

After deployment, test:

1. **Sign Up**: Create new account
2. **Sign In**: Test authentication
3. **Add Income**: Test with ₹1,000,000,000
4. **Add Expense**: Verify validation works
5. **Dashboard**: Check calculations
6. **Mobile**: Test on phone
7. **Dark Mode**: Toggle and verify

## 🎉 Success!

Your app is now live at: `https://your-app-name.vercel.app`

Share it with:
- Friends and family
- On social media
- In your portfolio

## 📞 Support

If you encounter issues:

1. **Check Vercel Logs**:
   - Project → Deployments → Click deployment → View Function Logs

2. **Check Build Logs**:
   - Look for errors during build process

3. **Verify Environment Variables**:
   - Project Settings → Environment Variables
   - Ensure all required variables are set

4. **Test Locally First**:
   - If it works locally but not on Vercel, it's likely an environment variable issue

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Neon Console**: https://console.neon.tech
- **Google Cloud Console**: https://console.cloud.google.com

---

**Ready to deploy? Follow the steps above and your app will be live in minutes!** 🚀
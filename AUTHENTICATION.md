# Authentication Setup Guide

This application uses **NextAuth.js** for authentication with support for:
- **Google OAuth** (Social Login)
- **Credentials** (Email/Password)

## Prerequisites

- PostgreSQL database (Neon or any PostgreSQL provider)
- Google Cloud Console account (for OAuth)

## Setup Steps

### 1. Database Setup

The database schema includes NextAuth tables. Run Prisma migrations:

```bash
npm run db:push
```

This will create the following tables:
- `User` - User accounts
- `Account` - OAuth account connections
- `Session` - User sessions
- `VerificationToken` - Email verification tokens
- `Transaction` - Financial transactions

### 2. Google OAuth Setup

#### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**

#### Step 2: Create OAuth Credentials

1. Navigate to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Select **Web application**
4. Configure the OAuth consent screen if prompted

#### Step 3: Configure Authorized URLs

Add the following URLs:

**Authorized JavaScript origins:**
```
http://localhost:3000
https://yourdomain.com (for production)
```

**Authorized redirect URIs:**
```
http://localhost:3000/api/auth/callback/google
https://yourdomain.com/api/auth/callback/google (for production)
```

#### Step 4: Get Your Credentials

After creating the OAuth client, you'll receive:
- **Client ID**
- **Client Secret**

### 3. Environment Variables

Update your `.env` file with the Google OAuth credentials:

```env
# Database
DATABASE_URL="your-postgresql-connection-string"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

**Important:**
- Generate a secure `NEXTAUTH_SECRET` using: `openssl rand -base64 32`
- For production, update `NEXTAUTH_URL` to your domain

### 4. Install Dependencies

```bash
npm install
```

This will install:
- `next-auth` - Authentication library
- `@next-auth/prisma-adapter` - Prisma adapter for NextAuth
- `bcryptjs` - Password hashing
- `react-icons` - Icons for UI

### 5. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` - you'll be redirected to the sign-in page.

## Authentication Flow

### Sign Up (New Users)

1. Visit `/auth/signup`
2. Choose either:
   - **Email/Password**: Fill in the form and create an account
   - **Google OAuth**: Click "Sign up with Google"
3. After successful registration, you'll be automatically signed in

### Sign In (Existing Users)

1. Visit `/auth/signin` (or you'll be redirected automatically)
2. Choose either:
   - **Email/Password**: Enter your credentials
   - **Google OAuth**: Click "Sign in with Google"
3. After successful authentication, you'll be redirected to the dashboard

### Protected Routes

The following routes require authentication:
- `/` - Dashboard
- `/income` - Income tracker
- `/expenses` - Expense tracker
- `/investments` - Investment tracker
- `/transactions` - Transaction history
- `/analytics` - Analytics dashboard
- `/reports/monthly` - Monthly reports
- `/reports/yearly` - Yearly reports

If you try to access these routes without being signed in, you'll be redirected to `/auth/signin`.

## API Authentication

All API routes under `/api/transactions` are protected and require authentication:

- `GET /api/transactions` - List user's transactions
- `POST /api/transactions` - Create a new transaction
- `GET /api/transactions/[id]` - Get a specific transaction
- `PATCH /api/transactions/[id]` - Update a transaction
- `DELETE /api/transactions/[id]` - Delete a transaction

The API automatically uses the authenticated user's ID from the session.

## Security Features

1. **Password Hashing**: Passwords are hashed using bcrypt with 12 rounds
2. **JWT Sessions**: Secure JWT-based session management
3. **CSRF Protection**: Built-in CSRF protection via NextAuth
4. **Secure Cookies**: HTTP-only cookies for session storage
5. **User Isolation**: Each user can only access their own data

## Troubleshooting

### Google OAuth Not Working

1. Verify your Google Client ID and Secret are correct
2. Check that redirect URIs match exactly (including http/https)
3. Ensure Google+ API is enabled in your project
4. Clear browser cookies and try again

### Database Connection Issues

1. Verify your `DATABASE_URL` is correct
2. Ensure your database is accessible
3. Run `npm run db:push` to sync the schema

### Session Issues

1. Clear browser cookies
2. Verify `NEXTAUTH_SECRET` is set
3. Check that `NEXTAUTH_URL` matches your application URL

## Production Deployment

Before deploying to production:

1. **Update Environment Variables:**
   ```env
   NEXTAUTH_URL="https://yourdomain.com"
   NEXTAUTH_SECRET="generate-a-new-secure-secret"
   ```

2. **Add Production OAuth URLs:**
   - Add your production domain to Google OAuth authorized origins
   - Add production callback URL to authorized redirect URIs

3. **Database Migration:**
   ```bash
   npm run db:migrate
   ```

4. **Build and Deploy:**
   ```bash
   npm run build
   npm start
   ```

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth Setup Guide](https://support.google.com/cloud/answer/6158849)
- [Prisma Documentation](https://www.prisma.io/docs)

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure database migrations are up to date
4. Review the NextAuth.js documentation for advanced configuration
# Database Setup Fix

## Issue

The error shows that the authentication tables (`accounts`, `users`, `sessions`, etc.) don't exist in your database yet.

```
The table `public.accounts` does not exist in the current database.
```

## Solution

You need to push the Prisma schema to your Neon database to create all the required tables.

## Steps to Fix

### Option 1: Run in Your Terminal (Recommended)

Open your terminal in the project directory and run:

```bash
npm run db:push
```

Or directly with Prisma:

```bash
npx prisma db push
```

This will create the following tables in your database:
- `User` - User accounts
- `Account` - OAuth connections (for Google sign-in)
- `Session` - User sessions
- `VerificationToken` - Email verification
- `Transaction` - Financial transactions

### Option 2: Using Prisma Studio

If the above doesn't work, you can also use:

```bash
npx prisma studio
```

This will open Prisma Studio in your browser where you can see your database schema.

### Option 3: Manual Migration

If you prefer migrations over db push:

```bash
npx prisma migrate dev --name init
```

This creates a migration file and applies it to your database.

## What This Does

The command will:
1. Connect to your Neon PostgreSQL database
2. Read your `prisma/schema.prisma` file
3. Create all the tables defined in the schema
4. Set up relationships and indexes

## Expected Output

You should see something like:

```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database

🚀  Your database is now in sync with your Prisma schema. Done in 2.5s

✔ Generated Prisma Client (v5.8.0) to ./node_modules/@prisma/client
```

## After Running the Command

1. **Restart your development server** (if it's running):
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

2. **Try Google sign-in again**:
   - Go to `http://localhost:3000`
   - Click "Sign in with Google"
   - Complete the Google authentication
   - You should be redirected to the dashboard

## Verify Tables Were Created

You can verify the tables were created by:

1. **Using Prisma Studio**:
   ```bash
   npx prisma studio
   ```
   This opens a GUI where you can see all your tables.

2. **Checking Neon Dashboard**:
   - Go to [Neon Console](https://console.neon.tech/)
   - Select your project
   - Go to "Tables" section
   - You should see: User, Account, Session, VerificationToken, Transaction

## Troubleshooting

### Error: "Can't reach database server"

**Solution:** Check your `DATABASE_URL` in `.env` is correct.

### Error: "Authentication failed"

**Solution:** Your database credentials might be wrong. Get a new connection string from Neon.

### Error: "Schema validation failed"

**Solution:** 
```bash
npx prisma generate
npx prisma db push
```

### Tables still not created

**Solution:** Try using migrate instead:
```bash
npx prisma migrate dev --name add_auth_tables
```

## Quick Test After Setup

After the tables are created, test the authentication:

1. **Test Credentials Sign-up**:
   - Go to `/auth/signup`
   - Create an account with email/password
   - You should be signed in automatically

2. **Test Google OAuth**:
   - Sign out
   - Go to `/auth/signin`
   - Click "Sign in with Google"
   - Complete Google authentication
   - You should be redirected to dashboard

3. **Test Protected Routes**:
   - Sign out
   - Try to access `/` or `/income`
   - You should be redirected to `/auth/signin`

## Current Database Schema

Your Prisma schema includes:

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?
  accounts      Account[]
  sessions      Session[]
  transactions  Transaction[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}

model Transaction {
  id        String          @id @default(cuid())
  userId    String
  type      TransactionType
  category  String
  amount    Float
  date      DateTime
  notes     String?
  createdAt DateTime        @default(now())
  updatedAt DateTime        @updatedAt
  user      User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId])
  @@index([date])
  @@index([type])
}

enum TransactionType {
  INCOME
  EXPENSE
  INVESTMENT
}
```

## Need Help?

If you're still having issues:
1. Check that your `.env` file has the correct `DATABASE_URL`
2. Make sure you can connect to your Neon database
3. Try running `npx prisma studio` to see if Prisma can connect
4. Check the Neon dashboard to see if the database is active

---

**Run this command now:**
```bash
npm run db:push
```

Then restart your dev server and try signing in with Google again!
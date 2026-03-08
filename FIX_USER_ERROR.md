# Fix: Foreign Key Constraint Error

## Problem
Getting error: `Foreign key constraint violated: transactions_userId_fkey (index)`

This means the `userId` from your session doesn't exist in the User table.

## Root Cause
When using JWT strategy with NextAuth, the user ID in the session might not match the database if:
1. You signed in before the database was properly set up
2. The database was reset but you're still logged in with an old session
3. The user was deleted from the database but session still exists

## Solution

### Option 1: Sign Out and Sign In Again (RECOMMENDED)
1. Click "Sign Out" in your app
2. Clear your browser cookies for localhost
3. Sign in again (this will create a fresh user in the database)

### Option 2: Check Database Users
Run this command to see what users exist:
```bash
npx ts-node scripts/check-user.ts
```

### Option 3: Reset Everything
If you want to start fresh:

```bash
# 1. Reset the database
npx prisma migrate reset

# 2. Run migrations
npx prisma migrate deploy

# 3. Clear browser storage
# - Open DevTools (F12)
# - Go to Application tab
# - Clear all cookies and local storage for localhost

# 4. Restart your dev server
npm run dev

# 5. Sign up/in again
```

## Prevention
The API route now includes a check to verify the user exists before creating transactions. If you see the error "User not found. Please sign out and sign in again.", follow Option 1 above.

## Technical Details
The error occurs in [`app/api/transactions/route.ts`](app/api/transactions/route.ts:78) when trying to create a transaction with a userId that doesn't exist in the users table.

The fix adds validation:
```typescript
// Verify user exists in database
const userExists = await prisma.user.findUnique({
  where: { id: session.user.id },
});

if (!userExists) {
  return NextResponse.json(
    { error: 'User not found. Please sign out and sign in again.' },
    { status: 404 }
  );
}
```

This provides a clearer error message instead of a cryptic foreign key constraint error.
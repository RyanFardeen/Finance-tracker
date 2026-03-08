# Reset Database - Start Fresh

## 🔄 How to Clear All Data and Start Fresh

### Option 1: Quick Reset (Recommended)

Run this single command to reset everything:

```bash
npm run db:push -- --force-reset
```

This will:
- ✅ Drop all tables
- ✅ Recreate tables from schema
- ✅ Clear all data
- ✅ Keep your schema intact

### Option 2: Manual Reset

If the above doesn't work, follow these steps:

#### Step 1: Stop the application
```bash
# Press Ctrl+C in the terminal running npm run dev
```

#### Step 2: Reset the database
```bash
npx prisma migrate reset
```

This will:
- Drop the database
- Create a new database
- Run all migrations
- Clear all data

**Note**: You'll be asked to confirm. Type `y` and press Enter.

#### Step 3: Push the schema
```bash
npm run db:push
```

#### Step 4: Restart the application
```bash
npm run dev
```

### Option 3: Using Prisma Studio (Visual)

1. **Open Prisma Studio**:
   ```bash
   npm run db:studio
   ```

2. **Open in browser**: `http://localhost:5555`

3. **Delete data manually**:
   - Click on each table (Transaction, User, Account, Session)
   - Select all records
   - Click "Delete X records"
   - Confirm deletion

4. **Close Prisma Studio** and restart your app

### Option 4: Direct Database Reset (Neon)

If using Neon PostgreSQL:

1. **Go to Neon Console**: https://console.neon.tech
2. **Select your project**
3. **Go to SQL Editor**
4. **Run this SQL**:
   ```sql
   -- Delete all data
   TRUNCATE TABLE "Transaction" CASCADE;
   TRUNCATE TABLE "Account" CASCADE;
   TRUNCATE TABLE "Session" CASCADE;
   TRUNCATE TABLE "VerificationToken" CASCADE;
   TRUNCATE TABLE "User" CASCADE;
   ```

5. **Restart your app**:
   ```bash
   npm run dev
   ```

## 🎯 What Gets Deleted

When you reset the database, you'll lose:
- ❌ All transactions (income, expenses, investments)
- ❌ All user accounts
- ❌ All sessions
- ❌ All authentication data

## ✅ What Stays

- ✅ Database schema (table structure)
- ✅ Application code
- ✅ Configuration files
- ✅ Environment variables

## 🚀 After Reset

1. **Restart the application**:
   ```bash
   npm run dev
   ```

2. **Open browser**: `http://localhost:3000`

3. **Create new account**:
   - Click "Sign Up"
   - Enter email and password
   - Or use Google OAuth

4. **Start fresh**:
   - Add new transactions
   - Test with clean data
   - Verify bug fixes work

## 🧪 Testing After Reset

Try these test cases with fresh data:

### Test 1: Small Amount
```
Income: ₹1,000
Expected: Displays as ₹1,000
```

### Test 2: Large Amount
```
Expense: ₹1,000,000
Expected: Displays as ₹1.00M
```

### Test 3: Huge Amount
```
Investment: ₹1,000,000,000
Expected: Displays as ₹1.00B
```

### Test 4: Validation
```
Try: -100
Expected: Error "Amount cannot be negative"
```

## 🔧 Troubleshooting

### Issue: "Database does not exist"
**Solution**:
```bash
npm run db:push
```

### Issue: "Migration failed"
**Solution**:
```bash
npx prisma migrate reset
npm run db:push
```

### Issue: "Cannot connect to database"
**Solution**:
1. Check `.env` file has correct `DATABASE_URL`
2. Verify Neon database is running
3. Check internet connection

### Issue: "Tables already exist"
**Solution**:
```bash
npm run db:push -- --force-reset
```

## 📝 Quick Commands Reference

| Command | Purpose |
|---------|---------|
| `npm run db:push -- --force-reset` | Quick reset (recommended) |
| `npx prisma migrate reset` | Full reset with migrations |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open database viewer |
| `npm run dev` | Start application |

## ⚠️ Important Notes

1. **Backup First**: If you have important data, export it before resetting
2. **Development Only**: Only reset in development, never in production
3. **Confirm Action**: Database reset is irreversible
4. **Restart App**: Always restart the app after database reset

## 🎉 Success Indicators

After reset, you should see:
- ✅ Empty dashboard (no transactions)
- ✅ Sign up page works
- ✅ Can create new account
- ✅ Can add transactions
- ✅ All features work correctly

---

**Ready to reset? Run**: `npm run db:push -- --force-reset`
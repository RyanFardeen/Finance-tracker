# Backend Setup Guide

## Overview

The backend uses:
- **PostgreSQL** - Relational database for financial data
- **Prisma ORM** - Type-safe database client
- **Next.js API Routes** - RESTful API endpoints
- **NextAuth.js** - Authentication (optional, for multi-user support)

## Database Schema

### Tables

1. **users**
   - `id` (String, Primary Key)
   - `email` (String, Unique)
   - `name` (String, Optional)
   - `password` (String, Hashed)
   - `createdAt` (DateTime)
   - `updatedAt` (DateTime)

2. **transactions**
   - `id` (String, Primary Key)
   - `userId` (String, Foreign Key → users.id)
   - `type` (Enum: INCOME, EXPENSE, INVESTMENT)
   - `category` (String)
   - `amount` (Decimal)
   - `date` (DateTime)
   - `notes` (String, Optional)
   - `createdAt` (DateTime)
   - `updatedAt` (DateTime)

### Indexes
- `userId` - Fast user-specific queries
- `type` - Filter by transaction type
- `date` - Date range queries
- `userId + type` - Combined filtering
- `userId + date` - User date range queries

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `@prisma/client` - Prisma client
- `prisma` - Prisma CLI (dev dependency)
- `bcryptjs` - Password hashing
- `next-auth` - Authentication
- `zod` - Schema validation

### 2. Setup PostgreSQL Database

#### Option A: Local PostgreSQL

Install PostgreSQL:
```bash
# macOS
brew install postgresql@15
brew services start postgresql@15

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

Create database:
```bash
psql postgres
CREATE DATABASE finance_tracker;
CREATE USER finance_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE finance_tracker TO finance_user;
\q
```

#### Option B: Docker

```bash
docker run --name finance-postgres \
  -e POSTGRES_DB=finance_tracker \
  -e POSTGRES_USER=finance_user \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -d postgres:15
```

#### Option C: Cloud Database (Recommended for Production)

Use services like:
- **Supabase** (Free tier available)
- **Railway** (Free tier available)
- **Neon** (Serverless Postgres)
- **AWS RDS**
- **Google Cloud SQL**

### 3. Configure Environment Variables

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
# Database
DATABASE_URL="postgresql://finance_user:your_password@localhost:5432/finance_tracker?schema=public"

# NextAuth (generate secret with: openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"

# App
NODE_ENV="development"
```

### 4. Run Database Migrations

```bash
# Push schema to database (for development)
npm run db:push

# Or create and run migrations (for production)
npm run db:migrate
```

### 5. Generate Prisma Client

```bash
npx prisma generate
```

This is automatically run after `npm install` via the `postinstall` script.

### 6. (Optional) Seed Database

Create `prisma/seed.ts`:
```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);
  
  const user = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      name: 'Demo User',
      password: hashedPassword,
    },
  });

  // Create sample transactions
  await prisma.transaction.createMany({
    data: [
      {
        userId: user.id,
        type: 'INCOME',
        category: 'salary',
        amount: 50000,
        date: new Date('2024-01-01'),
        notes: 'Monthly salary',
      },
      {
        userId: user.id,
        type: 'EXPENSE',
        category: 'food',
        amount: 5000,
        date: new Date('2024-01-05'),
        notes: 'Groceries',
      },
      {
        userId: user.id,
        type: 'INVESTMENT',
        category: 'stocks',
        amount: 10000,
        date: new Date('2024-01-10'),
        notes: 'Tech stocks',
      },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Run seed:
```bash
npx prisma db seed
```

### 7. View Database (Optional)

```bash
npm run db:studio
```

Opens Prisma Studio at http://localhost:5555

## API Endpoints

### Transactions

#### GET /api/transactions
Get all transactions for a user

Query Parameters:
- `userId` (required)
- `type` (optional): INCOME | EXPENSE | INVESTMENT
- `category` (optional)
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string

Example:
```bash
curl "http://localhost:3000/api/transactions?userId=user123&type=INCOME"
```

#### POST /api/transactions
Create a new transaction

Body:
```json
{
  "userId": "user123",
  "type": "INCOME",
  "category": "salary",
  "amount": 50000,
  "date": "2024-01-01T00:00:00Z",
  "notes": "Monthly salary"
}
```

#### GET /api/transactions/[id]
Get a single transaction

#### PATCH /api/transactions/[id]
Update a transaction

Body (all fields optional):
```json
{
  "amount": 55000,
  "notes": "Updated salary"
}
```

#### DELETE /api/transactions/[id]
Delete a transaction

## Database Migrations

### Create Migration
```bash
npx prisma migrate dev --name description_of_changes
```

### Apply Migrations (Production)
```bash
npx prisma migrate deploy
```

### Reset Database
```bash
npx prisma migrate reset
```

## Troubleshooting

### Connection Issues

1. Check PostgreSQL is running:
```bash
# macOS/Linux
pg_isready

# Or check process
ps aux | grep postgres
```

2. Verify DATABASE_URL in `.env`

3. Test connection:
```bash
npx prisma db pull
```

### Migration Errors

1. Reset database:
```bash
npx prisma migrate reset
```

2. Push schema:
```bash
npx prisma db push
```

### Prisma Client Issues

1. Regenerate client:
```bash
npx prisma generate
```

2. Clear node_modules:
```bash
rm -rf node_modules .next
npm install
```

## Production Deployment

### Environment Variables

Set in your hosting platform:
- `DATABASE_URL` - Production database URL
- `NEXTAUTH_URL` - Production URL
- `NEXTAUTH_SECRET` - Strong secret key
- `NODE_ENV=production`

### Database Setup

1. Create production database
2. Run migrations:
```bash
npx prisma migrate deploy
```

### Hosting Options

- **Vercel** - Automatic Next.js deployment
- **Railway** - Database + App hosting
- **AWS** - EC2 + RDS
- **Google Cloud** - Cloud Run + Cloud SQL
- **DigitalOcean** - App Platform

## Security Best Practices

1. **Never commit `.env` file**
2. **Use strong passwords** for database
3. **Enable SSL** for database connections in production
4. **Implement rate limiting** on API routes
5. **Validate all inputs** with Zod schemas
6. **Use prepared statements** (Prisma does this automatically)
7. **Implement authentication** before deploying
8. **Regular backups** of database

## Performance Optimization

1. **Use indexes** - Already configured in schema
2. **Pagination** - Implement for large datasets
3. **Caching** - Use Redis for frequently accessed data
4. **Connection pooling** - Configure in DATABASE_URL
5. **Query optimization** - Use Prisma's `select` and `include`

## Monitoring

1. **Prisma Metrics** - Enable in production
2. **Database monitoring** - Use pg_stat_statements
3. **Error tracking** - Sentry or similar
4. **Performance monitoring** - New Relic or DataDog

## Next Steps

1. Install dependencies: `npm install`
2. Setup database (local or cloud)
3. Configure `.env` file
4. Run migrations: `npm run db:push`
5. Start development: `npm run dev`
6. Test API endpoints
7. Integrate with frontend

## Support

For issues:
1. Check Prisma docs: https://www.prisma.io/docs
2. PostgreSQL docs: https://www.postgresql.org/docs/
3. Next.js API routes: https://nextjs.org/docs/api-routes/introduction
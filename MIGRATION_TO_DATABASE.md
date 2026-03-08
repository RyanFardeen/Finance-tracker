# Migration from LocalStorage to Database

## Current Situation

✅ **Authentication is working** - You can sign in with Google
✅ **Database tables are created** - All tables exist in Neon
✅ **API endpoints are ready** - All transaction APIs are protected and working

❌ **Frontend still uses LocalStorage** - Pages read from browser storage instead of database

## Why Data Doesn't Sync

Currently, the application stores data in **LocalStorage** (browser storage):
- Each browser has its own LocalStorage
- Incognito mode has separate LocalStorage
- Data is not shared between devices or browsers
- Data is lost if you clear browser data

**This is why you see empty data in incognito mode** - it's a different LocalStorage instance.

## What Needs to Be Done

All frontend pages need to be updated to:
1. Fetch data from the API instead of LocalStorage
2. Use the authenticated user's session
3. Send API requests to create/update/delete transactions

## Files That Need Updates

### Pages Using LocalStorage:
1. `app/page.tsx` - Dashboard (line 28: `storage.getTransactions()`)
2. `app/income/page.tsx` - Income tracker
3. `app/expenses/page.tsx` - Expense tracker
4. `app/investments/page.tsx` - Investment tracker
5. `app/transactions/page.tsx` - Transaction history
6. `app/analytics/page.tsx` - Analytics dashboard
7. `app/reports/monthly/page.tsx` - Monthly reports
8. `app/reports/yearly/page.tsx` - Yearly reports

## Migration Strategy

### Option 1: Quick Fix (Recommended for Testing)

Keep LocalStorage for now and test authentication separately. This allows you to:
- Verify authentication works correctly
- Test Google OAuth flow
- Ensure database tables are created
- Test API endpoints manually

### Option 2: Full Migration (Production Ready)

Update all pages to use the API. This requires:

1. **Create API client utility**
2. **Update each page to fetch from API**
3. **Add loading states**
4. **Handle errors**
5. **Migrate existing LocalStorage data to database**

## Example: How to Update Dashboard

### Current Code (LocalStorage):
```typescript
useEffect(() => {
  const data = storage.getTransactions();
  setTransactions(data);
  setSummary(calculations.getFinancialSummary(data));
}, []);
```

### Updated Code (API):
```typescript
useEffect(() => {
  async function fetchTransactions() {
    try {
      const response = await fetch('/api/transactions');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
        setSummary(calculations.getFinancialSummary(data));
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  }
  fetchTransactions();
}, []);
```

## Step-by-Step Migration Guide

### Step 1: Create API Client Utility

Create `lib/api-client.ts`:

```typescript
export const apiClient = {
  async getTransactions(filters?: {
    type?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const response = await fetch(`/api/transactions?${params}`);
    if (!response.ok) throw new Error('Failed to fetch transactions');
    return response.json();
  },

  async createTransaction(data: {
    type: 'INCOME' | 'EXPENSE' | 'INVESTMENT';
    category: string;
    amount: number;
    date: string;
    notes?: string;
  }) {
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create transaction');
    return response.json();
  },

  async updateTransaction(id: string, data: Partial<{
    type: 'INCOME' | 'EXPENSE' | 'INVESTMENT';
    category: string;
    amount: number;
    date: string;
    notes?: string;
  }>) {
    const response = await fetch(`/api/transactions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update transaction');
    return response.json();
  },

  async deleteTransaction(id: string) {
    const response = await fetch(`/api/transactions/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete transaction');
    return response.json();
  },
};
```

### Step 2: Update Dashboard (Example)

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import SidebarWrapper from '@/components/SidebarWrapper';
import { apiClient } from '@/lib/api-client';
import { calculations } from '@/lib/calculations';
import { Transaction, FinancialSummary } from '@/lib/types';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    totalSavings: 0,
    totalInvestments: 0,
    netWorth: 0,
  });

  useEffect(() => {
    async function fetchData() {
      if (status === 'authenticated') {
        try {
          const data = await apiClient.getTransactions();
          setTransactions(data);
          setSummary(calculations.getFinancialSummary(data));
        } catch (error) {
          console.error('Failed to fetch transactions:', error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchData();
  }, [status]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Rest of the component...
}
```

### Step 3: Update Income Page

Similar pattern - replace `storage.getTransactions()` with `apiClient.getTransactions({ type: 'INCOME' })`

### Step 4: Update Expense Page

Replace `storage.addTransaction()` with `apiClient.createTransaction()`

### Step 5: Update All Other Pages

Follow the same pattern for all pages.

## Migration Checklist

- [ ] Create `lib/api-client.ts` utility
- [ ] Update `app/page.tsx` (Dashboard)
- [ ] Update `app/income/page.tsx`
- [ ] Update `app/expenses/page.tsx`
- [ ] Update `app/investments/page.tsx`
- [ ] Update `app/transactions/page.tsx`
- [ ] Update `app/analytics/page.tsx`
- [ ] Update `app/reports/monthly/page.tsx`
- [ ] Update `app/reports/yearly/page.tsx`
- [ ] Add loading states to all pages
- [ ] Add error handling to all pages
- [ ] Test all CRUD operations
- [ ] Test with multiple users
- [ ] Verify data isolation between users

## Testing After Migration

1. **Sign in with Google**
2. **Add some transactions** (income, expenses, investments)
3. **Sign out and sign in again** - data should persist
4. **Open in incognito mode** - sign in with same account, data should be there
5. **Sign in with different account** - should see empty data (different user)

## Benefits After Migration

✅ **Data syncs across devices** - Access from any browser
✅ **Data persists** - Not lost when clearing browser data
✅ **Multi-user support** - Each user has their own data
✅ **Secure** - Data is protected by authentication
✅ **Scalable** - Can handle large amounts of data
✅ **Backup** - Data is stored in cloud database

## Current Status

- ✅ Authentication working
- ✅ Database ready
- ✅ API endpoints ready
- ❌ Frontend still using LocalStorage
- ❌ Data not syncing between sessions

## Recommendation

**For now, you can continue testing with LocalStorage** to verify:
- Authentication flow works
- Google OAuth works
- Database tables are created
- API endpoints are accessible

**When ready for production**, migrate all pages to use the API following the guide above.

## Need Help with Migration?

The migration is straightforward but requires updating each page. If you'd like me to:
1. Create the API client utility
2. Update all pages to use the API
3. Add loading and error states
4. Test the migration

Let me know and I can help with the complete migration!

---

**Current Behavior**: Data stored in browser (LocalStorage)
**After Migration**: Data stored in database (PostgreSQL)
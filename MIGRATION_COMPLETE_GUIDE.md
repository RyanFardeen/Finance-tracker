# Complete Migration Guide - All Pages Updated

## ✅ Completed Migrations

1. **Dashboard** (`app/page.tsx`) - ✅ Migrated
2. **Income Page** (`app/income/page.tsx`) - ✅ Migrated

## 📋 Remaining Pages to Migrate

The following pages still use LocalStorage and need to be updated to use the API:

### 3. Expenses Page (`app/expenses/page.tsx`)
### 4. Investments Page (`app/investments/page.tsx`)
### 5. Transactions Page (`app/transactions/page.tsx`)
### 6. Analytics Page (`app/analytics/page.tsx`)
### 7. Monthly Reports (`app/reports/monthly/page.tsx`)
### 8. Yearly Reports (`app/reports/yearly/page.tsx`)

## 🔄 Migration Pattern

All pages follow the same pattern. Here's what needs to change:

### Step 1: Update Imports

**Remove:**
```typescript
import { storage } from '@/lib/storage';
```

**Add:**
```typescript
import { useSession } from 'next-auth/react';
import { apiClient } from '@/lib/api-client';
import { Loader2 } from 'lucide-react';
```

### Step 2: Add State Management

**Add these state variables:**
```typescript
const { data: session, status } = useSession();
const [loading, setLoading] = useState(true);
const [submitting, setSubmitting] = useState(false);
const [error, setError] = useState<string | null>(null);
```

### Step 3: Update Data Fetching

**Replace:**
```typescript
const data = storage.getTransactions();
setTransactions(data);
```

**With:**
```typescript
useEffect(() => {
  async function fetchData() {
    if (status === 'authenticated') {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getTransactions({ type: 'EXPENSE' }); // or INCOME, INVESTMENT
        setTransactions(data);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  }
  fetchData();
}, [status]);
```

### Step 4: Update Create/Add Operations

**Replace:**
```typescript
storage.addTransaction({
  type: 'expense',
  category: formData.category,
  amount: parseFloat(formData.amount),
  date: formData.date,
  notes: formData.notes,
});
```

**With:**
```typescript
try {
  setSubmitting(true);
  await apiClient.createTransaction({
    type: 'EXPENSE',
    category: formData.category,
    amount: parseFloat(formData.amount),
    date: new Date(formData.date).toISOString(),
    notes: formData.notes || undefined,
  });
  await loadTransactions();
  resetForm();
} catch (err: any) {
  setError(err.message || 'Failed to save. Please try again.');
} finally {
  setSubmitting(false);
}
```

### Step 5: Update Edit/Update Operations

**Replace:**
```typescript
storage.updateTransaction(editingId, {
  category: formData.category,
  amount: parseFloat(formData.amount),
  date: formData.date,
  notes: formData.notes,
});
```

**With:**
```typescript
try {
  setSubmitting(true);
  await apiClient.updateTransaction(editingId, {
    type: 'EXPENSE',
    category: formData.category,
    amount: parseFloat(formData.amount),
    date: new Date(formData.date).toISOString(),
    notes: formData.notes || undefined,
  });
  await loadTransactions();
  resetForm();
} catch (err: any) {
  setError(err.message || 'Failed to update. Please try again.');
} finally {
  setSubmitting(false);
}
```

### Step 6: Update Delete Operations

**Replace:**
```typescript
storage.deleteTransaction(id);
loadTransactions();
```

**With:**
```typescript
try {
  await apiClient.deleteTransaction(id);
  await loadTransactions();
} catch (err: any) {
  setError(err.message || 'Failed to delete. Please try again.');
}
```

### Step 7: Add Loading State UI

**Add before the main return:**
```typescript
if (loading) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <SidebarWrapper />
      <main className="flex-1 ml-64 p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading data...</p>
        </div>
      </main>
    </div>
  );
}
```

### Step 8: Add Error Display

**Add after header in main content:**
```typescript
{error && (
  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
    {error}
  </div>
)}
```

### Step 9: Update Form Buttons

**Add disabled state to submit buttons:**
```typescript
<button
  type="submit"
  disabled={submitting}
  className="... disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
>
  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
  {editingId ? 'Update' : 'Add'}
</button>
```

## 🎯 Quick Reference for Each Page

### Expenses Page
- Filter type: `{ type: 'EXPENSE' }`
- Transaction type: `'EXPENSE'`
- Color scheme: Red (already in place)

### Investments Page
- Filter type: `{ type: 'INVESTMENT' }`
- Transaction type: `'INVESTMENT'`
- Color scheme: Purple (already in place)

### Transactions Page
- Filter type: No filter (gets all types)
- Needs to handle all three types: INCOME, EXPENSE, INVESTMENT
- Add type filter dropdown if not present

### Analytics Page
- Filter type: No filter (gets all types)
- Read-only page, no create/update/delete
- Just needs data fetching update

### Monthly Reports Page
- Filter type: No filter (gets all types)
- Add date range filter: `{ startDate, endDate }`
- Read-only page

### Yearly Reports Page
- Filter type: No filter (gets all types)
- Add year filter: `{ startDate, endDate }`
- Read-only page

## 🔍 Type Mapping

The database uses uppercase enum values, but the frontend may use lowercase:

```typescript
// Frontend (old) → Database (new)
'income' → 'INCOME'
'expense' → 'EXPENSE'
'investment' → 'INVESTMENT'
```

When displaying, convert back to lowercase:
```typescript
const transactionType = transaction.type.toLowerCase();
```

## ✅ Testing Checklist

After migrating each page:

- [ ] Page loads without errors
- [ ] Data fetches from API
- [ ] Loading state displays correctly
- [ ] Can create new transactions
- [ ] Can edit existing transactions
- [ ] Can delete transactions
- [ ] Error messages display properly
- [ ] Form validation works
- [ ] Data persists after page refresh
- [ ] Data syncs across browser tabs
- [ ] Data syncs in incognito mode (same account)

## 🚀 Quick Migration Steps

For each remaining page:

1. Open the file
2. Follow steps 1-9 above
3. Test the page
4. Move to next page

## 📝 Example: Complete Expenses Page Migration

See `app/income/page.tsx` as a reference - it's been fully migrated and can be used as a template for the other pages.

## 🎉 Benefits After Complete Migration

Once all pages are migrated:

✅ **Data syncs everywhere** - Same data across all devices and browsers
✅ **No data loss** - Data stored securely in PostgreSQL
✅ **Multi-user ready** - Each user has their own isolated data
✅ **Production ready** - Scalable and secure
✅ **Real-time updates** - Changes reflect immediately
✅ **Backup & recovery** - Database backups available

## 📊 Migration Progress

- [x] Dashboard
- [x] Income Page
- [ ] Expenses Page
- [ ] Investments Page
- [ ] Transactions Page
- [ ] Analytics Page
- [ ] Monthly Reports
- [ ] Yearly Reports

---

**Current Status**: 2/8 pages migrated (25% complete)

**Estimated Time**: ~15-20 minutes per page = 1.5-2 hours total for remaining pages

**Priority Order**:
1. Expenses (most used)
2. Investments (most used)
3. Transactions (view all)
4. Analytics (dashboard)
5. Monthly Reports (reporting)
6. Yearly Reports (reporting)
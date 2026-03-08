# Apply Bug Fixes to Expenses and Investments Pages

## Changes to Apply

### 1. Import formatters (Line 1-8)
Replace:
```typescript
import { Plus, Trash2, Edit2, Loader2 } from 'lucide-react';
```

With:
```typescript
import { formatCurrency, formatCategory, formatDate, validateAmount, sanitizeAmount } from '@/lib/formatters';
import { Plus, Trash2, Edit2, Loader2 } from 'lucide-react';
```

### 2. Update handleSubmit function (around line 51-78)
Add validation before creating transaction:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitting(true);
  setError(null);
  
  try {
    // Validate amount
    const amount = parseFloat(formData.amount);
    const validationError = validateAmount(amount);
    if (validationError) {
      setError(validationError);
      setSubmitting(false);
      return;
    }

    // Sanitize amount (round to 2 decimals, enforce max)
    const sanitizedAmount = sanitizeAmount(amount);
    if (sanitizedAmount === null) {
      setError('Invalid amount');
      setSubmitting(false);
      return;
    }

    const transactionData = {
      type: 'EXPENSE' as const, // or 'INVESTMENT'
      category: formData.category,
      amount: sanitizedAmount,
      date: new Date(formData.date).toISOString(),
      notes: formData.notes.trim() || undefined,
    };

    if (editingId) {
      await apiClient.updateTransaction(editingId, transactionData);
    } else {
      await apiClient.createTransaction(transactionData);
    }

    resetForm();
    await loadTransactions();
  } catch (err: any) {
    console.error('Failed to save:', err);
    setError(err.message || 'Failed to save. Please try again.');
  } finally {
    setSubmitting(false);
  }
};
```

### 3. Replace formatCurrency function (around line 114-120)
Replace:
```typescript
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};
```

With:
```typescript
const formatAmount = (amount: number, compact: boolean = false) => {
  return formatCurrency(amount, compact);
};
```

### 4. Update total display (around line 173)
Replace:
```typescript
<p className="text-white text-3xl sm:text-4xl font-bold">{formatCurrency(totalExpenses)}</p>
```

With:
```typescript
<p className="text-white text-3xl sm:text-4xl font-bold truncate" title={formatAmount(totalExpenses, false)}>
  {formatAmount(totalExpenses, true)}
</p>
```

### 5. Update amount input field (around line 209-219)
Replace:
```typescript
<input
  type="number"
  value={formData.amount}
  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
  className="..."
  placeholder="0"
  min="0"
  step="0.01"
  required
  disabled={submitting}
/>
```

With:
```typescript
<input
  type="number"
  value={formData.amount}
  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
  className="..."
  placeholder="0"
  min="0"
  max="999999999999"
  step="0.01"
  required
  disabled={submitting}
/>
<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
  Maximum: ₹999,999,999,999
</p>
```

### 6. Update notes input field (around line 238-246)
Replace:
```typescript
<input
  type="text"
  value={formData.notes}
  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
  className="..."
  placeholder="Optional notes"
  disabled={submitting}
/>
```

With:
```typescript
<input
  type="text"
  value={formData.notes}
  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
  className="..."
  placeholder="Optional notes"
  maxLength={500}
  disabled={submitting}
/>
<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
  {formData.notes.length}/500 characters
</p>
```

### 7. Update transaction list display (around line 289-298)
Replace:
```typescript
<span className="... capitalize">
  {transaction.category.replace('_', ' ')}
</span>
<span className="...">
  {new Date(transaction.date).toLocaleDateString('en-IN', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  })}
</span>
```

With:
```typescript
<span className="...">
  {formatCategory(transaction.category)}
</span>
<span className="...">
  {formatDate(transaction.date, 'medium')}
</span>
```

### 8. Update amount display in list (around line 307-309)
Replace:
```typescript
<span className="text-lg sm:text-xl font-bold text-red-600 dark:text-red-400">
  {formatCurrency(transaction.amount)}
</span>
```

With:
```typescript
<span className="text-lg sm:text-xl font-bold text-red-600 dark:text-red-400 truncate" title={formatAmount(transaction.amount, false)}>
  {formatAmount(transaction.amount, true)}
</span>
```

## Summary of Fixes

1. ✅ Smart number formatting with K, M, B suffixes
2. ✅ Input validation (max value, decimal places)
3. ✅ Amount sanitization (round to 2 decimals)
4. ✅ Notes character limit (500 chars)
5. ✅ Better category display (formatCategory)
6. ✅ Better date display (formatDate)
7. ✅ Truncate long numbers with tooltip
8. ✅ Trim whitespace from notes

## Testing Checklist

After applying fixes:
- [ ] Test with small amount (₹100)
- [ ] Test with large amount (₹10,000,000)
- [ ] Test with huge amount (₹1,000,000,000)
- [ ] Test with decimal (₹1000.50)
- [ ] Test with > 2 decimals (should round)
- [ ] Test with negative (should show error)
- [ ] Test with zero (should show error)
- [ ] Test with > max (should cap at max)
- [ ] Test notes with 500+ chars (should limit)
- [ ] Test category display with underscores
- [ ] Verify truncation works on mobile
- [ ] Verify tooltip shows full amount
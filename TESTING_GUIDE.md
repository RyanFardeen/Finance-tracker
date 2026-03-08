# Testing Guide - Personal Finance Tracker

## 🎯 Bug Fixes Applied

### 1. Large Number Display Bug ✅
**Issue**: When entering huge values (e.g., 1,000,000,000+), numbers would overflow or display incorrectly.

**Fix Applied**:
- Created smart currency formatter with K, M, B, T suffixes
- Added `formatCurrency(amount, compact)` function
- Numbers > 100K display as compact (e.g., ₹1.5M)
- Hover shows full amount in tooltip
- Maximum value: ₹999,999,999,999 (999 billion)

**Files Modified**:
- `lib/formatters.ts` - New utility file
- `app/page.tsx` - Dashboard
- `app/income/page.tsx` - Income page
- `app/expenses/page.tsx` - Expenses page
- `app/investments/page.tsx` - Investments page

### 2. Input Validation ✅
**Added**:
- Amount validation (min: 0, max: 999,999,999,999)
- Decimal places validation (max 2 decimals)
- Notes character limit (500 characters)
- Real-time character counter
- Clear error messages

### 3. Better Formatting ✅
**Improvements**:
- Category names: `mutual_funds` → `Mutual Funds`
- Dates: Consistent format using `formatDate()`
- Text truncation with `line-clamp-2` for long notes
- Overflow handling with `truncate` class

## 📋 Testing Checklist

### A. Large Number Testing

#### Test Case 1: Small Amount
```
Amount: ₹100
Expected Display: ₹100
Expected Compact: ₹100
Status: [ ]
```

#### Test Case 2: Medium Amount
```
Amount: ₹50,000
Expected Display: ₹50,000
Expected Compact: ₹50,000
Status: [ ]
```

#### Test Case 3: Large Amount (Thousands)
```
Amount: ₹150,000
Expected Display: ₹1,50,000
Expected Compact: ₹150K
Status: [ ]
```

#### Test Case 4: Million
```
Amount: ₹1,500,000
Expected Display: ₹15,00,000
Expected Compact: ₹1.50M
Status: [ ]
```

#### Test Case 5: Billion
```
Amount: ₹1,000,000,000
Expected Display: ₹1,00,00,00,000
Expected Compact: ₹1.00B
Status: [ ]
```

#### Test Case 6: Maximum Value
```
Amount: ₹999,999,999,999
Expected Display: ₹99,99,99,99,999
Expected Compact: ₹1000.00B or ₹1.00T
Status: [ ]
```

#### Test Case 7: Over Maximum
```
Amount: ₹1,000,000,000,000
Expected: Capped at ₹999,999,999,999
Error Message: "Amount is too large (max: ₹999,999,999,999)"
Status: [ ]
```

### B. Validation Testing

#### Test Case 8: Negative Amount
```
Amount: -100
Expected: Error message "Amount cannot be negative"
Status: [ ]
```

#### Test Case 9: Zero Amount
```
Amount: 0
Expected: Error message "Amount must be greater than zero"
Status: [ ]
```

#### Test Case 10: Too Many Decimals
```
Amount: 100.123
Expected: Rounded to 100.12
Status: [ ]
```

#### Test Case 11: Invalid Input
```
Amount: "abc"
Expected: Error message "Please enter a valid number"
Status: [ ]
```

#### Test Case 12: Notes Character Limit
```
Notes: 501 characters
Expected: Limited to 500 characters
Counter shows: 500/500
Status: [ ]
```

### C. Display Testing

#### Test Case 13: Category Formatting
```
Input: "mutual_funds"
Expected Display: "Mutual Funds"
Status: [ ]
```

#### Test Case 14: Date Formatting
```
Input: "2024-03-08"
Expected Display: "8 Mar 2024"
Status: [ ]
```

#### Test Case 15: Long Notes Truncation
```
Notes: 200 characters
Expected: Shows 2 lines with ellipsis
Full text visible on hover
Status: [ ]
```

#### Test Case 16: Tooltip on Large Numbers
```
Display: ₹1.50M
Hover: Shows "₹1,500,000"
Status: [ ]
```

### D. CRUD Operations

#### Test Case 17: Create Income
```
1. Go to Income page
2. Click "Add Income"
3. Fill form with ₹10,000,000
4. Submit
Expected: Shows as ₹10.00M in list
Status: [ ]
```

#### Test Case 18: Edit Expense
```
1. Go to Expenses page
2. Click edit on existing expense
3. Change amount to ₹5,000,000
4. Update
Expected: Shows as ₹5.00M in list
Status: [ ]
```

#### Test Case 19: Delete Investment
```
1. Go to Investments page
2. Click delete on entry
3. Confirm deletion
Expected: Entry removed, total updated
Status: [ ]
```

#### Test Case 20: Dashboard Totals
```
Add: ₹10M income, ₹3M expense, ₹2M investment
Expected Dashboard:
- Total Income: ₹10.00M
- Total Expenses: ₹3.00M
- Total Savings: ₹7.00M
- Total Investments: ₹2.00M
- Net Worth: ₹9.00M
Status: [ ]
```

### E. Mobile Responsiveness

#### Test Case 21: Mobile Layout (< 640px)
```
1. Resize to 375px width
2. Check hamburger menu works
3. Check forms are usable
4. Check numbers don't overflow
Expected: All elements fit, no horizontal scroll
Status: [ ]
```

#### Test Case 22: Tablet Layout (640px - 1024px)
```
1. Resize to 768px width
2. Check 2-column grids
3. Check sidebar behavior
Expected: Proper 2-column layout
Status: [ ]
```

#### Test Case 23: Desktop Layout (> 1024px)
```
1. Resize to 1920px width
2. Check 4-column grids
3. Check sidebar always visible
Expected: Proper 4-column layout
Status: [ ]
```

### F. Edge Cases

#### Test Case 24: Empty State
```
1. New user with no transactions
Expected: Shows "No transactions yet" message
Status: [ ]
```

#### Test Case 25: Single Transaction
```
1. Add one income of ₹1B
Expected: Dashboard shows ₹1.00B correctly
Status: [ ]
```

#### Test Case 26: Mixed Large Numbers
```
Add:
- Income: ₹500M
- Expense: ₹100M
- Investment: ₹200M
Expected:
- Savings: ₹400M
- Net Worth: ₹600M
All display correctly
Status: [ ]
```

#### Test Case 27: Decimal Precision
```
Amount: ₹1000.50
Expected: Saved as 1000.50
Display: ₹1,000.50 or ₹1.00K
Status: [ ]
```

#### Test Case 28: Special Characters in Notes
```
Notes: "Test @#$%^&* special chars"
Expected: Saved and displayed correctly
Status: [ ]
```

#### Test Case 29: Very Long Category Name
```
Category: "mutual_funds"
Expected: "Mutual Funds" (properly formatted)
Status: [ ]
```

#### Test Case 30: Future Date
```
Date: Tomorrow's date
Expected: Accepted and saved
Status: [ ]
```

### G. Performance Testing

#### Test Case 31: 100 Transactions
```
1. Add 100 transactions
2. Check page load time
3. Check dashboard calculations
Expected: < 2 seconds load time
Status: [ ]
```

#### Test Case 32: 1000 Transactions
```
1. Add 1000 transactions
2. Check page load time
3. Check list scrolling
Expected: < 5 seconds load time
Status: [ ]
```

### H. Dark Mode Testing

#### Test Case 33: Toggle Dark Mode
```
1. Toggle dark mode on
2. Check all pages
3. Check number visibility
Expected: All text readable, proper contrast
Status: [ ]
```

#### Test Case 34: Dark Mode Persistence
```
1. Enable dark mode
2. Refresh page
3. Navigate to different pages
Expected: Dark mode persists
Status: [ ]
```

### I. Authentication Testing

#### Test Case 35: Session Persistence
```
1. Sign in
2. Add transactions
3. Close browser
4. Reopen and sign in
Expected: All data still there
Status: [ ]
```

#### Test Case 36: Multiple Devices
```
1. Sign in on Device A
2. Add transaction
3. Sign in on Device B
Expected: Transaction visible on Device B
Status: [ ]
```

## 🐛 Known Issues & Limitations

1. **Number Precision**: Float type has ~15-17 significant digits
2. **No Rate Limiting**: API has no rate limiting
3. **No Optimistic Locking**: Concurrent edits not handled
4. **No Undo**: Deleted transactions cannot be recovered
5. **No Bulk Operations**: Cannot delete/edit multiple at once

## ✅ Testing Results Summary

| Category | Total Tests | Passed | Failed | Pending |
|----------|-------------|--------|--------|---------|
| Large Numbers | 7 | - | - | 7 |
| Validation | 5 | - | - | 5 |
| Display | 4 | - | - | 4 |
| CRUD | 4 | - | - | 4 |
| Mobile | 3 | - | - | 3 |
| Edge Cases | 7 | - | - | 7 |
| Performance | 2 | - | - | 2 |
| Dark Mode | 2 | - | - | 2 |
| Auth | 2 | - | - | 2 |
| **TOTAL** | **36** | **0** | **0** | **36** |

## 📝 How to Test

### Quick Test (5 minutes)
1. Test large number input (₹1,000,000,000)
2. Test validation (negative, zero, over max)
3. Test mobile view (resize browser)
4. Test dark mode toggle
5. Test CRUD operations

### Full Test (30 minutes)
1. Run all 36 test cases
2. Document results
3. Take screenshots of issues
4. Report bugs with steps to reproduce

### Automated Testing (Future)
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 🔧 Debugging Tips

### If numbers don't display correctly:
1. Check browser console for errors
2. Verify `formatCurrency()` is imported
3. Check if `compact` parameter is passed correctly

### If validation doesn't work:
1. Check `validateAmount()` function
2. Verify error state is set
3. Check form submission handler

### If mobile layout breaks:
1. Check Tailwind breakpoints (sm:, md:, lg:)
2. Verify responsive classes are applied
3. Test in actual mobile device, not just browser resize

## 📊 Test Data Suggestions

### Small Business Owner
```
Income: ₹50,000/month (salary)
Expenses: ₹30,000/month (rent, food, bills)
Investments: ₹10,000/month (mutual funds)
```

### High Earner
```
Income: ₹5,000,000/month (business)
Expenses: ₹1,000,000/month (lifestyle)
Investments: ₹2,000,000/month (stocks, real estate)
```

### Student
```
Income: ₹10,000/month (part-time)
Expenses: ₹8,000/month (food, transport)
Investments: ₹1,000/month (savings)
```

## 🎉 Success Criteria

✅ All large numbers display correctly with K/M/B suffixes
✅ Input validation prevents invalid data
✅ Mobile layout works on all screen sizes
✅ Dark mode works properly
✅ CRUD operations work without errors
✅ Dashboard calculations are accurate
✅ No console errors
✅ Page load time < 3 seconds
✅ Data persists across sessions
✅ Authentication works correctly

---

**Last Updated**: 2026-03-08
**Version**: 1.0
**Status**: Ready for Testing
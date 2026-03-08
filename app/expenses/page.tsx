'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import SidebarWrapper from '@/components/SidebarWrapper';
import { apiClient } from '@/lib/api-client';
import { Transaction, ExpenseCategory } from '@/lib/types';
import { formatCurrency, formatCategory, formatDate, validateAmount, sanitizeAmount } from '@/lib/formatters';
import { Plus, Trash2, Edit2, Loader2 } from 'lucide-react';

const expenseCategories: ExpenseCategory[] = [
  'food', 'rent', 'travel', 'shopping', 'bills', 'entertainment', 'healthcare', 'education', 'other'
];

export default function ExpensesPage() {
  const { data: session, status } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category: 'food' as ExpenseCategory,
    amount: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    loadTransactions();
  }, [status]);

  const loadTransactions = async () => {
    if (status === 'authenticated') {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getTransactions({ type: 'EXPENSE' });
        setTransactions(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } catch (err) {
        console.error('Failed to fetch expense transactions:', err);
        setError('Failed to load expense data. Please try again.');
      } finally {
        setLoading(false);
      }
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  };

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
        type: 'EXPENSE' as const,
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
      console.error('Failed to save expense:', err);
      setError(err.message || 'Failed to save expense. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setFormData({
      category: transaction.category as ExpenseCategory,
      amount: transaction.amount.toString(),
      date: new Date(transaction.date).toISOString().split('T')[0],
      notes: transaction.notes || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this expense entry?')) {
      try {
        setError(null);
        await apiClient.deleteTransaction(id);
        await loadTransactions();
      } catch (err: any) {
        console.error('Failed to delete expense:', err);
        setError(err.message || 'Failed to delete expense. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      category: 'food',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const formatAmount = (amount: number, compact: boolean = false) => {
    return formatCurrency(amount, compact);
  };

  const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
        <SidebarWrapper />
        <main className="flex-1 ml-64 p-8 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading expense data...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <SidebarWrapper />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Expense Tracker
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track all your expenses
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus size={20} />
              Add Expense
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Total Expenses Card */}
          <div className="bg-gradient-to-r from-red-500 to-red-700 rounded-xl p-8 shadow-lg mb-8">
            <h2 className="text-white text-lg font-medium mb-2">Total Expenses</h2>
            <p className="text-white text-4xl font-bold truncate" title={formatAmount(totalExpenses, false)}>
              {formatAmount(totalExpenses, true)}
            </p>
            <p className="text-red-100 text-sm mt-2">
              {transactions.length} expense entries
            </p>
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {editingId ? 'Edit Expense' : 'Add New Expense'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                      disabled={submitting}
                    >
                      {expenseCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Notes
                    </label>
                    <input
                      type="text"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Optional notes"
                      maxLength={500}
                      disabled={submitting}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formData.notes.length}/500 characters
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingId ? 'Update' : 'Add'} Expense
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={submitting}
                    className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Transactions List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Expense History
              </h3>
            </div>
            {transactions.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No expense entries yet. Click "Add Expense" to get started!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm font-medium">
                          {formatCategory(transaction.category)}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(transaction.date, 'medium')}
                        </span>
                      </div>
                      {transaction.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {transaction.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-red-600 dark:text-red-400 truncate" title={formatAmount(transaction.amount, false)}>
                        {formatAmount(transaction.amount, true)}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Made with Bob

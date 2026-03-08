'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import SidebarWrapper from '@/components/SidebarWrapper';
import { apiClient } from '@/lib/api-client';
import { Transaction, InvestmentCategory } from '@/lib/types';
import { formatCurrency, formatCategory, formatDate, validateAmount, sanitizeAmount } from '@/lib/formatters';
import { TrendingUp, Trash2, Edit2, Loader2 } from 'lucide-react';

const investmentCategories: InvestmentCategory[] = [
  'stocks', 'mutual_funds', 'gold', 'real_estate', 'fixed_deposits', 'crypto', 'other'
];

export default function InvestmentsPage() {
  const { data: session, status } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category: 'stocks' as InvestmentCategory,
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
        const data = await apiClient.getTransactions({ type: 'INVESTMENT' });
        setTransactions(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } catch (err) {
        console.error('Failed to fetch investment transactions:', err);
        setError('Failed to load investment data. Please try again.');
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
      const amount = parseFloat(formData.amount);
      const validationError = validateAmount(amount);
      if (validationError) {
        setError(validationError);
        setSubmitting(false);
        return;
      }

      const sanitizedAmount = sanitizeAmount(amount);
      if (sanitizedAmount === null) {
        setError('Invalid amount');
        setSubmitting(false);
        return;
      }

      const transactionData = {
        type: 'INVESTMENT' as const,
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
      console.error('Failed to save investment:', err);
      setError(err.message || 'Failed to save investment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setFormData({
      category: transaction.category as InvestmentCategory,
      amount: transaction.amount.toString(),
      date: new Date(transaction.date).toISOString().split('T')[0],
      notes: transaction.notes || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this investment entry?')) {
      try {
        setError(null);
        await apiClient.deleteTransaction(id);
        await loadTransactions();
      } catch (err: any) {
        console.error('Failed to delete investment:', err);
        setError(err.message || 'Failed to delete investment. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      category: 'stocks',
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

  const totalInvestments = transactions.reduce((sum, t) => sum + t.amount, 0);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <SidebarWrapper />
        <main className="flex-1 lg:ml-72 pt-16 lg:pt-0 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="absolute inset-0 blur-xl bg-purple-500/20 rounded-full animate-pulse" />
              <Loader2 className="relative w-16 h-16 animate-spin text-purple-600 mx-auto mb-4" />
            </div>
            <p className="text-lg font-medium text-gray-600 dark:text-gray-400 animate-pulse">Loading investment data...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <SidebarWrapper />
      
      <main className="flex-1 lg:ml-72 pt-16 lg:pt-0 p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 animate-in slide-in-from-top duration-500">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-600 dark:from-purple-400 dark:via-purple-500 dark:to-purple-400 bg-clip-text text-transparent mb-2">
                Investment Tracker
              </h1>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                Track all your investments
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 touch-manipulation"
            >
              <TrendingUp size={20} />
              Add Investment
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-6 py-4 rounded-xl mb-6 shadow-md animate-in slide-in-from-top duration-300">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Total Investments Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-2xl p-8 shadow-2xl mb-8 hover:shadow-3xl transition-all duration-300 hover:scale-[1.01] animate-in slide-in-from-bottom duration-500 delay-100">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <h2 className="text-white text-lg font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Total Investments
              </h2>
              <p className="text-white text-4xl sm:text-5xl font-bold truncate mb-2" title={formatAmount(totalInvestments, false)}>
                {formatAmount(totalInvestments, true)}
              </p>
              <p className="text-purple-100 text-sm font-medium">
                📈 {transactions.length} investment {transactions.length === 1 ? 'entry' : 'entries'}
              </p>
            </div>
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 mb-8 animate-in slide-in-from-top duration-300">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full" />
                {editingId ? 'Edit Investment' : 'Add New Investment'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as InvestmentCategory })}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all touch-manipulation"
                      required
                      disabled={submitting}
                    >
                      {investmentCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all touch-manipulation"
                      placeholder="0"
                      min="0"
                      max="999999999999"
                      step="0.01"
                      required
                      disabled={submitting}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                      Maximum: ₹999,999,999,999
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all touch-manipulation"
                      required
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Notes
                    </label>
                    <input
                      type="text"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all touch-manipulation"
                      placeholder="Optional notes"
                      maxLength={500}
                      disabled={submitting}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                      {formData.notes.length}/500 characters
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95 touch-manipulation"
                  >
                    {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                    {editingId ? 'Update' : 'Add'} Investment
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={submitting}
                    className="flex-1 sm:flex-none px-8 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 active:scale-95 touch-manipulation"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Transactions List */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in slide-in-from-bottom duration-500 delay-200">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full" />
                Investment History
              </h3>
            </div>
            {transactions.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp size={32} className="text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-base text-gray-500 dark:text-gray-400 font-medium">
                  No investment entries yet. Click "Add Investment" to get started!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {transactions.map((transaction, index) => (
                  <div 
                    key={transaction.id} 
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-transparent dark:hover:from-purple-900/10 dark:hover:to-transparent transition-all duration-200 group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold shadow-sm">
                          {formatCategory(transaction.category)}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                          {formatDate(transaction.date, 'medium')}
                        </span>
                      </div>
                      {transaction.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {transaction.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <span className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400 truncate" title={formatAmount(transaction.amount, false)}>
                        {formatAmount(transaction.amount, true)}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="p-2.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="p-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation"
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

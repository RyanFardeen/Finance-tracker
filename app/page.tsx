'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import SidebarWrapper from '@/components/SidebarWrapper';
import { apiClient } from '@/lib/api-client';
import { calculations } from '@/lib/calculations';
import { Transaction, FinancialSummary } from '@/lib/types';
import { formatCurrency, formatCategory, formatDate } from '@/lib/formatters';
import { TrendingUp, TrendingDown, PiggyBank, Wallet, ArrowUpRight, ArrowDownRight, Loader2, Clock } from 'lucide-react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    totalSavings: 0,
    totalInvestments: 0,
    netWorth: 0,
  });
  const [monthlySummary, setMonthlySummary] = useState<FinancialSummary>({
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
          setLoading(true);
          setError(null);
          const data = await apiClient.getTransactions();
          setTransactions(data);
          setSummary(calculations.getFinancialSummary(data));
          setMonthlySummary(calculations.getMonthlySummary(data, new Date()));
        } catch (err) {
          console.error('Failed to fetch transactions:', err);
          setError('Failed to load transactions. Please try again.');
        } finally {
          setLoading(false);
        }
      } else if (status === 'unauthenticated') {
        setLoading(false);
      }
    }
    fetchData();
  }, [status]);

  // Use smart currency formatting for large numbers
  const formatAmount = (amount: number, compact: boolean = false) => {
    return formatCurrency(amount, compact);
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    trend
  }: {
    title: string;
    value: number;
    icon: any;
    color: string;
    trend?: { value: number; isPositive: boolean };
  }) => (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={24} className="text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-lg ${trend.isPositive ? 'text-green-600 bg-green-50 dark:bg-green-900/20' : 'text-red-600 bg-red-50 dark:bg-red-900/20'}`}>
            {trend.isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {Math.abs(trend.value).toFixed(1)}%
          </div>
        )}
      </div>
      <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wide">{title}</h3>
      <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white truncate" title={formatAmount(value, false)}>
        {formatAmount(value, true)}
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <SidebarWrapper />
        <main className="flex-1 lg:ml-72 pt-16 lg:pt-0 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="absolute inset-0 blur-xl bg-primary-500/20 rounded-full animate-pulse" />
              <Loader2 className="relative w-16 h-16 animate-spin text-primary-600 mx-auto mb-4" />
            </div>
            <p className="text-lg font-medium text-gray-600 dark:text-gray-400 animate-pulse">Loading your financial data...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <SidebarWrapper />
        <main className="flex-1 lg:ml-72 pt-16 lg:pt-0 p-8 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-8 shadow-xl">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <p className="text-red-600 dark:text-red-400 mb-6 font-medium">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <SidebarWrapper />
      
      <main className="flex-1 lg:ml-72 pt-16 lg:pt-0 p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="mb-8 lg:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mb-3 animate-in slide-in-from-top duration-500">
            Dashboard
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 animate-in slide-in-from-top duration-500 delay-100">
            Welcome back! Here's your financial overview
          </p>
        </div>

        {/* Lifetime Stats */}
        <div className="mb-8 lg:mb-10 animate-in slide-in-from-bottom duration-500 delay-200">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full" />
            Lifetime Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <StatCard
              title="Total Income"
              value={summary.totalIncome}
              icon={TrendingUp}
              color="bg-gradient-to-br from-green-500 to-green-600"
            />
            <StatCard
              title="Total Expenses"
              value={summary.totalExpenses}
              icon={TrendingDown}
              color="bg-gradient-to-br from-red-500 to-red-600"
            />
            <StatCard
              title="Total Savings"
              value={summary.totalSavings}
              icon={PiggyBank}
              color="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <StatCard
              title="Total Investments"
              value={summary.totalInvestments}
              icon={Wallet}
              color="bg-gradient-to-br from-purple-500 to-purple-600"
            />
          </div>
        </div>

        {/* Net Worth Card */}
        <div className="mb-8 lg:mb-10 animate-in slide-in-from-bottom duration-500 delay-300">
          <div className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-2xl p-8 sm:p-10 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.01]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <h2 className="text-white text-lg sm:text-xl font-semibold mb-3 flex items-center gap-2">
                <Wallet className="w-6 h-6" />
                Total Net Worth
              </h2>
              <p className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold truncate mb-2" title={formatAmount(summary.netWorth, false)}>
                {formatAmount(summary.netWorth, true)}
              </p>
              <p className="text-primary-100 text-sm sm:text-base font-medium">
                💰 Savings + Investments
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Stats */}
        <div className="mb-8 lg:mb-10 animate-in slide-in-from-bottom duration-500 delay-400">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
            This Month
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <StatCard
              title="Monthly Income"
              value={monthlySummary.totalIncome}
              icon={TrendingUp}
              color="bg-gradient-to-br from-green-500 to-green-600"
            />
            <StatCard
              title="Monthly Expenses"
              value={monthlySummary.totalExpenses}
              icon={TrendingDown}
              color="bg-gradient-to-br from-red-500 to-red-600"
            />
            <StatCard
              title="Monthly Savings"
              value={monthlySummary.totalSavings}
              icon={PiggyBank}
              color="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <StatCard
              title="Monthly Investments"
              value={monthlySummary.totalInvestments}
              icon={Wallet}
              color="bg-gradient-to-br from-purple-500 to-purple-600"
            />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="animate-in slide-in-from-bottom duration-500 delay-500">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full" />
              Recent Transactions
            </h2>
            <a
              href="/transactions"
              className="group flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm sm:text-base font-semibold transition-colors"
            >
              View All
              <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {transactions.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock size={32} className="text-gray-400" />
                </div>
                <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 font-medium">
                  No transactions yet. Start by adding your income or expenses!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {transactions.slice(-5).reverse().map((transaction, index) => {
                  const transactionType = transaction.type.toLowerCase();
                  return (
                    <div
                      key={transaction.id}
                      className="p-4 sm:p-5 flex items-center justify-between hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent dark:hover:from-gray-700/50 dark:hover:to-transparent transition-all duration-200 group"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className={`p-2.5 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-200 ${
                          transactionType === 'income' ? 'bg-gradient-to-br from-green-400 to-green-600' :
                          transactionType === 'expense' ? 'bg-gradient-to-br from-red-400 to-red-600' :
                          'bg-gradient-to-br from-purple-400 to-purple-600'
                        }`}>
                          {transactionType === 'income' ? <TrendingUp size={20} className="text-white" /> :
                           transactionType === 'expense' ? <TrendingDown size={20} className="text-white" /> :
                           <Wallet size={20} className="text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                            {formatCategory(transaction.category)}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                            {formatDate(transaction.date, 'medium')}
                          </p>
                        </div>
                      </div>
                      <div className={`text-lg sm:text-xl font-bold whitespace-nowrap ${
                        transactionType === 'income' ? 'text-green-600 dark:text-green-400' :
                        transactionType === 'expense' ? 'text-red-600 dark:text-red-400' :
                        'text-purple-600 dark:text-purple-400'
                      }`}>
                        {transactionType === 'income' ? '+' : '-'}{formatAmount(transaction.amount, true)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Made with Bob

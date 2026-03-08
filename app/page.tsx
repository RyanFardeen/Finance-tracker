'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import SidebarWrapper from '@/components/SidebarWrapper';
import { apiClient } from '@/lib/api-client';
import { calculations } from '@/lib/calculations';
import { Transaction, FinancialSummary } from '@/lib/types';
import { formatCurrency, formatCategory, formatDate } from '@/lib/formatters';
import { TrendingUp, TrendingDown, PiggyBank, Wallet, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';

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
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {Math.abs(trend.value).toFixed(1)}%
          </div>
        )}
      </div>
      <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white truncate" title={formatAmount(value, false)}>
        {formatAmount(value, true)}
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
        <SidebarWrapper />
        <main className="flex-1 ml-64 p-8 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading your financial data...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
        <SidebarWrapper />
        <main className="flex-1 ml-64 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <SidebarWrapper />
      
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Welcome back! Here's your financial overview
          </p>
        </div>

        {/* Lifetime Stats */}
        <div className="mb-6 lg:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Lifetime Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <StatCard
              title="Total Income"
              value={summary.totalIncome}
              icon={TrendingUp}
              color="bg-green-500"
            />
            <StatCard
              title="Total Expenses"
              value={summary.totalExpenses}
              icon={TrendingDown}
              color="bg-red-500"
            />
            <StatCard
              title="Total Savings"
              value={summary.totalSavings}
              icon={PiggyBank}
              color="bg-blue-500"
            />
            <StatCard
              title="Total Investments"
              value={summary.totalInvestments}
              icon={Wallet}
              color="bg-purple-500"
            />
          </div>
        </div>

        {/* Net Worth Card */}
        <div className="mb-6 lg:mb-8">
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl p-6 sm:p-8 shadow-lg">
            <h2 className="text-white text-base sm:text-lg font-medium mb-2">Total Net Worth</h2>
            <p className="text-white text-3xl sm:text-4xl font-bold truncate" title={formatAmount(summary.netWorth, false)}>
              {formatAmount(summary.netWorth, true)}
            </p>
            <p className="text-primary-100 text-sm mt-2">
              Savings + Investments
            </p>
          </div>
        </div>

        {/* Monthly Stats */}
        <div className="mb-6 lg:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
            This Month
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <StatCard
              title="Monthly Income"
              value={monthlySummary.totalIncome}
              icon={TrendingUp}
              color="bg-green-500"
            />
            <StatCard
              title="Monthly Expenses"
              value={monthlySummary.totalExpenses}
              icon={TrendingDown}
              color="bg-red-500"
            />
            <StatCard
              title="Monthly Savings"
              value={monthlySummary.totalSavings}
              icon={PiggyBank}
              color="bg-blue-500"
            />
            <StatCard
              title="Monthly Investments"
              value={monthlySummary.totalInvestments}
              icon={Wallet}
              color="bg-purple-500"
            />
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              Recent Transactions
            </h2>
            <a
              href="/transactions"
              className="text-primary-600 dark:text-primary-400 hover:underline text-xs sm:text-sm font-medium"
            >
              View All
            </a>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            {transactions.length === 0 ? (
              <div className="p-6 sm:p-8 text-center">
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                  No transactions yet. Start by adding your income or expenses!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {transactions.slice(-5).reverse().map((transaction) => {
                  const transactionType = transaction.type.toLowerCase();
                  return (
                    <div key={transaction.id} className="p-3 sm:p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                        <div className={`p-2 rounded-lg ${
                          transactionType === 'income' ? 'bg-green-100 dark:bg-green-900/30' :
                          transactionType === 'expense' ? 'bg-red-100 dark:bg-red-900/30' :
                          'bg-purple-100 dark:bg-purple-900/30'
                        }`}>
                          {transactionType === 'income' ? <TrendingUp size={20} className="text-green-600 dark:text-green-400" /> :
                           transactionType === 'expense' ? <TrendingDown size={20} className="text-red-600 dark:text-red-400" /> :
                           <Wallet size={20} className="text-purple-600 dark:text-purple-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
                            {formatCategory(transaction.category)}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(transaction.date, 'medium')}
                          </p>
                        </div>
                      </div>
                      <div className={`text-base sm:text-lg font-semibold whitespace-nowrap ${
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

'use client';

import { useEffect, useState } from 'react';
import SidebarWrapper from '@/components/SidebarWrapper';
import { storage } from '@/lib/storage';
import { calculations } from '@/lib/calculations';
import { exportMonthlyReportToPDF } from '@/lib/pdfExport';
import { Transaction, MonthlyReport } from '@/lib/types';
import { Download, Calendar } from 'lucide-react';

export default function MonthlyReportsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [monthTransactions, setMonthTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const data = storage.getTransactions();
    setTransactions(data);
    generateReport(data);
  }, [selectedMonth, selectedYear]);

  const generateReport = (data: Transaction[]) => {
    const date = new Date(selectedYear, selectedMonth, 1);
    const monthReport = calculations.getMonthlyReport(data, date);
    setReport(monthReport);

    // Filter transactions for selected month
    const filtered = data.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === selectedMonth && 
             transactionDate.getFullYear() === selectedYear;
    });
    setMonthTransactions(filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const handleExportPDF = () => {
    if (report) {
      exportMonthlyReportToPDF(report, monthTransactions);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = calculations.getAvailableYears(transactions);
  if (years.length === 0) {
    years.push(new Date().getFullYear());
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
                Monthly Reports
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Detailed monthly financial analysis
              </p>
            </div>
            <button
              onClick={handleExportPDF}
              disabled={!report}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              <Download size={20} />
              Export PDF
            </button>
          </div>

          {/* Month/Year Selector */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={20} className="text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Period</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Month
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {months.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {report && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Income</h3>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(report.income)}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Expenses</h3>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(report.expenses)}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Savings</h3>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(report.savings)}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Investments</h3>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {formatCurrency(report.investments)}
                  </p>
                </div>
              </div>

              {/* Net Change Card */}
              <div className={`rounded-xl p-8 shadow-lg mb-8 ${
                report.netChange >= 0 
                  ? 'bg-gradient-to-r from-green-500 to-green-700' 
                  : 'bg-gradient-to-r from-red-500 to-red-700'
              }`}>
                <h2 className="text-white text-lg font-medium mb-2">Net Wealth Change</h2>
                <p className="text-white text-4xl font-bold">
                  {report.netChange >= 0 ? '+' : ''}{formatCurrency(report.netChange)}
                </p>
                <p className="text-white/80 text-sm mt-2">
                  {report.netChange >= 0 ? 'Positive growth this month' : 'Negative growth this month'}
                </p>
              </div>

              {/* Transactions Table */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Transactions ({monthTransactions.length})
                  </h3>
                </div>
                {monthTransactions.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      No transactions for this month.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Notes
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {monthTransactions.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {new Date(transaction.date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                              })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                                transaction.type === 'INCOME' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                                transaction.type === 'EXPENSE' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                                'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                              }`}>
                                {transaction.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white capitalize">
                              {transaction.category.replace('_', ' ')}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                              {transaction.notes || '-'}
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${
                              transaction.type === 'INCOME' ? 'text-green-600 dark:text-green-400' :
                              transaction.type === 'EXPENSE' ? 'text-red-600 dark:text-red-400' :
                              'text-purple-600 dark:text-purple-400'
                            }`}>
                              {transaction.type === 'INCOME' ? '+' : transaction.type === 'EXPENSE' ? '-' : ''}
                              {formatCurrency(transaction.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

// Made with Bob

'use client';

import { useEffect, useState } from 'react';
import SidebarWrapper from '@/components/SidebarWrapper';
import { storage } from '@/lib/storage';
import { calculations } from '@/lib/calculations';
import { exportYearlyReportToPDF } from '@/lib/pdfExport';
import { Transaction, MonthlyReport } from '@/lib/types';
import { Download, Calendar } from 'lucide-react';

export default function YearlyReportsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReport[]>([]);
  const [yearTotal, setYearTotal] = useState({
    income: 0,
    expenses: 0,
    savings: 0,
    investments: 0,
  });

  useEffect(() => {
    const data = storage.getTransactions();
    setTransactions(data);
    generateReport(data);
  }, [selectedYear]);

  const generateReport = (data: Transaction[]) => {
    const reports: MonthlyReport[] = [];
    
    for (let month = 0; month < 12; month++) {
      const date = new Date(selectedYear, month, 1);
      const report = calculations.getMonthlyReport(data, date);
      reports.push(report);
    }
    
    setMonthlyReports(reports);

    // Calculate yearly totals
    const totals = {
      income: reports.reduce((sum, r) => sum + r.income, 0),
      expenses: reports.reduce((sum, r) => sum + r.expenses, 0),
      savings: reports.reduce((sum, r) => sum + r.savings, 0),
      investments: reports.reduce((sum, r) => sum + r.investments, 0),
    };
    setYearTotal(totals);
  };

  const handleExportPDF = () => {
    exportYearlyReportToPDF(selectedYear, monthlyReports);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const years = calculations.getAvailableYears(transactions);
  if (years.length === 0) {
    years.push(new Date().getFullYear());
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <SidebarWrapper />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Yearly Reports
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Annual financial overview and analysis
              </p>
            </div>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
            >
              <Download size={20} />
              Export PDF
            </button>
          </div>

          {/* Year Selector */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={20} className="text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Year</h3>
            </div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Annual Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Total Income</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(yearTotal.income)}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Total Expenses</h3>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(yearTotal.expenses)}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Total Savings</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(yearTotal.savings)}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Total Investments</h3>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(yearTotal.investments)}
              </p>
            </div>
          </div>

          {/* Net Savings Card */}
          <div className={`rounded-xl p-8 shadow-lg mb-8 ${
            yearTotal.savings >= 0 
              ? 'bg-gradient-to-r from-blue-500 to-blue-700' 
              : 'bg-gradient-to-r from-red-500 to-red-700'
          }`}>
            <h2 className="text-white text-lg font-medium mb-2">Annual Net Savings</h2>
            <p className="text-white text-4xl font-bold">
              {yearTotal.savings >= 0 ? '+' : ''}{formatCurrency(yearTotal.savings)}
            </p>
            <p className="text-white/80 text-sm mt-2">
              Income - Expenses for {selectedYear}
            </p>
          </div>

          {/* Monthly Breakdown Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Monthly Breakdown
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Month
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Income
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Expenses
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Savings
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Investments
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Net Change
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {monthlyReports.map((report, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {report.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 dark:text-green-400">
                        {formatCurrency(report.income)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 dark:text-red-400">
                        {formatCurrency(report.expenses)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-blue-600 dark:text-blue-400">
                        {formatCurrency(report.savings)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-purple-600 dark:text-purple-400">
                        {formatCurrency(report.investments)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${
                        report.netChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {report.netChange >= 0 ? '+' : ''}{formatCurrency(report.netChange)}
                      </td>
                    </tr>
                  ))}
                  {/* Totals Row */}
                  <tr className="bg-gray-100 dark:bg-gray-700 font-semibold">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      Total
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 dark:text-green-400">
                      {formatCurrency(yearTotal.income)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 dark:text-red-400">
                      {formatCurrency(yearTotal.expenses)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-blue-600 dark:text-blue-400">
                      {formatCurrency(yearTotal.savings)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-purple-600 dark:text-purple-400">
                      {formatCurrency(yearTotal.investments)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                      yearTotal.savings >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {yearTotal.savings >= 0 ? '+' : ''}{formatCurrency(yearTotal.savings)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Made with Bob

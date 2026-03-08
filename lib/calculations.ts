import { Transaction, FinancialSummary, MonthlyReport, YearlyReport, CategoryBreakdown } from './types';
import { startOfMonth, endOfMonth, startOfYear, endOfYear, format, parseISO } from 'date-fns';

export const calculations = {
  // Calculate total by type
  calculateTotal(transactions: Transaction[], type: 'INCOME' | 'EXPENSE' | 'INVESTMENT'): number {
    return transactions
      .filter(t => t.type === type)
      .reduce((sum, t) => sum + t.amount, 0);
  },

  // Calculate total for a date range
  calculateTotalForRange(
    transactions: Transaction[],
    type: 'INCOME' | 'EXPENSE' | 'INVESTMENT',
    startDate: Date,
    endDate: Date
  ): number {
    return transactions
      .filter(t => {
        const transactionDate = parseISO(t.date);
        return t.type === type && transactionDate >= startDate && transactionDate <= endDate;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  },

  // Get financial summary
  getFinancialSummary(transactions: Transaction[]): FinancialSummary {
    const totalIncome = this.calculateTotal(transactions, 'INCOME');
    const totalExpenses = this.calculateTotal(transactions, 'EXPENSE');
    const totalInvestments = this.calculateTotal(transactions, 'INVESTMENT');
    const totalSavings = totalIncome - totalExpenses;
    const netWorth = totalSavings + totalInvestments;

    return {
      totalIncome,
      totalExpenses,
      totalSavings,
      totalInvestments,
      netWorth,
    };
  },

  // Get monthly summary
  getMonthlySummary(transactions: Transaction[], date: Date): FinancialSummary {
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    const income = this.calculateTotalForRange(transactions, 'INCOME', start, end);
    const expenses = this.calculateTotalForRange(transactions, 'EXPENSE', start, end);
    const investments = this.calculateTotalForRange(transactions, 'INVESTMENT', start, end);
    const savings = income - expenses;
    const netWorth = savings + investments;

    return {
      totalIncome: income,
      totalExpenses: expenses,
      totalSavings: savings,
      totalInvestments: investments,
      netWorth,
    };
  },

  // Get yearly summary
  getYearlySummary(transactions: Transaction[], year: number): FinancialSummary {
    const start = startOfYear(new Date(year, 0, 1));
    const end = endOfYear(new Date(year, 11, 31));

    const income = this.calculateTotalForRange(transactions, 'INCOME', start, end);
    const expenses = this.calculateTotalForRange(transactions, 'EXPENSE', start, end);
    const investments = this.calculateTotalForRange(transactions, 'INVESTMENT', start, end);
    const savings = income - expenses;
    const netWorth = savings + investments;

    return {
      totalIncome: income,
      totalExpenses: expenses,
      totalSavings: savings,
      totalInvestments: investments,
      netWorth,
    };
  },

  // Get monthly report
  getMonthlyReport(transactions: Transaction[], date: Date): MonthlyReport {
    const summary = this.getMonthlySummary(transactions, date);
    
    return {
      month: format(date, 'MMMM'),
      year: date.getFullYear(),
      income: summary.totalIncome,
      expenses: summary.totalExpenses,
      savings: summary.totalSavings,
      investments: summary.totalInvestments,
      netChange: summary.netWorth,
    };
  },

  // Get yearly report
  getYearlyReport(transactions: Transaction[], year: number): YearlyReport {
    const summary = this.getYearlySummary(transactions, year);
    
    return {
      year,
      income: summary.totalIncome,
      expenses: summary.totalExpenses,
      savings: summary.totalSavings,
      investments: summary.totalInvestments,
    };
  },

  // Get category breakdown
  getCategoryBreakdown(
    transactions: Transaction[],
    type: 'INCOME' | 'EXPENSE' | 'INVESTMENT'
  ): CategoryBreakdown[] {
    const filtered = transactions.filter(t => t.type === type);
    const total = filtered.reduce((sum, t) => sum + t.amount, 0);

    const categoryMap = new Map<string, number>();
    filtered.forEach(t => {
      const current = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, current + t.amount);
    });

    return Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  },

  // Get monthly data for charts (last 12 months)
  getMonthlyChartData(transactions: Transaction[]): Array<{
    month: string;
    income: number;
    expenses: number;
    savings: number;
  }> {
    const data = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const summary = this.getMonthlySummary(transactions, date);
      
      data.push({
        month: format(date, 'MMM yyyy'),
        income: summary.totalIncome,
        expenses: summary.totalExpenses,
        savings: summary.totalSavings,
      });
    }

    return data;
  },

  // Get all unique years from transactions
  getAvailableYears(transactions: Transaction[]): number[] {
    const years = new Set<number>();
    transactions.forEach(t => {
      const year = parseISO(t.date).getFullYear();
      years.add(year);
    });
    return Array.from(years).sort((a, b) => b - a);
  },
};

// Made with Bob

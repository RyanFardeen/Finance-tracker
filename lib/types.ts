export type TransactionType = 'income' | 'expense' | 'investment';

export type IncomeCategory = 'salary' | 'business' | 'passive' | 'other';

export type ExpenseCategory = 
  | 'food' 
  | 'rent' 
  | 'travel' 
  | 'shopping' 
  | 'bills' 
  | 'entertainment'
  | 'healthcare'
  | 'education'
  | 'other';

export type InvestmentCategory = 
  | 'stocks' 
  | 'mutual_funds' 
  | 'gold' 
  | 'real_estate' 
  | 'fixed_deposits' 
  | 'crypto'
  | 'other';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: IncomeCategory | ExpenseCategory | InvestmentCategory;
  amount: number;
  date: string;
  notes: string;
  createdAt: string;
}

export interface IncomeTransaction extends Transaction {
  type: 'income';
  category: IncomeCategory;
}

export interface ExpenseTransaction extends Transaction {
  type: 'expense';
  category: ExpenseCategory;
}

export interface InvestmentTransaction extends Transaction {
  type: 'investment';
  category: InvestmentCategory;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  totalInvestments: number;
  netWorth: number;
}

export interface MonthlyReport {
  month: string;
  year: number;
  income: number;
  expenses: number;
  savings: number;
  investments: number;
  netChange: number;
}

export interface YearlyReport {
  year: number;
  income: number;
  expenses: number;
  savings: number;
  investments: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

// Made with Bob

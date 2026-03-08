import { Transaction, IncomeTransaction, ExpenseTransaction, InvestmentTransaction } from './types';

const STORAGE_KEY = 'finance_tracker_data';

export const storage = {
  // Get all transactions
  getTransactions(): Transaction[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Save transactions
  saveTransactions(transactions: Transaction[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  },

  // Add a new transaction
  addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
    const transactions = this.getTransactions();
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    transactions.push(newTransaction);
    this.saveTransactions(transactions);
    return newTransaction;
  },

  // Update a transaction
  updateTransaction(id: string, updates: Partial<Transaction>): Transaction | null {
    const transactions = this.getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    transactions[index] = { ...transactions[index], ...updates };
    this.saveTransactions(transactions);
    return transactions[index];
  },

  // Delete a transaction
  deleteTransaction(id: string): boolean {
    const transactions = this.getTransactions();
    const filtered = transactions.filter(t => t.id !== id);
    if (filtered.length === transactions.length) return false;
    
    this.saveTransactions(filtered);
    return true;
  },

  // Get transactions by type
  getTransactionsByType(type: 'income' | 'expense' | 'investment'): Transaction[] {
    return this.getTransactions().filter(t => t.type === type);
  },

  // Get income transactions
  getIncomeTransactions(): IncomeTransaction[] {
    return this.getTransactionsByType('income') as IncomeTransaction[];
  },

  // Get expense transactions
  getExpenseTransactions(): ExpenseTransaction[] {
    return this.getTransactionsByType('expense') as ExpenseTransaction[];
  },

  // Get investment transactions
  getInvestmentTransactions(): InvestmentTransaction[] {
    return this.getTransactionsByType('investment') as InvestmentTransaction[];
  },

  // Clear all data
  clearAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  },
};

// Made with Bob

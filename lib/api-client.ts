import { Transaction } from './types';

export const apiClient = {
  async getTransactions(filters?: {
    type?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Transaction[]> {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const url = `/api/transactions${params.toString() ? `?${params}` : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    
    return response.json();
  },

  async createTransaction(data: {
    type: 'INCOME' | 'EXPENSE' | 'INVESTMENT';
    category: string;
    amount: number;
    date: string;
    notes?: string;
  }): Promise<Transaction> {
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create transaction');
    }
    
    return response.json();
  },

  async updateTransaction(
    id: string,
    data: Partial<{
      type: 'INCOME' | 'EXPENSE' | 'INVESTMENT';
      category: string;
      amount: number;
      date: string;
      notes?: string;
    }>
  ): Promise<Transaction> {
    const response = await fetch(`/api/transactions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update transaction');
    }
    
    return response.json();
  },

  async deleteTransaction(id: string): Promise<void> {
    const response = await fetch(`/api/transactions/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete transaction');
    }
  },
};

// Made with Bob

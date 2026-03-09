'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Send, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  XCircle,
  Edit2,
  Trash2,
  Plus
} from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface ParsedTransaction {
  amount: number;
  category: string;
  type: 'INCOME' | 'EXPENSE' | 'INVESTMENT';
  date: string;
  notes?: string;
}

interface ConfirmationTransaction extends ParsedTransaction {
  id: string;
  isEditing: boolean;
}

export default function AIEntryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingTransactions, setPendingTransactions] = useState<ConfirmationTransaction[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const examplePrompts = [
    "Spent 500 on groceries yesterday",
    "Received salary of 50000 today",
    "Invested 10000 in mutual funds",
    "Paid rent 15000 and electricity 2000 last week",
  ];

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch('/api/ai/parse-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          conversationHistory,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to parse transaction');
      }

      // Add AI response to messages
      const aiMessage: Message = {
        role: 'assistant',
        content: `I found ${data.transactions.length} transaction(s). Please review and confirm:`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);

      // Set pending transactions for confirmation
      const transactionsWithIds = data.transactions.map((t: ParsedTransaction) => ({
        ...t,
        id: Math.random().toString(36).substr(2, 9),
        isEditing: false,
      }));
      setPendingTransactions(transactionsWithIds);
      setShowConfirmation(true);

    } catch (error: any) {
      const errorMessage: Message = {
        role: 'assistant',
        content: `Sorry, I couldn't process that. ${error.message}. Please try rephrasing your message.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmAll = async () => {
    setIsLoading(true);
    try {
      const results = await Promise.all(
        pendingTransactions.map(async (transaction) => {
          const response = await fetch('/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: transaction.type,
              category: transaction.category,
              amount: transaction.amount,
              date: transaction.date,
              notes: transaction.notes || '',
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to create transaction');
          }

          return response.json();
        })
      );

      const successMessage: Message = {
        role: 'assistant',
        content: `✅ Successfully added ${results.length} transaction(s)!`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, successMessage]);
      setPendingTransactions([]);
      setShowConfirmation(false);

    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: '❌ Failed to save some transactions. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAll = () => {
    setPendingTransactions([]);
    setShowConfirmation(false);
    const cancelMessage: Message = {
      role: 'assistant',
      content: 'Transactions cancelled. Feel free to try again!',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, cancelMessage]);
  };

  const handleEditTransaction = (id: string) => {
    setPendingTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, isEditing: !t.isEditing } : t))
    );
  };

  const handleUpdateTransaction = (id: string, field: keyof ParsedTransaction, value: any) => {
    setPendingTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleDeleteTransaction = (id: string) => {
    setPendingTransactions(prev => prev.filter(t => t.id !== id));
    if (pendingTransactions.length === 1) {
      setShowConfirmation(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setInput(example);
    inputRef.current?.focus();
  };

  const getCategoryColor = (type: string) => {
    switch (type) {
      case 'INCOME':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'EXPENSE':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'INVESTMENT':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                AI Transaction Entry
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Describe your transaction in natural language
              </p>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 280px)' }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <Sparkles className="w-16 h-16 mx-auto text-purple-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Start a conversation
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try one of these examples:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                  {examplePrompts.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(example)}
                      className="p-4 text-left bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl hover:shadow-md transition-all duration-200 border border-purple-200 dark:border-purple-800"
                    >
                      <p className="text-sm text-gray-700 dark:text-gray-300">{example}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {format(message.timestamp, 'HH:mm')}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3">
                  <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Confirmation Dialog */}
          {showConfirmation && pendingTransactions.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Review Transactions
              </h3>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {pendingTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                  >
                    {transaction.isEditing ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-gray-600 dark:text-gray-400">Amount</label>
                            <input
                              type="number"
                              value={transaction.amount}
                              onChange={(e) => handleUpdateTransaction(transaction.id, 'amount', parseFloat(e.target.value))}
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-600 dark:text-gray-400">Type</label>
                            <select
                              value={transaction.type}
                              onChange={(e) => handleUpdateTransaction(transaction.id, 'type', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                              <option value="INCOME">Income</option>
                              <option value="EXPENSE">Expense</option>
                              <option value="INVESTMENT">Investment</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 dark:text-gray-400">Category</label>
                          <input
                            type="text"
                            value={transaction.category}
                            onChange={(e) => handleUpdateTransaction(transaction.id, 'category', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 dark:text-gray-400">Date</label>
                          <input
                            type="datetime-local"
                            value={transaction.date.slice(0, 16)}
                            onChange={(e) => handleUpdateTransaction(transaction.id, 'date', new Date(e.target.value).toISOString())}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 dark:text-gray-400">Notes</label>
                          <input
                            type="text"
                            value={transaction.notes || ''}
                            onChange={(e) => handleUpdateTransaction(transaction.id, 'notes', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getCategoryColor(transaction.type)}`}>
                              {transaction.type}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {transaction.category}
                            </span>
                          </div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            ₹{transaction.amount.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {format(new Date(transaction.date), 'MMM dd, yyyy')}
                          </p>
                          {transaction.notes && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {transaction.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditTransaction(transaction.id)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </button>
                          <button
                            onClick={() => handleDeleteTransaction(transaction.id)}
                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      </div>
                    )}
                    {transaction.isEditing && (
                      <button
                        onClick={() => handleEditTransaction(transaction.id)}
                        className="mt-3 w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                      >
                        Done Editing
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleConfirmAll}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                  Confirm All
                </button>
                <button
                  onClick={handleCancelAll}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  <XCircle className="w-5 h-5" />
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your transaction... (e.g., 'Spent 500 on groceries yesterday')"
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
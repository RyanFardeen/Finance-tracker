/**
 * Utility functions for formatting numbers, currency, and dates
 */

/**
 * Format large numbers with K, M, B suffixes for better readability
 * @param amount - The number to format
 * @param compact - Whether to use compact notation for large numbers
 * @returns Formatted string
 */
export function formatCurrency(amount: number, compact: boolean = false): string {
  // Handle invalid inputs
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₹0';
  }

  // For compact mode, use abbreviations for large numbers
  if (compact) {
    const absAmount = Math.abs(amount);
    const sign = amount < 0 ? '-' : '';
    
    if (absAmount >= 1_000_000_000_000) {
      return `${sign}₹${(absAmount / 1_000_000_000_000).toFixed(2)}T`;
    }
    if (absAmount >= 1_000_000_000) {
      return `${sign}₹${(absAmount / 1_000_000_000).toFixed(2)}B`;
    }
    if (absAmount >= 1_000_000) {
      return `${sign}₹${(absAmount / 1_000_000).toFixed(2)}M`;
    }
    if (absAmount >= 100_000) {
      return `${sign}₹${(absAmount / 1_000).toFixed(0)}K`;
    }
  }

  // Standard formatting for smaller numbers
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format number with proper decimal places
 * @param num - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string
 */
export function formatNumber(num: number, decimals: number = 2): string {
  if (typeof num !== 'number' || isNaN(num)) {
    return '0';
  }
  
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Format date in a readable format
 * @param date - Date string or Date object
 * @param format - Format type: 'short', 'medium', 'long'
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date,
  format: 'short' | 'medium' | 'long' = 'medium'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const optionsMap: Record<string, Intl.DateTimeFormatOptions> = {
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    medium: { day: 'numeric', month: 'short', year: 'numeric' },
    long: { day: 'numeric', month: 'long', year: 'numeric' },
  };
  
  const options = optionsMap[format];

  return new Intl.DateTimeFormat('en-IN', options).format(dateObj);
}

/**
 * Format category name (convert underscores to spaces and capitalize)
 * @param category - Category string
 * @returns Formatted category name
 */
export function formatCategory(category: string): string {
  if (!category) return '';
  
  return category
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Truncate text to specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Validate and sanitize amount input
 * @param value - Input value
 * @param max - Maximum allowed value
 * @returns Sanitized number or null if invalid
 */
export function sanitizeAmount(value: string | number, max: number = 999_999_999_999): number | null {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num) || num < 0) return null;
  if (num > max) return max;
  
  // Round to 2 decimal places
  return Math.round(num * 100) / 100;
}

/**
 * Get percentage change between two numbers
 * @param current - Current value
 * @param previous - Previous value
 * @returns Percentage change with sign
 */
export function getPercentageChange(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? '+100%' : '0%';
  
  const change = ((current - previous) / previous) * 100;
  const sign = change > 0 ? '+' : '';
  
  return `${sign}${change.toFixed(1)}%`;
}

/**
 * Format relative time (e.g., "2 days ago")
 * @param date - Date string or Date object
 * @returns Relative time string
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  
  return `${Math.floor(diffDays / 365)} years ago`;
}

/**
 * Validate transaction amount
 * @param amount - Amount to validate
 * @returns Error message or null if valid
 */
export function validateAmount(amount: number): string | null {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 'Please enter a valid number';
  }
  
  if (amount < 0) {
    return 'Amount cannot be negative';
  }
  
  if (amount === 0) {
    return 'Amount must be greater than zero';
  }
  
  if (amount > 999_999_999_999) {
    return 'Amount is too large (max: ₹999,999,999,999)';
  }
  
  // Check decimal places
  const decimalPlaces = (amount.toString().split('.')[1] || '').length;
  if (decimalPlaces > 2) {
    return 'Amount can have maximum 2 decimal places';
  }
  
  return null;
}

/**
 * Format month and year
 * @param date - Date string or Date object
 * @returns Formatted month-year string
 */
export function formatMonthYear(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('en-IN', {
    month: 'long',
    year: 'numeric',
  }).format(dateObj);
}

/**
 * Get color class based on transaction type
 * @param type - Transaction type
 * @returns Tailwind color class
 */
export function getTypeColor(type: string): string {
  const typeMap: Record<string, string> = {
    INCOME: 'text-green-600 dark:text-green-400',
    EXPENSE: 'text-red-600 dark:text-red-400',
    INVESTMENT: 'text-blue-600 dark:text-blue-400',
  };
  
  return typeMap[type.toUpperCase()] || 'text-gray-600 dark:text-gray-400';
}

/**
 * Get background color class based on transaction type
 * @param type - Transaction type
 * @returns Tailwind background color class
 */
export function getTypeBgColor(type: string): string {
  const typeMap: Record<string, string> = {
    INCOME: 'bg-green-100 dark:bg-green-900/20',
    EXPENSE: 'bg-red-100 dark:bg-red-900/20',
    INVESTMENT: 'bg-blue-100 dark:bg-blue-900/20',
  };
  
  return typeMap[type.toUpperCase()] || 'bg-gray-100 dark:bg-gray-900/20';
}

// Made with Bob

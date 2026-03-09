'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  LineChart,
  History,
  FileText,
  Calendar,
  Moon,
  Sun,
  Menu,
  X,
  LogOut,
  User,
  Sparkles
} from 'lucide-react';
import { useTheme } from './ThemeProvider';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Sparkles, label: 'AI Entry', href: '/ai-entry', highlight: true },
  { icon: TrendingUp, label: 'Income', href: '/income' },
  { icon: TrendingDown, label: 'Expenses', href: '/expenses' },
  { icon: PiggyBank, label: 'Investments', href: '/investments' },
  { icon: LineChart, label: 'Analytics', href: '/analytics' },
  { icon: History, label: 'Transactions', href: '/transactions' },
  { icon: FileText, label: 'Monthly Reports', href: '/reports/monthly' },
  { icon: Calendar, label: 'Yearly Reports', href: '/reports/yearly' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header - Enhanced with gradient and shadow */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 z-50 shadow-sm backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
            <span className="text-white text-lg">💰</span>
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-400 dark:to-primary-500 bg-clip-text text-transparent">
            FinanceTracker
          </h1>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 active:scale-95 touch-manipulation"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? (
            <X size={24} className="text-gray-700 dark:text-gray-200" />
          ) : (
            <Menu size={24} className="text-gray-700 dark:text-gray-200" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay - Enhanced with backdrop blur */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar - Enhanced with modern design */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-72 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col z-50 shadow-2xl
          transition-all duration-300 ease-in-out
          lg:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo - Desktop - Enhanced with gradient */}
        <div className="hidden lg:flex flex-col p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
              <span className="text-white text-xl">💰</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-400 dark:to-primary-500 bg-clip-text text-transparent">
              FinanceTracker
            </h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 ml-13">
            Manage Your Wealth
          </p>
        </div>

        {/* User Info - Mobile - Enhanced with gradient card */}
        <div className="lg:hidden p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-md ring-2 ring-white dark:ring-gray-800">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <User size={24} className="text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {session?.user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                {session?.user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation - Enhanced with better hover effects */}
        <nav className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          <ul className="space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const isHighlight = item.highlight;
              
              return (
                <li key={item.href} style={{ animationDelay: `${index * 50}ms` }} className="animate-in slide-in-from-left duration-300">
                  <Link
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={`
                      group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 touch-manipulation
                      ${isActive
                        ? isHighlight
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 scale-[1.02]'
                          : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30 scale-[1.02]'
                        : isHighlight
                          ? 'text-gray-700 dark:text-gray-300 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 hover:shadow-md active:scale-95'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-800 dark:hover:to-gray-700 hover:shadow-md active:scale-95'
                      }
                    `}
                  >
                    <Icon size={20} className={`${
                      isActive
                        ? 'text-white'
                        : isHighlight
                          ? 'text-purple-600 dark:text-purple-400'
                          : 'text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400'
                    } transition-colors`} />
                    <span className="font-medium text-sm">{item.label}</span>
                    {isHighlight && !isActive && (
                      <span className="ml-auto px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
                        NEW
                      </span>
                    )}
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Actions - Enhanced with modern styling */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2 bg-gradient-to-t from-gray-50 to-transparent dark:from-gray-800 dark:to-transparent">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="group flex items-center gap-3 px-4 py-3 rounded-xl w-full text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-800 dark:hover:to-gray-700 transition-all duration-200 hover:shadow-md active:scale-95 touch-manipulation"
          >
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 dark:from-blue-400 dark:to-purple-500 shadow-sm">
              {theme === 'light' ? (
                <Moon size={16} className="text-white" />
              ) : (
                <Sun size={16} className="text-white" />
              )}
            </div>
            <span className="font-medium text-sm">
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </button>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="group flex items-center gap-3 px-4 py-3 rounded-xl w-full text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/20 dark:hover:to-red-800/20 transition-all duration-200 hover:shadow-md active:scale-95 touch-manipulation"
          >
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-red-500 to-red-600 shadow-sm">
              <LogOut size={16} className="text-white" />
            </div>
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

// Made with Bob

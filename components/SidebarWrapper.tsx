'use client';

import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';

export default function SidebarWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <>
        {/* Mobile Header Placeholder */}
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 z-50 shadow-sm animate-pulse">
          <div className="flex items-center justify-between px-4 h-full">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700" />
              <div className="w-32 h-5 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
        
        {/* Desktop Sidebar Placeholder */}
        <aside className="hidden lg:block fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-2xl">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 animate-pulse">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
              <div className="w-40 h-6 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="w-32 h-4 rounded bg-gray-200 dark:bg-gray-700 ml-13" />
          </div>
        </aside>
      </>
    );
  }

  return <Sidebar />;
}

// Made with Bob

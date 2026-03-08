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
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
        {/* Placeholder during SSR */}
      </aside>
    );
  }

  return <Sidebar />;
}

// Made with Bob

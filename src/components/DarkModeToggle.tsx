import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function DarkModeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={`w-9 h-9 rounded-lg border border-transparent ${className}`} />;
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200 ${
        isDark
          ? 'bg-navy-light/80 border-navy-subtle text-accent-glow hover:bg-navy-subtle hover:border-primary'
          : 'bg-gray-100/90 border-gray-200 text-navy hover:bg-gray-200 hover:border-gray-300'
      } ${className}`}
      aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
      title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-[#4ECDC4] transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-[#1A2332] transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}


import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { Sun, Moon, Monitor } from 'lucide-react';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const options = [
    { name: 'light', icon: Sun },
    { name: 'dark', icon: Moon },
    { name: 'system', icon: Monitor },
  ] as const;

  return (
    <div className="flex items-center justify-center p-1 rounded-full bg-black/20">
      {options.map((option) => (
        <button
          key={option.name}
          onClick={() => setTheme(option.name)}
          className={`p-2 rounded-full transition-all duration-300 ${
            theme === option.name
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-white/40 hover:text-white/80'
          }`}
          aria-label={`Switch to ${option.name} theme`}
        >
          <option.icon size={16} />
        </button>
      ))}
    </div>
  );
};

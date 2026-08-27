import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center px-[16px] py-[8px] rounded-[48px] border-2 border-gray-300 dark:border-gray-600 transition-all duration-300 hover:scale-105 hover:border-gray-400 dark:hover:border-gray-500 active:scale-95 bg-transparent"
      aria-label="Toggle theme"
    >
      <span 
        className="font-['Inter:Medium',sans-serif] font-medium leading-[1.5] text-[16px] bg-gradient-to-r from-[#0b6e4f] to-[#2c5a07] bg-clip-text text-transparent transition-all duration-300"
      >
        {theme === 'light' ? 'light' : 'dark'}
      </span>
    </button>
  );
}
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ className = '', showLabel = false }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
      className={`inline-flex items-center gap-2 p-2.5 rounded-xl border transition duration-150 select-none ${
        isDark
          ? 'bg-[#162420] border-[#2a453d] text-[#dec684] hover:bg-[#1f332c] hover:text-[#f9f6ef]'
          : 'bg-[#f9f6ef] border-[#e8dfcf] text-[#a08145] hover:bg-[#eee8d8] hover:text-[#1b6a54]'
      } ${className}`}
      aria-label="Toggle tema gelap/terang"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-[#dec684] animate-spin-slow" />
      ) : (
        <Moon className="w-5 h-5 text-[#a08145]" />
      )}
      {showLabel && (
        <span className="text-xs font-semibold">
          {isDark ? 'Mode Terang' : 'Mode Gelap'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;


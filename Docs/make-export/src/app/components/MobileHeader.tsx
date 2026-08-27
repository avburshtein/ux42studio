import { Menu, X, Sun, Moon, User, LogIn } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Link as RouterLink, useNavigate } from 'react-router';

interface MobileHeaderProps {
  onMenuClick: () => void;
  isMenuOpen?: boolean;
}

export function MobileHeader({ onMenuClick, isMenuOpen = false }: MobileHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="md:hidden flex items-center justify-between w-full px-[16px] py-[12px] bg-white/80 dark:bg-[rgba(20,20,20,0.95)] backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      {/* Logo */}
      <RouterLink to="/" className="flex items-center">
        <div className="font-['Poppins:Medium',sans-serif] text-[20px] text-[rgba(18,21,14,0.71)] dark:text-gray-400">
          Logo
        </div>
      </RouterLink>

      {/* Right side icons */}
      <div className="flex items-center gap-[12px]">
        {/* User/Login Button */}
        {isAuthenticated ? (
          <button
            onClick={() => navigate('/dashboard')}
            className="p-[10px] rounded-full transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm"
            style={{ 
              backgroundImage: "linear-gradient(107.879deg, rgba(11, 110, 79, 1) 3.7608%, rgba(44, 90, 7, 1) 98.529%)"
            }}
            aria-label="Profile"
          >
            <User className="w-[20px] h-[20px] text-white" />
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="p-[10px] rounded-full transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm"
            style={{ 
              backgroundImage: "linear-gradient(107.879deg, rgba(11, 110, 79, 1) 3.7608%, rgba(44, 90, 7, 1) 98.529%)"
            }}
            aria-label="Login"
          >
            <LogIn className="w-[20px] h-[20px] text-white" />
          </button>
        )}

        {/* Theme Toggle Icon */}
        <button
          onClick={toggleTheme}
          className="p-[10px] rounded-full bg-white/90 dark:bg-[rgba(40,40,40,0.95)] border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-[20px] h-[20px] text-[#0b6e4f] dark:text-white" />
          ) : (
            <Moon className="w-[20px] h-[20px] text-[#0b6e4f]" />
          )}
        </button>

        {/* Menu Toggle Icon */}
        <button
          onClick={onMenuClick}
          className="p-[10px] rounded-full transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm"
          style={{ 
            backgroundImage: isMenuOpen 
              ? "linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)"
              : "linear-gradient(107.879deg, rgba(11, 110, 79, 1) 3.7608%, rgba(44, 90, 7, 1) 98.529%)"
          }}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <X className="w-[20px] h-[20px] text-white" />
          ) : (
            <Menu className="w-[20px] h-[20px] text-white" />
          )}
        </button>
      </div>
    </div>
  );
}
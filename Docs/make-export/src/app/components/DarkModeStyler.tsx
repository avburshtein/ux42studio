import { useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Component that dynamically applies dark mode styles to elements with specific text colors
 */
export function DarkModeStyler() {
  const { theme } = useTheme();

  useEffect(() => {
    if (theme === 'dark') {
      // Apply custom styles for dark mode
      const style = document.createElement('style');
      style.id = 'dark-mode-overrides';
      style.textContent = `
        /* Dark mode text color overrides */
        .dark p,
        .dark h1,
        .dark h2,
        .dark h3,
        .dark h4,
        .dark h5,
        .dark h6,
        .dark span:not([class*="text-white"]):not([class*="text-[#0b6e4f]"]),
        .dark label {
          color: white !important;
        }
        
        /* Keep specific colors intact */
        .dark .text-white,
        .dark [class*="text-white"] {
          color: white !important;
        }
        
        .dark [class*="text-[#0b6e4f]"] {
          color: #0b6e4f !important;
        }
        
        /* Override button text in white buttons */
        .dark .bg-white p,
        .dark [class*="bg-white"] p {
          color: white !important;
        }
        
        /* SVG fills in dark mode */
        .dark svg path[fill*="#202020"] {
          fill: white !important;
        }
        
        .dark svg path[stroke*="#202020"] {
          stroke: white !important;
        }
      `;
      document.head.appendChild(style);

      return () => {
        const existingStyle = document.getElementById('dark-mode-overrides');
        if (existingStyle) {
          existingStyle.remove();
        }
      };
    } else {
      const existingStyle = document.getElementById('dark-mode-overrides');
      if (existingStyle) {
        existingStyle.remove();
      }
    }
  }, [theme]);

  return null;
}
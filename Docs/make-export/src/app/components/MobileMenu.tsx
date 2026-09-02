import { motion, AnimatePresence } from 'motion/react';
import { X, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
  onOpenContact: () => void;
  onOpenServices: () => void;
}

export function MobileMenu({ isOpen, onClose, onOpenAuth, onOpenContact, onOpenServices }: MobileMenuProps) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleLinkClick = () => {
    onClose();
  };

  const handleServicesClick = () => {
    onClose();
    onOpenServices();
  };

  const handleAuthClick = () => {
    onClose();
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const handleContactClick = () => {
    onClose();
    onOpenContact();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto modal-scrollbar"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Menu</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X size={24} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-2">
                <Link
                  to="/services"
                  onClick={handleLinkClick}
                  className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-lg"
                >
                  Services
                </Link>
                
                <Link
                  to="/portfolio"
                  onClick={handleLinkClick}
                  className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-lg"
                >
                  Portfolio
                </Link>

                <button
                  onClick={handleContactClick}
                  className="w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-lg"
                >
                  Contact
                </button>

                <div className="border-t border-gray-200 dark:border-gray-800 my-4" />

                <button
                  onClick={handleAuthClick}
                  className="w-full text-left px-4 py-3 rounded-lg text-[#0b6e4f] dark:text-[#10b981] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-lg font-medium flex items-center"
                >
                  {isAuthenticated ? (
                    <>
                      <User size={20} className="mr-2" />
                      <span>Profile</span>
                    </>
                  ) : (
                    'Sign In / Sign Up'
                  )}
                </button>
              </nav>

              {/* Footer Links */}
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                <div className="space-y-2">
                  <Link
                    to="/privacy"
                    onClick={handleLinkClick}
                    className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    to="/terms"
                    onClick={handleLinkClick}
                    className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    to="/cookies"
                    onClick={handleLinkClick}
                    className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                  >
                    Cookie Settings
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
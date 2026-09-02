import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle authentication logic here
    console.log('Form submitted:', formData);
    // For demo purposes, just close the modal
    alert(isSignUp ? 'Account created successfully!' : 'Logged in successfully!');
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-[24px] p-0 overflow-hidden">
        <DialogDescription className="sr-only">
          {isSignUp ? 'Sign up to create a new account' : 'Sign in to your account'}
        </DialogDescription>
        <div className="relative">
          
          <DialogHeader className="px-8 pt-8 pb-6">
            <DialogTitle className="text-3xl font-bold text-gray-900 dark:text-white">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </DialogTitle>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {isSignUp 
                ? 'Sign up to get started with our services' 
                : 'Sign in to your account'}
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="px-[32px] py-[16px] h-auto rounded-[48px] bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="px-[32px] py-[16px] h-auto rounded-[48px] bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="px-[32px] py-[16px] h-auto rounded-[48px] bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                placeholder="••••••••"
              />
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="px-[32px] py-[16px] h-auto rounded-[48px] bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  placeholder="••••••••"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full px-[32px] py-[16px] rounded-[48px] font-medium text-white transition-all duration-300 hover:shadow-[4px_4px_12px_0px_rgba(11,110,79,0.2)] hover:scale-105 active:scale-95"
              style={{ backgroundImage: "linear-gradient(107.879deg, rgba(11, 110, 79, 1) 3.7608%, rgba(44, 90, 7, 1) 98.529%)" }}
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[#0b6e4f] dark:text-[#10b981] hover:underline text-sm"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

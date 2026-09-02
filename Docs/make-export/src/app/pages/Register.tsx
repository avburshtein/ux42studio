import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setLoading(true);

    try {
      await register(email, password, name);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-[24px] py-[60px] bg-gradient-to-br from-white/70 to-[#fbfffa]/70 dark:from-[#0f0f0f]/70 dark:to-[#1a1a1a]/70 transition-colors duration-300">
      <div className="w-full max-w-[480px] bg-white dark:bg-[rgba(30,30,30,0.95)] rounded-[24px] shadow-[8px_8px_20px_0px_rgba(0,0,0,0.1)] dark:shadow-[8px_8px_20px_0px_rgba(255,255,255,0.05)] p-[40px] md:p-[48px]">
        {/* Header */}
        <div className="flex flex-col items-center gap-[16px] mb-[40px]">
          <div className="w-[64px] h-[64px] rounded-full flex items-center justify-center bg-gradient-to-br from-[#0b6e4f] to-[#2c5a07] shadow-lg">
            <UserPlus className="w-[32px] h-[32px] text-white" />
          </div>
          <h1 className="font-['Poppins:Medium',sans-serif] text-[32px] md:text-[36px] text-[rgba(18,21,14,0.71)] dark:text-white text-center">
            Регистрация
          </h1>
          <p className="font-['Inter:Regular',sans-serif] text-[16px] text-[rgba(18,21,14,0.71)] dark:text-gray-400 text-center">
            Создайте аккаунт для доступа к личному кабинету
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-[24px] p-[16px] bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-[12px] flex items-start gap-[12px]">
            <AlertCircle className="w-[20px] h-[20px] text-red-600 dark:text-red-400 flex-shrink-0 mt-[2px]" />
            <p className="font-['Inter:Regular',sans-serif] text-[14px] text-red-600 dark:text-red-400">
              {error}
            </p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-[24px] p-[16px] bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-[12px] flex items-start gap-[12px]">
            <CheckCircle className="w-[20px] h-[20px] text-green-600 dark:text-green-400 flex-shrink-0 mt-[2px]" />
            <p className="font-['Inter:Regular',sans-serif] text-[14px] text-green-600 dark:text-green-400">
              Регистрация успешна! Переход на личный кабинет...
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-[24px]">
          {/* Name */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-['Inter:Medium',sans-serif] text-[14px] text-[rgba(18,21,14,0.71)] dark:text-gray-300">
              Имя
            </label>
            <div className="relative">
              <User className="absolute left-[16px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Иван Иванов"
                className="w-full pl-[48px] pr-[16px] py-[14px] bg-white dark:bg-[rgba(20,20,20,0.95)] border border-gray-200 dark:border-gray-700 rounded-[12px] font-['Inter:Regular',sans-serif] text-[16px] text-[rgba(18,21,14,0.71)] dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#0b6e4f] dark:focus:border-[#0b6e4f] transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-['Inter:Medium',sans-serif] text-[14px] text-[rgba(18,21,14,0.71)] dark:text-gray-300">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-[16px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full pl-[48px] pr-[16px] py-[14px] bg-white dark:bg-[rgba(20,20,20,0.95)] border border-gray-200 dark:border-gray-700 rounded-[12px] font-['Inter:Regular',sans-serif] text-[16px] text-[rgba(18,21,14,0.71)] dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#0b6e4f] dark:focus:border-[#0b6e4f] transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-['Inter:Medium',sans-serif] text-[14px] text-[rgba(18,21,14,0.71)] dark:text-gray-300">
              Пароль
            </label>
            <div className="relative">
              <Lock className="absolute left-[16px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Минимум 6 символов"
                className="w-full pl-[48px] pr-[16px] py-[14px] bg-white dark:bg-[rgba(20,20,20,0.95)] border border-gray-200 dark:border-gray-700 rounded-[12px] font-['Inter:Regular',sans-serif] text-[16px] text-[rgba(18,21,14,0.71)] dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#0b6e4f] dark:focus:border-[#0b6e4f] transition-colors"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-['Inter:Medium',sans-serif] text-[14px] text-[rgba(18,21,14,0.71)] dark:text-gray-300">
              Подтвердите пароль
            </label>
            <div className="relative">
              <Lock className="absolute left-[16px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-gray-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Повторите пароль"
                className="w-full pl-[48px] pr-[16px] py-[14px] bg-white dark:bg-[rgba(20,20,20,0.95)] border border-gray-200 dark:border-gray-700 rounded-[12px] font-['Inter:Regular',sans-serif] text-[16px] text-[rgba(18,21,14,0.71)] dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#0b6e4f] dark:focus:border-[#0b6e4f] transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-[16px] rounded-[48px] font-['Inter:Medium',sans-serif] text-[16px] text-white bg-gradient-to-r from-[#0b6e4f] to-[#2c5a07] hover:shadow-[4px_4px_12px_0px_rgba(11,110,79,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-[32px] text-center">
          <p className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(18,21,14,0.71)] dark:text-gray-400">
            Уже есть аккаунт?{' '}
            <Link
              to="/login"
              className="text-[#0b6e4f] dark:text-[#0b6e4f] hover:underline font-['Inter:Medium',sans-serif]"
            >
              Войти
            </Link>
          </p>
          <Link
            to="/"
            className="inline-block mt-[16px] font-['Inter:Regular',sans-serif] text-[14px] text-gray-500 dark:text-gray-500 hover:text-[#0b6e4f] dark:hover:text-[#0b6e4f] transition-colors"
          >
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { ProfileTab } from '../components/ProfileTab';
import {
  User,
  LogOut,
  ShoppingBag,
  Crown,
  MessageCircle,
  CheckCircle,
  Package,
  TrendingUp,
  Calendar,
  FileText,
  Zap,
  Mail,
  Phone,
  MessageSquare,
  ChevronRight,
  Clock,
} from 'lucide-react';

// Типы данных
interface Order {
  id: string;
  service: string;
  type: 'website' | 'design' | 'subscription' | 'consulting' | 'seo';
  date: string;
  paymentStatus: 'paid' | 'pending' | 'partial';
  workStatus: 'queue' | 'in-progress' | 'review' | 'completed';
  progress: number;
  amount: number;
  description: string;
}

interface Subscription {
  plan: 'none' | 'basic' | 'pro' | 'enterprise';
  startDate?: string;
  endDate?: string;
  price?: number;
  features?: string[];
}

// Mock данные
const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    service: 'Разработка корпоративного сайта',
    type: 'website',
    date: '2025-02-15',
    paymentStatus: 'paid',
    workStatus: 'in-progress',
    progress: 65,
    amount: 150000,
    description: 'Корпоративный сайт с CMS и интеграцией',
  },
  {
    id: 'ORD-002',
    service: 'Редизайн landing page',
    type: 'design',
    date: '2025-03-01',
    paymentStatus: 'partial',
    workStatus: 'review',
    progress: 90,
    amount: 45000,
    description: 'Обновление дизайна посадочной страницы',
  },
  {
    id: 'ORD-003',
    service: 'SEO оптимизация',
    type: 'seo',
    date: '2025-01-10',
    paymentStatus: 'paid',
    workStatus: 'completed',
    progress: 100,
    amount: 30000,
    description: 'Комплексная SEO оптимизация сайта',
  },
  {
    id: 'ORD-004',
    service: 'Консультация по UX',
    type: 'consulting',
    date: '2025-02-28',
    paymentStatus: 'pending',
    workStatus: 'queue',
    progress: 0,
    amount: 15000,
    description: 'Аудит пользовательского опыта',
  },
];

const mockSubscription: Subscription = {
  plan: 'pro',
  startDate: '2025-01-01',
  endDate: '2025-12-31',
  price: 5000,
  features: [
    'Приоритетная поддержка',
    'Скидка 20% на все услуги',
    'Бесплатные консультации',
    'Ежемесячные отчеты',
  ],
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders] = useState<Order[]>(mockOrders);
  const [subscription] = useState<Subscription>(mockSubscription);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'pending':
        return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20';
      case 'partial':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getWorkStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'in-progress':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
      case 'review':
        return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20';
      case 'queue':
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Оплачено';
      case 'pending':
        return 'Ожидает оплаты';
      case 'partial':
        return 'Частичная оплата';
      default:
        return status;
    }
  };

  const getWorkStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Завершено';
      case 'in-progress':
        return 'В работе';
      case 'review':
        return 'На проверке';
      case 'queue':
        return 'В очереди';
      default:
        return status;
    }
  };

  const activeOrders = orders.filter((o) => o.workStatus !== 'completed');
  const completedOrders = orders.filter((o) => o.workStatus === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/70 to-[#fbfffa]/70 dark:from-[#0f0f0f]/70 dark:to-[#1a1a1a]/70 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-[rgba(30,30,30,0.95)] shadow-[8px_8px_20px_0px_rgba(0,0,0,0.1)] dark:shadow-[8px_8px_20px_0px_rgba(255,255,255,0.05)]">
        <div className="max-w-[1280px] mx-auto px-[24px] md:px-[48px] py-[24px] flex flex-col md:flex-row md:items-center justify-between gap-[16px]">
          <div>
            <h1 className="font-['Poppins:Medium',sans-serif] text-[24px] md:text-[32px] text-[rgba(18,21,14,0.71)] dark:text-white">
              Добро пожаловать, {user.name}!
            </h1>
            <p className="font-['Inter:Regular',sans-serif] text-[14px] text-gray-500 dark:text-gray-400 mt-[4px]">
              Управляйте своими заказами и подпиской
            </p>
          </div>
          <div className="flex items-center gap-[12px]">
            <button
              onClick={() => navigate('/')}
              className="px-[20px] py-[10px] rounded-[24px] font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(18,21,14,0.71)] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              На главную
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-[8px] px-[20px] py-[10px] rounded-[24px] font-['Inter:Medium',sans-serif] text-[14px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-[16px] h-[16px]" />
              <span className="hidden sm:inline">Выйти</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-[24px] md:px-[48px] py-[40px] md:py-[60px]">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-[24px] md:gap-[32px]">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[rgba(30,30,30,0.95)] rounded-[24px] shadow-[8px_8px_20px_0px_rgba(0,0,0,0.1)] dark:shadow-[8px_8px_20px_0px_rgba(255,255,255,0.05)] p-[24px] sticky top-[24px]">
              {/* User Info */}
              <div className="flex items-center gap-[12px] mb-[24px] pb-[24px] border-b border-gray-200 dark:border-gray-700">
                <div className="w-[48px] h-[48px] rounded-full overflow-hidden border-2 border-[#0b6e4f]">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-['Inter:Medium',sans-serif] text-[14px] text-[rgba(18,21,14,0.71)] dark:text-white truncate">
                    {user.name}
                  </p>
                  <p className="font-['Inter:Regular',sans-serif] text-[12px] text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex flex-col gap-[8px]">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] font-['Inter:Medium',sans-serif] text-[14px] transition-all ${
                    activeTab === 'overview'
                      ? 'bg-gradient-to-r from-[#0b6e4f] to-[#2c5a07] text-white shadow-lg'
                      : 'text-[rgba(18,21,14,0.71)] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <TrendingUp className="w-[18px] h-[18px]" />
                  Обзор
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] font-['Inter:Medium',sans-serif] text-[14px] transition-all ${
                    activeTab === 'orders'
                      ? 'bg-gradient-to-r from-[#0b6e4f] to-[#2c5a07] text-white shadow-lg'
                      : 'text-[rgba(18,21,14,0.71)] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <ShoppingBag className="w-[18px] h-[18px]" />
                  Мои заказы
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] font-['Inter:Medium',sans-serif] text-[14px] transition-all ${
                    activeTab === 'profile'
                      ? 'bg-gradient-to-r from-[#0b6e4f] to-[#2c5a07] text-white shadow-lg'
                      : 'text-[rgba(18,21,14,0.71)] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <User className="w-[18px] h-[18px]" />
                  Профиль
                </button>
                <button
                  onClick={() => setActiveTab('subscription')}
                  className={`flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] font-['Inter:Medium',sans-serif] text-[14px] transition-all ${
                    activeTab === 'subscription'
                      ? 'bg-gradient-to-r from-[#0b6e4f] to-[#2c5a07] text-white shadow-lg'
                      : 'text-[rgba(18,21,14,0.71)] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Crown className="w-[18px] h-[18px]" />
                  Подписка
                </button>
                <button
                  onClick={() => setActiveTab('support')}
                  className={`flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] font-['Inter:Medium',sans-serif] text-[14px] transition-all ${
                    activeTab === 'support'
                      ? 'bg-gradient-to-r from-[#0b6e4f] to-[#2c5a07] text-white shadow-lg'
                      : 'text-[rgba(18,21,14,0.71)] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <MessageCircle className="w-[18px] h-[18px]" />
                  Поддержка
                </button>
              </div>

              {/* Quick Help Button */}
              <div className="mt-[24px] pt-[24px] border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setActiveTab('support')}
                  className="w-full px-[16px] py-[12px] rounded-[12px] font-['Inter:Medium',sans-serif] text-[14px] text-white bg-gradient-to-r from-[#0b6e4f] to-[#2c5a07] hover:shadow-[4px_4px_12px_0px_rgba(11,110,79,0.3)] transition-all duration-300 active:scale-95"
                >
                  Нужна помощь?
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-[24px]">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
                  <div className="bg-white dark:bg-[rgba(30,30,30,0.95)] rounded-[16px] shadow-[8px_8px_20px_0px_rgba(0,0,0,0.1)] dark:shadow-[8px_8px_20px_0px_rgba(255,255,255,0.05)] p-[24px]">
                    <div className="flex items-start justify-between mb-[12px]">
                      <div className="w-[48px] h-[48px] rounded-[12px] bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                        <Package className="w-[24px] h-[24px] text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <p className="font-['Poppins:Medium',sans-serif] text-[28px] text-[rgba(18,21,14,0.71)] dark:text-white">
                      {activeOrders.length}
                    </p>
                    <p className="font-['Inter:Regular',sans-serif] text-[14px] text-gray-500 dark:text-gray-400">
                      Активных заказов
                    </p>
                  </div>

                  <div className="bg-white dark:bg-[rgba(30,30,30,0.95)] rounded-[16px] shadow-[8px_8px_20px_0px_rgba(0,0,0,0.1)] dark:shadow-[8px_8px_20px_0px_rgba(255,255,255,0.05)] p-[24px]">
                    <div className="flex items-start justify-between mb-[12px]">
                      <div className="w-[48px] h-[48px] rounded-[12px] bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                        <CheckCircle className="w-[24px] h-[24px] text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                    <p className="font-['Poppins:Medium',sans-serif] text-[28px] text-[rgba(18,21,14,0.71)] dark:text-white">
                      {completedOrders.length}
                    </p>
                    <p className="font-['Inter:Regular',sans-serif] text-[14px] text-gray-500 dark:text-gray-400">
                      Завершено
                    </p>
                  </div>

                  <div className="bg-white dark:bg-[rgba(30,30,30,0.95)] rounded-[16px] shadow-[8px_8px_20px_0px_rgba(0,0,0,0.1)] dark:shadow-[8px_8px_20px_0px_rgba(255,255,255,0.05)] p-[24px]">
                    <div className="flex items-start justify-between mb-[12px]">
                      <div className="w-[48px] h-[48px] rounded-[12px] bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                        <Crown className="w-[24px] h-[24px] text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                    <p className="font-['Poppins:Medium',sans-serif] text-[28px] text-[rgba(18,21,14,0.71)] dark:text-white capitalize">
                      {subscription.plan}
                    </p>
                    <p className="font-['Inter:Regular',sans-serif] text-[14px] text-gray-500 dark:text-gray-400">
                      Текущая подписка
                    </p>
                  </div>
                </div>

                {/* Active Orders */}
                <div className="bg-white dark:bg-[rgba(30,30,30,0.95)] rounded-[24px] shadow-[8px_8px_20px_0px_rgba(0,0,0,0.1)] dark:shadow-[8px_8px_20px_0px_rgba(255,255,255,0.05)] p-[32px]">
                  <div className="flex items-center justify-between mb-[24px]">
                    <h3 className="font-['Poppins:Medium',sans-serif] text-[24px] text-[rgba(18,21,14,0.71)] dark:text-white">
                      Активные заказы
                    </h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="flex items-center gap-[8px] text-[#0b6e4f] hover:underline font-['Inter:Medium',sans-serif] text-[14px]"
                    >
                      Все заказы
                      <ChevronRight className="w-[16px] h-[16px]" />
                    </button>
                  </div>

                  <div className="space-y-[16px]">
                    {activeOrders.length > 0 ? (
                      activeOrders.map((order) => (
                        <div
                          key={order.id}
                          className="p-[20px] bg-gray-50 dark:bg-[rgba(20,20,20,0.5)] rounded-[16px] border border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-[16px] mb-[16px]">
                            <div className="flex-1">
                              <div className="flex items-start gap-[12px] mb-[8px]">
                                <p className="font-['Inter:Medium',sans-serif] text-[16px] text-[rgba(18,21,14,0.71)] dark:text-white">
                                  {order.service}
                                </p>
                              </div>
                              <p className="font-['Inter:Regular',sans-serif] text-[14px] text-gray-500 dark:text-gray-400 mb-[12px]">
                                {order.description}
                              </p>
                              <div className="flex flex-wrap gap-[8px]">
                                <span
                                  className={`px-[12px] py-[4px] rounded-[8px] font-['Inter:Medium',sans-serif] text-[12px] ${getPaymentStatusColor(
                                    order.paymentStatus
                                  )}`}
                                >
                                  {getPaymentStatusText(order.paymentStatus)}
                                </span>
                                <span
                                  className={`px-[12px] py-[4px] rounded-[8px] font-['Inter:Medium',sans-serif] text-[12px] ${getWorkStatusColor(
                                    order.workStatus
                                  )}`}
                                >
                                  {getWorkStatusText(order.workStatus)}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-['Poppins:Medium',sans-serif] text-[20px] text-[rgba(18,21,14,0.71)] dark:text-white mb-[4px]">
                                {order.amount.toLocaleString('ru-RU')} ₽
                              </p>
                              <p className="font-['Inter:Regular',sans-serif] text-[12px] text-gray-500 dark:text-gray-400">
                                {new Date(order.date).toLocaleDateString('ru-RU')}
                              </p>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div>
                            <div className="flex items-center justify-between mb-[8px]">
                              <p className="font-['Inter:Medium',sans-serif] text-[12px] text-gray-600 dark:text-gray-400">
                                Прогресс выполнения
                              </p>
                              <p className="font-['Inter:Medium',sans-serif] text-[12px] text-[#0b6e4f]">
                                {order.progress}%
                              </p>
                            </div>
                            <div className="w-full h-[8px] bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#0b6e4f] to-[#2c5a07] transition-all duration-500"
                                style={{ width: `${order.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-[40px]">
                        <Package className="w-[48px] h-[48px] text-gray-300 dark:text-gray-600 mx-auto mb-[16px]" />
                        <p className="font-['Inter:Regular',sans-serif] text-[16px] text-gray-500 dark:text-gray-400">
                          У вас пока нет активных заказов
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white dark:bg-[rgba(30,30,30,0.95)] rounded-[24px] shadow-[8px_8px_20px_0px_rgba(0,0,0,0.1)] dark:shadow-[8px_8px_20px_0px_rgba(255,255,255,0.05)] p-[32px]">
                <h3 className="font-['Poppins:Medium',sans-serif] text-[28px] text-[rgba(18,21,14,0.71)] dark:text-white mb-[24px]">
                  Все заказы
                </h3>

                <div className="space-y-[16px]">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-[24px] bg-gray-50 dark:bg-[rgba(20,20,20,0.5)] rounded-[16px] border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-[16px]">
                        <div className="flex-1">
                          <div className="flex items-center gap-[12px] mb-[8px]">
                            <span className="px-[12px] py-[4px] bg-gray-200 dark:bg-gray-700 rounded-[8px] font-['Inter:Medium',sans-serif] text-[12px] text-gray-600 dark:text-gray-400">
                              {order.id}
                            </span>
                            <span className="font-['Inter:Regular',sans-serif] text-[12px] text-gray-500 dark:text-gray-400">
                              {new Date(order.date).toLocaleDateString('ru-RU', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <p className="font-['Inter:Medium',sans-serif] text-[18px] text-[rgba(18,21,14,0.71)] dark:text-white mb-[8px]">
                            {order.service}
                          </p>
                          <p className="font-['Inter:Regular',sans-serif] text-[14px] text-gray-500 dark:text-gray-400 mb-[12px]">
                            {order.description}
                          </p>
                          <div className="flex flex-wrap gap-[8px]">
                            <span
                              className={`px-[12px] py-[4px] rounded-[8px] font-['Inter:Medium',sans-serif] text-[12px] ${getPaymentStatusColor(
                                order.paymentStatus
                              )}`}
                            >
                              {getPaymentStatusText(order.paymentStatus)}
                            </span>
                            <span
                              className={`px-[12px] py-[4px] rounded-[8px] font-['Inter:Medium',sans-serif] text-[12px] ${getWorkStatusColor(
                                order.workStatus
                              )}`}
                            >
                              {getWorkStatusText(order.workStatus)}
                            </span>
                          </div>
                        </div>

                        <div className="lg:text-right">
                          <p className="font-['Poppins:Medium',sans-serif] text-[24px] text-[rgba(18,21,14,0.71)] dark:text-white mb-[8px]">
                            {order.amount.toLocaleString('ru-RU')} ₽
                          </p>
                          {order.workStatus !== 'completed' && (
                            <div className="mt-[12px]">
                              <div className="flex items-center justify-between lg:justify-end gap-[12px] mb-[8px]">
                                <p className="font-['Inter:Medium',sans-serif] text-[12px] text-gray-600 dark:text-gray-400">
                                  Прогресс:
                                </p>
                                <p className="font-['Inter:Medium',sans-serif] text-[12px] text-[#0b6e4f]">
                                  {order.progress}%
                                </p>
                              </div>
                              <div className="w-full lg:w-[200px] h-[6px] bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-[#0b6e4f] to-[#2c5a07]"
                                  style={{ width: `${order.progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && <ProfileTab />}

            {/* Subscription Tab */}
            {activeTab === 'subscription' && (
              <div className="space-y-[24px]">
                {subscription.plan !== 'none' ? (
                  <>
                    {/* Current Subscription */}
                    <div className="bg-gradient-to-br from-[#0b6e4f] to-[#2c5a07] rounded-[24px] shadow-[8px_8px_20px_0px_rgba(11,110,79,0.3)] p-[32px] text-white">
                      <div className="flex items-start justify-between mb-[24px]">
                        <div>
                          <div className="flex items-center gap-[12px] mb-[8px]">
                            <Crown className="w-[32px] h-[32px]" />
                            <h3 className="font-['Poppins:Medium',sans-serif] text-[32px] capitalize">
                              {subscription.plan}
                            </h3>
                          </div>
                          <p className="font-['Inter:Regular',sans-serif] text-[16px] opacity-90">
                            Ваша текущая подписка
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-['Poppins:Medium',sans-serif] text-[36px]">
                            {subscription.price?.toLocaleString('ru-RU')} ₽
                          </p>
                          <p className="font-['Inter:Regular',sans-serif] text-[14px] opacity-90">в месяц</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] mb-[24px]">
                        <div className="flex items-center gap-[12px]">
                          <Calendar className="w-[20px] h-[20px]" />
                          <div>
                            <p className="font-['Inter:Regular',sans-serif] text-[12px] opacity-75">
                              Начало
                            </p>
                            <p className="font-['Inter:Medium',sans-serif] text-[14px]">
                              {subscription.startDate &&
                                new Date(subscription.startDate).toLocaleDateString('ru-RU')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-[12px]">
                          <Clock className="w-[20px] h-[20px]" />
                          <div>
                            <p className="font-['Inter:Regular',sans-serif] text-[12px] opacity-75">
                              Окончание
                            </p>
                            <p className="font-['Inter:Medium',sans-serif] text-[14px]">
                              {subscription.endDate &&
                                new Date(subscription.endDate).toLocaleDateString('ru-RU')}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-[12px] mb-[24px]">
                        {subscription.features?.map((feature, index) => (
                          <div key={index} className="flex items-center gap-[12px]">
                            <CheckCircle className="w-[20px] h-[20px]" />
                            <p className="font-['Inter:Regular',sans-serif] text-[15px]">{feature}</p>
                          </div>
                        ))}
                      </div>

                      <button className="w-full md:w-auto px-[32px] py-[14px] rounded-[48px] font-['Inter:Medium',sans-serif] text-[16px] bg-white text-[#0b6e4f] hover:bg-gray-100 transition-all duration-300 active:scale-95">
                        Управление подпиской
                      </button>
                    </div>

                    {/* Upgrade Options */}
                    <div className="bg-white dark:bg-[rgba(30,30,30,0.95)] rounded-[24px] shadow-[8px_8px_20px_0px_rgba(0,0,0,0.1)] dark:shadow-[8px_8px_20px_0px_rgba(255,255,255,0.05)] p-[32px]">
                      <h3 className="font-['Poppins:Medium',sans-serif] text-[24px] text-[rgba(18,21,14,0.71)] dark:text-white mb-[16px]">
                        Доступные улучшения
                      </h3>
                      <p className="font-['Inter:Regular',sans-serif] text-[16px] text-gray-500 dark:text-gray-400 mb-[24px]">
                        Откройте больше возможностей с расширенными планами
                      </p>
                      <button className="px-[24px] py-[12px] rounded-[48px] font-['Inter:Medium',sans-serif] text-[14px] text-[#0b6e4f] border border-[#0b6e4f] hover:bg-[#0b6e4f] hover:text-white transition-all duration-300">
                        Посмотреть планы
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="bg-white dark:bg-[rgba(30,30,30,0.95)] rounded-[24px] shadow-[8px_8px_20px_0px_rgba(0,0,0,0.1)] dark:shadow-[8px_8px_20px_0px_rgba(255,255,255,0.05)] p-[48px] text-center">
                    <Crown className="w-[64px] h-[64px] text-gray-300 dark:text-gray-600 mx-auto mb-[24px]" />
                    <h3 className="font-['Poppins:Medium',sans-serif] text-[28px] text-[rgba(18,21,14,0.71)] dark:text-white mb-[16px]">
                      У вас пока нет подписки
                    </h3>
                    <p className="font-['Inter:Regular',sans-serif] text-[16px] text-gray-500 dark:text-gray-400 mb-[32px] max-w-[500px] mx-auto">
                      Оформите подписку и получите приоритетную поддержку, скидки на все услуги и
                      эксклюзивный доступ к новым функциям
                    </p>
                    <button className="px-[32px] py-[14px] rounded-[48px] font-['Inter:Medium',sans-serif] text-[16px] text-white bg-gradient-to-r from-[#0b6e4f] to-[#2c5a07] hover:shadow-[4px_4px_12px_0px_rgba(11,110,79,0.3)] transition-all duration-300 active:scale-95">
                      Выбрать подписку
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Support Tab */}
            {activeTab === 'support' && (
              <div className="space-y-[24px]">
                <div className="bg-white dark:bg-[rgba(30,30,30,0.95)] rounded-[24px] shadow-[8px_8px_20px_0px_rgba(0,0,0,0.1)] dark:shadow-[8px_8px_20px_0px_rgba(255,255,255,0.05)] p-[32px]">
                  <h3 className="font-['Poppins:Medium',sans-serif] text-[28px] text-[rgba(18,21,14,0.71)] dark:text-white mb-[16px]">
                    Нужна помощь?
                  </h3>
                  <p className="font-['Inter:Regular',sans-serif] text-[16px] text-gray-500 dark:text-gray-400 mb-[32px]">
                    Мы всегда готовы помочь вам. Выберите удобный способ связи
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] mb-[32px]">
                    <button className="flex items-start gap-[16px] p-[24px] bg-gray-50 dark:bg-[rgba(20,20,20,0.5)] rounded-[16px] border border-gray-200 dark:border-gray-700 hover:border-[#0b6e4f] dark:hover:border-[#0b6e4f] transition-all text-left">
                      <div className="w-[48px] h-[48px] rounded-[12px] bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-[24px] h-[24px] text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-['Inter:Medium',sans-serif] text-[16px] text-[rgba(18,21,14,0.71)] dark:text-white mb-[4px]">
                          Email
                        </p>
                        <p className="font-['Inter:Regular',sans-serif] text-[14px] text-gray-500 dark:text-gray-400 mb-[8px]">
                          Ответим в течение 24 часов
                        </p>
                        <p className="font-['Inter:Medium',sans-serif] text-[14px] text-[#0b6e4f]">
                          support@example.com
                        </p>
                      </div>
                    </button>

                    <button className="flex items-start gap-[16px] p-[24px] bg-gray-50 dark:bg-[rgba(20,20,20,0.5)] rounded-[16px] border border-gray-200 dark:border-gray-700 hover:border-[#0b6e4f] dark:hover:border-[#0b6e4f] transition-all text-left">
                      <div className="w-[48px] h-[48px] rounded-[12px] bg-green-50 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-[24px] h-[24px] text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-['Inter:Medium',sans-serif] text-[16px] text-[rgba(18,21,14,0.71)] dark:text-white mb-[4px]">
                          Телефон
                        </p>
                        <p className="font-['Inter:Regular',sans-serif] text-[14px] text-gray-500 dark:text-gray-400 mb-[8px]">
                          Пн-Пт с 9:00 до 18:00
                        </p>
                        <p className="font-['Inter:Medium',sans-serif] text-[14px] text-[#0b6e4f]">
                          +7 (999) 123-45-67
                        </p>
                      </div>
                    </button>

                    <button className="flex items-start gap-[16px] p-[24px] bg-gray-50 dark:bg-[rgba(20,20,20,0.5)] rounded-[16px] border border-gray-200 dark:border-gray-700 hover:border-[#0b6e4f] dark:hover:border-[#0b6e4f] transition-all text-left">
                      <div className="w-[48px] h-[48px] rounded-[12px] bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-[24px] h-[24px] text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-['Inter:Medium',sans-serif] text-[16px] text-[rgba(18,21,14,0.71)] dark:text-white mb-[4px]">
                          Онлайн-чат
                        </p>
                        <p className="font-['Inter:Regular',sans-serif] text-[14px] text-gray-500 dark:text-gray-400 mb-[8px]">
                          Моментальный ответ
                        </p>
                        <p className="font-['Inter:Medium',sans-serif] text-[14px] text-[#0b6e4f]">
                          Начать чат
                        </p>
                      </div>
                    </button>

                    <button className="flex items-start gap-[16px] p-[24px] bg-gray-50 dark:bg-[rgba(20,20,20,0.5)] rounded-[16px] border border-gray-200 dark:border-gray-700 hover:border-[#0b6e4f] dark:hover:border-[#0b6e4f] transition-all text-left">
                      <div className="w-[48px] h-[48px] rounded-[12px] bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-[24px] h-[24px] text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="font-['Inter:Medium',sans-serif] text-[16px] text-[rgba(18,21,14,0.71)] dark:text-white mb-[4px]">
                          База знаний
                        </p>
                        <p className="font-['Inter:Regular',sans-serif] text-[14px] text-gray-500 dark:text-gray-400 mb-[8px]">
                          Ответы на частые вопросы
                        </p>
                        <p className="font-['Inter:Medium',sans-serif] text-[14px] text-[#0b6e4f]">
                          Перейти
                        </p>
                      </div>
                    </button>
                  </div>

                  <div className="p-[24px] bg-gradient-to-r from-[#0b6e4f]/10 to-[#2c5a07]/10 rounded-[16px] border border-[#0b6e4f]/20">
                    <div className="flex items-start gap-[16px]">
                      <div className="w-[48px] h-[48px] rounded-[12px] bg-[#0b6e4f] flex items-center justify-center flex-shrink-0">
                        <Zap className="w-[24px] h-[24px] text-white" />
                      </div>
                      <div>
                        <p className="font-['Inter:Medium',sans-serif] text-[18px] text-[rgba(18,21,14,0.71)] dark:text-white mb-[8px]">
                          Приоритетная поддержка
                        </p>
                        <p className="font-['Inter:Regular',sans-serif] text-[14px] text-gray-600 dark:text-gray-400 mb-[16px]">
                          Оформите подписку Pro или Enterprise для получения приоритетной поддержки 24/7 с
                          персональным менеджером
                        </p>
                        <button className="px-[24px] py-[10px] rounded-[48px] font-['Inter:Medium',sans-serif] text-[14px] text-white bg-gradient-to-r from-[#0b6e4f] to-[#2c5a07] hover:shadow-[4px_4px_12px_0px_rgba(11,110,79,0.3)] transition-all duration-300 active:scale-95">
                          Узнать больше
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

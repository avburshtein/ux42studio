import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Camera,
  Save,
  X,
  Mail,
  Phone,
  Building2,
  MapPin,
  Briefcase,
  User,
  Calendar,
  CheckCircle,
} from 'lucide-react';

export function ProfileTab() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: user?.company || '',
    position: user?.position || '',
    address: user?.address || '',
  });

  if (!user) return null;

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateProfile({ avatar: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Имитация задержки

    updateProfile({
      name: formData.name,
      phone: formData.phone,
      company: formData.company,
      position: formData.position,
      address: formData.address,
    });

    setIsSaving(false);
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      company: user.company || '',
      position: user.position || '',
      address: user.address || '',
    });
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-[24px]">
      {/* Success Message */}
      {showSuccess && (
        <div className="p-[16px] bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-[16px] flex items-center gap-[12px]">
          <CheckCircle className="w-[20px] h-[20px] text-green-600 dark:text-green-400 flex-shrink-0" />
          <p className="font-['Inter:Medium',sans-serif] text-[14px] text-green-600 dark:text-green-400">
            Изменения успешно сохранены!
          </p>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white dark:bg-[rgba(30,30,30,0.95)] rounded-[24px] shadow-[8px_8px_20px_0px_rgba(0,0,0,0.1)] dark:shadow-[8px_8px_20px_0px_rgba(255,255,255,0.05)] p-[32px]">
        <div className="flex items-start justify-between mb-[32px]">
          <h3 className="font-['Poppins:Medium',sans-serif] text-[28px] text-[rgba(18,21,14,0.71)] dark:text-white">
            Личная информация
          </h3>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-[20px] py-[10px] rounded-[48px] font-['Inter:Medium',sans-serif] text-[14px] text-[#0b6e4f] border border-[#0b6e4f] hover:bg-[#0b6e4f] hover:text-white transition-all duration-300"
            >
              Редактировать
            </button>
          ) : (
            <div className="flex gap-[12px]">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-[8px] px-[20px] py-[10px] rounded-[48px] font-['Inter:Medium',sans-serif] text-[14px] text-white bg-gradient-to-r from-[#0b6e4f] to-[#2c5a07] hover:shadow-[4px_4px_12px_0px_rgba(11,110,79,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-[16px] h-[16px]" />
                {isSaving ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center gap-[8px] px-[20px] py-[10px] rounded-[48px] font-['Inter:Medium',sans-serif] text-[14px] text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              >
                <X className="w-[16px] h-[16px]" />
                Отмена
              </button>
            </div>
          )}
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-[40px] pb-[40px] border-b border-gray-200 dark:border-gray-700">
          <div className="relative group">
            <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-4 border-[#0b6e4f] shadow-lg">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            {isEditing && (
              <button
                onClick={handleAvatarClick}
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="w-[32px] h-[32px] text-white" />
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <p className="font-['Inter:Regular',sans-serif] text-[14px] text-gray-500 dark:text-gray-400 mt-[12px] text-center">
            {isEditing
              ? 'Нажмите на фото для изменения'
              : 'Перейдите в режим редактирования для смены фото'}
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-[24px]">
          {/* Name */}
          <div>
            <label className="flex items-center gap-[8px] font-['Inter:Medium',sans-serif] text-[14px] text-gray-500 dark:text-gray-400 mb-[8px]">
              <User className="w-[16px] h-[16px]" />
              ФИО
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-[16px] py-[12px] bg-white dark:bg-[rgba(20,20,20,0.95)] border border-gray-200 dark:border-gray-700 rounded-[12px] font-['Inter:Regular',sans-serif] text-[16px] text-[rgba(18,21,14,0.71)] dark:text-white focus:outline-none focus:border-[#0b6e4f] transition-colors"
                placeholder="Введите ФИО"
              />
            ) : (
              <p className="font-['Inter:Regular',sans-serif] text-[18px] text-[rgba(18,21,14,0.71)] dark:text-white">
                {user.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-[8px] font-['Inter:Medium',sans-serif] text-[14px] text-gray-500 dark:text-gray-400 mb-[8px]">
              <Mail className="w-[16px] h-[16px]" />
              Email
            </label>
            <p className="font-['Inter:Regular',sans-serif] text-[18px] text-[rgba(18,21,14,0.71)] dark:text-white">
              {user.email}
            </p>
            <p className="font-['Inter:Regular',sans-serif] text-[12px] text-gray-500 dark:text-gray-400 mt-[4px]">
              Email нельзя изменить
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-[8px] font-['Inter:Medium',sans-serif] text-[14px] text-gray-500 dark:text-gray-400 mb-[8px]">
              <Phone className="w-[16px] h-[16px]" />
              Телефон
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-[16px] py-[12px] bg-white dark:bg-[rgba(20,20,20,0.95)] border border-gray-200 dark:border-gray-700 rounded-[12px] font-['Inter:Regular',sans-serif] text-[16px] text-[rgba(18,21,14,0.71)] dark:text-white focus:outline-none focus:border-[#0b6e4f] transition-colors"
                placeholder="+7 (999) 123-45-67"
              />
            ) : (
              <p className="font-['Inter:Regular',sans-serif] text-[18px] text-[rgba(18,21,14,0.71)] dark:text-white">
                {user.phone || 'Не указан'}
              </p>
            )}
          </div>

          {/* Company */}
          <div>
            <label className="flex items-center gap-[8px] font-['Inter:Medium',sans-serif] text-[14px] text-gray-500 dark:text-gray-400 mb-[8px]">
              <Building2 className="w-[16px] h-[16px]" />
              Компания
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-[16px] py-[12px] bg-white dark:bg-[rgba(20,20,20,0.95)] border border-gray-200 dark:border-gray-700 rounded-[12px] font-['Inter:Regular',sans-serif] text-[16px] text-[rgba(18,21,14,0.71)] dark:text-white focus:outline-none focus:border-[#0b6e4f] transition-colors"
                placeholder="Название компании"
              />
            ) : (
              <p className="font-['Inter:Regular',sans-serif] text-[18px] text-[rgba(18,21,14,0.71)] dark:text-white">
                {user.company || 'Не указана'}
              </p>
            )}
          </div>

          {/* Position */}
          <div>
            <label className="flex items-center gap-[8px] font-['Inter:Medium',sans-serif] text-[14px] text-gray-500 dark:text-gray-400 mb-[8px]">
              <Briefcase className="w-[16px] h-[16px]" />
              Должность
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-[16px] py-[12px] bg-white dark:bg-[rgba(20,20,20,0.95)] border border-gray-200 dark:border-gray-700 rounded-[12px] font-['Inter:Regular',sans-serif] text-[16px] text-[rgba(18,21,14,0.71)] dark:text-white focus:outline-none focus:border-[#0b6e4f] transition-colors"
                placeholder="Ваша должность"
              />
            ) : (
              <p className="font-['Inter:Regular',sans-serif] text-[18px] text-[rgba(18,21,14,0.71)] dark:text-white">
                {user.position || 'Не указана'}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="flex items-center gap-[8px] font-['Inter:Medium',sans-serif] text-[14px] text-gray-500 dark:text-gray-400 mb-[8px]">
              <MapPin className="w-[16px] h-[16px]" />
              Адрес
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-[16px] py-[12px] bg-white dark:bg-[rgba(20,20,20,0.95)] border border-gray-200 dark:border-gray-700 rounded-[12px] font-['Inter:Regular',sans-serif] text-[16px] text-[rgba(18,21,14,0.71)] dark:text-white focus:outline-none focus:border-[#0b6e4f] transition-colors"
                placeholder="Ваш адрес"
              />
            ) : (
              <p className="font-['Inter:Regular',sans-serif] text-[18px] text-[rgba(18,21,14,0.71)] dark:text-white">
                {user.address || 'Не указан'}
              </p>
            )}
          </div>

          {/* Registration Date */}
          <div className="pt-[24px] border-t border-gray-200 dark:border-gray-700">
            <label className="flex items-center gap-[8px] font-['Inter:Medium',sans-serif] text-[14px] text-gray-500 dark:text-gray-400 mb-[8px]">
              <Calendar className="w-[16px] h-[16px]" />
              Дата регистрации
            </label>
            <p className="font-['Inter:Regular',sans-serif] text-[18px] text-[rgba(18,21,14,0.71)] dark:text-white">
              {formatDate(user.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

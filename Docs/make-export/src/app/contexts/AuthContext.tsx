import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  company?: string;
  position?: string;
  address?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Проверяем localStorage при загрузке
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Имитация задержки API
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Проверяем существующих пользователей
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((u: any) => u.email === email && u.password === password);

    if (existingUser) {
      const userData = {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        avatar: existingUser.avatar,
        createdAt: existingUser.createdAt,
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      throw new Error('Неверный email или пароль');
    }
  };

  const register = async (email: string, password: string, name: string) => {
    // Имитация задержки API
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Проверяем, существует ли пользователь
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find((u: any) => u.email === email)) {
      throw new Error('Пользователь с таким email уже существует');
    }

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      password, // В реальном приложении пароли должны быть захешированы!
      name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0b6e4f&color=fff&size=200`,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    const userData = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      avatar: newUser.avatar,
      createdAt: newUser.createdAt,
    };

    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // Обновляем в списке пользователей
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...data };
      localStorage.setItem('users', JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  createdAt: string;
}

interface Investment {
  id: string;
  userId: string;
  amount: number;
  percentage: number;
  status: 'pending' | 'paid' | 'active';
  createdAt: string;
  paymentMethod?: 'yoomoney' | 'telegram';
}

interface AuthContextType {
  user: User | null;
  investments: Investment[];
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  addInvestment: (amount: number, paymentMethod: 'yoomoney' | 'telegram') => Promise<void>;
  updateInvestmentStatus: (id: string, status: Investment['status']) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);

  useEffect(() => {
    // Проверяем сохраненного пользователя
    const savedUser = localStorage.getItem('cosmo_user');
    const savedInvestments = localStorage.getItem('cosmo_investments');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedInvestments) {
      setInvestments(JSON.parse(savedInvestments));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Симуляция входа (в реальном проекте здесь будет Supabase)
    const userData: User = {
      id: Math.random().toString(36),
      email,
      createdAt: new Date().toISOString()
    };
    
    setUser(userData);
    localStorage.setItem('cosmo_user', JSON.stringify(userData));
  };

  const register = async (email: string, password: string) => {
    // Симуляция регистрации (в реальном проекте здесь будет Supabase)
    const userData: User = {
      id: Math.random().toString(36),
      email,
      createdAt: new Date().toISOString()
    };
    
    setUser(userData);
    localStorage.setItem('cosmo_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setInvestments([]);
    localStorage.removeItem('cosmo_user');
    localStorage.removeItem('cosmo_investments');
  };

  const addInvestment = async (amount: number, paymentMethod: 'yoomoney' | 'telegram') => {
    if (!user) return;
    
    const percentage = (amount / 50000000) * 100; // Расчет процента от общей суммы проекта
    
    const newInvestment: Investment = {
      id: Math.random().toString(36),
      userId: user.id,
      amount,
      percentage,
      status: 'pending',
      createdAt: new Date().toISOString(),
      paymentMethod
    };
    
    const updatedInvestments = [...investments, newInvestment];
    setInvestments(updatedInvestments);
    localStorage.setItem('cosmo_investments', JSON.stringify(updatedInvestments));
  };

  const updateInvestmentStatus = (id: string, status: Investment['status']) => {
    const updatedInvestments = investments.map(inv => 
      inv.id === id ? { ...inv, status } : inv
    );
    setInvestments(updatedInvestments);
    localStorage.setItem('cosmo_investments', JSON.stringify(updatedInvestments));
  };

  return (
    <AuthContext.Provider value={{
      user,
      investments,
      login,
      register,
      logout,
      addInvestment,
      updateInvestmentStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

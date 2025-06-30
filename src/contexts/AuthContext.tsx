
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  full_name?: string;
  phone?: string;
  address?: string;
  birth_date?: string;
  avatar_url?: string;
  telegram_username?: string;
  whatsapp_number?: string;
}

interface Investment {
  id: string;
  userId: string;
  amount: number;
  percentage: number;
  status: 'pending' | 'paid' | 'active';
  createdAt: string;
  paymentMethod?: 'yoomoney' | 'telegram' | 'usdt' | 'card';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  investments: Investment[];
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  addInvestment: (amount: number, paymentMethod: Investment['paymentMethod']) => Promise<void>;
  updateInvestmentStatus: (id: string, status: Investment['status']) => void;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  uploadPaymentConfirmation: (investmentId: string, file: File) => Promise<void>;
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
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);

  useEffect(() => {
    // Настраиваем слушатель изменений аутентификации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Загружаем профиль пользователя
          setTimeout(() => {
            loadUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setInvestments([]);
        }
      }
    );

    // Проверяем существующую сессию
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
    });

    // Загружаем инвестиции из localStorage
    const savedInvestments = localStorage.getItem('cosmo_investments');
    if (savedInvestments) {
      setInvestments(JSON.parse(savedInvestments));
    }

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
  };

  const register = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName
        }
      }
    });
    
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setInvestments([]);
    localStorage.removeItem('cosmo_investments');
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profileData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...profileData } : null);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const addInvestment = async (amount: number, paymentMethod: Investment['paymentMethod']) => {
    if (!user) return;
    
    const percentage = (amount / 50000000) * 100;
    
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

  const uploadPaymentConfirmation = async (investmentId: string, file: File) => {
    if (!user) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${investmentId}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('payment-confirmations')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('payment_confirmations')
        .insert({
          user_id: user.id,
          investment_id: investmentId,
          file_url: fileName,
          file_name: file.name
        });

      if (dbError) throw dbError;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      investments,
      login,
      register,
      logout,
      addInvestment,
      updateInvestmentStatus,
      updateProfile,
      uploadPaymentConfirmation
    }}>
      {children}
    </AuthContext.Provider>
  );
};

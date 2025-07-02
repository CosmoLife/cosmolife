
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
  usdt_wallet?: string;
  role?: 'user' | 'admin';
}

interface Investment {
  id: string;
  user_id: string;
  amount: number;
  percentage: number;
  status: 'pending' | 'under_review' | 'paid' | 'active' | 'rejected';
  payment_method?: 'yoomoney' | 'usdt' | 'card';
  transaction_hash?: string;
  admin_notes?: string;
  received_income?: number;
  created_at: string;
  updated_at: string;
}

interface ShareSaleRequest {
  id: string;
  user_id: string;
  share_percentage: number;
  usdt_wallet: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at: string;
}

interface IncomeTransaction {
  id: string;
  user_id: string;
  amount: number;
  transaction_hash?: string;
  admin_notes?: string;
  created_at: string;
  created_by?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  investments: Investment[];
  shareSaleRequests: ShareSaleRequest[];
  incomeTransactions: IncomeTransaction[];
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  addInvestment: (amount: number, paymentMethod: Investment['payment_method']) => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  uploadPaymentConfirmation: (investmentId: string, file: File, transactionHash?: string) => Promise<void>;
  createShareSaleRequest: (sharePercentage: number, usdtWallet: string) => Promise<void>;
  getIncomeTransactions: () => Promise<IncomeTransaction[]>;
  // Admin functions
  getAllInvestments: () => Promise<Investment[]>;
  updateInvestmentStatus: (id: string, status: Investment['status'], adminNotes?: string) => Promise<void>;
  updateInvestmentIncome: (id: string, receivedIncome: number) => Promise<void>;
  getAllShareSaleRequests: () => Promise<ShareSaleRequest[]>;
  updateShareSaleRequestStatus: (id: string, status: ShareSaleRequest['status'], adminNotes?: string) => Promise<void>;
  updateOfferText: (text: string) => Promise<void>;
  getOfferText: () => Promise<string>;
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
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [shareSaleRequests, setShareSaleRequests] = useState<ShareSaleRequest[]>([]);
  const [incomeTransactions, setIncomeTransactions] = useState<IncomeTransaction[]>([]);

  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            loadUserProfile(session.user.id);
            loadUserInvestments(session.user.id);
            loadUserShareSaleRequests(session.user.id);
            loadUserIncomeTransactions(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setInvestments([]);
          setShareSaleRequests([]);
          setIncomeTransactions([]);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        loadUserProfile(session.user.id);
        loadUserInvestments(session.user.id);
        loadUserShareSaleRequests(session.user.id);
        loadUserIncomeTransactions(session.user.id);
      }
    });

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

  const loadUserInvestments = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading investments:', error);
        return;
      }

      // Cast the status and payment_method fields to match our interface
      const typedInvestments = (data || []).map(investment => ({
        ...investment,
        status: investment.status as Investment['status'],
        payment_method: investment.payment_method as Investment['payment_method']
      }));

      setInvestments(typedInvestments);
    } catch (error) {
      console.error('Error loading investments:', error);
    }
  };

  const loadUserShareSaleRequests = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('share_sale_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading share sale requests:', error);
        return;
      }

      // Cast the status field to match our interface
      const typedRequests = (data || []).map(request => ({
        ...request,
        status: request.status as ShareSaleRequest['status']
      }));

      setShareSaleRequests(typedRequests);
    } catch (error) {
      console.error('Error loading share sale requests:', error);
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
    setShareSaleRequests([]);
    setIncomeTransactions([]);
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

  const addInvestment = async (amount: number, paymentMethod: Investment['payment_method']) => {
    if (!user) return;
    
    // Исправленный расчет: 50,000 = 0.01% (50,000 / 5,000,000 = 0.01)
    const percentage = (amount / 5000000) * 100;
    
    const { error } = await supabase
      .from('investments')
      .insert({
        user_id: user.id,
        amount,
        percentage,
        status: 'pending',
        payment_method: paymentMethod
      });

    if (error) throw error;

    await loadUserInvestments(user.id);
  };

  const uploadPaymentConfirmation = async (investmentId: string, file: File, transactionHash?: string) => {
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
          file_name: file.name,
          transaction_hash: transactionHash,
          status: 'pending'
        });

      if (dbError) throw dbError;

      // Обновляем статус инвестиции на "на проверке"
      await supabase
        .from('investments')
        .update({ status: 'under_review' })
        .eq('id', investmentId);

      await loadUserInvestments(user.id);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const createShareSaleRequest = async (sharePercentage: number, usdtWallet: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('share_sale_requests')
      .insert({
        user_id: user.id,
        share_percentage: sharePercentage,
        usdt_wallet: usdtWallet,
        status: 'pending'
      });

    if (error) throw error;

    await loadUserShareSaleRequests(user.id);
  };

  const loadUserIncomeTransactions = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('income_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading income transactions:', error);
        return;
      }

      setIncomeTransactions(data || []);
    } catch (error) {
      console.error('Error loading income transactions:', error);
    }
  };

  const getIncomeTransactions = async (): Promise<IncomeTransaction[]> => {
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('income_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting income transactions:', error);
      return [];
    }

    return data || [];
  };

  // Admin functions
  const getAllInvestments = async (): Promise<Investment[]> => {
    const { data, error } = await supabase
      .from('investments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Cast the status and payment_method fields to match our interface
    return (data || []).map(investment => ({
      ...investment,
      status: investment.status as Investment['status'],
      payment_method: investment.payment_method as Investment['payment_method']
    }));
  };

  const updateInvestmentStatus = async (id: string, status: Investment['status'], adminNotes?: string) => {
    const { error } = await supabase
      .from('investments')
      .update({ 
        status, 
        admin_notes: adminNotes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
  };

  const updateInvestmentIncome = async (id: string, receivedIncome: number) => {
    const { error } = await supabase
      .from('investments')
      .update({ 
        received_income: receivedIncome,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
  };

  const getAllShareSaleRequests = async (): Promise<ShareSaleRequest[]> => {
    const { data, error } = await supabase
      .from('share_sale_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Cast the status field to match our interface
    return (data || []).map(request => ({
      ...request,
      status: request.status as ShareSaleRequest['status']
    }));
  };

  const updateShareSaleRequestStatus = async (id: string, status: ShareSaleRequest['status'], adminNotes?: string) => {
    const { error } = await supabase
      .from('share_sale_requests')
      .update({ 
        status, 
        admin_notes: adminNotes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
  };

  const updateOfferText = async (text: string) => {
    const { error } = await supabase
      .from('settings')
      .upsert({ 
        key: 'offer_text', 
        value: text,
        updated_at: new Date().toISOString(),
        updated_by: user?.id
      });

    if (error) throw error;
  };

  const getOfferText = async (): Promise<string> => {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'offer_text')
      .single();

    if (error) {
      console.error('Error loading offer text:', error);
      return 'Текст публичной оферты...';
    }

    return data?.value || 'Текст публичной оферты...';
  };

    return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      investments,
      shareSaleRequests,
      incomeTransactions,
      isAdmin,
      login,
      register,
      logout,
      addInvestment,
      updateProfile,
      uploadPaymentConfirmation,
      createShareSaleRequest,
      getIncomeTransactions,
      getAllInvestments,
      updateInvestmentStatus,
      updateInvestmentIncome,
      getAllShareSaleRequests,
      updateShareSaleRequestStatus,
      updateOfferText,
      getOfferText
    }}>
      {children}
    </AuthContext.Provider>
  );
};

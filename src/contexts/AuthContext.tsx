import { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

type Investment = {
  id: string;
  user_id: string;
  amount: number;
  percentage: number;
  created_at: string;
  status: 'pending' | 'active' | 'rejected' | 'under_review' | 'paid';
  payment_method?: 'yoomoney' | 'usdt' | 'card';
  confirmation_url?: string | null;
  admin_notes?: string | null;
  received_income?: number | null;
  transaction_hash?: string | null;
};

type UserProfile = {
  id: string;
  full_name: string;
  phone: string;
  address: string;
  birth_date: string;
  telegram_username: string;
  whatsapp_number: string;
  usdt_wallet: string;
  updated_at: string;
};

type SiteText = {
  offer: string;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  investments: Investment[];
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  siteText: SiteText;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  addInvestment: (amount: number, paymentMethod: 'yoomoney' | 'usdt' | 'card') => Promise<{ error: any }>;
  updateInvestmentStatus: (investmentId: string, status: Investment['status'], adminNotes?: string, receivedIncome?: number) => Promise<{ error: any }>;
  getAllInvestments: () => Promise<{ data: any[], error: any }>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<{ error: any }>;
  uploadPaymentConfirmation: (investmentId: string, file: File, transactionHash?: string) => Promise<{ error: any }>;
  updateSiteText: (key: string, content: string) => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [siteText, setSiteText] = useState({
    offer: 'Текст публичной оферты будет загружен...'
  });

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer loading additional data to prevent blocking
          setTimeout(() => {
            if (mounted) {
              loadUserData(session.user.id);
            }
          }, 0);
        } else {
          setInvestments([]);
          setProfile(null);
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
      }
      if (mounted && session) {
        setSession(session);
        setUser(session.user);
        loadUserData(session.user.id);
      }
      if (mounted) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Load site text
  useEffect(() => {
    loadSiteText();
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      await Promise.all([
        loadInvestments(userId),
        loadProfile(userId),
        checkAdminStatus(userId)
      ]);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadInvestments = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const typedData = data?.map(item => ({
        ...item,
        status: item.status as Investment['status'],
        payment_method: item.payment_method as 'yoomoney' | 'usdt' | 'card',
        admin_notes: item.admin_notes || '',
        received_income: item.received_income || 0,
        transaction_hash: item.transaction_hash || '',
        percentage: item.amount * 0.01 / 50000 // Исправлен расчет: 0.01% за 50,000₽
      })) || [];

      setInvestments(typedData);
    } catch (error) {
      console.error('Error loading investments:', error);
    }
  };

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setProfile(data || null);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setIsAdmin(!!data);
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const loadSiteText = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('key', 'offer')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setSiteText(prev => ({ ...prev, offer: data.content }));
      }
    } catch (error) {
      console.error('Error loading site text:', error);
    }
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/dashboard`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
      setInvestments([]);
      setProfile(null);
      setIsAdmin(false);
    }
    return { error };
  };

  const addInvestment = async (amount: number, paymentMethod: 'yoomoney' | 'usdt' | 'card') => {
    if (!user) return;

    const percentage = amount * 0.01 / 50000; // Исправлен расчет: 0.01% за 50,000₽

    const { error } = await supabase
      .from('investments')
      .insert([
        {
          user_id: user.id,
          amount,
          percentage,
          payment_method: paymentMethod,
          status: 'pending'
        }
      ]);

    if (!error) {
      await loadInvestments(user.id);
    }

    return { error };
  };

  const updateInvestmentStatus = async (investmentId: string, status: Investment['status'], adminNotes?: string, receivedIncome?: number) => {
    if (!isAdmin) return { error: new Error('Unauthorized') };

    const updateData: any = { status };
    if (adminNotes !== undefined) updateData.admin_notes = adminNotes;
    if (receivedIncome !== undefined) updateData.received_income = receivedIncome;

    const { error } = await supabase
      .from('investments')
      .update(updateData)
      .eq('id', investmentId);

    if (!error && user) {
      await loadInvestments(user.id);
    }

    return { error };
  };

  const getAllInvestments = async () => {
    if (!isAdmin) return { data: [], error: new Error('Unauthorized') };

    const { data, error } = await supabase
      .from('investments')
      .select(`
        *,
        profiles:user_id (
          full_name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    return { 
      data: data?.map(item => ({
        ...item,
        status: item.status as Investment['status'],
        payment_method: item.payment_method as 'yoomoney' | 'usdt' | 'card',
        admin_notes: item.admin_notes || '',
        received_income: item.received_income || 0,
        transaction_hash: item.transaction_hash || '',
        percentage: item.amount * 0.01 / 50000 // Исправлен расчет
      })) || [], 
      error 
    };
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .upsert([
        {
          id: user.id,
          ...profileData,
          updated_at: new Date().toISOString()
        }
      ]);

    if (!error) {
      await loadProfile(user.id);
    }

    return { error };
  };

  const uploadPaymentConfirmation = async (investmentId: string, file: File, transactionHash?: string) => {
    if (!user) return { error: new Error('User not authenticated') };

    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${investmentId}-${Date.now()}.${fileExt}`;
      const filePath = `payment-confirmations/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('confirmations')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Update investment with confirmation URL and hash
      const updateData: any = {
        confirmation_url: filePath,
        status: 'under_review'
      };
      
      if (transactionHash) {
        updateData.transaction_hash = transactionHash;
      }

      const { error: updateError } = await supabase
        .from('investments')
        .update(updateData)
        .eq('id', investmentId);

      if (updateError) throw updateError;

      await loadInvestments(user.id);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const updateSiteText = async (key: string, content: string) => {
    if (!isAdmin) return { error: new Error('Unauthorized') };

    const { error } = await supabase
      .from('site_content')
      .upsert([
        {
          key,
          content,
          updated_at: new Date().toISOString()
        }
      ]);

    if (!error) {
      setSiteText(prev => ({ ...prev, [key]: content }));
    }

    return { error };
  };

  const value = {
    user,
    session,
    investments,
    profile,
    loading,
    isAdmin,
    siteText,
    signUp,
    signIn,
    signOut,
    addInvestment,
    updateInvestmentStatus,
    getAllInvestments,
    updateProfile,
    uploadPaymentConfirmation,
    updateSiteText
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

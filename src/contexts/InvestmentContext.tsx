import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

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

interface InvestmentContextType {
  investments: Investment[];
  shareSaleRequests: ShareSaleRequest[];
  incomeTransactions: IncomeTransaction[];
  addInvestment: (amount: number, paymentMethod: Investment['payment_method']) => Promise<void>;
  uploadPaymentConfirmation: (investmentId: string, file: File, transactionHash?: string) => Promise<void>;
  createShareSaleRequest: (sharePercentage: number, usdtWallet: string) => Promise<void>;
  getIncomeTransactions: () => Promise<IncomeTransaction[]>;
}

const InvestmentContext = createContext<InvestmentContextType | undefined>(undefined);

export const useInvestment = () => {
  const context = useContext(InvestmentContext);
  if (!context) {
    throw new Error('useInvestment must be used within an InvestmentProvider');
  }
  return context;
};

export const InvestmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [shareSaleRequests, setShareSaleRequests] = useState<ShareSaleRequest[]>([]);
  const [incomeTransactions, setIncomeTransactions] = useState<IncomeTransaction[]>([]);

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        loadUserInvestments(user.id);
        loadUserShareSaleRequests(user.id);
        loadUserIncomeTransactions(user.id);
      }, 0);
    } else {
      setInvestments([]);
      setShareSaleRequests([]);
      setIncomeTransactions([]);
    }
  }, [user]);

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

      const typedRequests = (data || []).map(request => ({
        ...request,
        status: request.status as ShareSaleRequest['status']
      }));

      setShareSaleRequests(typedRequests);
    } catch (error) {
      console.error('Error loading share sale requests:', error);
    }
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

  const addInvestment = async (amount: number, paymentMethod: Investment['payment_method']) => {
    if (!user) return;
    
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

  return (
    <InvestmentContext.Provider value={{
      investments,
      shareSaleRequests,
      incomeTransactions,
      addInvestment,
      uploadPaymentConfirmation,
      createShareSaleRequest,
      getIncomeTransactions
    }}>
      {children}
    </InvestmentContext.Provider>
  );
};
import React, { createContext, useContext } from 'react';
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

interface InvestorVideo {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  video_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

interface AdminContextType {
  getAllInvestments: () => Promise<Investment[]>;
  updateInvestmentStatus: (id: string, status: Investment['status'], adminNotes?: string) => Promise<void>;
  updateInvestmentIncome: (id: string, receivedIncome: number) => Promise<void>;
  getAllShareSaleRequests: () => Promise<ShareSaleRequest[]>;
  updateShareSaleRequestStatus: (id: string, status: ShareSaleRequest['status'], adminNotes?: string) => Promise<void>;
  updateOfferText: (text: string) => Promise<void>;
  getOfferText: () => Promise<string>;
  getAllInvestorVideos: () => Promise<InvestorVideo[]>;
  uploadInvestorVideo: (file: File, title: string, description?: string) => Promise<void>;
  updateVideoStatus: (id: string, isActive: boolean) => Promise<void>;
  deleteInvestorVideo: (id: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const getAllInvestments = async (): Promise<Investment[]> => {
    const { data, error } = await supabase
      .from('investments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
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
      .maybeSingle();

    if (error) {
      console.error('Error loading offer text:', error);
      return 'Текст публичной оферты...';
    }

    return data?.value || 'Текст публичной оферты...';
  };

  const getAllInvestorVideos = async (): Promise<InvestorVideo[]> => {
    const { data, error } = await supabase
      .from('investor_videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data || [];
  };

  const uploadInvestorVideo = async (file: File, title: string, description?: string) => {
    // Создаем уникальное имя файла
    const fileName = `${Date.now()}-${file.name}`;
    
    // Загружаем файл в storage
    const { error: uploadError } = await supabase.storage
      .from('investor-videos')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Получаем публичный URL
    const { data: { publicUrl } } = supabase.storage
      .from('investor-videos')
      .getPublicUrl(fileName);

    // Сохраняем запись в БД
    const { error: dbError } = await supabase
      .from('investor_videos')
      .insert({
        title,
        description,
        video_url: publicUrl,
        video_name: fileName,
        created_by: user?.id
      });

    if (dbError) throw dbError;
  };

  const updateVideoStatus = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from('investor_videos')
      .update({ 
        is_active: isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
  };

  const deleteInvestorVideo = async (id: string) => {
    // Сначала получаем информацию о видео для удаления файла
    const { data: video, error: fetchError } = await supabase
      .from('investor_videos')
      .select('video_name')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Удаляем файл из storage
    const { error: storageError } = await supabase.storage
      .from('investor-videos')
      .remove([video.video_name]);

    if (storageError) throw storageError;

    // Удаляем запись из БД
    const { error: dbError } = await supabase
      .from('investor_videos')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;
  };

  return (
    <AdminContext.Provider value={{
      getAllInvestments,
      updateInvestmentStatus,
      updateInvestmentIncome,
      getAllShareSaleRequests,
      updateShareSaleRequestStatus,
      updateOfferText,
      getOfferText,
      getAllInvestorVideos,
      uploadInvestorVideo,
      updateVideoStatus,
      deleteInvestorVideo
    }}>
      {children}
    </AdminContext.Provider>
  );
};
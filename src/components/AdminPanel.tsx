
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';

const AdminPanel = () => {
  const { 
    getAllInvestments, 
    updateInvestmentStatus, 
    updateInvestmentIncome,
    getAllShareSaleRequests,
    updateShareSaleRequestStatus,
    updateOfferText,
    getOfferText
  } = useAuth();
  const { toast } = useToast();
  const [investments, setInvestments] = useState<any[]>([]);
  const [shareRequests, setShareRequests] = useState<any[]>([]);
  const [offerText, setOfferText] = useState('');
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState<{[key: string]: any}>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadProfiles = async (userIds: string[]) => {
    if (userIds.length === 0) return {};
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);
      
      if (error) throw error;
      
      const profilesMap: {[key: string]: any} = {};
      (data || []).forEach(profile => {
        profilesMap[profile.id] = profile;
      });
      
      return profilesMap;
    } catch (error) {
      console.error('Error loading profiles:', error);
      return {};
    }
  };

  const loadData = async () => {
    try {
      const [investmentsData, shareRequestsData, offer] = await Promise.all([
        getAllInvestments(),
        getAllShareSaleRequests(),
        getOfferText()
      ]);
      
      setInvestments(investmentsData);
      setShareRequests(shareRequestsData);
      setOfferText(offer);
      
      // Загружаем профили для всех пользователей
      const allUserIds = [
        ...investmentsData.map(inv => inv.user_id),
        ...shareRequestsData.map(req => req.user_id)
      ];
      const uniqueUserIds = [...new Set(allUserIds)];
      const profilesData = await loadProfiles(uniqueUserIds);
      setProfiles(profilesData);
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const handleInvestmentStatusUpdate = async (id: string, status: string, adminNotes?: string) => {
    try {
      await updateInvestmentStatus(id, status as any, adminNotes);
      await loadData();
      toast({
        title: "Статус обновлен",
        description: "Статус инвестиции успешно изменен",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус",
        variant: "destructive"
      });
    }
  };

  const handleIncomeUpdate = async (id: string, income: number) => {
    try {
      await updateInvestmentIncome(id, income);
      await loadData();
      toast({
        title: "Доход обновлен",
        description: "Полученный доход успешно обновлен",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить доход",
        variant: "destructive"
      });
    }
  };

  const handleShareRequestUpdate = async (id: string, status: string, adminNotes?: string) => {
    try {
      await updateShareSaleRequestStatus(id, status as any, adminNotes);
      await loadData();
      toast({
        title: "Заявка обновлена",
        description: "Статус заявки на продажу изменен",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить заявку",
        variant: "destructive"
      });
    }
  };

  const handleOfferUpdate = async () => {
    setLoading(true);
    try {
      await updateOfferText(offerText);
      toast({
        title: "Оферта обновлена",
        description: "Текст публичной оферты успешно сохранен",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить оферту",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 neon-border mb-12">
      <h2 className="text-3xl font-bold text-cosmo-blue mb-6 neon-text">
        Панель администратора
      </h2>
      
      <Tabs defaultValue="investments" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="investments">Инвестиции</TabsTrigger>
          <TabsTrigger value="share-requests">Заявки на продажу</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
        </TabsList>
        
        <TabsContent value="investments" className="space-y-4">
          <h3 className="text-xl font-bold text-white mb-4">Управление инвестициями</h3>
          {investments.map((investment) => {
            const userProfile = profiles[investment.user_id];
            return (
              <div key={investment.id} className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-white"><strong>Пользователь:</strong> {userProfile?.full_name || 'Не указано'}</p>
                    <p className="text-white"><strong>Email:</strong> {userProfile?.email || 'Не указано'}</p>
                    <p className="text-white"><strong>Сумма:</strong> {investment.amount?.toLocaleString()} ₽</p>
                    <p className="text-white"><strong>Доля:</strong> {investment.percentage?.toFixed(4)}%</p>
                    <p className="text-white"><strong>Способ оплаты:</strong> {investment.payment_method}</p>
                    {investment.transaction_hash && (
                      <p className="text-white"><strong>Хэш:</strong> {investment.transaction_hash}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Статус</Label>
                    <select 
                      value={investment.status}
                      onChange={(e) => handleInvestmentStatusUpdate(investment.id, e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded p-2 focus:border-cosmo-blue focus:outline-none"
                    >
                      <option value="pending">Ожидает</option>
                      <option value="under_review">На проверке</option>
                      <option value="paid">Оплачено</option>
                      <option value="active">Активно</option>
                      <option value="rejected">Отклонено</option>
                    </select>
                    
                    <Label className="text-white">Полученный доход (₽)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={investment.received_income || 0}
                      onChange={(e) => handleIncomeUpdate(investment.id, Number(e.target.value))}
                      className="bg-slate-700 border-slate-600 text-white focus:border-cosmo-blue"
                      placeholder="0"
                    />
                  </div>
                </div>
                <Textarea
                  placeholder="Заметки администратора"
                  value={investment.admin_notes || ''}
                  onChange={(e) => handleInvestmentStatusUpdate(investment.id, investment.status, e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white focus:border-cosmo-blue"
                />
              </div>
            );
          })}
        </TabsContent>
        
        <TabsContent value="share-requests" className="space-y-4">
          <h3 className="text-xl font-bold text-white mb-4">Заявки на продажу долей</h3>
          {shareRequests.map((request) => {
            const userProfile = profiles[request.user_id];
            return (
              <div key={request.id} className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-white"><strong>Пользователь:</strong> {userProfile?.full_name || 'Не указано'}</p>
                    <p className="text-white"><strong>Email:</strong> {userProfile?.email || 'Не указано'}</p>
                    <p className="text-white"><strong>Доля для продажи:</strong> {request.share_percentage?.toFixed(4)}%</p>
                    <p className="text-white"><strong>USDT кошелек:</strong> {request.usdt_wallet}</p>
                    <p className="text-white"><strong>Дата:</strong> {new Date(request.created_at).toLocaleDateString('ru-RU')}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Статус</Label>
                    <select 
                      value={request.status}
                      onChange={(e) => handleShareRequestUpdate(request.id, e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded p-2 focus:border-cosmo-blue focus:outline-none"
                    >
                      <option value="pending">Ожидает</option>
                      <option value="approved">Одобрено</option>
                      <option value="rejected">Отклонено</option>
                    </select>
                  </div>
                </div>
                <Textarea
                  placeholder="Заметки администратора"
                  value={request.admin_notes || ''}
                  onChange={(e) => handleShareRequestUpdate(request.id, request.status, e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white focus:border-cosmo-blue"
                />
              </div>
            );
          })}
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <h3 className="text-xl font-bold text-white mb-4">Настройки</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-white mb-2 block">Текст публичной оферты</Label>
              <Textarea
                value={offerText}
                onChange={(e) => setOfferText(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white min-h-[200px] focus:border-cosmo-blue"
                placeholder="Введите текст публичной оферты"
              />
              <Button
                onClick={handleOfferUpdate}
                disabled={loading}
                className="mt-2 bg-cosmo-blue hover:bg-cosmo-purple text-white"
              >
                {loading ? 'Сохранение...' : 'Сохранить оферту'}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;

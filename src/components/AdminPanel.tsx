
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
  const [paymentConfirmations, setPaymentConfirmations] = useState<{[key: string]: any}>({});
  
  // Состояния для отложенного сохранения
  const [pendingChanges, setPendingChanges] = useState<{[key: string]: any}>({});

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

  const loadPaymentConfirmations = async (investmentIds: string[]) => {
    if (investmentIds.length === 0) return {};
    
    try {
      const { data, error } = await supabase
        .from('payment_confirmations')
        .select('*')
        .in('investment_id', investmentIds);
      
      if (error) throw error;
      
      const confirmationsMap: {[key: string]: any} = {};
      (data || []).forEach(confirmation => {
        confirmationsMap[confirmation.investment_id] = confirmation;
      });
      
      return confirmationsMap;
    } catch (error) {
      console.error('Error loading payment confirmations:', error);
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
      
      // Загружаем подтверждения оплаты
      const investmentIds = investmentsData.map(inv => inv.id);
      const confirmationsData = await loadPaymentConfirmations(investmentIds);
      setPaymentConfirmations(confirmationsData);
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const handleStatusChange = (id: string, field: string, value: any) => {
    setPendingChanges(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const saveChanges = async (id: string, type: 'investment' | 'shareRequest') => {
    const changes = pendingChanges[id];
    if (!changes) return;

    try {
      if (type === 'investment') {
        if (changes.status || changes.admin_notes !== undefined) {
          await updateInvestmentStatus(id, changes.status || investments.find(inv => inv.id === id)?.status, changes.admin_notes);
        }
        if (changes.received_income !== undefined) {
          await updateInvestmentIncome(id, changes.received_income);
        }
      } else {
        await updateShareSaleRequestStatus(id, changes.status, changes.admin_notes);
      }
      
      // Убираем изменения из состояния после сохранения
      setPendingChanges(prev => {
        const newChanges = { ...prev };
        delete newChanges[id];
        return newChanges;
      });
      
      await loadData();
      toast({
        title: "Изменения сохранены",
        description: type === 'investment' ? "Статус инвестиции обновлен" : "Статус заявки обновлен",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить изменения",
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
          <div className="text-sm text-white/60 mb-4">
            <p><strong>Статусы:</strong></p>
            <p>• <strong>Оплачено</strong> - платеж подтвержден, но доля еще не активна</p>
            <p>• <strong>Активно</strong> - доля активна и приносит доход инвестору</p>
          </div>
          {investments.map((investment) => {
            const userProfile = profiles[investment.user_id];
            const paymentConfirmation = paymentConfirmations[investment.id];
            const changes = pendingChanges[investment.id] || {};
            const hasChanges = Object.keys(changes).length > 0;
            
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
                      <p className="text-white"><strong>Хэш транзакции:</strong> {investment.transaction_hash}</p>
                    )}
                    {paymentConfirmation && (
                      <div className="mt-2">
                        <p className="text-cosmo-green"><strong>Подтверждение оплаты:</strong> Загружено</p>
                        <p className="text-white text-sm">{paymentConfirmation.file_name}</p>
                        {paymentConfirmation.transaction_hash && (
                          <p className="text-white text-sm"><strong>Хэш USDT:</strong> {paymentConfirmation.transaction_hash}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Статус</Label>
                    <select 
                      value={changes.status || investment.status}
                      onChange={(e) => handleStatusChange(investment.id, 'status', e.target.value)}
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
                      value={changes.received_income !== undefined ? changes.received_income : (investment.received_income || 0)}
                      onChange={(e) => handleStatusChange(investment.id, 'received_income', Number(e.target.value))}
                      className="bg-slate-700 border-slate-600 text-white focus:border-cosmo-blue"
                      placeholder="0"
                    />
                    
                    {hasChanges && (
                      <Button
                        onClick={() => saveChanges(investment.id, 'investment')}
                        className="w-full bg-cosmo-green hover:bg-cosmo-blue text-white mt-2"
                      >
                        Сохранить изменения
                      </Button>
                    )}
                  </div>
                </div>
                <Textarea
                  placeholder="Заметки администратора"
                  value={changes.admin_notes !== undefined ? changes.admin_notes : (investment.admin_notes || '')}
                  onChange={(e) => handleStatusChange(investment.id, 'admin_notes', e.target.value)}
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
            const changes = pendingChanges[request.id] || {};
            const hasChanges = Object.keys(changes).length > 0;
            
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
                      value={changes.status || request.status}
                      onChange={(e) => handleStatusChange(request.id, 'status', e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded p-2 focus:border-cosmo-blue focus:outline-none"
                    >
                      <option value="pending">Ожидает</option>
                      <option value="approved">Одобрено</option>
                      <option value="rejected">Отклонено</option>
                    </select>
                    
                    {hasChanges && (
                      <Button
                        onClick={() => saveChanges(request.id, 'shareRequest')}
                        className="w-full bg-cosmo-green hover:bg-cosmo-blue text-white mt-2"
                      >
                        Сохранить изменения
                      </Button>
                    )}
                  </div>
                </div>
                <Textarea
                  placeholder="Заметки администратора"
                  value={changes.admin_notes !== undefined ? changes.admin_notes : (request.admin_notes || '')}
                  onChange={(e) => handleStatusChange(request.id, 'admin_notes', e.target.value)}
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

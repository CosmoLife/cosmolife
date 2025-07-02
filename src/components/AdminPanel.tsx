
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';

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
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [investors, setInvestors] = useState<any[]>([]);
  const [offerText, setOfferText] = useState('');
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState<{[key: string]: any}>({});
  const [paymentConfirmations, setPaymentConfirmations] = useState<{[key: string]: any}>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<{[key: string]: any}>({});
  const [investorIncomeChanges, setInvestorIncomeChanges] = useState<{[key: string]: {income: number, hash: string}}>({});
  const itemsPerPage = 5;

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

  const loadAllUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error loading all users:', error);
      return [];
    }
  };

  const loadInvestors = async () => {
    try {
      const { data: investmentsData, error: investmentsError } = await supabase
        .from('investments')
        .select('user_id, amount')
        .eq('status', 'active');
      
      if (investmentsError) throw investmentsError;
      
      // Группируем инвестиции по пользователям и суммируем их
      const investorMap = new Map();
      (investmentsData || []).forEach(inv => {
        const existing = investorMap.get(inv.user_id);
        if (existing) {
          existing.totalAmount += inv.amount;
        } else {
          investorMap.set(inv.user_id, {
            user_id: inv.user_id,
            totalAmount: inv.amount
          });
        }
      });
      
      const investorIds = Array.from(investorMap.keys());
      
      if (investorIds.length === 0) return [];
      
      // Загружаем профили инвесторов
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', investorIds);
      
      if (profilesError) throw profilesError;
      
      // Загружаем транзакции дохода для каждого инвестора
      const { data: incomeData, error: incomeError } = await supabase
        .from('income_transactions')
        .select('user_id, amount')
        .in('user_id', investorIds);
      
      if (incomeError) throw incomeError;
      
      // Суммируем доходы по пользователям
      const incomeMap = new Map();
      (incomeData || []).forEach(transaction => {
        const existing = incomeMap.get(transaction.user_id);
        if (existing) {
          incomeMap.set(transaction.user_id, existing + transaction.amount);
        } else {
          incomeMap.set(transaction.user_id, transaction.amount);
        }
      });
      
      // Объединяем данные профилей с инвестиционными данными и доходами
      return (profilesData || []).map(profile => ({
        ...profile,
        totalInvestment: investorMap.get(profile.id)?.totalAmount || 0,
        totalIncome: incomeMap.get(profile.id) || 0,
        sharePercentage: ((investorMap.get(profile.id)?.totalAmount || 0) * 0.01 / 50000).toFixed(4)
      }));
    } catch (error) {
      console.error('Error loading investors:', error);
      return [];
    }
  };

  const loadData = async () => {
    try {
      console.log('Loading admin data...');
      const [investmentsData, shareRequestsData, offer, usersData, investorsData] = await Promise.all([
        getAllInvestments(),
        getAllShareSaleRequests(),
        getOfferText(),
        loadAllUsers(),
        loadInvestors()
      ]);
      
      console.log('Investments data:', investmentsData);
      setInvestments(investmentsData);
      setShareRequests(shareRequestsData);
      setOfferText(offer);
      
      // Фильтруем пользователей - показываем только тех, кто НЕ является активным инвестором
      const activeInvestorIds = new Set(investorsData.map(inv => inv.id));
      const regularUsers = usersData.filter(user => !activeInvestorIds.has(user.id));
      
      setAllUsers(regularUsers);
      setInvestors(investorsData);
      
      // Загружаем ВСЕ профили напрямую из базы, а не только для определённых пользователей
      const { data: allProfilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) {
        console.error('Error loading all profiles:', profilesError);
      } else {
        console.log('All profiles loaded:', allProfilesData);
        const profilesMap: {[key: string]: any} = {};
        (allProfilesData || []).forEach(profile => {
          profilesMap[profile.id] = profile;
        });
        setProfiles(profilesMap);
      }
      
      // Загружаем подтверждения оплаты
      const investmentIds = investmentsData.map(inv => inv.id);
      console.log('Loading confirmations for investment IDs:', investmentIds);
      const confirmationsData = await loadPaymentConfirmations(investmentIds);
      console.log('Payment confirmations loaded:', confirmationsData);
      setPaymentConfirmations(confirmationsData);
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const handleSaveChanges = async (investmentId: string) => {
    const changes = pendingChanges[investmentId];
    if (!changes) return;
    
    try {
      if (changes.status || changes.admin_notes !== undefined) {
        await updateInvestmentStatus(investmentId, changes.status || investments.find(inv => inv.id === investmentId)?.status, changes.admin_notes);
      }
      
      if (changes.received_income !== undefined) {
        await updateInvestmentIncome(investmentId, changes.received_income);
      }
      
      // Удаляем изменения из состояния
      setPendingChanges(prev => {
        const newChanges = { ...prev };
        delete newChanges[investmentId];
        return newChanges;
      });
      
      await loadData();
      toast({
        title: "Изменения сохранены",
        description: "Данные инвестиций успешно обновлены",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить изменения",
        variant: "destructive"
      });
    }
  };

  const updatePendingChange = (investmentId: string, field: string, value: any) => {
    setPendingChanges(prev => ({
      ...prev,
      [investmentId]: {
        ...prev[investmentId],
        [field]: value
      }
    }));
  };

  const handleInvestorIncomeUpdate = async (userId: string) => {
    const changes = investorIncomeChanges[userId];
    if (!changes) return;
    
    try {
      // Создаем запись о начислении дохода в таблице income_transactions
      const { error: incomeError } = await supabase
        .from('income_transactions')
        .insert({
          user_id: userId,
          amount: changes.income,
          transaction_hash: changes.hash,
          admin_notes: `Начислен доход администратором`
          // Убираем created_by так как это поле nullable и UUID
        });
      
      if (incomeError) throw incomeError;
      
      // Удаляем изменения из состояния
      setInvestorIncomeChanges(prev => {
        const newChanges = { ...prev };
        delete newChanges[userId];
        return newChanges;
      });
      
      await loadData();
      toast({
        title: "Доход начислен",
        description: "Доход успешно начислен инвестору",
      });
    } catch (error) {
      console.error('Error adding income:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось начислить доход",
        variant: "destructive"
      });
    }
  };

  const updateInvestorIncomeChange = (userId: string, field: 'income' | 'hash', value: any) => {
    setInvestorIncomeChanges(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value
      }
    }));
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

  const getImageUrl = async (filePath: string) => {
    try {
      const { data } = await supabase.storage
        .from('payment-confirmations')
        .getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Error getting image URL:', error);
      return null;
    }
  };

  // Фильтруем инвестиции, требующие подтверждения (НЕ ТОЛЬКО pending и under_review)
  const pendingInvestments = investments.filter(inv => 
    inv.status === 'pending' || inv.status === 'under_review' || inv.status === 'paid'
  );

  // Пагинация
  const totalPages = Math.ceil(pendingInvestments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvestments = pendingInvestments.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 neon-border mb-12">
      <h2 className="text-3xl font-bold text-cosmo-blue mb-6 neon-text">
        Панель администратора
      </h2>
      
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pending">Требуют подтверждения</TabsTrigger>
          <TabsTrigger value="share-requests">Заявки на продажу</TabsTrigger>
          <TabsTrigger value="users">Пользователи</TabsTrigger>
          <TabsTrigger value="investors">Инвесторы</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Требуют подтверждения ({pendingInvestments.length})</h3>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                className="border-white/20 text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-white text-sm">
                {currentPage} из {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
                className="border-white/20 text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {paginatedInvestments.map((investment) => {
            const userProfile = profiles[investment.user_id];
            const paymentConfirmation = paymentConfirmations[investment.id];
            const changes = pendingChanges[investment.id] || {};
            
            return (
              <div key={investment.id} className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-white"><strong>Пользователь:</strong> {userProfile?.full_name || `Debug: user_id=${investment.user_id}, profile not found`}</p>
                    <p className="text-white"><strong>Email:</strong> {userProfile?.email || `Debug: user_id=${investment.user_id}, no email`}</p>
                    <p className="text-white"><strong>Сумма:</strong> {investment.amount?.toLocaleString()} ₽</p>
                    <p className="text-white"><strong>Доля:</strong> {(investment.amount * 0.01 / 50000).toFixed(4)}%</p>
                    <p className="text-white"><strong>Способ оплаты:</strong> {investment.payment_method}</p>
                    {investment.transaction_hash && (
                      <p className="text-white"><strong>Хэш транзакции:</strong> {investment.transaction_hash}</p>
                    )}
                    {paymentConfirmation && (
                      <div className="mt-2">
                        <p className="text-white"><strong>Подтверждение оплаты:</strong></p>
                        <Button
                          onClick={async () => {
                            const url = await getImageUrl(paymentConfirmation.file_url);
                            if (url) setSelectedImage(url);
                          }}
                          variant="outline"
                          size="sm"
                          className="mt-1 border-cosmo-blue text-cosmo-blue hover:bg-cosmo-blue hover:text-white"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Посмотреть файл
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Статус</Label>
                    <select 
                      value={changes.status || investment.status}
                      onChange={(e) => updatePendingChange(investment.id, 'status', e.target.value)}
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
                      onChange={(e) => updatePendingChange(investment.id, 'received_income', Number(e.target.value))}
                      className="bg-slate-700 border-slate-600 text-white focus:border-cosmo-blue"
                      placeholder="0"
                    />
                  </div>
                </div>
                <Textarea
                  placeholder="Заметки администратора"
                  value={changes.admin_notes !== undefined ? changes.admin_notes : (investment.admin_notes || '')}
                  onChange={(e) => updatePendingChange(investment.id, 'admin_notes', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white focus:border-cosmo-blue mb-4"
                />
                <Button
                  onClick={() => handleSaveChanges(investment.id)}
                  disabled={!pendingChanges[investment.id]}
                  className="bg-cosmo-green hover:bg-cosmo-blue text-white"
                >
                  Сохранить изменения
                </Button>
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

        <TabsContent value="users" className="space-y-4">
          <h3 className="text-xl font-bold text-white mb-4">Зарегистрированные пользователи ({allUsers.length})</h3>
          <p className="text-white/60 mb-4">Пользователи, которые зарегистрировались, но еще не стали активными инвесторами</p>
          {allUsers.map((user) => (
            <div key={user.id} className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-white"><strong>Имя:</strong> {user.full_name || 'Не указано'}</p>
                  <p className="text-white"><strong>Телефон:</strong> {user.phone || 'Не указано'}</p>
                  <p className="text-white"><strong>Адрес:</strong> {user.address || 'Не указан'}</p>
                  <p className="text-white"><strong>Дата рождения:</strong> {user.birth_date || 'Не указана'}</p>
                </div>
                <div>
                  <p className="text-white"><strong>Telegram:</strong> {user.telegram_username || 'Не указан'}</p>
                  <p className="text-white"><strong>WhatsApp:</strong> {user.whatsapp_number || 'Не указан'}</p>
                  <p className="text-white"><strong>USDT кошелек:</strong> {user.usdt_wallet || 'Не указан'}</p>
                  <p className="text-white"><strong>Дата регистрации:</strong> {new Date(user.created_at).toLocaleDateString('ru-RU')}</p>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="investors" className="space-y-4">
          <h3 className="text-xl font-bold text-white mb-4">Активные инвесторы ({investors.length})</h3>
          <p className="text-white/60 mb-4">Пользователи с активными инвестициями</p>
          {investors.map((investor) => {
            const incomeChanges = investorIncomeChanges[investor.id] || { income: 0, hash: '' };
            
            return (
              <div key={investor.id} className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-white"><strong>Имя:</strong> {investor.full_name || 'Не указано'}</p>
                    <p className="text-white"><strong>Телефон:</strong> {investor.phone || 'Не указано'}</p>
                    <p className="text-white"><strong>Адрес:</strong> {investor.address || 'Не указан'}</p>
                    <p className="text-white"><strong>Дата рождения:</strong> {investor.birth_date || 'Не указана'}</p>
                    <p className="text-white"><strong>Общая сумма инвестиций:</strong> {investor.totalInvestment?.toLocaleString()} ₽</p>
                    <p className="text-white"><strong>Доля:</strong> {investor.sharePercentage}%</p>
                    <p className="text-white"><strong>Текущий доход:</strong> {investor.totalIncome?.toLocaleString()} ₽</p>
                  </div>
                  <div>
                    <p className="text-white"><strong>Telegram:</strong> {investor.telegram_username || 'Не указан'}</p>
                    <p className="text-white"><strong>WhatsApp:</strong> {investor.whatsapp_number || 'Не указан'}</p>
                    <p className="text-white"><strong>USDT кошелек:</strong> {investor.usdt_wallet || 'Не указан'}</p>
                    <p className="text-white"><strong>Дата регистрации:</strong> {new Date(investor.created_at).toLocaleDateString('ru-RU')}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-white/5 rounded-lg">
                  <div>
                    <Label className="text-white mb-2 block">Начислить доход (₽)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={incomeChanges.income}
                      onChange={(e) => updateInvestorIncomeChange(investor.id, 'income', Number(e.target.value))}
                      className="bg-slate-700 border-slate-600 text-white focus:border-cosmo-blue"
                      placeholder="Сумма дохода"
                    />
                  </div>
                  <div>
                    <Label className="text-white mb-2 block">Хэш перевода</Label>
                    <Input
                      type="text"
                      value={incomeChanges.hash}
                      onChange={(e) => updateInvestorIncomeChange(investor.id, 'hash', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white focus:border-cosmo-blue"
                      placeholder="Хэш транзакции"
                    />
                  </div>
                </div>
                
                <Button
                  onClick={() => handleInvestorIncomeUpdate(investor.id)}
                  disabled={!incomeChanges.income || !incomeChanges.hash}
                  className="bg-cosmo-green hover:bg-cosmo-blue text-white"
                >
                  Начислить доход
                </Button>
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

      {/* Модальное окно для просмотра изображений */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setSelectedImage(null)}>
          <div className="max-w-4xl max-h-4xl p-4">
            <img src={selectedImage} alt="Подтверждение оплаты" className="max-w-full max-h-full object-contain" />
            <Button
              onClick={() => setSelectedImage(null)}
              className="mt-4 bg-cosmo-blue hover:bg-cosmo-purple text-white"
            >
              Закрыть
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;


import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import ProfileEditor from '@/components/ProfileEditor';
import PaymentConfirmation from '@/components/PaymentConfirmation';
import ShareSaleModal from '@/components/ShareSaleModal';
import AdminPanel from '@/components/AdminPanel';
import IncomeTransactionsModal from '@/components/IncomeTransactionsModal';
import { Copy, Info } from 'lucide-react';

const Dashboard = () => {
  const { user, investments, addInvestment, isAdmin, incomeTransactions, getIncomeTransactions, profile } = useAuth();
  const [investmentAmount, setInvestmentAmount] = useState(50000);
  const [showPayment, setShowPayment] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState<{id: string, method?: string} | null>(null);
  const [showShareSale, setShowShareSale] = useState(false);
  const [showCommissionInfo, setShowCommissionInfo] = useState(false);
  const [showIncomeTransactions, setShowIncomeTransactions] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  // Считаем только оплаченные инвестиции (статус 'paid' или 'active')
  const paidInvestments = investments.filter(inv => inv.status === 'paid' || inv.status === 'active');
  const totalInvestment = paidInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  // ИСПРАВЛЕННАЯ ФОРМУЛА: каждые 50,000 рублей = 0.01%
  const totalPercentage = totalInvestment * 0.01 / 50000;
  const totalReceivedIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const yearlyReturn = totalPercentage * 357600000 / 100;
  const potentialReturn = totalPercentage * 178800000000 / 100;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Скопировано",
      description: `${label} скопирован в буфер обмена`,
    });
  };

  const handleInvestment = async (paymentMethod: 'yoomoney' | 'usdt' | 'card') => {
    if (investmentAmount < 50000) {
      toast({
        title: "Ошибка",
        description: "Минимальная сумма инвестиций 50,000 рублей",
        variant: "destructive"
      });
      return;
    }

    await addInvestment(investmentAmount, paymentMethod);
    
    switch (paymentMethod) {
      case 'yoomoney':
        window.open(`https://yoomoney.ru/to/410019220622751/${investmentAmount}`, '_blank');
        break;
      case 'usdt':
        // Показываем адрес кошелька
        break;
      case 'card':
        // Открываем Telegram или WhatsApp для запроса данных карты
        break;
    }
    
    toast({
      title: "Инвестиция создана!",
      description: "Следуйте инструкциям для оплаты. После оплаты загрузите подтверждение.",
    });
    
    setShowPayment(false);
    setInvestmentAmount(50000);
  };

  const handleShareSale = () => {
    if (totalPercentage <= 0) {
      toast({
        title: "Ошибка",
        description: "У вас нет доли для продажи",
        variant: "destructive"
      });
      return;
    }
    
    setShowShareSale(true);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-neon-gradient bg-clip-text text-transparent neon-text">
                Личный кабинет инвестора
              </h1>
              <p className="text-xl text-white/80">
                Добро пожаловать, {user.email}
              </p>
             </div>
             
             {/* DEBUG: Проверка админ роли */}
             <div className="bg-red-500/20 p-4 rounded mb-4 text-white">
               <p>DEBUG: user.email = {user.email}</p>
               <p>DEBUG: profile = {JSON.stringify(profile)}</p>
               <p>DEBUG: isAdmin = {isAdmin.toString()}</p>
             </div>
             
             {/* Админская панель */}
             {isAdmin && <AdminPanel />}
            
            {/* Компонент редактирования профиля */}
            <ProfileEditor />
            
            {/* Общая статистика */}
            <div className="grid md:grid-cols-5 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 neon-border text-center">
                <h3 className="text-cosmo-blue font-bold mb-2 neon-text">Общие инвестиции</h3>
                <div className="text-2xl font-bold text-white">
                  {totalInvestment.toLocaleString()} ₽
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 neon-border text-center">
                <h3 className="text-cosmo-purple font-bold mb-2 neon-text">Доля в проекте</h3>
                <div className="text-2xl font-bold text-white">
                  {totalPercentage.toFixed(4)}%
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 neon-border text-center">
                <h3 className="text-cosmo-green font-bold mb-2 neon-text">Прогноз доходности в год</h3>
                <div className="text-2xl font-bold text-white">
                  {yearlyReturn.toLocaleString()} ₽
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 neon-border text-center">
                <h3 className="text-cosmo-blue font-bold mb-2 neon-text">Потенциал (При 5% рынка)</h3>
                <div className="text-2xl font-bold text-white">
                  {(potentialReturn / 1000000).toFixed(1)}M ₽
                </div>
              </div>
              
              <div 
                className="bg-gradient-to-br from-cosmo-green/20 to-cosmo-green/10 backdrop-blur-lg rounded-2xl p-6 neon-border text-center cursor-pointer hover:from-cosmo-green/30 hover:to-cosmo-green/20 transition-all duration-300 border-cosmo-green/50 shadow-lg shadow-cosmo-green/20 animate-pulse"
                onClick={() => setShowIncomeTransactions(true)}
              >
                <h3 className="text-cosmo-green font-bold mb-2 neon-text text-lg">💰 Полученный доход</h3>
                <div className="text-2xl font-bold text-white">
                  {totalReceivedIncome.toLocaleString()} ₽
                </div>
                <div className="text-xs text-cosmo-green/80 mt-1 font-semibold">👆 Нажмите для просмотра транзакций</div>
              </div>
            </div>

            {/* Кнопка продажи доли */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 neon-border mb-12">
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={handleShareSale}
                  className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold py-3 px-6"
                >
                  Продать мою долю
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onMouseEnter={() => setShowCommissionInfo(true)}
                  onMouseLeave={() => setShowCommissionInfo(false)}
                  className="text-white/60 hover:text-white relative"
                >
                  <Info className="w-4 h-4" />
                  {showCommissionInfo && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-10">
                      Внимание: При продаже доли через платформу мы берем комиссию 20% от суммы сделки.
                    </div>
                  )}
                </Button>
              </div>
            </div>
            
            {/* Новая инвестиция */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg rounded-3xl p-8 neon-border mb-12">
              <h2 className="text-3xl font-bold text-cosmo-blue mb-6 neon-text">
                Инвестировать
              </h2>
              
              {!showPayment ? (
                <div className="text-center">
                  <p className="text-white/80 mb-6">
                    Увеличьте свою долю в проекте Cosmo Life
                  </p>
                  <Button
                    onClick={() => setShowPayment(true)}
                    className="bg-gradient-to-r from-cosmo-blue to-cosmo-purple hover:from-cosmo-purple hover:to-cosmo-green text-white font-bold py-4 px-8 text-lg neon-border animate-neon-pulse"
                  >
                    Инвестировать
                  </Button>
                </div>
              ) : (
                <div className="max-w-2xl mx-auto">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="amount" className="text-white mb-2 block">
                        Сумма инвестиций (от 50,000 ₽)
                      </Label>
                      <Input
                        id="amount"
                        type="number"
                        min="50000"
                        step="1000"
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                        className="bg-white/5 border-white/20 text-white"
                      />
                      <p className="text-sm text-white/60 mt-1">
                        Доля: {(investmentAmount * 0.01 / 50000).toFixed(4)}%
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-white mb-4">Способы оплаты:</h3>
                      
                      {/* ЮMoney */}
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <span className="font-bold text-purple-300">ЮMoney</span>
                            <p className="text-xs text-white/60 mt-1">
                              (С банковских карт российских банков 100 000 ₽/операция. Не более 600 000 ₽/сутки)
                            </p>
                          </div>
                          <Button
                            onClick={() => handleInvestment('yoomoney')}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            Оплатить
                          </Button>
                        </div>
                      </div>
                      
                      {/* USDT */}
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-green-300">USDT BEP-20</span>
                          <Button
                            onClick={() => copyToClipboard('0x9e00d62d50ef12d41394082d63aee3abf286d0c5', 'Адрес кошелька')}
                            variant="outline"
                            size="sm"
                            className="border-green-500 text-green-300 hover:bg-green-500 hover:text-white"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Копировать адрес
                          </Button>
                        </div>
                        <p className="text-xs text-white/60">0x9e00d62d50ef12d41394082d63aee3abf286d0c5</p>
                        <Button
                          onClick={() => handleInvestment('usdt')}
                          className="bg-green-600 hover:bg-green-700 text-white mt-2 w-full"
                        >
                          Я отправил USDT
                        </Button>
                      </div>
                      
                      {/* Карты доверенных лиц */}
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="mb-4">
                          <span className="font-bold text-orange-300">Перевод на карты в СНГ</span>
                          <p className="text-sm text-white/60 mt-2">Запросить данные карты:</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-2">
                          <a 
                            href="https://t.me/CosmoLifeApp" 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                              В Telegram
                            </Button>
                          </a>
                          <a 
                            href="https://wa.me/79635124265" 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <Button className="bg-green-600 hover:bg-green-700 text-white w-full">
                              В WhatsApp
                            </Button>
                          </a>
                        </div>
                        <Button
                          onClick={() => handleInvestment('card')}
                          className="bg-orange-600 hover:bg-orange-700 text-white w-full mt-2"
                        >
                          Я перевел на карту
                        </Button>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={() => setShowPayment(false)}
                      className="w-full border-white/20 text-white hover:bg-white/10"
                    >
                      Отмена
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            {/* История инвестиций */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 neon-border">
              <h2 className="text-3xl font-bold text-cosmo-purple mb-6 neon-text">
                История инвестиций
              </h2>
              
              {investments.length === 0 ? (
                <p className="text-white/80 text-center py-8">
                  У вас пока нет инвестиций. Создайте первую инвестицию выше!
                </p>
              ) : (
                <div className="space-y-4">
                  {investments.map((investment) => (
                    <div
                      key={investment.id}
                      className="bg-white/5 rounded-xl p-6 border border-white/10"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="text-lg font-bold text-white mb-1">
                            {investment.amount.toLocaleString()} ₽
                          </div>
                          <div className="text-sm text-white/60">
                            Доля: {(investment.amount * 0.01 / 50000).toFixed(4)}% • {' '}
                            {new Date(investment.created_at).toLocaleDateString('ru-RU')}
                          </div>
                          {investment.payment_method && (
                            <div className="text-sm text-cosmo-blue">
                              Способ оплаты: {
                                investment.payment_method === 'yoomoney' ? 'ЮMoney' : 
                                investment.payment_method === 'usdt' ? 'USDT' :
                                'Карта'
                              }
                            </div>
                          )}
                          {investment.received_income && investment.received_income > 0 && (
                            <div className="text-sm text-cosmo-green">
                              Полученный доход: {investment.received_income.toLocaleString()} ₽
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                            investment.status === 'active' 
                              ? 'bg-cosmo-green/20 text-cosmo-green' 
                              : investment.status === 'paid'
                              ? 'bg-cosmo-blue/20 text-cosmo-blue'
                              : investment.status === 'under_review'
                              ? 'bg-yellow-500/20 text-yellow-500'
                              : investment.status === 'rejected'
                              ? 'bg-red-500/20 text-red-500'
                              : 'bg-gray-500/20 text-gray-500'
                          }`}>
                            {investment.status === 'active' 
                              ? 'Активно' 
                              : investment.status === 'paid'
                              ? 'Оплачено'
                              : investment.status === 'under_review'
                              ? 'На проверке'
                              : investment.status === 'rejected'
                              ? 'Отклонено'
                              : 'Ожидает оплаты'
                            }
                          </div>
                          
                          {investment.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => setShowConfirmation({
                                id: investment.id,
                                method: investment.payment_method
                              })}
                              className="bg-cosmo-purple hover:bg-cosmo-blue text-white"
                            >
                              Загрузить подтверждение
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {investment.admin_notes && (
                        <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                          <p className="text-blue-200 text-sm">
                            <strong>Заметка администратора:</strong> {investment.admin_notes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Модальные окна */}
      {showConfirmation && (
        <PaymentConfirmation
          investmentId={showConfirmation.id}
          paymentMethod={showConfirmation.method}
          onClose={() => setShowConfirmation(null)}
        />
      )}
      
      {showShareSale && (
        <ShareSaleModal
          totalPercentage={totalPercentage}
          onClose={() => setShowShareSale(false)}
        />
      )}

      {showIncomeTransactions && (
            <IncomeTransactionsModal
              isOpen={showIncomeTransactions}
              onClose={() => setShowIncomeTransactions(false)}
              transactions={incomeTransactions}
              totalInvestment={totalInvestment}
              totalPercentage={totalPercentage}
            />
      )}
    </div>
  );
};

export default Dashboard;


import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

const Dashboard = () => {
  const { user, investments, addInvestment, updateInvestmentStatus } = useAuth();
  const [investmentAmount, setInvestmentAmount] = useState(50000);
  const [showPayment, setShowPayment] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPercentage = investments.reduce((sum, inv) => sum + inv.percentage, 0);
  const yearlyReturn = totalPercentage * 357600000 / 100; // Базовая прибыль 357.6 млн рублей
  const potentialReturn = totalPercentage * 178800000000 / 100; // Потенциальная прибыль 178.8 млрд рублей

  const handleInvestment = async (paymentMethod: 'yoomoney' | 'telegram') => {
    if (investmentAmount < 50000) {
      toast({
        title: "Ошибка",
        description: "Минимальная сумма инвестиций 50,000 рублей",
        variant: "destructive"
      });
      return;
    }

    await addInvestment(investmentAmount, paymentMethod);
    
    if (paymentMethod === 'yoomoney') {
      window.open(`https://yoomoney.ru/to/410019220622751/${investmentAmount}`, '_blank');
    } else {
      // Здесь будет ссылка на Telegram для оплаты
      window.open('https://t.me/cosmofund', '_blank');
    }
    
    toast({
      title: "Инвестиция создана!",
      description: "Перейдите по ссылке для оплаты. После оплаты статус обновится автоматически.",
    });
    
    setShowPayment(false);
    setInvestmentAmount(50000);
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
            
            {/* Общая статистика */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
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
                <h3 className="text-cosmo-green font-bold mb-2 neon-text">Доходность в год</h3>
                <div className="text-2xl font-bold text-white">
                  {yearlyReturn.toLocaleString()} ₽
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 neon-border text-center">
                <h3 className="text-cosmo-blue font-bold mb-2 neon-text">Потенциал (5%)</h3>
                <div className="text-2xl font-bold text-white">
                  {(potentialReturn / 1000000).toFixed(1)}M ₽
                </div>
              </div>
            </div>
            
            {/* Новая инвестиция */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg rounded-3xl p-8 neon-border mb-12">
              <h2 className="text-3xl font-bold text-cosmo-blue mb-6 neon-text">
                Увеличить инвестиции
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
                    Инвестировать еще
                  </Button>
                </div>
              ) : (
                <div className="max-w-md mx-auto">
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
                        Доля: {((investmentAmount / 50000000) * 100).toFixed(4)}%
                      </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <Button
                        onClick={() => handleInvestment('yoomoney')}
                        className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-3"
                      >
                        Оплатить через ЮMoney
                      </Button>
                      
                      <Button
                        onClick={() => handleInvestment('telegram')}
                        className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-3"
                      >
                        Оплатить в Telegram
                      </Button>
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
                            Доля: {investment.percentage.toFixed(4)}% • {' '}
                            {new Date(investment.createdAt).toLocaleDateString('ru-RU')}
                          </div>
                          {investment.paymentMethod && (
                            <div className="text-sm text-cosmo-blue">
                              Способ оплаты: {investment.paymentMethod === 'yoomoney' ? 'ЮMoney' : 'Telegram'}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                            investment.status === 'active' 
                              ? 'bg-cosmo-green/20 text-cosmo-green' 
                              : investment.status === 'paid'
                              ? 'bg-cosmo-blue/20 text-cosmo-blue'
                              : 'bg-yellow-500/20 text-yellow-500'
                          }`}>
                            {investment.status === 'active' 
                              ? 'Активно' 
                              : investment.status === 'paid'
                              ? 'Оплачено'
                              : 'Ожидает оплаты'
                            }
                          </div>
                          
                          {investment.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => updateInvestmentStatus(investment.id, 'paid')}
                              className="bg-cosmo-blue hover:bg-cosmo-purple text-white"
                            >
                              Отметить как оплаченное
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

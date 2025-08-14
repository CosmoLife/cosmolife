import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, TrendingUp, Clock, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InvestmentFormProps {
  showPayment: boolean;
  onShowPayment: (show: boolean) => void;
  onInvestment: (amount: number, method: 'yoomoney' | 'usdt' | 'card') => void;
}

const InvestmentForm: React.FC<InvestmentFormProps> = ({
  showPayment,
  onShowPayment,
  onInvestment
}) => {
  const [investmentAmount, setInvestmentAmount] = useState(50000);
  const [usdtRate, setUsdtRate] = useState<number | null>(null);
  const [loadingRate, setLoadingRate] = useState(false);
  const { toast } = useToast();

  // Получение курса USDT к рублю
  useEffect(() => {
    const fetchUsdtRate = async () => {
      setLoadingRate(true);
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=rub');
        const data = await response.json();
        setUsdtRate(data.tether.rub);
      } catch (error) {
        console.error('Error fetching USDT rate:', error);
        setUsdtRate(95); // Fallback курс
      } finally {
        setLoadingRate(false);
      }
    };

    fetchUsdtRate();
    const interval = setInterval(fetchUsdtRate, 300000); // Обновляем каждые 5 минут
    return () => clearInterval(interval);
  }, []);

  const usdtAmount = usdtRate ? (investmentAmount / usdtRate).toFixed(2) : null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Скопировано",
      description: `${label} скопирован в буфер обмена`,
    });
  };

  const handleInvestment = (paymentMethod: 'yoomoney' | 'usdt' | 'card') => {
    onInvestment(investmentAmount, paymentMethod);
    onShowPayment(false);
    setInvestmentAmount(50000);
  };

  return (
    <div className="relative overflow-hidden glass-premium neuro-card rounded-3xl border border-white/10 shadow-2xl mb-12">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/3 w-40 h-40 bg-quantum-flux/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-cyber-electric/8 rounded-full blur-2xl"></div>
      </div>
      
      <div className="relative p-8 z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-r from-cosmo-blue to-cosmo-purple rounded-xl animate-neural-glow">
            <TrendingUp className="w-7 h-7 text-white animate-cyber-pulse" />
          </div>
          <h2 className="text-4xl font-bold holo-text animate-holo-shift">
            Инвестировать
          </h2>
        </div>
        
        {!showPayment ? (
          <div className="text-center space-y-6">
            <div className="space-y-6 text-center">
              <div className="glass-premium rounded-2xl p-6 border border-white/10">
                <p className="text-white/90 text-xl font-medium cyber-text mb-4">
                  Увеличьте свою долю в проекте Cosmo Life
                </p>
                <div className="flex items-center justify-center gap-3 text-quantum-flux">
                  <Clock className="w-5 h-5 animate-cyber-pulse" />
                  <span className="text-sm font-medium">Заявки обрабатываются от 5 до 30 минут</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
                <Button
                  onClick={() => onShowPayment(true)}
                  className="group relative bg-gradient-to-r from-cosmo-blue via-cosmo-purple to-cosmo-green hover:shadow-xl text-white font-bold py-5 px-10 text-xl rounded-2xl border border-cosmo-blue/30 transition-all duration-200 hover:scale-[1.02]"
                >
                  <span className="relative z-10">Инвестировать</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cosmo-blue/20 to-cosmo-purple/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </Button>
                
                <div className="flex items-center gap-3 text-white/70">
                  <Shield className="w-5 h-5 animate-cyber-pulse" />
                  <span className="text-sm font-medium cyber-text">Безопасные транзакции</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="glass-premium rounded-2xl p-8 border border-white/10">
              <Label htmlFor="amount" className="text-white mb-4 block text-xl font-bold">
                Сумма инвестиций (от 50,000 ₽)
              </Label>
              <Input
                id="amount"
                type="number"
                min="50000"
                step="1000"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                className="bg-white/10 border-white/20 text-white text-xl h-14 rounded-xl transition-colors duration-200 focus:border-quantum-flux focus:ring-2 focus:ring-quantum-flux/20"
              />
              <p className="text-lg text-quantum-flux mt-3 font-bold">
                Доля: {(investmentAmount * 0.01 / 50000).toFixed(4)}%
              </p>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-bold holo-text animate-holo-shift mb-6 flex items-center justify-center gap-3">
                <Shield className="w-6 h-6 text-quantum-flux animate-cyber-pulse" />
                Способы оплаты
              </h3>
              
              {/* ЮMoney */}
              <div className="glass-premium neuro-card rounded-2xl p-6 border border-purple-500/30 magnetic-element transition-all duration-300 hover:scale-[1.02]">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="font-bold text-purple-300 text-xl cyber-text">ЮMoney</span>
                    <p className="text-sm text-white/80 mt-2 font-medium">
                      (С банковских карт российских банков 100 000 ₽/операция. Не более 600 000 ₽/сутки)
                    </p>
                  </div>
                  <Button
                    onClick={() => handleInvestment('yoomoney')}
                    className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-xl px-8 py-3 font-bold transition-all duration-300 hover:scale-105 animate-neural-glow"
                  >
                    Оплатить
                  </Button>
                </div>
              </div>
              
              {/* USDT */}
              <div className="glass-premium neuro-card rounded-2xl p-6 border border-green-500/30 magnetic-element transition-all duration-300 hover:scale-[1.02]">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-green-300 text-xl cyber-text">USDT BEP-20</span>
                  <Button
                    onClick={() => copyToClipboard('0x9e00d62d50ef12d41394082d63aee3abf286d0c5', 'Адрес кошелька')}
                    variant="outline"
                    size="sm"
                    className="border-green-500 text-green-300 hover:bg-green-500 hover:text-white rounded-xl px-4 py-2 font-bold transition-all duration-300 hover:scale-105"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Копировать адрес
                  </Button>
                </div>
                
                {/* Адрес кошелька - большой и по центру */}
                <div className="bg-green-500/5 rounded-lg p-4 mb-4 border border-green-500/20">
                  <p className="text-center text-green-300 font-mono text-lg font-bold break-all">
                    0x9e00d62d50ef12d41394082d63aee3abf286d0c5
                  </p>
                </div>
                
                {/* Информация о сумме USDT */}
                <div className="bg-green-500/5 rounded-lg p-3 mb-3 border border-green-500/10">
                  <p className="text-green-300 font-medium text-center">
                    {loadingRate ? (
                      'Загрузка курса...'
                    ) : usdtAmount ? (
                      `Переведите ${usdtAmount} USDT в сети BEP-20`
                    ) : (
                      'Ошибка загрузки курса'
                    )}
                  </p>
                  {usdtRate && (
                    <p className="text-xs text-white/60 text-center mt-1">
                      Курс: 1 USDT = {usdtRate.toFixed(2)} ₽
                    </p>
                  )}
                </div>
                
                <Button
                  onClick={() => handleInvestment('usdt')}
                  className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white w-full rounded-xl py-4 font-bold transition-all duration-300 hover:scale-[1.02] animate-neural-glow"
                >
                  Я отправил USDT
                </Button>
              </div>
              
               {/* Карты доверенных лиц */}
               <div className="glass-premium neuro-card rounded-2xl p-6 border border-orange-500/30 magnetic-element transition-all duration-300 hover:scale-[1.02]">
                 <div className="mb-6">
                   <span className="font-bold text-orange-300 text-xl cyber-text">Перевод на карты в СНГ</span>
                   <p className="text-sm text-white/80 mt-2 font-medium">Запросить данные карты:</p>
                 </div>
                 <div className="grid md:grid-cols-2 gap-4">
                   <a 
                     href="https://t.me/CosmoLifeApp" 
                     target="_blank" 
                     rel="noopener noreferrer"
                   >
                     <Button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white w-full rounded-xl py-3 font-bold transition-all duration-300 hover:scale-105">
                       В Telegram
                     </Button>
                   </a>
                   <a 
                     href="https://wa.me/79635124265" 
                     target="_blank" 
                     rel="noopener noreferrer"
                   >
                     <Button className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white w-full rounded-xl py-3 font-bold transition-all duration-300 hover:scale-105">
                       В WhatsApp
                     </Button>
                   </a>
                 </div>
                 <Button
                   onClick={() => handleInvestment('card')}
                   className="bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white w-full mt-4 rounded-xl py-4 font-bold transition-all duration-300 hover:scale-[1.02] animate-neural-glow"
                 >
                   Я перевел на карту
                 </Button>
               </div>
             </div>
             
             <Button
               variant="outline"
               onClick={() => onShowPayment(false)}
               className="w-full border-white/20 text-white hover:bg-white/10 rounded-xl py-4 font-bold transition-all duration-300 hover:scale-[1.02]"
             >
               Отмена
             </Button>
           </div>
         )}
       </div>
     </div>
  );
};

export default InvestmentForm;
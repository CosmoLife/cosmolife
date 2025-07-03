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
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-800/90 via-slate-900/95 to-black/90 backdrop-blur-xl rounded-2xl border border-gradient-to-r from-cosmo-blue/30 to-cosmo-purple/30 shadow-2xl shadow-cosmo-blue/10 mb-12">
      {/* Фоновые элементы */}
      <div className="absolute inset-0 bg-gradient-to-br from-cosmo-blue/5 via-transparent to-cosmo-purple/5" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-cosmo-blue/10 rounded-full blur-3xl -translate-y-8 translate-x-8" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-cosmo-purple/10 rounded-full blur-3xl translate-y-8 -translate-x-8" />
      
      <div className="relative p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-cosmo-blue to-cosmo-purple rounded-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cosmo-blue to-cosmo-purple bg-clip-text text-transparent">
            Инвестировать
          </h2>
        </div>
        
        {!showPayment ? (
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <p className="text-white/90 text-lg">
                Увеличьте свою долю в проекте Cosmo Life
              </p>
              <div className="flex items-center justify-center gap-2 text-cosmo-blue/80">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Заявки обрабатываются от 5 до 30 минут</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Button
                onClick={() => onShowPayment(true)}
                className="group relative bg-gradient-to-r from-cosmo-blue via-cosmo-purple to-cosmo-green hover:shadow-lg hover:shadow-cosmo-blue/25 text-white font-semibold py-4 px-8 text-lg rounded-xl border border-cosmo-blue/30 transition-all duration-300 hover:scale-[1.02]"
              >
                <span className="relative z-10">Инвестировать</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cosmo-blue/20 to-cosmo-purple/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
              
              <div className="flex items-center gap-2 text-white/60">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Безопасные транзакции</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <Label htmlFor="amount" className="text-white mb-3 block text-lg font-medium">
                Сумма инвестиций (от 50,000 ₽)
              </Label>
              <Input
                id="amount"
                type="number"
                min="50000"
                step="1000"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                className="bg-white/10 border-white/20 text-white text-lg h-12 rounded-lg"
              />
              <p className="text-sm text-cosmo-blue/80 mt-2 font-medium">
                Доля: {(investmentAmount * 0.01 / 50000).toFixed(4)}%
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-cosmo-blue" />
                Способы оплаты:
              </h3>
              
              {/* ЮMoney */}
              <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-xl p-5 border border-purple-500/20">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <span className="font-bold text-purple-300 text-lg">ЮMoney</span>
                    <p className="text-sm text-white/70 mt-1">
                      (С банковских карт российских банков 100 000 ₽/операция. Не более 600 000 ₽/сутки)
                    </p>
                  </div>
                  <Button
                    onClick={() => handleInvestment('yoomoney')}
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-6 py-2 font-medium"
                  >
                    Оплатить
                  </Button>
                </div>
              </div>
              
              {/* USDT */}
              <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-xl p-5 border border-green-500/20">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-green-300 text-lg">USDT BEP-20</span>
                  <Button
                    onClick={() => copyToClipboard('0x9e00d62d50ef12d41394082d63aee3abf286d0c5', 'Адрес кошелька')}
                    variant="outline"
                    size="sm"
                    className="border-green-500 text-green-300 hover:bg-green-500 hover:text-white rounded-lg"
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
                  className="bg-green-600 hover:bg-green-700 text-white w-full rounded-lg py-3 font-medium"
                >
                  Я отправил USDT
                </Button>
              </div>
              
               {/* Карты доверенных лиц */}
               <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-xl p-5 border border-orange-500/20">
                 <div className="mb-4">
                   <span className="font-bold text-orange-300 text-lg">Перевод на карты в СНГ</span>
                   <p className="text-sm text-white/70 mt-1">Запросить данные карты:</p>
                 </div>
                 <div className="grid md:grid-cols-2 gap-3">
                   <a 
                     href="https://t.me/CosmoLifeApp" 
                     target="_blank" 
                     rel="noopener noreferrer"
                   >
                     <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full rounded-lg py-2 font-medium">
                       В Telegram
                     </Button>
                   </a>
                   <a 
                     href="https://wa.me/79635124265" 
                     target="_blank" 
                     rel="noopener noreferrer"
                   >
                     <Button className="bg-green-600 hover:bg-green-700 text-white w-full rounded-lg py-2 font-medium">
                       В WhatsApp
                     </Button>
                   </a>
                 </div>
                 <Button
                   onClick={() => handleInvestment('card')}
                   className="bg-orange-600 hover:bg-orange-700 text-white w-full mt-3 rounded-lg py-3 font-medium"
                 >
                   Я перевел на карту
                 </Button>
               </div>
             </div>
             
             <Button
               variant="outline"
               onClick={() => onShowPayment(false)}
               className="w-full border-white/20 text-white hover:bg-white/10 rounded-lg py-3 font-medium"
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
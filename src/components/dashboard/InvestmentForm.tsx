import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy } from 'lucide-react';
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
  const { toast } = useToast();

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
            onClick={() => onShowPayment(true)}
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
              onClick={() => onShowPayment(false)}
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              Отмена
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentForm;
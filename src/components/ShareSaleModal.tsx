
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useInvestment } from '@/contexts/InvestmentContext';
import { useProfile } from '@/contexts/ProfileContext';

interface ShareSaleModalProps {
  totalPercentage: number;
  onClose: () => void;
}

const ShareSaleModal: React.FC<ShareSaleModalProps> = ({ totalPercentage, onClose }) => {
  const { createShareSaleRequest } = useInvestment();
  const { profile } = useProfile();
  const { toast } = useToast();
  const [sharePercentage, setSharePercentage] = useState(totalPercentage);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile?.usdt_wallet?.trim()) {
      toast({
        title: "Ошибка",
        description: "Сначала укажите кошелек USDT BEP-20 в профиле",
        variant: "destructive"
      });
      return;
    }

    if (sharePercentage <= 0 || sharePercentage > totalPercentage) {
      toast({
        title: "Ошибка",
        description: "Неверный процент для продажи",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await createShareSaleRequest(sharePercentage, profile.usdt_wallet);
      toast({
        title: "Заявка отправлена",
        description: "Заявка на продажу доли отправлена и ожидает одобрения администратора. В случае одобрения ваша доля будет автоматически продана с нашего сайта следующему инвестору, а деньги за минусом комиссии будут зачислены на указанный кошелек USDT BEP-20.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative overflow-hidden glass-premium neuro-card quantum-particle magnetic-element rounded-3xl p-8 max-w-lg w-full mx-4">
        {/* 2025 Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-24 h-24 bg-quantum-flux/20 rounded-full blur-2xl animate-quantum-rotate"></div>
          <div className="absolute bottom-1/3 left-1/5 w-20 h-20 bg-cyber-purple/15 rounded-full blur-xl animate-neural-glow"></div>
        </div>

        <div className="relative z-10">
          <h3 className="text-3xl font-bold holo-text animate-holo-shift mb-8 text-center">
            Продать долю
          </h3>
        
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="glass-premium rounded-2xl p-6 border border-white/10">
              <Label htmlFor="share-percentage" className="text-white mb-3 block text-lg font-medium cyber-text">
                Процент для продажи (макс: {totalPercentage.toFixed(4)}%)
              </Label>
              <Input
                id="share-percentage"
                type="number"
                step="0.0001"
                max={totalPercentage}
                min="0.0001"
                value={sharePercentage}
                onChange={(e) => setSharePercentage(Number(e.target.value))}
                className="bg-white/10 border-white/20 text-white text-lg h-12 rounded-xl transition-all duration-300 focus:border-quantum-flux focus:ring-2 focus:ring-quantum-flux/20"
                required
              />
            </div>
            
            <div className="glass-premium rounded-2xl p-6 border border-white/10">
              <Label className="text-white mb-3 block text-lg font-medium cyber-text">
                Кошелек USDT BEP-20
              </Label>
              <div className="text-sm text-white/90 bg-gradient-to-r from-white/5 to-white/10 p-4 rounded-xl border border-white/10">
                {profile?.usdt_wallet || 'Не указан (требуется заполнить в профиле)'}
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-4 rounded-xl border border-yellow-500/20">
              <div className="text-sm text-yellow-200 font-medium">
                ⚠️ При продаже доли через платформу мы берем комиссию 20% от суммы сделки.
              </div>
            </div>
            
            <div className="flex gap-4 mt-8">
              <Button
                type="submit"
                disabled={loading || !profile?.usdt_wallet?.trim()}
                className="group relative bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold py-3 px-6 rounded-xl flex-1 transition-all duration-300 hover:scale-[1.02] animate-neural-glow"
              >
                <span className="relative z-10">
                  {loading ? 'Отправка...' : 'Отправить заявку'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-700/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-white/20 text-white hover:bg-white/10 py-3 px-6 rounded-xl font-medium transition-all duration-300 hover:scale-[1.02]"
              >
                Отмена
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShareSaleModal;

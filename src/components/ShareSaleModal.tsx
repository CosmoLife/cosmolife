
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface ShareSaleModalProps {
  totalPercentage: number;
  onClose: () => void;
}

const ShareSaleModal: React.FC<ShareSaleModalProps> = ({ totalPercentage, onClose }) => {
  const { createShareSaleRequest, profile } = useAuth();
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-2xl p-8 max-w-md w-full mx-4 neon-border">
        <h3 className="text-2xl font-bold text-cosmo-blue mb-6 neon-text">
          Продать долю
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="share-percentage" className="text-white mb-2 block">
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
              className="bg-white/5 border-white/20 text-white"
              required
            />
          </div>
          
          <div>
            <Label className="text-white mb-2 block">
              Кошелек USDT BEP-20
            </Label>
            <div className="text-sm text-white/80 bg-white/5 p-2 rounded">
              {profile?.usdt_wallet || 'Не указан (требуется заполнить в профиле)'}
            </div>
          </div>
          
          <div className="text-xs text-yellow-200 bg-yellow-500/20 p-3 rounded">
            При продаже доли через платформу мы берем комиссию 20% от суммы сделки.
          </div>
          
          <div className="flex gap-4 mt-6">
            <Button
              type="submit"
              disabled={loading || !profile?.usdt_wallet?.trim()}
              className="bg-red-600 hover:bg-red-700 text-white flex-1"
            >
              {loading ? 'Отправка...' : 'Отправить заявку'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Отмена
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShareSaleModal;

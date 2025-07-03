import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

interface ShareSaleSectionProps {
  totalPercentage: number;
  onShareSale: () => void;
}

const ShareSaleSection: React.FC<ShareSaleSectionProps> = ({
  totalPercentage,
  onShareSale
}) => {
  const [showCommissionInfo, setShowCommissionInfo] = useState(false);

  const handleShareSale = () => {
    if (totalPercentage <= 0) {
      return;
    }
    onShareSale();
  };

  return (
    <div className="relative overflow-hidden glass-premium neuro-card rounded-3xl p-8 mb-12">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-quantum-flux/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/5 w-24 h-24 bg-cyber-purple/8 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 text-center space-y-6">
        <h2 className="text-3xl font-bold holo-text animate-holo-shift mb-6">
          Управление долей
        </h2>
        
        <div className="flex flex-col items-center gap-6">
          <Button
            onClick={handleShareSale}
            className="group relative bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold py-4 px-8 text-lg rounded-xl border border-red-500/30 transition-all duration-200 hover:scale-[1.01]"
          >
            <span className="relative z-10">Продать мою долю</span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-700/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onMouseEnter={() => setShowCommissionInfo(true)}
            onMouseLeave={() => setShowCommissionInfo(false)}
            className="relative text-white/60 hover:text-white transition-all duration-300 hover:scale-105"
          >
            <Info className="w-5 h-5 animate-cyber-pulse" />
            {showCommissionInfo && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 glass-premium rounded-xl shadow-2xl whitespace-nowrap z-20 border border-red-500/30">
                <div className="text-sm text-white font-medium">
                  <span className="text-red-300">⚠️ Внимание:</span> При продаже доли через платформу мы берем комиссию 20% от суммы сделки.
                </div>
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShareSaleSection;
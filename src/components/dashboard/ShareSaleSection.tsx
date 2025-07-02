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
  );
};

export default ShareSaleSection;
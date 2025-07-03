import React from 'react';
import { Button } from '@/components/ui/button';

interface InvestmentStatsProps {
  totalInvestment: number;
  totalPercentage: number;
  yearlyReturn: number;
  potentialReturn: number;
  totalReceivedIncome: number;
  onShowIncomeTransactions: () => void;
}

const InvestmentStats: React.FC<InvestmentStatsProps> = ({
  totalInvestment,
  totalPercentage,
  yearlyReturn,
  potentialReturn,
  totalReceivedIncome,
  onShowIncomeTransactions
}) => {
  return (
    <div className="grid md:grid-cols-5 gap-6 mb-12">
      <div className="glass-premium rounded-2xl p-6 border border-white/10 text-center">
        <h3 className="text-cosmo-blue font-bold mb-2">Общие инвестиции</h3>
        <div className="text-2xl font-bold text-white">
          {totalInvestment.toLocaleString()} ₽
        </div>
      </div>
      
      <div className="glass-premium rounded-2xl p-6 border border-white/10 text-center">
        <h3 className="text-cosmo-purple font-bold mb-2">Доля в проекте</h3>
        <div className="text-2xl font-bold text-white">
          {totalPercentage.toFixed(4)}%
        </div>
      </div>
      
      <div className="glass-premium rounded-2xl p-6 border border-white/10 text-center">
        <h3 className="text-cosmo-green font-bold mb-2">Прогноз доходности в год</h3>
        <div className="text-2xl font-bold text-white">
          {yearlyReturn.toLocaleString()} ₽
        </div>
      </div>
      
      <div className="glass-premium rounded-2xl p-6 border border-white/10 text-center">
        <h3 className="text-cosmo-blue font-bold mb-2">Потенциал (При 5% рынка)</h3>
        <div className="text-2xl font-bold text-white">
          {(potentialReturn / 1000000).toFixed(1)}M ₽
        </div>
      </div>
      
      <div 
        className="glass-premium rounded-2xl p-6 border border-cosmo-green/30 text-center cursor-pointer hover:bg-cosmo-green/5 transition-all duration-200"
        onClick={onShowIncomeTransactions}
      >
        <h3 className="text-cosmo-green font-bold mb-2 text-lg">💰 Полученный доход</h3>
        <div className="text-2xl font-bold text-white">
          {totalReceivedIncome.toLocaleString()} ₽
        </div>
        <div className="text-xs text-cosmo-green/80 mt-1 font-semibold">👆 Нажмите для просмотра транзакций</div>
      </div>
    </div>
  );
};

export default InvestmentStats;
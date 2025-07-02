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
        onClick={onShowIncomeTransactions}
      >
        <h3 className="text-cosmo-green font-bold mb-2 neon-text text-lg">💰 Полученный доход</h3>
        <div className="text-2xl font-bold text-white">
          {totalReceivedIncome.toLocaleString()} ₽
        </div>
        <div className="text-xs text-cosmo-green/80 mt-1 font-semibold">👆 Нажмите для просмотра транзакций</div>
      </div>
    </div>
  );
};

export default InvestmentStats;
import React from 'react';
import { Button } from '@/components/ui/button';

interface InvestmentStatsProps {
  totalInvestment: number;
  totalPercentage: number;
  yearlyReturn: number;
  potentialReturn: number;
  totalReceivedIncome: number;
  onShowIncomeTransactions: () => void;
  onScrollToVideos?: () => void;
}

const InvestmentStats: React.FC<InvestmentStatsProps> = ({
  totalInvestment,
  totalPercentage,
  yearlyReturn,
  potentialReturn,
  totalReceivedIncome,
  onShowIncomeTransactions,
  onScrollToVideos
}) => {
  return (
    <div className="space-y-6 mb-12">
      {totalPercentage > 0 ? (
        <div className="glass-premium rounded-2xl p-6 border border-cosmo-blue/30 text-center bg-cosmo-blue/5">
          <h3 className="text-cosmo-blue font-bold mb-3 text-lg">📹 Эксклюзивные 
            <span 
              className="underline cursor-pointer hover:text-cosmo-purple transition-colors"
              onClick={onScrollToVideos}
            >
              видео
            </span> обновления
          </h3>
          <p className="text-white/80 text-sm">
            Как инвестор с долей {totalPercentage.toFixed(4)}%, у вас есть доступ к закрытым видео о разработке Cosmo Life. 
            Узнавайте первыми о новых функциях и достижениях команды!
          </p>
        </div>
      ) : (
        <div className="glass-premium rounded-2xl p-6 border border-cosmo-green/30 text-center bg-cosmo-green/5">
          <h3 className="text-cosmo-green font-bold mb-3 text-lg">🎬 Эксклюзивные видео ждут вас!</h3>
          <p className="text-white/80 text-sm">
            После приобретения доли в проекте вы получите доступ к закрытым видео о разработке Cosmo Life. 
            Станьте частью команды и узнавайте о новых функциях первыми!
          </p>
        </div>
      )}
      
      <div className="grid md:grid-cols-5 gap-6">
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
    </div>
  );
};

export default InvestmentStats;
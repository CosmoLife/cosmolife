import { Card } from '@/components/ui/card';
import { TrendingUp, Users, Activity } from 'lucide-react';

export const TrafficAnalytics = () => {
  return (
    <Card className="glass-premium neuro-card border border-white/10 rounded-3xl p-8 mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-neon-gradient bg-clip-text text-transparent mb-2">
          Аналитика трафика
        </h2>
        <p className="text-white/60">
          Детальная статистика роста пользователей по всем платформам VINNI
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-12 space-y-6">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="p-4 rounded-full bg-gradient-to-br from-chart-1/20 to-chart-1/5 border border-white/10">
            <TrendingUp className="w-8 h-8 text-chart-1" />
          </div>
          <div className="p-4 rounded-full bg-gradient-to-br from-chart-2/20 to-chart-2/5 border border-white/10">
            <Users className="w-8 h-8 text-chart-2" />
          </div>
          <div className="p-4 rounded-full bg-gradient-to-br from-chart-3/20 to-chart-3/5 border border-white/10">
            <Activity className="w-8 h-8 text-chart-3" />
          </div>
        </div>

        <div className="text-center max-w-md">
          <h3 className="text-xl font-semibold text-white mb-3">
            Аналитика настраивается
          </h3>
          <p className="text-white/60 leading-relaxed">
            Мы работаем над интеграцией системы аналитики для отслеживания роста пользователей 
            и конверсий по всем платформам VINNI Factory, VINNI Game и VINNI Binary. 
            Скоро здесь появятся детальные графики и статистика.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 w-full">
          <div className="p-4 rounded-xl border border-white/10 bg-gradient-to-br from-chart-1/10 to-transparent">
            <div className="text-sm text-white/60 mb-1">VINNI Factory</div>
            <div className="text-lg font-semibold text-white">Скоро</div>
          </div>
          <div className="p-4 rounded-xl border border-white/10 bg-gradient-to-br from-chart-2/10 to-transparent">
            <div className="text-sm text-white/60 mb-1">VINNI Game</div>
            <div className="text-lg font-semibold text-white">Скоро</div>
          </div>
          <div className="p-4 rounded-xl border border-white/10 bg-gradient-to-br from-chart-3/10 to-transparent">
            <div className="text-sm text-white/60 mb-1">VINNI Binary</div>
            <div className="text-lg font-semibold text-white">Скоро</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

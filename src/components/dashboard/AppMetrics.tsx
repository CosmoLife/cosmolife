import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { SyncMetricsButton } from './SyncMetricsButton';
import { 
  Users, 
  Download, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  UserCheck,
  Percent,
  Activity
} from 'lucide-react';

interface AppMetric {
  date: string;
  dau: number;
  mau: number;
  new_downloads: number;
  total_downloads: number;
  avg_session_duration: number;
  sessions_per_user: number;
  retention_day1: number;
  retention_day7: number;
  retention_day30: number;
  churn_rate: number;
  revenue: number;
  arpu: number;
  arppu: number;
  paying_users: number;
  conversion_rate: number;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  trend?: number;
  format?: 'number' | 'currency' | 'percent' | 'time';
}

const MetricCard = ({ title, value, subtitle, icon, trend, format = 'number' }: MetricCardProps) => {
  const formatValue = (val: string | number) => {
    const numVal = typeof val === 'string' ? parseFloat(val) : val;
    
    switch (format) {
      case 'currency':
        return `$${numVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'percent':
        return `${numVal.toFixed(2)}%`;
      case 'time':
        return `${numVal.toFixed(1)} мин`;
      default:
        return numVal.toLocaleString();
    }
  };

  return (
    <Card className="glass-premium border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-xl bg-white/5">
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{Math.abs(trend).toFixed(1)}%</span>
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-white mb-1">
        {formatValue(value)}
      </div>
      <div className="text-white/60 text-sm mb-1">{title}</div>
      <div className="text-white/40 text-xs">{subtitle}</div>
    </Card>
  );
};

export const AppMetrics = () => {
  const [metrics, setMetrics] = useState<AppMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('app_metrics')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setMetrics(data || []);
    } catch (error) {
      console.error('Error fetching app metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const latestMetric = metrics[metrics.length - 1];
  const previousMetric = metrics[metrics.length - 2];

  const calculateTrend = (current: number, previous: number) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  const getChartData = () => {
    return metrics.map(item => ({
      date: new Date(item.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
      DAU: item.dau,
      MAU: item.mau,
      'Новые загрузки': item.new_downloads,
      'Всего загрузок': item.total_downloads,
      'Средняя сессия': item.avg_session_duration,
      'Сессий на юзера': item.sessions_per_user,
      'Удержание 1д': item.retention_day1,
      'Удержание 7д': item.retention_day7,
      'Удержание 30д': item.retention_day30,
      'Отток': item.churn_rate,
      'Доход': item.revenue,
      'ARPU': item.arpu,
      'ARPPU': item.arppu,
      'Платящих': item.paying_users,
      'Конверсия': item.conversion_rate
    }));
  };

  const chartData = getChartData();

  if (loading) {
    return (
      <Card className="glass-premium neuro-card border border-white/10 rounded-3xl p-8 mb-8">
        <div className="text-center text-white/60">Загрузка метрик...</div>
      </Card>
    );
  }

  if (!latestMetric) {
    return (
      <Card className="glass-premium neuro-card border border-white/10 rounded-3xl p-8 mb-8">
        <div className="text-center">
          <p className="text-white/60 mb-4">Данные метрик еще не загружены</p>
          <SyncMetricsButton />
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-premium neuro-card border border-white/10 rounded-3xl p-8 mb-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold bg-neon-gradient bg-clip-text text-transparent mb-2">
            VINNI SUPER APP Metrics
          </h2>
          <p className="text-white/60">Ключевые метрики приложения</p>
        </div>
        <SyncMetricsButton />
      </div>

      {/* Основные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="DAU"
          value={latestMetric.dau}
          subtitle="Daily Active Users"
          icon={<Users className="w-5 h-5 text-purple-400" />}
          trend={previousMetric ? calculateTrend(latestMetric.dau, previousMetric.dau) : undefined}
        />
        
        <MetricCard
          title="MAU"
          value={latestMetric.mau}
          subtitle="Monthly Active Users"
          icon={<Activity className="w-5 h-5 text-blue-400" />}
          trend={previousMetric ? calculateTrend(latestMetric.mau, previousMetric.mau) : undefined}
        />
        
        <MetricCard
          title="Всего загрузок"
          value={latestMetric.total_downloads}
          subtitle={`+${latestMetric.new_downloads} сегодня`}
          icon={<Download className="w-5 h-5 text-emerald-400" />}
        />
        
        <MetricCard
          title="Средняя сессия"
          value={latestMetric.avg_session_duration}
          subtitle="минут на юзера"
          icon={<Clock className="w-5 h-5 text-cyan-400" />}
          format="time"
          trend={previousMetric ? calculateTrend(latestMetric.avg_session_duration, previousMetric.avg_session_duration) : undefined}
        />
      </div>

      {/* Финансовые метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Дневной доход"
          value={latestMetric.revenue}
          subtitle="Revenue за день"
          icon={<DollarSign className="w-5 h-5 text-yellow-400" />}
          format="currency"
          trend={previousMetric ? calculateTrend(latestMetric.revenue, previousMetric.revenue) : undefined}
        />
        
        <MetricCard
          title="ARPU"
          value={latestMetric.arpu}
          subtitle="Average Revenue Per User"
          icon={<DollarSign className="w-5 h-5 text-orange-400" />}
          format="currency"
        />
        
        <MetricCard
          title="Платящих юзеров"
          value={latestMetric.paying_users}
          subtitle={`Конверсия ${latestMetric.conversion_rate.toFixed(2)}%`}
          icon={<UserCheck className="w-5 h-5 text-pink-400" />}
          trend={previousMetric ? calculateTrend(latestMetric.paying_users, previousMetric.paying_users) : undefined}
        />
        
        <MetricCard
          title="ARPPU"
          value={latestMetric.arppu}
          subtitle="Average Revenue Per Paying User"
          icon={<DollarSign className="w-5 h-5 text-green-400" />}
          format="currency"
        />
      </div>

      {/* Retention метрики */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <MetricCard
          title="Retention Day 1"
          value={latestMetric.retention_day1}
          subtitle="Удержание через день"
          icon={<Percent className="w-5 h-5 text-emerald-400" />}
          format="percent"
        />
        
        <MetricCard
          title="Retention Day 7"
          value={latestMetric.retention_day7}
          subtitle="Удержание через неделю"
          icon={<Percent className="w-5 h-5 text-blue-400" />}
          format="percent"
        />
        
        <MetricCard
          title="Retention Day 30"
          value={latestMetric.retention_day30}
          subtitle="Удержание через месяц"
          icon={<Percent className="w-5 h-5 text-purple-400" />}
          format="percent"
        />
      </div>

      {/* Графики */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="glass-premium border border-white/10 p-1 mb-6">
          <TabsTrigger value="users" className="data-[state=active]:bg-white/10">
            Пользователи
          </TabsTrigger>
          <TabsTrigger value="revenue" className="data-[state=active]:bg-white/10">
            Доход
          </TabsTrigger>
          <TabsTrigger value="engagement" className="data-[state=active]:bg-white/10">
            Вовлеченность
          </TabsTrigger>
          <TabsTrigger value="retention" className="data-[state=active]:bg-white/10">
            Retention
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <Card className="glass-premium border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Активные пользователи</h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorDAU" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMAU" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                  }} 
                />
                <Legend />
                <Area type="monotone" dataKey="DAU" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorDAU)" />
                <Area type="monotone" dataKey="MAU" stroke="#06B6D4" fillOpacity={1} fill="url(#colorMAU)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="glass-premium border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Загрузки приложения</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                  }} 
                />
                <Legend />
                <Bar dataKey="Новые загрузки" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card className="glass-premium border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Динамика дохода</h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                  }} 
                />
                <Legend />
                <Area type="monotone" dataKey="Доход" stroke="#F59E0B" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="glass-premium border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">ARPU</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px'
                    }} 
                  />
                  <Line type="monotone" dataKey="ARPU" stroke="#F97316" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="glass-premium border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Платящие пользователи</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px'
                    }} 
                  />
                  <Bar dataKey="Платящих" fill="#EC4899" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <Card className="glass-premium border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Средняя длительность сессии</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                  }} 
                />
                <Line type="monotone" dataKey="Средняя сессия" stroke="#06B6D4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="glass-premium border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Сессий на пользователя</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                  }} 
                />
                <Bar dataKey="Сессий на юзера" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="retention" className="space-y-6">
          <Card className="glass-premium border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Retention по дням</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                  }} 
                />
                <Legend />
                <Line type="monotone" dataKey="Удержание 1д" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="Удержание 7д" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="Удержание 30д" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="glass-premium border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Churn Rate (отток)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorChurn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                  }} 
                />
                <Area type="monotone" dataKey="Отток" stroke="#EF4444" fillOpacity={1} fill="url(#colorChurn)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Users, UserPlus, Activity, TrendingUp } from 'lucide-react';

interface TrafficData {
  platform: string;
  date: string;
  total_users: number;
  new_registrations: number;
  active_users: number;
  super_app_conversions: number;
}

interface PlatformStats {
  name: string;
  displayName: string;
  color: string;
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  conversions: number;
  conversionRate: string;
}

const platformConfig = {
  vinni_factory: {
    name: 'vinni_factory',
    displayName: 'VINNI Factory',
    color: '#8B5CF6',
    gradient: 'from-purple-500 to-purple-700'
  },
  vinni_game: {
    name: 'vinni_game',
    displayName: 'VINNI Game',
    color: '#EC4899',
    gradient: 'from-pink-500 to-pink-700'
  },
  vinni_binary: {
    name: 'vinni_binary',
    displayName: 'VINNI Binary',
    color: '#06B6D4',
    gradient: 'from-cyan-500 to-cyan-700'
  }
};

export const TrafficAnalytics = () => {
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'vinni_factory' | 'vinni_game' | 'vinni_binary'>('all');

  useEffect(() => {
    fetchTrafficData();
  }, []);

  const fetchTrafficData = async () => {
    try {
      const { data, error } = await supabase
        .from('traffic_analytics')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setTrafficData(data || []);
    } catch (error) {
      console.error('Error fetching traffic data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformStats = (): PlatformStats[] => {
    const platforms = ['vinni_factory', 'vinni_game', 'vinni_binary'];
    
    return platforms.map(platform => {
      const platformData = trafficData.filter(d => d.platform === platform);
      const latest = platformData[platformData.length - 1];
      const first = platformData[0];
      
      if (!latest || !first) {
        return {
          name: platform,
          displayName: platformConfig[platform as keyof typeof platformConfig].displayName,
          color: platformConfig[platform as keyof typeof platformConfig].color,
          totalUsers: 0,
          newUsers: 0,
          activeUsers: 0,
          conversions: 0,
          conversionRate: '0.00'
        };
      }

      const totalNewUsers = latest.total_users - first.total_users;
      const totalConversions = platformData.reduce((sum, d) => sum + d.super_app_conversions, 0);
      const conversionRate = totalNewUsers > 0 ? ((totalConversions / totalNewUsers) * 100).toFixed(2) : '0.00';

      return {
        name: platform,
        displayName: platformConfig[platform as keyof typeof platformConfig].displayName,
        color: platformConfig[platform as keyof typeof platformConfig].color,
        totalUsers: latest.total_users,
        newUsers: totalNewUsers,
        activeUsers: latest.active_users,
        conversions: totalConversions,
        conversionRate
      };
    });
  };

  const getChartData = () => {
    const filteredData = selectedPlatform === 'all' 
      ? trafficData 
      : trafficData.filter(d => d.platform === selectedPlatform);

    // Группируем данные по датам для режима "все платформы"
    if (selectedPlatform === 'all') {
      const dateMap = new Map();
      
      filteredData.forEach(item => {
        const date = new Date(item.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
        
        if (!dateMap.has(date)) {
          dateMap.set(date, {
            date,
            Factory: 0,
            Game: 0,
            Binary: 0
          });
        }
        
        const entry = dateMap.get(date);
        if (item.platform === 'vinni_factory') entry.Factory = item.total_users;
        if (item.platform === 'vinni_game') entry.Game = item.total_users;
        if (item.platform === 'vinni_binary') entry.Binary = item.total_users;
      });

      return Array.from(dateMap.values());
    }

    // Для одной платформы показываем детальную информацию
    return filteredData.map(item => ({
      date: new Date(item.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
      'Всего пользователей': item.total_users,
      'Новые регистрации': item.new_registrations,
      'Активные': item.active_users,
      'Конверсии в Super App': item.super_app_conversions
    }));
  };

  const platformStats = getPlatformStats();
  const chartData = getChartData();

  if (loading) {
    return (
      <Card className="glass-premium neuro-card border border-white/10 rounded-3xl p-8 mb-8">
        <div className="text-center text-white/60">Загрузка аналитики...</div>
      </Card>
    );
  }

  return (
    <Card className="glass-premium neuro-card border border-white/10 rounded-3xl p-8 mb-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-neon-gradient bg-clip-text text-transparent mb-2">
          Аналитика трафика
        </h2>
        <p className="text-white/60">Эффективность каналов привлечения пользователей</p>
      </div>

      {/* Статистика по платформам */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {platformStats.map((platform) => (
          <Card 
            key={platform.name}
            className={`glass-premium border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 cursor-pointer ${selectedPlatform === platform.name ? 'ring-2 ring-white/30' : ''}`}
            onClick={() => setSelectedPlatform(platform.name as any)}
          >
            <div className={`text-xl font-bold bg-gradient-to-r ${platformConfig[platform.name as keyof typeof platformConfig].gradient} bg-clip-text text-transparent mb-4`}>
              {platform.displayName}
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/60">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Всего</span>
                </div>
                <span className="text-white font-semibold">{platform.totalUsers.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/60">
                  <UserPlus className="w-4 h-4" />
                  <span className="text-sm">Новых</span>
                </div>
                <span className="text-white font-semibold">+{platform.newUsers.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/60">
                  <Activity className="w-4 h-4" />
                  <span className="text-sm">Активных</span>
                </div>
                <span className="text-white font-semibold">{platform.activeUsers.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/60">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">Конверсия</span>
                </div>
                <span className="text-emerald-400 font-semibold">{platform.conversionRate}%</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Табы для переключения между видами */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="glass-premium border border-white/10 p-1 mb-6">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white/10">
            Обзор
          </TabsTrigger>
          <TabsTrigger value="growth" className="data-[state=active]:bg-white/10">
            Рост
          </TabsTrigger>
          <TabsTrigger value="conversions" className="data-[state=active]:bg-white/10">
            Конверсии
          </TabsTrigger>
        </TabsList>

        {/* Кнопки фильтрации платформ */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setSelectedPlatform('all')}
            className={`px-4 py-2 rounded-xl transition-all ${
              selectedPlatform === 'all' 
                ? 'bg-white/20 text-white' 
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Все платформы
          </button>
          {Object.entries(platformConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setSelectedPlatform(key as any)}
              className={`px-4 py-2 rounded-xl transition-all ${
                selectedPlatform === key 
                  ? 'bg-white/20 text-white' 
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {config.displayName}
            </button>
          ))}
        </div>

        <TabsContent value="overview" className="space-y-6">
          <Card className="glass-premium border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Динамика пользователей</h3>
            <ResponsiveContainer width="100%" height={400}>
              {selectedPlatform === 'all' ? (
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorFactory" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorGame" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBinary" x1="0" y1="0" x2="0" y2="1">
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
                  <Area type="monotone" dataKey="Factory" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorFactory)" />
                  <Area type="monotone" dataKey="Game" stroke="#EC4899" fillOpacity={1} fill="url(#colorGame)" />
                  <Area type="monotone" dataKey="Binary" stroke="#06B6D4" fillOpacity={1} fill="url(#colorBinary)" />
                </AreaChart>
              ) : (
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
                  <Line type="monotone" dataKey="Всего пользователей" stroke={platformConfig[selectedPlatform as keyof typeof platformConfig]?.color || '#8B5CF6'} strokeWidth={2} />
                  <Line type="monotone" dataKey="Активные" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="growth" className="space-y-6">
          <Card className="glass-premium border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Новые регистрации</h3>
            <ResponsiveContainer width="100%" height={400}>
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
                {selectedPlatform === 'all' ? (
                  <>
                    <Bar dataKey="Factory" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="Game" fill="#EC4899" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="Binary" fill="#06B6D4" radius={[8, 8, 0, 0]} />
                  </>
                ) : (
                  <Bar dataKey="Новые регистрации" fill={platformConfig[selectedPlatform as keyof typeof platformConfig]?.color || '#8B5CF6'} radius={[8, 8, 0, 0]} />
                )}
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="conversions" className="space-y-6">
          <Card className="glass-premium border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Конверсии в VINNI Super App</h3>
            <ResponsiveContainer width="100%" height={400}>
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
                <Bar dataKey="Конверсии в Super App" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Общая статистика конверсий */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {platformStats.map((platform) => (
              <Card key={platform.name} className="glass-premium border border-white/10 rounded-2xl p-6">
                <div className={`text-sm font-semibold bg-gradient-to-r ${platformConfig[platform.name as keyof typeof platformConfig].gradient} bg-clip-text text-transparent mb-2`}>
                  {platform.displayName}
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {platform.conversions}
                </div>
                <div className="text-white/60 text-sm">
                  Всего конверсий
                </div>
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="text-emerald-400 text-xl font-bold">
                    {platform.conversionRate}%
                  </div>
                  <div className="text-white/60 text-xs">
                    Коэффициент конверсии
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw } from 'lucide-react';

export const SyncMetricsButton = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const syncMetrics = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-app-metrics');
      
      if (error) throw error;

      toast({
        title: "Метрики синхронизированы",
        description: "Данные успешно обновлены из VINNI Factory API",
      });

      // Перезагружаем страницу для отображения новых данных
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Error syncing metrics:', error);
      toast({
        title: "Ошибка синхронизации",
        description: error.message || "Не удалось загрузить метрики",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={syncMetrics}
      disabled={loading}
      className="glass-premium border border-white/20 text-white hover:bg-white/10"
    >
      <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
      {loading ? 'Синхронизация...' : 'Синхронизировать метрики'}
    </Button>
  );
};

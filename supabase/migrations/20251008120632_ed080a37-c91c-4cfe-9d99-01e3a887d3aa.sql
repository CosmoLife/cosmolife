-- Создаем таблицу для метрик VINNI SUPER APP
CREATE TABLE IF NOT EXISTS public.app_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  
  -- Пользовательские метрики
  dau INTEGER NOT NULL DEFAULT 0, -- Daily Active Users
  mau INTEGER NOT NULL DEFAULT 0, -- Monthly Active Users
  new_downloads INTEGER NOT NULL DEFAULT 0,
  total_downloads INTEGER NOT NULL DEFAULT 0,
  
  -- Метрики вовлеченности
  avg_session_duration NUMERIC NOT NULL DEFAULT 0, -- в минутах
  sessions_per_user NUMERIC NOT NULL DEFAULT 0,
  retention_day1 NUMERIC NOT NULL DEFAULT 0, -- % retention день 1
  retention_day7 NUMERIC NOT NULL DEFAULT 0, -- % retention день 7
  retention_day30 NUMERIC NOT NULL DEFAULT 0, -- % retention день 30
  churn_rate NUMERIC NOT NULL DEFAULT 0, -- % отток
  
  -- Финансовые метрики
  revenue NUMERIC NOT NULL DEFAULT 0, -- дневной доход
  arpu NUMERIC NOT NULL DEFAULT 0, -- Average Revenue Per User
  arppu NUMERIC NOT NULL DEFAULT 0, -- Average Revenue Per Paying User
  paying_users INTEGER NOT NULL DEFAULT 0,
  conversion_rate NUMERIC NOT NULL DEFAULT 0, -- % конверсии в платящих
  
  -- Метаданные
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  
  UNIQUE(date)
);

-- Индекс для быстрого поиска по дате
CREATE INDEX IF NOT EXISTS idx_app_metrics_date ON public.app_metrics(date DESC);

-- Включаем RLS
ALTER TABLE public.app_metrics ENABLE ROW LEVEL SECURITY;

-- Политики доступа
CREATE POLICY "Admins can manage app metrics"
  ON public.app_metrics
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Investors can view app metrics"
  ON public.app_metrics
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM investments
      WHERE investments.user_id = auth.uid()
      AND (investments.status = 'paid' OR investments.status = 'active')
    )
  );

-- Триггер для обновления updated_at
CREATE TRIGGER update_app_metrics_updated_at
  BEFORE UPDATE ON public.app_metrics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Добавляем роли пользователей
CREATE TYPE public.user_role AS ENUM ('user', 'admin');

-- Добавляем роль в профили
ALTER TABLE public.profiles ADD COLUMN role public.user_role DEFAULT 'user';

-- Обновляем роли для администраторов
UPDATE public.profiles SET role = 'admin' 
WHERE id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('yunalexandr27@gmail.com', 'alexandrcosmo@gmail.com')
);

-- Добавляем поле кошелька USDT в профили
ALTER TABLE public.profiles ADD COLUMN usdt_wallet TEXT;

-- Создаем таблицу для хранения инвестиций в базе данных
CREATE TABLE public.investments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  percentage DECIMAL(10,6) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'paid', 'active', 'rejected')),
  payment_method TEXT,
  transaction_hash TEXT,
  admin_notes TEXT,
  received_income DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS для инвестиций
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own investments" 
  ON public.investments 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own investments" 
  ON public.investments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all investments" 
  ON public.investments 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Создаем таблицу для заявок на продажу долей
CREATE TABLE public.share_sale_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  share_percentage DECIMAL(10,6) NOT NULL,
  usdt_wallet TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS для заявок на продажу
ALTER TABLE public.share_sale_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sale requests" 
  ON public.share_sale_requests 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sale requests" 
  ON public.share_sale_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all sale requests" 
  ON public.share_sale_requests 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Создаем таблицу для настроек (например, текст оферты)
CREATE TABLE public.settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users
);

-- RLS для настроек
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view settings" 
  ON public.settings 
  FOR SELECT 
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can update settings" 
  ON public.settings 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Добавляем начальное значение для оферты
INSERT INTO public.settings (key, value) VALUES ('offer_text', 'Текст публичной оферты...');

-- Обновляем payment_confirmations для поддержки хэшей транзакций
ALTER TABLE public.payment_confirmations ADD COLUMN transaction_hash TEXT;
ALTER TABLE public.payment_confirmations ADD COLUMN status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));
ALTER TABLE public.payment_confirmations ADD COLUMN admin_notes TEXT;

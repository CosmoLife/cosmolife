
-- Создаем таблицу профилей пользователей
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  birth_date DATE,
  avatar_url TEXT,
  telegram_username TEXT,
  whatsapp_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS для таблицы профилей
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Политики доступа для профилей
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Создаем функцию для автоматического создания профиля при регистрации
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

-- Триггер для автоматического создания профиля
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Создаем таблицу для хранения документов об оплате
CREATE TABLE public.payment_confirmations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  investment_id TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS для документов
ALTER TABLE public.payment_confirmations ENABLE ROW LEVEL SECURITY;

-- Политики доступа для документов
CREATE POLICY "Users can view their own payment confirmations" 
  ON public.payment_confirmations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment confirmations" 
  ON public.payment_confirmations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Создаем bucket для хранения файлов
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-confirmations', 'payment-confirmations', false);

-- Политики для storage bucket
CREATE POLICY "Users can upload their payment confirmations" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'payment-confirmations' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their payment confirmations" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'payment-confirmations' AND auth.uid()::text = (storage.foldername(name))[1]);

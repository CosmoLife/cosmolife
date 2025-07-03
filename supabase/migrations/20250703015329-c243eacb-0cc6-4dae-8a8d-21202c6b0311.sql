-- Создание таблицы для скриншотов мобильного приложения
CREATE TABLE public.app_screenshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  image_name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Включение RLS
ALTER TABLE public.app_screenshots ENABLE ROW LEVEL SECURITY;

-- Политики доступа
CREATE POLICY "Everyone can view active screenshots" 
ON public.app_screenshots 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage screenshots" 
ON public.app_screenshots 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'::user_role
));

-- Создание бакета для скриншотов если не существует
INSERT INTO storage.buckets (id, name, public) 
VALUES ('app-screenshots', 'app-screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- Политики для storage
CREATE POLICY "Public can view app screenshots"
ON storage.objects FOR SELECT
USING (bucket_id = 'app-screenshots');

CREATE POLICY "Admins can upload app screenshots"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'app-screenshots' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::user_role
  )
);

CREATE POLICY "Admins can update app screenshots"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'app-screenshots' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::user_role
  )
);

CREATE POLICY "Admins can delete app screenshots"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'app-screenshots' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::user_role
  )
);

-- Триггер для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_app_screenshots_updated_at
  BEFORE UPDATE ON public.app_screenshots
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
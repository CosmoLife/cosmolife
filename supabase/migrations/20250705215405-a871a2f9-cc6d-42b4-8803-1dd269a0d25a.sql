-- Создаем таблицу для хранения видео обновлений
CREATE TABLE public.investor_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  video_name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Включаем RLS
ALTER TABLE public.investor_videos ENABLE ROW LEVEL SECURITY;

-- Политики доступа
-- Админы могут управлять всеми видео
CREATE POLICY "Admins can manage all investor videos" 
ON public.investor_videos 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'::user_role
));

-- Инвесторы (пользователи с оплаченными инвестициями) могут просматривать активные видео
CREATE POLICY "Investors can view active videos" 
ON public.investor_videos 
FOR SELECT 
TO authenticated
USING (
  is_active = true 
  AND EXISTS (
    SELECT 1 FROM investments 
    WHERE investments.user_id = auth.uid() 
    AND (investments.status = 'paid' OR investments.status = 'active')
  )
);

-- Триггер для обновления updated_at
CREATE TRIGGER update_investor_videos_updated_at
BEFORE UPDATE ON public.investor_videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
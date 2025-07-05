-- Создаем bucket для видео обновлений
INSERT INTO storage.buckets (id, name, public) VALUES ('investor-videos', 'investor-videos', true);

-- Политики для bucket видео
CREATE POLICY "Admins can upload investor videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'investor-videos' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::user_role
  )
);

CREATE POLICY "Admins can update investor videos" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'investor-videos' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::user_role
  )
);

CREATE POLICY "Admins can delete investor videos" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'investor-videos' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::user_role
  )
);

-- Инвесторы могут просматривать видео
CREATE POLICY "Investors can view videos" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'investor-videos' 
  AND EXISTS (
    SELECT 1 FROM investments 
    WHERE investments.user_id = auth.uid() 
    AND (investments.status = 'paid' OR investments.status = 'active')
  )
);
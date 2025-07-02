-- Создаем профили для существующих пользователей, которые еще не имеют профилей
INSERT INTO public.profiles (id, full_name, email, created_at, updated_at)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data ->> 'full_name', ''),
  u.email,
  u.created_at,
  NOW()
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;
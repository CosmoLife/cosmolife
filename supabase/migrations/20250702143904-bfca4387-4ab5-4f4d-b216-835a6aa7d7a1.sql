-- Add email field to profiles table
ALTER TABLE public.profiles ADD COLUMN email TEXT;

-- Update the trigger function to also save email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name', new.email);
  RETURN new;
END;
$$;

-- Update existing profiles with email from auth.users
UPDATE public.profiles 
SET email = auth.users.email 
FROM auth.users 
WHERE profiles.id = auth.users.id AND profiles.email IS NULL;

-- Make the payment-confirmations bucket public for easier image viewing
UPDATE storage.buckets SET public = true WHERE id = 'payment-confirmations';
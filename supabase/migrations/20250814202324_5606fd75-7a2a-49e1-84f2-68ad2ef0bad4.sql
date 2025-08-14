-- Create table for admin email addresses
CREATE TABLE IF NOT EXISTS public.admin_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;

-- Only admins can manage admin emails
CREATE POLICY "Only admins can manage admin emails" 
ON public.admin_emails 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- Function to notify admins about new investments
CREATE OR REPLACE FUNCTION notify_admins_new_investment()
RETURNS TRIGGER AS $$
BEGIN
  -- Call edge function to send email notifications
  PERFORM net.http_post(
    url := 'https://kesiglejxnnnxfovfetm.supabase.co/functions/v1/notify-admins',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := json_build_object(
      'type', 'investment',
      'data', json_build_object(
        'id', NEW.id,
        'user_id', NEW.user_id,
        'amount', NEW.amount,
        'percentage', NEW.percentage,
        'payment_method', NEW.payment_method,
        'created_at', NEW.created_at
      )
    )::jsonb
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to notify admins about new share sale requests
CREATE OR REPLACE FUNCTION notify_admins_new_share_sale()
RETURNS TRIGGER AS $$
BEGIN
  -- Call edge function to send email notifications
  PERFORM net.http_post(
    url := 'https://kesiglejxnnnxfovfetm.supabase.co/functions/v1/notify-admins',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := json_build_object(
      'type', 'share_sale',
      'data', json_build_object(
        'id', NEW.id,
        'user_id', NEW.user_id,
        'share_percentage', NEW.share_percentage,
        'usdt_wallet', NEW.usdt_wallet,
        'created_at', NEW.created_at
      )
    )::jsonb
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_notify_admins_new_investment
  AFTER INSERT ON public.investments
  FOR EACH ROW
  EXECUTE FUNCTION notify_admins_new_investment();

CREATE TRIGGER trigger_notify_admins_new_share_sale
  AFTER INSERT ON public.share_sale_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_admins_new_share_sale();

-- Insert default admin email (you can change this later)
INSERT INTO public.admin_emails (email, created_by) 
VALUES ('admin@example.com', NULL)
ON CONFLICT (email) DO NOTHING;
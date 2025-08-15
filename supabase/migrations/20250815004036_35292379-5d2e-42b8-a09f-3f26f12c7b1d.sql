-- Сначала удалим все триггеры
DROP TRIGGER IF EXISTS trigger_notify_admins_new_investment ON public.investments;
DROP TRIGGER IF EXISTS notify_admins_on_investment_insert ON public.investments;
DROP TRIGGER IF EXISTS trigger_notify_admins_new_share_sale ON public.share_sale_requests;
DROP TRIGGER IF EXISTS notify_admins_on_share_sale_insert ON public.share_sale_requests;

-- Теперь удалим функции с CASCADE
DROP FUNCTION IF EXISTS public.notify_admins_new_investment() CASCADE;
DROP FUNCTION IF EXISTS public.notify_admins_new_share_sale() CASCADE;

-- Создадим новые упрощенные функции без внешних HTTP вызовов
CREATE OR REPLACE FUNCTION public.handle_new_investment()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Просто логируем в системный лог для админов
  RAISE LOG 'New investment created: ID=%, User=%, Amount=%, Method=%', 
    NEW.id, NEW.user_id, NEW.amount, NEW.payment_method;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_share_sale()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Просто логируем в системный лог для админов
  RAISE LOG 'New share sale request: ID=%, User=%, Percentage=%, Wallet=%', 
    NEW.id, NEW.user_id, NEW.share_percentage, NEW.usdt_wallet;
  RETURN NEW;
END;
$$;

-- Создадим новые триггеры с исправленными функциями
CREATE TRIGGER handle_new_investment_trigger
  AFTER INSERT ON public.investments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_investment();

CREATE TRIGGER handle_new_share_sale_trigger
  AFTER INSERT ON public.share_sale_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_share_sale();
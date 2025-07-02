
-- Создаем таблицу для отслеживания транзакций начисления дохода
CREATE TABLE public.income_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  amount NUMERIC NOT NULL,
  transaction_hash TEXT,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users
);

-- Включаем RLS для таблицы транзакций дохода
ALTER TABLE public.income_transactions ENABLE ROW LEVEL SECURITY;

-- Политики доступа для транзакций дохода
CREATE POLICY "Users can view their own income transactions" 
  ON public.income_transactions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all income transactions" 
  ON public.income_transactions 
  FOR ALL 
  USING (EXISTS ( 
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'::user_role
  ));

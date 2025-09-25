-- Обновляем статус инвестиций Мукосей Надежда Вячеславовна с "active" на "pending"
UPDATE investments 
SET status = 'pending', 
    received_income = 0,
    updated_at = now()
WHERE user_id = '508d237d-9920-4ec1-bd37-e6009e58b743' 
  AND status = 'active';
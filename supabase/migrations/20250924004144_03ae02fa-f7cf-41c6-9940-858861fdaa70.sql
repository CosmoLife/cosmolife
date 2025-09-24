-- Исправляем процентную долю для старых инвесторов
-- Если минимальная доля теперь стоит 100,000 вместо 50,000, 
-- то старые инвестиции за 50,000 должны давать 2% вместо 1%

-- Обновляем все инвестиции за 50,000 рублей на 2% (в 2 раза больше)
UPDATE investments 
SET percentage = 2.0, updated_at = now()
WHERE amount = 50000 AND percentage = 1.0;

-- Обновляем все инвестиции за 100,000 рублей на 4% (если они были 2%)
UPDATE investments 
SET percentage = 4.0, updated_at = now()
WHERE amount = 100000 AND percentage = 2.0;

-- Обновляем все инвестиции за 150,000 рублей на 6% (если они были 3%)
UPDATE investments 
SET percentage = 6.0, updated_at = now()
WHERE amount = 150000 AND percentage = 3.0;

-- Обновляем все инвестиции за 500,000 рублей на 20% (если они были 10%)
UPDATE investments 
SET percentage = 20.0, updated_at = now()
WHERE amount = 500000 AND percentage = 10.0;

-- Обновляем все инвестиции за 900,000 рублей на 36% (если они были 18%)
UPDATE investments 
SET percentage = 36.0, updated_at = now()
WHERE amount = 900000 AND percentage = 18.0;

-- Обновляем крупную инвестицию за 5,000,000 рублей на 200% (если была 100%)
UPDATE investments 
SET percentage = 200.0, updated_at = now()
WHERE amount = 5000000 AND percentage = 100.0;
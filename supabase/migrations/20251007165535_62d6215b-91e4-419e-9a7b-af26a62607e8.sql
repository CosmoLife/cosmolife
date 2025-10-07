-- Создаем таблицу для аналитики трафика с платформ
CREATE TABLE IF NOT EXISTS public.traffic_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('vinni_factory', 'vinni_game', 'vinni_binary')),
  date DATE NOT NULL,
  total_users INTEGER NOT NULL DEFAULT 0,
  new_registrations INTEGER NOT NULL DEFAULT 0,
  active_users INTEGER NOT NULL DEFAULT 0,
  super_app_conversions INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  UNIQUE(platform, date)
);

-- Включаем RLS
ALTER TABLE public.traffic_analytics ENABLE ROW LEVEL SECURITY;

-- Политика для просмотра инвесторами
CREATE POLICY "Investors can view traffic analytics"
ON public.traffic_analytics
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM investments 
    WHERE investments.user_id = auth.uid() 
    AND (investments.status = 'paid' OR investments.status = 'active')
  )
);

-- Политика для админов (управление данными)
CREATE POLICY "Admins can manage traffic analytics"
ON public.traffic_analytics
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Триггер для обновления updated_at
CREATE TRIGGER update_traffic_analytics_updated_at
BEFORE UPDATE ON public.traffic_analytics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Вставляем тестовые данные для визуализации
INSERT INTO public.traffic_analytics (platform, date, total_users, new_registrations, active_users, super_app_conversions) VALUES
-- VINNI Factory данные за последние 30 дней
('vinni_factory', CURRENT_DATE - INTERVAL '29 days', 15420, 145, 8234, 23),
('vinni_factory', CURRENT_DATE - INTERVAL '28 days', 15565, 152, 8456, 28),
('vinni_factory', CURRENT_DATE - INTERVAL '27 days', 15717, 148, 8512, 25),
('vinni_factory', CURRENT_DATE - INTERVAL '26 days', 15865, 156, 8678, 31),
('vinni_factory', CURRENT_DATE - INTERVAL '25 days', 16021, 163, 8845, 34),
('vinni_factory', CURRENT_DATE - INTERVAL '24 days', 16184, 158, 8923, 29),
('vinni_factory', CURRENT_DATE - INTERVAL '23 days', 16342, 167, 9112, 36),
('vinni_factory', CURRENT_DATE - INTERVAL '22 days', 16509, 171, 9289, 38),
('vinni_factory', CURRENT_DATE - INTERVAL '21 days', 16680, 169, 9434, 35),
('vinni_factory', CURRENT_DATE - INTERVAL '20 days', 16849, 174, 9567, 40),
('vinni_factory', CURRENT_DATE - INTERVAL '19 days', 17023, 178, 9723, 42),
('vinni_factory', CURRENT_DATE - INTERVAL '18 days', 17201, 182, 9856, 44),
('vinni_factory', CURRENT_DATE - INTERVAL '17 days', 17383, 186, 9989, 46),
('vinni_factory', CURRENT_DATE - INTERVAL '16 days', 17569, 191, 10134, 48),
('vinni_factory', CURRENT_DATE - INTERVAL '15 days', 17760, 195, 10278, 51),
('vinni_factory', CURRENT_DATE - INTERVAL '14 days', 17955, 199, 10423, 53),
('vinni_factory', CURRENT_DATE - INTERVAL '13 days', 18154, 203, 10567, 55),
('vinni_factory', CURRENT_DATE - INTERVAL '12 days', 18357, 208, 10712, 58),
('vinni_factory', CURRENT_DATE - INTERVAL '11 days', 18565, 212, 10856, 60),
('vinni_factory', CURRENT_DATE - INTERVAL '10 days', 18777, 216, 11001, 62),
('vinni_factory', CURRENT_DATE - INTERVAL '9 days', 18993, 221, 11145, 65),
('vinni_factory', CURRENT_DATE - INTERVAL '8 days', 19214, 225, 11289, 67),
('vinni_factory', CURRENT_DATE - INTERVAL '7 days', 19439, 230, 11434, 70),
('vinni_factory', CURRENT_DATE - INTERVAL '6 days', 19669, 234, 11578, 72),
('vinni_factory', CURRENT_DATE - INTERVAL '5 days', 19903, 239, 11723, 75),
('vinni_factory', CURRENT_DATE - INTERVAL '4 days', 20142, 243, 11867, 77),
('vinni_factory', CURRENT_DATE - INTERVAL '3 days', 20385, 248, 12012, 80),
('vinni_factory', CURRENT_DATE - INTERVAL '2 days', 20633, 252, 12156, 82),
('vinni_factory', CURRENT_DATE - INTERVAL '1 day', 20885, 257, 12301, 85),
('vinni_factory', CURRENT_DATE, 21142, 261, 12445, 87),

-- VINNI Game данные
('vinni_game', CURRENT_DATE - INTERVAL '29 days', 28540, 234, 15623, 45),
('vinni_game', CURRENT_DATE - INTERVAL '28 days', 28774, 245, 15834, 52),
('vinni_game', CURRENT_DATE - INTERVAL '27 days', 29019, 251, 16012, 48),
('vinni_game', CURRENT_DATE - INTERVAL '26 days', 29270, 258, 16234, 56),
('vinni_game', CURRENT_DATE - INTERVAL '25 days', 29528, 264, 16445, 61),
('vinni_game', CURRENT_DATE - INTERVAL '24 days', 29792, 269, 16623, 58),
('vinni_game', CURRENT_DATE - INTERVAL '23 days', 30061, 276, 16845, 64),
('vinni_game', CURRENT_DATE - INTERVAL '22 days', 30337, 283, 17056, 68),
('vinni_game', CURRENT_DATE - INTERVAL '21 days', 30620, 289, 17234, 65),
('vinni_game', CURRENT_DATE - INTERVAL '20 days', 30909, 295, 17456, 72),
('vinni_game', CURRENT_DATE - INTERVAL '19 days', 31204, 302, 17667, 76),
('vinni_game', CURRENT_DATE - INTERVAL '18 days', 31506, 308, 17845, 79),
('vinni_game', CURRENT_DATE - INTERVAL '17 days', 31814, 315, 18067, 83),
('vinni_game', CURRENT_DATE - INTERVAL '16 days', 32129, 321, 18278, 87),
('vinni_game', CURRENT_DATE - INTERVAL '15 days', 32450, 328, 18456, 91),
('vinni_game', CURRENT_DATE - INTERVAL '14 days', 32778, 334, 18678, 95),
('vinni_game', CURRENT_DATE - INTERVAL '13 days', 33112, 341, 18889, 99),
('vinni_game', CURRENT_DATE - INTERVAL '12 days', 33453, 347, 19067, 103),
('vinni_game', CURRENT_DATE - INTERVAL '11 days', 33800, 354, 19289, 107),
('vinni_game', CURRENT_DATE - INTERVAL '10 days', 34154, 360, 19500, 111),
('vinni_game', CURRENT_DATE - INTERVAL '9 days', 34514, 367, 19678, 115),
('vinni_game', CURRENT_DATE - INTERVAL '8 days', 34881, 373, 19900, 119),
('vinni_game', CURRENT_DATE - INTERVAL '7 days', 35254, 380, 20111, 123),
('vinni_game', CURRENT_DATE - INTERVAL '6 days', 35634, 386, 20289, 127),
('vinni_game', CURRENT_DATE - INTERVAL '5 days', 36020, 393, 20511, 131),
('vinni_game', CURRENT_DATE - INTERVAL '4 days', 36413, 399, 20722, 135),
('vinni_game', CURRENT_DATE - INTERVAL '3 days', 36812, 406, 20900, 139),
('vinni_game', CURRENT_DATE - INTERVAL '2 days', 37218, 412, 21122, 143),
('vinni_game', CURRENT_DATE - INTERVAL '1 day', 37630, 419, 21333, 147),
('vinni_game', CURRENT_DATE, 38049, 425, 21511, 151),

-- VINNI Binary данные
('vinni_binary', CURRENT_DATE - INTERVAL '29 days', 12340, 98, 6234, 18),
('vinni_binary', CURRENT_DATE - INTERVAL '28 days', 12438, 105, 6345, 22),
('vinni_binary', CURRENT_DATE - INTERVAL '27 days', 12543, 102, 6423, 20),
('vinni_binary', CURRENT_DATE - INTERVAL '26 days', 12645, 108, 6534, 24),
('vinni_binary', CURRENT_DATE - INTERVAL '25 days', 12753, 112, 6645, 27),
('vinni_binary', CURRENT_DATE - INTERVAL '24 days', 12865, 109, 6723, 25),
('vinni_binary', CURRENT_DATE - INTERVAL '23 days', 12974, 115, 6834, 29),
('vinni_binary', CURRENT_DATE - INTERVAL '22 days', 13089, 119, 6945, 31),
('vinni_binary', CURRENT_DATE - INTERVAL '21 days', 13208, 116, 7023, 29),
('vinni_binary', CURRENT_DATE - INTERVAL '20 days', 13324, 122, 7134, 33),
('vinni_binary', CURRENT_DATE - INTERVAL '19 days', 13446, 126, 7245, 35),
('vinni_binary', CURRENT_DATE - INTERVAL '18 days', 13572, 129, 7323, 37),
('vinni_binary', CURRENT_DATE - INTERVAL '17 days', 13701, 133, 7434, 39),
('vinni_binary', CURRENT_DATE - INTERVAL '16 days', 13834, 136, 7545, 41),
('vinni_binary', CURRENT_DATE - INTERVAL '15 days', 13970, 140, 7623, 43),
('vinni_binary', CURRENT_DATE - INTERVAL '14 days', 14110, 143, 7734, 45),
('vinni_binary', CURRENT_DATE - INTERVAL '13 days', 14253, 147, 7845, 47),
('vinni_binary', CURRENT_DATE - INTERVAL '12 days', 14400, 150, 7923, 49),
('vinni_binary', CURRENT_DATE - INTERVAL '11 days', 14550, 154, 8034, 51),
('vinni_binary', CURRENT_DATE - INTERVAL '10 days', 14704, 157, 8145, 53),
('vinni_binary', CURRENT_DATE - INTERVAL '9 days', 14861, 161, 8223, 55),
('vinni_binary', CURRENT_DATE - INTERVAL '8 days', 15022, 164, 8334, 57),
('vinni_binary', CURRENT_DATE - INTERVAL '7 days', 15186, 168, 8445, 59),
('vinni_binary', CURRENT_DATE - INTERVAL '6 days', 15354, 171, 8523, 61),
('vinni_binary', CURRENT_DATE - INTERVAL '5 days', 15525, 175, 8634, 63),
('vinni_binary', CURRENT_DATE - INTERVAL '4 days', 15700, 178, 8745, 65),
('vinni_binary', CURRENT_DATE - INTERVAL '3 days', 15878, 182, 8823, 67),
('vinni_binary', CURRENT_DATE - INTERVAL '2 days', 16060, 185, 8934, 69),
('vinni_binary', CURRENT_DATE - INTERVAL '1 day', 16245, 189, 9045, 71),
('vinni_binary', CURRENT_DATE, 16434, 192, 9123, 73);
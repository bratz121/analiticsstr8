-- Включаем RLS для таблицы players
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Создаем единую политику, разрешающую все операции
CREATE POLICY "Enable full access to everyone"
ON players
FOR ALL
TO PUBLIC
USING (true)
WITH CHECK (true); 
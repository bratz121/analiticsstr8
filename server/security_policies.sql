-- Включаем RLS для таблицы players
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Создаем политику, разрешающую всем пользователям читать данные
CREATE POLICY "Allow public read access"
ON players FOR SELECT
TO anon
USING (true);

-- Создаем политику, разрешающую всем пользователям вставлять данные
CREATE POLICY "Allow public insert access"
ON players FOR INSERT
TO anon
WITH CHECK (true);

-- Создаем политику, разрешающую всем пользователям обновлять данные
CREATE POLICY "Allow public update access"
ON players FOR UPDATE
TO anon
USING (true);

-- Создаем политику, разрешающую всем пользователям удалять данные
CREATE POLICY "Allow public delete access"
ON players FOR DELETE
TO anon
USING (true); 
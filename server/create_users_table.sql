-- Удаляем существующие таблицы, если они есть
drop table if exists public.users cascade;
drop type if exists public.user_role cascade;

-- Создаем перечисление для ролей
create type public.user_role as enum ('admin', 'player');

-- Создаем таблицу пользователей
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role public.user_role NOT NULL DEFAULT 'player',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Включаем RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Создаем политику для чтения (все могут читать)
CREATE POLICY "Enable read access for all users"
    ON public.users
    FOR SELECT
    USING (true);

-- Создаем политику для создания (разрешаем всем для регистрации)
CREATE POLICY "Enable insert access for registration"
    ON public.users
    FOR INSERT
    WITH CHECK (true);

-- Создаем политику для обновления (только владелец или админ)
CREATE POLICY "Enable update for owner or admin"
    ON public.users
    FOR UPDATE
    USING (
        auth.uid() = id 
        OR EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Создаем политику для удаления (только админ)
CREATE POLICY "Enable delete for admin"
    ON public.users
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Создаем первого администратора (пароль: admin)
insert into public.users (id, username, password_hash, role)
values ('00000000-0000-0000-0000-000000000000', 'admin', '$2a$10$vQcjA2ldvcYXBhX8Hwp4oOXYwLKjAkOxwVJHU9QZYGYPiXxFmqIJm', 'admin'); 
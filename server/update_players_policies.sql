-- Включаем RLS для таблицы players
alter table public.players enable row level security;

-- Создаем политику для чтения (все авторизованные пользователи могут читать)
create policy "Enable read access for all users"
  on public.players
  for select
  using (true);

-- Создаем политику для создания (только админы могут создавать)
create policy "Enable insert access for admins only"
  on public.players
  for insert
  with check (
    exists (
      select 1
      from public.users
      where users.role = 'admin'::public.user_role
    )
  );

-- Создаем политику для обновления (только админы могут обновлять)
create policy "Enable update access for admins only"
  on public.players
  for update
  using (
    exists (
      select 1
      from public.users
      where users.role = 'admin'::public.user_role
    )
  );

-- Создаем политику для удаления (только админы могут удалять)
create policy "Enable delete access for admins only"
  on public.players
  for delete
  using (
    exists (
      select 1
      from public.users
      where users.role = 'admin'::public.user_role
    )
  ); 
-- profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  pbkdf2_salt text not null,
  created_at timestamptz default now()
);

-- vault_entries
create table if not exists public.vault_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  username text,
  ciphertext text not null,
  iv text not null,
  tags text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS & policy
alter table public.vault_entries enable row level security;
create policy "users_can_select_own_entries" on public.vault_entries for select using (auth.uid() = user_id);
create policy "users_can_insert_own_entries" on public.vault_entries for insert with check (auth.uid() = user_id);
create policy "users_can_update_own_entries" on public.vault_entries for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users_can_delete_own_entries" on public.vault_entries for delete using (auth.uid() = user_id);

alter table public.profiles enable row level security;
create policy "profiles_is_owner" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert" on public.profiles for insert with check (auth.uid() = id);

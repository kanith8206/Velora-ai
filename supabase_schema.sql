-- Create users table
create table public.users (
  id uuid references auth.users not null primary key,
  email text,
  display_name text,
  photo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create wishlists table
create table public.wishlists (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  product_data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create conversations table
create table public.conversations (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  title text not null,
  messages jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create history table
create table public.history (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  query text not null,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
-- For simplicity in development, we'll allow all operations, but you should restrict this in production!
alter table public.users enable row level security;
alter table public.wishlists enable row level security;
alter table public.conversations enable row level security;
alter table public.history enable row level security;

create policy "Users can view and edit their own data" on public.users for all using (auth.uid() = id);
create policy "Allow all wishlists operations" on public.wishlists for all using (true);
create policy "Allow all conversations operations" on public.conversations for all using (true);
create policy "Allow all history operations" on public.history for all using (true);

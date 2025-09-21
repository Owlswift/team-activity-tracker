create table profiles (
  id uuid primary key,
  email text not null unique,
  role text not null
);

create table notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  content text not null,
  created_at timestamptz default now()
);

create table profiles (
  id uuid primary key,
  email text not null unique,
  role text not null
);

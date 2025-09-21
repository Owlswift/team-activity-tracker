create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can select their own profile"
  on profiles for select
  using (auth.uid() = id);

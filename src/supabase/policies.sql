create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can select their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own notes"
  on notes
  for insert
  with check (auth.uid() = user_id);

create policy "Users can select notes"
  on notes
  for select
  using (
    auth.uid() = user_id
    OR
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Users can delete their own notes"
  on notes
  for delete
  using (auth.uid() = user_id);

alter publication supabase_realtime add table notes;

create policy "Admins can see all notes in realtime"
  on notes
  for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );
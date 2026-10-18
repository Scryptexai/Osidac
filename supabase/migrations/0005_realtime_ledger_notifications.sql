-- Publish only the append-only ledger to Supabase Realtime.
-- Existing ledger_select_own RLS policy restricts each authenticated client to its own rows.
do $$
begin
  if not exists (
    select 1 from pg_publication where pubname = 'supabase_realtime'
  ) then
    raise exception 'supabase_realtime publication is not available';
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'ledger_entries'
  ) then
    execute 'alter publication supabase_realtime add table public.ledger_entries';
  end if;
end;
$$;

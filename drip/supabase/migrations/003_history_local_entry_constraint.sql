drop index if exists public.user_drip_history_local_entry_unique;

alter table public.user_drip_history
  add constraint user_drip_history_user_local_entry_unique
  unique (user_id, local_entry_id);

-- Align persisted admin feature descriptions with the current KOIN ledger semantics.
-- KOIN claims are internal app points; they are not partner revenue or cash.
update public.feature_flags
set description = 'Internal KOIN-points claim from a virtual store; not partner revenue or cash',
    updated_at = now()
where key = 'store_claims';

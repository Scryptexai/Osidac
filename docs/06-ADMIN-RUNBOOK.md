# OSIDAC Admin v1 runbook

Admin access is granted by an OSIDAC project owner only. There is deliberately no self-service role promotion in the app.

## Grant the first owner

1. Create the intended operator account through the normal signup flow.
2. In the Supabase SQL editor for the `osidac` project, replace the email below with the operator's exact account email and run:

```sql
insert into public.user_roles (user_id, role)
select id, 'owner'
from auth.users
where lower(email) = lower('replace-with-owner-email@example.com')
on conflict (user_id) do update set role = excluded.role;
```

3. The operator signs out and back in, then opens `/en/app/admin` or `/id/app/admin`.
4. To remove elevated access, change the row's role to `member` or delete it from `public.user_roles` using the SQL editor.

Do not add a public RPC, client-side key, or browser flow that writes to `user_roles`.

## What the console does

- Shows member count, today's store claims and internal claim coins, recent accounts, and recent store claims.
- Creates and resolves **review flags**. A flag is a human-review note only; it does not automatically block an account or alter its wallet.
- Provides database-enforced switches for daily missions, store claims, and store upgrades. Switching one off prevents the corresponding RPC/ledger action even if a client tries to bypass the UI. Keep these enabled unless operations needs a pause.
- Writes flag and feature-switch changes to `public.audit_log`.

Daily mission rewards are internal KOIN points only. They are not cash, are not withdrawable in Phase 1, and do not represent guaranteed income; OSID has not been issued in the app. The invite mission is awarded only after a referred profile is created that UTC day; share itself is not rewarded because it cannot be verified securely in a browser.

# OSIDAC

**Product vision: Virtual Franchise & Rewards** — an app-like, web2 BUY → GET → WD journey: start with a virtual store, earn through funded partner activities, and eventually withdraw through supported payment rails. No blockchain, no crypto, and no guaranteed returns.

> **Status — 18 Oct 2026:** Supabase auth/onboarding, the 8-hour virtual-store claim loop, store upgrades, append-only wallet ledger, referral attribution, daily in-app missions, EN/ID mobile-first UI, installable PWA shell, admin v1, and real-time wallet-ledger notifications are implemented. Midtrans is the sole selected provider for top-up and payout, but no integration or production transaction is active. **Package checkout, paid partner offers/playtime, cash withdrawals, and network commission payouts are not live.** OSID Coins are in-app points with no cash value and cannot be withdrawn.

---

## 🚀 Getting started (development)

```bash
npm install
cp .env.example .env.local   # fill in the public Supabase URL/key
npm run dev                  # http://localhost:3000 → locale route
```

- **i18n:** EN (default) & ID — routes under `/[locale]` (`/en`, `/id`).
- **Supabase:** project `osidac` (ref `qalnpcefixdzhdwbqzvj`); browser uses the publishable/anon key only.
- **Deploy:** Vercel project `osidac` linked to this repo.
- **PWA:** network-only service worker; no account, wallet, or mission data is cached offline.
- **Checks:** `npm run lint`, `npm run test:economy`, and `npm run build`.

## 🧭 Fase 1 scope

- **Live in the MVP:** free signup, referral capture, virtual store claim every 8 hours, level upgrades, KOIN wallet/ledger, daily check-in and verified-referral missions, network attribution, responsive app shell, EN/ID, install prompt, and admin review/feature switches.
- **Not live yet:** package purchase/checkout, advertiser offerwalls, paid playtime, real-money conversion/withdrawal, network commission payout, anti-sybil tooling, and production finance reporting. Tier mission-access rules still need product approval; do not treat tier prices or network percentages as active offers.
- Admin access is assigned manually by a trusted Supabase project owner. See [docs/06-ADMIN-RUNBOOK.md](docs/06-ADMIN-RUNBOOK.md).

## 📁 Structure

```
src/
  app/[locale]/          # landing, login, register, app routes, manifest
  app/[locale]/app/      # member area: store, missions, wallet, network, withdrawal, admin
  components/            # mobile UI, PWA install, store, wallet, mission, admin components
  lib/i18n/              # EN/ID dictionaries and client/server helpers
  lib/supabase/          # browser/server/middleware clients
  proxy.ts               # locale routing + auth session refresh
public/images/           # OSIDAC product and PWA visuals
public/sw.js             # minimal network-only PWA service worker
scripts/                  # local economy and payout-cost simulator; no provider calls
docs/                     # research, decisions, roadmap, payout strategy, admin runbook
supabase/migrations/     # schema, RLS, store engine, daily missions, admin v1
```

## 📚 Master Plan Documents

| Dokumen | Isi |
|---|---|
| [docs/00-DECISION-LOG.md](docs/00-DECISION-LOG.md) | ★ Keputusan terkunci (nama, Supabase, sewa badan, paket, global, EN/ID) |
| [docs/05-RISET-BUNGKUS-WEB2.md](docs/05-RISET-BUNGKUS-WEB2.md) | Riset pivot: ekonomi reward web2 & bungkus “Virtual Waralaba” |
| [docs/03-PLAN-CONCEPT-OSIDAC.md](docs/03-PLAN-CONCEPT-OSIDAC.md) | Konsep produk dan BUY → GET → WD roadmap |
| [docs/02-BRAINSTORM-ARSITEKTUR.md](docs/02-BRAINSTORM-ARSITEKTUR.md) | Arsitektur web2, domain model, commission engine, reward_pool |
| [docs/04-ROADMAP.md](docs/04-ROADMAP.md) | Roadmap Fase 0–4 dan status implementasi |
| [docs/06-ADMIN-RUNBOOK.md](docs/06-ADMIN-RUNBOOK.md) | Penetapan role owner/admin dan operasi konsol |
| [docs/07-PHASE-2-PAYOUT-STRATEGY.md](docs/07-PHASE-2-PAYOUT-STRATEGY.md) | Strategi Midtrans-only untuk top-up/payout, harga publik, guardrail ekonomi, dan gerbang pilot |
| [docs/08-TIER-MISSION-ACCESS-PROPOSAL.md](docs/08-TIER-MISSION-ACCESS-PROPOSAL.md) | Matriks akses misi per tier untuk ditinjau; belum aktif |
| [docs/01-RISET-REFERENSI-INDUSTRI.md](docs/01-RISET-REFERENSI-INDUSTRI.md) | (Historis) riset awal mining/MLM — referensi “yang dihindari” |

## ⚖️ Principles

1. Phase 1 coins are internal-only; no real-money payout promise is made before a verified funding source and payout rails are live.
2. Any future member distribution must be funded by actual revenue and remain within the approved caps.
3. Network commissions are not active; future rates require revenue, compliance, and operational review.
4. OSIDAC is a rewards product, **not an investment**. No fixed returns. No crypto.
5. Compliance work (business entity/PSE, privacy, payment partners, and payout reporting) must be completed before public cashout launch.

# OSIDAC

**Virtual Franchise & Rewards Platform** — own a little business that runs 24/7 from your phone: buy a digital franchise package, earn from store revenue + paid missions + your network, then withdraw to **e-wallet / PayPal / bank**.

**Pure web2: BUY → GET → WD.** No blockchain, no crypto, no fixed returns. Member payouts are funded by **real advertiser budgets (offerwall), game-studio budgets (playtime), ads and package margin** — the model proven by Swagbucks, Freecash and Mistplay.

---

## 🚀 Getting started (development)

```bash
npm install
cp .env.example .env.local   # fill Supabase keys
npm run dev                  # http://localhost:3000 → redirects to /en
```

- **i18n:** EN (default) & ID — routes under `/[locale]` (`/en`, `/id`).
- **Supabase:** project `osidac` (ref `qalnpcefixdzhdwbqzvj`), keys go in `.env.local`.
- **Deploy:** Vercel project `osidac` linked to this repo.

## 📁 Structure

```
src/
  app/[locale]/          # landing, login, register
  app/[locale]/app/      # member area: store, misi, wallet, jaringan, wd
  components/            # UI components (language switcher, …)
  lib/i18n/              # locales config + dictionaries (en.json, id.json)
  lib/supabase/          # browser/server/middleware clients
  middleware.ts          # locale routing + auth session refresh
supabase/migrations/     # SQL schema (draft → RLS policies next)
docs/                    # master plan (riset, arsitektur, konsep, roadmap)
```

## 📚 Master Plan Documents

| Dokumen | Isi |
|---|---|
| [docs/00-DECISION-LOG.md](docs/00-DECISION-LOG.md) | ★ Keputusan terkunci (nama, Supabase, sewa badan, paket, global, EN/ID) |
| [docs/05-RISET-BUNGKUS-WEB2.md](docs/05-RISET-BUNGKUS-WEB2.md) | Riset pivot: ekonomi reward web2 & bungkus "Virtual Waralaba" |
| [docs/03-PLAN-CONCEPT-OSIDAC.md](docs/03-PLAN-CONCEPT-OSIDAC.md) | Konsep produk v2: BUY→GET→WD, paket, skema komisi, KPI |
| [docs/02-BRAINSTORM-ARSITEKTUR.md](docs/02-BRAINSTORM-ARSITEKTUR.md) | Arsitektur web2, domain model, commission engine, reward_pool |
| [docs/04-ROADMAP.md](docs/04-ROADMAP.md) | Roadmap Fase 0–4 |
| [docs/01-RISET-REFERENSI-INDUSTRI.md](docs/01-RISET-REFERENSI-INDUSTRI.md) | (Historis) riset awal mining/MLM — referensi "yang dihindari" |

## ⚖️ Principles

1. Every coin has an auditable funding source — distribution ≤ actual revenue (hard cap 70%).
2. Network commissions come from margin only, hard-capped at 40%, free members can earn.
3. OSIDAC is a rewards platform, **not an investment**. No guaranteed returns. No crypto.
4. Compliance: PT (via entity provider) + PSE Kominfo for ID market, UU PDP, transparent payout formula published monthly.

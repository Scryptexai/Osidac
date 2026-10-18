# 02 — Brainstorm Arsitektur: OSIDAC (v2 — Pure Web2)

> Fase: BRAINSTORM (belum koding) · Revisi besar 17 Okt 2026 — **menyesuaikan pivot: tanpa blockchain/kripto, alur BUY → GET → WD ke e-wallet.**
> Pertanyaan desain: *bagaimana membangun aplikasi reward "virtual waralaba" yang membayar user dari pendapatan iklan/UA/margin yang nyata, aman, dan murah di Supabase + Vercel?*

---

## 1. Prinsip Arsitektur (Design Principles)

1. **Setiap koin punya sumber dana yang bisa diaudit.** Distribusi ke user TIDAK BOLEH melebihi pendapatan aktual (offerwall + playtime + iklan + margin paket). Ledger double-entry wajib.
2. **Rate dinamis, bukan janji tetap.** Rate omzet toko & kurs koin mengikuti revenue — engine-nya transparan dan bisa diturunkan otomatis saat revenue turun (ini anti-Ponzi sekaligus anti-defisit).
3. **Komisi dari margin nyata**, dihitung asinkron & idempoten, masuk antrean payout dengan holding period.
4. **Secure by default:** RLS di semua tabel, service_role hanya di server, KYC untuk WD besar, audit trail.
5. **Serverless-first:** Vercel + Supabase (Postgres 17) + cron/Edge Functions. Tanpa server ops 24/7 di fase awal.
6. **Integrasi pihak ketiga adalah jantung monetisasi:** offerwall postback, playtime SDK, ads mediation, payment gateway, disbursement — semua butuh webhook handler yang idempoten & anti-fraud.
7. **Multi-kanal:** Web PWA dulu → Telegram Mini App → app store, satu API & data model.

---

## 2. Opsi Arsitektur (Brainstorm)

### Opsi A — "App Tugas" Klasik (GPT murni, tanpa game)
Dashboard misi saja. Cepat dibangun, legal mudah, tapi **tidak punya loop viral** — persis seperti Freecash/Swagbucks yang sudah ada. Diferensiasi rendah.

### Opsi B — "Game Full" (tycoon murni, monetisasi belakangan)
Game idle seru tapi sumber dana kabur (butuh IAP besar). Berisiko jadi game biasa yang membayar user dari kantong sendiri.

### Opsi C — Hybrid "Waralaba + GPT + Jaringan" (★ REKOMENDASI)
**Satu rumah (toko virtual dengan loop claim/streak/league) + empat keran uang nyata (offerwall, playtime, iklan, paket) + jaringan cabang.**
Game = bungkus retensi & viral. GPT/ads = mesin uang. Paket = revenue dasar + ikatan member. Jaringan = pertumbuhan.

**Verdict: Opsi C dipilih** (lihat [05-RISET-BUNGKUS-WEB2.md](05-RISET-BUNGKUS-WEB2.md) §4 untuk perbandingan bungkus A–D).

---

## 3. Arsitektur Sistem (Target State)

```
┌────────────────────────────────────────────────────────────────────┐
│                         KANAL PENGGUNA                             │
│  PWA Web (Next.js @ Vercel)  │  Telegram Mini App (fase 3)         │
└──────────────┬────────────────────────────────┬────────────────────┘
               │  HTTPS · Supabase JS SDK       │
┌──────────────▼────────────────────────────────▼────────────────────┐
│                        API & AUTH LAYER                            │
│  Supabase Auth (email/Google/OTP) · RLS · Realtime · Storage       │
│  Edge Functions: postback offerwall · webhook payment · payout      │
│  worker · cron settlement harian · rate-limiter                     │
└──────┬──────────────────────────────────────────────┬──────────────┘
       │                                              │
┌──────▼──────────────────────────────┐   ┌───────────▼──────────────┐
│   DOMAIN / DATA (Postgres 17)       │   │  REWARD NETWORKS (SaaS)  │
│  Users & KYC │ Referral tree        │   │  Offerwall (AdGem/RevU/  │
│  │ Toko virtual & upgrade │ Klaim   │   │  Torox/Notik) · Playtime │
│  & streak & league │ Paket & orders │   │  (adjoe/Tapjoy) · Rewarded│
│  │ Wallet ledger (double entry)     │   │  Ads (AdMob/Unity/MAX)   │
│  │ Commission engine │ Payout queue │   └──────────────────────────┘
│  │ Mission log │ Audit │ Flags      │   ┌──────────────────────────┐
│  │ pg_cron jobs                    │   │  PAYMENT RAILS (fiat)    │
└─────────────────────────────────────┘   │  Midtrans only: payment │
                                          │  methods by approval    │
                                          │  Midtrans payout to     │
                                          │  supported bank/GoPay   │
                                          │  KYC vendor (e-KYC ID)   │
                                          └──────────────────────────┘
```

### Kenapa stack ini?
- **Supabase** (project `CIF`, Postgres 17.6, ap-south-1, saat ini INACTIVE — diaktifkan saat Fase 0; atau project baru `osidac` sesuai keputusan user): Auth + Postgres + RLS + Realtime + Edge Functions dalam satu atap, ideal untuk ledger & genealogy (recursive CTE).
- **Vercel** (team `scryptexs-projects`): Next.js App Router, cron settlement, preview per PR.
- **Semua integrasi = SaaS web2** — tidak ada node blockchain, wallet kripto, atau smart contract.

---

## 4. Desain Domain Inti (Draft Skema)

### 4.1 Identitas & Jaringan
- `profiles` (1-1 `auth.users`): nama, no. HP, negara, `sponsor_id`, `referral_code`, rank, status KYC, tier paket.
- `referral_tree`: **materialized path** + **closure table** `referral_closure(ancestor, descendant, depth)` untuk query upline/downline cepat.
- Anti-abuse: verifikasi HP/email, device fingerprint, 1 identitas = 1 akun (anti-kavling).

### 4.2 Nilai & Uang (double-entry WAJIB)
- `wallets`: multi-purpose — `KOIN` (mata uang game/reward) & `IDR` (saldo penarikan).
- `ledger_entries` (append-only): setiap perubahan saldo = baris debit/kredit dengan `reference_type` (claim_omzet, mission_reward, playtime_reward, ad_reward, package_purchase, commission, withdrawal, bonus, penalty, clawback).
- **Invariants:** saldo = SUM(ledger); tak ada update saldo tanpa ledger; ledger tak bisa dihapus.
- `payout_queue` + `withdrawals`: state-machine `pending → approved → processing → paid / rejected`; fee, min/max, rate limit.

### 4.3 Toko Virtual (Loop Game)
- `virtual_stores`: level, speed, capacity, skin, multiplier, status.
- `store_upgrades` & `store_skins` (catalog).
- `claim_events`: claim timer server-side (mis. 1×/8 jam), perhitungan `omzet = base × level × streak × league × paket_multiplier`, **di-cap harian**.
- `streaks`, `league_seasons`, `league_memberships`, `events`, `missions` (daily/weekly/tim).
- `reward_pool_daily`: budget distribusi harian global (dihitung dari revenue kemarin × rasio distribusi) — **ini rem tangan ekonomi**.

### 4.4 Produk & Pendapatan
- `products` / `packages` (Paket Waralaba): tier, harga, isi (voucher, merch, multiplier, hak), versi harga.
- `orders` + `order_items` + pembayaran (Midtrans webhook only) → ledger; no production checkout until the product/top-up meaning is approved.
- `voucher_wallet` (e-voucher isi paket), `merch_fulfillment` (pengiriman merch).
- `mission_completions`: log offerwall/playtime (postback idempoten, status pending→verified→reversed).

### 4.5 Kompensasi & Payout
- `comp_plan_rules` (versioned): % per level, share margin misi, cap periode, syarat rank.
- `commissions`: `pending (holding) → payable → paid`; sumber: package_margin | mission_margin_share | fast_start | rank_bonus.
- `ranks` + `rank_qualifications`.
- **Capping engine:** total distribusi periode vs `reward_pool` & cap 40% → hair-cut proporsional otomatis.

### 4.6 Sistem & Kepatuhan
- `audit_log` (append-only), `kyc_records`, `feature_flags` (`wd_paused`, `claims_paused`, `registrations_paused`), `settings` (rate koin, kurs, cap, ambang).
- `transparency_reports` (laporan bulanan publik: pendapatan per keran, distribusi, payout ratio).

---

## 5. Commission & Reward Engine — Alur

```
[Order PAID]                [Postback Offerwall/Playtime]        [Claim Toko]
      │                              │                                │
      ▼                              ▼                                ▼
1. Validasi & idempotency key   1. Verifikasi signature postback   1. Cek timer & cap harian
2. Masuk ledger (revenue)       2. Hitung share user (60-70%)      2. cek reward_pool_daily
3. Hitung komisi paket          3. User credit (holding singkat)   3. Debit pool → kredit koin
   L1 8% / L2 3% / L3 1%       4. Hitung share margin upline      4. Update streak/league
   + Fast-Start                  (L1 5% / L2 2% / L3 1%)           5. Ledger + realtime UI
4. Cek cap → hair-cut jika      5. Cek cap → hair-cut                perlu
   perlu
5. Komisi pending + ledger

[Settle harian via pg_cron] → pending → payable →
[User request WD] → payout_queue → approval (auto < ambang / manual > ambang) →
Midtrans payout/disbursement → status paid → ledger final
```

Sifat wajib: **idempoten** (unique key per event), **replayable** (rekonstruksi dari ledger), **holding period** (komisi 14 hari; reward offerwall mengikuti jendela reversi advertiser), **clawback** otomatis bila advertiser mereverse.

---

## 6. Ekonomi Game — "Rem Tangan" Anti-Defisit

```
reward_pool_daily(t) = revenue_harian_rata2(7 hari) × rasio_distribusi (mis. 65%)
                       − komisi_jaringan_estimasi − biaya_WD_estimasi

omzet_toko_total(t)  = min(Σ omzet semua user, 40% × reward_pool_daily)
rate_dinamis(t)      = omzet_toko_total(t) / Σ (base_rate × multiplier semua user)
```
- Rate koin diumumkan di aplikasi ("rate hari ini") — transparan.
- Saat revenue turun → rate turun; saat naik → rate naik + event bonus. **Tidak pernah** menutup defisit dengan dana member.

---

## 7. Keamanan & Kepatuhan Teknis

1. **RLS 100% tabel**; pola `(select auth.uid()) = user_id`, `TO authenticated`, `WITH CHECK`; role admin di tabel `user_roles` (bukan kolom user-editable).
2. `service_role` hanya di Edge Functions; postback offerwall diverifikasi signature/HMAC + IP allowlist.
3. Anti-fraud: deteksi VPN/emulator (offerwall wajib), velocity check, device graph, sybil referral, honey-pot admin.
4. State darurat: `wd_paused`, `claims_paused`, `registrations_paused` + kill-switch rate.
5. Backup & PITR Supabase; audit log exportable (untuk pajak & sengketa).
6. Legal UI: ToS, disclaimer "bukan investasi & tidak ada jaminan penghasilan", ekspektasi realistis, kebijakan refund paket (sebelum voucher dipakai), **PSE Kominfo** display.
7. Privasi: UU PDP (UU 27/2022) — consent, data minimization, hak hapus akun.

---

## 8. Infrastruktur Siap Pakai (Status Akun Anda)

| Layanan | Status saat riset | Tindakan saat Fase 0 |
|---|---|---|
| **Supabase** | 1 project: `CIF` (ref `uqtvjerhgvwoxiejvrli`, Postgres 17.6.1, ap-south-1) — **INACTIVE** | Aktifkan, atau buat project baru `osidac` (keputusan user) |
| **Vercel** | Team `scryptexs-projects` (project `last-harbord` = game Godot, tidak terkait) | Buat project `osidac` linked ke repo `Scryptexai/Osidac` |
| **GitHub** | Repo `Scryptexai/Osidac` | Semua kerja di branch `arena/e06f4d1c-osidac` |

---

## 9. Keputusan Arsitektur (ADR Ringkas)

| # | Keputusan | Alasan |
|---|---|---|
| ADR-1 | Pure web2: tanpa blockchain/kripto/token | Permintaan pivot; menyederhanakan legal & UX; WD e-wallet lokal |
| ADR-2 | Hybrid "Waralaba + GPT + Jaringan" (Opsi C) | Viralitas game + revenue nyata + pertumbuhan jaringan |
| ADR-3 | Ledger double-entry untuk semua nilai | Auditability; membuktikan distribusi ≤ pendapatan |
| ADR-4 | `reward_pool_daily` + rate dinamis (rem tangan) | Mencegah defisit & menjaga kejujuran ekonomi |
| ADR-5 | Genealogy: materialized path + closure table | Query downline cepat di Postgres |
| ADR-6 | Komisi asinkron + holding + capping 40% | Kepatuhan, anti chargeback, anti money-game |
| ADR-7 | Unilevel 3 level; tanpa binary di v2 | Stabilitas & risiko regulasi rendah |
| ADR-8 | Postback idempoten + clawback untuk reward advertiser | Menyesuaikan jendela reversi CPA |
| ADR-9 | Next.js PWA dulu → Telegram Mini App | Validasi cepat, kanal viral menyusul |
| ADR-10 | Midtrans saja untuk top-up dan payout | Keputusan pemilik produk 18 Okt 2026; eligibility, kanal, dan tarif harus dikonfirmasi; belum live |

Lanjut ke [03-PLAN-CONCEPT-OSIDAC.md](03-PLAN-CONCEPT-OSIDAC.md) (konsep produk) dan [04-ROADMAP.md](04-ROADMAP.md).

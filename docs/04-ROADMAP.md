# 04 — Roadmap Eksekusi OSIDAC (v2 — Web2, Buy → Get → WD)

> Status dokumen: roadmap produk v2 (revisi pivot 17 Okt 2026). Implementasi berjalan di Fase 1; belum ada fase yang dinyatakan lulus sampai exit criteria terukur terpenuhi.
> Estimasi awal: 1–2 full-stack engineer + AI-assisted development; timeline hanya indikatif dan tidak melewati gerbang stop/go. Tanpa blockchain/kripto; payout uang nyata tetap fase lanjutan.

---

## Overview

```
FASE 0          FASE 1            FASE 2              FASE 3            FASE 4
Foundation  →   MVP Loop      →   Mesin Uang &    →   Growth &      →   Scale
& Compliance    (Toko & Misi      WD (offerwall,      Network Deep     (Mall, multi-
(PSE, PT,       dummy, PWA)       paket, e-wallet)    (rank, Telegram)  kanal, liveops)
brand)        
2–3 minggu      5–7 minggu        8–10 minggu          8–12 minggu       kontinu
```

---

## FASE 0 — Foundation & Compliance (Minggu 1–3)

| # | Tugas | Output |
|---|---|---|
| 0.1 | **Legal & izin:** setup **PT** (atau jalur sewa badan), daftar **PSE Kominfo (PSE Lingkup Privat)**, draft ToS, disclaimer ("bukan investasi, penghasilan tidak dijamin"), kebijakan refund paket, **UU PDP** (consent & data) | Izin berjalan + dokumen legal |
| 0.2 | Brand: nama produk final (kandidat: **Kota Cuan / Warung Empire / CuanTown / BisnisKu**), logo, design system (Tailwind + shadcn/ui), tone "UMKM digital" | Brand kit v1 |
| 0.3 | Repo: Next.js (App Router, TS) + CI lint/test + env template | Skeleton repo |
| 0.4 | Supabase: aktifkan `CIF` atau buat `osidac` (**keputusan user**); Auth (email/Google/OTP), RLS baseline, seed roles | DB siap |
| 0.5 | Vercel project `osidac` linked ke repo; preview + production | Pipeline hijau |
| 0.6 | Spesifikasi ekonomi: model rate koin, reward_pool, skema komisi JSON + **simulator payout** (unit test) | Spec teruji |
| 0.7 | Akun mitra: apply publisher offerwall (AdGem/RevU/Torox), playtime (adjoe), ads (AdMob/Unity), dan onboarding merchant **Midtrans saja** (butuh entitas yang memenuhi syarat) | Akun mitra berjalan |

**Exit criteria:** ✅ PSE berjalan & PT siap · ✅ deploy skeleton ke Vercel · ✅ skema DB v1 bermigrasi + RLS tests lulus · ✅ simulator komisi lulus.

---

## FASE 1 — MVP Loop: Toko Virtual (Minggu 4–10)

**Tujuan:** loop "buka → claim → upgrade → streak" terasa adiktif; referral terlacak; koin masih internal (belum bisa WD).

> **Status implementasi 18 Okt 2026:** fondasi S1–S3, wallet/ledger dan PWA S4, serta sebagian admin v1 S5 sudah masuk MVP. Daily mission rewards menggunakan poin KOIN internal non-tunai (bukan OSID); tidak ada checkout paket, offerwall berbayar, payout komisi, atau WD uang nyata yang aktif. Notifikasi realtime untuk ledger sudah berjalan; commission engine dari order, anti-sybil, beta cohort, dan seluruh exit criteria masih belum selesai. Fase 1 **belum dinyatakan lulus**.

| Sprint | Fitur |
|---|---|
| S1 | Auth + onboarding + referral capture (lock sponsor) · profiles · referral_tree (path+closure) |
| S2 | **Toko virtual**: produksi otomatis, claim timer server-side, upgrade (speed/capacity), ledger koin |
| S3 | Streak harian + League musiman (dummy data) + misi harian internal (check-in, share, undang teman) |
| S4 | Wallet & riwayat ledger · notifikasi realtime · PWA shell + installable |
| S5 | Admin v1: user, flag fraud, feature flags, rekap klaim · commission engine v1 (dari order internal) |
| S6 | Anti-sybil dasar (rate limit, device fingerprint, velocity) · audit log · **soft launch komunitas kecil (100–500 user)** |

**Exit criteria:** ✅ 100–500 beta user · ✅ D1 retention ≥ 35% · ✅ 100% mutasi nilai tercatat di ledger · ✅ tanpa bug saldo.

---

## FASE 2 — Mesin Uang & WD (Minggu 11–20)

**Tujuan:** membuktikan pendapatan bersih yang benar-benar settle, lalu menyiapkan WD yang dapat direkonsiliasi. Payout uang nyata tetap OFF sampai gerbang legal, kontrak provider, pendanaan, dan finance di bawah lolos. Strategi dan simulasi biaya: [docs/07-PHASE-2-PAYOUT-STRATEGY.md](07-PHASE-2-PAYOUT-STRATEGY.md).

| Sprint | Fitur |
|---|---|
| S7 | **Offerwall v1** (mediation 2–3 jaringan): webview/SDK, postback idempoten + HMAC, status pending→verified→clawback |
| S8 | **Paket Waralaba**: katalog 5 tier + checkout **Midtrans saja** pada kanal yang disetujui untuk OSIDAC · voucher wallet · fulfillment merch. Top-up saldo IDR tersimpan perlu definisi produk/legal terpisah. |
| S9 | **Play & Earn** (adjoe/Tapjoy) + **Rewarded Ads** (energi/boost) · integrasi rate dinamis + `reward_pool_daily` dalam mode bayangan; produksi hanya dari settlement dan reserve tervalidasi |
| S10 | **WD center**: pisahkan KOIN internal dari `withdrawable_idr`; sandbox payout provider, webhook/idempotensi, approval, hold, reserve & rekonsiliasi. Provider, kanal, ambang, fee, dan KYC ditetapkan setelah quote/approval; production WD hanya setelah semua gerbang stop/go lolos |
| S11 | Commission run produksi (8/3/1 + share margin 5/2/1 + Fast-Start + rank) hanya setelah revenue/gate tervalidasi · holding sesuai risiko/kontrak (rencana awal 14 hari) · cap jaringan 40% dari pool · laporan transparansi |
| S12 | Finance dashboard (revenue per keran, payout ratio live, rate koin) · load test · security review · **beta tertutup dulu; publik terbatas hanya setelah semua gate & exit criteria** |

### Stop/go gates sebelum WD uang nyata

Rincian dan checklist ada di [docs/07-PHASE-2-PAYOUT-STRATEGY.md](07-PHASE-2-PAYOUT-STRATEGY.md). Sebelum production WD: (A) pendapat hukum/entitas/PSE/pajak dan persetujuan tertulis provider; (B) sumber pendapatan yang sudah settle, perhitungan net eligible revenue, reserve dan kas payout disetujui finance; (C) sandbox lulus uji idempotency, timeout, webhook, kegagalan, reconciliation, approval, dan kill switch; (D) uji internal dan beta tertutup mendapat persetujuan eksplisit. Jika satu gate belum lolos, payout uang nyata dan klaim WD tetap OFF.

**Exit criteria:** ✅ pendapatan offerwall/iklan/paket eligible tercatat hanya setelah settle dan net costs · ✅ ≥50 WD pertama berhasil setelah legal/provider/finance gate dan target waktu mengikuti SLA tertulis · ✅ 100% rekonsiliasi payout harian tanpa selisih tak terjelaskan · ✅ seluruh distribusi termasuk fee provider ≤70% net eligible revenue dan komisi jaringan tetap di dalam cap 40% · ✅ UAT disclaimer & halaman transparansi.

---

## FASE 3 — Growth & Kedalaman Jaringan (Minggu 21–32)

| Sprint | Fitur |
|---|---|
| S13 | **Rank system** (Starter→Director) + leadership pool + bonus bulanan |
| S14 | **Telegram Mini App** (kanal viral SEA) + bot notifikasi + deep-link referral |
| S15 | Event musiman, league tim, battle-pass, misi komunitas (budget ter-capping) |
| S16 | Affiliate toolkit: landing page personal, materi promosi, analytics link |
| S17 | Mall voucher & cashback (affiliate commerce) v1 · i18n (ID dulu, EN menyusul) · optimasi funnel |
| S18 | Liveops cadence: event 2 mingguan, A/B rate, survei kepuasan |

**Exit criteria:** ✅ ≥ 10k registrasi · ✅ ≥ 40% signup dari referral · ✅ ≥ 3 Leader aktif · ✅ payout ratio tetap ≤ 70% saat spike viral.

---

## FASE 4 — Scale (Minggu 33+, kontinu)

| Inisiatif | Keterangan |
|---|---|
| App store native (Capacitor/React Native) | Jangkauan lebih luas |
| Cashback mall penuh + merchant lokal ID | Revenue commerce |
| Multi-bahasa & pasar SEA (MY/VN/TH) | Ekspansi |
| Fraud ML & tim moderasi | Skala |
| Opsi Binary/Matrix (default OFF, hanya jika data mendukung & review legal) | Perluasan skema |
| Audit keamanan eksternal + bug bounty | Syarat skala besar |

---

## Milestone Ringkas

| Bulan | Milestone |
|---|---|
| 1 | Fase 0: PSE + PT + foundation + pipeline |
| 2–3 | MVP toko virtual soft launch (loop terbukti retensi) |
| 4–5 | Target indikatif: revenue source tervalidasi + payout sandbox; WD uang nyata hanya jika semua gerbang Phase 2 lolos (bukan berdasarkan bulan kalender) |
| 6–8 | Growth: rank + Telegram + 10k user |
| 9+ | Scale: mall, app store, SEA |

---

## Tim & Anggaran Kasar (Indikatif)

| Peran | Fase | Catatan |
|---|---|---|
| Full-stack (Anda + AI agent) | Semua | Next.js, Supabase, SQL |
| Legal/administrasi (paruh waktu) | 0 | PT, PSE, ToS, UU PDP |
| Designer (async) | 0–1 | Brand + UI kit game |
| Ops/finance (parsial) | 2+ | Review WD, rekonsiliasi offerwall |
| Customer support | 1+ | Bisa dimulai dari komunitas |

Biaya infrastruktur MVP: **~$30–80/bulan** (Supabase Pro + Vercel Pro + domain + email + tooling) + biaya badan usaha/PSE sekali di awal.

---

## Guardrails Eksekusi (Tetap Berlaku)

1. **Tidak ada pembayaran yang dibiayai deposit/devisa member baru.** Distribusi hanya dari pendapatan eksternal net yang sudah settle (offerwall/playtime/iklan/laba paket setelah pemenuhan); gross checkout paket tidak otomatis menjadi reward pool. Total distribusi termasuk biaya payout selalu ≤ batas pendapatan eligible dan kas nyata.
2. Rate koin mengikuti `reward_pool` — lebih baik rate turun daripada ekonomi bohong.
3. Setiap perubahan comp plan = versi baru + simulasi payout + review.
4. Ledger = sumber kebenaran tunggal.
5. Fitur "wow" (event besar, binary, ekspansi) hanya setelah retensi & payout ratio sehat.
6. Semua kerja teknis di branch `arena/e06f4d1c-osidac`.

---

## Status Keputusan — RESOLVED (lihat [00-DECISION-LOG.md](00-DECISION-LOG.md))

| # | Keputusan | Hasil |
|---|---|---|
| 1 | Nama produk | ✅ **OSIDAC** (tetap) |
| 2 | Supabase | ✅ Project baru **`osidac`** (ref `qalnpcefixdzhdwbqzvj`, ap-southeast-1) |
| 3 | Badan usaha | ✅ **Sewa badan** (jasa agent PT/PSE) |
| 4 | Paket 5 tier | ✅ Disetujui (USD $3.49–$349.99 / IDR Rp49rb–Rp4,9jt) |
| 5 | Target pasar | ✅ **Global** (EN default + gateway global & ID) |
| 6 | Bahasa | ✅ **EN / ID** (i18n `/en` `/id`) |

**Fase 0 sudah dimulai:** skeleton Next.js 16 + Supabase + i18n EN/ID ter-commit, project Supabase & Vercel dibuat. Sisa Fase 0: dokumen legal sewa badan + PSE, brand kit, akun mitra (offerwall/playtime/ads/payment).

# 03 — Plan Concept: OSIDAC (v2 — Web2, Buy → Get → WD)

> Dokumen konsep historis (17 Okt 2026); belum menjadi spesifikasi launch atau bukti fitur aktif.
> **Update 18 Okt 2026:** Midtrans dipilih sebagai satu-satunya provider top-up dan payout. Integrasi, kanal, tarif kontrak, saldo tunai, dan cashout belum aktif/terkonfirmasi. Asumsi channel atau payout lama di dokumen ini tidak berlaku kecuali dikonfirmasi ulang. Lihat [07-PHASE-2-PAYOUT-STRATEGY.md](07-PHASE-2-PAYOUT-STRATEGY.md).

---

## 1. Positioning Produk

**OSIDAC — "Virtual Waralaba & Rewards Platform"**

Satu kalimat:
> Platform web2 dengan toko virtual, misi, dan komunitas. Pembelian paket, misi partner berbayar, dan penarikan uang bukan fitur aktif; bila payout diluncurkan, provider tunggalnya Midtrans dan kanalnya harus lebih dulu disetujui.

**Kategori:** Rewards/GPT App × Idle Tycoon Game × Affiliate Commerce
**Bukan:** aplikasi mining, bukan kripto, bukan investasi, bukan money game.

### 1.1 Tagline & Narasi
- Tagline: **"Bisnis kecilmu, jalan 24 jam di HP."**
- Narasi 5 detik: *Tokomu produksi terus. Kamu tinggal ambil omzetnya, naik level, ajak kawan buka cabang. Cuannya tarik ke e-wallet.*

### 1.2 Persona

| Persona | Kebutuhan | Daya tarik untuknya |
|---|---|---|
| **Pencari cuan harian** (pelajar, ibu rumah tangga, pekerja sampingan) | Penghasilan kecil yang pasti cair ke e-wallet | Claim harian + misi + WD cepat |
| **Gamers kasual** | Hiburan yang dapat cuan | Loop upgrade, league, skin, event |
| **Reseller/affiliate** | Penghasilan dari jaringan | Komisi cabang + rank + leaderboard |
| **Leader komunitas** | Status + income | Leadership pool, coaching, turnamen tim |

---

## 2. Produk — Tiga Pilar (Rumah Baru, Tanpa Mining)

### Pilar 1: 🏪 Toko Virtual (Loop Inti — Pengganti "Mining Bot")
- Setiap user dapat **Toko Gratis Lv.1** saat daftar (tanpa bayar apa pun!).
- Toko "berproduksi" koin 24 jam → user **CLAIM omzet** tiap 8 jam (mekanik identik Notcoin/Hamster: claim, upgrade, streak — tapi temanya **bisnis**, bukan nambang).
- Upgrade: kecepatan produksi, kapasitas penyimpanan, tampilan (skin), cabang.
- **Streak harian** (bonus hari ke-7/30), **League mingguan** (Bronze→Diamond), **event musiman**, **misi tim**.
- Formula publik: `omzet_claim = base_rate × level_toko × streak × league × multiplier_paket`, dengan **cap harian global** per akun.

### Pilar 2: 💰 Misi Berbayar (Mesin Uang Nyata)
- Tab **Misi**: offerwall (install app, milestone game, survei, trial) + **Play & Earn** (main game partner, koin per menit & milestone) + **Rewarded Ads** (tonton iklan dapat energi/koin).
- Dana dari **advertiser & studio game** — inilah keran uang utama (terbukti: Freecash bayar $400jt+, Mistplay 40jt MAU).
- User mendapat 50–70% dari fee yang kami terima; sisanya margin platform.

### Pilar 3: 🌐 Jaringan Cabang (Pertumbuhan)
- Setiap user punya kode referral → "buka cabang" (downline).
- Komisi dari **margin paket** + **share margin misi** (dibayar dari bagian kami, bukan dari hak downline).
- Dashboard: omzet tim, komisi, progress rank, leaderboard.

---

## 3. Alur Utama: BUY → GET → WD

```
┌──────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│  BUY         │     │  GET                 │     │  WD             │
│  Paket       │ ──► │  • Omzet toko harian │ ──► │  Koin → Rupiah  │
│  Waralaba    │     │  • Misi & playtime   │     │  → Midtrans-    │
│  Digital     │     │  • Bonus tim & rank  │     │    supported    │
└──────────────┘     └──────────────────────┘     └─────────────────┘
     │                        ▲                          │
     └── tier/produk tunduk pada     kelak hanya dari       minimum, KYC, fee,
         spesifikasi & review        revenue settle;        channel dan waktu
                                     bukan dana member lain  belum ditetapkan
```

### 3.1 BUY — Paket Waralaba Digital (contoh tier, harga final Fase 0)

| Paket | Harga | Isi nyata (nilai intrinsik!) |
|---|---|---|
| **Starter Booth** | Rp49.000 | Toko Lv.2 permanen · multiplier misi 1,2× · bonus check-in 30 hari · e-voucher Rp25rb |
| **Kios Pro** | Rp149.000 | Toko Lv.4 · multiplier 1,4× · limit WD naik · e-voucher Rp75rb · skin eksklusif |
| **Warung Gold** | Rp499.000 | Toko Lv.6 · multiplier 1,6× · merch fisik · e-voucher Rp250rb |
| **Franchise Elite** | Rp1.490.000 | Toko Lv.8 · multiplier 1,8× · hak komisi lebih dalam · merch premium · prioritas WD |
| **Empire Master** | Rp4.900.000 | Toko Lv.10 · multiplier 2,0× · status Leader · paket merch lengkap · coaching komunitas |

**Aturan emas:** nilai paket (voucher + merch + multiplier + status) **harus terbayar wajar** di luar koin. Tidak ada klaim "balik modal", tidak ada "profit % per hari".

### 3.2 GET — Empat Keran Koin (semua berdana nyata)

| # | Keran | Sumber dana | Porsi ke user |
|---|---|---|---|
| 1 | Omzet toko (claim 8-jam) | Pool iklan+offerwall+margin paket (di-cap harian global) | Rate dinamis, transparan |
| 2 | Misi offerwall/survei | Budget advertiser (CPA $0,3–150) | **60–70%** dari fee |
| 3 | Play & earn | Budget UA studio game | **50–60%** dari fee |
| 4 | Bonus tim & rank | Margin paket + share margin misi | Sesuai skema §5 |

### 3.3 WD — Penarikan (belum aktif)
- OSID Coins tidak memiliki kurs tunai dan tidak dapat ditarik.
- Provider yang dipilih untuk payout mendatang adalah **Midtrans saja**; daftar bank/GoPay yang eligible harus dikonfirmasi dengan Midtrans.
- Minimum, fee, pajak, KYC/hold, limit, dan estimasi waktu belum ditetapkan. Jangan tampilkan opsi atau janji payout sebelum kontrak, legal/finance review, dan sandbox lulus.

---

## 4. Business Model & "Pabrik Uang" yang Jujur

### 4.1 Sumber Pendapatan Platform
| Sumber | Mekanik | Estimasi kontribusi |
|---|---|---|
| Offerwall/CPA margin | 30–40% dari fee advertiser | 40–50% |
| Playtime/UA margin | 40–50% dari fee studio | 15–25% |
| Margin paket waralaba | Harga − (voucher+merch+alokasi koin) | 15–25% |
| Rewarded ads | eCPM $15–30 | 5–10% |
| Cashback/affiliate commerce (fase 3) | 5–15% komisi merchant | 5–10% |

### 4.2 Formula Transparansi (dipublikasikan tiap bulan)
```
Pendapatan = Offerwall + Playtime + Iklan + Margin paket + Cashback fees
Distribusi ke user = min(70% × Pendapatan, Budget claim + Misi + Bonus + Komisi)
Margin platform = Pendapatan − Distribusi − Operasional (target ≥ 10%)
```
> Rate koin & omzet toko **mengikuti pendapatan aktual** — bila turun, rate turun (ditampilkan). Tidak pernah disubsisi dana member baru. Inilah beda fundamental dengan money game.

### 4.3 Kerangka Alokasi Dollar Masuk
```
100% pendapatan
 ├─ 60–70%  ← total distribusi ke user (koin + komisi) — batas GPT standar
 ├─ 10–15%  ← operasional, support, compliance, infra
 ├─ 10–15%  ← profit & reserve (buffer rate koin saat revenue fluktuatif)
 └─ cap keras: komisi jaringan tidak lebih dari 35–40% dari commissionable volume
```

---

## 5. Skema Kompensasi Jaringan (v2 — dana dari margin nyata)

### 5.1 Unilevel 3 Level + Rank + Leadership Pool

**A. Komisi Paket (dari margin pembelian paket waralaba):**
| Level | Persentase |
|---|---|
| L1 (cabang langsung) | 8% |
| L2 | 3% |
| L3 | 1% |

**B. Share Margin Misi (dari BAGIAN PLATFORM atas aktivitas misi downline — hak downline tidak dipotong):**
| Level | Persentase |
|---|---|
| L1 | 5% |
| L2 | 2% |
| L3 | 1% |

**C. Fast-Start Bonus — 5%** dari paket pertama cabang baru dalam 30 hari.

**D. Rank & Leadership Pool (5% budget bonus):**
| Rank | Syarat (contoh) | Bonus |
|---|---|---|
| Starter | Aktif + 1 cabang ber-omzet | — |
| Builder | 3 cabang aktif · GV ≥ Rp1jt/bln | 2% GV tim |
| Leader | 10 cabang aktif · GV ≥ Rp10jt/bln · 2 Builder | 3% GV tim + reward |
| Director | 50 cabang aktif · GV ≥ Rp100jt/bln · 5 Leader | 4% GV tim + leadership pool |

**E. Aturan Aman (hard-coded di engine):**
- Total payout periode ≤ **40%** commissionable volume (safety-net hair-cut otomatis).
- Komisi holding **14 hari** sebelum bisa ditarik.
- **Daftar gratis, tanpa paket wajib** — member gratis tetap dapat komisi L1 (rate dasar).
- 1 identitas = 1 akun (anti kavling, aturan PP 3/2026).
- Binary/matrix **tidak dipakai** di v2 (opsi fase 4, default OFF).

### 5.2 Kenapa Skema Ini Aman & Tetap Menggiurkan
1. Semua komisi bersumber **margin produk & layanan**, bukan setoran member.
2. Total distribusi terikat pendapatan aktual (formula §4.2).
3. Cap 40% mengikuti batas Permendag 32/2008 — aman bila suatu saat butuh jalur legal ID formal.
4. Leader tetap dapat income besar **jika timnya produktif menghasilkan revenue nyata** (misi, paket) — mendorong perilaku sehat.

---

## 6. User Journey Kunci

```
[Klik link teman] → Daftar gratis (email/HP/Google) → Dapat Toko Lv.1 + 500 koin
→ Claim omzet pertama (rasa "wow, tokoku jalan") → Upgrade dari koin → streak hari ke-3
→ Coba Misi pertama (install app → +2.000 koin besar pertamanya)
→ Undang 3 kawan → "cabang" aktif → multiplier naik
→ Beli paket Starter Booth (Rp49rb, dapat voucher Rp25rb — nyaris gratis) → toko Lv.2
→ Kumpulkan OSID Coins untuk penggunaan di aplikasi. Payout uang nyata hanya dapat dipertimbangkan setelah seluruh gerbang legal, Midtrans, finance, dan sandbox terpenuhi.
→ Naik rank → League Diamond → jadi Leader
```

**Momen kunci:** WD pertama yang cepat & mulus = iklan terbaik. Budget engineering paling banyak di sini.

---

## 7. Fitur per Modul (Scope v2)

### 7.1 Area Member
- Onboarding + referral capture · **Dashboard Toko** (claim timer, upgrade, skin, statistik omzet) · Streak & League · **Tab Misi** (offerwall SDK/webview, playtime, rewarded ads) · Wallet (koin, rupiah, riwayat ledger) · **WD center** (e-wallet/bank) · Jaringan (cabang, komisi, rank progress) · Mall voucher/merch (fase 3) · Notifikasi · Academy singkat + halaman transparansi "Cara Kami Membayar".

### 7.2 Area Admin
- CMS paket & harga (versioned) · Comp plan manager · Commission run harian · Payout queue & approval · Offerwall/ads network manager (mediation) · User/KYC · Anti-fraud console · **Finance dashboard (revenue per keran, payout ratio live, rate koin)** · Feature flags & mode darurat · Audit log.

### 7.3 Integrasi Web2 (tanpa blockchain)
| Fungsi | Vendor |
|---|---|
| Top-up / checkout | **Midtrans saja**; product meaning, eligibility, and enabled channels must be confirmed before integration |
| Payout | **Midtrans saja**; supported bank/GoPay channels, fees, tax, and service terms must be confirmed |
| Offerwall | AdGem, RevU, Torox, Notik, Pollfish, OfferToro (mediation) |
| Playtime | adjoe Playtime, Tapjoy/Unity, ironSource |
| Rewarded ads | AdMob, Unity Ads, AppLovin MAX |
| KYC | Veriff/Sumsub atau e-KYC ID (Verihubs, Mekari) |
| Email/Notif | Resend + FCM + WhatsApp Business (opsional) |
| Analytics | PostHog + Vercel Analytics |

---

## 8. Peta Persaingan

| | Freecash | Mistplay | ShopBack | App "cuan" lokal | **OSIDAC** |
|---|---|---|---|---|---|
| Bungkus | Dashboard tugas | Loyalty gamer | Portal belanja | Sering scam | **Virtual waralaba + game loop** |
| Loop harian seru | ⚠️ | ⚠️ | ❌ | ✅ | ✅ (claim/streak/league) |
| Ada produk dibeli | ❌ | ❌ | ✅ | ⚠️ | ✅ (paket waralaba + voucher/merch) |
| Jaringan komisi | ⚠️ tipis | ⚠️ | ⚠️ | ✅ (abu-abu) | ✅ 3 level + rank (aman) |
| WD e-wallet ID | ❌ | ❌ | ✅ bank | ✅ | ✅ lengkap |
| Legal jelas (PSE+PT) | ⚠️ | ⚠️ | ✅ | ❌ | ✅ |

**Diferensiasi:** "Satu-satunya aplikasi yang bikin kamu *punya bisnis* — bukan cuma nugas — dan cuannya langsung masuk e-wallet."

---

## 9. Risiko Utama & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Dicap "aplikasi penghasil uang bodong" | Blokir Kominfo, stigma | PSE + PT + transparansi formula pembayaran + bukti WD publik + tanpa janji tetap + daftar gratis |
| Offerwall sepi di market ID (CPA ID lebih rendah dari US) | Revenue tipis | Mitigasi: gabungan 4 keran; prioritas game offers global; cashback commerce lokal; paket sebagai revenue dasar |
| Fraud/sybil & VPN (user ID pura-pura US) | Fee di-reverse advertiser | Deteksi VPN/emulator, device fingerprint, KYC tier, rate limit, holding period |
| Rate koin tidak realistis vs dana | Defisit → skema jadi Ponzi de facto | **Cap dinamis otomatis** (rate mengikuti revenue), dashboard transparansi publik, audit bulanan |
| Biaya WD membengkak (fee kanal) | Margin tergerus | Minta tarif kontrak Midtrans, hitung fee/tax/retry, lalu tetapkan minimum dengan persetujuan finance |
| Kompetisi besar masuk (GoTo, Shopee rewards) | Churn | Fokus niche: game loop + waralaba + komunitas leader; iterasi liveops cepat |

---

## 10. KPI v2

| KPI | Target MVP+3 bulan |
|---|---|
| Registrasi | 10.000 |
| D1 retention | ≥ 35% |
| DAU/MAU | ≥ 25% |
| Offerwall completion rate | ≥ 10% DAU |
| Konversi free → paket | ≥ 3% |
| Payout ratio aktual | ≤ 70% (distribusi/pendapatan) |
| Waktu ke WD pertama | ≤ 5 hari sejak aktivitas pertama |
| Referral-driven signups | ≥ 40% |
| Fraud loss | < 1% revenue |

---

## 11. Keputusan Nama & Brand (Fase 0)

- **OSIDAC** = nama platform/perusahaan (dari repo).
- Nama produk/game terbuka: kandidat **Kota Cuan**, **Warung Empire**, **CuanTown**, **BisnisKu** — diputuskan di Fase 0 bersama logo & domain.
- Badan usaha: **sewa badan** sesuai keputusan pemilik; eligibility PSE/provider wajib dikonfirmasi. Midtrans adalah satu-satunya provider pembayaran/payout yang dipilih.

---

## 12. Ringkasan Satu Layar

> **OSIDAC = toko virtual, misi, dan komunitas di web.** OSID Coins saat ini adalah poin aplikasi tanpa nilai tunai. Paket berbayar, partner offers, komisi jaringan, top-up tunai, dan penarikan belum aktif. Jika payout diluncurkan, Midtrans adalah satu-satunya provider yang dipilih; semua kanal dan syarat perlu persetujuan.

Lanjut ke [04-ROADMAP.md](04-ROADMAP.md) untuk eksekusi.

# 01 — Riset & Referensi Industri: MLM × Mining Bot

> Status: FASE RISET (belum koding) · Tanggal: 17 Oktober 2026
> Tujuan: memetakan model bisnis nyata, data pasar, skema yang terbukti sukses, batasan legal, dan red flag yang harus dihindari — sebelum satu baris kode ditulis.

---

## 1. Ringkasan Eksekutif Riset

| Temuan kunci | Implikasi untuk OSIDAC |
|---|---|
| Cloud mining legit (Bitdeer, BitFuFu, ECOS, GoMining) **tidak pernah menjanjikan return tetap**. Return mengikuti hashprice pasar (~$0.036/TH/hari pada Mei 2026). | Produk harus berbasis **hashrate nyata / imbal hasil variabel**, bukan "profit harian tetap". |
| Skema "mining MLM" yang menjanjikan 1–3%/hari hampir semuanya Ponzi (contoh runtuh: Power Mining Pool, Mining Up, ANTM, Mining Memes). | Struktur komisi **wajib** bersumber dari margin produk, bukan dari dana member baru. |
| Referral terbukti di industri cloud mining: **2–10%**, mayoritas **3–5% level 1, 1–2% level 2**, dibayar dari margin platform. | Pakai **affiliate dangkal (2–3 level)** — bukan deep-MLM yang memicu red flag. |
| Payout ratio industri direct selling yang sehat: **35–45%** dari commissionable volume (maks. 40% sesuai Permendag 32/2008 untuk Indonesia). | Cap total komisi ≤ 35–40% dengan mekanisme capping otomatis. |
| Unilevel punya retensi 40–60% YoY vs binary 20–35%; binary berisiko payout liar 60–80% saat ledakan pertumbuhan. | Mulai dengan **Unilevel 3 level**; binary hanya sebagai modul opsional di fase lanjut dengan balance rule 60/40 + cap. |
| Gamifikasi "mining bot" (Notcoin 35 juta pemain, Hamster Kombat 300 juta user) terbukti viral — tapi **pure tap-to-earn sudah mati** (pengakuan tim Notcoin, 2025). | Bot mining = lapisan **engagement & akuisisi**; retensi wajib pakai streak, upgrade, league, misi, dan lapisan pendapatan nyata. |
| **PP 3/2026 (perubahan PP 29/2021)**: SIUPL/MLM hanya untuk **barang berwujud**; pemasaran **jasa & produk investasi (termasuk kripto) lewat sistem penjualan langsung DILARANG**. | Model Indonesia tidak boleh membingkai kripto/mining sebagai produk MLM SIUPL. Struktur global = **software-as-a-service + affiliate**, bukan "perusahaan MLM kripto". |

---

## 2. Peta Pemain Nyata (Benchmark)

### 2.1 Cloud Mining / Hashrate Terlegitimasi

| Pemain | Model | Bukti nyata | Skema referral | Pelajaran |
|---|---|---|---|---|
| **Bitdeer** (publik, ex-Bitmain) | Kontrak sewa hashrate, data center sendiri | 78,1 EH/s under management (Mar 2026); 70 EH/s self-mining | 2–6% bertingkat sesuai besar investasi | Transparansi infrastruktur = trust premium tertinggi |
| **BitFuFu** | Cloud hashrate, listing publik | Laporan operasional publik | Program partner | Bukti operasional publik mengalahkan janji ROI |
| **GoMining** (sejak 2017) | **Digital Miner NFT** (TH/s + W/TH) backed ASIC asli, 350 MW data center AS | 216.000+ NFT terjual; 5.838+ BTC hasil user; live feed data center | Referral & ambassador program | Kepemilikan aset + marketplace sekunder (likuiditas keluar) = model paling maju di kategori ini |
| **ECOS** | Kontrak fixed-term di zona ekonomi khusus Armenia | Data center Hrazdan, sejak 2017 | Bonus & trial | Target pemula, harga masuk rendah ($1 TH/s) |
| **BeMine** | Fraksi kepemilikan ASIC (mulai 2%) | Hosting ASIC fisik | 8% L1, 4% L2 + cashback | Hybrid fisik-digital |
| **NiceHash** | Marketplace hashrate (jual-beli daya komputasi) | Marketplace likuid | 5% revenue share fee trading, 12 bulan | Model marketplace: platform menang dari fee, bukan dari spread "profit" |
| **Hashing24 / Hashing24-class** | Kontrak sederhana | — | 3–10% pembelian referral | Rentang komisi tipikal |

**Harga acuan industri (data live, Mei 2026 dari ekosistem GoMining):**
- Network hashrate BTC: ~987 EH/s · Difficulty: 136,61T · Hashprice: **$35,88/PH/s/hari ≈ $0,036/TH/hari**
- Biaya listrik industri: $0,06/kWh → ~$0,022–0,040/TH/hari tergantung efisiensi mesin (15–28 W/TH)
- **Artinya:** setiap platform yang menjanjikan hasil > ~$0,03/TH/hari secara konsisten tanpa subsidi, sedang membayar dari kantong lain (biasanya deposit member baru = Ponzi).

### 2.2 "Mining Bot" & Gamifikasi (Akuisisi Viral)

| Pemain | Mekanik | Skala | Status 2026 |
|---|---|---|---|
| **Notcoin** (TON) | Tap-to-mine, energi, teman, streak | 35 juta+ pemain; 6 juta DAU puncak; token NOT listing Binance, puncak market cap ~$574 juta | Tim sendiri mengakui model tap-only "probably dead"; pivot ke game dengan mekanik lebih dalam |
| **Hamster Kombat** (TON) | Tap + manajemen exchange fiktif, kartu upgrade, profit/jam, daily combo/cipher | 300 juta+ registrasi; ~185 juta DAU puncak (Jun 2024) | Pasca-airdrop cliff besar — pelajaran utama: unlock token & retensi harus direncanakan sejak awal |
| **TapSwap, DROPEE, dll.** | Variasi tap + misi + league | Jutaan user | Evolusi ke mini-game, leaderboard tim, misi, koleksi |

**Formula retensi 2026 (pasca kematian tap-to-earn murni):**
1. Mekanik engagement loop: streak harian, misi, league/leaderboard, upgrade strategis.
2. Lapisan "pendapatan" yang **tidak bergantung pada hype token**: bagi hasil nyata / poin yang bisa dikonversi ke layanan.
3. Kanal distribusi murah: **Telegram Mini App** (onboarding nol-install) + PWA web.
4. Referral sebagai multiplier, bukan sumber pendapatan utama.

### 2.3 Vendor MLM Software (Standar Industri)

- Rencana kompensasi standar: **Binary, Unilevel, Matrix, Stairstep Breakaway, Generation, Monoline, Hybrid** (FlawlessMLM, Epixel, Infinite MLM, Exigo).
- Modul wajib: genealogy tree, commission engine, rank/qualification, wallet & payout queue, KYC (Sumsub dsb.), payment gateway (fiat + kripto).
- Estimasi biaya vendor jadi: paket launch ribuan dolar + bulanan; lisensi one-time mulai ~$699 (Infinite) hingga project-based (FlawlessMLM). **Membangun sendiri di Supabase+Vercel jauh lebih murah dan bisa dikontrol**, dengan konsekuensi: kita yang menjaga akurasi commission engine.

---

## 3. Anatomi Skema yang Runtuh vs yang Bertahan

### 3.1 Pola Ponzi "mining MLM" (dari studi kasus Power Mining Pool, Mining Up, ANTM, MAR Mining, Mining Memes)

1. Return tetap harian 1–3% (bahkan 730%/tahun) — **mustahil dari mining sungguhan**.
2. Komisi referral besar (15–20%) dan berjenjang dalam, **dibayar dari deposit baru**.
3. Tidak ada bukti on-chain/infrastruktur mining.
4. Klik tombol "auto mining" yang tidak melakukan apa-apa.
5. Paksaan reinvest, biaya withdrawal, kavling akun, ranking naik hanya dengan rekrut.
6. Kolaps saat rekrutmen kering → withdrawal dibekukan → situs hilang.

> Kutipan kunci (ChainUp, 2026): *"If the downline matters more than the hardware, new deposits are probably funding old payouts."*
> Kutipan kunci (Techei): *"A real mining operation earns from mining, while a scam earns from the next person's deposit."*

### 3.2 Ciri model yang bertahan (Bitdeer, GoMining, ECOS, NiceHash)

1. Pendapatan platform = **margin penjualan hashrate/aset + biaya layanan + fee marketplace**, terverifikasi.
2. Return **variabel** dan dipublikasikan (hashprice, biaya listrik, biaya layanan transparan).
3. Bukti operasional: live data center, laporan publik (perusahaan publik), spesifikasi on-chain (NFT GoMining).
4. Referral = **lapisan insentif opsional** dari margin, bukan mesin uang utama.
5. Ada jalur **likuiditas keluar** (marketplace sekunder / kontrak berakhir jelas) — menghilangkan kesan "uang terkunci selamanya".
6. Kepatuhan: badan usaha jelas, yurisdiksi jelas, KYC/AML.

---

## 4. Batasan Legal — Indonesia (Batas Merah Desain)

Sumber utama: UU 7/2014 Perdagangan · PP 29/2021 · **PP 3/2026** (revisi PP 29/2021) · Permendag 70/2019 · Permendag 32/2008 · ketentuan SIUPL (KBLI 47999) · pengawasan OJK/Satgas Waspada Investasi · APLI.

| Aturan | Isi | Konsekuensi desain |
|---|---|---|
| **PP 3/2026 Pasal 51 & 54** | SIUPL hanya untuk **barang berwujud**; pemasaran **jasa & produk investasi (termasuk kripto/komoditas berjangka) via penjualan langsung DILARANG** | Jangan pernah menjual "paket investasi mining" sebagai produk MLM ber-SIUPL di Indonesia |
| **Definisi Skema Piramida (Pasal 51A)** | Indikator fatal: biaya pendaftaran tidak wajar, kavling akun, bonus bersumber dari biaya rekrutmen, komisi tidak berbasis penjualan barang | Komisi hanya dari **omzet produk/layanan**; pendaftaran gratis/tanpa paket wajib; 1 akun = 1 identitas (KYC) |
| **Payout cap** | Total bonus/komisi maksimum **40%** (Permendag 32/2008) hingga batas verifikasi 60% (PP 29/2021) | Engine komisi di-hard-cap 35–40% |
| **Larangan lain** | Jual via marketplace; penghimpunan dana masyarakat; memaksa beli saat daftar | Onboarding gratis; produk dijual hanya di kanal resmi |
| **OJK & kripto** | Kripto = komoditas legal (diawasi OJK/Bappebti sejak UU P2SK), tapi **bukan objek direct selling** | Kripto dipakai sebagai **metode pembayaran/hadiah teknis**, bukan sebagai "produk investasi MLM"; hindari klaim "investasi" |
| **APLI & SIUPL** | Perusahaan MLM resmi wajib SIUPL + keanggotaan APLI, PT, kode etik, marketing plan | Jika suatu saat butuh entitas MLM Indonesia → wajib melalui jalur ini **dengan produk berwujud** (mis. hardware mining/merch) |

**Dua jalur strategis yang legal:**

- **Jalur A (direkomendasikan, global-first):** OSIDAC = **perusahaan teknologi / SaaS** dengan program *affiliate marketing* berjenjang dangkal (2–3 level). Produk = software & layanan mining (kontrak hashrate, bot, tool). Target pasar global; Indonesia sebagai pasar konsumen aplikasi (bukan "perusahaan MLM"). Tidak memerlukan SIUPL selama tidak menyelenggarakan penjualan langsung berjenjang dengan skema keanggotaan MLM khas Indonesia.
- **Jalur B (opsional, nanti):** bila ingin operasi MLM formal Indonesia → pisahkan entitas + produk **berwujud** (rig ASIC, hardware, merchandise, suplemen — dengan izin edar) memakai SIUPL/APLI, dan aplikasi mining menjadi *value-added service*, bukan produk MLM-nya.

---

## 5. Benchmark Angka Kompensasi (Basis Desain Plan)

| Komponen | Angka industri | Sumber rangkuman |
|---|---|---|
| Total payout ratio sehat | **35–45%** commissionable volume (ideal 40–45%) | MLM.com, Epixel, Direct Selling News |
| Retail/direct commission | 10–25% (produk digital bisa 20–30%) | Epixel, FlawlessMLM |
| Residual unilevel per level | 8%/6%/4%/2% (contoh umum L1–L4); 3–8% per level | FlawlessMLM |
| Binary pairing | 8–12% dari volume kaki lemah; balance rule 60/40 atau 70/30; cap 40–60% | FlawlessMLM, MLM.com |
| Fast-start bonus | 5–8% dari revenue, 30–90 hari pertama | Epixel |
| Referral cloud mining (pembanding nyata) | 3% (DeepHash/QFSCOIN), 3,5%+1,5% (2 level), 4,2% lifetime (AngelBTC), 5% (HashBeat/AutoHash), 8%+4% (BeMine), 2–6% (Bitdeer) | Kompilasi review 2025–2026 |
| Retensi YoY | Unilevel 40–60% vs Binary 20–35% | Data klien FlawlessMLM |

---

## 6. Kesimpulan Riset → Arah Produk

1. **Jangan bangun Ponzi berkedok mining.** Struktur pendapatan harus datang dari produk nyata (hashrate, software, fee).
2. **"Mining bot" terbaik** = gabungan: *gamified virtual miner* (akuisisi viral, gratis, hadiah kecil terkendali) + *real hashrate plans* (pendapatan sesungguhnya, hasil variabel).
3. **Skema jaringan** = Unilevel dangkal berbasis penjualan (komisi 3 level, total ≤ 35–40%), dengan binary opsional di masa depan — bukan deep matrix sejak hari pertama.
4. **Transparansi adalah fitur premium**: tampilkan formula hashprice, biaya, dan (bertahap) bukti on-chain.
5. **Indonesia**: aplikasi boleh dipasarkan, tetapi jangan pernah bermessaging "MLM investasi kripto". Gunakan kerangka "platform teknologi + program afiliasi".

Lanjut ke [02-BRAINSTORM-ARSITEKTUR.md](02-BRAINSTORM-ARSITEKTUR.md) untuk opsi arsitektur, atau [03-PLAN-CONCEPT-OSIDAC.md](03-PLAN-CONCEPT-OSIDAC.md) untuk konsep produk & skema.

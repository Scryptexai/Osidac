# 00 — Decision Log

> Keputusan produk yang sudah dikunci oleh pemilik. Semua dokumen wajib mengikuti log ini.

## 2026-10-17 — Putusan Konsep & Eksekusi Fase 0

| # | Keputusan | Status |
|---|---|---|
| 1 | **Nama produk/perusahaan: OSIDAC** (tetap, tidak ganti) | ✅ Dikunci |
| 2 | **Supabase: project baru `osidac`** (bukan `CIF`) | ✅ Dibuat — ref `qalnpcefixdzhdwbqzvj`, region ap-southeast-1 (Singapore), Postgres 17, plan free |
| 3 | **Badan usaha: sewa badan** (jasa agent PT/PSE — bukan PT baru dari nol) | ✅ Dikunci — tindakan user: pilih vendor agent (mis. penyedia jasa legalitas PT virtual/rental entity) untuk PSE Kominfo + akun payment gateway |
| 4 | **Paket waralaba 5 tier** (Rp49rb–Rp4,9jt / $3.49–$349.99) | ✅ Disetujui |
| 5 | **Target pasar: GLOBAL** (bukan Indonesia-only) | ✅ Dikunci — ekspansi kanal tetap tunduk pada kelayakan Midtrans dan review per negara; provider pembayaran/payout tunggal ditetapkan pada keputusan 18 Okt 2026 |
| 6 | **Bahasa: 2 bahasa — EN & ID** | ✅ Dikunci — i18n `/en` + `/id`, default EN (mengikuti Accept-Language) |

## 2026-10-18 — Update provider pembayaran

| Keputusan | Status |
|---|---|
| **Midtrans adalah satu-satunya provider top-up dan payout OSIDAC** | ✅ Dipilih; belum ada integrasi atau transaksi produksi |
| Top-up wallet IDR tersimpan vs pembayaran untuk tier/produk | ⏳ Perlu definisi produk dan review legal sebelum checkout |
| Tier mission-access matrix | ⏳ Usulan harus dikonfirmasi sebelum gating diaktifkan |

Keputusan ini menggantikan referensi provider ganda pada dokumen riset/arsitektur yang lebih lama. Harga publik, kanal, pajak, dan kelayakan merchant tidak dianggap sebagai tarif atau persetujuan kontrak OSIDAC.

## 2026-10-18 — Definisi katalog dan saldo

- **Interpretasi katalog saat ini:** lima tier adalah akses/upgrade digital untuk toko virtual di aplikasi, bukan mesin atau hardware fisik. Belum ada SKU perangkat, stok, pengiriman, atau garansi. Checkout tetap nonaktif.
- **Manfaat tier yang ditampilkan:** level toko virtual dan multiplier campaign OSID yang direncanakan. Multiplier belum terhubung ke OSID ledger atau inventory campaign aktif; jangan tampilkan sebagai OSID yang sudah diterima atau cash return.
- **KOIN lama:** pemilik memilih migrasi dengan formula yang disetujui, tetapi formula, tanggal efektif, cakupan saldo, sumber pendanaan, dan bukti approval belum diberikan. Sampai parameter itu terdokumentasi, jangan migrasikan atau cash-kan KOIN.
- **Hadiah KOIN toko/misi:** tetap poin internal non-tunai; tidak sama dengan OSID atau IDR.

## Konsekuensi teknis yang langsung dieksekusi
- Repo: Next.js 16 + Tailwind v4 skeleton dengan routing `[locale]` (en/id).
- Vercel: project `osidac` dibuat & terhubung ke GitHub `Scryptexai/Osidac`.
- Supabase: project `osidac` dibuat; draft skema di `supabase/migrations/0001_initial_schema.sql`.
- Integrasi pembayaran dan payout: keputusan terbaru memilih **Midtrans saja** untuk top-up dan payout. Integrasi belum live; definisi top-up, eligibility, kanal, tarif, dan kontrak harus diselesaikan sebelum transaksi produksi.

## Masih terbuka (tidak menghalangi coding)
- Vendor "sewa badan" spesifik (opsi user).
- Nama domain komersial (osidac.com / osidac.app — cek ketersediaan saat Fase 0).
- Harga final paket USD (tier di atas = placeholder komersial, bisa disetel).

# 00 — Decision Log

> Keputusan produk yang sudah dikunci oleh pemilik. Semua dokumen wajib mengikuti log ini.

## 2026-10-17 — Putusan Konsep & Eksekusi Fase 0

| # | Keputusan | Status |
|---|---|---|
| 1 | **Nama produk/perusahaan: OSIDAC** (tetap, tidak ganti) | ✅ Dikunci |
| 2 | **Supabase: project baru `osidac`** (bukan `CIF`) | ✅ Dibuat — ref `qalnpcefixdzhdwbqzvj`, region ap-southeast-1 (Singapore), Postgres 17, plan free |
| 3 | **Badan usaha: sewa badan** (jasa agent PT/PSE — bukan PT baru dari nol) | ✅ Dikunci — tindakan user: pilih vendor agent (mis. penyedia jasa legalitas PT virtual/rental entity) untuk PSE Kominfo + akun payment gateway |
| 4 | **Paket waralaba 5 tier** (Rp49rb–Rp4,9jt / $3.49–$349.99) | ✅ Disetujui |
| 5 | **Target pasar: GLOBAL** (bukan Indonesia-only) | ✅ Dikunci — konsekuensi: harga utama USD (IDR untuk pasar ID), gateway global (Stripe/Paddle) + lokal (Midtrans/Xendit), WD PayPal/bank/e-wallet |
| 6 | **Bahasa: 2 bahasa — EN & ID** | ✅ Dikunci — i18n `/en` + `/id`, default EN (mengikuti Accept-Language) |

## Konsekuensi teknis yang langsung dieksekusi
- Repo: Next.js 16 + Tailwind v4 skeleton dengan routing `[locale]` (en/id).
- Vercel: project `osidac` dibuat & terhubung ke GitHub `Scryptexai/Osidac`.
- Supabase: project `osidac` dibuat; draft skema di `supabase/migrations/0001_initial_schema.sql`.
- Monetisasi global: integrasi pembayaran direncanakan ganda (Paddle/Stripe untuk global, Xendit/Midtrans untuk ID) di Fase 2.

## Masih terbuka (tidak menghalangi coding)
- Vendor "sewa badan" spesifik (opsi user).
- Nama domain komersial (osidac.com / osidac.app — cek ketersediaan saat Fase 0).
- Harga final paket USD (tier di atas = placeholder komersial, bisa disetel).

# 08 — Usulan akses misi berdasarkan tier

> **Status: perlu persetujuan pemilik produk. Belum aktif.** Matriks ini adalah proposal untuk ditinjau, bukan harga/benefit checkout atau janji ketersediaan misi. Checkout Midtrans, misi partner, dan payout uang nyata belum aktif.

## Prinsip yang disarankan

- Semua akun tetap mendapat misi inti yang sudah ada: check-in, klaim toko, dan referral yang terverifikasi.
- Tier hanya menaikkan **batas akses** ke misi partner yang benar-benar tersedia; tier tidak menaikkan nilai reward, tidak menjamin jumlah offer, dan tidak menjanjikan penghasilan.
- Offer partner harus berasal dari inventory advertiser yang valid. Jangan membuat misi/reward fiktif untuk memenuhi jumlah slot.
- Pembelian tier tidak boleh menjadi syarat untuk mendaftar atau menerima saldo/payout yang sudah eligible. Model “membayar agar bisa mengejar payout” perlu review legal, perlindungan konsumen, dan persetujuan Midtrans sebelum diluncurkan.

## Matriks yang diusulkan untuk ditinjau

| Akses | Misi inti harian | Batas misi partner tambahan per hari | Maksimum misi claimable* |
|---|---:|---:|---:|
| Gratis / tanpa tier | 3 | 0 | 3 |
| Starter | 3 | 1 | 4 |
| Kios | 3 | 2 | 5 |
| Gold | 3 | 3 | 6 |
| Elite | 3 | 4 | 7 |
| Master | 3 | 5 | 8 |

\* Maksimum adalah batas akses, bukan janji bahwa seluruh slot selalu memiliki offer. Share link referral tetap opsional dan tidak dihitung sebagai misi berhadiah.

## Kondisi implementasi sebelum diaktifkan

1. Pemilik produk menyetujui atau mengubah matriks serta menjelaskan arti “misi tambahan” dan sumber inventory-nya.
2. Midtrans checkout/top-up didefinisikan, disetujui untuk model bisnis, dan hanya dianggap lunas setelah webhook valid serta idempotent.
3. `profiles.package_tier` ditulis hanya melalui proses server-side tepercaya; klien tidak boleh menaikkan tier sendiri. Migration `0006_midtrans_only_tier_integrity.sql` menutup update tier langsung dari role authenticated.
4. Katalog misi memiliki tier minimum, sumber dana, batas frekuensi, masa berlaku, validasi partner, dan status inventory. Klaim misi baru diverifikasi di RPC/server; menyembunyikan kartu di browser bukan enforcement.
5. RPC status mengembalikan hanya misi yang eligible; RPC claim memeriksa tier current, jumlah klaim harian, validasi offer, idempotency, dan ledger secara atomik. Tier downgrade/refund/chargeback harus mengubah hak akses di server.
6. Reward misi partner hanya boleh dikreditkan setelah konfirmasi/settlement sesuai kontrak. Reward KOIN saat ini tetap non-tunai; OSID belum diterbitkan dan tidak boleh dianggap saldo tunai.

## Kondisi kode saat ini

RPC `get_daily_mission_status` dan `claim_daily_mission` hanya menyediakan check-in dan referral; klaim toko tercatat dari event toko. Belum ada katalog offerwall/partner dan belum ada tier gate pada RPC. Karena matriks belum disetujui dan inventory belum tersedia, lock-card/upgrade button tidak boleh ditampilkan seolah transaksi tier sudah bisa dilakukan.

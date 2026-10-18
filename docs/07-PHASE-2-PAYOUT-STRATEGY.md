# 07 — Strategi Midtrans untuk Top-up dan Payout OSIDAC

> **Status: keputusan provider, 18 Oktober 2026.** Midtrans adalah satu-satunya provider yang dipilih untuk top-up dan payout OSIDAC. Pemilihan ini belum berarti kontrak, kelayakan merchant, integrasi, atau transaksi produksi sudah aktif. Tidak ada transaksi live yang dijalankan oleh kode atau dokumen ini. Ini bukan nasihat hukum atau pajak.

## 1. Keputusan dan batas produk

1. **Provider tunggal: Midtrans.** Jangan menambah fallback ke Xendit, DOKU, Duitku, atau provider lain tanpa keputusan baru dari pemilik produk.
2. **Mulai dari IDR dan kanal yang benar-benar disetujui.** Halaman publik Midtrans menampilkan transfer ke rekening bank dan GoPay pada bagian payout/withdrawal. Ketersediaan kanal untuk akun OSIDAC, batas nominal, cara pendanaan, dan jenis API yang tepat harus dikonfirmasi tertulis sebelum muncul sebagai opsi aktif di UI.
3. **Top-up masih perlu definisi produk.** “Top-up” bisa berarti pembayaran untuk membeli tier/produk, atau menambah saldo IDR yang dapat disimpan dan ditarik. Keduanya berbeda secara ledger, refund, perlindungan konsumen, dan kemungkinan regulasi. Sampai definisinya disetujui, jangan mengkredit saldo tunai yang dapat ditarik. `OSID Coins` saat ini adalah poin aplikasi tanpa nilai tunai dan tidak dapat dicairkan.
4. **Payout hanya dari dana eksternal yang sudah settle.** Jangan menggunakan deposit atau pembelian anggota baru untuk membayar withdrawal/komisi anggota lain. Nilai checkout bukan otomatis laba atau sumber reward; paling jauh hanya margin bersih setelah pemenuhan, fee, pajak, refund/chargeback, dan cadangan—serta setelah model bisnis disetujui penasihat hukum dan provider.
5. **Batas distribusi 70% adalah plafon, bukan target/garansi.** Semua reward/komisi dan seluruh biaya payout harus masuk perhitungan. Cap komisi jaringan 40% adalah bagian dari plafon tersebut, bukan tambahan 40% di atas 70%. Definisi denominator dan biaya final perlu persetujuan finance.
6. **Belum ada minimum WD final.** Tentukan setelah tarif kontrak, pajak, percobaan gagal, reserve, dan volume aktual diketahui. Jangan menjanjikan payout instan atau waktu selesai sebelum ada SLA tertulis dan hasil pengujian.

## 2. Sumber dana yang dapat dipertimbangkan

| Sumber | Baru eligible setelah | Jangan hitung |
|---|---|---|
| Misi partner / playtime | Postback sah, deduplikasi berhasil, validasi partner selesai, settlement diterima, dan reserve clawback/refund dihitung | Callback awal, status pending, estimasi CPM, atau saldo dashboard yang belum settle |
| Iklan | Laporan jaringan cocok dengan kas yang diterima dan potongan final diketahui | Tayangan/klik estimasi atau pendapatan yang belum dibayar |
| Penjualan tier/produk | Barang/jasa dipenuhi; seluruh biaya, pajak, refund, chargeback, dan kewajiban lain dicadangkan; ada persetujuan legal | Gross checkout, uang titipan fulfillment, atau pembelian anggota yang dipakai membayar WD anggota lain |
| Referral | Hanya dari revenue eksternal eligible yang sama dan comp-plan yang telah disetujui | Komisi hanya karena merekrut, mendaftar, atau membeli tier |

Jangan gunakan `reward_pool_daily` sebagai angka ramalan. Tutup setiap periode dari statement settlement dan rekening/sumber dana, lalu rekonsiliasi. Jika revenue bersih turun atau reversal naik, reward dapat turun atau berhenti; jangan membuat KOIN seolah-olah setara rupiah.

### Batas ekonomi yang dipakai sebagai guardrail

- `net_eligible_revenue` = pendapatan eksternal yang telah settle, setelah reversal/refund, collection fee, pajak/cadangan pajak, biaya pemenuhan langsung, dan reserve yang disetujui.
- `distribution_budget` = nilai minimum antara `floor(net_eligible_revenue × 70%)` dan `max(0, kas tersedia − reserve kas wajib)`.
- `network_commission_cap` = paling tinggi `distribution_budget × 40%`, sebagai bagian dari budget di atas.
- `total payout debit` = pokok yang diterima + fee payout + pajak fee + fee percobaan gagal yang benar-benar dikenakan.
- Budget harus menutup seluruh debit, bukan hanya pokok yang diterima anggota.

Reserve kas belum ditentukan karena data refund, chargeback, settlement delay, dan runway aktual belum tersedia. Jangan mengisi nilai reserve dengan tebakan; catat alasan dan pemilik persetujuan saat diputuskan.

## 3. Harga publik Midtrans — referensi, bukan tarif kontrak OSIDAC

Halaman [Midtrans Pricing](https://midtrans.com/pricing) yang diperiksa 18 Oktober 2026 menampilkan biaya payout/withdrawal rekening bank **Rp5.000 per transaksi**. Angka GoPay berbeda pada dua bagian halaman yang berhasil dibaca: **Rp1.000** pada teks berbahasa Indonesia “Payouts atau disbursement”, dan **Rp2.500** pada tabel “Withdrawal”. Karena ruang lingkup produk, pajak, serta tarif GoPay yang berlaku untuk akun/API OSIDAC belum dikonfirmasi, kedua angka GoPay ditampilkan sebagai skenario alternatif, bukan satu fee schedule.

### Perbandingan biaya pokok sebelum pajak

| Pokok | Bank — Rp5.000 | GoPay — Rp1.000 (teks ID) | GoPay — Rp2.500 (tabel Withdrawal) |
|---:|---:|---:|---:|
| Rp50.000 | 10,00% | 2,00% | 5,00% |
| Rp100.000 | 5,00% | 1,00% | 2,50% |
| Rp250.000 | 2,00% | 0,40% | 1,00% |
| Rp500.000 | 1,00% | 0,20% | 0,50% |
| Rp1.000.000 | 0,50% | 0,10% | 0,25% |

Semua rasio di atas **sebelum pajak** dan hanya mengilustrasikan tarif publik. Tarif kontrak OSIDAC, perlakuan PPN/PPh, biaya setiap attempt gagal, biaya pendanaan, dan status fee ketika payout ditolak belum dikonfirmasi. Jangan gunakan tabel ini sebagai janji harga atau minimum WD.

Simulator hanya menghitung pokok + fee publik sebelum pajak dan mempertahankan skenario GoPay yang berbeda secara terpisah. Ia tidak menghubungi Midtrans, tidak mengirim uang, dan tidak mengasumsikan tax/retry fee:

```bash
npm run test:economy
node scripts/payout-simulator.mjs 250000
```

Sebelum memakai tarif dalam kalkulasi produksi, ganti referensi publik dengan quotation/kontrak Midtrans dan input pajak serta biaya retry yang sudah disetujui finance.

## 4. Yang wajib dikonfirmasi ke Midtrans

Minta jawaban tertulis untuk:

- Kelayakan kategori usaha dan alur OSIDAC: pembayaran top-up/tier, penahanan saldo, serta payout kepada pengguna akhir.
- Apakah produk yang akan digunakan adalah Midtrans Payouts/Disbursement (termasuk Iris bila berlaku) dan apakah akun OSIDAC memenuhi syarat.
- Model pendanaan yang tersedia (aggregator/prefund atau facilitator/rekening bisnis), saldo minimum, settlement, limit, beneficiary inquiry, dan approval maker-checker.
- Kanal yang disetujui untuk OSIDAC, termasuk bank dan GoPay, daftar bank/e-wallet yang benar-benar aktif, minimum/maksimum, biaya sukses, biaya gagal/retry, biaya pendanaan, pajak, dan SLA.
- Alur API, signature/webhook, status terminal, idempotency/reference yang didukung, reversal, report rekonsiliasi, sandbox, serta prosedur support/dispute.
- Untuk top-up: apakah yang dijual adalah paket/produk atau saldo IDR tersimpan; aturan settlement, refund, expiry, dan larangan penggunaan dana.

Dokumentasi Midtrans menjelaskan model aggregator dengan dana prefund pada balance Midtrans dan facilitator dengan rekening partner sebagai sumber dana. Jangan memilih salah satu model atau mengasumsikan fee tabel berlaku pada endpoint tertentu sebelum konfirmasi provider.

## 5. Kebijakan pilot yang diusulkan

- Pilot tertutup dan IDR saja. Tidak ada kanal payout yang tampil sebagai tersedia sebelum kontrak, sandbox, dan eligibility merchant dikonfirmasi.
- Mulai dengan batch mingguan agar finance bisa memeriksa fraud, saldo sumber, dan rekonsiliasi. Batch tidak otomatis menurunkan fee per penerima; hanya kontrak provider yang dapat membuktikannya.
- Tentukan minimum payout dari biaya all-in dan batas biaya yang disetujui, bukan dari angka teknis semata. Jika subsidi fee diperlukan, ungkapkan dan masukkan ke plafon distribusi; jangan memotong saldo penerima diam-diam.
- Cocokkan nama pemilik rekening/wallet dengan kebijakan provider dan kewajiban KYC. Kumpulkan data pribadi minimum; jangan meminta atau menyimpan NIK/foto KTP tanpa dasar, tujuan, persetujuan, kontrol akses, dan masa simpan yang jelas.
- Sebelum konfirmasi, tampilkan pokok, fee/pajak, waktu proses estimasi, dan syarat WD. Klaim waktu hanya boleh sesuai SLA tertulis.

## 6. Kontrol teknis sebelum payout produksi

1. Server memeriksa sumber dan saldo `withdrawable_idr`, batas periode, hold, KYC/risk gate, rekening tujuan, minimum/maksimum, kas sumber, serta budget yang belum terpakai.
2. Dalam transaksi database, reserve pokok dan fee maksimum yang disetujui; buat withdrawal dan ledger entries dengan referensi unik. Klien tidak boleh menulis saldo atau status transaksi.
3. Server mengirim payout memakai secret di secret manager/server. Pada timeout, status menjadi unknown/pending; cari hasil dengan referensi yang sama dan jangan membuat payout kedua.
4. Verifikasi webhook sesuai spesifikasi Midtrans, deduplikasi event, dan cocokkan referensi, penerima, nominal, serta mata uang sebelum mengubah status/ledger.
5. Payout sukses memfinalisasi reserve. Gagal/ditolak melepaskan reserve melalui reversal yang dapat diaudit; fee yang benar-benar ditagih dicatat sebagai expense. Status pending tidak boleh di-retry otomatis.
6. Rekonsiliasi harian antara ledger, report/API Midtrans, dan rekening/sumber kas. Mismatch, payout tak dikenal, saldo reserve kurang, atau pool negatif harus menghentikan payout baru dan membuka alert/audit.

Skema `withdrawals` yang ada baru menyimpan status dasar dan `provider_ref`; skema itu belum mencakup idempotency, reserve, event dedupe, atau rekonsiliasi finance. Perlu desain migrasi/API server-side tersendiri sebelum sandbox. Dokumen ini tidak mengaktifkan payout atau mengubah database produksi.

## 7. Stop/go gates

### Gate A — legal, entitas, dan persetujuan Midtrans

- Penasihat hukum memberi klasifikasi tertulis atas aliran dana, komisi, penjualan tier, refund, perlindungan konsumen, dan kemungkinan kewajiban izin BI. PBI BI 10/2025 berlaku sejak 31 Maret 2026; penerapannya pada model spesifik OSIDAC harus dianalisis secara profesional.
- Entitas sewa yang dipakai mengizinkan kegiatan OSIDAC; NIB/KBLI, pendaftaran PSE, ToS, privasi/retensi, refund, pajak, dan prosedur keluhan sesuai.
- Midtrans menyetujui tertulis kategori usaha, tujuan pembayaran, sumber dana, penerima, KYC/KYB/AML, kanal, dan flow payout. Provider berizin tidak otomatis menyelesaikan kewajiban izin OSIDAC.
- Akuntan menyetujui pengakuan revenue, invoice, PPN/PPh, reserve, dan pencatatan biaya payout.

### Gate B — bukti ekonomi dan ketersediaan kas

- Setiap sumber punya kontrak, tarif aktual, jadwal settlement, jendela refund/clawback, dan statement yang dapat direkonsiliasi.
- Finance menyetujui net eligible revenue, reserve, sumber kas, batas biaya, minimum WD, batas harian, dan pemilik kill switch.
- 100% payout dibiayai uang yang telah diterima/dipegang sesuai kontrak, bukan saldo anggota baru atau receivable yang belum settle.

### Gate C — sandbox dan kontrol

Uji sukses, tujuan invalid, timeout setelah request diterima, request duplikat, webhook duplikat/out-of-order, status pending lama, reversal, nominal/mata uang mismatch, dan retry setelah status terminal. Uji secret storage, RLS/role, approval, audit, rate limit, kill switch, serta rekonsiliasi tanpa selisih yang tak terjelaskan.

### Gate D — internal lalu beta tertutup

Mulai dari nominal uji pada rekening bisnis yang dikendalikan OSIDAC, sesuai kontrak. Setelah audit internal, beta kecil harus memiliki exposure limit, support, appeal/refund rules, dan kill switch. Exit beta mensyaratkan sedikitnya 50 WD berhasil, rekonsiliasi harian 100%, tanpa payout ganda/selisih tak terjelaskan, total debit termasuk fee ≤ plafon distribusi, serta waktu proses sesuai SLA. Pembukaan publik memerlukan persetujuan eksplisit finance/legal/security.

## 8. Urutan implementasi tanpa langkah sirkular

1. **Definisikan produk top-up dan minta persetujuan Midtrans.** Putuskan apakah top-up berarti pembayaran tier/produk atau saldo tunai tersimpan. Dapatkan eligibility, endpoint, kanal, pricing, pajak, retry, settlement, dan SLA tertulis.
2. **Selesaikan Gate A–B.** Pastikan entitas/legal/tax sesuai, ada revenue eksternal settle, dan finance menyetujui budget/reserve. Jika belum, jangan membuka pembayaran tunai atau payout pengguna.
3. **Bangun integrasi sandbox terlebih dahulu.** Simpan sandbox secrets secara server-side; buat tabel/order/withdrawal dan API yang idempoten; terapkan webhook dan rekonsiliasi. Jangan konfigurasi production secret.
4. **Jalankan seluruh Gate C di sandbox, lalu uji internal.** Perbaiki seluruh mismatch dan dokumentasikan hasil. Minta persetujuan beta tertutup hanya setelah Gate C lulus.
5. **Aktifkan beta tertutup dengan persetujuan Gate D.** Gunakan batas exposure dan kill switch. Setelah exit beta serta persetujuan finance/legal/security, baru pertimbangkan production credential dan payout publik. Production tetap OFF sampai saat itu.

Langkah 5 tidak mensyaratkan production untuk menguji sandbox: sandbox dibangun dan diuji pada langkah 3–4, sedangkan production hanya boleh dipertimbangkan setelah seluruh gerbang terpenuhi.

## 9. Sumber resmi

- [Midtrans Pricing](https://midtrans.com/pricing) — referensi harga publik; halaman memuat angka payout bank Rp5.000 serta dua nilai GoPay berbeda (Rp1.000 pada teks ID dan Rp2.500 pada tabel Withdrawal). Diperiksa 18 Okt 2026; konfirmasi kontrak, pajak, dan endpoint.
- [Midtrans Payouts / Disbursement Overview](https://docs.midtrans.com/docs/disbursement-overview) — gambaran API dan model aggregator/facilitator; verifikasi onboarding dan fitur akun OSIDAC.
- [Bank Indonesia — PBI No. 10 Tahun 2025](https://www.bi.go.id/id/publikasi/peraturan/Pages/PBI_102025.aspx) — berlaku 31 Maret 2026; minta analisis hukum terhadap model spesifik OSIDAC.
- [JDIH Komdigi — PP No. 71 Tahun 2019](https://jdih.komdigi.go.id/produk_hukum/view/id/695/t/peraturan+pemerintah+nomor+71+tahun+2019) dan [portal PSE Lingkup Privat](https://pse.komdigi.go.id/) — rujukan sistem elektronik; kategori dan status OSIDAC harus dikonfirmasi.

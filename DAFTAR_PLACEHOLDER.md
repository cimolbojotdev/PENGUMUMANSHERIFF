# Daftar Placeholder & Kegunaannya

File ini berisi daftar seluruh placeholder yang digunakan di website pengumuman statik
Roxwood Sheriff Department. Gunakan file ini sebagai referensi kalau kamu ingin
menambah template atau field baru.

---

## 1. Placeholder `{{ }}` di dalam Body Template

Template menggunakan sintaks `{{key}}` di dalam teks `body`. Saat preview, `{{key}}`
akan diganti dengan isi input user, atau tampil sebagai `[KEY]` bila kosong.

> Catatan: Daftar di bawah (`placeholders` di `src/data/templates.js`) adalah daftar
> bawaan lama. Sebagian besar (`{{tanggal}}`, `{{nomor}}`) belum dipakai di body mana pun.
> Field yang benar-benar dipakai ada di bagian 2.

| Placeholder     | Arti        | Kegunaan                                  | Dipakai di body? |
|-----------------|-------------|-------------------------------------------|------------------|
| `{{tanggal}}`   | Tanggal     | Tanggal kejadian pengumuman               | Belum            |
| `{{jam}}`       | Jam         | Waktu kejadian / jam layanan              | Ya (field `jam`) |
| `{{nama}}`      | Nama        | Nama suspect / orang terkait             | Ya (field `nama`)|
| `{{nomor}}`     | Nomor       | Nomor referensi / laporan                 | Belum            |
| `{{lokasi}}`    | Lokasi      | Tempat kejadian                           | Ya (field `lokasi`)|
| `{{keterangan}}`| Keterangan  | Catatan tambahan / alasan siaga           | Ya (field `keterangan`)|

---

## 2. Field Key per Template (yang benar-benar dipakai)

Setiap template punya `fields` dengan `key`, `label`, dan `placeholder`.
Ini daftar `key` beserta kegunaannya:

| Key              | Label                  | Kegunaan                                          | Contoh placeholder            |
|------------------|------------------------|---------------------------------------------------|-------------------------------|
| `topik`          | Topik Panduan          | Topik tutorial internal                           | Contoh: radio                 |
| `warung`         | Lokasi Warung          | Pilih lokasi warung (dropdown)                    | Pilih lokasi warung           |
| `kendaraan`      | Kendaraan Suspect      | Jenis/kendaraan yang dikejar                       | Contoh: Sultan RS hitam       |
| `arah`           | Arah Pengejaran        | Arah pengejaran suspect                            | Contoh: menuju Utara ...      |
| `jumlah`         | Jumlah Suspect         | Jumlah pelaku/suspect                              | Contoh: 2 orang               |
| `hasil`          | Hasil                  | Hasil kejadian/pengejaran                          | Contoh: Suspect tertangkap    |
| `lokasi`         | Lokasi                 | Tempat kejadian                                    | Contoh: Jalan Utama Roxwood   |
| `bank`           | Nama Bank              | Nama bank yang dirampok                            | Contoh: Fleeca Roxwood        |
| `status`         | Status                 | Status terkini/negosiasi                           | Contoh: Negosiasi berjalan    |
| `tuntutan`       | Tuntutan Suspect       | Tuntutan pelaku                                    | Contoh: Kendaraan getaway     |
| `jam`            | Jam Layanan / Penutupan| Jam layanan dibuka/tutup                           | Contoh: 19.00                 |
| `isi`            | Isi Pengumuman         | Isi pengumuman layanan                             | Contoh: Layanan diperpanjang  |
| `korban`         | Jumlah Korban          | Jumlah korban penembakan                           | Contoh: 1 warga sipil         |
| `jumlah_sandera` | Jumlah Sandera         | Jumlah sandera                                     | Contoh: 2 orang               |
| `jumlah_suspect` | Jumlah Suspect         | Jumlah suspect penyanderaan                        | Contoh: 3 orang               |
| `arahan`         | Arahan Komando         | Arahan taktis komando                              | Contoh: Breaching pintu belakang|
| `alasan`         | Alasan                 | Alasan pengejaran / lockdown                       | Contoh: Menolak berhenti      |
| `posisi`         | Posisi Terkini         | Posisi pengejaran terkini                          | Contoh: Highway arah Sandy    |
| `keterangan`     | Keterangan             | Keterangan siaga                                   | Contoh: event besar           |
| `nama`           | Nama Suspect           | Nama DPO / suspect                                 | Contoh: John Doe              |
| `ciri`           | Ciri-ciri              | Ciri fisik suspect                                 | Contoh: jaket hitam, masker   |
| `kasus`          | Kasus                  | Kasus terkait DPO                                  | Contoh: perampokan bank       |

---

## 3. Cara Menambah Placeholder / Field Baru

1. Buka `src/data/templates.js`.
2. Tambahkan object ke array `templates`, atau tambahkan field ke `fields` template yang ada:
   ```js
   fields: [
     { key: 'nama_field', label: 'Label Tampilan', placeholder: 'Contoh: ...' },
     // untuk dropdown:
     { key: 'pilihan', label: 'Pilihan', type: 'select', placeholder: 'Pilih ...', options: ['A', 'B'] }
   ]
   ```
3. Gunakan `{{nama_field}}` di dalam `body` agar otomatis terganti saat preview.
4. Bila `placeholder` tidak diisi, website akan otomatis menampilkan
   `Contoh: [Label]` sebagai hint (sudah diatur di `src/App.jsx`).
5. Kalau butuh placeholder global baru (seperti `{{tanggal}}`), tambahkan ke array
   `placeholders` dan pastikan ada field dengan `key` yang sama di template terkait.

---

## 4. Kategori Template

`Tutorial`, `Perampokan`, `Layanan Sheriff`, `Kerusuhan & Penembakan`, `Code 0`,
`Penyanderaan`, `Pengejaran Suspect`, `Siaga`, `Lain-lain`

Setiap kategori bisa punya submenu lewat `templateNavigation`
(contoh: Perampokan → Status Warung / Pursuit / Perampokan Bank).

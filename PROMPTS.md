# PROMPTS.md — Prompt bertahap untuk vibe coding "Filmku"

Cara pakai:
1. Taruh `CLAUDE.md` di root folder project (`filmku/`). Claude Code akan membacanya otomatis;
   di tool lain, tempel isinya di awal sesi atau sebutkan "baca CLAUDE.md".
2. Kirim prompt **satu per satu, berurutan**. Jangan lanjut sebelum langkah sebelumnya jalan
   dan `npm run build` sukses.
3. Setiap akhir langkah, Claude harus memperbarui checklist di bagian 12 CLAUDE.md.
4. Jangan tempel API key atau token ke chat. Isi hanya ke file `.env` dan Environment Variables Vercel.

---

## Persiapan manual (sekali saja, oleh Anda)

1. Pastikan Node.js LTS terpasang (`node -v`).
2. Buat project Supabase, lalu salin **Project URL** dan **anon public key** (Settings > API).
3. Buat folder `filmku/`, taruh `CLAUDE.md` di dalamnya, buat file `.env`:
   ```
   TMDB_API_KEY=isi_key_tmdb_v3_anda
   VITE_SUPABASE_URL=isi_url_supabase
   VITE_SUPABASE_ANON_KEY=isi_anon_key_supabase
   ```
4. Buat repo GitHub (pastikan `.env` ada di `.gitignore`).

---

## PROMPT 0 — Kunci konteks (kirim pertama, tanpa coding)

```
Baca CLAUDE.md di root project secara lengkap. Jangan menulis kode dulu.

Tugas:
1. Ringkas dengan kata-katamu sendiri: tujuan proyek, stack, 7 aturan keras (bagian 3),
   dan arti "siap menonton" (bagian 8), maksimal 12 baris.
2. Sebutkan hal yang menurutmu ambigu atau berisiko. Jika tidak ada, tulis "tidak ada".
3. Tunggu aku bilang "mulai langkah 1".

Aturan kerja selama proyek ini: kerjakan hanya satu langkah per perintah, jangan menambah
fitur di luar CLAUDE.md, jangan pernah menulis API key ke kode atau file .md, dan jangan
membuat pemutar video dari sumber tidak resmi.
```

---

## PROMPT 1 — Setup project dan proxy TMDB

```
Mulai langkah 1 dari CLAUDE.md: setup project dan proxy TMDB.

Lakukan:
- Inisialisasi project Vite + React (JavaScript) di folder ini, pasang dependency sesuai
  CLAUDE.md bagian 2 (react-router-dom, @tanstack/react-query, tailwindcss v4 + @tailwindcss/vite,
  lucide-react, @supabase/supabase-js).
- Buat struktur folder sesuai bagian 9.
- Buat api/tmdb/[...path].js sesuai bagian 6 (key dari process.env.TMDB_API_KEY, whitelist path,
  header cache) dan proxy dev di vite.config.js yang membaca TMDB_API_KEY dari .env.
- Buat src/lib/tmdb.js: fungsi tmdb(path, params) (default language=id-ID) dan helper img(path, size).
- Buat .env.example (nilai kosong), .gitignore (termasuk .env), vercel.json.
- Buat halaman sementara yang memanggil search/multi?query=Doctor-X dan menampilkan judul +
  poster hasil pertama, hanya untuk verifikasi.

Selesai bila: npm run dev berjalan, halaman sementara menampilkan hasil Doctor-X, dan
npm run build sukses. Pastikan key tidak muncul di kode klien atau di network tab browser.
Perbarui checklist CLAUDE.md. Jangan mulai langkah 2.
```

## PROMPT 2 — Tema, layout, bottom navbar liquid glass

```
Mulai langkah 2: tema, layout, dan bottom navbar.

Ikuti CLAUDE.md bagian 4 dan 5:
- index.css: token warna, latar gradasi gelap-biru + radial glow, kelas .glass (lengkap dengan
  highlight spekular ::before dan prefix -webkit-), font Plus Jakarta Sans.
- App shell: container max-width 480px di tengah, padding-bottom ≥112px.
- Komponen BottomNav sesuai spesifikasi: pil glass melayang di bawah, 5 tab
  (Home, Cari, Simpan, Riwayat, Profil) dengan ikon lucide + label, gelembung kaca aktif yang
  bergeser dengan transform translateX, safe-area iOS.
- Router dengan 5 rute placeholder (judul halaman saja) + /detail/:type/:id + /masuk.

Selesai bila: navbar tampil di bawah seperti navbar aplikasi mobile, gelembung berpindah halus
saat ganti tab, tampilan baik di lebar 360–430px, dan npm run build sukses.
Perbarui checklist. Jangan mulai langkah 3.
```

## PROMPT 3 — Halaman Home

```
Mulai langkah 3: halaman Home.

- Header "Beranda" dengan tombol bulat glass yang membuka /cari.
- Komponen Chips (glass; yang aktif pil biru solid): Trending, Drama Jepang, Film Jepang, Anime,
  memakai endpoint di CLAUDE.md bagian 6.
- Kartu pertama berukuran besar (FeaturedCard: backdrop/poster lebar, badge glass untuk rating,
  judul, tahun · jenis), sisanya grid 2 kolom PosterCard. Semua kartu menuju /detail/:type/:id.
- React Query dengan staleTime 5 menit, skeleton loading, state error + tombol coba lagi.
- Footer atribusi TMDB sesuai aturan 6 (teks dulu; logo bila sudah kuunduh dari brand assets TMDB).
- Untuk trending/all, saring hanya media_type movie dan tv.

Selesai bila: berpindah chip mengganti daftar tanpa reload, tidak ada layout shift besar,
build sukses. Perbarui checklist. Jangan mulai langkah 4.
```

## PROMPT 4 — Cari

```
Mulai langkah 4: halaman Cari.

- SearchBar glass dengan ikon, tombol hapus, autofocus, debounce 400ms.
- Memakai search/multi, saring hanya movie dan tv, tampilkan grid PosterCard + badge jenis
  dan tahun. Keadaan: kosong awal (saran: "Coba cari Doctor-X"), tidak ada hasil, loading, error.
- Simpan query di URL (?q=) agar tombol back tetap mempertahankan pencarian.

Selesai bila: mencari "Doctor-X" menampilkan serialnya, mengetuk kartu membuka halaman detail,
build sukses. Perbarui checklist. Jangan mulai langkah 5.
```

## PROMPT 5 — Detail (trailer dan di mana menonton)

```
Mulai langkah 5: halaman Detail, sesuai CLAUDE.md bagian 5 dan 8.

- Satu request: {type}/{id}?append_to_response=credits,videos,watch/providers,recommendations.
- Fallback sinopsis: bila overview id-ID kosong, ambil ulang dengan language=en-US.
- Hero backdrop dengan gradasi gelap ke latar, tombol kembali bulat glass, judul, tahun, rating,
  durasi (movie) atau jumlah musim/episode (tv), genre sebagai chip glass.
- Sinopsis (bisa diperluas), pemeran utama (baris horizontal), rekomendasi ("Mirip").
- Trailer: pilih video YouTube type=Trailer (utamakan ja/en), tampilkan thumbnail + tombol putar;
  iframe youtube-nocookie dimuat hanya setelah ditekan.
- Di mana menonton: logo provider (flatrate dulu, lalu rent/buy) untuk ID → JP → US, tombol
  membuka link TMDB, atribusi JustWatch. Bila kosong, tampilkan pesan sesuai bagian 8.
- Tombol Simpan, Tandai ditonton, dan input progres dibuat sebagai komponen tampilan dulu
  (belum tersambung database; tampilkan "Masuk untuk menyimpan" bila belum login).

Selesai bila: halaman Doctor-X menampilkan semua bagian tanpa error, build sukses.
Perbarui checklist. Jangan mulai langkah 6.
```

## PROMPT 6 — Supabase dan login

```
Mulai langkah 6: Supabase dan login.

- src/lib/supabase.js memakai VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY. Jangan pernah
  memakai service_role.
- Berikan aku file supabase/schema.sql berisi SQL dari CLAUDE.md bagian 7 (tabel + RLS + policy)
  untuk kutempel di SQL Editor Supabase. Jangan menjalankannya sendiri.
- hooks/useAuth.js (session, signIn, signOut, onAuthStateChange) dan AuthProvider.
- Halaman /masuk bergaya glass: email + password, pesan error jelas dalam bahasa Indonesia.
- Rute /simpan, /riwayat, /profil dilindungi: bila belum login, arahkan ke /masuk lalu kembali.
- Halaman Profil: tampilkan email dan tombol Keluar.
- Tulis di README singkat: langkah membuat akun pertama dan mematikan sign-ups di Supabase.

Selesai bila: aku bisa masuk dan keluar, rute terlindungi bekerja, build sukses.
Perbarui checklist. Jangan mulai langkah 7.
```

## PROMPT 7 — Simpan, Riwayat, progres

```
Mulai langkah 7: watchlist, riwayat, dan progres menonton.

- hooks/useWatchlist.js dan hooks/useHistory.js dengan React Query + supabase-js
  (optimistic update untuk toggle simpan).
- Detail: tombol Simpan (toggle), Tandai ditonton (toggle watched), input "terakhir sampai
  menit ke-…" (angka, ≥0) dan untuk serial musim + episode. Upsert ke history dengan debounce
  800ms; simpan juga title dan poster_path agar daftar tidak perlu fetch ulang ke TMDB.
- /simpan: grid kartu watchlist, geser/tombol untuk menghapus, state kosong.
- /riwayat: daftar terurut updated_at terbaru; tiap item menampilkan poster kecil, judul,
  "Menit ke-N" (atau "S1 E3 · menit N"), tanggal relatif ("2 hari lalu"), label Ditonton;
  tombol "Lanjutkan" membuka detail. Tersedia filter: Semua / Sedang / Selesai.
- Semua aksi gagal harus memunculkan toast error, bukan gagal diam-diam.

Selesai bila: data bertahan setelah refresh dan tampil sama di perangkat lain dengan akun
yang sama, build sukses. Perbarui checklist. Jangan mulai langkah 8.
```

## PROMPT 8 — Poles dan deploy

```
Mulai langkah 8: poles dan deploy ke Vercel.

- Audit visual: konsistensi token, kontras teks di atas glass, area sentuh ≥44px, animasi
  halus dengan dukungan prefers-reduced-motion, performa (lazy-load gambar, batasi elemen blur).
- Tambahkan meta theme-color, favicon sederhana, title per halaman.
- Pastikan .env tidak ter-commit dan tidak ada key di bundle: jalankan build lalu cari string
  key di folder dist (hasil harus kosong).
- Tulis README: cara menjalankan lokal, variabel lingkungan, cara deploy.
- Beri aku daftar langkah deploy: push ke GitHub, import di Vercel, isi 3 Environment Variables,
  redeploy, lalu tes /api/tmdb/search/multi?query=Doctor-X dan alur login di URL produksi.

Selesai bila: semua item checklist CLAUDE.md tercentang dan build produksi sukses.
```

---

## Prompt bantu

**Perbaiki bug**
```
Ada bug: [jelaskan apa yang terjadi, di halaman mana, apa yang diharapkan].
Pesan error / screenshot: [tempel].
Cari akar masalahnya dulu dan jelaskan singkat, lalu perbaiki dengan perubahan sekecil mungkin.
Jangan mengubah desain atau fitur lain. Jalankan npm run build setelahnya.
```

**Penguncian di akhir sesi (agar sesi berikutnya tetap sinkron)**
```
Akhiri sesi ini. Perbarui CLAUDE.md bagian 12: centang langkah yang selesai, tulis "Catatan
keputusan/bug terbaru" (maks 6 baris: apa yang berubah, file penting, hal yang belum selesai).
Jangan mengubah bagian 1–11 kecuali kuminta. Tampilkan diff-nya.
```

**Audit kepatuhan (jalankan sebelum deploy)**
```
Audit repo terhadap aturan keras CLAUDE.md bagian 3. Untuk tiap aturan (1–8), tulis LULUS/GAGAL
dengan bukti file dan baris. Cari khusus: API key di kode atau dist, service_role, tabel tanpa
RLS, sumber video selain YouTube resmi, atribusi TMDB/JustWatch. Jangan memperbaiki apa pun,
laporkan saja.
```

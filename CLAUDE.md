# CLAUDE.md — Pengunci Proyek "Filmku"

> File ini adalah sumber kebenaran proyek. Baca seluruhnya di awal setiap sesi.
> Jangan menyimpang dari keputusan di sini tanpa persetujuan pemilik proyek.

## 1. Ringkasan

Website katalog dan tracker tontonan **pribadi**, fokus mobile, untuk film dan serial Jepang
(contoh: *Doctor-X: Surgeon Daimon Michiko*). Pemilik proyek satu orang. Skala kecil.
Data film dari **TMDB API**. Login dan penyimpanan data dari **Supabase**. Deploy ke **Vercel**.

## 2. Keputusan yang dikunci

| Hal | Keputusan |
|---|---|
| Framework | Vite + React 18 (JavaScript, bukan TypeScript) |
| Routing | react-router-dom v6 |
| Data fetching | @tanstack/react-query v5 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) + CSS kustom untuk efek glass |
| Ikon | lucide-react |
| Backend | Hanya serverless function Vercel `api/tmdb/[...path].js` |
| Database + Auth | Supabase (paket Free), `@supabase/supabase-js` |
| Bahasa UI | Indonesia. Data TMDB `language=id-ID`, jika `overview` kosong ambil ulang `en-US` |
| Region provider | `ID` dulu, fallback `JP`, lalu `US` |
| Penggunaan | Pribadi, non-komersial |

## 3. ATURAN KERAS (tidak boleh dilanggar)

1. **Tidak ada video bajakan.** Dilarang membuat pemutar, embed, scraper, atau tautan ke situs
   streaming ilegal. Dilarang menambahkan sumber video di luar yang disebut di bagian 8.
2. **"Siap menonton" berarti:** trailer resmi (YouTube dari endpoint `/videos` TMDB) +
   info "Di mana menonton" (watch providers TMDB) + pencatatan progres manual.
3. **Rahasia tidak boleh masuk kode atau git.** TMDB API key hanya di environment variable
   server (`TMDB_API_KEY`). Dilarang menaruhnya di kode front-end, file `.md`, atau commit.
4. **Dilarang memakai `service_role` key Supabase** di front-end atau repo. Front-end hanya
   memakai `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`.
5. **Row Level Security wajib aktif** di semua tabel. Pengguna hanya boleh akses baris miliknya.
6. **Atribusi TMDB wajib** di footer (logo + kalimat: "Produk ini menggunakan TMDB API tetapi
   tidak didukung atau disertifikasi oleh TMDB."). Info provider wajib atribusi **JustWatch**.
7. **Satu langkah per sesi.** Kerjakan hanya langkah yang diminta. Jangan mengerjakan langkah
   berikutnya sebelum diminta. Jangan menambah fitur di luar daftar.
8. Setelah setiap langkah: jalankan `npm run build`, perbaiki error, lalu perbarui bagian 12.

## 4. Desain (liquid glass, gelap + biru)

**Prinsip:** modern, bersih, sederhana. Mobile-first (lebar acuan 390px). Di desktop,
konten dibatasi `max-width: 480px` dan diletakkan di tengah layar.

**Token warna**
- `--bg-0: #060A18`, `--bg-1: #0B1633` (gradasi latar vertikal) + 1–2 radial glow biru lembut di pojok
- `--accent: #3B82F6`, `--accent-glow: rgba(59,130,246,.45)`
- `--text: #E8EDFF`, `--text-dim: #8FA0C8`
- `--danger: #F87171`, `--success: #34D399`

**Material glass** (kelas `.glass`)
- `background: rgba(255,255,255,.07)`
- `border: 1px solid rgba(255,255,255,.14)`
- `backdrop-filter: blur(20px) saturate(160%)` + versi `-webkit-`
- `box-shadow: inset 0 1px 0 rgba(255,255,255,.25), 0 8px 32px rgba(0,0,0,.35)`
- highlight spekular tipis lewat `::before` (gradasi putih 18% → transparan di sisi atas)
- Terapkan hanya pada: bottom nav, kolom cari, chip, tombol bulat, badge, bottom sheet, form login.
  Poster dan teks tetap solid. Batasi jumlah elemen blur per layar agar ringan di HP.

**Bentuk:** sudut sangat membulat (kartu 24px, chip/tombol pil 999px). Font: Plus Jakarta Sans.
Judul tebal, meta kecil abu kebiruan. Satu warna aksen saja (biru).

**Bottom navbar (WAJIB seperti navbar aplikasi mobile)**
- `position: fixed`, menempel di bawah, tengah horizontal, melayang 16px dari tepi bawah
  (+ `env(safe-area-inset-bottom)`), lebar `min(100% - 32px, 440px)`, tinggi 64px, pil glass.
- 5 tab sama lebar: **Home, Cari, Simpan, Riwayat, Profil** (ikon + label kecil).
- Tab aktif ditandai **gelembung kaca** (pil glass bercahaya biru) yang **bergeser halus**
  (`transform: translateX`, ±300ms ease) di belakang tab aktif. Ikon aktif berwarna putih,
  tidak aktif abu kebiruan.
- Konten halaman diberi `padding-bottom` ≥ 112px agar tidak tertutup navbar.

## 5. Halaman dan rute

| Rute | Isi | Login? |
|---|---|---|
| `/` | Header "Beranda"; chip: Trending, Drama Jepang, Film Jepang, Anime; kartu besar (pertama) + grid 2 kolom; footer atribusi | Tidak |
| `/cari` | Kolom cari glass (debounce 400ms) memakai `search/multi`, hasil grid; keadaan kosong dan error | Tidak |
| `/detail/:type/:id` | Backdrop, judul, tahun, rating, durasi/jumlah episode, genre, sinopsis, pemeran utama, **trailer**, **Di mana menonton**, tombol Simpan, tombol Tandai ditonton, input progres | Tidak (aksi simpan butuh login) |
| `/simpan` | Daftar watchlist | Ya |
| `/riwayat` | Daftar riwayat: progres menit, tanggal terakhir, ditonton/belum; "Lanjutkan" membuka detail | Ya |
| `/profil` | Email, tombol keluar, info versi | Ya |
| `/masuk` | Form email + password (opsional magic link), gaya glass | — |

## 6. TMDB lewat proxy

- Front-end hanya memanggil `/api/tmdb/<path-tmdb>?<params>`. Fungsi `api/tmdb/[...path].js`
  menambah `api_key` dari `process.env.TMDB_API_KEY`, memfilter path (whitelist:
  `search/*`, `trending/*`, `discover/*`, `movie/{id}*`, `tv/{id}*`), dan memberi header cache
  `s-maxage=300, stale-while-revalidate=600`.
- Saat dev, `vite.config.js` memakai proxy yang menambah key dari `.env`.
- Endpoint yang dipakai:
  - Trending: `trending/all/week`
  - Drama Jepang: `discover/tv?with_original_language=ja&with_genres=18&sort_by=popularity.desc`
  - Film Jepang: `discover/movie?with_original_language=ja&sort_by=popularity.desc`
  - Anime: `discover/tv?with_original_language=ja&with_genres=16&sort_by=popularity.desc`
  - Cari: `search/multi?query=...` (saring hanya `movie` dan `tv`)
  - Detail: `{type}/{id}?append_to_response=credits,videos,watch/providers,recommendations`
- Gambar: `https://image.tmdb.org/t/p/{w342|w500|w780|original}{path}`.
- Cari "Doctor-X" memakai `search/multi?query=Doctor-X` (cadangan: `Doctor X Gekai Daimon Michiko`).

## 7. Supabase

**Tabel** (jalankan di SQL Editor):

```sql
create table public.watchlist (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  tmdb_id int not null,
  media_type text not null check (media_type in ('movie','tv')),
  title text,
  poster_path text,
  created_at timestamptz not null default now(),
  primary key (user_id, tmdb_id, media_type)
);

create table public.history (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  tmdb_id int not null,
  media_type text not null check (media_type in ('movie','tv')),
  title text,
  poster_path text,
  progress_minutes int not null default 0 check (progress_minutes >= 0),
  season int,
  episode int,
  watched boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, tmdb_id, media_type)
);

alter table public.watchlist enable row level security;
alter table public.history  enable row level security;

create policy "watchlist_own" on public.watchlist
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "history_own" on public.history
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

**Auth:** email + password. Setelah akun pemilik dibuat, **matikan sign-ups** di
Authentication > Providers/Settings agar tidak ada orang lain yang mendaftar.

**Catatan:** paket Free mem-pause project setelah 7 hari tanpa aktivitas. Itu normal; aktifkan lagi lewat dashboard.

## 8. Arti "siap menonton" (definition of done fitur tonton)

- Detail menampilkan **trailer** YouTube (pilih `type=Trailer`, `site=YouTube`, utamakan
  `iso_639_1` ja atau en) dengan `youtube-nocookie.com`, lazy-load, tombol putar.
- Detail menampilkan **Di mana menonton**: logo provider (flatrate, lalu rent/buy) untuk
  region ID → JP → US, dengan tombol yang membuka tautan `link` dari TMDB, plus atribusi JustWatch.
  Jika tidak ada provider: tampilkan "Belum tersedia di platform resmi untuk wilayah ini".
- **Pencatatan progres manual:** kolom "terakhir sampai menit ke-…" (dan musim/episode untuk
  serial), tombol "Tandai ditonton". Disimpan ke tabel `history` dengan upsert (jeda 800ms
  setelah input berhenti).

## 9. Struktur folder

```
filmku/
├─ api/tmdb/[...path].js
├─ public/
├─ src/
│  ├─ main.jsx, App.jsx, index.css
│  ├─ lib/ (tmdb.js, supabase.js, format.js)
│  ├─ hooks/ (useAuth.js, useWatchlist.js, useHistory.js)
│  ├─ components/ (BottomNav, PosterCard, FeaturedCard, Chips, SearchBar, Trailer,
│  │                Providers, ProgressInput, EmptyState, Skeleton, Footer)
│  └─ pages/ (Home, Search, Detail, Watchlist, History, Profile, Login)
├─ .env.example
├─ vercel.json
├─ CLAUDE.md
└─ package.json
```

`vercel.json`: `{"rewrites":[{"source":"/((?!api/).*)","destination":"/index.html"}]}`

## 10. Environment variable

`.env.example` (nilai kosong, isi sendiri; `.env` wajib ada di `.gitignore`):

```
TMDB_API_KEY=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Di Vercel: Project Settings > Environment Variables, isi ketiganya.

## 11. Standar kode

- Komponen fungsional, hooks, tanpa library UI tambahan selain yang terdaftar.
- Semua pemanggilan data lewat React Query dengan `staleTime` ≥ 5 menit.
- Setiap daftar punya skeleton loading, keadaan kosong, dan keadaan error dengan tombol coba lagi.
- Aksesibilitas dasar: `alt` pada gambar, `aria-label` pada tombol ikon, fokus terlihat,
  area sentuh ≥ 44px. Hormati `prefers-reduced-motion`.
- Jangan `console.log` data rahasia. Tidak ada kode mati atau fitur tambahan.

## 12. Progres (perbarui setelah setiap langkah)

- [x] 1. Setup project + proxy TMDB
- [x] 2. Tema, layout, bottom navbar liquid glass
- [ ] 3. Home
- [ ] 4. Cari
- [ ] 5. Detail (trailer + di mana menonton)
- [ ] 6. Supabase + login
- [ ] 7. Simpan + Riwayat + progres
- [ ] 8. Poles dan deploy Vercel

**Catatan keputusan/bug terbaru:**
- Langkah 1 selesai. Versi terpasang: Vite 8, @vitejs/plugin-react 6, Tailwind 4, React 18, Router 6, React Query 5.
- File penting: `api/tmdb/[...path].js` (whitelist + cache), `vite.config.js` (proxy dev), `src/lib/tmdb.js`.
- Langkah 2 selesai. `src/index.css` (token, latar, `.glass`), `src/App.jsx` (router + shell max-width 480px, `pb-28`), `src/components/BottomNav.jsx`, 7 halaman placeholder di `src/pages`. Halaman verifikasi Doctor-X dihapus; verifikasi key TMDB asli dilakukan di langkah 3.
- `.glass` ada di `@layer components` agar utilitas Tailwind (mis. `fixed`) tetap menang; jangan dipindah keluar layer.
- Gelembung navbar tanpa `backdrop-filter` (hanya navbar yang blur) demi performa; tab aktif tidak ada di `/detail` dan `/masuk` (gelembung disembunyikan).
- `src/hooks` dan `public` masih berisi `.gitkeep` sementara.

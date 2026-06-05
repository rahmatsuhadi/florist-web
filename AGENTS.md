<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.



## 1. Standar Struktur Folder (Domain-Driven Atomic Design)
Semua komponen harus disimpan di dalam folder `src/components/` dan dilarang keras mencampur semua fitur dalam satu folder global. Gunakan format **"Fitur di Luar, Atomic di Dalam"**:

* `src/components/ui/` : Tempat komponen UI global murni yang *stateless* dan *reusable* (seperti Button, Input, Modal dasar).
* `src/components/features/[nama-fitur]/` : Tempat isolasi komponen per-domain fitur (misal: `payment`, `product`, `order`, `cart`, `chat`).
  Di dalam setiap folder fitur, bagi lagi komponennya menggunakan hierarki Atomic Design:
  - `atoms/` : Elemen UI terkecil khusus untuk fitur tersebut (misal: `PaymentBadge.tsx`).
  - `molecules/` : Gabungan beberapa atoms atau komponen client interaktif khusus fitur tersebut (termasuk *skeleton loading* milik fitur ini).
  - `organisms/` : Komponen besar yang memegang logika bisnis utama atau tempat melakukan *fetching* data dari server.

  
## 2 Constraints
*   **Dilarang mencampur teknologi:** Frontend murni React/Next.js. Tidak boleh ada logika ORM atau koneksi database langsung di client component.
*   **Hierarki Atomic:** Atom tidak boleh memanggil Molecule/Organism. Molecule tidak boleh memanggil Organism. Data mengalir dari atas ke bawah (Top-Down via Props).
*   **No Direct API Calls in UI:** Komponen di `components/` tidak boleh memanggil `fetch` atau `axios` secara langsung. Gunakan Custom Hooks atau `services`.
*   **Penamaan:** Wajib mematuhi konvensi Naming Standards (PascalCase untuk komponen, camelCase untuk non-komponen).
*  **Penggunaan pnpm** seslalu guankann sources ~/.bashrc && nvm use 20 kalo mau menggunka pnpm (sources ~/.bashrc && nvm use 20 && pnpm install)

## 3. Aturan Arsitektur Server-First
* **Pengambilan Data (Data Fetching):** Wajib dilakukan di sisi server di dalam Async Server Components. Penggunaan `useEffect` untuk fetch data saat halaman pertama dimuat sangat dilarang.
* **Mutasi Data:** Submit form, hapus data, dan update data wajib menggunakan **Server Actions** yang disimpan di folder `src/services/actions/`.
* **Batasan Client (`'use client'`):** Geser logika interaktif sejauh mungkin ke bawah pohon komponen. Jangan pernah mengubah satu halaman penuh menjadi Client Component hanya karena ada satu tombol interaktif atau animasi.

## 4. Aturan Pengelolaan Form Modern (Sangat Ketat)
Setiap pembuatan atau perombakan (refactor) komponen Form **wajib** mengikuti aturan modern berikut:
* **Dilarang Menggunakan State Manual:** Jangan gunakan `useState` dan `onChange` untuk menangkap input teks/number biasa pada form. Gunakan atribut HTML `name` bawaan untuk diproses via `FormData`.
* **Dilarang Menggunakan State Loading Manual:** Jangan buat state `isLoading` atau `isSubmitting` manual. Gunakan `useFormStatus` (untuk komponen tombol anak) atau `useTransition` (jika form melakukan pengalihan halaman/redirect).
* **Validasi Sisi Server (Server Actions + Zod):** Semua pengiriman form wajib ditembak ke **Server Action** (`'use server'`). Validasi data wajib menggunakan **Zod** di sisi server, lalu kembalikan daftar error spesifik per-kolom ke client.
* **Konsumsi State via `useActionState`:** Gunakan hook `useActionState` di sisi client untuk menangkap hasil return (sukses/gagal/error validasi) dari Server Action.
* **Progressive Enhancement:** Pastikan form dirancang menggunakan properti `action={formAction}` pada tag `<form>` agar tetap dapat bekerja meskipun JavaScript di browser lambat dimuat.

**5. Kontrol Tabel/List:** Filter pencarian, kategori, dan nomor halaman (pagination) wajib diikat ke **URL (`searchParams`)** untuk mendukung fitur deep linking (bisa di-bookmark).
* **Loading States:** Implementasikan loading menggunakan React `<Suspense>` yang membungkus Server Component, dengan memanfaatkan atom/molecule skeleton kustom sebagai fallback.
* **Animasi:** Gunakan Framer Motion hanya di dalam komponen wrapper Client yang terisolasi (`'use client'`). Gunakan pola *children composition* jika ingin menganimasikan layout grid container.

## 6. Aturan Data Fetching, Mutasi, & State Halaman
* **Membaca Data (GET):** Wajib dilakukan secara langsung di sisi server menggunakan *Async Server Components*. Penggunaan `useEffect` untuk pengambilan data awal saat halaman dimuat sangat dilarang.
* **State Tabel & List (Deep Linking):** Fitur pencarian (search), filter kategori, dan nomor halaman (pagination) wajib diikat ke **URL (`searchParams`)** agar halaman bisa di-*bookmark* dan di-bagikan, alih-alih menggunakan state client biasa.
* **Loading States:** Gunakan React `<Suspense>` untuk membungkus Server Component yang sedang memuat data, dan pasang komponen *Skeleton* kustom sebagai `fallback`-nya.

## 7. Protokol Refactoring Code
Ketika diminta untuk merombak kode:
1. Identifikasi anti-pattern arsitektur (misal: mencampur fetch data dengan animasi client, komponen terlalu besar).
2. Pecah kode monolitik tersebut ke dalam modul Atomic Design yang tepat.
3. Berikan kode yang production-ready lengkap dengan tipe data TypeScript dan validasi skema (misal: Zod untuk form/actions).

<!-- END:nextjs-agent-rules -->

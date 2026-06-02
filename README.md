# L'Bunga Kita Florist

L'Bunga Kita Florist adalah website eCommerce katalog florist premium minimalis yang dibangun menggunakan **Next.js 15 (App Router)** dan **Tailwind CSS v4**. Website ini dirancang dengan estetika modern, transisi halus, serta pengoptimalan kinerja penuh untuk perangkat mobile dan desktop.

## Fitur Utama

- **Desain Estetis & Interaktif**: Menggunakan kombinasi warna natural (Sage Green, warm cream, dan charcoal), tipografi serif elegan (Playfair Display), serta efek Parallax Scrolling murni berbasis CSS pada banner utama.
- **Katalog Produk & Kategori**: Navigasi multi-halaman untuk menjelajahi berbagai macam rangkaian bunga berdasarkan kategori (Buket Wisuda, Pernikahan, Meja, dll.).
- **Asymmetric Image Gallery**: Galeri foto responsif yang menyusun potret buket secara asimetris pada layar besar dan tumpukan rapi satu kolom pada layar ponsel.
- **Integrasi Peta Interaktif**: Peta lokasi toko fisik menggunakan Leaflet Map (OpenStreetMap) yang terintegrasi langsung di halaman beranda.
- **Pemesanan via WhatsApp**: Keranjang belanja interaktif yang memproses checkout dengan memindahkan seluruh daftar belanja secara otomatis ke obrolan WhatsApp bisnis toko.
- **Asisten AI Chat**: Widget asisten chat interaktif bertenaga AI untuk memberikan saran rangkaian bunga kepada pengunjung.
- **Optimasi Performa Gambar**: Menggunakan Next.js `<Image>` dengan format kompresi tinggi (WebP/AVIF) dan pengoptimalan kualitas dinamis.
- **Penuh SEO & Metadata**: Integrasi metadata statis dan dinamis di tingkat halaman, Open Graph card untuk media sosial, serta favicon SVG ramah dark/light mode browser.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animasi**: [Framer Motion](https://www.framer.com/motion/)
- **Peta**: [React Leaflet](https://react-leaflet.js.org/) & [Leaflet](https://leafletjs.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State**: React Context API

## Memulai Pengembangan

### 1. Instalasi Dependensi
Proyek ini menggunakan `pnpm` sebagai package manager. Jalankan perintah berikut untuk menginstal seluruh package:
```bash
pnpm install
```

### 2. Jalankan Mode Development
Jalankan server lokal untuk melihat hasil perubahan secara real-time:
```bash
pnpm dev
```
Akses website melalui browser di `http://localhost:3000`.

### 3. Build untuk Produksi
Guna melakukan kompilasi versi produksi yang optimal:
```bash
pnpm build
```

## Struktur Direktori (Atomic Design)

```
src/
├── app/                  # Routing halaman & SEO metadata
├── components/           # Komponen UI terstruktur
│   ├── atoms/            # Elemen murni (Button, Input, Logo, Toast)
│   ├── molecules/        # Komponen gabungan (ProductCard, CategoryCard, Map)
│   └── organisms/        # Blok antarmuka utama (Navbar, Footer, CartSidebar, Chat)
├── constants/            # Mock data, konfigurasi toko (shopInfo), & animasi
├── services/             # Integrasi API (AI Chat Assistant)
├── store/                # Global State Management (React Context)
├── utils/                # Helper functions (currency formatter)
└── types/                # Tipe TypeScript
```

## Lisensi

Proyek ini dilisensikan di bawah **Lisensi MIT** - lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.
export interface VariantOption {
  id: string;
  name: string;
  priceModifier: number;
  imageUrl?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  options: VariantOption[];
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  bestSeller: boolean;
  images: string[];
  description: string;
  variants?: ProductVariant[];
}

export interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "wedding",
    name: "Wedding Bouquets",
    image: "/images/categories/wedding.webp",
    description:
      "Rangkaian bunga elegan dan romantis untuk melengkapi keindahan hari bahagia pernikahan Anda.",
  },
  {
    id: "graduation",
    name: "Graduation",
    image: "/images/categories/graduation.webp",
    description:
      "Rayakan pencapaian dan kesuksesan dengan buket cerah yang melambangkan masa depan gemilang.",
  },
  {
    id: "anniversary",
    name: "Anniversary",
    image: "/images/categories/anniversary.avif",
    description:
      "Ekspresikan cinta abadi Anda melalui pilihan bunga premium bernuansa romantis dan hangat.",
  },
  {
    id: "sympathy",
    name: "Sympathy & Condolences",
    image: "/images/categories/sympathy.webp",
    description:
      "Sampaikan rasa peduli dan belasungkawa Anda dengan rangkaian bunga yang damai dan menenangkan.",
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    categoryId: "wedding",
    name: "White Elegance Rose",
    price: 750000,
    bestSeller: true,
    images: [
      "/images/products/p1_3.webp",
      "/images/products/p1_2.webp",
      "/images/products/p1_1.webp",
    ],
    description:
      "Rangkaian mawar putih premium yang melambangkan kemurnian cinta, dihiasi dengan baby breath yang elegan.",
    variants: [
      {
        id: "size",
        name: "Ukuran Rangkaian",
        options: [
          { id: "standard", name: "Standard (S)", priceModifier: 0 },
          {
            id: "medium",
            name: "Medium (M) + Rp 150.000",
            priceModifier: 150000,
          },
          {
            id: "premium",
            name: "Premium (L) + Rp 300.000",
            priceModifier: 300000,
          },
        ],
      },
      {
        id: "ribbon",
        name: "Warna Pita",
        options: [
          {
            id: "white",
            name: "Putih Klasik",
            priceModifier: 0,
            imageUrl: "/images/products/p1_1.webp",
          },
          {
            id: "silver",
            name: "Silver Elegance",
            priceModifier: 0,
            imageUrl: "/images/products/p1_2.webp",
          },
          {
            id: "gold",
            name: "Gold Premium",
            priceModifier: 0,
            imageUrl: "/images/products/p1_3.webp",
          },
        ],
      },
    ],
  },
  {
    id: "p2",
    categoryId: "wedding",
    name: "Peony Blush Romance",
    price: 950000,
    bestSeller: false,
    images: ["/images/products/p2_1.webp"],
    description:
      "Bunga peony segar dengan sentuhan warna pastel yang manis dan elegan untuk hari pernikahan Anda.",
    variants: [
      {
        id: "wrap",
        name: "Jenis Wrapping",
        options: [
          { id: "paper", name: "Kertas Premium Putih", priceModifier: 0 },
          {
            id: "fabric",
            name: "Kain Tile Lembut + Rp 50.000",
            priceModifier: 50000,
          },
        ],
      },
    ],
  },
  {
    id: "p3",
    categoryId: "graduation",
    name: "Sunflowers Success",
    price: 350000,
    bestSeller: true,
    images: ["/images/products/p3_3.webp", "/images/products/p3_2.webp"],
    description:
      "Bunga matahari cerah untuk merayakan pencapaian dan kesuksesan wisuda.",
    variants: [],
  },
  {
    id: "p4",
    categoryId: "anniversary",
    name: "Classic Red Romance",
    price: 650000,
    bestSeller: true,
    images: ["/images/products/p4_2.webp", "/images/products/p4_1.webp"],
    description:
      "Buket mawar merah klasik dengan kualitas premium, dibungkus dengan kertas elegan berwarna gelap.",
    variants: [
      {
        id: "size",
        name: "Jumlah Mawar",
        options: [
          { id: "qty12", name: "12 Tangkai", priceModifier: 0 },
          {
            id: "qty24",
            name: "24 Tangkai + Rp 350.000",
            priceModifier: 350000,
          },
        ],
      },
      {
        id: "card",
        name: "Kartu Ucapan",
        options: [
          { id: "std", name: "Standard", priceModifier: 0 },
          {
            id: "custom",
            name: "Premium Custom Print + Rp 25.000",
            priceModifier: 25000,
          },
        ],
      },
    ],
  },
  {
    id: "p5",
    categoryId: "sympathy",
    name: "Peaceful Lily",
    price: 500000,
    bestSeller: false,
    images: ["/images/products/p5_1.webp"],
    description:
      "Rangkaian bunga lily putih yang damai dan menenangkan untuk menyampaikan rasa simpati.",
    variants: [],
  },
  {
    id: "p6",
    categoryId: "anniversary",
    name: "Pastel Dream Box",
    price: 850000,
    bestSeller: false,
    images: ["/images/products/p6_1.webp"],
    description:
      "Bunga segar bernuansa pastel yang dirangkai cantik di dalam premium box eksklusif.",
    variants: [
      {
        id: "boxColor",
        name: "Warna Kotak (Box)",
        options: [
          {
            id: "pink",
            name: "Soft Pink",
            priceModifier: 0,
            imageUrl: "/images/products/p6_1.webp",
          },
          {
            id: "black",
            name: "Elegant Black",
            priceModifier: 0,
            imageUrl: "/images/products/p6_1.webp",
          },
          {
            id: "white",
            name: "Pure White",
            priceModifier: 0,
            imageUrl: "/images/products/p6_1.webp",
          },
        ],
      },
    ],
  },
];

export interface GalleryItem {
  id: string;
  image: string;
  gridClass: string;
  alt: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g1",
    image: "/images/gallery/g1.webp",
    gridClass: "md:col-span-1 md:row-span-3",
    alt: "Galeri Bouquet 1",
  },
  {
    id: "g2",
    image: "/images/gallery/g2.webp",
    gridClass: "md:col-span-1 md:row-span-1",
    alt: "Galeri Bouquet 2",
  },
  {
    id: "g3",
    image: "/images/gallery/g3.webp",
    gridClass: "md:col-span-2 md:row-span-1",
    alt: "Galeri Bouquet 3",
  },
  {
    id: "g4",
    image: "/images/gallery/g4.webp",
    gridClass: "md:col-span-2 md:row-span-2",
    alt: "Galeri Bouquet 4",
  },
  {
    id: "g5",
    image: "/images/gallery/g5.webp",
    gridClass: "md:col-span-1 md:row-span-1",
    alt: "Galeri Bouquet 5",
  },
  {
    id: "g6",
    image: "/images/gallery/g6.webp",
    gridClass: "md:col-span-2 md:row-span-1",
    alt: "Galeri Bouquet 6",
  },
  {
    id: "g7",
    image: "/images/gallery/g7.webp",
    gridClass: "block md:hidden",
    alt: "Galeri Bouquet 7",
  },
];

export interface HeroBanner {
  id: string;
  image: string;
  title: string;
  subtitle: string;
}

export const HERO_BANNERS: HeroBanner[] = [
  {
    id: "b1",
    image: "/images/hero.webp",
    title: "Bespoke Floral Arrangements",
    subtitle:
      "Rangkaian bunga segar premium yang dirangkai dengan penuh cinta untuk menyempurnakan setiap momen berharga Anda.",
  },
  {
    id: "b2",
    image: "/images/hero_2.webp",
    title: "Blossom with Love",
    subtitle:
      "Hadirkan keindahan alam terbaik langsung ke rumah Anda dengan koleksi musiman peony dan mawar kami.",
  },
  {
    id: "b3",
    image: "/images/hero_3.webp",
    title: "Boutique Florist Experience",
    subtitle:
      "Kunjungi studio florist kami untuk konsultasi khusus pernikahan, kado ulang tahun, dan pesanan kustom.",
  },
];

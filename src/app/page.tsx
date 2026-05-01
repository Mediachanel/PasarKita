"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  FiAward,
  FiChevronRight,
  FiClock,
  FiCreditCard,
  FiGift,
  FiGrid,
  FiHeart,
  FiMapPin,
  FiSearch,
  FiShield,
  FiStar,
  FiTruck,
  FiZap,
} from "react-icons/fi";
import {
  bannerImageFallbacks,
  productImageFallbacks,
  rupiah,
} from "@/lib/marketplace";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  products: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  imageUrl: string | null;
  rating: number;
  reviews: number;
  sold: number;
  store: {
    name: string;
  };
  category: {
    name: string;
    slug: string;
  };
}

interface Banner {
  id: string;
  title: string;
  image: string;
  link: string | null;
}

const fallbackCategories: Category[] = [
  {
    id: "makanan",
    name: "Makanan & Minuman",
    slug: "makanan-minuman",
    icon: "M",
    products: 8,
  },
  { id: "fashion", name: "Fashion", slug: "fashion", icon: "F", products: 3 },
  { id: "elektronik", name: "Elektronik", slug: "elektronik", icon: "E", products: 3 },
  { id: "kerajinan", name: "Kerajinan", slug: "kerajinan", icon: "K", products: 3 },
  {
    id: "rumah",
    name: "Rumah Tangga",
    slug: "alat-rumah-tangga",
    icon: "R",
    products: 2,
  },
];

const fallbackProducts: Product[] = [
  {
    id: "kopi-specialty-sumatra",
    name: "Kopi Specialty Sumatra 250gr",
    price: 89000,
    image: "M",
    imageUrl: productImageFallbacks["kopi-specialty-sumatra"],
    rating: 4.8,
    reviews: 342,
    sold: 1250,
    store: { name: "Kopi Nusantara" },
    category: { name: "Makanan & Minuman", slug: "makanan-minuman" },
  },
  {
    id: "batik-premium-pekalongan",
    name: "Batik Premium Pekalongan Lengan Panjang",
    price: 275000,
    image: "F",
    imageUrl: productImageFallbacks["batik-premium-pekalongan"],
    rating: 4.9,
    reviews: 156,
    sold: 234,
    store: { name: "Batik Indah" },
    category: { name: "Fashion", slug: "fashion" },
  },
  {
    id: "beras-pandan-wangi-cianjur",
    name: "Beras Pandan Wangi Cianjur 5kg",
    price: 78000,
    image: "M",
    imageUrl: productImageFallbacks["beras-pandan-wangi-cianjur"],
    rating: 4.8,
    reviews: 118,
    sold: 612,
    store: { name: "Tani Cianjur" },
    category: { name: "Makanan & Minuman", slug: "makanan-minuman" },
  },
  {
    id: "set-panci-stainless-umkm",
    name: "Set Panci Stainless Serbaguna",
    price: 245000,
    image: "R",
    imageUrl: productImageFallbacks["set-panci-stainless-umkm"],
    rating: 4.6,
    reviews: 57,
    sold: 87,
    store: { name: "Dapur Prima" },
    category: { name: "Alat Rumah Tangga", slug: "alat-rumah-tangga" },
  },
  {
    id: "tas-kulit-bandung",
    name: "Tas Kulit Bandung Casual",
    price: 320000,
    image: "F",
    imageUrl: productImageFallbacks["tas-kulit-bandung"],
    rating: 4.7,
    reviews: 86,
    sold: 301,
    store: { name: "Leather Bandung" },
    category: { name: "Fashion", slug: "fashion" },
  },
  {
    id: "madu-asli-flores",
    name: "Madu Asli Flores 500ml",
    price: 118000,
    image: "M",
    imageUrl: productImageFallbacks["madu-asli-flores"],
    rating: 4.9,
    reviews: 204,
    sold: 790,
    store: { name: "Flores Honey" },
    category: { name: "Makanan & Minuman", slug: "makanan-minuman" },
  },
  {
    id: "laptop-bekas-gaming-asus",
    name: "Laptop Gaming Bekas Garansi Toko",
    price: 6850000,
    image: "E",
    imageUrl: productImageFallbacks["laptop-bekas-gaming-asus"],
    rating: 4.6,
    reviews: 44,
    sold: 53,
    store: { name: "Tech Corner" },
    category: { name: "Elektronik", slug: "elektronik" },
  },
  {
    id: "lampu-meja-rotan",
    name: "Lampu Meja Rotan Handmade",
    price: 165000,
    image: "K",
    imageUrl: productImageFallbacks["lampu-meja-rotan"],
    rating: 4.8,
    reviews: 63,
    sold: 142,
    store: { name: "Rotan Rumah" },
    category: { name: "Kerajinan", slug: "kerajinan" },
  },
];

const popularSearches = [
  "Kopi arabika",
  "Beras 5kg",
  "Hijab sport",
  "Laptop kerja",
  "Panci set",
];

const serviceShortcuts = [
  { label: "Gratis Ongkir", href: "/browse?sort=popular", icon: FiTruck, tone: "text-marketplace-green bg-emerald-50" },
  { label: "Flash Sale", href: "/browse?sort=price-low", icon: FiZap, tone: "text-marketplace-orange bg-orange-50" },
  { label: "Voucher", href: "/seller/vouchers", icon: FiGift, tone: "text-marketplace-blue bg-sky-50" },
  { label: "Pasti Ori", href: "/browse?search=original", icon: FiShield, tone: "text-violet-600 bg-violet-50" },
  { label: "Bayar Nanti", href: "/checkout", icon: FiCreditCard, tone: "text-amber-600 bg-amber-50" },
  { label: "Dekat Kamu", href: "/browse?sort=popular", icon: FiMapPin, tone: "text-rose-600 bg-rose-50" },
  { label: "Kategori", href: "/browse", icon: FiGrid, tone: "text-slate-700 bg-slate-100" },
  { label: "Official", href: "/browse?sort=rating", icon: FiAward, tone: "text-marketplace-green bg-emerald-50" },
];

const campaignTiles = [
  {
    title: "Elektronik 5.5",
    copy: "Voucher sampai Rp1 juta",
    href: "/browse?category=elektronik",
    className: "bg-marketplace-blue",
  },
  {
    title: "Mall Lokal",
    copy: "Brand tepercaya, stok aman",
    href: "/browse?sort=rating",
    className: "bg-marketplace-green",
  },
];

function soldLabel(sold: number) {
  if (sold >= 10000) return "10RB+ terjual";
  if (sold >= 1000) return `${Math.floor(sold / 1000)}RB+ terjual`;
  return `${sold} terjual`;
}

function getOriginalPrice(price: number, index: number) {
  return Math.round(price * (1.18 + (index % 4) * 0.05));
}

function getDiscount(price: number, original: number) {
  return Math.max(5, Math.round(((original - price) / original) * 100));
}

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    const loadMarketplace = async () => {
      const [productResponse, categoryResponse, bannerResponse] =
        await Promise.allSettled([
          fetch("/api/products?sort=popular"),
          fetch("/api/categories"),
          fetch("/api/banners"),
        ]);

      if (productResponse.status === "fulfilled" && productResponse.value.ok) {
        const data = await productResponse.value.json();
        if (data.products?.length) setProducts(data.products.slice(0, 12));
      }

      if (categoryResponse.status === "fulfilled" && categoryResponse.value.ok) {
        const data = await categoryResponse.value.json();
        if (data.categories?.length) setCategories(data.categories);
      }

      if (bannerResponse.status === "fulfilled" && bannerResponse.value.ok) {
        const data = await bannerResponse.value.json();
        setBanners(data.banners ?? []);
      }
    };

    loadMarketplace();
  }, []);

  const heroBanner = useMemo(() => {
    return (
      banners[0] ?? {
        id: "marketplace-hero",
        title: "Promo Belanja Bulanan",
        image: bannerImageFallbacks.sembako,
        link: "/browse?category=makanan-minuman",
      }
    );
  }, [banners]);

  const trustedStores = useMemo(() => {
    const names = Array.from(new Set(products.map((product) => product.store.name)));
    return names.slice(0, 4);
  }, [products]);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const query = searchQuery.trim();
    router.push(query ? `/browse?search=${encodeURIComponent(query)}` : "/browse");
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-marketplace-canvas">
        <section className="bg-white">
          <div className="container mx-auto px-4 py-4">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(280px,0.72fr)]">
              <Link
                href={heroBanner.link || "/browse"}
                className="relative min-h-[260px] overflow-hidden rounded-lg bg-marketplace-orange p-5 text-white shadow-sm md:min-h-[320px]"
                style={{
                  backgroundImage: `linear-gradient(90deg, rgba(240, 90, 42, 0.92), rgba(240, 90, 42, 0.5), rgba(31, 41, 55, 0.18)), url(${heroBanner.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="flex h-full max-w-lg flex-col justify-between">
                  <div>
                    <span className="inline-flex rounded bg-white/95 px-3 py-1 text-xs font-extrabold uppercase text-marketplace-orange">
                      Mega Promo
                    </span>
                    <h1 className="mt-5 max-w-md text-3xl font-extrabold leading-tight text-white md:text-5xl">
                      {heroBanner.title}
                    </h1>
                    <p className="mt-3 max-w-sm text-sm font-medium text-white/90 md:text-base">
                      Belanja kebutuhan harian, elektronik, fashion, dan produk lokal dengan voucher yang mudah ditemukan.
                    </p>
                  </div>
                  <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-marketplace-orange">
                    Belanja Sekarang <FiChevronRight />
                  </span>
                </div>
              </Link>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {campaignTiles.map((tile) => (
                  <Link
                    key={tile.title}
                    href={tile.href}
                    className={`${tile.className} flex min-h-[150px] flex-col justify-between overflow-hidden rounded-lg p-5 text-white shadow-sm`}
                  >
                    <div>
                      <p className="text-xs font-bold uppercase text-white/75">Promo Pilihan</p>
                      <h2 className="mt-2 text-2xl font-extrabold text-white">{tile.title}</h2>
                      <p className="mt-1 text-sm font-medium text-white/85">{tile.copy}</p>
                    </div>
                    <span className="inline-flex items-center gap-2 text-sm font-bold">
                      Cek Promo <FiChevronRight />
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-marketplace-line bg-white p-3 shadow-sm">
              <form onSubmit={submitSearch} className="flex flex-col gap-3 md:flex-row">
                <div className="flex min-h-11 flex-1 items-center gap-3 rounded-lg border border-marketplace-line bg-gray-50 px-4">
                  <FiSearch className="text-marketplace-orange" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Mau cari apa hari ini?"
                    className="w-full border-0 bg-transparent px-0 py-3 text-sm focus:border-0 focus:ring-0"
                  />
                </div>
                <button className="rounded-lg bg-marketplace-orange px-6 py-3 text-sm font-bold text-white transition hover:bg-marketplace-orangeDark">
                  Cari Produk
                </button>
              </form>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {popularSearches.map((search) => (
                  <Link
                    key={search}
                    href={`/browse?search=${encodeURIComponent(search)}`}
                    className="rounded-full bg-gray-100 px-3 py-1 font-semibold text-gray-600 hover:bg-orange-50 hover:text-marketplace-orange"
                  >
                    {search}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-marketplace-line bg-white">
          <div className="container mx-auto grid grid-cols-4 gap-2 px-4 py-4 md:grid-cols-8">
            {serviceShortcuts.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-lg border border-transparent p-2 text-center hover:border-marketplace-line hover:shadow-sm"
                >
                  <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${item.tone}`}>
                    <Icon className="text-xl" />
                  </span>
                  <span className="text-xs font-bold leading-tight text-gray-700 group-hover:text-marketplace-green">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="py-5">
          <div className="container mx-auto px-4">
            <div className="rounded-lg border border-marketplace-line bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-marketplace-line px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-marketplace-orange">
                    <FiZap />
                  </span>
                  <div>
                    <h2 className="text-lg font-extrabold">Flash Sale</h2>
                    <p className="text-xs font-semibold text-gray-500">Harga turun, stok bergerak cepat</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <FiClock className="text-marketplace-orange" />
                  <span className="rounded bg-gray-900 px-2 py-1 text-white">02</span>
                  <span className="rounded bg-gray-900 px-2 py-1 text-white">14</span>
                  <span className="rounded bg-gray-900 px-2 py-1 text-white">09</span>
                  <Link href="/browse?sort=price-low" className="ml-2 text-marketplace-orange hover:text-marketplace-orangeDark">
                    Lihat semua
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-px bg-marketplace-line sm:grid-cols-3 lg:grid-cols-6">
                {products.slice(0, 6).map((product, index) => {
                  const originalPrice = getOriginalPrice(product.price, index);
                  const discount = getDiscount(product.price, originalPrice);

                  return (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      className="group bg-white p-3"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-md bg-gray-100">
                        {product.imageUrl ? (
                          <span
                            role="img"
                            aria-label={product.name}
                            className="block h-full w-full bg-cover bg-center transition duration-300 group-hover:scale-105"
                            style={{ backgroundImage: `url(${product.imageUrl})` }}
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-5xl">
                            {product.image}
                          </span>
                        )}
                        <span className="absolute left-2 top-2 rounded bg-marketplace-orange px-2 py-1 text-xs font-extrabold text-white">
                          -{discount}%
                        </span>
                      </div>
                      <p className="mt-3 text-base font-extrabold text-marketplace-orange">
                        {rupiah(product.price)}
                      </p>
                      <p className="mt-1 text-xs text-gray-400 line-through">
                        {rupiah(originalPrice)}
                      </p>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-orange-100">
                        <span
                          className="block h-full rounded-full bg-marketplace-orange"
                          style={{ width: `${Math.min(94, 32 + index * 11)}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs font-semibold text-gray-500">
                        {soldLabel(product.sold)}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="py-5">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-extrabold">Kategori Pilihan</h2>
              <Link href="/browse" className="inline-flex items-center gap-1 text-sm font-bold text-marketplace-green">
                Semua <FiChevronRight />
              </Link>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {categories.slice(0, 10).map((category, index) => (
                <Link
                  key={category.id}
                  href={`/browse?category=${category.slug}`}
                  className="flex min-h-[112px] items-center gap-3 rounded-lg border border-marketplace-line bg-white p-4 shadow-sm hover:border-marketplace-green hover:shadow-md"
                >
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-lg font-extrabold ${
                      index % 3 === 0
                        ? "bg-emerald-50 text-marketplace-green"
                        : index % 3 === 1
                        ? "bg-orange-50 text-marketplace-orange"
                        : "bg-sky-50 text-marketplace-blue"
                    }`}
                  >
                    {category.icon || category.name.slice(0, 1)}
                  </span>
                  <span>
                    <span className="line-clamp-2 text-sm font-bold text-gray-800">{category.name}</span>
                    <span className="mt-1 block text-xs text-gray-500">{category.products} produk</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-5">
          <div className="container mx-auto px-4">
            <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-lg border border-marketplace-line bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-extrabold">Official & Trusted Store</h2>
                    <p className="text-sm font-medium text-gray-500">Toko dengan rating tinggi dan transaksi aktif.</p>
                  </div>
                  <Link href="/browse?sort=rating" className="text-sm font-bold text-marketplace-green">
                    Lihat
                  </Link>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {trustedStores.map((store, index) => (
                    <Link
                      key={store}
                      href={`/browse?search=${encodeURIComponent(store)}`}
                      className="flex items-center gap-3 rounded-lg border border-marketplace-line p-3 hover:border-marketplace-green"
                    >
                      <span
                        className={`flex h-12 w-12 items-center justify-center rounded-lg font-extrabold text-white ${
                          index % 2 ? "bg-marketplace-green" : "bg-marketplace-blue"
                        }`}
                      >
                        {store.slice(0, 1)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-extrabold text-gray-800">{store}</span>
                        <span className="mt-1 inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-xs font-bold text-marketplace-green">
                          <FiShield /> Pasti Aman
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-marketplace-line bg-white p-4 shadow-sm">
                <h2 className="text-xl font-extrabold">Keuntungan Hari Ini</h2>
                <div className="mt-4 grid gap-3">
                  {[
                    { label: "Gratis ongkir semua kategori", value: "Rp0", icon: FiTruck, color: "text-marketplace-green" },
                    { label: "Voucher toko aktif", value: "25+", icon: FiGift, color: "text-marketplace-orange" },
                    { label: "Perlindungan transaksi", value: "100%", icon: FiShield, color: "text-marketplace-blue" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                        <div className="flex items-center gap-3">
                          <Icon className={`text-xl ${item.color}`} />
                          <p className="text-sm font-bold text-gray-700">{item.label}</p>
                        </div>
                        <p className="text-lg font-extrabold text-gray-900">{item.value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-10 pt-5">
          <div className="container mx-auto px-4">
            <div className="sticky top-[123px] z-20 -mx-4 border-y border-marketplace-line bg-white px-4 py-3 md:top-[112px] lg:top-[122px]">
              <div className="container mx-auto flex items-center gap-3 overflow-x-auto px-0">
                {["Rekomendasi", "Terlaris", "Produk Baru", "Harga Hemat", "Rating Tinggi"].map((tab, index) => (
                  <Link
                    key={tab}
                    href={index === 0 ? "/browse" : `/browse?sort=${index === 1 ? "popular" : index === 3 ? "price-low" : "rating"}`}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${
                      index === 0
                        ? "bg-marketplace-orange text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-marketplace-green"
                    }`}
                  >
                    {tab}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
              {products.map((product, index) => {
                const originalPrice = getOriginalPrice(product.price, index);
                const discount = getDiscount(product.price, originalPrice);

                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="group overflow-hidden rounded-lg border border-marketplace-line bg-white shadow-sm hover:border-marketplace-orange hover:shadow-md"
                  >
                    <div className="relative aspect-square bg-gray-100">
                      {product.imageUrl ? (
                        <span
                          role="img"
                          aria-label={product.name}
                          className="block h-full w-full bg-cover bg-center transition duration-300 group-hover:scale-105"
                          style={{ backgroundImage: `url(${product.imageUrl})` }}
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-6xl">
                          {product.image}
                        </span>
                      )}
                      {index % 3 === 0 && (
                        <span className="absolute left-2 top-2 rounded bg-marketplace-green px-2 py-1 text-[10px] font-extrabold text-white">
                          Official
                        </span>
                      )}
                      <span
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-gray-500 shadow-sm hover:text-marketplace-orange"
                        aria-label="Tambah ke wishlist"
                      >
                        <FiHeart />
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-gray-800">
                        {product.name}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <span className="rounded bg-orange-50 px-1.5 py-0.5 text-[10px] font-bold text-marketplace-orange">
                          -{discount}%
                        </span>
                        <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-marketplace-green">
                          Gratis Ongkir
                        </span>
                      </div>
                      <p className="mt-2 text-base font-extrabold text-marketplace-orange">
                        {rupiah(product.price)}
                      </p>
                      <p className="text-xs text-gray-400 line-through">{rupiah(originalPrice)}</p>
                      <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                        <FiStar className="fill-current text-amber-400" />
                        <span className="font-bold text-gray-700">{product.rating}</span>
                        <span>|</span>
                        <span>{soldLabel(product.sold)}</span>
                      </div>
                      <p className="mt-2 truncate text-xs font-medium text-gray-500">{product.store.name}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

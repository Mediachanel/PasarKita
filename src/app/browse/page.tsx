"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  FiChevronDown,
  FiFilter,
  FiHeart,
  FiSearch,
  FiShield,
  FiStar,
  FiTruck,
  FiX,
  FiZap,
} from "react-icons/fi";
import { rupiah } from "@/lib/marketplace";

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
  };
}

const defaultCategories: Category[] = [
  { id: "all", name: "Semua", slug: "semua", icon: null, products: 0 },
];

const sortOptions = [
  { value: "popular", label: "Terlaris" },
  { value: "newest", label: "Terbaru" },
  { value: "price-low", label: "Termurah" },
  { value: "price-high", label: "Termahal" },
  { value: "rating", label: "Rating" },
];

const filterHighlights = [
  { label: "Gratis Ongkir", icon: FiTruck },
  { label: "Pasti Ori", icon: FiShield },
  { label: "Flash Sale", icon: FiZap },
];

function soldLabel(sold: number) {
  if (sold >= 10000) return "10RB+ terjual";
  if (sold >= 1000) return `${Math.floor(sold / 1000)}RB+ terjual`;
  return `${sold} terjual`;
}

function getOriginalPrice(price: number, index: number) {
  return Math.round(price * (1.16 + (index % 5) * 0.04));
}

function getDiscount(price: number, original: number) {
  return Math.max(4, Math.round(((original - price) / original) * 100));
}

export default function BrowsePage() {
  const [selectedCategory, setSelectedCategory] = useState("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    if (!showMobileFilters) {
      document.body.style.overflow = "";
      return;
    }

    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (mediaQuery.matches) {
        setShowMobileFilters(false);
      }
    };

    closeOnDesktop();
    document.body.style.overflow = "hidden";
    mediaQuery.addEventListener("change", closeOnDesktop);

    return () => {
      document.body.style.overflow = "";
      mediaQuery.removeEventListener("change", closeOnDesktop);
    };
  }, [showMobileFilters]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");
    const sortParam = searchParams.get("sort");

    if (categoryParam) setSelectedCategory(categoryParam);
    if (searchParam) setSearchQuery(searchParam);
    if (sortParam && sortOptions.some((option) => option.value === sortParam)) {
      setSortBy(sortParam);
    }
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Kategori gagal dimuat");
        }

        setCategories([...defaultCategories, ...data.categories]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Kategori gagal dimuat");
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();

        if (searchQuery.trim()) {
          params.set("search", searchQuery.trim());
        }

        if (selectedCategory !== "semua") {
          params.set("category", selectedCategory);
        }

        params.set("sort", sortBy);

        const response = await fetch(`/api/products?${params.toString()}`, {
          signal: controller.signal,
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Produk gagal dimuat");
        }

        setProducts(data.products);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Produk gagal dimuat");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();

    return () => controller.abort();
  }, [searchQuery, selectedCategory, sortBy]);

  const activeCategoryName = useMemo(() => {
    return categories.find((category) => category.slug === selectedCategory)?.name || "Semua Produk";
  }, [categories, selectedCategory]);

  const resultLabel = useMemo(() => {
    if (loading) return "Memuat produk...";
    if (products.length === 0) return "Produk tidak ditemukan";
    return `${products.length} produk ditemukan`;
  }, [loading, products.length]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("semua");
    setSortBy("popular");
  };

  const filterPanel = (
    <div className="rounded-lg border border-marketplace-line bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-base font-extrabold">
          <FiFilter className="text-marketplace-green" /> Filter
        </h2>
        <button
          onClick={clearFilters}
          className="text-xs font-bold text-marketplace-orange hover:text-marketplace-orangeDark"
        >
          Reset
        </button>
      </div>

      <div className="mt-5">
        <p className="mb-3 text-sm font-extrabold text-gray-800">Kategori</p>
        <div className="grid gap-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.slug);
                setShowMobileFilters(false);
              }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                selectedCategory === category.slug
                  ? "bg-emerald-50 text-marketplace-green"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="flex min-w-0 items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-gray-100 text-xs font-extrabold text-gray-700">
                  {category.icon || category.name.slice(0, 1)}
                </span>
                <span className="truncate">{category.name}</span>
              </span>
              {category.products > 0 && (
                <span className="ml-2 text-xs text-gray-400">{category.products}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-sm font-extrabold text-gray-800">Keunggulan</p>
        <div className="grid gap-2">
          {filterHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <label
                key={item.label}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-marketplace-line px-3 py-2 text-sm font-semibold text-gray-700 hover:border-marketplace-green"
              >
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-marketplace-green" />
                <Icon className="text-marketplace-green" />
                {item.label}
              </label>
            );
          })}
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-orange-50 p-3">
        <p className="text-sm font-extrabold text-marketplace-orange">Voucher siap pakai</p>
        <p className="mt-1 text-xs font-medium text-orange-700">
          Gunakan label promo di kartu produk untuk menonjolkan diskon dan ongkir.
        </p>
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-marketplace-canvas">
        <section className="border-b border-marketplace-line bg-white">
          <div className="container mx-auto px-4 py-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-bold text-marketplace-green">Belanja Online</p>
                <h1 className="mt-1 text-2xl font-extrabold md:text-3xl">{activeCategoryName}</h1>
                <p className="mt-1 text-sm font-medium text-gray-500">{resultLabel}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-lg border border-marketplace-line bg-gray-50 px-4 lg:w-[380px]">
                  <FiSearch className="shrink-0 text-marketplace-orange" />
                  <input
                    type="text"
                    placeholder="Cari produk, toko, kategori..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="w-full border-0 bg-transparent px-0 py-3 text-sm focus:border-0 focus:ring-0"
                  />
                </div>
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-marketplace-line bg-white px-4 text-sm font-bold text-gray-700 lg:hidden"
                >
                  <FiFilter /> Filter
                </button>
              </div>
            </div>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
              {categories.slice(0, 10).map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition ${
                    selectedCategory === category.slug
                      ? "border-marketplace-green bg-marketplace-green text-white"
                      : "border-marketplace-line bg-white text-gray-700 hover:border-marketplace-green hover:text-marketplace-green"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="py-5">
          <div className="container mx-auto px-4">
            <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
              <aside className="hidden lg:block">{filterPanel}</aside>

              <div>
                <div className="mb-4 rounded-lg border border-marketplace-line bg-white p-3 shadow-sm">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-gray-600">Urutkan:</span>
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setSortBy(option.value)}
                          className={`rounded-lg px-3 py-2 text-sm font-bold ${
                            sortBy === option.value
                              ? "bg-marketplace-orange text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-marketplace-orange"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                    <button className="inline-flex items-center gap-2 rounded-lg border border-marketplace-line px-3 py-2 text-sm font-bold text-gray-700">
                      Lokasi <FiChevronDown />
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                    {error}
                  </div>
                )}

                {loading ? (
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                    {[...Array(8)].map((_, index) => (
                      <div key={index} className="overflow-hidden rounded-lg border border-marketplace-line bg-white">
                        <div className="aspect-square animate-pulse bg-gray-100" />
                        <div className="space-y-3 p-3">
                          <div className="h-4 animate-pulse rounded bg-gray-100" />
                          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
                          <div className="h-5 w-1/2 animate-pulse rounded bg-gray-100" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : products.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
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
                            {index % 4 === 0 && (
                              <span className="absolute left-2 top-2 rounded bg-marketplace-blue px-2 py-1 text-[10px] font-extrabold text-white">
                                Pasti Ori
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
                            <h2 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-gray-800">
                              {product.name}
                            </h2>
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
                ) : (
                  <div className="rounded-lg border border-marketplace-line bg-white p-12 text-center shadow-sm">
                    <p className="text-lg font-extrabold text-gray-800">Produk tidak ditemukan</p>
                    <p className="mt-2 text-sm text-gray-500">Coba kata kunci atau kategori lain.</p>
                    <button
                      onClick={clearFilters}
                      className="mt-5 rounded-lg bg-marketplace-orange px-5 py-2 text-sm font-bold text-white"
                    >
                      Reset Pencarian
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {showMobileFilters && (
          <div
            className="fixed inset-0 z-[60] bg-gray-900/40 lg:hidden"
            onClick={() => setShowMobileFilters(false)}
          >
            <div
              className="ml-auto h-full w-full max-w-sm overflow-y-auto bg-marketplace-canvas p-4 shadow-xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-extrabold">Filter Produk</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-700"
                  aria-label="Tutup filter"
                >
                  <FiX />
                </button>
              </div>
              {filterPanel}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

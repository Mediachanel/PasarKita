"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FiHeart, FiShare2, FiStar } from "react-icons/fi";
import { rupiah } from "@/lib/marketplace";

interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

interface ProductDetail {
  id: string;
  name: string;
  store: {
    name: string;
    slug: string;
  };
  price: number;
  originalPrice: number;
  image: string;
  imageUrl: string | null;
  images: string[];
  rating: number;
  reviews: number;
  reviewItems: ReviewItem[];
  sold: number;
  stock: number;
  category: {
    name: string;
    slug: string;
  };
  description: string | null;
  specifications: Record<string, string>;
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [productDetail, setProductDetail] = useState<ProductDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/products/${productId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Produk tidak ditemukan");
        }

        setProductDetail(data.product);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Detail produk gagal dimuat"
        );
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const discount = useMemo(() => {
    if (!productDetail || productDetail.originalPrice <= productDetail.price) {
      return 0;
    }

    return Math.round(
      ((productDetail.originalPrice - productDetail.price) /
        productDetail.originalPrice) *
        100
    );
  }, [productDetail]);

  const handleAddToCart = () => {
    if (!productDetail) return;

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = existingCart.find(
      (item: { id: string }) => item.id === productDetail.id
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.imageUrl = productDetail.imageUrl;
      existingItem.image = productDetail.image;
    } else {
      existingCart.push({
        id: productDetail.id,
        name: productDetail.name,
        price: productDetail.price,
        image: productDetail.image,
        imageUrl: productDetail.imageUrl,
        quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    router.push("/cart");
  };

  const handleAddToWishlist = () => {
    if (!productDetail) return;

    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const exists = wishlist.some(
      (item: { id: string }) => item.id === productDetail.id
    );

    if (!exists) {
      wishlist.push({
        id: productDetail.id,
        name: productDetail.name,
        price: productDetail.price,
        image: productDetail.image,
        imageUrl: productDetail.imageUrl,
        store: productDetail.store.name,
      });
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-cream py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card aspect-square bg-brown-100 animate-pulse" />
              <div className="card p-6 space-y-4">
                <div className="h-8 bg-brown-100 rounded animate-pulse" />
                <div className="h-5 w-1/2 bg-brown-100 rounded animate-pulse" />
                <div className="h-12 w-2/3 bg-brown-100 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !productDetail) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-cream py-16">
          <div className="container mx-auto px-4 max-w-lg">
            <div className="card p-8 text-center">
              <h1 className="text-2xl font-bold mb-3">Produk tidak tersedia</h1>
              <p className="text-gray-600 mb-6">
                {error || "Produk yang Anda cari tidak ditemukan."}
              </p>
              <Link href="/browse" className="btn-primary">
                Kembali Belanja
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-6 text-sm">
            <Link href="/browse" className="text-brown-600 hover:text-brown-700">
              Belanja
            </Link>
            <span>/</span>
            <Link
              href={`/browse?category=${productDetail.category.slug}`}
              className="text-brown-600 hover:text-brown-700"
            >
              {productDetail.category.name}
            </Link>
            <span>/</span>
            <span className="text-gray-600">{productDetail.name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <div className="card p-6 mb-4">
                {productDetail.images[selectedImage] ? (
                  <div
                    className="w-full aspect-square rounded-lg bg-brown-100 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${productDetail.images[selectedImage]})`,
                    }}
                    aria-label={productDetail.name}
                  />
                ) : (
                  <div className="w-full aspect-square bg-gradient-to-br from-brown-100 to-brown-200 rounded-lg flex items-center justify-center text-9xl">
                    {productDetail.image}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {productDetail.images.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    onClick={() => setSelectedImage(idx)}
                    className={`card w-20 h-20 flex items-center justify-center text-4xl cursor-pointer transition ${
                      selectedImage === idx
                        ? "border-2 border-brown-600"
                        : "border border-brown-200"
                    }`}
                    style={{
                      backgroundImage: `url(${img})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    aria-label={`Gambar produk ${idx + 1}`}
                  >
                    <span className="sr-only">Gambar {idx + 1}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-2">{productDetail.name}</h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <FiStar className="text-yellow-400 fill-current" />
                  <span className="font-bold">{productDetail.rating}</span>
                  <span className="text-gray-600">
                    ({productDetail.reviews} ulasan)
                  </span>
                </div>
                <span className="text-gray-600">•</span>
                <span className="text-gray-600">
                  {productDetail.sold} terjual
                </span>
              </div>

              <div className="card p-4 mb-6">
                <p className="text-sm text-gray-600">Toko</p>
                <Link
                  href="/browse"
                  className="font-bold text-brown-600 hover:text-brown-700"
                >
                  {productDetail.store.name}
                </Link>
              </div>

              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="text-4xl font-bold text-brown-600">
                    {rupiah(productDetail.price)}
                  </span>
                  {discount > 0 && (
                    <>
                      <span className="text-lg text-gray-400 line-through">
                        {rupiah(productDetail.originalPrice)}
                      </span>
                      <span className="badge-primary">{discount}%</span>
                    </>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold mb-3">Jumlah</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-brown-200 rounded-lg hover:bg-brown-50"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(productDetail.stock, quantity + 1))
                    }
                    className="w-10 h-10 border border-brown-200 rounded-lg hover:bg-brown-50"
                  >
                    +
                  </button>
                  <span className="text-gray-600 text-sm">
                    Stok tersedia: {productDetail.stock}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 btn-primary"
                  disabled={productDetail.stock < 1}
                >
                  {productDetail.stock < 1
                    ? "Stok Habis"
                    : "Masukkan Keranjang"}
                </button>
                <button
                  onClick={handleAddToWishlist}
                  className="btn-outline"
                  aria-label="Tambah wishlist"
                >
                  <FiHeart />
                </button>
                <button className="btn-outline" aria-label="Bagikan produk">
                  <FiShare2 />
                </button>
              </div>

              <div className="card p-6">
                <h3 className="font-bold mb-4">Spesifikasi</h3>
                <div className="space-y-3">
                  {Object.entries(productDetail.specifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between border-b border-brown-100 pb-3"
                      >
                        <span className="text-gray-600">{key}</span>
                        <span className="font-semibold">{value}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6 mb-12">
            <h2 className="text-2xl font-bold mb-4">Deskripsi Produk</h2>
            <p className="text-gray-700 leading-relaxed">
              {productDetail.description || "Belum ada deskripsi produk."}
            </p>
          </div>

          <div className="card p-6">
            <h2 className="text-2xl font-bold mb-6">
              Ulasan ({productDetail.reviews})
            </h2>

            {productDetail.reviewItems.length > 0 ? (
              <div className="space-y-6">
                {productDetail.reviewItems.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-brown-100 pb-6"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold">{review.author}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`text-sm ${
                                i < review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                Belum ada ulasan untuk produk ini.
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

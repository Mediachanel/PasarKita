"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FiHeart, FiShoppingCart, FiTrash2 } from "react-icons/fi";
import { rupiah } from "@/lib/marketplace";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  imageUrl?: string | null;
  store?: string;
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    setItems(JSON.parse(localStorage.getItem("wishlist") || "[]"));
  }, []);

  const removeItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const addToCart = (item: WishlistItem) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]") as Array<
      WishlistItem & { quantity?: number }
    >;
    const existingItem = cart.find((cartItem) => {
      return cartItem.id === item.id;
    });

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity ?? 1) + 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Wishlist</h1>

          {items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div key={item.id} className="card overflow-hidden">
                  <Link href={`/product/${item.id}`}>
                    {item.imageUrl ? (
                      <div
                        className="h-44 bg-brown-100 bg-cover bg-center"
                        style={{ backgroundImage: `url(${item.imageUrl})` }}
                      />
                    ) : (
                      <div className="h-44 bg-gradient-to-br from-brown-100 to-brown-200 flex items-center justify-center text-6xl">
                        {item.image}
                      </div>
                    )}
                  </Link>
                  <div className="p-4">
                    <h2 className="font-bold mb-2">{item.name}</h2>
                    <p className="text-xs text-gray-500 mb-3">
                      {item.store || "Pasar Kita"}
                    </p>
                    <p className="text-brown-600 font-bold mb-4">
                      {rupiah(item.price)}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => addToCart(item)}
                        className="btn-primary flex-1 flex items-center justify-center gap-2"
                      >
                        <FiShoppingCart /> Keranjang
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="btn-outline px-4"
                        aria-label="Hapus wishlist"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <FiHeart className="text-5xl text-brown-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-6">
                Wishlist Anda masih kosong.
              </p>
              <Link href="/browse" className="btn-primary">
                Temukan Produk Favorit
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

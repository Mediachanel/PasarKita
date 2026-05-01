"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import { rupiah } from "@/lib/marketplace";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  imageUrl?: string | null;
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }

    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (id: string) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = cartItems.length > 0 ? 25000 : 0;
  const total = subtotal + shipping;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Keranjang Belanja</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {cartItems.length > 0 ? (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="card p-4 flex gap-4">
                      {item.imageUrl ? (
                        <div
                          className="w-24 h-24 bg-brown-100 rounded-lg bg-cover bg-center flex-shrink-0"
                          style={{ backgroundImage: `url(${item.imageUrl})` }}
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gradient-to-br from-brown-100 to-brown-200 rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
                          {item.image}
                        </div>
                      )}

                      <div className="flex-1">
                        <h3 className="font-bold mb-2">{item.name}</h3>
                        <p className="text-brown-600 font-semibold mb-3">
                          {rupiah(item.price)}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-8 h-8 border border-brown-200 rounded flex items-center justify-center hover:bg-brown-50"
                            >
                              <FiMinus size={16} />
                            </button>
                            <span className="w-8 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-8 h-8 border border-brown-200 rounded flex items-center justify-center hover:bg-brown-50"
                            >
                              <FiPlus size={16} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-lg">
                          {rupiah(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card p-12 text-center">
                  <p className="text-gray-500 text-lg mb-6">
                    Keranjang Anda kosong
                  </p>
                  <Link href="/browse" className="btn-primary">
                    Mulai Belanja
                  </Link>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-20">
                <h2 className="font-bold text-lg mb-4">Ringkasan Pesanan</h2>

                <div className="space-y-3 mb-6 border-b border-brown-200 pb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{rupiah(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ongkir</span>
                    <span>{rupiah(shipping)}</span>
                  </div>
                </div>

                <div className="flex justify-between mb-6 text-lg font-bold">
                  <span>Total</span>
                  <span>{rupiah(total)}</span>
                </div>

                {cartItems.length > 0 && (
                  <button
                    onClick={() => router.push("/checkout")}
                    className="w-full btn-primary"
                  >
                    Lanjut Checkout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

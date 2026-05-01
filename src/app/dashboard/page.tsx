"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  FiHeart,
  FiBell,
  FiMessageCircle,
  FiPackage,
  FiShoppingCart,
  FiStar,
} from "react-icons/fi";
import { humanizeStatus, rupiah } from "@/lib/marketplace";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  date: string;
  itemCount: number;
}

export default function BuyerDashboardPage() {
  const [user, setUser] = useState<{ id?: string; name?: string } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    setUser(parsedUser);

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setCartCount(
      cart.reduce((total: number, item: { quantity?: number }) => {
        return total + (item.quantity ?? 1);
      }, 0)
    );
    setWishlistCount(wishlist.length);

    const loadOrders = async () => {
      const params = new URLSearchParams();
      if (parsedUser?.id) params.set("userId", parsedUser.id);

      const response = await fetch(`/api/orders?${params.toString()}`);
      if (!response.ok) return;

      const data = await response.json();
      setOrders(data.orders);
    };

    loadOrders();
  }, []);

  const totalSpent = useMemo(() => {
    return orders.reduce((sum, order) => sum + order.total, 0);
  }, [orders]);

  const pendingOrders = orders.filter(
    (order) => order.status === "pending_payment"
  ).length;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Halo, {user?.name || "Pembeli"}
            </h1>
            <p className="text-gray-600">
              Pantau belanja, pesanan, wishlist, dan pesan toko dari satu tempat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                label: "Pesanan",
                value: orders.length,
                icon: FiPackage,
                href: "/orders",
              },
              {
                label: "Menunggu Bayar",
                value: pendingOrders,
                icon: FiShoppingCart,
                href: "/orders",
              },
              {
                label: "Wishlist",
                value: wishlistCount,
                icon: FiHeart,
                href: "/wishlist",
              },
              {
                label: "Isi Keranjang",
                value: cartCount,
                icon: FiShoppingCart,
                href: "/cart",
              },
              {
                label: "Notifikasi",
                value: pendingOrders,
                icon: FiBell,
                href: "/orders",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.label} href={item.href} className="card p-6">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-sm font-semibold text-gray-600">
                      {item.label}
                    </p>
                    <Icon className="text-2xl text-brown-600" />
                  </div>
                  <p className="text-3xl font-bold text-brown-700">
                    {item.value}
                  </p>
                </Link>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">Aksi Cepat</h2>
              <div className="space-y-3">
                <Link
                  href="/browse"
                  className="flex items-center gap-3 p-4 rounded-lg hover:bg-brown-50"
                >
                  <FiShoppingCart className="text-brown-600" />
                  <span className="font-semibold">Belanja Produk Lokal</span>
                </Link>
                <Link
                  href="/chat"
                  className="flex items-center gap-3 p-4 rounded-lg hover:bg-brown-50"
                >
                  <FiMessageCircle className="text-brown-600" />
                  <span className="font-semibold">Chat dengan Penjual</span>
                </Link>
                <Link
                  href="/orders"
                  className="flex items-center gap-3 p-4 rounded-lg hover:bg-brown-50"
                >
                  <FiPackage className="text-brown-600" />
                  <span className="font-semibold">Tracking Pesanan</span>
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-3 p-4 rounded-lg hover:bg-brown-50"
                >
                  <FiStar className="text-brown-600" />
                  <span className="font-semibold">Profil dan Alamat</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-2 card p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Pesanan Terbaru</h2>
                <p className="font-bold text-brown-600">
                  {rupiah(totalSpent)}
                </p>
              </div>

              {orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <Link
                      key={order.id}
                      href={`/order/${order.id}`}
                      className="flex justify-between items-center p-4 border border-brown-100 rounded-lg hover:bg-brown-50"
                    >
                      <div>
                        <p className="font-semibold">{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">
                          {order.itemCount} produk •{" "}
                          {new Date(order.date).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-brown-600">
                          {rupiah(order.total)}
                        </p>
                        <p className="text-xs text-gray-600">
                          {humanizeStatus(order.status)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-600 mb-4">
                    Belum ada pesanan yang tercatat.
                  </p>
                  <Link href="/browse" className="btn-primary">
                    Mulai Belanja
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

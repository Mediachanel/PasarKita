"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FiEye } from "react-icons/fi";
import { humanizeStatus, rupiah, statusBadgeClass } from "@/lib/marketplace";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  date: string;
  itemCount: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError("");

      try {
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        const params = new URLSearchParams();

        if (user?.id) {
          params.set("userId", user.id);
        }

        const response = await fetch(`/api/orders?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Pesanan gagal dimuat");
        }

        setOrders(
          data.orders.map((order: Order) => ({
            ...order,
            date: new Date(order.date).toLocaleDateString("id-ID"),
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Pesanan gagal dimuat");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Pesanan Saya</h1>

          {error && (
            <div className="card p-6 mb-6 border-red-200 bg-red-50 text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="card p-6 space-y-4">
                  <div className="h-5 w-1/3 bg-brown-100 rounded animate-pulse" />
                  <div className="h-12 bg-brown-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="card p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Nomor Pesanan</p>
                      <p className="font-bold text-lg">{order.orderNumber}</p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full border font-semibold text-sm ${statusBadgeClass(order.status)}`}
                    >
                      {humanizeStatus(order.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 py-4 border-y border-brown-200">
                    <div>
                      <p className="text-sm text-gray-600">Jumlah Item</p>
                      <p className="font-semibold">{order.itemCount} produk</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="font-bold text-brown-600">
                        {rupiah(order.total)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tanggal</p>
                      <p className="font-semibold">{order.date}</p>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <Link
                      href={`/order/${order.id}`}
                      className="flex items-center gap-2 text-brown-600 hover:text-brown-700 font-semibold"
                    >
                      <FiEye /> Lihat Ringkasan
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <p className="text-gray-600 text-lg mb-6">
                Anda belum memiliki pesanan
              </p>
              <Link href="/browse" className="btn-primary">
                Mulai Belanja
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

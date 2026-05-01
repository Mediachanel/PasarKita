"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { rupiah } from "@/lib/marketplace";

interface SellerOrder {
  id: string;
  status: string;
  paymentStatus: string;
  total: number;
  items: Array<{
    storeId: string;
    quantity: number;
    price: number;
  }>;
}

export default function SellerReportsPage() {
  const [orders, setOrders] = useState<SellerOrder[]>([]);

  useEffect(() => {
    const loadOrders = async () => {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const params = new URLSearchParams();
      if (user?.store?.id) params.set("storeId", user.store.id);

      const response = await fetch(`/api/orders?${params.toString()}`);
      const data = await response.json();
      if (response.ok) setOrders(data.orders);
    };

    loadOrders();
  }, []);

  const report = useMemo(() => {
    const completedOrders = orders.filter(
      (order) => order.paymentStatus === "completed"
    );

    return {
      revenue: completedOrders.reduce((sum, order) => sum + order.total, 0),
      orders: orders.length,
      completed: completedOrders.length,
      pending: orders.filter((order) => order.paymentStatus === "pending")
        .length,
    };
  }, [orders]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Laporan Penjualan</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card p-6">
              <p className="text-sm text-gray-600 mb-2">Revenue Cair</p>
              <p className="text-2xl font-bold text-brown-700">
                {rupiah(report.revenue)}
              </p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-gray-600 mb-2">Total Order</p>
              <p className="text-2xl font-bold text-brown-700">
                {report.orders}
              </p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-gray-600 mb-2">Selesai</p>
              <p className="text-2xl font-bold text-brown-700">
                {report.completed}
              </p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-gray-600 mb-2">Pending</p>
              <p className="text-2xl font-bold text-brown-700">
                {report.pending}
              </p>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4">Ringkasan Bisnis</h2>
            <p className="text-gray-700">
              Dana dari pesanan yang sudah dibayar akan ditahan sementara oleh
              sistem, lalu diteruskan ke penjual saat pembeli mengonfirmasi
              barang diterima.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

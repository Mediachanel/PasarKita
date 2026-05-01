"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  FiBarChart2,
  FiShoppingBag,
  FiUsers,
  FiTrendingUp,
  FiPlus,
} from "react-icons/fi";
import { humanizeStatus, rupiah, statusBadgeClass } from "@/lib/marketplace";

interface Product {
  id: string;
  name: string;
  stock: number;
  sold: number;
  rating: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  customer?: {
    name: string;
  };
  items: Array<{
    productName: string;
    storeId: string;
  }>;
}

export default function SellerDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const currentStoreId = user?.store?.id ?? "";

    const params = new URLSearchParams();
    if (currentStoreId) params.set("storeId", currentStoreId);

    Promise.allSettled([
      fetch(`/api/products?${params.toString()}`),
      fetch(`/api/orders?${params.toString()}`),
    ]).then(async ([productResponse, orderResponse]) => {
      if (productResponse.status === "fulfilled" && productResponse.value.ok) {
        const data = await productResponse.value.json();
        setProducts(data.products ?? []);
      }

      if (orderResponse.status === "fulfilled" && orderResponse.value.ok) {
        const data = await orderResponse.value.json();
        setOrders(data.orders ?? []);
      }
    });
  }, []);

  const dashboard = useMemo(() => {
    const paidOrders = orders.filter(
      (order) => order.paymentStatus === "completed"
    );
    const revenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
    const uniqueCustomers = new Set(
      orders.map((order) => order.customer?.name).filter(Boolean)
    ).size;
    const averageRating =
      products.length > 0
        ? products.reduce((sum, product) => sum + product.rating, 0) /
          products.length
        : 0;

    return {
      revenue,
      orders: orders.length,
      uniqueCustomers,
      averageRating,
      lowStock: products.filter((product) => product.stock < 10).length,
    };
  }, [orders, products]);

  const stats = [
    {
      title: "Total Penjualan",
      value: rupiah(dashboard.revenue),
      icon: FiBarChart2,
    },
    {
      title: "Pesanan Masuk",
      value: String(dashboard.orders),
      icon: FiShoppingBag,
    },
    {
      title: "Pembeli Unik",
      value: String(dashboard.uniqueCustomers),
      icon: FiUsers,
    },
    {
      title: "Rating Produk",
      value:
        dashboard.averageRating > 0
          ? `${dashboard.averageRating.toFixed(1)} / 5`
          : "-",
      icon: FiTrendingUp,
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-8">
        <div className="container mx-auto px-4">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard Toko</h1>
            <p className="text-gray-600">
              Kelola toko dan produk Anda di Pasar Kita
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="card p-6 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-gray-600 text-sm font-semibold">
                      {stat.title}
                    </h3>
                    <Icon className="text-2xl text-brown-600" />
                  </div>
                  <p className="text-3xl font-bold text-brown-700">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">Aksi Cepat</h2>
              <div className="space-y-3">
                <Link
                  href="/seller/products/new"
                  className="flex items-center gap-3 p-4 rounded-lg hover:bg-brown-50 transition"
                >
                  <FiPlus className="text-brown-600 text-xl" />
                  <span className="font-semibold">Tambah Produk</span>
                </Link>
                <Link
                  href="/seller/orders"
                  className="flex items-center gap-3 p-4 rounded-lg hover:bg-brown-50 transition"
                >
                  <FiShoppingBag className="text-brown-600 text-xl" />
                  <span className="font-semibold">
                    Pesanan Masuk ({dashboard.orders})
                  </span>
                </Link>
                <Link
                  href="/seller/products"
                  className="flex items-center gap-3 p-4 rounded-lg hover:bg-brown-50 transition"
                >
                  <FiBarChart2 className="text-brown-600 text-xl" />
                  <span className="font-semibold">
                    Kelola Produk ({products.length})
                  </span>
                </Link>
                <Link
                  href="/seller/vouchers"
                  className="flex items-center gap-3 p-4 rounded-lg hover:bg-brown-50 transition"
                >
                  <FiTrendingUp className="text-brown-600 text-xl" />
                  <span className="font-semibold">Voucher Toko</span>
                </Link>
                <Link
                  href="/seller/reports"
                  className="flex items-center gap-3 p-4 rounded-lg hover:bg-brown-50 transition"
                >
                  <FiBarChart2 className="text-brown-600 text-xl" />
                  <span className="font-semibold">Laporan Penjualan</span>
                </Link>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="lg:col-span-2 card p-6">
              <h2 className="text-xl font-bold mb-4">Pesanan Terbaru</h2>
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex justify-between items-center p-4 border border-brown-100 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">
                        {order.customer?.name || "Pembeli"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.items[0]?.productName || "Produk toko"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-brown-600">
                        {rupiah(order.total)}
                      </p>
                      <span
                        className={`rounded-full border px-2 py-1 text-xs font-semibold ${statusBadgeClass(order.status)}`}
                      >
                        {humanizeStatus(order.status)}
                      </span>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <div className="rounded-lg border border-brown-100 p-5 text-gray-600">
                    Belum ada pesanan masuk untuk toko ini.
                  </div>
                )}
              </div>
            </div>
          </div>

          {dashboard.lowStock > 0 && (
            <div className="card mt-8 border-amber-200 bg-amber-50 p-6 text-amber-900">
              <p className="font-bold">{dashboard.lowStock} produk stok rendah</p>
              <p className="mt-1 text-sm">
                Perbarui stok agar produk tetap tampil siap dibeli.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

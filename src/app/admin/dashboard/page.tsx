"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  FiUsers,
  FiShoppingBag,
  FiBarChart2,
  FiDollarSign,
  FiAlertCircle,
} from "react-icons/fi";
import { humanizeStatus, rupiah, statusBadgeClass } from "@/lib/marketplace";

interface UserRow {
  id: string;
  name: string;
  role: string;
  createdAt: string;
}

interface ProductRow {
  id: string;
  name: string;
  stock: number;
}

interface OrderRow {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  shippingStatus: string;
  total: number;
  date: string;
}

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);

  useEffect(() => {
    Promise.allSettled([
      fetch("/api/users"),
      fetch("/api/products"),
      fetch("/api/orders"),
    ]).then(async ([usersResponse, productsResponse, ordersResponse]) => {
      if (usersResponse.status === "fulfilled" && usersResponse.value.ok) {
        const data = await usersResponse.value.json();
        setUsers(data.users ?? []);
      }

      if (
        productsResponse.status === "fulfilled" &&
        productsResponse.value.ok
      ) {
        const data = await productsResponse.value.json();
        setProducts(data.products ?? []);
      }

      if (ordersResponse.status === "fulfilled" && ordersResponse.value.ok) {
        const data = await ordersResponse.value.json();
        setOrders(data.orders ?? []);
      }
    });
  }, []);

  const report = useMemo(() => {
    return {
      users: users.length,
      sellers: users.filter((user) => user.role === "SELLER").length,
      products: products.length,
      orders: orders.length,
      revenue: orders
        .filter((order) => order.paymentStatus === "completed")
        .reduce((sum, order) => sum + order.total, 0),
      pendingPayments: orders.filter(
        (order) => order.paymentStatus === "pending"
      ).length,
      shippingMonitoring: orders.filter((order) =>
        ["shipped", "in_transit"].includes(order.shippingStatus)
      ).length,
      lowStock: products.filter((product) => product.stock < 10).length,
    };
  }, [orders, products, users]);

  const adminStats = [
    {
      title: "Total User",
      value: String(report.users),
      icon: FiUsers,
      change: `${report.sellers} seller`,
    },
    {
      title: "Total Transaksi",
      value: String(report.orders),
      icon: FiShoppingBag,
      change: `${report.pendingPayments} pending`,
    },
    {
      title: "Revenue",
      value: rupiah(report.revenue),
      icon: FiDollarSign,
      change: "escrow marketplace",
    },
    {
      title: "Produk Aktif",
      value: String(report.products),
      icon: FiBarChart2,
      change: `${report.lowStock} stok rendah`,
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Monitoring dan kelola sistem Pasar Kita</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {adminStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="card p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-gray-600 text-sm font-semibold">
                      {stat.title}
                    </h3>
                    <Icon className="text-2xl text-brown-600" />
                  </div>
                  <p className="text-3xl font-bold text-brown-700 mb-2">
                    {stat.value}
                  </p>
                  <p className="text-sm text-emerald-700 font-semibold">
                    {stat.change}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Management Menu */}
            <div className="lg:col-span-1">
              <div className="card p-6">
                <h2 className="text-xl font-bold mb-4">Manajemen</h2>
                <div className="space-y-3">
                  {[
                    { label: "Kelola User", href: "/admin/users" },
                    { label: "Kelola Seller", href: "/admin/sellers" },
                    { label: "Kelola Produk", href: "/admin/products" },
                    { label: "Kelola Kategori", href: "/admin/categories" },
                    { label: "Kelola Transaksi", href: "/admin/transactions" },
                    { label: "Kelola Banner", href: "/admin/banners" },
                  ].map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      className="block p-3 rounded-lg hover:bg-brown-50 transition text-brown-600 font-semibold"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="lg:col-span-2">
              <div className="card p-6">
                <h2 className="text-xl font-bold mb-4">Aktivitas Terbaru</h2>
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="flex gap-3 items-start p-4 border border-brown-100 rounded-lg"
                    >
                      <div className="text-2xl">
                        <FiShoppingBag className="text-brown-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">
                          {rupiah(order.total)} -{" "}
                          {new Date(order.date).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusBadgeClass(order.status)}`}
                      >
                        {humanizeStatus(order.status)}
                      </span>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <div className="rounded-lg border border-brown-100 p-5 text-gray-600">
                      Belum ada transaksi yang tercatat.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mt-8 lg:grid-cols-3">
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">Monitoring Pembayaran</h2>
              <p className="text-3xl font-bold text-brown-700">
                {report.pendingPayments}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Transaksi menunggu konfirmasi pembayaran.
              </p>
            </div>
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">Monitoring Pengiriman</h2>
              <p className="text-3xl font-bold text-brown-700">
                {report.shippingMonitoring}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Paket dalam status dikirim atau perjalanan.
              </p>
            </div>
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">Laporan Sistem</h2>
              <p className="text-3xl font-bold text-brown-700">
                {report.lowStock}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Produk perlu perhatian stok.
              </p>
            </div>
          </div>

          <div className="card p-6 mt-8 bg-yellow-50 border-l-4 border-yellow-400">
            <div className="flex gap-4">
              <FiAlertCircle className="text-yellow-600 text-2xl flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-yellow-900 mb-2">
                  Ringkasan Operasional
                </h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>Pembayaran pending: {report.pendingPayments} transaksi</li>
                  <li>Pengiriman aktif: {report.shippingMonitoring} paket</li>
                  <li>Stok rendah: {report.lowStock} produk</li>
                </ul>
                      </div>
                    </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

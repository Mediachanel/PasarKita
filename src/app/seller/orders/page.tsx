"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FiEye, FiTruck } from "react-icons/fi";
import {
  humanizeStatus,
  paymentStatusLabels,
  rupiah,
  shippingStatusLabels,
  statusBadgeClass,
} from "@/lib/marketplace";

interface SellerOrder {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  shippingStatus: string;
  total: number;
  date: string;
  customer?: {
    name: string;
  };
  items: Array<{
    productName: string;
    quantity: number;
    storeId: string;
  }>;
}

export default function SellerOrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [storeId, setStoreId] = useState("");

  const loadOrders = async (currentStoreId: string, status = selectedStatus) => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (currentStoreId) params.set("storeId", currentStoreId);
      if (status !== "all") params.set("status", status);

      const response = await fetch(`/api/orders?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Pesanan gagal dimuat");
      }

      setOrders(data.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pesanan gagal dimuat");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const currentStoreId = user?.store?.id ?? "";
    setStoreId(currentStoreId);
    loadOrders(currentStoreId);
  }, []);

  const visibleOrders = useMemo(() => {
    return orders.map((order) => ({
      ...order,
      sellerItems: storeId
        ? order.items.filter((item) => item.storeId === storeId)
        : order.items,
    }));
  }, [orders, storeId]);

  const updateOrderStatus = async (orderId: string, payload: Record<string, string>) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Status gagal diperbarui");
      }

      loadOrders(storeId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status gagal diperbarui");
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Pesanan Masuk</h1>

          <div className="card p-6 mb-8 flex gap-4 flex-wrap">
            {[
              { label: "Semua", value: "all" },
              { label: "Menunggu Pembayaran", value: "pending_payment" },
              { label: "Dikonfirmasi", value: "payment_confirmed" },
              { label: "Diproses", value: "processing" },
              { label: "Dikirim", value: "shipped" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => {
                  setSelectedStatus(filter.value);
                  loadOrders(storeId, filter.value);
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedStatus === filter.value
                    ? "bg-brown-600 text-white"
                    : "bg-brown-100 text-brown-700 hover:bg-brown-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="card p-4 mb-6 border-red-200 bg-red-50 text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {loading ? (
              <div className="card p-8">Memuat pesanan...</div>
            ) : visibleOrders.length > 0 ? (
              visibleOrders.map((order) => (
                <div key={order.id} className="card p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Nomor Pesanan
                      </p>
                      <p className="font-bold">{order.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Pelanggan</p>
                      <p className="font-semibold">
                        {order.customer?.name || "Pembeli"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Produk</p>
                      <p className="font-semibold">
                        {order.sellerItems[0]?.productName || "Produk toko"}{" "}
                        {order.sellerItems.length > 1
                          ? `+${order.sellerItems.length - 1}`
                          : ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total</p>
                      <p className="font-bold text-brown-600">
                        {rupiah(order.total)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between gap-4 pt-4 border-t border-brown-200">
                    <div className="flex gap-2 flex-wrap">
                      <span
                        className={`rounded-full border px-3 py-1 text-sm font-semibold ${statusBadgeClass(order.status)}`}
                      >
                        {humanizeStatus(order.status)}
                      </span>
                      <span
                        className={`rounded-full border px-3 py-1 text-sm font-semibold ${statusBadgeClass(order.paymentStatus)}`}
                      >
                        bayar: {humanizeStatus(order.paymentStatus, paymentStatusLabels)}
                      </span>
                      <span
                        className={`rounded-full border px-3 py-1 text-sm font-semibold ${statusBadgeClass(order.shippingStatus)}`}
                      >
                        kirim: {humanizeStatus(order.shippingStatus, shippingStatusLabels)}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      {order.paymentStatus === "completed" &&
                        order.shippingStatus === "not_shipped" && (
                          <button
                            onClick={() =>
                              updateOrderStatus(order.id, {
                                status: "SHIPPED",
                                shippingStatus: "SHIPPED",
                                trackingNumber: `PK-${Date.now()}`,
                              })
                            }
                            className="btn-primary flex items-center gap-2"
                          >
                            <FiTruck /> Kirim
                          </button>
                        )}
                      <Link
                        href={`/order/${order.id}`}
                        className="btn-outline flex items-center gap-2"
                      >
                        <FiEye /> Detail
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="card p-12 text-center text-gray-600">
                Belum ada pesanan untuk toko ini.
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

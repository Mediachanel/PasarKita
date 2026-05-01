"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FiCheckCircle, FiCreditCard, FiPackage, FiTruck } from "react-icons/fi";
import {
  humanizeStatus,
  paymentStatusLabels,
  rupiah,
  shippingStatusLabels,
  statusBadgeClass,
} from "@/lib/marketplace";

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  shippingStatus: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  date: string;
  customer?: {
    name: string;
    email: string;
  };
  address?: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  items: Array<{
    id: string;
    productId: string;
    name: string;
    quantity: number;
    price: number;
    store?: {
      name: string;
    };
  }>;
  payment?: {
    method: string;
    status: string;
  } | null;
  shipment?: {
    carrier: string | null;
    status: string;
    trackingNumber: string | null;
  } | null;
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [review, setReview] = useState({
    rating: "5",
    comment: "",
  });

  const loadOrder = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/orders/${orderId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Pesanan tidak ditemukan");
      }

      setOrder(data.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pesanan gagal dimuat");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) loadOrder();
  }, [orderId]);

  const updateOrder = async (payload: Record<string, string>) => {
    setUpdating(true);
    setError("");

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

      await loadOrder();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status gagal diperbarui");
    } finally {
      setUpdating(false);
    }
  };

  const submitReview = async (productId: string) => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        userId: user?.id,
        rating: Number(review.rating),
        comment: review.comment,
      }),
    });

    if (response.ok) {
      setReview({ rating: "5", comment: "" });
    }
  };

  const timeline = [
    {
      label: "Pesanan Dibuat",
      active: Boolean(order),
      icon: FiPackage,
    },
    {
      label: "Pembayaran",
      active: order?.paymentStatus === "completed",
      icon: FiCreditCard,
    },
    {
      label: "Dikirim",
      active:
        order?.shippingStatus === "shipped" ||
        order?.shippingStatus === "in_transit" ||
        order?.shippingStatus === "delivered",
      icon: FiTruck,
    },
    {
      label: "Selesai",
      active: order?.status === "completed",
      icon: FiCheckCircle,
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          {loading ? (
            <div className="card p-8">Memuat detail pesanan...</div>
          ) : error || !order ? (
            <div className="card p-8 text-center">
              <h1 className="text-2xl font-bold mb-3">Pesanan tidak tersedia</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <Link href="/orders" className="btn-primary">
                Kembali ke Pesanan
              </Link>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start gap-4 mb-8">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {order.orderNumber}
                  </h1>
                  <p className="text-gray-600">
                    Dibuat pada{" "}
                    {new Date(order.date).toLocaleDateString("id-ID")}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-4 py-2 text-sm font-semibold ${statusBadgeClass(order.status)}`}
                >
                  {humanizeStatus(order.status)}
                </span>
              </div>

              {error && (
                <div className="card p-4 mb-6 border-red-200 bg-red-50 text-red-700">
                  {error}
                </div>
              )}

              <div className="card p-6 mb-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {timeline.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="text-center">
                        <div
                          className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${
                            item.active
                              ? "bg-green-100 text-green-700"
                              : "bg-brown-100 text-brown-500"
                          }`}
                        >
                          <Icon />
                        </div>
                        <p className="font-semibold text-sm">{item.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="card p-6">
                    <h2 className="text-xl font-bold mb-4">Produk</h2>
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between gap-4 border-b border-brown-100 pb-4"
                        >
                          <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              {item.store?.name || "Pasar Kita"} • x
                              {item.quantity}
                            </p>
                          </div>
                          <p className="font-bold text-brown-600">
                            {rupiah(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {(order.status === "completed" ||
                    order.shippingStatus === "delivered") && (
                    <div className="card p-6">
                      <h2 className="text-xl font-bold mb-4">
                        Beri Ulasan Produk
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <select
                          value={review.rating}
                          onChange={(e) =>
                            setReview((current) => ({
                              ...current,
                              rating: e.target.value,
                            }))
                          }
                          className="px-4 py-2"
                        >
                          <option value="5">5 bintang</option>
                          <option value="4">4 bintang</option>
                          <option value="3">3 bintang</option>
                          <option value="2">2 bintang</option>
                          <option value="1">1 bintang</option>
                        </select>
                        <input
                          value={review.comment}
                          onChange={(e) =>
                            setReview((current) => ({
                              ...current,
                              comment: e.target.value,
                            }))
                          }
                          placeholder="Tulis ulasan singkat"
                          className="md:col-span-2 px-4 py-2"
                        />
                        <button
                          onClick={() => submitReview(order.items[0].productId)}
                          className="btn-primary"
                        >
                          Kirim Ulasan
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="card p-6">
                    <h2 className="text-xl font-bold mb-4">Alamat Pengiriman</h2>
                    <p className="font-semibold">{order.customer?.name}</p>
                    <p className="text-gray-700">
                      {order.address?.street}, {order.address?.city},{" "}
                      {order.address?.province} {order.address?.postalCode}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="card p-6">
                    <h2 className="text-xl font-bold mb-4">Pembayaran</h2>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Metode</span>
                        <span className="font-semibold">
                          {order.payment?.method || "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status</span>
                        <span className="font-semibold">
                          {humanizeStatus(order.paymentStatus, paymentStatusLabels)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{rupiah(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ongkir</span>
                        <span>
                          {rupiah(order.shippingCost)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-brown-100 pt-3 text-base font-bold">
                        <span>Total</span>
                        <span>{rupiah(order.total)}</span>
                      </div>
                    </div>

                    {order.paymentStatus !== "completed" && (
                      <button
                        onClick={() =>
                          updateOrder({
                            status: "PAYMENT_CONFIRMED",
                            paymentStatus: "COMPLETED",
                          })
                        }
                        disabled={updating}
                        className="btn-primary w-full mt-6"
                      >
                        Simulasikan Pembayaran
                      </button>
                    )}
                  </div>

                  <div className="card p-6">
                    <h2 className="text-xl font-bold mb-4">Pengiriman</h2>
                    <p className="font-semibold">
                      {order.shipment?.carrier || "Kurir belum dipilih"}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Resi: {order.shipment?.trackingNumber || "Belum tersedia"}
                    </p>
                    <p className={`inline-block rounded-full border px-3 py-1 text-sm font-semibold ${statusBadgeClass(order.shippingStatus)}`}>
                      {humanizeStatus(order.shippingStatus, shippingStatusLabels)}
                    </p>

                    {order.shippingStatus !== "delivered" && (
                      <button
                        onClick={() =>
                          updateOrder({
                            status: "COMPLETED",
                            shippingStatus: "DELIVERED",
                          })
                        }
                        disabled={updating}
                        className="btn-secondary w-full mt-6"
                      >
                        Konfirmasi Barang Diterima
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FiCheckCircle } from "react-icons/fi";

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      const lastOrderId = localStorage.getItem("lastOrderId");
      const lastOrderNumber = localStorage.getItem("lastOrderNumber");
      if (lastOrderId === orderId && lastOrderNumber) {
        setOrderNumber(lastOrderNumber);
      }

      try {
        const response = await fetch(`/api/orders/${orderId}`);
        const data = await response.json();

        if (response.ok && data.order?.orderNumber) {
          setOrderNumber(data.order.orderNumber);
        }
      } catch {
        setOrderNumber(
          lastOrderId === orderId && lastOrderNumber
            ? lastOrderNumber
            : `ORD-${orderId}`
        );
      }
    };

    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-16">
        <div className="container mx-auto px-4 max-w-md">
          <div className="card p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle className="text-4xl text-green-600" />
            </div>

            <h1 className="text-3xl font-bold mb-2">Pesanan Berhasil Dibuat!</h1>
            <p className="text-gray-600 mb-6">
              Terima kasih telah berbelanja di Pasar Kita. Pembayaran berhasil
              diproses dan pesanan masuk pengiriman.
            </p>

            <div className="bg-brown-50 rounded-lg p-4 mb-8">
              <p className="text-sm text-gray-600 mb-2">Nomor Pesanan</p>
              <p className="text-2xl font-bold text-brown-700">
                {orderNumber || `ORD-${orderId}`}
              </p>
            </div>

            <div className="space-y-3">
              <Link href="/orders" className="block btn-primary">
                Lihat Pesanan Saya
              </Link>
              <Link href="/browse" className="block btn-secondary">
                Lanjut Belanja
              </Link>
            </div>

            <p className="text-sm text-gray-600 mt-8">
              Kami akan mengirimkan email konfirmasi pesanan Anda dalam beberapa
              menit.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

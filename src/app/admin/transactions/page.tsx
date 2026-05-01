"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  humanizeStatus,
  paymentStatusLabels,
  rupiah,
  shippingStatusLabels,
  statusBadgeClass,
} from "@/lib/marketplace";

interface Transaction {
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
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const loadTransactions = async () => {
      const response = await fetch("/api/orders");
      const data = await response.json();
      if (response.ok) setTransactions(data.orders);
    };

    loadTransactions();
  }, []);

  const totals = useMemo(() => {
    return {
      revenue: transactions.reduce((sum, order) => sum + order.total, 0),
      pending: transactions.filter(
        (order) => order.paymentStatus === "pending"
      ).length,
      shipped: transactions.filter((order) => order.shippingStatus === "shipped")
        .length,
    };
  }, [transactions]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Kelola Transaksi</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card p-6">
              <p className="text-sm text-gray-600 mb-2">Nilai Transaksi</p>
              <p className="text-3xl font-bold text-brown-700">
                {rupiah(totals.revenue)}
              </p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-gray-600 mb-2">Pending Payment</p>
              <p className="text-3xl font-bold text-brown-700">
                {totals.pending}
              </p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-gray-600 mb-2">Dalam Pengiriman</p>
              <p className="text-3xl font-bold text-brown-700">
                {totals.shipped}
              </p>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-brown-50 border-b border-brown-200">
                    <th className="px-6 py-4 text-left font-semibold">Order</th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Pembeli
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Pembayaran
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Pengiriman
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">Total</th>
                    <th className="px-6 py-4 text-left font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-brown-100 hover:bg-brown-50"
                    >
                      <td className="px-6 py-4 font-semibold">
                        {transaction.orderNumber}
                      </td>
                      <td className="px-6 py-4">
                        {transaction.customer?.name || "Pembeli"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full border px-3 py-1 text-sm font-semibold ${statusBadgeClass(transaction.paymentStatus)}`}
                        >
                          {humanizeStatus(
                            transaction.paymentStatus,
                            paymentStatusLabels
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full border px-3 py-1 text-sm font-semibold ${statusBadgeClass(transaction.shippingStatus)}`}
                        >
                          {humanizeStatus(
                            transaction.shippingStatus,
                            shippingStatusLabels
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-brown-600">
                        {rupiah(transaction.total)}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/order/${transaction.id}`}
                          className="text-brown-600 font-semibold"
                        >
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

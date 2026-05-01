"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { rupiah } from "@/lib/marketplace";

interface Voucher {
  id: string;
  code: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  usedCount: number;
  maxUsage: number | null;
  active: boolean;
  validUntil: string;
}

export default function SellerVouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: "10",
    maxUsage: "100",
  });

  const loadVouchers = async () => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const params = new URLSearchParams();
    if (user?.store?.id) params.set("storeId", user.store.id);

    const response = await fetch(`/api/vouchers?${params.toString()}`);
    const data = await response.json();
    if (response.ok) setVouchers(data.vouchers);
  };

  useEffect(() => {
    loadVouchers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const response = await fetch("/api/vouchers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        storeId: user?.store?.id,
      }),
    });

    if (response.ok) {
      setFormData({
        code: "",
        description: "",
        discountType: "PERCENTAGE",
        discountValue: "10",
        maxUsage: "100",
      });
      loadVouchers();
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Voucher Toko</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <form onSubmit={handleSubmit} className="card p-6 space-y-4">
              <h2 className="text-xl font-bold">Buat Voucher</h2>
              <input
                placeholder="Kode voucher"
                value={formData.code}
                onChange={(e) =>
                  setFormData((current) => ({ ...current, code: e.target.value }))
                }
                className="w-full px-4 py-2"
                required
              />
              <input
                placeholder="Deskripsi"
                value={formData.description}
                onChange={(e) =>
                  setFormData((current) => ({
                    ...current,
                    description: e.target.value,
                  }))
                }
                className="w-full px-4 py-2"
              />
              <select
                value={formData.discountType}
                onChange={(e) =>
                  setFormData((current) => ({
                    ...current,
                    discountType: e.target.value,
                  }))
                }
                className="w-full px-4 py-2"
              >
                <option value="PERCENTAGE">Persentase</option>
                <option value="FIXED">Nominal</option>
              </select>
              <input
                type="number"
                value={formData.discountValue}
                onChange={(e) =>
                  setFormData((current) => ({
                    ...current,
                    discountValue: e.target.value,
                  }))
                }
                className="w-full px-4 py-2"
                required
              />
              <button className="btn-primary w-full">Simpan Voucher</button>
            </form>

            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {vouchers.map((voucher) => (
                <div key={voucher.id} className="card p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-brown-700">
                        {voucher.code}
                      </h2>
                      <p className="text-gray-600">
                        {voucher.description || "Voucher toko"}
                      </p>
                    </div>
                    <span className={voucher.active ? "badge-primary" : "badge-secondary"}>
                      {voucher.active ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                  <p className="text-lg font-bold mb-2">
                    {voucher.discountType === "PERCENTAGE"
                      ? `${voucher.discountValue}%`
                      : rupiah(voucher.discountValue)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Terpakai {voucher.usedCount}/{voucher.maxUsage || "∞"} •
                    berlaku sampai{" "}
                    {new Date(voucher.validUntil).toLocaleDateString("id-ID")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

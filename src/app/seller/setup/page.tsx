"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SellerSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    storeName: "",
    storeDescription: "",
    storeCategory: "umkm",
    ownerName: "",
    phone: "",
    email: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);
    setFormData((prev) => ({
      ...prev,
      storeName: user.store?.name ?? prev.storeName,
      ownerName: user.name ?? prev.ownerName,
      email: user.email ?? prev.email,
    }));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const response = await fetch("/api/stores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId: user?.id,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Toko gagal disimpan");
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/seller/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Toko gagal disimpan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    s <= step
                      ? "bg-brown-600 text-white"
                      : "bg-brown-100 text-brown-600"
                  }`}
                >
                  {s}
                </div>
              ))}
            </div>
            <div className="bg-brown-100 h-1 rounded-full overflow-hidden">
              <div
                className="bg-brown-600 h-full transition-all"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form */}
          <div className="card p-8 mb-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Informasi Toko</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block font-semibold mb-2">
                      Nama Toko *
                    </label>
                    <input
                      type="text"
                      name="storeName"
                      placeholder="Nama toko Anda"
                      value={formData.storeName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-brown-200 rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">
                      Deskripsi Toko
                    </label>
                    <textarea
                      name="storeDescription"
                      placeholder="Jelaskan toko dan produk Anda..."
                      rows={4}
                      value={formData.storeDescription}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-brown-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Kategori</label>
                    <select
                      name="storeCategory"
                      value={formData.storeCategory}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-brown-200 rounded-lg"
                    >
                      <option value="umkm">UMKM</option>
                      <option value="reseller">Reseller</option>
                      <option value="brand">Brand/Merk</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Data Pemilik</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block font-semibold mb-2">
                      Nama Pemilik *
                    </label>
                    <input
                      type="text"
                      name="ownerName"
                      placeholder="Nama lengkap Anda"
                      value={formData.ownerName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-brown-200 rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">
                      No. Telepon *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="081234567890"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-brown-200 rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-brown-200 rounded-lg"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Alamat Toko</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block font-semibold mb-2">
                      Alamat Lengkap *
                    </label>
                    <textarea
                      name="address"
                      placeholder="Jalan, nomor, RT/RW, kelurahan, kecamatan, kota, provinsi, kode pos"
                      rows={4}
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-brown-200 rounded-lg"
                      required
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
                    <p className="text-sm">
                      ℹ️ Alamat ini akan ditampilkan di profil toko Anda dan
                      digunakan untuk pengiriman.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 justify-between">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="btn-outline"
              >
                Sebelumnya
              </button>
            )}

            {step < 3 && (
              <button
                onClick={handleNextStep}
                className="btn-primary ml-auto"
              >
                Selanjutnya
              </button>
            )}

            {step === 3 && (
              <div className="flex gap-4 ml-auto">
                <Link href="/seller/dashboard" className="btn-outline">
                  Nanti
                </Link>
                <button
                  onClick={handleSubmit}
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? "Menyimpan..." : "Selesai"}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

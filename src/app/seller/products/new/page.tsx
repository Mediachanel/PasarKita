"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FiArrowLeft } from "react-icons/fi";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "makanan-minuman",
    price: "",
    stock: "",
    unit: "pcs",
    imageUrl: "",
    variantName: "",
    variantValue: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Kategori gagal dimuat");
        }

        setCategories(data.categories);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Kategori gagal dimuat");
      }
    };

    loadCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId: user?.id,
          storeId: user?.store?.id,
          variants:
            formData.variantName && formData.variantValue
              ? [
                  {
                    name: formData.variantName,
                    value: formData.variantValue,
                  },
                ]
              : [],
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Produk gagal ditambahkan");
      }

      router.push("/seller/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Produk gagal ditambahkan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <Link href="/seller/products" className="text-brown-600 hover:text-brown-700">
              <FiArrowLeft />
            </Link>
            <h1 className="text-3xl font-bold">Tambah Produk Baru</h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="card p-4 border-red-200 bg-red-50 text-red-700">
                {error}
              </div>
            )}

            {/* Basic Info */}
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-6">Informasi Dasar</h2>

              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2">
                    Nama Produk *
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Contoh: Kopi Specialty Sumatra"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-brown-200 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Deskripsi Produk
                  </label>
                  <textarea
                    name="description"
                    placeholder="Jelaskan detail produk Anda..."
                    rows={5}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-brown-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Kategori *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-brown-200 rounded-lg"
                    required
                  >
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <option key={category.id} value={category.slug}>
                          {category.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="makanan-minuman">Makanan & Minuman</option>
                        <option value="fashion">Fashion</option>
                        <option value="elektronik">Elektronik</option>
                        <option value="kerajinan">Kerajinan</option>
                        <option value="alat-rumah-tangga">
                          Alat Rumah Tangga
                        </option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-6">Harga & Stok</h2>

              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2">Harga (Rp) *</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="0"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-brown-200 rounded-lg"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-2">
                      Jumlah Stok *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      placeholder="0"
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-brown-200 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Satuan</label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-brown-200 rounded-lg"
                    >
                      <option value="pcs">Pcs</option>
                      <option value="dus">Dus</option>
                      <option value="kg">Kg</option>
                      <option value="liter">Liter</option>
                      <option value="meter">Meter</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-bold mb-6">Variasi Produk</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2">
                    Nama Variasi
                  </label>
                  <input
                    type="text"
                    name="variantName"
                    placeholder="Contoh: Ukuran"
                    value={formData.variantName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-brown-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">
                    Pilihan Variasi
                  </label>
                  <input
                    type="text"
                    name="variantValue"
                    placeholder="Contoh: S, M, L"
                    value={formData.variantValue}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-brown-200 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-6">Foto Produk</h2>
              <input
                type="text"
                name="imageUrl"
                placeholder="/images/produk-saya.jpg"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-brown-200 rounded-lg"
              />
              <p className="text-sm text-gray-500 mt-3">
                Masukkan path gambar lokal atau URL foto produk.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-end">
              <Link href="/seller/products" className="btn-outline">
                Batal
              </Link>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan Produk"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

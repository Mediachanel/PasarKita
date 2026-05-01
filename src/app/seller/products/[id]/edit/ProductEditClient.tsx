"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FiArrowLeft } from "react-icons/fi";

interface ProductDetail {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Produk tidak ditemukan");
        }

        const product = data.product as ProductDetail;
        setFormData({
          name: product.name,
          description: product.description ?? "",
          price: String(product.price),
          stock: String(product.stock),
          imageUrl: product.imageUrl ?? "",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Produk gagal dimuat");
      } finally {
        setLoading(false);
      }
    };

    if (productId) loadProduct();
  }, [productId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Produk gagal diperbarui");
      }

      router.push("/seller/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Produk gagal diperbarui");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="flex items-center gap-3 mb-8">
            <Link href="/seller/products" className="text-brown-600">
              <FiArrowLeft />
            </Link>
            <h1 className="text-3xl font-bold">Edit Produk</h1>
          </div>

          {error && (
            <div className="card p-4 mb-6 border-red-200 bg-red-50 text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="card p-8">Memuat produk...</div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-6 space-y-5">
              <div>
                <label className="block font-semibold mb-2">Nama Produk</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Deskripsi</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2">Harga</label>
                  <input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Stok</label>
                  <input
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full px-4 py-2"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-2">Foto Produk</label>
                <input
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="/images/produk-saya.jpg atau URL"
                  className="w-full px-4 py-2"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Link href="/seller/products" className="btn-outline">
                  Batal
                </Link>
                <button disabled={saving} className="btn-primary">
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

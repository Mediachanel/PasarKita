"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import { rupiah } from "@/lib/marketplace";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  sold: number;
}

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        const params = new URLSearchParams();

        if (user?.store?.id) {
          params.set("storeId", user.store.id);
        }

        const response = await fetch(`/api/products?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Produk gagal dimuat");
        }

        setProducts(data.products);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Produk gagal dimuat");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Hapus produk ini?");
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Produk gagal dihapus");
      }

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== id)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Produk gagal dihapus");
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Produk Saya</h1>
              <p className="text-gray-600">Total Produk: {products.length}</p>
            </div>
            <Link
              href="/seller/products/new"
              className="btn-primary flex items-center gap-2"
            >
              <FiPlus /> Tambah Produk
            </Link>
          </div>

          {error && (
            <div className="card p-6 mb-6 border-red-200 bg-red-50 text-red-700">
              {error}
            </div>
          )}

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-brown-50 border-b border-brown-200">
                    <th className="px-6 py-4 text-left font-semibold">
                      Nama Produk
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Harga
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">Stok</th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Terjual
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [...Array(3)].map((_, index) => (
                      <tr key={index} className="border-b border-brown-100">
                        <td className="px-6 py-4" colSpan={6}>
                          <div className="h-5 bg-brown-100 rounded animate-pulse" />
                        </td>
                      </tr>
                    ))
                  ) : products.length > 0 ? (
                    products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-brown-100 hover:bg-brown-50"
                      >
                        <td className="px-6 py-4">
                          <p className="font-semibold">{product.name}</p>
                        </td>
                        <td className="px-6 py-4">
                          {rupiah(product.price)}
                        </td>
                        <td className="px-6 py-4">
                          {product.stock > 0 ? (
                            <span className="text-green-600 font-semibold">
                              {product.stock}
                            </span>
                          ) : (
                            <span className="text-red-600 font-semibold">
                              Habis
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">{product.sold}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`py-1 px-3 rounded-full text-xs font-semibold ${
                              product.stock > 0
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {product.stock > 0 ? "Aktif" : "Tidak Aktif"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-3">
                            <Link
                              href={`/seller/products/${product.id}/edit`}
                              className="text-brown-600 hover:text-brown-700"
                              aria-label="Edit produk"
                            >
                              <FiEdit />
                            </Link>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-red-600 hover:text-red-700"
                              aria-label="Hapus produk"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-6 py-12 text-center text-gray-600" colSpan={6}>
                        Belum ada produk. Tambahkan produk pertama Anda.
                      </td>
                    </tr>
                  )}
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

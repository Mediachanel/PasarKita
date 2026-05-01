"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { rupiah } from "@/lib/marketplace";

interface AdminProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  sold: number;
  store: {
    name: string;
  };
  category: {
    name: string;
  };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const response = await fetch("/api/products?sort=popular");
      const data = await response.json();
      if (response.ok) setProducts(data.products);
    };

    loadProducts();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Kelola Produk</h1>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-brown-50 border-b border-brown-200">
                    <th className="px-6 py-4 text-left font-semibold">Produk</th>
                    <th className="px-6 py-4 text-left font-semibold">Toko</th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Kategori
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">Harga</th>
                    <th className="px-6 py-4 text-left font-semibold">Stok</th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Terjual
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-brown-100 hover:bg-brown-50"
                    >
                      <td className="px-6 py-4 font-semibold">
                        <Link href={`/product/${product.id}`}>
                          {product.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4">{product.store.name}</td>
                      <td className="px-6 py-4">{product.category.name}</td>
                      <td className="px-6 py-4">
                        {rupiah(product.price)}
                      </td>
                      <td className="px-6 py-4">{product.stock}</td>
                      <td className="px-6 py-4">{product.sold}</td>
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

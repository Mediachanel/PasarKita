"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  products: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const response = await fetch("/api/categories");
      const data = await response.json();
      if (response.ok) setCategories(data.categories);
    };

    loadCategories();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Kelola Kategori</h1>
              <p className="text-gray-600">
                Struktur kategori produk untuk pencarian dan filter katalog.
              </p>
            </div>
            <button className="btn-primary">Tambah Kategori</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-4xl mb-3">{category.icon || "🛍️"}</p>
                    <h2 className="text-xl font-bold">{category.name}</h2>
                    <p className="text-gray-600">{category.slug}</p>
                  </div>
                  <span className="badge-secondary">
                    {category.products} produk
                  </span>
                </div>
                <div className="flex gap-3">
                  <button className="btn-outline flex-1">Edit</button>
                  <button className="btn-secondary flex-1">Arsipkan</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

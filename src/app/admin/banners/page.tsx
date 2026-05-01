"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Banner {
  id: string;
  title: string;
  image: string;
  link: string | null;
  order: number;
  active: boolean;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    image: "/banners/promo-baru.jpg",
    link: "/browse",
  });

  const loadBanners = async () => {
    const response = await fetch("/api/banners?all=true");
    const data = await response.json();
    if (response.ok) setBanners(data.banners);
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/banners", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setFormData({ title: "", image: "/banners/promo-baru.jpg", link: "/browse" });
      loadBanners();
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Kelola Promo dan Banner</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <form onSubmit={handleSubmit} className="card p-6 space-y-4">
              <h2 className="text-xl font-bold">Banner Baru</h2>
              <div>
                <label className="block font-semibold mb-2">Judul</label>
                <input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((current) => ({
                      ...current,
                      title: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Path Gambar</label>
                <input
                  value={formData.image}
                  onChange={(e) =>
                    setFormData((current) => ({
                      ...current,
                      image: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Link</label>
                <input
                  value={formData.link}
                  onChange={(e) =>
                    setFormData((current) => ({
                      ...current,
                      link: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2"
                />
              </div>
              <button className="btn-primary w-full">Simpan Banner</button>
            </form>

            <div className="lg:col-span-2 space-y-4">
              {banners.map((banner) => (
                <div key={banner.id} className="card p-6">
                  <div className="flex justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold">{banner.title}</h2>
                      <p className="text-gray-600">{banner.image}</p>
                      {banner.link && (
                        <Link
                          href={banner.link}
                          className="text-brown-600 font-semibold"
                        >
                          {banner.link}
                        </Link>
                      )}
                    </div>
                    <span
                      className={
                        banner.active
                          ? "badge-primary h-fit"
                          : "badge-secondary h-fit"
                      }
                    >
                      {banner.active ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
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

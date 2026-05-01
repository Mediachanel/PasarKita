"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FiTarget, FiEye, FiHeart } from "react-icons/fi";

export default function AboutPage() {
  const values = [
    {
      icon: FiTarget,
      title: "Misi",
      description: "Memberdayakan UMKM dan seller lokal dengan teknologi marketplace yang terpercaya",
    },
    {
      icon: FiEye,
      title: "Visi",
      description: "Menjadi marketplace pilihan utama untuk produk lokal Indonesia",
    },
    {
      icon: FiHeart,
      title: "Nilai",
      description: "Kejujuran, kepercayaan, dan komitmen terhadap kepuasan pelanggan",
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-12">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 font-display">Tentang Pasar Kita</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Platform marketplace terpercaya untuk mendukung UMKM dan seller
              lokal di Indonesia
            </p>
          </div>

          {/* Story */}
          <div className="card p-8 mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Cerita Kami</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Pasar Kita lahir dari visi sederhana untuk menghubungkan pembeli
                dan penjual lokal Indonesia dalam satu platform yang aman,
                terpercaya, dan mudah digunakan.
              </p>
              <p>
                Kami percaya bahwa setiap UMKM dan seller lokal berhak memiliki
                akses ke pasar digital yang adil dan mendukung. Dengan teknologi
                yang tepat, produk-produk berkualitas lokal dapat mencapai
                konsumen di seluruh Indonesia.
              </p>
              <p>
                Sejak diluncurkan, Pasar Kita telah membantu ribuan seller lokal
                menjangkau jutaan pembeli, menciptakan ekosistem perdagangan yang
                sehat dan berkelanjutan.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Nilai-Nilai Kami</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, idx) => {
                const Icon = value.icon;
                return (
                  <div key={idx} className="card p-8 text-center">
                    <div className="w-16 h-16 bg-brown-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="text-2xl text-brown-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-r from-brown-600 to-brown-700 text-white rounded-lg p-12 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold mb-2">2.4K+</p>
                <p className="text-brown-100">Total User</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">345</p>
                <p className="text-brown-100">Seller Aktif</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">8.2K+</p>
                <p className="text-brown-100">Produk Aktif</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">Rp 125M+</p>
                <p className="text-brown-100">Total Transaksi</p>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Tim Kami</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Tim profesional yang berdedikasi untuk memberikan layanan terbaik
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { name: "Bambang Sutrisno", role: "CEO & Founder" },
                { name: "Dewi Lestari", role: "CTO" },
                { name: "Ahmad Wijaya", role: "COO" },
                { name: "Siti Rahman", role: "Head of Growth" },
              ].map((member, idx) => (
                <div key={idx} className="card p-6">
                  <div className="w-20 h-20 bg-brown-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                  <p className="text-brown-600">{member.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="card p-8 bg-gradient-to-r from-beige to-caramel text-center">
            <h2 className="text-2xl font-bold mb-4">Bergabunglah Dengan Kami</h2>
            <p className="text-gray-700 mb-6">
              Jadilah bagian dari komunitas marketplace lokal Indonesia
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button className="btn-primary">Mulai Belanja</button>
              <button className="btn-secondary">Jadi Penjual</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

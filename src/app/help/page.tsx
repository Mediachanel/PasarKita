"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function HelpPage() {
  const faqs = [
    {
      id: 1,
      question: "Bagaimana cara membeli di Pasar Kita?",
      answer:
        "Daftar akun terlebih dahulu, kemudian cari produk yang Anda inginkan. Setelah menambahkan ke keranjang, lakukan checkout dan pilih metode pembayaran.",
    },
    {
      id: 2,
      question: "Apa saja metode pembayaran yang tersedia?",
      answer:
        "Pasar Kita menerima transfer bank, kartu kredit/debit, e-wallet, dan bayar di tempat (COD).",
    },
    {
      id: 3,
      question: "Bagaimana cara menjadi penjual?",
      answer:
        "Daftar akun dengan role 'Penjual', lengkapi data toko Anda, dan mulai upload produk. Produk akan ditinjau oleh admin sebelum dipublikasikan.",
    },
    {
      id: 4,
      question: "Berapa lama pengiriman?",
      answer:
        "Estimasi pengiriman tergantung kurir yang dipilih, biasanya 2-5 hari kerja untuk area Jawa.",
    },
    {
      id: 5,
      question: "Apakah saya bisa mengembalikan produk?",
      answer:
        "Ya, Pasar Kita menyediakan kebijakan pengembalian hingga 30 hari setelah produk diterima dengan syarat dan ketentuan tertentu.",
    },
    {
      id: 6,
      question: "Bagaimana cara menghubungi seller?",
      answer:
        "Anda bisa menghubungi penjual melalui fitur chat di detail produk atau di halaman toko penjual.",
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">Pusat Bantuan</h1>
          <p className="text-gray-600 text-lg mb-12">
            Temukan jawaban untuk pertanyaan Anda di sini
          </p>

          {/* Search */}
          <div className="card p-6 mb-12">
            <input
              type="text"
              placeholder="Cari bantuan..."
              className="w-full px-4 py-3 border border-brown-200 rounded-lg focus:outline-none focus:border-brown-600"
            />
          </div>

          {/* FAQs */}
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.id} className="card p-6 cursor-pointer">
                <summary className="font-bold text-lg hover:text-brown-600 transition">
                  {faq.question}
                </summary>
                <p className="text-gray-600 mt-4 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>

          {/* Contact */}
          <div className="card p-8 mt-12 bg-gradient-to-r from-brown-100 to-beige">
            <h2 className="text-2xl font-bold mb-4">Hubungi Kami</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Email:</strong> support@pasarkita.local
              </p>
              <p>
                <strong>WhatsApp:</strong> +62 812-3456-7890
              </p>
              <p>
                <strong>Chat:</strong>{" "}
                <Link href="/chat" className="text-brown-600 hover:text-brown-700">
                  Hubungi Live Chat
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

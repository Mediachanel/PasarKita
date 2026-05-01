import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="card p-8">
            <h1 className="text-3xl font-bold mb-4">Syarat & Ketentuan</h1>
            <p className="text-gray-700 leading-relaxed">
              Pengguna Pasar Kita bertanggung jawab atas kebenaran data produk,
              alamat, dan transaksi. Pembayaran, pengiriman, escrow, dan
              pencairan dana pada MVP ini berjalan sebagai simulasi untuk
              validasi alur bisnis.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="card p-8">
            <h1 className="text-3xl font-bold mb-4">Privasi</h1>
            <p className="text-gray-700 leading-relaxed">
              Pasar Kita menyimpan data akun, transaksi, alamat, chat, dan
              ulasan hanya untuk menjalankan layanan marketplace. Data demo pada
              MVP ini digunakan untuk simulasi dan pengembangan internal.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

import Link from "next/link";
import { FiFacebook, FiInstagram, FiShoppingBag, FiTwitter } from "react-icons/fi";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-marketplace-line bg-white py-12 text-gray-700">
      <div className="container mx-auto px-4">
        <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-marketplace-orange text-white">
                <FiShoppingBag />
              </span>
              <h3 className="text-xl font-extrabold">
                <span className="text-marketplace-orange">Pasar</span>
                <span className="text-marketplace-green">Kita</span>
              </h3>
            </div>
            <p className="text-sm text-gray-500">
              Marketplace terpercaya untuk belanja dan berjualan produk lokal Indonesia.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-extrabold text-gray-900">Pembeli</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/browse" className="transition hover:text-marketplace-green">
                  Jelajahi Produk
                </Link>
              </li>
              <li>
                <Link href="/cart" className="transition hover:text-marketplace-green">
                  Keranjang
                </Link>
              </li>
              <li>
                <Link href="/orders" className="transition hover:text-marketplace-green">
                  Pesanan Saya
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="transition hover:text-marketplace-green">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-extrabold text-gray-900">Penjual</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/seller/setup" className="transition hover:text-marketplace-green">
                  Mulai Berjualan
                </Link>
              </li>
              <li>
                <Link href="/seller/dashboard" className="transition hover:text-marketplace-green">
                  Dashboard Toko
                </Link>
              </li>
              <li>
                <Link href="/seller/products" className="transition hover:text-marketplace-green">
                  Produk Saya
                </Link>
              </li>
              <li>
                <Link href="/seller/vouchers" className="transition hover:text-marketplace-green">
                  Voucher Toko
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-extrabold text-gray-900">Lainnya</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/help" className="transition hover:text-marketplace-green">
                  Bantuan
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition hover:text-marketplace-green">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition hover:text-marketplace-green">
                  Privasi
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition hover:text-marketplace-green">
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-marketplace-line pt-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-500">
              © {currentYear} Pasar Kita. Semua hak dilindungi.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com"
                className="text-xl text-gray-500 transition hover:text-marketplace-green"
                aria-label="Facebook"
              >
                <FiFacebook />
              </a>
              <a
                href="https://www.instagram.com"
                className="text-xl text-gray-500 transition hover:text-marketplace-green"
                aria-label="Instagram"
              >
                <FiInstagram />
              </a>
              <a
                href="https://www.twitter.com"
                className="text-xl text-gray-500 transition hover:text-marketplace-green"
                aria-label="Twitter"
              >
                <FiTwitter />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

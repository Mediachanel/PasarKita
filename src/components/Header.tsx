"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiBell,
  FiChevronDown,
  FiLogOut,
  FiMenu,
  FiMessageCircle,
  FiSearch,
  FiShoppingBag,
  FiShoppingCart,
  FiUser,
  FiX,
} from "react-icons/fi";

interface StoredUser {
  name?: string;
  role?: string;
}

const topLinks = [
  { href: "/seller/setup", label: "Mulai Berjualan" },
  { href: "/seller/dashboard", label: "Seller Center" },
  { href: "/help", label: "Bantuan" },
];

const navItems = [
  { href: "/browse?sort=popular", label: "Terlaris" },
  { href: "/browse?category=makanan-minuman", label: "Kebutuhan Harian" },
  { href: "/browse?category=elektronik", label: "Elektronik" },
  { href: "/browse?category=fashion", label: "Fashion" },
  { href: "/seller/dashboard", label: "Penjual" },
];

const popularSearches = [
  "beras",
  "kopi",
  "batik",
  "laptop",
  "panci",
  "voucher toko",
];

export default function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const search = query.trim();
    router.push(search ? `/browse?search=${encodeURIComponent(search)}` : "/browse");
    setIsOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-marketplace-line bg-white shadow-sm">
      <div className="border-b border-marketplace-line bg-gray-50">
        <div className="container mx-auto flex h-8 items-center justify-between px-4 text-xs text-gray-600">
          <div className="hidden items-center gap-4 md:flex">
            {topLinks.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-marketplace-green">
                {item.label}
              </Link>
            ))}
          </div>
          <p className="font-semibold text-marketplace-green md:hidden">
            Promo ongkir dan voucher toko aktif hari ini
          </p>
          <div className="flex items-center gap-4">
            <Link href="/wishlist" className="hidden hover:text-marketplace-green sm:inline">
              Wishlist
            </Link>
            <Link href="/orders" className="hidden hover:text-marketplace-green sm:inline">
              Pesanan
            </Link>
            <Link href="/chat" className="inline-flex items-center gap-1 hover:text-marketplace-green">
              <FiMessageCircle />
              Chat
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex min-h-[72px] items-center gap-3 py-3 lg:gap-5">
          <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Pasar Kita">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-marketplace-orange text-white">
              <FiShoppingBag className="text-xl" />
            </span>
            <span className="hidden text-xl font-extrabold tracking-normal sm:inline">
              <span className="text-marketplace-orange">Pasar</span>
              <span className="text-marketplace-green">Kita</span>
            </span>
          </Link>

          <div className="hidden flex-1 md:block">
            <form
              onSubmit={submitSearch}
              className="flex h-11 items-center overflow-hidden rounded-lg border-2 border-marketplace-orange bg-white"
            >
              <div className="flex flex-1 items-center gap-2 px-4">
                <FiSearch className="text-lg text-marketplace-orange" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cari di Pasar Kita"
                  className="w-full border-0 bg-transparent px-0 py-2 text-sm focus:border-0 focus:ring-0"
                />
              </div>
              <button className="h-full bg-marketplace-orange px-6 text-sm font-bold text-white transition hover:bg-marketplace-orangeDark">
                Cari
              </button>
            </form>
            <div className="mt-2 flex gap-3 overflow-hidden text-xs text-gray-500">
              {popularSearches.map((item) => (
                <Link
                  key={item}
                  href={`/browse?search=${encodeURIComponent(item)}`}
                  className="shrink-0 hover:text-marketplace-orange"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-orange-50 hover:text-marketplace-orange"
              aria-label="Keranjang"
            >
              <FiShoppingCart className="text-xl" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-marketplace-orange" />
            </Link>
            <Link
              href="/chat"
              className="hidden h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-marketplace-green sm:flex"
              aria-label="Chat"
            >
              <FiBell className="text-xl" />
            </Link>
            <Link
              href={user ? "/profile" : "/auth/login"}
              className="hidden h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 sm:flex"
              aria-label={user?.name || "Masuk"}
            >
              <FiUser />
              <span className="max-w-24 truncate">{user?.name || "Masuk"}</span>
              <FiChevronDown className="text-xs text-gray-400" />
            </Link>
            {user && (
              <button
                onClick={logout}
                className="hidden h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 hover:text-marketplace-orange sm:flex"
                aria-label="Keluar"
              >
                <FiLogOut />
              </button>
            )}
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 lg:hidden"
              onClick={() => setIsOpen((current) => !current)}
              aria-label="Menu"
            >
              {isOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        <form
          onSubmit={submitSearch}
          className="mb-3 flex h-10 items-center overflow-hidden rounded-lg border border-marketplace-line bg-gray-50 md:hidden"
        >
          <div className="flex flex-1 items-center gap-2 px-3">
            <FiSearch className="text-marketplace-orange" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari produk..."
              className="w-full border-0 bg-transparent px-0 py-1 text-sm focus:border-0 focus:ring-0"
            />
          </div>
          <button className="h-full bg-marketplace-orange px-4 text-xs font-bold text-white">
            Cari
          </button>
        </form>

        <nav className="hidden h-10 items-center gap-5 border-t border-marketplace-line text-sm font-semibold text-gray-700 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-marketplace-green">
              {item.label}
            </Link>
          ))}
        </nav>

        {isOpen && (
          <div className="border-t border-marketplace-line py-4 lg:hidden">
            <nav className="grid gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-3 py-2 font-semibold text-gray-700 hover:bg-gray-50 hover:text-marketplace-green"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-2 font-semibold text-gray-700 hover:bg-gray-50 hover:text-marketplace-green"
              >
                Dashboard Pembeli
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-2 font-semibold text-gray-700 hover:bg-gray-50 hover:text-marketplace-green"
              >
                Wishlist
              </Link>
              {user ? (
                <button
                  onClick={logout}
                  className="rounded-lg px-3 py-2 text-left font-semibold text-gray-700 hover:bg-gray-50 hover:text-marketplace-orange"
                >
                  Keluar
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-3 py-2 font-semibold text-gray-700 hover:bg-gray-50 hover:text-marketplace-green"
                >
                  Masuk
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

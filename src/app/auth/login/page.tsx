"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Email atau password salah");
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      if (data.user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (data.user.role === "SELLER") {
        router.push("/seller/dashboard");
      } else {
        router.push("/browse");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (role: "buyer" | "seller" | "admin") => {
    const accounts = {
      buyer: "buyer@example.com",
      seller: "seller@example.com",
      admin: "admin@example.com",
    };

    setEmail(accounts[role]);
    setPassword("password123");
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-12">
        <div className="container mx-auto px-4 max-w-md">
          <div className="card p-8">
            <h1 className="text-3xl font-bold text-center mb-2">Masuk</h1>
            <p className="text-gray-600 text-center mb-8">
              Selamat datang di Pasar Kita
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="nama@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-brown-200 rounded-lg focus:outline-none focus:border-brown-600 focus:ring-2 focus:ring-brown-600 focus:ring-opacity-20"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block font-semibold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-brown-200 rounded-lg focus:outline-none focus:border-brown-600 focus:ring-2 focus:ring-brown-600 focus:ring-opacity-20"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary"
              >
                {loading ? "Memproses..." : "Masuk"}
              </button>
            </form>

            <p className="text-center mt-6 text-gray-600">
              Belum punya akun?{" "}
              <Link href="/auth/register" className="text-brown-600 font-semibold hover:text-brown-700">
                Daftar di sini
              </Link>
            </p>

            <div className="mt-8 pt-6 border-t border-brown-200">
              <p className="text-xs text-gray-500 text-center mb-4">
                Akun demo setelah database di-seed
              </p>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemoAccount("buyer")}
                  className="w-full btn-outline text-sm"
                >
                  Lanjut sebagai Pembeli
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount("seller")}
                  className="w-full btn-outline text-sm"
                >
                  Lanjut sebagai Penjual
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount("admin")}
                  className="w-full btn-outline text-sm"
                >
                  Lanjut sebagai Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

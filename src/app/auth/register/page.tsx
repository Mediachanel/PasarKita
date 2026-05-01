"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "buyer",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validasi
      if (!formData.name || !formData.email || !formData.password) {
        throw new Error("Semua field harus diisi");
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Password tidak cocok");
      }

      if (formData.password.length < 6) {
        throw new Error("Password minimal 6 karakter");
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registrasi gagal");
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      router.push(data.user.role === "SELLER" ? "/seller/setup" : "/browse");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat registrasi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-12">
        <div className="container mx-auto px-4 max-w-md">
          <div className="card p-8">
            <h1 className="text-3xl font-bold text-center mb-2">Daftar</h1>
            <p className="text-gray-600 text-center mb-8">
              Bergabung dengan Pasar Kita sekarang
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block font-semibold mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Nama Anda"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-brown-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="nama@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-brown-200 rounded-lg"
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
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-brown-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block font-semibold mb-2">
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-brown-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label htmlFor="role" className="block font-semibold mb-2">
                  Daftar Sebagai
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-brown-200 rounded-lg"
                >
                  <option value="buyer">Pembeli</option>
                  <option value="seller">Penjual</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary mt-6"
              >
                {loading ? "Memproses..." : "Daftar"}
              </button>
            </form>

            <p className="text-center mt-6 text-gray-600">
              Sudah punya akun?{" "}
              <Link href="/auth/login" className="text-brown-600 font-semibold hover:text-brown-700">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

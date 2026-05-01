"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FiLogOut, FiMapPin, FiUser } from "react-icons/fi";

interface StoredUser {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  phone?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "Jl. Merdeka No. 10, Jakarta Pusat",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    setUser(parsedUser);
    setProfile((current) => ({
      ...current,
      name: parsedUser?.name ?? "",
      email: parsedUser?.email ?? "",
      phone: parsedUser?.phone ?? "",
    }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((current) => ({ ...current, [name]: value }));
  };

  const handleSave = () => {
    const updatedUser = {
      ...(user ?? {}),
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Profil Saya</h1>
            <p className="text-gray-600">
              Kelola identitas akun, kontak, dan alamat utama pengiriman.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="card p-6">
              <div className="w-20 h-20 rounded-full bg-brown-100 text-brown-700 flex items-center justify-center text-4xl mb-4">
                <FiUser />
              </div>
              <h2 className="text-xl font-bold">{profile.name || "Pengguna"}</h2>
              <p className="text-gray-600 mb-4">{profile.email}</p>
              <span className="badge-secondary">{user?.role || "BUYER"}</span>

              <button
                onClick={handleLogout}
                className="mt-6 w-full btn-outline flex items-center justify-center gap-2"
              >
                <FiLogOut /> Keluar
              </button>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="card p-6">
                <h2 className="text-xl font-bold mb-6">Informasi Akun</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-2">Nama</label>
                    <input
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Telepon</label>
                    <input
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      placeholder="081234567890"
                      className="w-full px-4 py-2"
                    />
                  </div>
                </div>
                <button onClick={handleSave} className="btn-primary mt-6">
                  Simpan Profil
                </button>
              </div>

              <div className="card p-6">
                <div className="flex items-start gap-3">
                  <FiMapPin className="text-brown-600 text-2xl mt-1" />
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-2">Alamat Utama</h2>
                    <input
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2"
                    />
                    <p className="text-sm text-gray-600 mt-3">
                      Alamat ini menjadi default saat checkout dan dapat diganti
                      di halaman checkout.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

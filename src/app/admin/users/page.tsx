"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FiEdit, FiTrash2 } from "react-icons/fi";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  orders: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      const response = await fetch("/api/users");
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
      }

      setLoading(false);
    };

    loadUsers();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Kelola User</h1>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-brown-50 border-b border-brown-200">
                    <th className="px-6 py-4 text-left font-semibold">Nama</th>
                    <th className="px-6 py-4 text-left font-semibold">Email</th>
                    <th className="px-6 py-4 text-left font-semibold">Role</th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Pesanan
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td className="px-6 py-8 text-gray-600" colSpan={6}>
                        Memuat user...
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-brown-100 hover:bg-brown-50"
                      >
                        <td className="px-6 py-4 font-semibold">
                          {user.name}
                        </td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-brown-100 text-brown-700">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">{user.orders}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-3">
                            <button className="text-brown-600 hover:text-brown-700">
                              <FiEdit />
                            </button>
                            <button className="text-red-600 hover:text-red-700">
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

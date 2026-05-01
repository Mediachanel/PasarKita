"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface SellerUser {
  id: string;
  name: string;
  email: string;
  store?: {
    name: string;
    rating: number;
    totalReviews: number;
  } | null;
  orders: number;
}

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<SellerUser[]>([]);

  useEffect(() => {
    const loadSellers = async () => {
      const response = await fetch("/api/users?role=SELLER");
      const data = await response.json();
      if (response.ok) setSellers(data.users);
    };

    loadSellers();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Kelola Seller</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sellers.map((seller) => (
              <div key={seller.id} className="card p-6">
                <h2 className="text-xl font-bold mb-1">
                  {seller.store?.name || seller.name}
                </h2>
                <p className="text-gray-600 mb-4">{seller.email}</p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-brown-50 rounded-lg p-3">
                    <p className="font-bold text-brown-700">
                      {seller.store?.rating ?? 0}
                    </p>
                    <p className="text-xs text-gray-600">Rating</p>
                  </div>
                  <div className="bg-brown-50 rounded-lg p-3">
                    <p className="font-bold text-brown-700">
                      {seller.store?.totalReviews ?? 0}
                    </p>
                    <p className="text-xs text-gray-600">Review</p>
                  </div>
                  <div className="bg-brown-50 rounded-lg p-3">
                    <p className="font-bold text-brown-700">{seller.orders}</p>
                    <p className="text-xs text-gray-600">Order</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

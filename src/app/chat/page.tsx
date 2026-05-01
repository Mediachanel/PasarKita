"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FiMessageCircle, FiSend } from "react-icons/fi";

interface ChatMessage {
  id: string;
  content: string;
  senderRole: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  user?: {
    name: string;
  };
  messages: ChatMessage[];
}

export default function ChatPage() {
  const [user, setUser] = useState<{ id?: string; role?: string } | null>(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
    setUserLoaded(true);
  }, []);

  useEffect(() => {
    if (!userLoaded) return;

    const loadConversation = async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();
        if (user?.id) params.set("userId", user.id);

        const response = await fetch(`/api/chats?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Chat gagal dimuat");
        }

        const firstConversation = data.conversations?.[0];
        if (!firstConversation) {
          setConversation(null);
          return;
        }

        const detailResponse = await fetch(
          `/api/chats?conversationId=${firstConversation.id}`
        );
        const detailData = await detailResponse.json();

        if (detailResponse.ok) {
          setConversation(detailData.conversation);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Chat gagal dimuat");
      } finally {
        setLoading(false);
      }
    };

    loadConversation();
  }, [user?.id, userLoaded]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: conversation?.id,
          userId: user?.id,
          senderRole: user?.role || "BUYER",
          content: message,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Pesan gagal dikirim");
      }

      setConversation(data.conversation);
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pesan gagal dikirim");
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Chat</h1>
            <p className="text-gray-600">
              Komunikasi pembeli dan penjual untuk tanya produk, pengiriman,
              dan status pesanan.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="card p-6">
              <h2 className="font-bold mb-4">Percakapan</h2>
              <div className="p-4 rounded-lg bg-brown-50 border border-brown-100">
                <p className="font-semibold">Toko Pasar Kita</p>
                <p className="text-sm text-gray-600">
                  Bantuan pembelian dan pesanan
                </p>
              </div>
            </div>

            <div className="lg:col-span-3 card overflow-hidden">
              <div className="p-5 border-b border-brown-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-brown-100 rounded-full flex items-center justify-center text-brown-700">
                  <FiMessageCircle />
                </div>
                <div>
                  <h2 className="font-bold">Toko Pasar Kita</h2>
                  <p className="text-sm text-gray-600">Biasanya membalas cepat</p>
                </div>
              </div>

              <div className="h-[480px] overflow-y-auto p-5 space-y-4 bg-white">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                {loading ? (
                  <p className="text-gray-600">Memuat percakapan...</p>
                ) : conversation?.messages.length ? (
                  conversation.messages.map((item) => {
                    const mine = item.senderRole === (user?.role || "BUYER");
                    return (
                      <div
                        key={item.id}
                        className={`flex ${mine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[78%] rounded-lg px-4 py-3 ${
                            mine
                              ? "bg-brown-600 text-white"
                              : "bg-brown-50 text-gray-800"
                          }`}
                        >
                          <p>{item.content}</p>
                          <p
                            className={`text-xs mt-2 ${
                              mine ? "text-brown-100" : "text-gray-500"
                            }`}
                          >
                            {new Date(item.createdAt).toLocaleTimeString(
                              "id-ID",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex items-center justify-center text-center">
                    <div>
                      <FiMessageCircle className="text-5xl text-brown-300 mx-auto mb-4" />
                      <p className="font-semibold mb-2">
                        Mulai percakapan dengan penjual
                      </p>
                      <p className="text-gray-600">
                        Tanyakan detail produk, stok, atau pengiriman.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-5 border-t border-brown-100 flex gap-3">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                  placeholder="Tulis pesan..."
                  className="flex-1 px-4 py-3"
                />
                <button
                  onClick={sendMessage}
                  className="btn-primary flex items-center gap-2"
                >
                  <FiSend /> Kirim
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

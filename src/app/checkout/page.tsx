"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FiCheckCircle } from "react-icons/fi";
import { paymentOptions, rupiah, shippingOptions } from "@/lib/marketplace";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  imageUrl?: string | null;
  quantity: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const step = 1;
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [formData, setFormData] = useState({
    recipientName: "",
    phone: "",
    address: "",
    city: "",
    province: "DKI Jakarta",
    postalCode: "",
    courier: shippingOptions[0].value,
    paymentMethod: "transfer",
    notes: "",
  });
  const [error, setError] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (user) {
      setFormData((current) => ({
        ...current,
        recipientName: user.name ?? current.recipientName,
        phone: user.phone ?? current.phone,
      }));
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    setError("");

    if (!formData.courier || !formData.paymentMethod) {
      setError("Pilih metode pengiriman dan pembayaran");
      return;
    }

    if (cartItems.length === 0) {
      setError("Keranjang masih kosong");
      return;
    }

    setPlacingOrder(true);

    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const selectedShipping = shippingOptions.find(
        (option) => option.value === formData.courier
      );
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId: user?.id,
          email: user?.email,
          shippingCost: selectedShipping?.price ?? shippingOptions[0].price,
          estimatedDays:
            selectedShipping?.estimate === "Hari ini"
              ? 1
              : Number(selectedShipping?.estimate.slice(0, 1) ?? 4),
          items: cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Pesanan gagal dibuat");
      }

      localStorage.removeItem("cart");
      localStorage.setItem("lastOrderId", data.order.id);
      localStorage.setItem("lastOrderNumber", data.order.orderNumber);
      router.push(`/order-success/${data.order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pesanan gagal dibuat");
    } finally {
      setPlacingOrder(false);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const selectedShipping =
    shippingOptions.find((option) => option.value === formData.courier) ??
    shippingOptions[0];
  const shipping = cartItems.length > 0 ? selectedShipping.price : 0;
  const total = subtotal + shipping;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Address */}
              <div className="card p-6">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-brown-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                    {step >= 1 ? <FiCheckCircle /> : "1"}
                  </div>
                  <h2 className="text-xl font-bold">Alamat Pengiriman</h2>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-2">
                        Penerima
                      </label>
                      <input
                        type="text"
                        name="recipientName"
                        placeholder="Nama penerima"
                        value={formData.recipientName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-brown-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-2">
                        No. Telepon
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="081234567890"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-brown-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {[
                      {
                        label: "Rumah",
                        address: "Jl. Merdeka No. 10",
                        city: "Jakarta",
                        province: "DKI Jakarta",
                        postalCode: "10110",
                      },
                      {
                        label: "Kantor",
                        address: "Jl. Sudirman Kav. 8",
                        city: "Jakarta Selatan",
                        province: "DKI Jakarta",
                        postalCode: "12190",
                      },
                    ].map((address) => (
                      <button
                        key={address.label}
                        type="button"
                        onClick={() =>
                          setFormData((current) => ({
                            ...current,
                            address: address.address,
                            city: address.city,
                            province: address.province,
                            postalCode: address.postalCode,
                          }))
                        }
                        className="rounded-lg border border-brown-100 bg-brown-50 p-4 text-left hover:border-brown-300"
                      >
                        <p className="font-bold text-brown-900">
                          {address.label}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.address}, {address.city}
                        </p>
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Alamat</label>
                    <input
                      type="text"
                      name="address"
                      placeholder="Jl. Contoh No. 123"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-brown-200 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold mb-2">Kota</label>
                      <input
                        type="text"
                        name="city"
                        placeholder="Jakarta"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-brown-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-2">
                        Provinsi
                      </label>
                      <input
                        type="text"
                        name="province"
                        placeholder="DKI Jakarta"
                        value={formData.province}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-brown-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-2">
                        Kode Pos
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        placeholder="12345"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-brown-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Shipping */}
              <div className="card p-6">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-brown-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                    2
                  </div>
                  <h2 className="text-xl font-bold">Metode Pengiriman</h2>
                </div>

                <div className="space-y-3">
                  {shippingOptions.map((courier) => (
                    <label
                      key={courier.value}
                      className="flex items-center p-4 border border-brown-200 rounded-lg cursor-pointer hover:bg-brown-50"
                    >
                      <input
                        type="radio"
                        name="courier"
                        value={courier.value}
                        checked={formData.courier === courier.value}
                        onChange={handleChange}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">{courier.label}</p>
                        <p className="text-sm text-gray-600">
                          Estimasi {courier.estimate}
                        </p>
                      </div>
                      <p className="font-semibold">{rupiah(courier.price)}</p>
                    </label>
                  ))}
                </div>
              </div>

              {/* Step 3: Payment */}
              <div className="card p-6">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-brown-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                    3
                  </div>
                  <h2 className="text-xl font-bold">Metode Pembayaran</h2>
                </div>

                <div className="space-y-3">
                  {paymentOptions.map((method) => (
                    <label
                      key={method.value}
                      className="flex items-center p-4 border border-brown-200 rounded-lg cursor-pointer hover:bg-brown-50"
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={formData.paymentMethod === method.value}
                        onChange={handleChange}
                        className="mr-3"
                      />
                      <div>
                        <p className="font-semibold">{method.label}</p>
                        <p className="text-sm text-gray-600">{method.hint}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="card p-6">
                <h2 className="text-xl font-bold mb-4">Catatan Pesanan</h2>
                <input
                  type="text"
                  name="notes"
                  placeholder="Contoh: titip ke satpam jika tidak di rumah"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-brown-200 rounded-lg"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-20 space-y-6">
                <h2 className="font-bold text-lg">Ringkasan Pesanan</h2>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Items */}
                <div className="space-y-3 border-b border-brown-200 pb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} x{item.quantity}
                      </span>
                      <span>{rupiah(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{rupiah(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ongkir</span>
                    <span>{rupiah(shipping)}</span>
                  </div>
                </div>

                <div className="border-t border-brown-200 pt-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{rupiah(total)}</span>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  className="w-full btn-primary"
                >
                  {placingOrder ? "Membuat Pesanan..." : "Buat Pesanan"}
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

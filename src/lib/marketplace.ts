export const rupiah = (amount: number) =>
  `Rp ${amount.toLocaleString("id-ID")}`;

export const productImageFallbacks: Record<string, string> = {
  "kopi-specialty-sumatra":
    "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=80",
  "gula-merah-organik":
    "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=900&q=80",
  "tahu-goreng-premium-bandung":
    "https://images.unsplash.com/photo-1625938144755-652e08e359b7?auto=format&fit=crop&w=900&q=80",
  "madu-asli-flores":
    "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=900&q=80",
  "batik-premium-pekalongan":
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
  "sarung-batik-kontemporer":
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
  "tas-kulit-bandung":
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
  "laptop-bekas-gaming-asus":
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
  "mixer-roti-kualitas-industri":
    "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80",
  "robot-vacuum-lg":
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",
  "keramik-cirebon-handmade":
    "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=900&q=80",
  "tenun-ikat-ntt":
    "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80",
  "beras-pandan-wangi-cianjur":
    "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=900&q=80",
  "keripik-tempe-malang":
    "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=900&q=80",
  "sambal-roa-manado":
    "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80",
  "set-panci-stainless-umkm":
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80",
  "lampu-meja-rotan":
    "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80",
  "sabun-herbal-sereh":
    "https://images.unsplash.com/photo-1607006483224-7f3f1f4f4f29?auto=format&fit=crop&w=900&q=80",
};

const categoryImageFallbacks: Record<string, string> = {
  "makanan-minuman":
    "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=900&q=80",
  fashion:
    "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
  elektronik:
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  kerajinan:
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80",
  "alat-rumah-tangga":
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80",
};

const localImageAliases: Record<string, string> = {
  "/images/kopi-1.jpg": productImageFallbacks["kopi-specialty-sumatra"],
  "/images/gula-1.jpg": productImageFallbacks["gula-merah-organik"],
  "/images/tahu-1.jpg": productImageFallbacks["tahu-goreng-premium-bandung"],
  "/images/madu-1.jpg": productImageFallbacks["madu-asli-flores"],
  "/images/batik-1.jpg": productImageFallbacks["batik-premium-pekalongan"],
  "/images/sarung-1.jpg": productImageFallbacks["sarung-batik-kontemporer"],
  "/images/tas-kulit-1.jpg": productImageFallbacks["tas-kulit-bandung"],
  "/images/laptop-1.jpg": productImageFallbacks["laptop-bekas-gaming-asus"],
  "/images/mixer-1.jpg": productImageFallbacks["mixer-roti-kualitas-industri"],
  "/images/robot-vacuum-1.jpg": productImageFallbacks["robot-vacuum-lg"],
  "/images/keramik-1.jpg": productImageFallbacks["keramik-cirebon-handmade"],
  "/images/tenun-1.jpg": productImageFallbacks["tenun-ikat-ntt"],
  "/images/beras-1.jpg": productImageFallbacks["beras-pandan-wangi-cianjur"],
  "/images/keripik-1.jpg": productImageFallbacks["keripik-tempe-malang"],
  "/images/sambal-1.jpg": productImageFallbacks["sambal-roa-manado"],
  "/images/panci-1.jpg": productImageFallbacks["set-panci-stainless-umkm"],
  "/images/lampu-rotan-1.jpg": productImageFallbacks["lampu-meja-rotan"],
  "/images/sabun-sereh-1.jpg": productImageFallbacks["sabun-herbal-sereh"],
};

export const bannerImageFallbacks: Record<string, string> = {
  "/banners/kopi-promo.jpg":
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1600&q=80",
  "/banners/batik-promo.jpg":
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1600&q=80",
  sembako:
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80",
};

export function getProductImageUrl(
  imageUrl: string | null | undefined,
  slug: string,
  categorySlug: string
) {
  if (imageUrl?.startsWith("http")) return imageUrl;
  if (imageUrl && localImageAliases[imageUrl]) return localImageAliases[imageUrl];

  return (
    productImageFallbacks[slug] ||
    categoryImageFallbacks[categorySlug] ||
    categoryImageFallbacks["makanan-minuman"]
  );
}

export function getBannerImageUrl(imageUrl: string | null | undefined) {
  if (imageUrl?.startsWith("http")) return imageUrl;
  if (imageUrl && bannerImageFallbacks[imageUrl]) return bannerImageFallbacks[imageUrl];

  return bannerImageFallbacks.sembako;
}

export const orderStatusLabels: Record<string, string> = {
  pending_payment: "Menunggu Pembayaran",
  payment_confirmed: "Pembayaran Dikonfirmasi",
  processing: "Diproses Penjual",
  shipped: "Dikirim",
  in_transit: "Dalam Pengiriman",
  delivered: "Barang Diterima",
  completed: "Selesai",
  cancelled: "Dibatalkan",
  refunded: "Dikembalikan",
};

export const paymentStatusLabels: Record<string, string> = {
  pending: "Menunggu",
  completed: "Berhasil",
  failed: "Gagal",
  refunded: "Refund",
};

export const shippingStatusLabels: Record<string, string> = {
  not_shipped: "Belum Dikirim",
  shipped: "Dikirim",
  in_transit: "Dalam Perjalanan",
  delivered: "Terkirim",
  cancelled: "Dibatalkan",
};

export function humanizeStatus(status: string, labels = orderStatusLabels) {
  const key = String(status || "").toLowerCase();
  return labels[key] || status;
}

export function statusBadgeClass(status: string) {
  const key = String(status || "").toLowerCase();

  if (["completed", "delivered"].includes(key)) {
    return "bg-emerald-100 text-emerald-700 border-emerald-200";
  }

  if (["shipped", "in_transit", "processing", "payment_confirmed"].includes(key)) {
    return "bg-sky-100 text-sky-700 border-sky-200";
  }

  if (["pending_payment", "pending", "not_shipped"].includes(key)) {
    return "bg-amber-100 text-amber-800 border-amber-200";
  }

  if (["cancelled", "failed", "refunded"].includes(key)) {
    return "bg-rose-100 text-rose-700 border-rose-200";
  }

  return "bg-stone-100 text-stone-700 border-stone-200";
}

export const shippingOptions = [
  {
    value: "JNE Reguler",
    label: "JNE Reguler",
    estimate: "2-4 hari",
    price: 25000,
  },
  {
    value: "Pos Indonesia Hemat",
    label: "Pos Indonesia Hemat",
    estimate: "3-6 hari",
    price: 18000,
  },
  {
    value: "Grab Same Day",
    label: "Grab Same Day",
    estimate: "Hari ini",
    price: 35000,
  },
];

export const paymentOptions = [
  { value: "transfer", label: "Transfer Bank", hint: "Virtual account bank" },
  { value: "ewallet", label: "E-Wallet", hint: "Saldo digital" },
  { value: "card", label: "Kartu Debit/Kredit", hint: "Otorisasi kartu" },
  { value: "cod", label: "Bayar di Tempat", hint: "Otomatis masuk proses" },
];

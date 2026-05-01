/**
 * Seed script untuk menambahkan data awal Pasar Kita.
 */

const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const categoriesSeed = [
  { name: "Makanan & Minuman", slug: "makanan-minuman", icon: "☕" },
  { name: "Fashion", slug: "fashion", icon: "👕" },
  { name: "Elektronik", slug: "elektronik", icon: "💻" },
  { name: "Kerajinan", slug: "kerajinan", icon: "🏺" },
  { name: "Alat Rumah Tangga", slug: "alat-rumah-tangga", icon: "🛒" },
];

const productsSeed = [
  {
    name: "Kopi Specialty Sumatra",
    slug: "kopi-specialty-sumatra",
    description:
      "Kopi arabika premium dari Sumatra dengan cita rasa kaya, dipanggang medium untuk aroma yang seimbang.",
    price: 89000,
    stock: 156,
    sold: 1250,
    rating: 4.8,
    totalReviews: 342,
    category: "makanan-minuman",
    store: "kopi-nusantara",
    image: "/images/kopi-1.jpg",
    variants: [
      { name: "Berat", value: "250g" },
      { name: "Jenis", value: "Arabika" },
      { name: "Asal", value: "Sumatra Utara" },
    ],
  },
  {
    name: "Gula Merah Organik",
    slug: "gula-merah-organik",
    description:
      "Gula merah murni tanpa campuran dari perkebunan lokal, cocok untuk minuman dan masakan rumahan.",
    price: 42000,
    stock: 89,
    sold: 789,
    rating: 4.7,
    totalReviews: 89,
    category: "makanan-minuman",
    store: "kopi-nusantara",
    image: "/images/gula-1.jpg",
  },
  {
    name: "Tahu Goreng Premium Bandung",
    slug: "tahu-goreng-premium-bandung",
    description:
      "Tahu gurih siap goreng dari Bandung dengan tekstur lembut dan kemasan higienis.",
    price: 35000,
    stock: 120,
    sold: 445,
    rating: 4.5,
    totalReviews: 445,
    category: "makanan-minuman",
    store: "kopi-nusantara",
    image: "/images/tahu-1.jpg",
  },
  {
    name: "Madu Asli Flores",
    slug: "madu-asli-flores",
    description:
      "Madu hutan Flores dengan rasa natural dan aroma bunga liar yang khas.",
    price: 65000,
    stock: 75,
    sold: 567,
    rating: 4.9,
    totalReviews: 567,
    category: "makanan-minuman",
    store: "kopi-nusantara",
    image: "/images/madu-1.jpg",
  },
  {
    name: "Batik Premium Pekalongan",
    slug: "batik-premium-pekalongan",
    description:
      "Batik berkualitas tinggi dengan motif tradisional Pekalongan dan bahan nyaman dipakai.",
    price: 275000,
    stock: 45,
    sold: 234,
    rating: 4.9,
    totalReviews: 156,
    category: "fashion",
    store: "batik-indah",
    image: "/images/batik-1.jpg",
    variants: [
      { name: "Bahan", value: "Katun premium" },
      { name: "Ukuran", value: "M, L, XL" },
    ],
  },
  {
    name: "Sarung Batik Kontemporer",
    slug: "sarung-batik-kontemporer",
    description:
      "Sarung batik dengan desain modern yang tetap membawa karakter motif Nusantara.",
    price: 185000,
    stock: 67,
    sold: 178,
    rating: 4.8,
    totalReviews: 178,
    category: "fashion",
    store: "batik-indah",
    image: "/images/sarung-1.jpg",
  },
  {
    name: "Tas Kulit Bandung",
    slug: "tas-kulit-bandung",
    description:
      "Tas kulit lokal dengan jahitan rapi, desain minimalis, dan ruang simpan lega.",
    price: 325000,
    stock: 32,
    sold: 289,
    rating: 4.6,
    totalReviews: 289,
    category: "fashion",
    store: "batik-indah",
    image: "/images/tas-kulit-1.jpg",
  },
  {
    name: "Laptop Bekas Gaming ASUS",
    slug: "laptop-bekas-gaming-asus",
    description:
      "Laptop gaming bekas berkualitas, sudah dicek fungsi utama dan siap pakai untuk kerja maupun bermain.",
    price: 4500000,
    stock: 8,
    sold: 234,
    rating: 4.6,
    totalReviews: 234,
    category: "elektronik",
    store: "tech-corner",
    image: "/images/laptop-1.jpg",
  },
  {
    name: "Mixer Roti Kualitas Industri",
    slug: "mixer-roti-kualitas-industri",
    description:
      "Mixer roti kapasitas besar untuk usaha rumahan, stabil untuk adonan berat.",
    price: 1200000,
    stock: 14,
    sold: 67,
    rating: 4.7,
    totalReviews: 67,
    category: "elektronik",
    store: "tech-corner",
    image: "/images/mixer-1.jpg",
  },
  {
    name: "Robot Vacuum LG",
    slug: "robot-vacuum-lg",
    description:
      "Robot vacuum praktis untuk membersihkan lantai rumah dengan jadwal otomatis.",
    price: 3200000,
    stock: 10,
    sold: 145,
    rating: 4.7,
    totalReviews: 145,
    category: "elektronik",
    store: "tech-corner",
    image: "/images/robot-vacuum-1.jpg",
  },
  {
    name: "Keramik Cirebon Handmade",
    slug: "keramik-cirebon-handmade",
    description:
      "Keramik handmade dari pengrajin Cirebon, cocok untuk dekorasi meja dan ruang tamu.",
    price: 155000,
    stock: 52,
    sold: 92,
    rating: 4.9,
    totalReviews: 92,
    category: "kerajinan",
    store: "seni-cirebon",
    image: "/images/keramik-1.jpg",
  },
  {
    name: "Tenun Ikat NTT",
    slug: "tenun-ikat-ntt",
    description:
      "Tenun ikat NTT dengan motif autentik dan warna kuat untuk koleksi atau hadiah.",
    price: 425000,
    stock: 21,
    sold: 123,
    rating: 4.8,
    totalReviews: 123,
    category: "kerajinan",
    store: "seni-cirebon",
    image: "/images/tenun-1.jpg",
  },
  {
    name: "Beras Pandan Wangi Cianjur",
    slug: "beras-pandan-wangi-cianjur",
    description:
      "Beras premium wangi alami dari Cianjur, cocok untuk kebutuhan harian keluarga dan usaha katering.",
    price: 78000,
    stock: 210,
    sold: 612,
    rating: 4.8,
    totalReviews: 118,
    category: "makanan-minuman",
    store: "kopi-nusantara",
    image: "/images/beras-1.jpg",
    variants: [
      { name: "Berat", value: "5kg" },
      { name: "Jenis", value: "Pandan wangi" },
    ],
  },
  {
    name: "Keripik Tempe Malang",
    slug: "keripik-tempe-malang",
    description:
      "Makanan ringan renyah khas Malang dengan bumbu gurih, dikemas rapat untuk oleh-oleh dan camilan.",
    price: 28000,
    stock: 180,
    sold: 934,
    rating: 4.7,
    totalReviews: 204,
    category: "makanan-minuman",
    store: "kopi-nusantara",
    image: "/images/keripik-1.jpg",
  },
  {
    name: "Sambal Roa Manado",
    slug: "sambal-roa-manado",
    description:
      "Sambal roa pedas gurih dari Manado dengan aroma ikan asap yang kuat, cocok untuk lauk harian.",
    price: 54000,
    stock: 96,
    sold: 408,
    rating: 4.8,
    totalReviews: 136,
    category: "makanan-minuman",
    store: "kopi-nusantara",
    image: "/images/sambal-1.jpg",
  },
  {
    name: "Set Panci Stainless UMKM",
    slug: "set-panci-stainless-umkm",
    description:
      "Set panci stainless untuk dapur rumah tangga, ringan, kuat, dan mudah dibersihkan.",
    price: 245000,
    stock: 38,
    sold: 87,
    rating: 4.6,
    totalReviews: 57,
    category: "alat-rumah-tangga",
    store: "tech-corner",
    image: "/images/panci-1.jpg",
    variants: [
      { name: "Isi", value: "3 ukuran" },
      { name: "Material", value: "Stainless steel" },
    ],
  },
  {
    name: "Lampu Meja Rotan",
    slug: "lampu-meja-rotan",
    description:
      "Lampu meja rotan buatan pengrajin lokal, memberi suasana hangat untuk kamar, ruang tamu, atau kafe.",
    price: 195000,
    stock: 24,
    sold: 74,
    rating: 4.9,
    totalReviews: 46,
    category: "kerajinan",
    store: "seni-cirebon",
    image: "/images/lampu-rotan-1.jpg",
  },
  {
    name: "Sabun Herbal Sereh",
    slug: "sabun-herbal-sereh",
    description:
      "Sabun handmade berbahan sereh dan minyak kelapa lokal, lembut untuk pemakaian harian.",
    price: 32000,
    stock: 140,
    sold: 355,
    rating: 4.7,
    totalReviews: 80,
    category: "alat-rumah-tangga",
    store: "seni-cirebon",
    image: "/images/sabun-sereh-1.jpg",
  },
];

async function clearDatabase() {
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.review.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.address.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.voucher.deleteMany();
  await prisma.storeAnalytics.deleteMany();
  await prisma.product.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.store.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  try {
    console.log("Mulai seeding data...");

    await clearDatabase();

    const password = await bcrypt.hash("password123", 10);

    const categories = {};
    for (const category of categoriesSeed) {
      categories[category.slug] = await prisma.category.create({
        data: category,
      });
    }
    console.log(`${Object.keys(categories).length} kategori dibuat`);

    await prisma.user.create({
      data: {
        email: "admin@example.com",
        password,
        name: "Admin Pasar Kita",
        role: "ADMIN",
      },
    });

    const sellers = {};
    const sellerSeeds = [
      {
        email: "seller@example.com",
        name: "Kopi Nusantara",
        slug: "kopi-nusantara",
        description: "Penjual kopi specialty dan pangan lokal pilihan.",
        rating: 4.8,
        totalReviews: 342,
      },
      {
        email: "batik@example.com",
        name: "Batik Indah",
        slug: "batik-indah",
        description: "Batik premium dari Pekalongan dan sekitarnya.",
        rating: 4.9,
        totalReviews: 156,
      },
      {
        email: "tech@example.com",
        name: "Tech Corner",
        slug: "tech-corner",
        description: "Elektronik baru dan bekas berkualitas untuk kebutuhan harian.",
        rating: 4.6,
        totalReviews: 234,
      },
      {
        email: "seni@example.com",
        name: "Seni Cirebon",
        slug: "seni-cirebon",
        description: "Kerajinan lokal dan produk kreatif dari pengrajin Nusantara.",
        rating: 4.9,
        totalReviews: 92,
      },
    ];

    for (const seller of sellerSeeds) {
      const user = await prisma.user.create({
        data: {
          email: seller.email,
          password,
          name: seller.name,
          role: "SELLER",
          store: {
            create: {
              name: seller.name,
              slug: seller.slug,
              description: seller.description,
              rating: seller.rating,
              totalReviews: seller.totalReviews,
              analytics: {
                create: {
                  totalSales: 25450000,
                  totalOrders: 156,
                  totalCustomers: 89,
                  averageRating: seller.rating,
                },
              },
            },
          },
        },
        include: { store: true },
      });

      sellers[seller.slug] = user.store;
    }
    console.log(`${Object.keys(sellers).length} seller dibuat`);

    const buyers = await Promise.all([
      prisma.user.create({
        data: {
          email: "buyer@example.com",
          password,
          name: "Budi Santoso",
          phone: "081234567890",
          role: "BUYER",
          addresses: {
            create: {
              name: "Budi Santoso",
              phone: "081234567890",
              street: "Jl. Merdeka No. 10",
              city: "Jakarta",
              province: "DKI Jakarta",
              postalCode: "10110",
              isDefault: true,
            },
          },
        },
      }),
      prisma.user.create({
        data: {
          email: "siti@example.com",
          password,
          name: "Siti Rahman",
          phone: "082345678901",
          role: "BUYER",
        },
      }),
    ]);
    console.log(`${buyers.length} buyer dibuat`);

    const products = [];
    for (const product of productsSeed) {
      const createdProduct = await prisma.product.create({
        data: {
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          stock: product.stock,
          sold: product.sold,
          rating: product.rating,
          totalReviews: product.totalReviews,
          storeId: sellers[product.store].id,
          categoryId: categories[product.category].id,
          images: {
            create: [{ url: product.image, order: 0 }],
          },
          variants: product.variants
            ? {
                create: product.variants,
              }
            : undefined,
        },
      });

      products.push(createdProduct);
    }
    console.log(`${products.length} produk dibuat`);

    await prisma.review.createMany({
      data: [
        {
          userId: buyers[0].id,
          productId: products[0].id,
          rating: 5,
          comment: "Kopinya harum dan fresh. Pengiriman juga cepat.",
        },
        {
          userId: buyers[1].id,
          productId: products[4].id,
          rating: 5,
          comment: "Batiknya halus, warna sesuai foto, packaging rapi.",
        },
      ],
    });

    const buyerAddress = await prisma.address.findFirst({
      where: {
        userId: buyers[0].id,
      },
    });

    const demoOrder = await prisma.order.create({
      data: {
        orderNumber: "ORD-DEMO-001",
        status: "PAYMENT_CONFIRMED",
        paymentStatus: "COMPLETED",
        shippingStatus: "NOT_SHIPPED",
        totalAmount: products[0].price * 2,
        shippingCost: 25000,
        finalAmount: products[0].price * 2 + 25000,
        userId: buyers[0].id,
        addressId: buyerAddress?.id,
        items: {
          create: [
            {
              productId: products[0].id,
              quantity: 2,
              price: products[0].price,
            },
          ],
        },
        payment: {
          create: {
            method: "TRANSFER",
            status: "COMPLETED",
            amount: products[0].price * 2 + 25000,
            transactionId: "TRX-DEMO-001",
            paidAt: new Date(),
          },
        },
        shipment: {
          create: {
            carrier: "JNE",
            status: "NOT_SHIPPED",
            estimatedDays: 4,
          },
        },
      },
    });
    console.log(`1 pesanan demo dibuat: ${demoOrder.orderNumber}`);

    await prisma.voucher.createMany({
      data: [
        {
          code: "KOPI10",
          description: "Diskon kopi pilihan Pasar Kita",
          discountType: "PERCENTAGE",
          discountValue: 10,
          minPurchase: 75000,
          maxUsage: 100,
          validFrom: new Date(),
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          storeId: sellers["kopi-nusantara"].id,
        },
        {
          code: "BATIK25K",
          description: "Potongan belanja batik premium",
          discountType: "FIXED",
          discountValue: 25000,
          minPurchase: 200000,
          maxUsage: 50,
          validFrom: new Date(),
          validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
          storeId: sellers["batik-indah"].id,
        },
      ],
    });
    console.log("2 voucher toko dibuat");

    await prisma.conversation.create({
      data: {
        userId: buyers[0].id,
        messages: {
          create: [
            {
              content: "Halo, apakah Kopi Specialty Sumatra masih tersedia?",
              senderRole: "BUYER",
            },
            {
              content: "Masih tersedia, stok ready dan bisa dikirim hari ini.",
              senderRole: "SELLER",
            },
          ],
        },
      },
    });
    console.log("1 percakapan chat demo dibuat");

    await prisma.banner.createMany({
      data: [
        {
          title: "Promo Kopi Spesial",
          image: "/banners/kopi-promo.jpg",
          link: "/browse?category=makanan-minuman",
          order: 1,
          active: true,
        },
        {
          title: "Batik Terbaik Indonesia",
          image: "/banners/batik-promo.jpg",
          link: "/browse?category=fashion",
          order: 2,
          active: true,
        },
      ],
    });

    console.log("Seeding berhasil.");
    console.log("Akun demo: buyer@example.com, seller@example.com, admin@example.com");
    console.log("Password semua akun demo: password123");
  } catch (error) {
    console.error("Error saat seeding:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

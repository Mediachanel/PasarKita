import type {
  Category,
  Product,
  ProductImage,
  ProductVariant,
  Review,
  Store,
  User,
} from "@prisma/client";
import { getProductImageUrl } from "@/lib/marketplace";

type ProductWithRelations = Product & {
  category: Pick<Category, "id" | "name" | "slug" | "icon">;
  store: Pick<Store, "id" | "name" | "slug" | "rating" | "totalReviews">;
  images: Pick<ProductImage, "url" | "order">[];
  variants?: Pick<ProductVariant, "name" | "value">[];
  reviews?: Array<Review & { user: Pick<User, "name"> }>;
};

const emojiByCategory: Record<string, string> = {
  "makanan-minuman": "☕",
  fashion: "👕",
  elektronik: "💻",
  kerajinan: "🏺",
  "alat-rumah-tangga": "🛒",
};

export const productInclude = {
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
      icon: true,
    },
  },
  store: {
    select: {
      id: true,
      name: true,
      slug: true,
      rating: true,
      totalReviews: true,
    },
  },
  images: {
    orderBy: {
      order: "asc" as const,
    },
    select: {
      url: true,
      order: true,
    },
  },
};

export const productDetailInclude = {
  ...productInclude,
  variants: {
    select: {
      name: true,
      value: true,
    },
  },
  reviews: {
    orderBy: {
      createdAt: "desc" as const,
    },
    take: 10,
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  },
};

export function getCategoryEmoji(category: Pick<Category, "slug" | "icon">) {
  return category.icon || emojiByCategory[category.slug] || "🛍️";
}

export function serializeProduct(product: ProductWithRelations) {
  const imageUrl = getProductImageUrl(
    product.images[0]?.url,
    product.slug,
    product.category.slug
  );

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    sold: product.sold,
    rating: product.rating,
    reviews: product.totalReviews,
    image: getCategoryEmoji(product.category),
    imageUrl,
    category: product.category,
    store: product.store,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export function serializeProductDetail(product: ProductWithRelations) {
  const variants = product.variants ?? [];
  const reviews = product.reviews ?? [];
  const imageUrls = product.images.length
    ? product.images.map((image) =>
        getProductImageUrl(image.url, product.slug, product.category.slug)
      )
    : [getProductImageUrl(null, product.slug, product.category.slug)];
  const specifications = Object.fromEntries(
    variants.map((variant) => [variant.name, variant.value])
  );

  return {
    ...serializeProduct(product),
    originalPrice: Math.round(product.price * 1.25),
    images: imageUrls,
    specifications: {
      Kategori: product.category.name,
      Toko: product.store.name,
      Stok: `${product.stock}`,
      Terjual: `${product.sold}`,
      ...specifications,
    },
    reviewItems: reviews.map((review) => ({
      id: review.id,
      author: review.user.name,
      rating: review.rating,
      comment: review.comment ?? "",
      date: review.createdAt.toISOString(),
    })),
  };
}

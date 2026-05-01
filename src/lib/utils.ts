/**
 * Utility functions untuk Pasar Kita
 */

// Format rupiah currency
export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Format date
export const formatDate = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
};

// Format time
export const formatTime = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
};

// Generate order number
export const generateOrderNumber = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
};

// Generate tracking number untuk simulasi pengiriman otomatis
export const generateTrackingNumber = (carrier = "PK"): string => {
  const prefix = carrier
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 4)
    .toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  return `${prefix || "PK"}-${timestamp}-${random}`;
};

// Validate email
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate phone
export const validatePhone = (phone: string): boolean => {
  const re = /^(\+62|0)[0-9]{9,12}$/;
  return re.test(phone.replace(/\s/g, ""));
};

// Calculate discount percentage
export const calculateDiscount = (
  originalPrice: number,
  discountedPrice: number
): number => {
  return Math.round(
    ((originalPrice - discountedPrice) / originalPrice) * 100
  );
};

// Slugify string
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Truncate text
export const truncate = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return text.substr(0, length) + "...";
};

// Get image URL (placeholder)
export const getImageUrl = (filename: string): string => {
  return `/uploads/${filename}`;
};

// Sleep function (for testing)
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

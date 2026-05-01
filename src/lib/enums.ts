export const UserRole = {
  BUYER: "BUYER",
  SELLER: "SELLER",
  ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const OrderStatus = {
  PENDING_PAYMENT: "PENDING_PAYMENT",
  PAYMENT_CONFIRMED: "PAYMENT_CONFIRMED",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const PaymentStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const ShippingStatus = {
  NOT_SHIPPED: "NOT_SHIPPED",
  SHIPPED: "SHIPPED",
  IN_TRANSIT: "IN_TRANSIT",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
} as const;

export type ShippingStatus =
  (typeof ShippingStatus)[keyof typeof ShippingStatus];

export const PaymentMethod = {
  TRANSFER: "TRANSFER",
  CARD: "CARD",
  EWALLET: "EWALLET",
  COD: "COD",
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const DiscountType = {
  PERCENTAGE: "PERCENTAGE",
  FIXED: "FIXED",
} as const;

export type DiscountType = (typeof DiscountType)[keyof typeof DiscountType];

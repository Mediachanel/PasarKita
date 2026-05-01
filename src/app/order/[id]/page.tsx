import OrderDetailClient from "./OrderDetailClient";

export function generateStaticParams() {
  return [{ id: "static-export" }];
}

export default function OrderDetailPage() {
  return <OrderDetailClient />;
}

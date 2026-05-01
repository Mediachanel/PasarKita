import ProductDetailClient from "./ProductDetailClient";

export function generateStaticParams() {
  return [{ id: "static-export" }];
}

export default function ProductDetailPage() {
  return <ProductDetailClient />;
}

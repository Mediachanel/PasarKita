import ProductEditClient from "./ProductEditClient";

export function generateStaticParams() {
  return [{ id: "static-export" }];
}

export default function ProductEditPage() {
  return <ProductEditClient />;
}

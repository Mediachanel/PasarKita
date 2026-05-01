import OrderSuccessClient from "./OrderSuccessClient";

export function generateStaticParams() {
  return [{ id: "static-export" }];
}

export default function OrderSuccessPage() {
  return <OrderSuccessClient />;
}

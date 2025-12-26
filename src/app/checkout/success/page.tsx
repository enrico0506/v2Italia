import CheckoutSuccessClient from "./CheckoutSuccessClient";

export default function CheckoutSuccessPage({ searchParams }: { searchParams?: { orderId?: string } }) {
  return <CheckoutSuccessClient orderId={searchParams?.orderId ?? null} />;
}

import PayPalReturnClient from "./PayPalReturnClient";

export default function PayPalReturnPage({
  searchParams,
}: {
  searchParams?: { token?: string; orderId?: string };
}) {
  return (
    <PayPalReturnClient
      token={searchParams?.token ?? null}
      orderId={searchParams?.orderId ?? null}
    />
  );
}

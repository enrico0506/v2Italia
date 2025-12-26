type PayPalEnv = "sandbox" | "live";

function getApiBase() {
  const env = (process.env.PAYPAL_ENV ?? "sandbox") as PayPalEnv;
  return env === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
}

function required(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`${name} missing`);
  return v;
}

export async function getPayPalAccessToken() {
  const clientId = required("PAYPAL_CLIENT_ID");
  const clientSecret = required("PAYPAL_CLIENT_SECRET");
  const base = getApiBase();

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal token error: ${res.status} ${text}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export async function createPayPalOrder(params: {
  totalCents: number;
  currency: string; // "EUR"
  referenceId: string; // orderId
  returnUrl: string;
  cancelUrl: string;
}) {
  const token = await getPayPalAccessToken();
  const base = getApiBase();

  const res = await fetch(`${base}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: params.referenceId,
          amount: {
            currency_code: params.currency,
            value: (params.totalCents / 100).toFixed(2),
          },
        },
      ],
      application_context: {
        return_url: params.returnUrl,
        cancel_url: params.cancelUrl,
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal create order error: ${res.status} ${text}`);
  }

  return (await res.json()) as any;
}

export async function capturePayPalOrder(orderId: string) {
  const token = await getPayPalAccessToken();
  const base = getApiBase();

  const res = await fetch(`${base}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal capture error: ${res.status} ${text}`);
  }

  return (await res.json()) as any;
}

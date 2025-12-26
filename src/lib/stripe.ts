import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  // Do not throw at import time in dev; routes will validate presence.
  // This helps the rest of the app boot even without Stripe configured.
  console.warn("STRIPE_SECRET_KEY is missing. Stripe checkout will not work until you configure .env");
}

export const stripe = key ? new Stripe(key) : (null as any as Stripe);

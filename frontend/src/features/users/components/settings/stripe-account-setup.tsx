"use client";

import { useCallback } from "react";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { env } from "@/env";

interface Props {
  stripeClientSecret: string;
}

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PB_KEY);

export function StripeAccountSetup({ stripeClientSecret }: Props) {
  const fetchClientSecret = useCallback(async () => {
    return stripeClientSecret;
  }, [stripeClientSecret]);

  return (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{ fetchClientSecret }}
    >
      <EmbeddedCheckout className="mx-0 flex pt-8 md:w-[400px]" />
    </EmbeddedCheckoutProvider>
  );
}

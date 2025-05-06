"use client";

import { useEffect, useState } from "react";
import {
  renderCardInfo,
  renderPaypalInfo,
} from "@/features/users/components/settings/payment-method-list";
import {
  CardDetails,
  PaymentAccount,
  PaypalDetails,
} from "@/server/types/domain";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreatePaymentMethodDialog } from "@/features/users/components/settings/create-payment-method-dialog";
import { Button } from "@/components/ui/button";
import { StripeAccountSetup } from "@/features/users/components/settings/stripe-account-setup";
import { useStripeCallback } from "@/features/billing/hooks/use-billing";

interface Props {
  accounts: PaymentAccount[];
  value?: number;
  onValueChange?: (value: number) => void;
}

export function PaymentMethodSelect({ accounts, value, onValueChange }: Props) {
  const [clientSecret, setClientSecret] = useState<string>();

  const { handStripeCallback, stripeCallbackParams } = useStripeCallback();

  useEffect(() => {
    (async () => {
      if (stripeCallbackParams) {
        await handStripeCallback(stripeCallbackParams);
      }
    })();
  }, [stripeCallbackParams]);

  const handleValueChange = (value: string) => {
    if (onValueChange) {
      onValueChange(parseInt(value));
    }
  };

  return (
    <div className="">
      <RadioGroup
        value={value?.toString()}
        onValueChange={onValueChange ? handleValueChange : undefined}
      >
        {accounts?.map((account) => (
          <div key={account.id} className="flex flex-col">
            <RadioGroupItem
              value={`${account.id}`}
              id={`${account.id}`}
              className="peer sr-only"
            />
            <Label
              htmlFor={`${account.id}`}
              className="flex h-16 rounded-md border-2 border-muted bg-popover px-4 hover:cursor-pointer hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-brand-500 [&:has([data-state=checked])]:border-brand-500"
            >
              <div className="flex items-center">
                {account.method === "PAYPAL" &&
                  // @ts-ignore TODO: Fix this type error
                  renderPaypalInfo(account.details as PaypalDetails)}

                {account.method === "CARD" &&
                  // @ts-ignore TODO: Fix this type error
                  renderCardInfo(account.details as CardDetails)}
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
      <CreatePaymentMethodDialog
        open={false}
        setOpen={() => {}}
        onSuccess={(value) => {
          console.log("PaymentMethod>>", { clientSecret });
          setClientSecret(value);
        }}
      >
        <div className="w-full py-4">
          <Button className="w-full bg-accent-400 text-negative">
            Add a new payment method
          </Button>
        </div>
      </CreatePaymentMethodDialog>
      {clientSecret && <StripeAccountSetup stripeClientSecret={clientSecret} />}
    </div>
  );
}

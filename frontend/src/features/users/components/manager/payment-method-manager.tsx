"use client";

import { CreatePaymentMethodDialog } from "@/features/users/components/settings/create-payment-method-dialog";
import { PaymentMethodList } from "@/features/users/components/settings/payment-method-list";

import { useEffect, useState } from "react";
import { useStripeCallback } from "@/features/billing/hooks/use-billing";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useRouter } from "@/i18n/routing";

export function PaymentMethodManager() {
  const router = useRouter();
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);

  const { handStripeCallback, stripeCallbackParams } = useStripeCallback();

  useEffect(() => {
    (async () => {
      if (stripeCallbackParams) {
        await handStripeCallback(stripeCallbackParams);
      }
    })();
  }, [stripeCallbackParams]);

  const onSuccess = (clientSecret: string) => {
    router.push(
      `/account/settings/billing/complete-setup?stripeClientSecret=${clientSecret}`
    );
  };

  return (
    <>
      <div className="max-w-[720px]">
        <div className="">
          <h3 className="mb-2 text-xl font-semibold text-title">
            Your payments
          </h3>
          <p className="font-light text-body">
            Keep track of all your payments and refunds.
          </p>
        </div>
        <div className="pt-6">
          <Button variant="primary" href="/account/receipts">
            Manage payments
          </Button>
        </div>
        <div className="py-8"></div>
        <div className="flex flex-col items-start gap-8 border-b border-neutral-200 pb-6 pt-8 md:flex-row md:justify-between">
          <div className="flex flex-col items-start">
            <h3 className="mb-2 text-xl font-semibold text-title">
              Payment methods
            </h3>
            <p className="font-light text-body">
              Add and manage your payment methods using our secure payment
              system.
            </p>
          </div>

          <Button
            onClick={() => setAddDialogOpen(true)}
            className="flex-1 space-x-2 bg-accent-400 hover:bg-accent-500"
          >
            <PlusIcon className="size-6" />
            <span>Add payment method</span>
          </Button>
        </div>
        <div className="py-6">
          <PaymentMethodList />
        </div>
      </div>

      {/* Dialog to add a new payment method */}
      <CreatePaymentMethodDialog
        open={addDialogOpen}
        setOpen={setAddDialogOpen}
        onSuccess={onSuccess}
      />
    </>
  );
}

import Image from "next/image";
import { api } from "@/trpc/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  PaymentMethodFormData,
  PaymentMethodSchema,
} from "@/server/api/routers/billing/schema";
import { usePathname } from "@/i18n/routing";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { PropsWithChildren } from "react";
import { env } from "@/env";

interface AddPaymentMethodDialogProps {
  onSuccess: PaymentMethodProps["onSuccess"];
  open?: boolean;
  setOpen: (open: boolean) => void;
}

export function CreatePaymentMethodDialog(
  props: PropsWithChildren<AddPaymentMethodDialogProps>
) {
  return (
    <ResponsiveDialog open={props.open} onOpenChange={props.setOpen}>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Add payment method</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            <span className="sr-only">
              Choose between Paypal or Credit Card as your payment method.
            </span>
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <PaymentMethodForm
          onCancel={() => props.setOpen(false)}
          onSuccess={(secret) => {
            props.onSuccess?.(secret);
          }}
        />
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}

interface PaymentMethodProps {
  onCancel?: () => void;
  onSuccess?: (clientSecret: string) => void;
}

function PaymentMethodForm({
  onCancel,
  onSuccess,
}: Readonly<PaymentMethodProps>) {
  const pathname = usePathname();

  const form = useForm<PaymentMethodFormData>({
    resolver: zodResolver(PaymentMethodSchema),
  });

  const { mutateAsync: createPaymentAccount } =
    api.billing.setupAccount.useMutation();

  async function onSubmit(data: PaymentMethodFormData) {
    const { data: response } = await createPaymentAccount({
      paymentMethod: data.paymentMethod,
      callbackUrl: `${env.NEXT_PUBLIC_APP_URL}${pathname}`,
    });

    form.reset();

    if (onSuccess) {
      if (response) {
        onSuccess(response.clientSecret);
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2 px-4 py-6"
                >
                  <div>
                    <RadioGroupItem
                      value="PAYPAL"
                      id="PAYPAL"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="PAYPAL"
                      className="flex min-h-[140px] flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:cursor-pointer hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-brand-500 [&:has([data-state=checked])]:border-brand-500"
                    >
                      <Image
                        src="/images/brand/paypal.png"
                        width={72}
                        height={72}
                        alt="Paypal logo"
                      />
                      <span className="py-2 text-body">Paypal</span>
                    </Label>
                  </div>
                  <FormItem className="">
                    <FormControl>
                      <div>
                        <RadioGroupItem
                          value="CARD"
                          id="CARD"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="CARD"
                          className="flex h-full min-h-[140px] flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:cursor-pointer hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-brand-500 [&:has([data-state=checked])]:border-brand-500"
                        >
                          <Image
                            src="/images/brand/credit-cards.png"
                            width={144}
                            height={72}
                            alt="Master card and visa logo"
                          />
                          <span className="py-2 text-body">Credit Card</span>
                        </Label>
                      </div>
                    </FormControl>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex w-full items-center justify-between border-t border-border px-4 py-6">
          <Button
            variant="link"
            type="button"
            onClick={onCancel}
            className="text-accent-400 underline"
          >
            Cancel
          </Button>
          <Button
            size="lg"
            type="submit"
            disabled={!form.formState.isDirty || !form.formState.isValid}
            loading={form.formState.isSubmitting || form.formState.isLoading}
            className="rounded-full bg-brand-500 text-negative hover:bg-brand-700"
          >
            Done
          </Button>
        </div>
      </form>
    </Form>
  );
}

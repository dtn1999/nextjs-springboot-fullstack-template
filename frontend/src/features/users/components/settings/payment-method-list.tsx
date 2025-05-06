import { useCallback } from "react";
import Image from "next/image";
import { api } from "@/trpc/react";
import {
  EllipsisHorizontalIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import { Card, CardContent, CardDescription } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CardDetails,
  PaymentAccount,
  PaypalDetails,
} from "@/server/types/domain";
import { Loader } from "@/components/loader";
import { usePaymentAccountActions } from "@/features/billing/hooks/use-billing";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { alert } from "@/lib/alert";

const PAYMENT_PROVIDERS_LOGOS = {
  paypal: "/images/brand/paypal.png",
  visa: "/images/brand/visa.png",
  mastercard: "/images/brand/master.png",
};

type PaymentMethodType = keyof typeof PAYMENT_PROVIDERS_LOGOS;

export function PaymentMethodList() {
  const { data, isLoading } = api.billing.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center py-4">
        <Loader />
      </div>
    );
  }

  if (isLoading) {
  }

  if (!isLoading && data?.data?.length === 0) {
    return <NoPaymentMethod />;
  }

  if (!isLoading && data?.error) {
    alert(data?.error);
    return <div>Error loading payment methods</div>;
  }

  return (
    <div className="grid w-full grid-cols-1 space-y-4">
      {data?.data?.map((method) => (
        <PaymentMethodCard key={method.id} data={method} />
      ))}
    </div>
  );
}

function NoPaymentMethod() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <p className="text-lg font-light text-caption dark:text-white/90">
        No payment method added yet
      </p>
    </div>
  );
}

interface PaymentMethodCardProps {
  showOptionsAction?: boolean;
  data: PaymentAccount;
}

export function PaymentMethodCard({
  showOptionsAction = true,
  data,
}: PaymentMethodCardProps) {
  const { deleteAccount, makeDefault, loading } = usePaymentAccountActions();
  const { isDefault, details, method } = data;

  const _renderPaypalInfo = useCallback(() => {
    // @ts-ignore TODO: Fix this type error
    return renderPaypalInfo(details as PaypalDetails);
  }, [details]);
  const _renderCardInfo = useCallback(() => {
    // @ts-ignore TODO: Fix this type error
    return renderCardInfo(details as CardDetails);
  }, [details]);

  const renderPaymentMethodDetails = useCallback(() => {
    if (method === "CARD") {
      return _renderCardInfo();
    }
    if (method === "PAYPAL") {
      return _renderPaypalInfo();
    }
    throw new Error(`${method} is not a valid payment method type`);
  }, [method]);

  if (!details) {
    return null;
  }

  return (
    <Card className="group relative p-0">
      <CardContent className="flex h-20 items-center py-7 md:py-6">
        {renderPaymentMethodDetails()}
      </CardContent>
      {isDefault && (
        <Badge
          color="blue"
          name={<span className="uppercase">default</span>}
          className="absolute left-2 top-2"
        />
      )}
      {showOptionsAction && (
        <div className="absolute right-1 top-0">
          {loading ? (
            <div className="absolute right-1 top-2">
              <Loader className="" />
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="absolute right-2 top-2 rounded-md p-2 hover:bg-accent hover:text-accent-foreground">
                  <EllipsisHorizontalIcon className="size-4 font-bold" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                alignOffset={64}
                sideOffset={24}
                className="w-24"
              >
                <DropdownMenuItem
                  onClick={() => makeDefault(data.id)}
                  className="group p-0 hover:cursor-pointer"
                >
                  <div className="flex h-full w-full items-center p-2 text-gray-900">
                    <PencilIcon className="size-6" />
                    <span>Set default</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => deleteAccount(data.id)}
                  className="group p-0 hover:cursor-pointer"
                >
                  <div className="flex h-full w-full items-center p-2 text-red-500 group-hover:bg-red-50 group-hover:text-red-500">
                    <TrashIcon className="size-6" />
                    <span>Delete</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}
    </Card>
  );
}

export function renderPaypalInfo(data: PaypalDetails) {
  if (data.method !== "PAYPAL") {
    return null;
  }

  const paypalDetails = data;

  return (
    <div className="flex items-center space-x-4 py-3">
      <div className="w-10">
        <div className="relative aspect-square">
          <Image
            className="object-contain"
            src="/images/brand/paypal.png"
            width={56}
            height={56}
            alt="Paypal logo"
          />
        </div>
      </div>
      <div className="">
        <CardDescription className="flex flex-col text-sm text-title">
          <span className="first-letter:capitalize">
            Paypal account with email{" "}
            <span className="font-semibold">{paypalDetails.maskedEmail}</span>
          </span>
        </CardDescription>
      </div>
    </div>
  );
}

export function renderCardInfo(data: CardDetails) {
  if (data.method !== "CARD") {
    return null;
  }

  const { brand, last4, expiry } = data;

  if (!brand) {
    throw new Error(`Brand is required for card payment method`);
  }

  let brandLogo =
    PAYMENT_PROVIDERS_LOGOS[brand.toLowerCase() as PaymentMethodType];

  if (!brandLogo) {
    brandLogo = "/images/brand/credit-cards.png";
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="w-10">
        <div className="relative aspect-square">
          <Image
            fill
            src={brandLogo}
            alt="Paypal logo"
            className="object-contain"
          />
        </div>
      </div>
      <div className="">
        <CardDescription className="flex flex-col text-sm text-title">
          <span>
            <span className="capitalize">{brand}</span> card ending in{" "}
            <span className="font-semibold">{last4}</span>
          </span>
          <span>Expires {expiry}</span>
        </CardDescription>
      </div>
    </div>
  );
}

export function PaymentMethodCardSkeleton() {
  return (
    <Skeleton className="flex h-20 items-center py-7 md:py-6">
      <Skeleton className="size-8" />
      <Skeleton className="h-20 w-full" />
    </Skeleton>
  );
}

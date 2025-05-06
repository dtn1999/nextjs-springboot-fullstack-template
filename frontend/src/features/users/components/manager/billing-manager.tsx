"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PayoutMethodTab } from "@/features/users/components/settings/payout-method-tab";
import { PaymentMethodManager } from "@/features/users/components/manager/payment-method-manager";
import { parseAsStringEnum, useQueryState } from "nuqs";

enum BillingTabs {
  PAYMENTS = "payments",
  PAYOUTS = "payouts",
}

export function BillingManager() {
  const [activeTab, setActiveTab] = useQueryState<BillingTabs>(
    "billingTab",
    parseAsStringEnum<BillingTabs>(Object.values(BillingTabs)).withOptions({
      history: "push",
    })
  );

  return (
    <Tabs
      value={activeTab ?? BillingTabs.PAYMENTS}
      onValueChange={(nextTab) => setActiveTab(nextTab as BillingTabs)}
      className="w-full"
    >
      <TabsList className="flex h-16 justify-start rounded-none border-b border-border bg-transparent p-0">
        <TabsTrigger value={BillingTabs.PAYMENTS}>Payments</TabsTrigger>
        <TabsTrigger value={BillingTabs.PAYOUTS}>Payouts</TabsTrigger>
      </TabsList>
      <TabsContent className="py-4" value="payments">
        <PaymentMethodManager />
      </TabsContent>
      <TabsContent className="py-4" value="payouts">
        <PayoutMethodTab />
      </TabsContent>
    </Tabs>
  );
}

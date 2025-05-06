import Link from "next/link";
import { Button } from "@/components/ui/button";
import React from "react";

export function PayoutMethodTab() {
  return (
    <div className="max-w-2xl">
      <div className="block text-neutral-700 dark:text-neutral-300">
        <span className="">
          {`When you receive a payment for a reservation, we call that payment
              to you a "payout." Our secure payment system supports several
              payout methods, which can be set up below. 
              `}
        </span>
        <Link href="" className="text-accent-400 underline">
          Go to FAQ.
        </Link>
        <br />
        <br />
        To get paid, you need to set up a payout method. CozyStay releases
        payouts about 24 hours after a guest’s scheduled check-in time. The time
        it takes for the funds to appear in your account depends on your payout
        method.
        <Link href="" className="px-1 text-accent-400 underline">
          Learn more.
        </Link>
      </div>
      <div className="pt-10">
        <Button disabled variant="primary">
          Add payout method
        </Button>
        <p className="font-light text-caption">
          Adding payout method is currently not supported. We will inform you
          soon.
        </p>
      </div>
    </div>
  );
}

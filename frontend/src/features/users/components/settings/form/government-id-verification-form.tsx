"use client";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useAccountQuery } from "@/features/users/hooks/use-accounts";
import { GovernmentIdUploader } from "@/features/users/components/government-id-uploader";
import { notFound } from "next/navigation";

interface GovernmentIdVerificationForm {
  accountId: number;
}

export function GovernmentIdVerificationForm({
  accountId,
}: GovernmentIdVerificationForm) {
  const { account } = useAccountQuery(accountId, true);

  if (!account) {
    notFound();
  }

  const governmentId = account.personalInformation.governmentId;

  if (governmentId?.status === "APPROVED") {
    return (
      <div>
        <p>Your government ID has already been verified</p>
      </div>
    );
  }

  if (governmentId?.status === "PENDING") {
    return (
      <div>
        <p className="text-caption">
          Your government ID verification submitted on{" "}
          <span className="text-accent-400">
            {format(governmentId.createdAt, "dd MMMM yyyy 'at' HH:mm")}
          </span>{" "}
          is pending. You will be notified once it has been reviewed.
        </p>
        <Button
          href="/account/settings/personal-information"
          variant="primary"
          className="mt-4 flex w-fit items-center space-y-2 px-10"
        >
          <span>Go back to settings</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <GovernmentIdUploader accountId={accountId} governmentId={governmentId} />
    </div>
  );
}

"use client";

import React, { type ReactNode } from "react";

import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Mail,
  Phone,
} from "lucide-react";
import { IdentificationIcon } from "@heroicons/react/24/outline";
import { Progress } from "@/components/ui/progress";
import { Link } from "@/i18n/routing";
import { GovernmentId } from "@/server/types/domain";
import { formatter } from "@/lib/formatter";
import { cn } from "@/lib/utils";
import { useSessionUtils } from "@/hooks/use-auth";
import { isAdmin } from "@/server/auth/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VerificationItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isVerified: boolean;
  verifyAction?: () => ReactNode;
  pending?: boolean;
}

const VerificationItem = ({
  title,
  description,
  icon,
  isVerified,
  pending,
  verifyAction,
}: VerificationItemProps) => {
  const renderIcon = () => {
    if (isVerified) {
      return <CheckCircle className="size-6 text-green-600" />;
    }
    if (pending) {
      return <AlertCircle className="size-6 text-yellow-600" />;
    }

    return <AlertCircle className="size-6 text-red-600" />;
  };

  const renderBadge = () => {
    if (isVerified) {
      return (
        <div className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
          Verified
        </div>
      );
    }

    if (pending && !verifyAction) {
      return (
        <div className="rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
          Pending
        </div>
      );
    }

    if (verifyAction) {
      return verifyAction?.();
    }
  };

  return (
    <div className="flex items-center rounded-lg border bg-background p-3">
      <div
        className={cn(
          `mr-3 flex h-8 w-8 items-center justify-center rounded-full`,
          {
            "bg-yellow-100": pending,
            "bg-red-100": !isVerified && !pending,
            "bg-green-100": isVerified,
          }
        )}
      >
        {renderIcon()}
      </div>

      <div className="flex-1">
        <div className="flex items-center">
          {icon}
          <span className="font-medium">{title}</span>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div>{renderBadge()}</div>
    </div>
  );
};

interface ProfileVerificationStatusProps {
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isIdVerified: boolean;
  governmentId?: GovernmentId;
  accountId: number;
}

export function ProfileVerificationStatus(
  props: ProfileVerificationStatusProps
) {
  const {
    isEmailVerified,
    isPhoneVerified,
    isIdVerified,
    governmentId,
    accountId,
  } = props;

  const { user } = useSessionUtils();

  const verifiedCount = [isEmailVerified, isPhoneVerified, isIdVerified].filter(
    Boolean
  ).length;

  const progressPercentage = (verifiedCount / 3) * 100;

  const governmentIdDescription = () => {
    if (!governmentId) {
      return "Please verify your identity";
    }

    if (governmentId.status === "PENDING") {
      return `Verification submitted on ${formatter.verificationDate(governmentId.createdAt)}`;
    }

    if (governmentId.status === "REJECTED") {
      return `Your verification was rejected. Please resubmit`;
    }

    return `Verification completed on ${formatter.verificationDate(governmentId.createdAt)}`;
  };

  const governmentIdVerificationLink = () => {
    if (isAdmin(user)) {
      return (
        <Button
          href={`/admin/users/${accountId}/verify-government-id`}
          variant="primary"
        >
          Verify
        </Button>
      );
    }

    if (!governmentId || governmentId.status === "REJECTED") {
      return (
        <Link
          href={`/account/settings/information/verifications/${accountId}/government-id`}
          className="flex items-center whitespace-nowrap rounded-full border border-border px-4 py-1"
        >
          Verify
          <ArrowRight className="ml-1 size-4" />
        </Link>
      );
    }

    return <></>;
  };

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-lg font-medium">Verification Progress</h3>
        <span className="text-sm text-muted-foreground">
          {verifiedCount} of 3 verified
        </span>
      </div>

      <p className="mb-4 text-caption">
        Verify your account to increase your trustworthiness on CoziStays.{" "}
        <Link href="" className="underline">
          Learn more
        </Link>
      </p>

      <Progress value={progressPercentage} className="mb-6 h-2" />

      <div className="space-y-4">
        <VerificationItem
          title="Email"
          description={
            isEmailVerified
              ? "Your email has been verified"
              : "Please verify your email address"
          }
          icon={<Mail className="mr-2 size-6 text-muted-foreground" />}
          isVerified={isEmailVerified}
          verifyAction={() => (
            <Link
              href="/account/settings/personal-information/verifications/email"
              className="flex items-center whitespace-nowrap rounded-full border border-border px-4 py-1"
            >
              Verify
              <ArrowRight className="ml-1 size-4" />
            </Link>
          )}
        />

        <VerificationItem
          title="Phone"
          description={
            isPhoneVerified
              ? "Your phone number has been verified"
              : "Please verify your phone number"
          }
          icon={<Phone className="mr-2 size-6 text-muted-foreground" />}
          isVerified={isPhoneVerified}
          verifyAction={() => (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    // variant="outline"
                    className="flex items-center whitespace-nowrap rounded-full border border-border px-4 py-1 hover:cursor-pointer"
                  >
                    Verify
                    <ArrowRight className="ml-1 size-4" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Phone number verification is currently not supported.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        />

        <VerificationItem
          title="ID Verification"
          description={governmentIdDescription()}
          icon={
            <IdentificationIcon className="mr-2 size-6 text-muted-foreground" />
          }
          isVerified={isIdVerified}
          verifyAction={governmentIdVerificationLink}
        />
      </div>
    </div>
  );
}

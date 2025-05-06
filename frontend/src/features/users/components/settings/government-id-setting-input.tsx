import { cn } from "@/lib/utils";
import { PersonalInformation } from "@/server/types/domain";
import { format } from "date-fns";
import { useSessionUtils } from "@/hooks/use-auth";
import { isAdmin } from "@/server/auth/utils";
import { Button } from "@/components/ui/button";

interface Props {
  disabled?: boolean;
  accountId: number;
  governmentId?: PersonalInformation["governmentId"];
  onClick?: () => void;
}

export function GovernmentIdSettingInput({
  disabled,
  governmentId,
  accountId,
  onClick,
}: Props) {
  const { user } = useSessionUtils();
  const renderPlaceholder = () => {
    if (!governmentId) {
      return "Not started";
    }

    const date = format(governmentId.createdAt, "dd MMMM yyyy 'at' HH:mm");
    const status = governmentId.status;

    if (status === "PENDING") {
      return `Submitted on ${date}`;
    }

    if (status === "REJECTED") {
      return (
        <p className="text-red-900">
          {`Your government ID started on ${date} has been rejected. Please resubmit`}
        </p>
      );
    }

    return "Verified";
  };

  const renderAction = () => {
    if (isAdmin(user)) {
      if (governmentId) {
        return (
          <Button
            variant="primary"
            href={`/admin/users/${accountId}/verify-government-id`}
          >
            Verify
          </Button>
        );
      }

      return (
        <Button
          variant="link"
          href={`/admin/users/${accountId}/verify-government-id`}
          className="text-accent-400 underline"
        >
          Start
        </Button>
      );
    }

    if (!governmentId || governmentId.status === "REJECTED") {
      return (
        <button
          disabled={disabled}
          onClick={onClick}
          className={cn(
            "text-sm font-semibold text-accent-400 underline hover:underline",
            {
              "text-gray-200": disabled,
            }
          )}
        >
          Start
        </button>
      );
    }

    return null;
  };

  return (
    <div
      className={cn(
        "flex w-full max-w-[720px] flex-col items-center justify-between border-b border-neutral-200 py-6"
      )}
    >
      <div
        className={cn("flex w-full flex-col", {
          "pointer-events-none": disabled,
        })}
      >
        {/*  */}
        <div className="flex w-full justify-between">
          <h3
            className={cn(
              "text-lg font-semibold text-gray-800 dark:text-neutral-100",
              {
                "text-gray-200": disabled,
              }
            )}
          >
            Government ID verification
          </h3>
          {renderAction()}
        </div>

        <p
          className={cn("mt-1 text-sm text-neutral-500 dark:text-neutral-400", {
            "text-body": { disabled },
          })}
        >
          {renderPlaceholder()}
        </p>
      </div>
    </div>
  );
}

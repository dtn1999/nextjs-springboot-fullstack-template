import { cn } from "@/lib/utils";
import {
  CheckCircleIcon,
  IdCardIcon,
  MailIcon,
  PhoneIcon,
  XCircleIcon,
} from "lucide-react";

interface VerificationStatusProps {
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isIdVerified: boolean;
  className?: string;
}

export function UserVerificationState(props: VerificationStatusProps) {
  const { isEmailVerified, isPhoneVerified, isIdVerified } = props;
  const items = [
    {
      name: "Email",
      icon: MailIcon,
      verified: isEmailVerified,
    },
    {
      name: "Phone",
      icon: PhoneIcon,
      verified: isPhoneVerified,
    },
    {
      name: "ID",
      icon: IdCardIcon,
      verified: isIdVerified,
    },
  ];

  return (
    <div className={cn("flex items-center gap-3", props.className)}>
      {items.map((item) => (
        <div key={item.name} className="relative">
          <div
            className={cn(
              "flex items-center justify-center rounded-full bg-gray-50 p-2"
            )}
          >
            <item.icon className={cn("size-5 text-gray-500")} />
          </div>
          <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-0.5">
            {item.verified ? (
              <CheckCircleIcon className="size-4 fill-white text-green-600" />
            ) : (
              <XCircleIcon className="size-4 fill-white text-red-600" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

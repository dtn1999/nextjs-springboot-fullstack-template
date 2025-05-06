"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { ClipboardList } from "lucide-react";

import {
  ArrowLeftStartOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  HeartIcon,
  HomeModernIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Link } from "@/i18n/routing";
import { useSecurityWidget, useSessionUtils } from "@/hooks/use-auth";
import { hasRole, ModalType } from "@/server/auth/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthenticatedAccountQuery } from "@/features/users/hooks/use-accounts";
import { ACCOUNT_HELPER } from "@/server/api/routers/account/helper";
import { formatter } from "@/lib/formatter";
import { NavGroup } from "@/types";
import { cn } from "@/lib/utils";
import { AccountRole } from "@/server/generated/app.backend.api";

const NAVIGATION_ITEMS: NavGroup[] = [
  {
    name: "Guest Menu Items",
    expectedRole: AccountRole.GUEST,
    items: [
      {
        name: "Account",
        path: "/account/settings/information",
        icon: <UserIcon className="size-6" />,
      },
      {
        name: "Bookings",
        path: "/account/bookings/upcoming",
        icon: <ClipboardList className="size-6" />,
      },
      {
        name: "Wishlist",
        path: "/account/wishlist",
        icon: <HeartIcon className="size-6" />,
      },
      {
        name: "Messages",
        path: "/messages",
        icon: <ChatBubbleLeftRightIcon className="size-6" />,
      },
    ],
  },
  {
    name: "Host Menu Items",
    expectedRole: AccountRole.HOST,
    items: [
      {
        name: "Manage listings",
        path: "/host/listings",
        icon: <HomeModernIcon className="size-6" />,
      },
      {
        name: "Manage reservations",
        path: "/host/bookings",
        icon: <CalendarDaysIcon className="size-6" />,
      },
    ],
  },
];

export function UserDropdown() {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);

  const { account, isLoading } = useAuthenticatedAccountQuery();

  const { isUserFullyConnected, user } = useSessionUtils();

  const { openAuthWidget } = useSecurityWidget();

  const showAuthenticatedUserMenu =
    !isLoading && isUserFullyConnected && Boolean(account);

  const renderAvatar = (sizeClass: string) => {
    const userName = formatter.legalName(
      account?.personalInformation.legalName
    );

    return (
      <Avatar className={sizeClass}>
        <AvatarImage
          src={ACCOUNT_HELPER.extractProfileUrl(account)}
          alt={`${userName}'s profile picture`}
        />
        <AvatarFallback>{user?.name[0]}</AvatarFallback>
      </Avatar>
    );
  };

  const renderTrigger = (sizeClass: string = "w-8 h-8 sm:w-9 sm:h-9") => {
    if (showAuthenticatedUserMenu) {
      return renderAvatar(sizeClass);
    }
    return <UnauthenticatedUserAvatar />;
  };

  const renderMenuItem = () => {
    if (!showAuthenticatedUserMenu || !user) {
      return (
        <button
          className="flex w-full items-center justify-start space-x-2 rounded-md px-4 py-2 text-sm text-accent-400 hover:bg-accent-50"
          onClick={async () => {
            await openAuthWidget(ModalType.LOGIN_OR_REGISTRATION);
            setOpenDropdown(false);
          }}
        >
          <ArrowRightStartOnRectangleIcon className="size-6" />
          <span className="">Sign in</span>
        </button>
      );
    }

    return (
      <div className="relative flex flex-col bg-white">
        <div className="flex items-center space-x-4 px-2 py-4">
          {renderAvatar("w-12 h-12")}
          <div className="max-w-[230px] flex-grow">
            <h4 className="truncate text-sm font-semibold text-title">
              {user?.name}
            </h4>
            <p className="truncate text-nowrap text-sm text-caption">
              {user?.email}
            </p>
          </div>
        </div>
        <div className="py-1">
          {NAVIGATION_ITEMS.map((group, index) => {
            const isGroupVisible = hasRole(
              user,
              group.expectedRole ?? AccountRole.GUEST
            );
            if (!isGroupVisible) {
              return <></>;
            }
            return (
              <div key={`${index + 1}`} className="w-full">
                {group.items.map((menuItem, menuIdx) => {
                  return (
                    <div key={menuItem.path}>
                      {menuIdx === 0 && (
                        <div className="my-2 border-t border-border" />
                      )}
                      <Link
                        href={menuItem.path}
                        onClick={() => setOpenDropdown(false)}
                        className={cn(
                          "flex items-center space-x-2 rounded-md px-4 py-2 text-sm text-body hover:bg-gray-50"
                        )}
                      >
                        {menuItem.icon}
                        <span className="">{menuItem.name}</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className="my-1 w-full border-t border-border" />
        <button
          className="flex items-center justify-start space-x-2 rounded-md px-4 py-2 text-sm text-danger hover:bg-red-50"
          onClick={() => {
            signOut({
              redirectTo: "/",
            }).then(() => setOpenDropdown(false));
          }}
        >
          <ArrowLeftStartOnRectangleIcon className="size-6" />
          <span className="">Logout</span>
        </button>
      </div>
    );
  };

  return (
    <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
      <DropdownMenuTrigger
        className={`flex h-10 w-10 items-center justify-center self-center rounded-full text-slate-700 hover:bg-slate-100 focus:outline-none dark:text-slate-300 dark:hover:bg-slate-800 sm:h-12 sm:w-12`}
      >
        {renderTrigger()}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[318px] rounded-[20px] px-2 py-4"
        align="end"
      >
        {renderMenuItem()}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UnauthenticatedUserAvatar() {
  return (
    <div className="relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        aria-hidden="true"
        focusable="false"
        className="relative h-8 w-8 overflow-hidden sm:h-9 sm:w-9"
      >
        <path d="M16 .7C7.56.7.7 7.56.7 16S7.56 31.3 16 31.3 31.3 24.44 31.3 16 24.44.7 16 .7zm0 28c-4.02 0-7.6-1.88-9.93-4.81a12.43 12.43 0 0 1 6.45-4.4A6.5 6.5 0 0 1 9.5 14a6.5 6.5 0 0 1 13 0 6.51 6.51 0 0 1-3.02 5.5 12.42 12.42 0 0 1 6.45 4.4A12.67 12.67 0 0 1 16 28.7z"></path>
      </svg>
    </div>
  );
}

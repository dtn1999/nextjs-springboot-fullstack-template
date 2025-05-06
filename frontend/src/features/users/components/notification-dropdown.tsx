"use client";

import { BellIcon } from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSessionUtils } from "@/hooks/use-auth";

export function NotificationDropdown() {
  const { isUserFullyConnected } = useSessionUtils();
  const notifications = [];

  if (!isUserFullyConnected) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`relative flex h-10 w-10 items-center justify-center self-center rounded-full text-slate-700 hover:bg-slate-100 focus:outline-none dark:text-slate-300 dark:hover:bg-slate-800 sm:h-12 sm:w-12`}
      >
        {notifications.length > 0 && (
          <span className="absolute end-2 top-2 h-2 w-2 animate-bounce rounded-full bg-brand-500" />
        )}
        <BellIcon className="size-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[318px] rounded-[20px] px-2 py-4"
        align="end"
      >
        <h3 className="px-4 py-2 text-base font-semibold text-title">
          Notifications
        </h3>
        <div className="flex flex-col">
          <p className="px-4 py-2 font-light">No notifications yet.</p>
          {/*{[].map((item, index) => (*/}
          {/*  <DropdownMenuItem key={index}>*/}
          {/*    <Link*/}
          {/*      href={item.href}*/}
          {/*      className="px-4 py-2 flex items-center space-x-4"*/}
          {/*    >*/}
          {/*      <Avatar className="w-8 h-8 sm:w-12 sm:h-12">*/}
          {/*        <AvatarFallback className="">{item.name[0]}</AvatarFallback>*/}
          {/*      </Avatar>*/}
          {/*      <div className="ms-3 space-y-1 sm:ms-4">*/}
          {/*        <p className="text-sm font-medium text-title">{item.name}</p>*/}
          {/*        <p className="text-xs text-caption font-medium">*/}
          {/*          Nouveau message*/}
          {/*        </p>*/}
          {/*        <p className="text-xs text-caption font-light">{item.time}</p>*/}
          {/*      </div>*/}
          {/*      {item.unreadMessages && (*/}
          {/*        <div*/}
          {/*          className="flex items-center justify-center rounded-full size-[20px] bg-brand-100 text-brand-500 absolute end-1 top-1/2 -translate-y-1/2 right-3 transform">*/}
          {/*          <span className="">2</span>*/}
          {/*        </div>*/}
          {/*      )}*/}
          {/*    </Link>*/}
          {/*  </DropdownMenuItem>*/}
          {/*))}*/}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

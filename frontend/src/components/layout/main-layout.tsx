"use client";

import { type LucideIcon, MenuIcon, XIcon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { Link, usePathname } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import React, { PropsWithChildren } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserDropdown } from "@/features/users/components/user-dropdown";
import { LanguageDropdown } from "@/components/layout/language-dropdown";
import { CurrencyDropdown } from "@/components/layout/currency-dropdown";
import { NotificationDropdown } from "@/features/users/components/notification-dropdown";
import { cn } from "@/lib/utils";
import { NavCta } from "@/components/layout/nav-cta";
import { useSessionUtils } from "@/hooks/use-auth";
import { isHost } from "@/server/auth/utils";
import { AccountRole } from "@/server/generated/cozi";

export interface SidebarNavGroup {
  title: string;
  role?: AccountRole;
  navItems: SidebarNavItem[];
}

interface SidebarNavItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  role?: AccountRole;
}

export function MainLayout({
  children,
  sidebarItems,
}: PropsWithChildren<AppSidebarProps>) {
  const { user } = useSessionUtils();

  return (
    <SidebarProvider className="bg-gray-200">
      <AppSidebar sidebarItems={sidebarItems} className="border-r-0" />
      <SidebarInset className="relative h-screen overflow-hidden bg-[#FAFAFA] md:py-4 md:pr-8">
        <Card className="h-full w-full rounded-none md:rounded-xl">
          <div className="mx-auto flex h-full w-full max-w-5xl flex-col">
            <CardHeader className="sticky inset-x-0 top-0 z-50 h-28 bg-white">
              <header className="flex w-full items-center justify-end md:px-4">
                <div className="flex w-full items-center justify-between md:hidden">
                  <Logo className="w-[100px]" />
                  <div className="flex items-center space-x-2">
                    <UserDropdown />
                    <SidebarTrigger>
                      <MenuIcon className="size-8" />
                    </SidebarTrigger>
                  </div>
                </div>
                <div className="hidden items-center space-x-8 md:flex">
                  <div className="flex items-center space-x-1">
                    <LanguageDropdown />
                    <CurrencyDropdown />
                    <NotificationDropdown />
                    <UserDropdown />
                  </div>
                </div>
              </header>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <div className="h-full w-full md:px-4">{children}</div>
            </CardContent>
          </div>
        </Card>
      </SidebarInset>
    </SidebarProvider>
  );
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  sidebarItems: SidebarNavGroup[];
}

export function AppSidebar({ ...props }: Readonly<AppSidebarProps>) {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();

  return (
    <Sidebar className={cn("border-none")}>
      <SidebarHeader className="flex w-full items-start justify-center px-15 pt-10">
        {/* */}
        <Logo className="hidden h-[24px] w-[123px] md:block" />
        {/* Mobile */}
        <div className="flex w-full items-center justify-end md:hidden">
          <Button
            onClick={toggleSidebar}
            className="size-10 rounded-full bg-gray-100 p-0 text-title hover:bg-gray-200"
          >
            <XIcon className="size-6" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4 px-10">
        {props.sidebarItems.map((group) => (
          <div key={group.title}>
            <SidebarGroup>
              <SidebarGroupLabel className="">{group.title}</SidebarGroupLabel>
              <SidebarMenu>
                {group.navItems.map((item) => (
                  <SidebarMenuItem
                    key={item.href}
                    className={cn({
                      "rounded-md bg-brand-100 text-brand-500":
                        item.href === pathname,
                    })}
                  >
                    <SidebarMenuButton tooltip={item.title} className="h-10">
                      <Link
                        className="text-md flex h-full w-full items-center space-x-2"
                        href={item.href}
                      >
                        {item.icon && <item.icon className="size-6" />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </div>
        ))}
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}

"use client";

import { CurrencyDropdown } from "@/components/layout/currency-dropdown";
import { LanguageDropdown } from "@/components/layout/language-dropdown";
import { NotificationDropdown } from "@/features/users/components/notification-dropdown";
import { UserDropdown } from "@/features/users/components/user-dropdown";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { HeroSearchForm2Mobile } from "@/components/sections/hero/mobile-hero-search-form-container";
import { Link, usePathname } from "@/i18n/routing";
import { useSessionUtils } from "@/hooks/use-auth";
import { isHost } from "@/server/auth/utils";
import { NavCta } from "@/components/layout/nav-cta";
import { NavItem } from "@/types";

const navItems: NavItem[] = [
  {
    name: "Discover",
    path: "/experiences",
  },
  {
    name: "About us",
    path: "/about",
  },
];

interface Props {
  hideNavigation?: boolean;
  className?: string;
}

export function AppHeader({ hideNavigation, className }: Props) {
  const pathname = usePathname();
  const { user } = useSessionUtils();
  const isUserHost = isHost(user);

  return (
    <header className="nc-Header nc-header-bg sticky left-0 right-0 top-0 z-40 flex h-20 w-full items-center shadow-sm">
      <div
        className={cn(
          "mx-auto flex w-full max-w-7xl items-center justify-between px-4",
          className
        )}
      >
        <Logo className="h-[24px] w-[123px]" />

        {!hideNavigation && (
          <nav className="hidden items-center md:flex">
            <ul className="flex items-center space-x-2">
              {navItems.map((item) => (
                <li key={item.path} className="">
                  <Link
                    href={item.path}
                    className={cn(
                      "text-nowrap rounded-full px-6 py-2 text-base font-normal text-body hover:bg-[#FFEEE9] hover:text-brand-500",
                      {
                        "bg-[#FFEEE9] text-brand-500": pathname === item.path,
                      }
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* trailing */}
        <div className="flex items-center">
          <HeroSearchForm2Mobile />
          <div className="flex items-center">
            <div className="flex items-center space-x-4">
              <div className="hidden items-center space-x-4 lg:flex">
                <NavCta isUserHost={isUserHost ?? false} />
                <div className="flex items-center">
                  <LanguageDropdown />
                  <CurrencyDropdown />
                </div>
                <NotificationDropdown />
              </div>
              <UserDropdown />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

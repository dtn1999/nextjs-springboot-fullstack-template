import type { DefaultSession } from "next-auth";
import { SessionUser } from "@/server/types/domain";
import React from "react";
import { AccountRole } from "@/server/generated/cozi";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: SessionUser;
    isUserRegistered?: boolean;
    error?: AuthError;
    error_description?: string;
    tokens?: {
      accessToken: string;
      refreshToken?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token: string;
    refresh_token: string;
    expires_at: number;
    error?: AuthError;
    error_description?: string;
  }
}

export type DateRage = [Date | null, Date | null];

export type NavGroup = {
  name: string;
  icon?: React.ReactNode;
  expectedRole?: AccountRole;
  items: NavItem[];
};

export type NavItem = {
  name: string;
  icon?: React.ReactNode;
  adminOnly?: boolean;
  // If used as part of a group, this should be inherited from the group
  expectedRole?: AccountRole;
  path: string;
};

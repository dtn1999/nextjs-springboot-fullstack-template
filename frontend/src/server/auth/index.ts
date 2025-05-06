import NextAuth from "next-auth";
import { redirect } from "next/navigation";

import { authConfig } from "@/server/auth/config";
import { hasRole, MODAL_TYPE_PARAM, ModalType } from "@/server/auth/utils";
import { headers } from "next/headers";
import { SecurityException } from "@/server/types/exception";
import { AccountRole } from "@/server/generated/app.backend.api";

export async function secureRoute(
  role: AccountRole,
  fallbackRedirectUrl: string
) {
  const headersList = await headers();
  const redirectLocation = headersList.get("x-pathname") || fallbackRedirectUrl;

  const session = await auth();
  if (!session?.user) {
    redirect(
      `/?${MODAL_TYPE_PARAM}=${ModalType.LOGIN_OR_REGISTRATION}&redirect=${encodeURIComponent(redirectLocation ?? "/")}`
    );
  }
  const user = session.user;

  if (!hasRole(user, role)) {
    throw new SecurityException(
      `User must have the role '${role}' to access this page`
    );
  }

  return null;
}

export const { auth, handlers } = NextAuth(authConfig);

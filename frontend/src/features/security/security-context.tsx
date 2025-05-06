"use client";

import { SessionUser } from "@/server/types/domain";
import { createContext, PropsWithChildren, useContext } from "react";
import { useSessionUtils } from "@/hooks/use-auth";
import { hasRole } from "@/server/auth/utils";
import {
  SecurityException,
  SecurityExceptionRecoveryAction,
} from "@/server/types/exception";
import { AccountRole } from "@/server/generated/cozi";

interface ContextType {
  loading: boolean;
  user: SessionUser;
}

const SecurityContext = createContext<ContextType | undefined>(undefined);

export const useSecurityContext = () => {
  const securityContext = useContext(SecurityContext);

  if (!securityContext) {
    throw new Error(
      "useSecurityContext must be used within a security context."
    );
  }

  return securityContext;
};

interface SecurityContextProviderProps {
  expectedRole: AccountRole;
}

export function SecurityContextProvider({
  children,
  expectedRole,
}: PropsWithChildren<SecurityContextProviderProps>) {
  const session = useSessionUtils();

  if (session.loading) {
    return <></>;
  }

  const authException = new SecurityException(
    "You are not authorized to access this page without being logged in",
    {
      action: SecurityExceptionRecoveryAction.REGISTER_OR_LOGIN,
    }
  );

  if (!session.isUserFullyConnected) {
    throw authException;
  }

  if (!session.user) {
    throw authException;
  }

  if (
    expectedRole === AccountRole.HOST &&
    !hasRole(session.user, AccountRole.HOST)
  ) {
    throw new SecurityException(
      "Only 'HOST' are authorized to access this page",
      {
        action: SecurityExceptionRecoveryAction.BECOME_HOST,
      }
    );
  }

  if (
    expectedRole === AccountRole.ADMIN &&
    !hasRole(session.user, AccountRole.ADMIN)
  ) {
    throw new SecurityException(
      "Only 'ADMIN' are authorized to access this page",
      {
        action: SecurityExceptionRecoveryAction.CONTACT_SUPPORT,
      }
    );
  }

  return (
    <SecurityContext.Provider
      value={{
        loading: session.loading,
        user: {
          ...session.user,
        },
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
}

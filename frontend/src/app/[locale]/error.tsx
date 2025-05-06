"use client";

import {
  SecurityException,
  SecurityExceptionRecoveryAction,
} from "@/server/types/exception";
import { Button } from "@/components/ui/button";
import { useSecurityWidget } from "@/hooks/use-auth";
import { useEffect } from "react";
import { ModalType } from "@/server/auth/utils";

interface PageProps {
  error: Error;
}

export default function Error({ error }: PageProps) {
  const { openAuthWidget } = useSecurityWidget();

  useEffect(() => {
    (async () => {
      if (error instanceof SecurityException) {
        const securityException = error as SecurityException;
        if (
          securityException.getData().action ===
          SecurityExceptionRecoveryAction.REGISTER_OR_LOGIN
        ) {
          await openAuthWidget(ModalType.LOGIN_OR_REGISTRATION);
        }
      }
    })();
  }, [error]);

  if (error instanceof SecurityException) {
    const securityException = error as SecurityException;
    switch (securityException.getData().action) {
      case SecurityExceptionRecoveryAction.REGISTER_OR_LOGIN:
        return <></>;
      case SecurityExceptionRecoveryAction.BECOME_HOST:
        return (
          <div className="">
            Only hosts are authorized to access this page.
            <Button href="/register" variant="primary">
              Become host
            </Button>{" "}
            or{" "}
          </div>
        );
      case SecurityExceptionRecoveryAction.CONTACT_SUPPORT:
        return (
          <div className="">
            you need to contact support to access this page.
            <a href="">contact@cozi-stay.com</a>
          </div>
        );
      case SecurityExceptionRecoveryAction.NO_ACTION:
      default:
        return (
          <>
            <h1>{error?.message}</h1>
          </>
        );
    }
  }

  return (
    <>
      <h1>{error?.message}</h1>
    </>
  );
}

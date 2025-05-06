"use client";

import { useSecurityWidget, useSessionUtils } from "@/hooks/use-auth";
import { LoginDialog } from "@/features/users/components/login-dialog";
import { RegistrationDialog } from "@/features/users/components/registration-dialog";
import { useEffect } from "react";

export function ModalProvider() {
  const { activeModalType, closeAuthWidget, clearSecurityParams } =
    useSecurityWidget();
  const { isUserFullyConnected, loading } = useSessionUtils();

  useEffect(() => {
    (async () => {
      if (isUserFullyConnected) {
        await clearSecurityParams();
      }
    })();
  }, [isUserFullyConnected]);

  if (loading) {
    return null;
  }

  if (isUserFullyConnected) {
    return null;
  }

  console.log("activeModalType", activeModalType);

  if (activeModalType === "login_or_registration") {
    return <LoginDialog onClose={closeAuthWidget} />;
  } else if (activeModalType === "registration_completion") {
    return <RegistrationDialog onClose={closeAuthWidget} />;
  }
}

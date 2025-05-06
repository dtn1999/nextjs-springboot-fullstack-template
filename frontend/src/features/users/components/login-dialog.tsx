"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";

import { usePathname } from "@/i18n/routing";

import {
  MODAL_PROVIDER_PARAM,
  MODAL_TYPE_PARAM,
  ModalType,
  OAuthProvider,
} from "@/server/auth/utils";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";

interface Props {
  onClose?: () => void;
}

export function LoginDialog(props: Props) {
  const [openModal, setOpenModal] = useState<boolean>(true);

  const handleOpenChange = (open: boolean) => {
    setOpenModal(open);
    if (!open && props.onClose) {
      props.onClose();
    }
  };

  return (
    <ResponsiveDialog
      defaultOpen
      open={openModal}
      onOpenChange={handleOpenChange}
    >
      <ResponsiveDialogContent className="p-0">
        <ResponsiveDialogHeader className="border-b-[1px] border-b-gray-50 py-6">
          <ResponsiveDialogTitle className="text-center">
            Welcome to CoziStay
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription className="sr-only">
            Social login buttons
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <AuthenticationOptions />
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}

export function createRedirectUrl({
  pathname,
  provider,
}: {
  pathname: string;
  provider: OAuthProvider;
}): string {
  const modalType: ModalType = ModalType.REGISTRATION_COMPLETION;
  return `${pathname}?${MODAL_TYPE_PARAM}=${modalType}&${MODAL_PROVIDER_PARAM}=${provider}`;
}

export function AuthenticationOptions() {
  const pathname = usePathname();
  const params = useSearchParams();
  const redirect = params.get("redirect");

  const loginWithGoogle = async () => {
    await signIn(
      "auth0",
      {
        redirectTo: createRedirectUrl({
          pathname: redirect ?? pathname,
          provider: OAuthProvider.GOOGLE,
        }),
      },
      {
        connection: "google-oauth2",
      }
    );
  };

  const loginWithFacebook = async () => {
    await signIn(
      "auth0",
      {
        redirectTo: createRedirectUrl({
          pathname: redirect ?? pathname,
          provider: OAuthProvider.FACEBOOK,
        }),
      },
      {
        connection: "facebook",
      }
    );
  };

  return (
    <div className="w-full px-6 pb-10 pt-4">
      <div className="space-y-4">
        <Button
          onClick={loginWithFacebook}
          className="flex w-full items-center space-x-2 rounded-full bg-gray-50 px-6 py-3 font-normal text-title hover:bg-gray-100"
        >
          <Image
            src="/images/brand/facebook.svg"
            alt="brand"
            width={24}
            height={24}
          />
          <span className="flex-grow">Continue with facebook</span>
        </Button>
        <Button
          onClick={loginWithGoogle}
          className={cn(
            "group flex w-full items-center space-x-2 rounded-full bg-gray-50 px-6 py-3 font-normal text-title hover:bg-gray-100"
          )}
        >
          <Image
            src="/images/brand/google.svg"
            alt="brand"
            width={24}
            height={24}
            className="group-hover:grayscale-0"
          />
          <span className="flex-grow">Continue with google</span>
        </Button>
      </div>
    </div>
  );
}

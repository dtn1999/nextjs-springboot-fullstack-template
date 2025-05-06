import { usePathname, useRouter } from "@/i18n/routing";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import {
  MODAL_PROVIDER_PARAM,
  MODAL_TYPE_PARAM,
  ModalType,
  OAuthProvider,
} from "@/server/auth/utils";
import { Session } from "next-auth";
import { parseAsStringEnum, useQueryState } from "nuqs";

export interface SessionUtilsData extends Session {
  isUserFullyConnected: boolean;
  loading: boolean;
}

export function useSessionUtils(options?: any): SessionUtilsData {
  const session = useSession(options);

  const loading = session.status === "loading";

  const isUserFullyConnected =
    session.status === "authenticated" &&
    session?.data?.user &&
    session?.data?.isUserRegistered;

  const user = session?.data?.user;

  return {
    ...session,
    user,
    loading,
    isUserFullyConnected: Boolean(isUserFullyConnected),
    expires: session.data?.expires!,
  };
}

export function useSecurityWidget() {
  const router = useRouter();
  const pathname = usePathname();

  const [activeModalType, setActiveModalType] = useQueryState(
    MODAL_TYPE_PARAM,
    parseAsStringEnum<ModalType>(Object.values(ModalType))
  );
  const [activeAuthProvider, setActiveAuthProvider] = useQueryState(
    MODAL_PROVIDER_PARAM,
    parseAsStringEnum<OAuthProvider>(Object.values(OAuthProvider))
  );

  const openAuthWidget = useCallback(
    async (modalType: ModalType) => {
      await setActiveModalType(modalType);
    },
    [pathname]
  );

  const closeAuthWidget = useCallback(() => {
    router.push({
      pathname,
    });
  }, [pathname]);

  const clearSecurityParams = useCallback(async () => {
    await setActiveModalType(null);
    await setActiveAuthProvider(null);
  }, []);

  return {
    activeModalType,
    activeAuthProvider,
    openAuthWidget,
    closeAuthWidget,
    clearSecurityParams,
  };
}

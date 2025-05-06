import { api } from "@/trpc/react";
import { useSessionUtils } from "@/hooks/use-auth";
import { log } from "@/monitoring";
import { hasRole, isAdmin } from "@/server/auth/utils";
import { Account, ProblemDetail } from "@/server/types/domain";
import { notFound } from "next/navigation";
import { SecurityException } from "@/server/types/exception";
import { AccountRole } from "@/server/generated/app.backend.api";

interface UseAuthenticatedAccountQueryOptions {
  /**
   * Whether the authenticated account should be fully connected.
   */
  required?: boolean;
  /**
   * The required role of the authenticated account.
   */
  requiredRole?: AccountRole;
}

/**
 * Hook to fetch the authenticated account.
 * It takes an optional parameter to specify some of the requirements the
 * authenticated account should meet in the context where the hook is used.
 * @param options
 */
export function useAuthenticatedAccountQuery(
  options?: UseAuthenticatedAccountQueryOptions
) {
  const { user, isUserFullyConnected } = useSessionUtils();
  const { data: response, ...rest } = api.account.me.useQuery(undefined, {
    enabled: isUserFullyConnected,
  });

  let account: Account | null = null;
  let error: ProblemDetail | null = null;

  if (!isUserFullyConnected || !user) {
    return {
      ...rest,
      account: null,
      error: null,
    };
  }

  if (response?.error) {
    error = response.error;
  } else if (response?.data) {
    account = response.data;
  }

  return {
    ...rest,
    error,
    account,
  };
}

/**
 * Hook to get the function to check the uniqueness of an email.
 * @param email the email to check
 */
export function useEmailUniquenessQuery(email?: string) {
  return api.account.checkEmailUniqueness.useQuery(
    { email },
    {
      enabled: Boolean(email),
    }
  );
}

interface UseAllAccountQueryOptions {}

/**
 * Hook to fetch all accounts in the platform.
 * Currently, this is only available for admins.
 */
export function useAllAccountsQuery(options?: UseAllAccountQueryOptions) {
  const { user, loading } = useSessionUtils();
  const { data: response, ...rest } = api.account.getAll.useQuery(undefined, {
    enabled: isAdmin(user) && !loading,
  });

  if (!isAdmin(user) && !loading) {
    throw new SecurityException(
      "Only admins are allowed to view all accounts."
    );
  }

  if (response?.error) {
    return {
      ...rest,
      accounts: [],
      error: response.error,
    };
  } else if (response?.data) {
    return {
      ...rest,
      accounts: response.data,
      error: null,
    };
  }

  return {
    ...rest,
    accounts: [],
    error: null,
  };
}

/**
 * Hook to fetch an account by its ID.
 * @param accountId the ID of the account to fetch
 * @param enabled whether the query should be enabled
 */
export function useAccountQuery(accountId: number, enabled: boolean = false) {
  const { isUserFullyConnected, user } = useSessionUtils();
  const { data: response, ...rest } = api.account.getById.useQuery(
    { accountId },
    {
      enabled:
        enabled &&
        isUserFullyConnected &&
        user &&
        hasRole(user, AccountRole.GUEST),
    }
  );

  let error: ProblemDetail | null = null;

  if (response?.error) {
    error = response.error;
  }

  if (!rest.isLoading && !response?.data) {
    notFound();
  }

  return {
    ...rest,
    account: response?.data,
    error,
  };
}

export function usePatchAccountMutation() {
  const { user } = useSessionUtils();
  const apiUtils = api.useUtils();
  return api.account.patch.useMutation({
    onSuccess: async (data) => {
      if (data?.data) {
        const updatedAccount = data?.data;
        await apiUtils.account.getById.invalidate({
          accountId: updatedAccount.id,
        });
        if (updatedAccount.id === user?.id) {
          await apiUtils.account.me.invalidate();
        }
      } else {
        log.error("Error updating user. ", data?.error);
      }
    },
    onError: (error) => {
      log.error("Error updating user. ", error);
    },
  });
}

export function useMakeHostMutation() {
  const apiUtils = api.useUtils();
  return api.account.makeHost.useMutation({
    onSuccess: async (response) => {
      if (response?.data) {
        await apiUtils.account.getById.invalidate();
        await apiUtils.account.me.invalidate();
        await apiUtils.account.getAll.invalidate();
      } else {
        log.error("Error updating user. ", response?.error);
      }
    },
    onError: (error) => {
      log.error("Error updating user. ", error);
    },
  });
}

export function useSuspendAccountMutation() {
  const apiUtils = api.useUtils();
  return api.account.suspendAccount.useMutation({
    onSuccess: async (response) => {
      if (response?.data) {
        await apiUtils.account.getById.invalidate();
        await apiUtils.account.me.invalidate();
        await apiUtils.account.getAll.invalidate();
      } else {
        log.error("Error updating user. ", response?.error);
      }
    },
    onError: (error) => {
      log.error("Error updating user. ", error);
    },
  });
}

export function useAccountVerificationMutation() {
  const { user } = useSessionUtils();
  const apiUtils = api.useUtils();
  const { mutateAsync, mutate, ...rest } =
    api.account.verificationGovernmentId.useMutation({
      onSuccess: async (data) => {
        if (data?.data) {
          await apiUtils.account.getById.invalidate({});
          await apiUtils.account.me.invalidate();
        } else {
          log.error("Error updating user. ", data?.error);
        }
      },
      onError: (error) => {
        log.error("Error updating user. ", error);
      },
    });

  const approveGovernmentId = (accountId: number) => {
    return mutateAsync({
      accountId,
      status: "APPROVED",
    });
  };

  const rejectedGovernmentId = (accountId: number, rejectionReason: string) => {
    return mutateAsync({
      accountId,
      status: "REJECTED",
      rejectionReason,
    });
  };

  return {
    approveGovernmentId,
    rejectedGovernmentId,
    ...rest,
  };
}

// export function useLocationCreateMutation() {
//   const apiUtils = api.useUtils();
//
//   return api.listing.location.create.useMutation({
//     onSuccess: () => {
//       apiUtils.listing.location.getAll.invalidate();
//     },
//     onError: (error, variables, context) => {
//       console.debug("Error creating location", error);
//     },
//   });
// }
//
// export function useLocationUpdateMutation() {
//   const apiUtils = api.useUtils();
//
//   return api.listing.location.updateById.useMutation({
//     onSuccess: () => {
//       apiUtils.listing.location.getAll.invalidate();
//     },
//     onError: (error, variables, context) => {
//       console.debug("Error updating location", error);
//     },
//   });
//
// }
//
// export function useLocationDeleteMutation() {
//   const apiUtils = api.useUtils();
//
//   return api.listing.location.deleteById.useMutation({
//     onSuccess: () => {
//       apiUtils.listing.location.getAll.invalidate();
//     },
//     onError: (error, variables, context) => {
//       console.debug("Error deleting location", error);
//     },
//   });
//
// }

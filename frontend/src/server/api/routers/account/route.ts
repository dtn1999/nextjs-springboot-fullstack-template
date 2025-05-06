import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import {
  GovernmentIdVerificationSchema,
  PatchAccountInputSchema,
  RegistrationFormSchema,
} from "./schema";
import {
  type Account,
  type EmailUniquenessResponse,
  IdentityVerificationResponse,
} from "@/server/types/domain";
import { z } from "zod";
import { fetcherResponseHandlerV2 } from "@/server/utils";
import { GovernmentIdStatusEnum } from "@/server/generated/cozi";

export const accountRouter = createTRPCRouter({
  verificationGovernmentId: protectedProcedure
    .input(
      GovernmentIdVerificationSchema.merge(z.object({ accountId: z.number() }))
    )
    .mutation(
      ({ input: { accountId, status, rejectionReason }, ctx: { coziApi } }) => {
        return fetcherResponseHandlerV2<IdentityVerificationResponse>(
          coziApi.PATCH("/accounts/{accountId}/verify/government-id", {
            params: {
              path: {
                accountId,
              },
              query: {
                status: status as GovernmentIdStatusEnum,
                rejectionReason,
              },
            },
          }),
          "EXPECT_DATA"
        );
      }
    ),

  checkEmailUniqueness: protectedProcedure
    .input(z.object({ email: z.string().email().optional() }))
    .query(({ input: { email }, ctx: { coziApi } }) => {
      return fetcherResponseHandlerV2<EmailUniquenessResponse>(
        coziApi.POST("/accounts/check-email-uniqueness", {
          params: {
            query: {
              email: email ?? "",
            },
          },
        }),
        "EXPECT_DATA"
      );
    }),

  register: protectedProcedure
    .input(RegistrationFormSchema)
    .mutation(async ({ input, ctx: { coziApi } }) => {
      const {
        email,
        firstname: firstName,
        lastname: lastName,
        birthdate: birthDate,
        newsletter,
      } = input;

      return fetcherResponseHandlerV2<Account>(
        coziApi.POST("/accounts/register", {
          body: {
            email,
            firstName,
            lastName,
            birthDate,
            newsletter: Boolean(newsletter),
          },
        }),
        "EXPECT_DATA"
      );
    }),

  me: protectedProcedure.query(async ({ ctx: { coziApi } }) => {
    return fetcherResponseHandlerV2<Account>(
      coziApi.GET("/accounts/whoami"),
      "EXPECT_DATA"
    );
  }),

  getById: protectedProcedure
    .input(z.object({ accountId: z.number() }))
    .query(async ({ input: { accountId }, ctx: { coziApi } }) => {
      return fetcherResponseHandlerV2<Account>(
        coziApi.GET("/accounts/{accountId}", {
          params: {
            path: {
              accountId,
            },
          },
        }),
        "EXPECT_DATA"
      );
    }),

  makeHost: adminProcedure
    .input(z.object({ accountId: z.number() }))
    .mutation(({ input: { accountId }, ctx: { coziApi } }) => {
      return fetcherResponseHandlerV2<void>(
        coziApi.PUT("/accounts/{accountId}/become-host", {
          params: {
            path: {
              accountId,
            },
          },
        })
      );
    }),

  suspendAccount: adminProcedure
    .input(z.object({ accountId: z.number() }))
    .mutation(({ input: { accountId }, ctx: { coziApi: coziApi } }) => {
      return fetcherResponseHandlerV2<void>(
        coziApi.PUT("/accounts/{accountId}/suspend", {
          params: {
            path: {
              accountId,
            },
          },
        })
      );
    }),

  patch: protectedProcedure
    .input(PatchAccountInputSchema.merge(z.object({ accountId: z.number() })))
    .mutation(async ({ input: request, ctx: { coziApi } }) => {
      console.log("input ");
      return fetcherResponseHandlerV2<Account>(
        coziApi.PATCH("/accounts/{accountId}", {
          params: {
            path: {
              accountId: request.accountId,
            },
          },
          body: {
            ...request,
          },
        }),
        "EXPECT_DATA"
      );
    }),

  getAll: adminProcedure.query(({ ctx: { coziApi } }) => {
    return fetcherResponseHandlerV2<Account[]>(
      coziApi.GET("/accounts"),
      "EXPECT_DATA"
    );
  }),
});

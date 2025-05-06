import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { accountRouter } from "./routers/account/route";
import { listingRouter } from "./routers/listing/route";
import { billingRouter } from "./routers/billing/route";
import { bookingRouter } from "./routers/booking/route";
import { conversationRouter } from "@/server/api/routers/conversations/route";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  account: accountRouter,
  listing: listingRouter,
  billing: billingRouter,
  booking: bookingRouter,
  conversation: conversationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);

import createFetchClient from "openapi-fetch";
import { type paths } from "@/server/generated/app.backend.api";
import { env } from "@/env";

export const coziApi = createFetchClient<paths>({
  baseUrl: env.NEXT_PUBLIC_API_GATEWAY_URL,
});

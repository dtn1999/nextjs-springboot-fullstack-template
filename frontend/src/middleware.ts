import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextRequest } from "next/server";

const TENANT_PATHS: string[] = ["/account", "/messages"];
const HOST_PATHS: string[] = ["/hosting", "/ce"];
const ADMIN_PATHS: string[] = [
  "/hosting/amenities",
  "/hosting/property-types",
  "/hosting/locations",
];

const PROTECTED_PATHS: string[] = [
  ...TENANT_PATHS,
  ...HOST_PATHS,
  ...ADMIN_PATHS,
];

export default async function middleware(request: NextRequest) {
  const url = new URL(request.nextUrl);
  const origin = url.origin;
  const pathname = url.pathname;

  // Useful for getting pathname information in Layout.
  // https://stackoverflow.com/a/77214970
  request.headers.set("x-url", request.url);
  request.headers.set("x-origin", origin);
  request.headers.set("x-pathname", pathname);
  return createMiddleware(routing)(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|images).*)",
  ],
};

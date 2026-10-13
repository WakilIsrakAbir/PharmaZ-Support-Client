import { NextResponse } from "next/server";
import { AUTH_PAGES } from "@/config/routes";

/**
 * Sends logged-out visitors to /login, and logged-in users away from the auth pages.
 *
 * This only checks that the login cookie exists, so it stays fast. The Express API
 * still verifies the token on every request, and the app logs out if it's rejected.
 */
export function proxy(request) {
  const { pathname, search } = request.nextUrl;
  const isLoggedIn = request.cookies.has("token");
  const isAuthPage = AUTH_PAGES.includes(pathname);

  if (!isLoggedIn && !isAuthPage) {
    const loginUrl = new URL("/login", request.url);
    // Remember the page they wanted, so we can send them back after logging in
    if (pathname !== "/") loginUrl.searchParams.set("next", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && isAuthPage) {
    // "/" sends each person on to their own home page
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Skip API calls, Next.js assets and the app icon
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.png).*)"],
};

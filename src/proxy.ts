import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    const needsOnboarding =
      pathname.startsWith("/learn") ||
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/certificates");

    if (token && !token.onboarded && needsOnboarding) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    if (token && token.onboarded && pathname.startsWith("/onboarding")) {
      return NextResponse.redirect(new URL("/learn", req.url));
    }
  },
  {
    pages: { signIn: "/signin" },
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        const protectedRoute =
          pathname.startsWith("/dashboard") ||
          pathname.startsWith("/learn") ||
          pathname.startsWith("/certificates") ||
          pathname.startsWith("/admin") ||
          pathname.startsWith("/onboarding");

        if (protectedRoute) return !!token;
        return true;
      },
    },
  },
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/learn/:path*",
    "/certificates/:path*",
    "/onboarding",
    "/admin/:path*",
  ],
};
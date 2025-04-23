import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // If the user is authenticated and trying to access login/register, redirect to dashboard
    if (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  },
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/bugs/:path*",
    "/projects/:path*",
    "/users/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
}

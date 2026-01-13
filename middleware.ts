import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // If user is trying to access /admin
    if (req.nextUrl.pathname.startsWith("/admin")) {
      const email = req.nextauth.token?.email;
      
      // 🔒 SECURITY CHECK: Only allow your specific email
      if (email !== "palashkhurana65@gmail.com") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // User must be logged in
    },
  }
);

// Protect these routes
export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
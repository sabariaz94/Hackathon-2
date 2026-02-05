import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for route handling.
 *
 * Note: Since JWT is stored in localStorage (client-side only),
 * actual authentication protection happens on the client-side
 * in the dashboard page component.
 *
 * This middleware can be extended for additional server-side
 * checks if using httpOnly cookies for JWT in the future.
 */
export function middleware(request: NextRequest) {
  // Allow all requests to proceed
  // Client-side auth protection happens in components
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};

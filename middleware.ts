import NextAuth from "next-auth";

// Lightweight edge-compatible config — no Prisma, no bcrypt.
// Only needs to verify the JWT to decide if the user is authenticated.
const { auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [],
  pages: { signIn: "/login" },
});

export default auth(function middleware(req) {
  const isLoggedIn = !!req.auth?.user;
  const { pathname } = req.nextUrl;

  const protectedPrefixes = ["/dashboard", "/presentations", "/sessions"];
  const isProtected = protectedPrefixes.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  if (isProtected && !isLoggedIn) {
    const url = new URL(
      `/login?callbackUrl=${encodeURIComponent(pathname)}`,
      req.url
    );
    return Response.redirect(url);
  }
});

export const config = {
  // Skip Next.js internals and static files; always run on page routes
  matcher: ["/((?!api|_next/static|_next/image|favicon\\.ico).*)"],
};

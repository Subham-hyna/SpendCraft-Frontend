import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value || request.cookies.get('refresh_token')?.value;;
  const { pathname } = request.nextUrl;

  const publicRoutes = [
    '/login',
    '/'
];
  const isPublicRoute = publicRoutes.includes(pathname);

  // If NOT logged in and trying to access protected route
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If logged in and trying to access public route
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/|favicon.ico|manifest.json|sw.js|service-worker.js|workbox-|icons/).*)',],
};

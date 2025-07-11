// middleware.js
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if user is authenticated for protected routes
        const { pathname } = req.nextUrl;
        
        // List of protected routes
        const protectedRoutes = [
          '/profile',
          '/dashboard',
          '/analytics',
          '/history',
          '/settings'
        ];
        
        // Check if the current path starts with any protected route
        const isProtectedRoute = protectedRoutes.some(route => 
          pathname.startsWith(route)
        );
        
        // If it's a protected route, require authentication
        if (isProtectedRoute) {
          return !!token;
        }
        
        // Allow access to non-protected routes
        return true;
      },
    },
    pages: {
      signIn: '/auth/signin',
    },
  }
);

export const config = {
  matcher: [
    '/profile/:path*',
    '/dashboard/:path*', 
    '/analytics/:path*',
    '/history/:path*',
    '/settings/:path*'
  ]
};
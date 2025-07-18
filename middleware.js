// middleware.js (at root level)
import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();
  
  // Add performance headers
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Enable CORS for API routes if needed
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    
    // Add cache headers for specific routes
    if (request.nextUrl.pathname === '/api/topics') {
      // Cache topics for 1 hour in CDN
      response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    } else if (request.nextUrl.pathname === '/api/quiz' && request.method === 'GET') {
      // Cache quiz metadata for 10 minutes
      response.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1800');
    }
    
    // Add timing header
    response.headers.set('X-Response-Time', new Date().toISOString());
  }
  
  return response;
}

export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
  ],
};

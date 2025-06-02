export { auth as middleware } from './src/lib/auth';

// Don't invoke Middleware on some paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/* (API routes)
     * 2. /_next/* (Next.js internals)
     * 3. /_static/* (static files)
     * 4. /_vercel/* (Vercel internals)
     * 5. /assets/* (public assets)
     * 6. /favicon.ico, /robots.txt, /sitemap.xml (common root files)
     * 7. /*.png, /*.jpg, /*.svg (common image formats)
     * 
     * This optimizes Fast Refresh by avoiding unnecessary middleware processing
     */
    '/((?!api|_next|_static|_vercel|assets|favicon.ico|robots.txt|sitemap.xml|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)'
  ]
};

import createMiddleware from 'next-intl/middleware';
import {routing} from './routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all paths except for the ones that should be ignored
    '/((?!api|_next|_vercel|.*\\..*).*)',
    '/',
    '/(en|hi|ta|ml)/:path*'
  ]
};
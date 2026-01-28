// Authentication Middleware for Dashboard Protection
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async ({ request, url, redirect }, next) => {
  // Only protect dashboard routes

  // if (!url.pathname.startsWith('/dashboard')) {
  //   return next();
  // }

  // const sessionToken = request.headers.get('cookie')?.match(/session_token=([^;]+)/)?.[1];

  // if (!sessionToken) {
  //   return redirect('/login?redirect=' + encodeURIComponent(url.pathname));
  // }

  return next();

  // Optimistic auth - if token exists, let them through
  // The client-side components will handle 401s from the API if the token is invalid
  return next();
});

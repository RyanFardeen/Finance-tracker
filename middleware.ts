export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/',
    '/income',
    '/expenses',
    '/investments',
    '/transactions',
    '/analytics',
    '/reports/monthly',
    '/reports/yearly',
  ],
};

// Made with Bob

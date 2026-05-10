import prisma from '../prisma/prisma-client';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';

export const auth = betterAuth({
  basePath: '/api/auth',
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  trustedOrigins: [
    'https://aow-admin-nu.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
  ],
  advanced: {
    useSecureCookies: process.env.NODE_ENV === 'production',
    cookiePrefix: 'aow_auth',
    defaultCookieAttributes: {
      sameSite: 'none',
      secure: true,
    },
  },
  plugins: [nextCookies()],
});

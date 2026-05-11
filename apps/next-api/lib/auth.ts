import prisma from '../prisma/prisma-client';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';

const ALLOWED_ORIGINS = [
  'https://aow-admin-nu.vercel.app',
  'http://localhost:5173',
];

export const auth = betterAuth({
  basePath: '/api/auth',
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  trustedOrigins: ALLOWED_ORIGINS,
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
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

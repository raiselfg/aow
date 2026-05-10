import { getPrisma } from '@aow/database';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { betterAuth } from 'better-auth/minimal';

import { env } from './env.js';

export const auth = betterAuth({
  appName: 'aow',
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  basePath: '/api/auth',
  database: prismaAdapter(getPrisma(), {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  trustedOrigins: ['https://aow-admin-nu.vercel.app', 'http://localhost:5173'],
  session: {
    expiresIn: 604800,
    updateAge: 86400,
    cookieCache: {
      enabled: true,
      maxAge: 300,
    },
  },
  advanced: {
    useSecureCookies: env.NODE_ENV === 'production',
    cookiePrefix: 'aow_auth',
    defaultCookieAttributes: {
      sameSite: 'none',
      secure: true,
    },
  },
});

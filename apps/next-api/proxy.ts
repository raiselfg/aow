import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'https://aow-admin-nu.vercel.app',
];

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

export function proxy(request: NextRequest) {
  const origin = request.headers.get('origin') ?? '';
  const isAllowedOrigin = ALLOWED_ORIGINS.includes(origin);

  // Обрабатываем preflight
  if (request.method === 'OPTIONS') {
    return NextResponse.json(
      {},
      {
        headers: {
          ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
          ...corsOptions,
        },
      },
    );
  }

  const response = NextResponse.next();

  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: '/api/:path*',
};

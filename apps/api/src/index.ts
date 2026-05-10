import type { Context, Next } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

import { serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { rateLimiter } from 'hono-rate-limiter';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { handle } from 'hono/vercel';

import { auth } from './lib/auth.js';
import { env } from './lib/env.js';
import { ApiError } from './lib/errors.js';
import { eventRequestsRoutes } from './routes/event-requests.js';
import { eventTypesRoutes } from './routes/event-types.js';
import { productCategoriesRoutes } from './routes/product-categories.js';
import { productsRoutes } from './routes/products.js';
import { storefrontRoutes } from './routes/storefront.js';
import { uploadRoutes } from './routes/upload.js';

const app = new OpenAPIHono();

// 1. Error Handling
app.onError((err, c) => {
  if (err instanceof ApiError) {
    return c.json(
      {
        message: err.message,
        code: err.code,
      },
      err.status as ContentfulStatusCode,
    );
  }

  console.error('[Unhandled Error]', err);
  return c.json(
    {
      message: 'Internal Server Error',
      ...(env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
    },
    500,
  );
});

app.use('*', secureHeaders());

// 2. CORS
app.use(
  '*',
  cors({
    origin: [
      'https://us-ta.ru',
      'https://admin.us-ta.ru',
      'https://cdn.us-ta.ru',
      'http://localhost:5173',
      'http://localhost:3001',
    ],
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  }),
);

// 3. Rate Limiter
const limiter = rateLimiter({
  windowMs: 10 * 60 * 1000,
  limit: 200,
  standardHeaders: 'draft-6',
  keyGenerator: c => c.req.header('x-forwarded-for') || 'anonymous',
  handler: c =>
    c.json({ message: 'Слишком много запросов, подождите немного' }, 429),
});
app.use('*', limiter);

app.all('/api/auth/*', c => {
  return auth.handler(c.req.raw);
});

// 5. Middleware защиты (Проверка прав доступа)
// Используем "whitelist" подход для защиты админских методов.
const requireAdminAuth = async (c: Context, next: Next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    console.warn(
      `[Auth] Unauthorized access attempt to ${c.req.method} ${c.req.url}`,
    );
    return c.json(
      { message: 'Unauthorized: Требуется авторизация в админке' },
      401,
    );
  }

  return await next();
};

// Публичные роуты (Storefront) - не требуют авторизации
app.route('/storefront', storefrontRoutes);

app.route('/products', productsRoutes);
app.route('/product-categories', productCategoriesRoutes);
app.route('/event-types', eventTypesRoutes);
app.route('/event-requests', eventRequestsRoutes);
app.route('/upload', uploadRoutes);

// Добавляем защиту для мутаций в роутах
app.on(['POST', 'PATCH', 'DELETE', 'PUT'], '/products/*', requireAdminAuth);
app.on(['POST', 'PATCH', 'DELETE', 'PUT'], '/products', requireAdminAuth);
app.on(
  ['POST', 'PATCH', 'DELETE', 'PUT'],
  '/product-categories/*',
  requireAdminAuth,
);
app.on(
  ['POST', 'PATCH', 'DELETE', 'PUT'],
  '/product-categories',
  requireAdminAuth,
);
app.on(['POST', 'PATCH', 'DELETE', 'PUT'], '/event-types/*', requireAdminAuth);
app.on(['POST', 'PATCH', 'DELETE', 'PUT'], '/event-types', requireAdminAuth);
app.on(
  ['POST', 'PATCH', 'DELETE', 'PUT'],
  '/event-requests/*',
  requireAdminAuth,
);
app.on(['POST', 'PATCH', 'DELETE', 'PUT'], '/event-requests', requireAdminAuth);
app.use('/upload/*', requireAdminAuth);
app.use('/upload', requireAdminAuth);

app.get('/health', c =>
  c.json({ status: 'ok', time: new Date().toISOString() }),
);

// Документация Swagger API
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'aow API',
  },
});
app.get('/docs', swaggerUI({ url: '/doc' }));

const port = 3000;
const hostname = '0.0.0.0';

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  serve(
    {
      fetch: app.fetch,
      port,
      hostname,
    },
    info => {
      console.log(`Server is running on http://localhost:${info.port}`);
      console.log(`Environment: ${env.NODE_ENV}`);
    },
  );
}

export default handle(app);

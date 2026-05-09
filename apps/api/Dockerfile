# Base image
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# 1. Prune step
FROM base AS pruner
WORKDIR /app
COPY . .
RUN npx -y turbo@latest prune @aow/api --docker

# 2. Installer step
FROM base AS builder
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Устанавливаем зависимости БЕЗ запуска скриптов
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY --from=pruner /app/out/full/ .

# Генерируем Prisma и собираем API
RUN pnpm turbo run build --filter=@aow/api...

# 3. Runner step
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

# Copy workspace config and package definitions to install prod dependencies
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install --frozen-lockfile --prod --ignore-scripts

# Copy Prisma schema for runtime generation
COPY --from=builder /app/packages/database/prisma ./packages/database/prisma

# Generate Prisma client for runtime
RUN pnpm -C packages/database db:generate

COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/packages/database/dist ./packages/database/dist
COPY --from=builder /app/packages/database/package.json ./packages/database/package.json
COPY --from=builder /app/packages/database/node_modules ./packages/database/node_modules
COPY --from=builder /app/packages/types/dist ./packages/types/dist
COPY --from=builder /app/packages/types/package.json ./packages/types/package.json

USER hono

EXPOSE 3000
ENV PORT=3000

CMD ["node", "apps/api/dist/index.js"]

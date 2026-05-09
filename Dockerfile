# 1. Base stage
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.30.1 --activate

# 2. Builder stage
FROM base AS builder
WORKDIR /app
COPY . .
# Prune the workspace for the API
RUN npx turbo prune --scope=@aow/api --docker

# Work inside the pruned workspace
WORKDIR /app/out/full
RUN pnpm install
# Generate Prisma Client
RUN pnpm turbo run db:generate --filter=@aow/api
# Build database dependencies first to ensure types are available
RUN pnpm turbo run build --filter=@aow/database
# Build the API
RUN pnpm turbo run build --filter=@aow/api

# Use pnpm deploy to create a self-contained production directory
# This command follows symlinks and copies workspace dependencies
RUN pnpm --filter=@aow/api --prod deploy /app/deployed

# 3. Runner stage
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Security: Don't run as root
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nodeapi
USER nodeapi

# Copy the isolated application from the builder
COPY --from=builder /app/deployed .

EXPOSE 3000
ENV PORT=3000
# The entry point remains the same as pnpm deploy preserves the internal directory structure
CMD ["node", "apps/api/dist/index.js"]

# 1. Base stage
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.30.1 --activate
RUN apt-get update -y && apt-get install -y openssl

# 2. Builder stage
FROM base AS builder
WORKDIR /app
COPY . .
# Prune the workspace for the admin app
RUN npx turbo prune --scope=@aow/admin --docker

# Work inside the pruned workspace
WORKDIR /app/out/full
RUN pnpm install

# Build the admin app
RUN pnpm turbo run build --filter=@aow/admin

# 3. Runner stage
FROM base AS runner
WORKDIR /app
COPY --from=builder /app/out/full/apps/admin/dist ./apps/admin/dist

# Use serve for simple and robust SPA hosting
RUN pnpm install -g serve

# Standard port for serve
EXPOSE 3000

# Serve the dist folder in SPA mode (-s)
CMD ["serve", "-s", "apps/admin/dist", "-l", "3000"]

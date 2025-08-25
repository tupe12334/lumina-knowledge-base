# syntax=docker/dockerfile:1.4

# ---- Base builder image ----
FROM node:22-bookworm-slim AS builder

# Note: OpenSSL is already available in node:22-bookworm-slim base image

# Enable corepack to use pnpm
RUN corepack enable

# Configure pnpm store for caching
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN pnpm config set store-dir /pnpm/store

WORKDIR /app

# Copy package files for better layer caching
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./

# Fetch dependencies to cache (without installing)
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store,sharing=locked \
    pnpm fetch --frozen-lockfile

# Install dependencies from cache
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store,sharing=locked \
    --mount=type=cache,id=pnpm-modules,target=/app/node_modules/.pnpm,sharing=locked \
    pnpm install --offline --frozen-lockfile

# Copy the rest of the source
COPY . .

# Generate Prisma client for linux and build the app
RUN pnpm exec prisma generate \
    && pnpm run build

# ---- Runtime image ----
FROM node:22-bookworm-slim AS runner

ENV NODE_ENV=production \
    PORT=3000 \
    ENABLE_MUTATIONS=false

# Note: OpenSSL is already available in node:22-bookworm-slim base image

# Enable corepack to use pnpm at runtime for prisma CLI
RUN corepack enable


WORKDIR /app

# Copy only what we need to run
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/package.json ./package.json

# Ensure the SQLite file directory exists (created at runtime if missing)
RUN mkdir -p /app/prisma

EXPOSE 3000

# Run database migrations (if any) and start the server
# Using pnpm exec for prisma CLI which is available via devDeps kept in node_modules
CMD sh -lc "pnpm exec prisma migrate deploy && node dist/main"

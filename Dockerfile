# syntax=docker/dockerfile:1

# ---- Base builder image ----
FROM node:22-bookworm-slim AS builder

# Enable corepack to use pnpm
RUN corepack enable

WORKDIR /app

# Install dependencies first (better layer caching)
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Copy the rest of the source
COPY . .

# Generate Prisma client for linux and build the app
RUN pnpm exec prisma generate \
    && pnpm exec nest build

# ---- Runtime image ----
FROM node:22-bookworm-slim AS runner

ENV NODE_ENV=production \
    PORT=3000 \
    ENABLE_MUTATIONS=false

# Enable corepack to use pnpm at runtime for prisma CLI
RUN corepack enable

WORKDIR /app

# Copy only what we need to run
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated
COPY package.json ./package.json

# Ensure the SQLite file directory exists (created at runtime if missing)
RUN mkdir -p /app/prisma

EXPOSE 3000

# Run database migrations (if any) and start the server
# Using pnpm exec for prisma CLI which is available via devDeps kept in node_modules
CMD sh -lc "pnpm exec prisma migrate deploy && node dist/main"

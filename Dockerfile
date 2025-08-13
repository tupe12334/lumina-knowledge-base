# Stage 1: Base image with Node.js and pnpm
FROM node:lts-alpine AS base
RUN corepack enable && corepack prepare pnpm --activate
# Configure pnpm home and store for better Docker layer caching
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN pnpm config set store-dir /pnpm/store

# Stage 2: Builder stage
FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Generate a partial monorepo with a pruned lockfile for knowledge-base workspace
COPY . .
RUN pnpm dlx turbo prune @lumina/knowledge-base --docker

# Stage 3: Installer stage
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy turbo.json before other operations
COPY turbo.json ./turbo.json

# Install dependencies based on the pruned lockfile
COPY --from=builder /app/out/json/ .
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store,sharing=locked \
  pnpm install --frozen-lockfile

# Build the project
COPY --from=builder /app/out/full/ .

# Generate Prisma client and build the application
RUN pnpm turbo run generate --filter=@lumina/knowledge-base
RUN pnpm turbo run build --filter=@lumina/knowledge-base

# Stage 4: Production image
FROM node:lts-alpine AS production
ENV NODE_ENV=production
WORKDIR /app

# Install pnpm and sqlite for production
RUN corepack enable && corepack prepare pnpm --activate
RUN apk add --no-cache sqlite

# Copy built application and required node_modules
COPY --from=installer /app/apps/knowledge-base/dist ./apps/knowledge-base/dist
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/knowledge-base/node_modules ./apps/knowledge-base/node_modules

# Copy generated Prisma client
COPY --from=installer /app/apps/knowledge-base/generated ./apps/knowledge-base/generated
COPY --from=installer /app/apps/knowledge-base/prisma ./apps/knowledge-base/prisma

# Copy database dump and package.json for service
COPY --from=builder /app/apps/knowledge-base/dump.sql ./apps/knowledge-base/dump.sql
COPY --from=builder /app/apps/knowledge-base/package.json ./apps/knowledge-base/package.json

# Create database initialization script
RUN echo '#!/bin/sh' > /app/init-db.sh && \
    echo 'cd /app/apps/knowledge-base' >> /app/init-db.sh && \
    echo 'if [ ! -f "./prisma/main.db" ]; then' >> /app/init-db.sh && \
    echo '  echo "Initializing database from dump..."' >> /app/init-db.sh && \
    echo '  sqlite3 ./prisma/main.db < dump.sql' >> /app/init-db.sh && \
    echo '  echo "Database initialized successfully!"' >> /app/init-db.sh && \
    echo 'else' >> /app/init-db.sh && \
    echo '  echo "Database already exists, skipping initialization"' >> /app/init-db.sh && \
    echo 'fi' >> /app/init-db.sh && \
    echo 'exec "$@"' >> /app/init-db.sh && \
    chmod +x /app/init-db.sh

EXPOSE 3000
ENTRYPOINT ["/app/init-db.sh"]
CMD ["node", "apps/knowledge-base/dist/main.js"]

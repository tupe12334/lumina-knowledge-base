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
RUN apk add --no-cache libc6-compat sqlite
WORKDIR /app

# Copy package files for dependency installation
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store,sharing=locked \
  pnpm install --frozen-lockfile

# Copy source code and configuration files
COPY . .

# Generate Prisma client and build the application
RUN pnpm run generate
RUN pnpm run build

# Stage 3: Production image
FROM node:lts-alpine AS production
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /app

# Install pnpm and sqlite for production
RUN corepack enable && corepack prepare pnpm --activate
RUN apk add --no-cache sqlite

# Copy package files for production dependencies
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store,sharing=locked \
  pnpm install --frozen-lockfile --prod

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy generated Prisma client
COPY --from=builder /app/generated ./generated

# Copy Prisma schema and migrations
COPY --from=builder /app/prisma ./prisma

# Copy database dump if it exists
COPY --from=builder /app/dump.sql ./dump.sql

# Create database initialization script
RUN echo '#!/bin/sh' > /app/init-db.sh && \
    echo 'cd /app' >> /app/init-db.sh && \
    echo 'if [ ! -f "./prisma/main.db" ]; then' >> /app/init-db.sh && \
    echo '  echo "Initializing database from dump..."' >> /app/init-db.sh && \
    echo '  if [ -f "./dump.sql" ]; then' >> /app/init-db.sh && \
    echo '    sqlite3 ./prisma/main.db < dump.sql' >> /app/init-db.sh && \
    echo '    echo "Database initialized successfully!"' >> /app/init-db.sh && \
    echo '  else' >> /app/init-db.sh && \
    echo '    echo "No dump.sql found, creating empty database..."' >> /app/init-db.sh && \
    echo '    npx prisma migrate deploy' >> /app/init-db.sh && \
    echo '    echo "Database migrated successfully!"' >> /app/init-db.sh && \
    echo '  fi' >> /app/init-db.sh && \
    echo 'else' >> /app/init-db.sh && \
    echo '  echo "Database already exists, skipping initialization"' >> /app/init-db.sh && \
    echo 'fi' >> /app/init-db.sh && \
    echo 'exec "$@"' >> /app/init-db.sh && \
    chmod +x /app/init-db.sh

EXPOSE 3000
ENTRYPOINT ["/app/init-db.sh"]
CMD ["node", "dist/main.js"]

# Stage 1: Base image with Node.js and pnpm
FROM node:lts-alpine AS base
RUN corepack enable && corepack prepare pnpm --activate
ENV PNPM_HOME=/usr/local/bin

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
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
  pnpm install --frozen-lockfile

# Build the project
COPY --from=builder /app/out/full/ .
RUN pnpm turbo run build --filter=@lumina/knowledge-base

# Stage 4: Production image
FROM node:lts-alpine AS production
ENV NODE_ENV=production
WORKDIR /app

# Install pnpm for production
RUN corepack enable && corepack prepare pnpm --activate

# Copy built application and required node_modules
COPY --from=installer /app/apps/knowledge-base/dist ./apps/knowledge-base/dist
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/knowledge-base/node_modules ./apps/knowledge-base/node_modules
COPY --from=installer /app/apps/knowledge-base/generated ./apps/knowledge-base/generated

# Copy workspace packages that are dependencies
COPY --from=installer /app/packages ./packages

# Copy Prisma files directly from builder stage to ensure they're included
COPY --from=builder /app/apps/knowledge-base/prisma ./apps/knowledge-base/prisma
COPY --from=builder /app/apps/knowledge-base/package.json ./apps/knowledge-base/package.json

EXPOSE 3000
CMD ["node", "apps/knowledge-base/dist/main.js"]

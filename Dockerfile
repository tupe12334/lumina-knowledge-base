# Stage 1: Base image with Node.js and pnpm
FROM node:lts-alpine AS base
RUN corepack enable && corepack prepare pnpm --activate
ENV PNPM_HOME=/usr/local/bin

# Stage 2: Dependencies installation
FROM base AS deps
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies with cache mount
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
  pnpm install --frozen-lockfile

# Stage 3: Builder stage
FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy installed dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy source code and configuration files
COPY . .

# Generate Prisma client and build the application
RUN pnpm run generate
RUN pnpm run build

# Stage 4: Production image
FROM node:lts-alpine AS production
ENV NODE_ENV=production
WORKDIR /app

# Install pnpm for production
RUN corepack enable && corepack prepare pnpm --activate

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["node", "dist/main.js"]

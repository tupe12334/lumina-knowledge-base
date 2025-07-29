FROM node:lts-alpine
RUN corepack enable && corepack prepare pnpm --activate
WORKDIR /app
COPY apps/server/prisma ./prisma
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
  pnpm dlx prisma --version
CMD ["pnpm", "dlx", "prisma", "studio"]

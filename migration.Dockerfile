# Lightweight migration container with only Prisma dependencies
FROM node:lts-alpine AS migration

# Install essential packages
RUN apk add --no-cache bash netcat-openbsd postgresql-client
RUN corepack enable && corepack prepare pnpm --activate

# Set working directory
WORKDIR /app/apps/knowledge-base

# Copy only Prisma-related files and seed scripts
COPY apps/knowledge-base/prisma ./prisma
COPY apps/knowledge-base/package.json ./package.json

# Create minimal package.json with only migration/seed dependencies
RUN echo '{\
  "name": "knowledge-base-migration",\
  "version": "0.0.1",\
  "private": true,\
  "dependencies": {\
  "@prisma/client": "^6.12.0",\
  "uuid": "^11.1.0",\
  "lodash": "^4.17.21"\
  },\
  "devDependencies": {\
  "prisma": "^6.12.0",\
  "tsx": "^4.19.2",\
  "@types/node": "^22.10.7",\
  "@types/uuid": "^10.0.0",\
  "@types/lodash": "^4.17.20"\
  },\
  "prisma": {\
  "seed": "./prisma/seed/seed.sh"\
  }\
  }' > package.json

# Install only necessary dependencies
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
  pnpm install

# Generate Prisma client
RUN pnpm dlx prisma generate

# Make seed script executable
RUN chmod +x ./prisma/seed/seed.sh

# Create generated client symlink for imports
RUN mkdir -p generated && ln -sf ../node_modules/.prisma/client generated/client

CMD ["sh", "-c", "./prisma/seed/seed.sh"]

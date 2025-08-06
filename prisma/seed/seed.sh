#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Get the prisma directory (parent of seed directory)
PRISMA_DIR="$(dirname "$SCRIPT_DIR")"

# SQLite doesn't need connection waiting like PostgreSQL
echo "Using SQLite database..."

# Run migrations first
echo "Running migrations..."
pnpm dlx prisma migrate deploy --schema="$PRISMA_DIR/schema.prisma"

if [ $? -ne 0 ]; then
    echo "Error: Failed to run migrations"
    exit 1
fi

# Seed script to run all seed files in order
echo "Running database seed files..."

echo "Seeding via TypeScript"
pnpm dlx tsx "$SCRIPT_DIR/seed.ts"

if [ $? -ne 0 ]; then
    echo "Error: Failed to seed database"
    exit 1
fi

echo "✅ All seed files executed successfully!"

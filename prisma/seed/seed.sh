#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Get the prisma directory (parent of seed directory)
PRISMA_DIR="$(dirname "$SCRIPT_DIR")"

# Wait for database to be ready
echo "Waiting for database to be ready..."
until nc -z postgres 5432 2>/dev/null || nc -z localhost 5432 2>/dev/null; do
  echo "Waiting for database..."
  sleep 2
done

# Additional wait to ensure database is fully initialized
echo "Waiting for database to be fully initialized..."
sleep 5

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

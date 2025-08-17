# Postgres Migration Plan (Stateless, Read-Only Production)

This document outlines how to migrate from SQLite to Postgres and operate production as a stateless, read-only database restored from a dump artifact.

## Objectives and constraints

- Migrate current schema/data from SQLite to Postgres.
- Production DB is stateless and read-only for the application:
  - The app never mutates production data (ENABLE_MUTATIONS=false + DB role is read-only).
  - Production DB is provisioned by restoring a dump artifact built in CI.
- Support pgvector for future semantic search.

## High-level architecture

Environments and responsibilities:

- Development
  - Postgres via Docker Compose.
  - Use Prisma migrate dev for schema and restore a dump for data.
- Production
  - Provision Postgres (managed or container).
  - Restore provided dump artifact using psql.
  - App connects with read-only role. No migrations run in the app container.

## Prisma changes

- Switch datasource to Postgres:
  - `provider = "postgresql"`
  - `url = env("DATABASE_URL")`
- Add migration for pgvector enablement and ANN index:
  - `CREATE EXTENSION IF NOT EXISTS vector;`
  - Create `EmbeddingChunk` (future) with `vector(1536)` and ivfflat/hnsw index.
- Maintain migrations for dev/CI; do not run migrations in production runtime.

## Local development

- Add `docker-compose.postgres.yml`:
  - postgres:16 with pgvector extension available.
  - `DATABASE_URL` env provided to app/tests.
- Dev commands:
  - `pnpm prisma:migrate:dev` (applies migrations)
  - Restore data from a checked-in or downloaded dump file using `pg_restore`.
  - `pnpm prisma:studio` (optional)

Notes:

- Use custom owner/roles only during restore, not in the dump (avoid environment-specific owners).

## Production bootstrap (stateless)

- Provision Postgres.
- Create roles:
  - `app_owner` (used only to restore the dump and manage schema)
  - `app_readonly` (SELECT only; used by the application)
- Restore dump:
  - As `app_owner`, run `pg_restore --no-owner --no-privileges --clean --if-exists -d $DATABASE_URL app.dump`
- Grant read-only:
  - REVOKE ALL ON SCHEMA public FROM PUBLIC;
  - GRANT USAGE ON SCHEMA public TO app_readonly;
  - GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_readonly;
  - ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO app_readonly;
- Application configuration:
  - `ENABLE_MUTATIONS=false` (already default)
  - Connect using `app_readonly` credentials in `DATABASE_URL`.
  - Do NOT run `prisma migrate deploy` at container startup.

## App container changes

- Dockerfile: remove `prisma migrate deploy` from CMD for production image. Keep Prisma Client generation in the build stage.
- Runtime expectation: schema must exist (ensured by restore step) before starting.

## Data migration from SQLite (one-time dump)

One-time path to establish the canonical Postgres dump:

1. Stand up a local or CI Postgres instance.
2. Run Prisma migrations to create the schema.
3. Write a temporary transfer script (or SQL pipeline) that reads from the current SQLite database and inserts into Postgres using consistent IDs.
4. Verify row counts and basic integrity.
5. Produce the canonical `app.dump` with `pg_dump` and store it securely (this is the artifact production will restore).
6. Remove the temporary transfer script from the regular flow after the canonical dump is produced.

## Read-only enforcement

- Application: GraphQL mutations are guarded (`MutationsGuard`) and disabled via env.
- Database:
  - App user lacks INSERT/UPDATE/DELETE privileges.
  - Optional: Row-level security with read-only policies.

## Rollback

- Keep N previous dump artifacts.
- To roll back, restore an older dump with the same procedure.

## Testing

- Unit tests unaffected.
- Integration/e2e:
  - Use Testcontainers to run Postgres; apply migrations and seed minimal data for tests.
  - Alternatively, restore a tiny test dump before tests.

## Operational notes

- Ensure pgvector package is installed in the Postgres image (e.g., `postgres:16` + `postgresql-16-pgvector`). Many official images/derivatives include it.
- Tune ANN index parameters (ivfflat lists, hnsw params) as datasets grow.
- Do not commit large dump artifacts; store them as CI artifacts or in release assets.

## Acceptance checklist

- [ ] Prisma datasource set to Postgres; migrations compile.
- [ ] Local Compose works; migrations apply and dump restore works.
- [ ] One-time manual process produced `app.dump` artifact (schema+data) and it’s stored securely.
- [ ] Production bootstrap doc (this file) verified with a dry run in staging.
- [ ] App image no longer runs migrations in CMD.
- [ ] Read-only role used by app; mutations disabled; write attempts fail.
- [ ] Optional: include pgvector extension and index creation in migrations.

## Next steps

1. Switch Prisma to Postgres and add the pgvector migration.
2. Add docker-compose for local Postgres.
3. Implement the one-time SQLite→Postgres transfer to create the canonical dump; validate.
4. Document a simple operator runbook to restore the canonical dump in production.
5. Update Dockerfile CMD to start the server directly (no migrations).
6. Document production restore steps in runbook (reuse above).

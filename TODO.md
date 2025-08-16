# Lumina Knowledge Base - Project TODO

> Last Updated: August 16, 2025

This list focuses on the next high-impact engineering tasks. Completed items are moved to the bottom and removed once stale.

## Roadmap (Active)

1. Tighten tests and quality

- [done] Run all Vitest suites, fix failures, and add missing specs for GraphQL resolvers/guards: degrees, faculties, blocks, courses
- Add coverage thresholds and ensure green runs locally and in CI
- Acceptance: all tests pass; coverage trend improves without flaky tests

2. Implement Degree–Faculty relation in GraphQL

- [done] Expose Prisma relation in GraphQL schema/resolvers; add DTOs if needed
- [done] Query degrees with faculty and faculty with degrees; add unit tests
- Acceptance: resolvers covered by unit tests; e2e smoke passes

3. DB sync and safety rails

- Check Prisma migration status, regenerate client, ensure seeds run idempotently
- Strengthen snapshot test (prisma/db.snapshot.spec.ts) to detect schema drift
- Acceptance: migrate status clean; snapshot test stable across runs

4. OpenAPI pipeline polish

- Wire `src/openapi/save-openapi-spec.ts` into scripts/CI
- Validate emitted spec; add/update unit tests
- Acceptance: artifact generated and validated in CI

5. Health/readiness checks

- Verify health module readiness/liveness endpoints; add unit/e2e tests
- Ensure endpoints are CI-friendly and document expected responses
- Acceptance: probes tested; CI health checks green

## Completed

- Env validation hardening
  - Solidified env with Zod, added `loadEnv`, enforced at bootstrap, and added unit tests
  - Outcome: fail‑fast startup with clear env errors; CORS_ORIGIN parsed without defaults

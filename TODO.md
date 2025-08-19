# Lumina Knowledge Base - Project TODO

> Last Updated: August 17, 2025

This list focuses on the next high-impact engineering tasks. Completed items are moved to the bottom and removed once stale.

## Roadmap (Active)

1.  **Tighten tests and quality**
    - Add coverage thresholds and ensure green runs locally and in CI
    - Acceptance: all tests pass; coverage trend improves without flaky tests

2.  **OpenAPI pipeline polish**
    - Wire `src/openapi/save-openapi-spec.ts` into scripts/CI
    - Validate emitted spec; add/update unit tests
    - Acceptance: artifact generated and validated in CI

3.  **Health/readiness checks**
    - Ensure endpoints are CI-friendly and document expected responses
    - Acceptance: probes tested; CI health checks green

4.  [ ] Remove the addBearerAuth from the swagger

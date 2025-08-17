# Vector Embeddings Integration Plan

This document tracks the plan and decisions to add vector embeddings and semantic search to the knowledge base.

## Goal

Enable fast semantic search over domain content by storing text embeddings and querying via vector similarity. Keep the design simple, testable, and DDD-aligned.

## Storage approach (decision)

- Recommended: PostgreSQL + pgvector
  - Why: robust ANN indexes, predictable performance, well-understood ops.
- Alternatives (not recommended for production):
  - SQLite + app-side similarity (slow, acceptable for tiny datasets)
  - SQLite + vector extensions (brittle with Prisma)
  - External vector DB (adds infra complexity right now)

If approved, we’ll migrate from SQLite to Postgres.

## Data model (first iteration)

- EmbeddingChunk
  - id: uuid
  - sourceType: enum { UNIVERSITY | FACULTY | DEGREE | COURSE | MODULE | QUESTION | LEARNING_RESOURCE | TRANSLATION }
  - sourceId: string (uuid of source entity; for translations use `Translation.id`)
  - language: string (ISO 639-1)
  - content: text (original chunk)
  - chunkIndex: int (stable ordering per source)
  - tokenCount: int
  - embedding: vector(1536) — cosine distance
  - provider: string (e.g., openai | gemini)
  - model: string (e.g., text-embedding-3-small)
  - createdAt: timestamp
  - Constraints:
    - Unique (sourceType, sourceId, language, chunkIndex, model)
  - Indexes:
    - ivfflat/hnsw on embedding with cosine ops

Rationale: anchor embeddings on Translation-first, covering most domain text (names, descriptions, question text/answers). We can expand later.

## Prisma + migrations

- Switch datasource to Postgres (`provider = "postgresql"`) and use `DATABASE_URL`.
- Migration SQL:
  - `CREATE EXTENSION IF NOT EXISTS vector;`
  - Create `EmbeddingChunk` table (embedding column type `vector(1536)`).
  - Create ANN index (ivfflat or hnsw; start with ivfflat lists=100; tune later).
- Prisma notes:
  - Use raw SQL for extension and index creation.
  - Embedding column can be modeled with the db-native type (or kept Unsupported and accessed via raw queries).

## NestJS module structure (DDD)

`src/modules/embeddings/`

- embeddings.module.ts — wires providers/services
- providers/
  - embedding-provider.interface.ts — contract: embed(texts: string[]) => number[][] with metadata
  - openai.provider.ts (and/or gemini.provider.ts)
- chunking/
  - chunker.ts — pure function with tests; sentence/paragraph-aware, target 500–800 tokens
- repository/
  - embeddings.repository.ts — Prisma CRUD + vector search via $queryRaw
- services/
  - embedding.service.ts — indexing pipeline (chunk + embed + upsert)
  - embedding-search.service.ts — semantic search orchestration
- graphql/
  - search.resolver.ts — Query semanticSearch
  - types.ts — SearchResult shape/union
- tests — \*.spec.ts colocated in each folder

## Env and config (validated via zod)

- EMBEDDINGS_PROVIDER: enum("openai", "gemini")
- EMBEDDINGS_MODEL: string (default: text-embedding-3-small)
- EMBEDDINGS_DIMENSION: int (default: 1536)
- OPENAI_API_KEY / GEMINI_API_KEY: optional depending on provider
- DATABASE_URL: Postgres connection string

## Ingestion pipeline

- Trigger: on create/update of translatable entities (esp. `Translation`), re-chunk and upsert embeddings.
- Backfill: script to index all existing `Translation` rows.
- Reindexing: allow multiple models by including `model` in uniqueness; optionally purge old models.

## Search API shape

GraphQL Query:

- `semanticSearch(input: { query: String!, language: String, sourceTypes: [SourceType!], limit: Int = 10 }) -> [SearchResult!]`
- Return: { sourceType, sourceId, score, snippet, model }
- Optionally resolve parent entity for convenience.

## Edge cases & reliability

- Empty/short content: skip
- Very long content: chunk with stable chunkIndex
- Language handling: index per language; filter at query
- Provider errors: retries with backoff; partial upserts allowed; logs/metrics
- Dimension mismatches: validate provider dimension vs column

## Acceptance checklist

- [ ] Decide and provision Postgres + pgvector (or confirm SQLite fallback)
- [ ] Prisma updated to Postgres; `EmbeddingChunk` model and migration (extension + index)
- [ ] Env schema updated (provider, model, dimension, API keys, DATABASE_URL)
- [ ] Embeddings module scaffolded (providers, chunker, repo, services)
- [ ] Indexing pipeline on `Translation` changes
- [ ] Backfill script implemented and documented
- [ ] GraphQL `semanticSearch` implemented with vector ranking
- [ ] Tests: unit (chunker, provider), integration (vector search) — use Testcontainers or local PG
- [ ] Docs: runbook for local PG, envs, backfill, and tuning

## Near-term next steps

1. Confirm Postgres + pgvector choice and provider/model (default: OpenAI text-embedding-3-small, 1536 dims).
2. Add env schema + embeddings module skeleton.
3. Adjust Prisma schema and create migrations for `EmbeddingChunk` + ANN index.
4. Implement backfill and a minimal semanticSearch resolver; iterate with real data.

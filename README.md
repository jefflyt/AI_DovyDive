# DovyDive

DovyDive is a multi-location diving assistant and content platform (FastAPI backend + Next.js frontend).

Project layout (skeleton):

- `src/`
	- `backend/` - FastAPI backend and AI orchestrator
		- `app/api/` - REST route handlers
		- `app/models/` - DB & schema models
		- `app/services/` - business logic
		- `app/ai/` - multi-agent orchestrator
	- `frontend/` - Next.js app and components
	- `dovydive/` - (existing full Next.js app). Moved into `src/frontend/` for canonical source. If you prefer the top-level copy as canonical, restore accordingly.

- `infra/` - Docker, Render, and deployment configs
- `docs/` - design specs and diagrams
- `data/seeds/` - CSV/seed data
- `scripts/` - helper scripts (seed, migrations)
- `tests/` - unit and integration tests
- `.github/workflows/` - CI configs

Notes:

- Existing full Next.js app at top-level `dovydive/` has been copied into `src/frontend/` as the canonical frontend source. Remove or archive the top-level copy if you want a single canonical location.

Next steps:

- Scaffold minimal FastAPI app in `src/backend/app`
- Scaffold Next.js app in `src/frontend`
- Add seed data and migrations

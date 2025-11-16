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
- `infra/` - Docker, Render, and deployment configs
- `docs/` - design specs and diagrams
- `data/seeds/` - CSV/seed data
- `scripts/` - helper scripts (seed, migrations)
- `tests/` - unit and integration tests
- `.github/workflows/` - CI configs

Next steps:

- Scaffold minimal FastAPI app in `src/backend/app`
- Scaffold Next.js app in `src/frontend`
- Add seed data and migrations

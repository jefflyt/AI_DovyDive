# Backend (FastAPI)

Purpose: FastAPI backend providing REST endpoints and the AI orchestrator.

Suggested structure:
- `app/api` - route definitions
- `app/models` - SQLAlchemy models & Pydantic schemas
- `app/services` - business logic
- `app/ai` - multi-agent orchestrator and tools

Quick start (dev):
- Create a virtualenv and install dependencies from `requirements.txt`.
- Run: `uvicorn app.api.main:app --reload --host 0.0.0.0 --port 8000`

# OU SASE

Society of Asian Scientists and Engineers at OU.

Platform monorepo:

- `backend/` — FastAPI backend (Python, managed with [uv](https://docs.astral.sh/uv/))
- `frontend/` — Next.js frontend (TypeScript, App Router)

Each app is independent — see its own README for setup instructions.

## Quickstart

```bash
# Backend
cd backend
uv sync
uv run uvicorn app.main:app --reload   # http://localhost:8000/health

# Frontend
cd frontend
npm install
npm run dev                             # http://localhost:3000
```

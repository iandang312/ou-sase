# OU SASE Backend

FastAPI backend for the OU SASE platform.

## Requirements

- [uv](https://docs.astral.sh/uv/) (manages the Python version and virtualenv for you)

## Setup

```bash
uv sync
```

## Run the dev server

```bash
uv run uvicorn app.main:app --reload
```

Visit http://localhost:8000/health to confirm it's running.

## Test & lint

```bash
uv run pytest
uv run ruff check .
```

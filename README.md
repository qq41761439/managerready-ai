# ManagerReady AI

Turn rough multilingual work notes into manager-ready English updates.

This repo is a first working slice for the product idea:

- Frontend: Next.js + TypeScript
- Backend: Python FastAPI
- AI layer: provider-agnostic model gateway
- Current local provider: Ollama with `qwen3:8b` when `backend/.env` sets `AI_PROVIDER=ollama`
- Mock provider remains available for safe local development
- Ready to swap to OpenAI-compatible, OpenAI, Anthropic, or Ollama providers through environment variables

## Project structure

```text
managerready-ai/
  backend/   Python FastAPI API
  frontend/  Next.js web app
  docs/      product and implementation notes
```

## Backend local setup

```bash
cd backend
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
python -m pytest tests -q
uvicorn app.main:app --reload --port 8000
```

Health check:

```bash
curl http://localhost:8000/health
```

## Frontend local setup

```bash
cd frontend
cp .env.example .env.local
npm install
npm run typecheck
npm run build
npm run dev
```

Open:

```text
http://localhost:3000
```

## Environment variables

Copy the example file:

```bash
cp .env.example .env
```

Mock provider is available for safe development:

```text
AI_PROVIDER=mock
```

Local Ollama provider, no cloud key required:

```text
AI_PROVIDER=ollama
OLLAMA_MODEL=qwen3:8b
OLLAMA_BASE_URL=http://127.0.0.1:11434
```

Auto provider selection is also supported:

```text
AI_PROVIDER=auto
```

For an OpenAI-compatible provider:

```text
AI_PROVIDER=openai_compatible
AI_PROVIDER_NAME=openrouter
AI_BASE_URL=https://openrouter.ai/api/v1
AI_API_KEY=***
AI_MODEL=your_model
AI_TIMEOUT_SECONDS=90
AI_REASONING_EFFORT=none
AI_ENABLE_MOCK_FALLBACK=1
```

For slower free models on OpenRouter, increase `AI_TIMEOUT_SECONDS` to avoid local generation requests timing out too early.

Frontend API base URL:

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

PostHog analytics is optional. For local frontend development, put these values in
`frontend/.env.local`. Leave the key empty to disable analytics locally.

```text
NEXT_PUBLIC_POSTHOG_KEY=phc_your_project_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Tracked product events:

- `page_view`
- `try_sample_clicked`
- `generate_clicked`
- `generate_success`
- `generate_failed`
- `refine_clicked`
- `refine_success`
- `refine_failed`
- `copy_clicked`

## Implemented in this first slice

- Landing page
- Scenario selector
- Tone selector
- Length selector
- Try sample
- Generate update
- Copy output
- Refine output actions
- Anonymous daily quota in backend memory
- PostHog analytics event hooks
- Provider-agnostic AI gateway
- Mock provider for development
- OpenAI-compatible provider scaffold
- Backend tests

## Next product iterations

1. Supabase Auth
2. Supabase/Neon Postgres persistence
3. Report history
4. Feedback collection
5. Creem payment link + webhook
6. SEO pages for key use cases

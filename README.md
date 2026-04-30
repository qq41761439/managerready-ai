# ManagerReady AI

Turn rough multilingual work notes into manager-ready English updates.

This repo is a first working slice for the product idea:

- Frontend: Next.js + TypeScript
- Backend: Python FastAPI
- AI layer: provider-agnostic model gateway
- Current default provider: mock provider for safe local development
- Ready to swap to any OpenAI-compatible provider through environment variables

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

Mock provider is enabled by default:

```text
AI_PROVIDER=mock
```

For an OpenAI-compatible provider:

```text
AI_PROVIDER=openai_compatible
AI_PROVIDER_NAME=openrouter
AI_BASE_URL=https://openrouter.ai/api/v1
AI_API_KEY=your_api_key
AI_MODEL=your_model
AI_ENABLE_MOCK_FALLBACK=1
```

Frontend API base URL:

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

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
6. PostHog/Plausible analytics
7. SEO pages for key use cases

# ManagerReady AI Implementation Plan

## Scope for first working slice

Build a local-development-ready monorepo:

- Frontend: Next.js + TypeScript landing/generator page
- Backend: Python FastAPI API
- AI: provider-agnostic model gateway with mock provider and OpenAI-compatible provider scaffold
- Core API: /health, /api/generate, /api/refine, /api/usage/check
- Core product features in UI: scenario, tone, length, try sample, generate, refine, copy
- Free quota: simple in-memory development usage limiter for anonymous/local usage
- Persistence/payment/auth: documented placeholders for next iteration, not hardcoded into first slice

## Non-goals for first slice

- Real Supabase Auth integration
- Real Creem payment webhook
- Database persistence
- Production-grade distributed rate limiting

## Acceptance checks

- Backend tests pass with pytest
- FastAPI app can run locally
- Frontend type/lint/build check passes if dependencies install successfully
- README explains local setup and environment variables

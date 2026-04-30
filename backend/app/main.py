from __future__ import annotations

import os
from datetime import datetime, timezone
from typing import Any, Optional

from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.ai_gateway import AIGateway, ProviderError, build_gateway_from_env
from app.prompts import BuildPromptRequest, build_generation_messages, build_refine_messages
from app.usage import UsageLimiter, UsageStatus


class GenerateRequest(BaseModel):
    input_text: str = Field(..., min_length=1, max_length=5000)
    scenario: str = "weekly_update"
    tone: str = "semi_formal"
    length: str = "standard"


class RefineRequest(BaseModel):
    original_input: str = Field(..., max_length=5000)
    current_output: str = Field(..., min_length=1, max_length=8000)
    action_type: str


class UsageResponse(BaseModel):
    allowed: bool
    used: int
    limit: int
    remaining: int


class GenerateResponse(BaseModel):
    output_text: str
    usage: UsageResponse
    metadata: dict[str, Any]


def create_app(
    *,
    default_daily_limit: int = 5,
    gateway: Optional[AIGateway] = None,
    usage_limiter: Optional[UsageLimiter] = None,
) -> FastAPI:
    app = FastAPI(title="ManagerReady AI API", version="0.1.0")
    cors_origins_str = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001",
    )
    cors_origins = [origin.strip() for origin in cors_origins_str.split(",") if origin.strip()]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.state.gateway = gateway or build_gateway_from_env()
    app.state.usage_limiter = usage_limiter or UsageLimiter(default_daily_limit=default_daily_limit)

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok", "service": "managerready-api"}

    @app.get("/api/usage/check", response_model=UsageResponse)
    def check_usage(x_anonymous_id: Optional[str] = Header(default=None)) -> UsageStatus:
        subject = _subject_from_header(x_anonymous_id)
        return app.state.usage_limiter.status(
            subject=subject,
            action="generate",
            date_key=_today_utc(),
        )

    @app.post("/api/generate", response_model=GenerateResponse)
    async def generate(
        request: GenerateRequest, x_anonymous_id: Optional[str] = Header(default=None)
    ) -> GenerateResponse:
        subject = _subject_from_header(x_anonymous_id)
        usage = app.state.usage_limiter.check_and_increment(
            subject=subject,
            action="generate",
            date_key=_today_utc(),
        )
        if not usage.allowed:
            raise HTTPException(status_code=429, detail="Daily free generation limit reached")

        messages = build_generation_messages(
            BuildPromptRequest(
                input_text=request.input_text,
                scenario=request.scenario,
                tone=request.tone,
                length=request.length,
            )
        )
        try:
            result = await app.state.gateway.complete(messages=messages, purpose="generate")
        except ProviderError as exc:
            raise HTTPException(status_code=502, detail=str(exc)) from exc

        return _response_from_result(result=result, usage=usage)

    @app.post("/api/refine", response_model=GenerateResponse)
    async def refine(
        request: RefineRequest, x_anonymous_id: Optional[str] = Header(default=None)
    ) -> GenerateResponse:
        subject = _subject_from_header(x_anonymous_id)
        usage = app.state.usage_limiter.check_and_increment(
            subject=subject,
            action="refine",
            date_key=_today_utc(),
        )
        if not usage.allowed:
            raise HTTPException(status_code=429, detail="Daily free generation limit reached")

        messages = build_refine_messages(
            original_input=request.original_input,
            current_output=request.current_output,
            action_type=request.action_type,
        )
        try:
            result = await app.state.gateway.complete(messages=messages, purpose="refine")
        except ProviderError as exc:
            raise HTTPException(status_code=502, detail=str(exc)) from exc

        return _response_from_result(result=result, usage=usage)

    return app


def _response_from_result(result, usage: UsageStatus) -> GenerateResponse:
    return GenerateResponse(
        output_text=result.content,
        usage=UsageResponse(
            allowed=usage.allowed,
            used=usage.used,
            limit=usage.limit,
            remaining=usage.remaining,
        ),
        metadata={
            "provider": result.provider,
            "model": result.model,
            "latency_ms": result.latency_ms,
            "input_tokens": result.input_tokens,
            "output_tokens": result.output_tokens,
            "cost_estimate": result.cost_estimate,
        },
    )


def _subject_from_header(x_anonymous_id: Optional[str]) -> str:
    return x_anonymous_id or "local-anonymous"


def _today_utc() -> str:
    return datetime.now(timezone.utc).date().isoformat()


app = create_app()

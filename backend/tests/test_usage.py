from app.usage import UsageLimiter


def test_usage_limiter_allows_until_limit_then_blocks():
    limiter = UsageLimiter(default_daily_limit=2)

    first = limiter.check_and_increment(subject="anon-1", action="generate", date_key="2026-04-30")
    second = limiter.check_and_increment(subject="anon-1", action="generate", date_key="2026-04-30")
    third = limiter.check_and_increment(subject="anon-1", action="generate", date_key="2026-04-30")

    assert first.allowed is True
    assert first.remaining == 1
    assert second.allowed is True
    assert second.remaining == 0
    assert third.allowed is False
    assert third.remaining == 0


def test_usage_limiter_resets_by_date():
    limiter = UsageLimiter(default_daily_limit=1)

    today = limiter.check_and_increment(subject="anon-1", action="generate", date_key="2026-04-30")
    tomorrow = limiter.check_and_increment(subject="anon-1", action="generate", date_key="2026-05-01")

    assert today.allowed is True
    assert tomorrow.allowed is True
    assert tomorrow.remaining == 0


def test_usage_limiter_reports_status_without_incrementing():
    limiter = UsageLimiter(default_daily_limit=3)
    limiter.check_and_increment(subject="anon-1", action="generate", date_key="2026-04-30")

    status = limiter.status(subject="anon-1", action="generate", date_key="2026-04-30")

    assert status.allowed is True
    assert status.used == 1
    assert status.limit == 3
    assert status.remaining == 2

from dataclasses import dataclass


@dataclass(frozen=True)
class UsageStatus:
    allowed: bool
    used: int
    limit: int
    remaining: int


class UsageLimiter:
    def __init__(self, default_daily_limit: int = 5):
        if default_daily_limit < 1:
            raise ValueError("default_daily_limit must be positive")
        self.default_daily_limit = default_daily_limit
        self._counts: dict[tuple[str, str, str], int] = {}

    def status(self, *, subject: str, action: str, date_key: str) -> UsageStatus:
        key = (subject, action, date_key)
        used = self._counts.get(key, 0)
        remaining = max(self.default_daily_limit - used, 0)
        return UsageStatus(
            allowed=used < self.default_daily_limit,
            used=used,
            limit=self.default_daily_limit,
            remaining=remaining,
        )

    def check_and_increment(self, *, subject: str, action: str, date_key: str) -> UsageStatus:
        current = self.status(subject=subject, action=action, date_key=date_key)
        if not current.allowed:
            return current

        key = (subject, action, date_key)
        new_used = current.used + 1
        self._counts[key] = new_used
        return UsageStatus(
            allowed=True,
            used=new_used,
            limit=self.default_daily_limit,
            remaining=max(self.default_daily_limit - new_used, 0),
        )

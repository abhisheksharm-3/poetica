"""
Rate limiting middleware using slowapi.
"""
from slowapi import Limiter
from slowapi.util import get_remote_address

from src.config.settings import get_settings


def create_limiter() -> Limiter:
    """Create and configure rate limiter."""
    settings = get_settings()

    limiter = Limiter(
        key_func=get_remote_address,
        default_limits=[f"{settings.rate_limit_requests}/minute"],
    )

    return limiter


limiter = create_limiter()

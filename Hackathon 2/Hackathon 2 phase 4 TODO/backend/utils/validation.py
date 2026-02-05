"""Input validation utilities."""

import re
from typing import Tuple


# Email regex pattern (RFC 5322 simplified)
EMAIL_PATTERN = re.compile(
    r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
)

# Password requirements
PASSWORD_MIN_LENGTH = 8
PASSWORD_PATTERN_UPPER = re.compile(r"[A-Z]")
PASSWORD_PATTERN_LOWER = re.compile(r"[a-z]")
PASSWORD_PATTERN_DIGIT = re.compile(r"\d")


def validate_email(email: str) -> Tuple[bool, str]:
    """
    Validate email format.

    Args:
        email: Email address to validate

    Returns:
        Tuple of (is_valid, error_message)
    """
    if not email:
        return False, "Email is required"

    if len(email) > 255:
        return False, "Email must be less than 255 characters"

    if not EMAIL_PATTERN.match(email):
        return False, "Invalid email format"

    return True, ""


def validate_password(password: str) -> Tuple[bool, str]:
    """
    Validate password meets requirements.

    Requirements:
    - Minimum 8 characters
    - At least 1 uppercase letter
    - At least 1 lowercase letter
    - At least 1 number

    Args:
        password: Password to validate

    Returns:
        Tuple of (is_valid, error_message)
    """
    if not password:
        return False, "Password is required"

    if len(password) < PASSWORD_MIN_LENGTH:
        return False, f"Password must be at least {PASSWORD_MIN_LENGTH} characters"

    if len(password) > 100:
        return False, "Password must be less than 100 characters"

    if not PASSWORD_PATTERN_UPPER.search(password):
        return False, "Password must contain at least one uppercase letter"

    if not PASSWORD_PATTERN_LOWER.search(password):
        return False, "Password must contain at least one lowercase letter"

    if not PASSWORD_PATTERN_DIGIT.search(password):
        return False, "Password must contain at least one number"

    return True, ""


def validate_name(name: str) -> Tuple[bool, str]:
    """
    Validate user name.

    Args:
        name: Name to validate

    Returns:
        Tuple of (is_valid, error_message)
    """
    if not name:
        return False, "Name is required"

    if len(name) < 2:
        return False, "Name must be at least 2 characters"

    if len(name) > 100:
        return False, "Name must be less than 100 characters"

    return True, ""

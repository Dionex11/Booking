from datetime import datetime
from app.crud import get_booking


def parse_iso_naive(ts: str) -> datetime:
    """
    Convert ISO timestamp with Zulu offset (UTC) to naive datetime.
    Example: "2025-11-22T20:34:12.799Z"
    """
    dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
    return dt.replace(tzinfo=None)     # make naive UTC


def validate_booking(bookreq: dict) -> bool:
    """
    Validate that a new booking does not overlap with existing bookings.
    Returns True if valid, False if overlap detected.
    """

    # Parse new booking times
    new_start = parse_iso_naive(bookreq["start_ts"])
    new_end = parse_iso_naive(bookreq["end_ts"])

    if new_end <= new_start:
        print("Invalid: end time must be after start time.")
        return False

    bookings = get_booking(bookreq["ids"])

    for b in bookings:
        # DB timestamps assumed to be naive UTC
        existing_start = b.start_ts
        existing_end = b.end_ts

        # --- Correct overlap rule ---
        # Overlap exists if:
        # new_start < existing_end AND new_end > existing_start
        if new_start < existing_end and new_end > existing_start:
            print(f"Overlap detected with booking ID {b.b_id}")
            return False

    return True   # No overlaps found

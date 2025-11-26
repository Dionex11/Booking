from datetime import datetime,timezone
from app.crud import get_booking

def parse_iso_aware(ts: str) -> datetime:
    """
    Converts ISO string with Z to a timezone-aware UTC datetime.
    """
    return datetime.fromisoformat(ts.replace("Z", "+00:00"))

def parse_iso_naive(ts: str) -> datetime:
    """
    Convert ISO timestamp with Zulu offset (UTC) to naive datetime.
    Example: "2025-11-22T20:34:12.799Z"
    """
    dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
    return dt     # make naive UTC


def validate_booking(bookreq: dict) -> bool:
    """
    Validate that a new booking does not overlap with existing bookings.
    Returns True if valid, False if overlap detected.
    """

    # Parse new booking times
    new_start = parse_iso_aware(bookreq["start_ts"])
    new_end = parse_iso_aware(bookreq["end_ts"])
    print(new_start,new_end)
    if new_end <= new_start:
        print("Invalid: end time must be after start time.")
        return False

    bookings = get_booking(bookreq["ids"])
    print(bookings)
    for b in bookings:
        # DB timestamps assumed to be naive UTC
        print("b",b.start_ts)
        existing_start = b.start_ts.replace(tzinfo=timezone.utc)
        existing_end = b.end_ts.replace(tzinfo=timezone.utc)
        print(existing_end,existing_start)
        # --- Correct overlap rule ---
        # Overlap exists if:
        # new_start < existing_end AND new_end > existing_start
        if new_start < existing_end and new_end > existing_start:
            print(f"Overlap detected with booking ID {b.b_id}")
            return False

    return True   # No overlaps found

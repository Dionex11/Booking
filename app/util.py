from datetime import datetime
from app.crud import get_booking

def convert_to_date(date_str):
    
    if isinstance(date_str, datetime): 
        return date_str.date()
    elif hasattr(date_str, "year"):  
        return date_str
    return datetime.strptime(date_str, "%Y-%m-%d").date()


def convert_to_time(time_str):
    
    if hasattr(time_str, "hour"): 
        return time_str
    try:
        # First try 'HH:MM:SS'
        return datetime.strptime(time_str, "%H:%M:%S").time()
    except ValueError:
        # Fall back to 'HH:MM'
        return datetime.strptime(time_str, "%H:%M").time()



def validate_booking(bookreq):
    print(bookreq)
    print(bookreq["workspace_id"])
    booking_list = get_booking(bookreq["workspace_id"])

   
    new_start = datetime.combine(
        convert_to_date(bookreq["startdate"]),
        convert_to_time(bookreq["starttime"])
    )
    new_end = datetime.combine(
        convert_to_date(bookreq["enddate"]),
        convert_to_time(bookreq["endtime"])
    )

    print("New booking:", new_start, new_end)

    for b in booking_list:
        existing_start = datetime.combine(convert_to_date(b.startdate), convert_to_time(b.starttime))
        existing_end = datetime.combine(convert_to_date(b.enddate), convert_to_time(b.endtime))

        print("Existing:", existing_start, existing_end)

 
        if not (new_end <= existing_start or new_start >= existing_end):
            print("Log overlap")
            return False 

    return True

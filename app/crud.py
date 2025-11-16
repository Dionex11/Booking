from app import db
from app.models import Workspace,Booking
from sqlalchemy import and_

def fetch_workspaces():
    """Fetch all workspaces."""
    return Workspace.query.all()

def availablespaces(data):
    return Workspace.outerjoin(Booking,and_(Booking.workspace_id==Workspace.id,Booking.start_datetime < data['user_end'],
                Booking.end_datetime > data['user_start']).filter(Booking.workspace_id==None))

def book_workspace(workspace_id):
    """Book a workspace if available."""
    ws = Workspace.query.get(workspace_id)
    if ws and ws.status != "booked":
        ws.status = "booked"
        db.session.commit()
        return True
    return False
def get_booking(workspace_id):
    bookings = Booking.query.filter(Booking.workspace_id == workspace_id).all()
    return bookings

   

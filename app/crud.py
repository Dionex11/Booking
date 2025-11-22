from app import db
from app.models import Workspace,Booking
from sqlalchemy import and_,outerjoin

def fetch_workspaces():
    
    return Workspace.query.all()

def availablespaces(data):

    "Checks overlap in booking timestamp format: 2025-11-19 12:00:00+00:00"
    return Workspace.query.outerjoin(Booking,and_(Booking.workspace_id==Workspace.id,Booking.start_ts < data['user_end'],
                Booking.end_ts > data['user_start'])).filter(Booking.workspace_id==None).all()

def book_workspace(workspace_id):
    
    ws = Workspace.query.get(workspace_id)
    if ws and ws.status != "booked":
        ws.status = "booked"
        db.session.commit()
        return True
    return False
def get_booking(workspace_id):
    if isinstance(workspace_id, (list, tuple, set)):
        return Booking.query.filter(Booking.workspace_id.in_(workspace_id)).all()
    else:
        return Booking.query.filter(Booking.workspace_id == workspace_id).all()

   

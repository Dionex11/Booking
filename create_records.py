from app import create_app, db
from app.models import Workspace

app = create_app()
app.app_context().push()
ws1 = Workspace(name="Desk 1")
ws2 = Workspace(name="Desk 2")
ws3 = Workspace(name="Conference Room")

#db.session.add_all([ws1, ws2, ws3])
#db.session.commit()
ws=Workspace.query.all()
print(ws)

from app import db
from app.models import Booking
from datetime import datetime, timezone

def dt(y, m, d, h, min=0):
    return datetime(y, m, d, h, min, tzinfo=timezone.utc)

sample_bookings = [
    Booking(workspace_id=1, start_ts=dt(2025,11,18,9), end_ts=dt(2025,11,18,11)),
    Booking(workspace_id=1, start_ts=dt(2025,11,19,14), end_ts=dt(2025,11,19,18)),
    Booking(workspace_id=2, start_ts=dt(2025,11,20,10), end_ts=dt(2025,11,20,12)),
    
]

db.session.add_all(sample_bookings)
db.session.commit()

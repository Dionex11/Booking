
from app import create_app, db
from app.models import Booking
app = create_app()
app.app_context().push()
recs=Booking.query.all()
print(recs)
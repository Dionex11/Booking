from datetime import datetime,timezone

from app import create_app, db
from app.crud import availablespaces
app = create_app()
app.app_context().push()
def dt(y, m, d, h, min=0):
    return datetime(y, m, d, h, min, tzinfo=timezone.utc)
start_ts=dt(2025,11,22,12)
end_ts=dt(2025,11,23,11)
print(start_ts)
data={'user_start':start_ts,'user_end':end_ts}
a=availablespaces(data)
print(a)

from app import db
from datetime import datetime
# ORM model for workspace table
class Workspace(db.Model):
    __tablename__ = "workspace"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))

    # Relationship to bookings
    bookings = db.relationship("Booking", back_populates="workspace")


class Booking(db.Model):
    __tablename__ = "booking"

    b_id = db.Column(db.Integer, primary_key=True)
    workspace_id = db.Column(db.Integer, db.ForeignKey("workspace.id"))
    start_ts = db.Column(db.DateTime(timezone=True),nullable=False)
    end_ts = db.Column(db.DateTime(timezone=True),nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.now())

    # Relationship back to workspace
    workspace = db.relationship("Workspace", back_populates="bookings")
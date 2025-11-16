from flask import  render_template, jsonify,Blueprint,request
from app.crud import fetch_workspaces, book_workspace
from app.models import Booking
from app import db
from app.util import convert_to_date,convert_to_time,validate_booking
from datetime import datetime
bp = Blueprint('routes', __name__)
@bp.route("/")
def home():
    try:
        # Fetch ORM objects
        ws = fetch_workspaces()
     

        # Convert ORM objects to dicts before passing to template
        workspace_data = [
            {"id": w.id, "name": w.name, "status": w.status}
            for w in ws
        ]
        print(workspace_data)
        return workspace_data
        #return render_template("layout.html", workspaces=workspace_data)
    except Exception as e:
        return f"Error: {e}"


@bp.route("/book", methods=["POST"])
def book_workspace():
    data = request.get_json()
    print(data)
    if not data:
        return jsonify({"error": "No data received"}), 400

    try:
        if validate_booking(data):
            # Convert and format data before saving
            print("!saved")
            booking = Booking(
                workspace_id=data["workspace_id"],
                startdate=datetime.strptime(data["startdate"], "%Y-%m-%d").date(),
                starttime=datetime.strptime(data["starttime"], "%H:%M").strftime("%H:%M:%S"),
                enddate=datetime.strptime(data["enddate"], "%Y-%m-%d").date(),
                endtime=datetime.strptime(data["endtime"], "%H:%M").strftime("%H:%M:%S")
            )
            db.session.add(booking)
            db.session.commit()
            return jsonify({"message": "Booking added successfully"}), 200
        else:
            return jsonify({"error": "Booking conflicts with existing reservation"}), 400
    except Exception as e:
        print("Error during booking:", e)
    return jsonify({"error": "Internal server error"}), 500

#@bp.route("/book/<int:workspace_id>", methods=["POST"])
def book(workspace_id):
    success = book_workspace(workspace_id)
    if success:
        return jsonify({"message": "Workspace booked successfully!"})
    else:
        return jsonify({"error": "Workspace already booked or not found."}), 400

if __name__ == "__main__":
    app.run(debug=True)

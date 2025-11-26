from flask import  render_template, jsonify,Blueprint,request
from app.crud import fetch_workspaces, book_workspace,availablespaces
from app.models import Booking
from app import db
from app.util import validate_booking,parse_iso_aware
from datetime import datetime

bp = Blueprint('routes', __name__)
@bp.route("/")
def home():
    try:
     
        ws = fetch_workspaces()
     

       
        workspace_data = [
            {"id": w.id, "name": w.name, "status": w.status}
            for w in ws
        ]
        print(workspace_data)
        return workspace_data
        #return render_template("layout.html", workspaces=workspace_data)
    except Exception as e:
        return f"Error: {e}"
@bp.route("/ws",methods=["GET","POST"])
def get_available_worksapces():
    data=request.get_json()
    print(data)
    if not data:
        return jsonify({"error": "No data received"}), 400
    try:
        workspaces=availablespaces(data)
        print(workspaces)
        workspace_data = [
            {"id": w.id, "name": w.name}
            for w in workspaces
        ]
        return workspace_data
    except:
        print("Error Filtering")
    return jsonify({"error": "Internal server error"}), 500

@bp.route("/book", methods=["POST"])
def book_workspace():
    data = request.get_json()
    print(data)
    if not data:
        return jsonify({"error": "No data received"}), 400

    try:
        if validate_booking(data):
            for id in data["ids"]:

                print("!saved")
                booking = Booking(
                    workspace_id=id,
                    start_ts=parse_iso_aware(data["start_ts"]),
                    end_ts=parse_iso_aware(data["end_ts"]),
                    
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

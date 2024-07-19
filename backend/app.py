from flask import Flask, render_template, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
import pickledb
import requests

from compile import CTL

EDIT_PASSWORD = os.environ.get("EDIT_PASSWORD")

app = Flask(
    __name__,
    static_url_path="",
    static_folder="../dist",
    template_folder="../dist"
)
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET")
JWTManager(app)

notes_db = pickledb.load("/var/data/notes.db", True)

@app.route("/api/login", methods=["POST"])
def login():
    if request.json.get("password") != EDIT_PASSWORD:
        return {"message": "Wrong Password"}, 403

    access_token = create_access_token(identity={"username": "EMSCO"})
    return jsonify(token=access_token), 200

@app.route("/api/ctl")
def ctl():
    ctl = CTL()

    return ctl.ctl(notes_db)

@app.route("/api/official-kanban")
def official_kanban():
    ctl = CTL()

    return ctl.official_kanban

@app.route("/api/weekly-hours")
def weekly_hours():
    ctl = CTL()

    return ctl.weekly_hours

@app.route("/api/note", methods=["POST"])
@jwt_required()
def note():
    current_user = get_jwt_identity()

    print(notes_db.getall())

    unique_id = str(request.json.get("uniqueID"))
    new_value = str(request.json.get("value"))
    notes_db.set(unique_id, new_value)

    return {}, 200

# Passes web requests on to ReactJS build
@app.errorhandler(404)
def not_found(e):
    return render_template("index.html")

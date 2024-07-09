from flask import Flask, render_template
import requests

from compile import CTL

app = Flask(
    __name__,
    static_url_path="",
    static_folder="../dist",
    template_folder="../dist"
)

@app.route("/api/ctl")
def ctl():
    ctl = CTL()

    return ctl.ctl

@app.route("/api/official-kanban")
def official_kanban():
    ctl = CTL()

    return ctl.official_kanban

@app.route("/api/weekly-hours")
def weekly_hours():
    ctl = CTL()

    return ctl.weekly_hours

# Passes web requests on to ReactJS build
@app.errorhandler(404)
def not_found(e):
    return render_template("index.html")

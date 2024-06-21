from flask import Flask, render_template
import requests

from compile import CTL

app = Flask(
    __name__,
    static_url_path="",
    static_folder="../dist",
    template_folder="../dist"
)

@app.route("/api/table")
def trending():
    ctl = CTL()

    return ctl.table

# Passes web requests on to ReactJS build
@app.errorhandler(404)
def not_found(e):
    return render_template("index.html")

from flask import Flask, render_template

app = Flask(
    __name__,
    static_url_path="",
    static_folder="../dist",
    template_folder="../dist"
)

@app.route("/api/table")
def trending():
    return {
        "table": [
            { "make": "Tesla", "model": "Model Y", "price": 64950, "electric": True },
            { "make": "Ford", "model": "F-Series", "price": 33850, "electric": False },
            { "make": "Toyota", "model": "Corolla", "price": 29600, "electric": False },
            { "make": "Mercedes", "model": "EQA", "price": 48890, "electric": True },
            { "make": "Fiat", "model": "500", "price": 15774, "electric": False },
            { "make": "Nissan", "model": "Juke", "price": 20675, "electric": False },
        ]
    }

# Passes web requests on to ReactJS build
@app.errorhandler(404)
def not_found(e):
    return render_template("index.html")

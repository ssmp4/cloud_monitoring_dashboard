# app.py
from flask import Flask, render_template, redirect
from main_funcs import calculate_metrics, DATA
from config import NAME
from datetime import datetime

app = Flask(__name__, template_folder="templates", static_folder="static")


@app.route("/")
def index():
    return redirect("/dashboard")


@app.route("/dashboard")
def dashboard():
    try:
        metrics = calculate_metrics()
        last_updated = datetime.now().strftime("%d.%m.%Y %H:%M:%S")
        return render_template(
            "dashboard.html",
            metrics=metrics,
            DATA=DATA,
            last_updated=last_updated,
            name=NAME,
        )
    except Exception as e:
        return f"<h1>Ошибка: {e}</h1>", 500


if __name__ == "__main__":
    app.run(debug=True)
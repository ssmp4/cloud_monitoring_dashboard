# app.py
from flask import Flask, render_template
from main_funcs import calculate_metrics, DATA
import config
from datetime import datetime

app = Flask(__name__, template_folder="templates", static_folder="static")


@app.context_processor
def inject_globals():
    return {
        'current_year': datetime.now().year,
        'site_name': config.SITE_INFO['name'],
        'footer_text': f"© {datetime.now().year} {config.SITE_INFO['name']}. Для обучения."
    }


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/demo")
def dashboard():
    try:
        metrics = calculate_metrics()
        last_updated = datetime.now().strftime("%d.%m.%Y %H:%M:%S")
        return render_template(
            "demo.html",
            metrics=metrics,
            DATA=DATA,
            last_updated=last_updated,
        )
    except Exception as e:
        return f"<h1>Ошибка: {e}</h1>", 500


@app.route("/demo")
def demo():
    return render_template("demo.html")


if __name__ == "__main__":
    app.run(debug=True)
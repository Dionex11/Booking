from flask import Flask
from app.config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)

    # Apply CORS before registering blueprints
    CORS(app, resources={
        r"/*": {
            "origins": app.config.get("CORS_ORIGINS", [
                "http://localhost:5173"
            ])
        }
    })

    from app.routes import bp as routes_bp
    app.register_blueprint(routes_bp)

    from app import models  # noqa: F401

    return app

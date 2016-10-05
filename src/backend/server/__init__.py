"""Initialise the server """

import os
import logging
from logging.handlers import RotatingFileHandler
from collections import namedtuple

from flask import Flask
import celery_init

def create_flask():
    app = Flask(__name__, template_folder="../../client/static",
                static_folder="../../client/static",
                static_url_path="/static")
    app.config.from_object('server.conf.dev')
    app.config.from_envvar('FLASK_CONFIG', silent=True)

    if app.debug:
        print "Running in debug mode"
    else:
        from raven.contrib.flask import Sentry
        sentry = Sentry(app, dsn=app.config["SENTRY_DSN"])

        FILE_HANDLER = RotatingFileHandler(os.environ.get("FLASK_LOG", "flask.log"), maxBytes=1024 * 1024 * 100, backupCount=20)
        FILE_HANDLER.setLevel(logging.DEBUG)
        FORMATTER = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
        FILE_HANDLER.setFormatter(FORMATTER)
        app.logger.addHandler(FILE_HANDLER)
        app.logger.setLevel(logging.DEBUG)
        app.logger.info("Running in production mode")

    return app

app = create_flask()
celery = celery_init.make_celery(app)

Genre = namedtuple("Genre", "name weighting")

import routes

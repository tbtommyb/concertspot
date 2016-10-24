"""Initialise the server """

from __future__ import unicode_literals
import os
import logging
from logging.handlers import RotatingFileHandler
from collections import namedtuple

from flask import Flask
from server.events.cache import cache
from server.events.db import Database
import celery_init

def create_flask():
    app = Flask(__name__, template_folder="../../client/static",
                static_folder="../../client/static",
                static_url_path="/static")
    try:
        app.config.from_object('server.conf.dev')
        app.config.from_envvar('FLASK_CONFIG', silent=True)
    except ImportError:
        app.config.update(
            DEBUG=os.environ['DEBUG'],
            SECRET_KEY=os.environ['SECRET_KEY'],
            SERVER_NAME=os.environ['SERVER_NAME'],
            SK_API_KEY=os.environ['SK_API_KEY'],
            SK_URL=os.environ['SK_URL'],
            CELERY_BROKER_URL=os.environ['CELERY_BROKER_URL'],
            CELERY_RESULT_BACKEND=os.environ['CELERY_RESULT_BACKEND']
            )

    """ Initialise cache with list of all genres to check queries against """
    cache.add(cache.genre_list_id(), Database().get_genre_list(), expiration=False)

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

""" Create Celery base task with access to DB and EventList """

from celery import Celery
from server.events.db import Database

def make_celery(app):
    """ Initiate Celery and subclass task with link to DB """
    celery = Celery(app.import_name, backend=app.config['CELERY_RESULT_BACKEND'],
                    broker=app.config['CELERY_BROKER_URL'])
    celery.conf.update(app.config)

    TaskBase = celery.Task
    class ContextTask(TaskBase):
        """ Base class with access to Flask app context """
        abstract = True

        def __call__(self, *args, **kwargs):
            with app.app_context():
                return TaskBase.__call__(self, *args, **kwargs)

    class DBTask(ContextTask):
        """ Add properties to link to DB """
        abstract = True

        @property
        def database(self):
            """ Provides reference to database """
            return self._database

        @database.setter
        def database(self, database):
            self._database = database

        @database.deleter
        def database(self):
            del self._database

        def __call__(self, *args, **kwargs):
            self.database = Database()
            with app.app_context():
                return ContextTask.__call__(self, *args, **kwargs)

        def after_return(self, *args, **kwargs):
            """ Ensure that database connection gets closed """
            self.database.close()

    celery.Task = ContextTask
    celery.DBTask = DBTask
    return celery

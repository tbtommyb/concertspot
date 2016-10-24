""" Fetches a list of events matching POSTed search terms and fetches list of genres
    associated with query term in order to build recommendation. Events matching search
    terms and artists (with associated genres) matching query term are cached where
    possible to improve performance. The client must poll the server for the response.
"""

from __future__ import unicode_literals
import flask
from flask import abort, request, jsonify, session

from server import app as flask_app
from server import Genre
from server.events.recommender import recommend
from server.events.db import Database
from server.validate import validate
import server.tasks as tasks
from server.events.cache import cache, CacheKeyError

# ------- Error handling --------------

if not flask_app.debug:
    @flask_app.errorhandler(500)
    def internal_error(exception):
        """ Log any server errors in production """
        flask_app.logger.error(exception)
        return abort(500, "Internal server error")

# ------- Initialisation --------------

@flask_app.before_first_request
def get_genre_list():
    """ Initialise cache with list of all genres to check queries against """
    cache.add(cache.genre_list_id(), Database().get_genre_list(), expiration=False)

# ------- Flask routes ----------------

@flask_app.route("/api/search", methods=["GET", "POST", "OPTIONS"])
def start_search():
    """ request_terms: query, artist_id, mindate, maxdate, latitude, longitude, radius

        POST: Events for request_terms retrieved from cache or task started if cache miss.
        Task Ids are added to session for GET route to pick up and genre-fetching task is initiated.

        GET: Checks if tasks have finished by checking cache. Uses 202 code to tell client to retry.

        Session variables rather than URL parameters are used as results are not persisted.
    """

    if request.method == "POST":
        # Sending new search to be performed
        try:
            request_terms = validate(request.get_json())
        except Exception as error:
            abort(400, "Invalid query terms: {}".format(str(error)))
        flask_app.logger.info(request_terms)
        query = request_terms["query"]

        events_search_cache_id = cache.events_search_id(request_terms)
        if not cache.exists(events_search_cache_id):
            tasks.fetch_events.delay(request_terms)

        query_genres_cache_id = cache.query_genres_id(query)
        if not cache.exists(query_genres_cache_id):
            tasks.get_genres_for_query.delay(query)

        # Save search identifier and query for recall in GET handler
        session["events_search_cache_id"] = events_search_cache_id
        session["query_genres_cache_id"] = query_genres_cache_id

        return flask.Response(response="Generating response...", status=202)

    if request.method == "GET":
        query_genres_cache_id = session.get("query_genres_cache_id")
        events_search_cache_id = session.get("events_search_cache_id")
        if query_genres_cache_id is None:
            abort(400, "No query provided in request")
        if events_search_cache_id is None:
            abort(400, "No events_search_cache_id provided in request")

        # Get events, if task has saved events to cache yet
        try:
            events = cache.get(events_search_cache_id)
        except CacheKeyError:
            return flask.Response(response="Loading events...", status=202)

        try:
            cached_genres = cache.get(query_genres_cache_id)
        except CacheKeyError:
            # Waiting for the task to update the cache
            return flask.Response(response="Loading genres for query artist...", status=202)

        # Pop off task ID so that other artists can be queried in same session
        session.pop("query_genres_cache_id", None)
        if cached_genres:
            genres = [Genre(**item) for item in cached_genres]
            return jsonify(events=recommend(events, genres))
        else:
            return jsonify(events=[])

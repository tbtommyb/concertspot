""" Events are fetched from the Skiddle API. The Concertspot DB is called to match
    queries to genres so they can be used to find relevant events.
    They are time-consuming so are processed in background tasks where possible.
"""

from __future__ import unicode_literals
from server import celery as celery_app
from server import app as flask_app
from server import Genre
from server.events.events import filter_event, fetch
from server.events.cache import cache

# ------- Celery tasks ----------------

@celery_app.task(base=celery_app.DBTask)
def fetch_events(request_terms):
    """ @param request_terms: dict of user's query terms
        Fetches list of events from events API and saves to cache
        using request terms as ID
    """
    def event_generator(request_terms):
        for event in fetch(**request_terms):
            yield filter_event(event)

    events = [event for event in event_generator(request_terms) if event is not None]
    cache.add(cache.events_search_id(request_terms), events)
    return events

@celery_app.task(base=celery_app.DBTask)
def get_genres_for_query(query):
    """ @param query: artist name as string
        Checks whether query is genre, if not fetches list of genres for
        artist and saves to cache as (name, weighting) Genre tuples
    """
    def get_genres(input):
        # TODO - if this fails, fetch the genres and try again
        if input in [genre for genre in cache.get(cache.genre_list_id())]:
            # Query is a genre
            genres = [Genre(input, 1.0)]
        else:
            genres = [Genre(genre[0], genre[1]) for genre in
                      get_genres_for_query.database.get_genres_for_query(input)]
        return genres

    try:
        genres = get_genres(query)
        if not len(genres):
            # No results so try removing possible extra search terms
            terms = ["events", "event", "clubs", "club",  "clubnights", "clubnight", "music", "parties",
                     "party", "gigs", "gig", "nights", "night"]
            stripped_query = query
            for term in terms:
                stripped_query = stripped_query.replace(term, "").strip()
            genres = get_genres(stripped_query)
        cache.add(cache.query_genres_id(query), genres)
        return genres
    except Exception as e:
        print e
        flask_app.logger.error(e)
        return []

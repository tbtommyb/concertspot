""" @param events: list of event dicts
    Builds list of recommended events based on genres of query
"""

from operator import itemgetter
from server import Genre

def recommend(events, query):
    """ @param query: Genre namedtuple(name: string, weighting: float)
        Calculate relevance of each event and order result. Genres are split up so that
        e.g. "folk rock" will match both folk and rock events.
        Weighting minimum of 0.5 is currently arbitrary
    """
    query_genres = [Genre(word, genre.weighting) for genre in query for word in genre.name.split()]
    def gen_weighting():
        """ Adds total relevance of each genre that matches query genres, without mutation """
        for event in events:
            genres = list({word for genre in event["genres"] for word in genre["name"].lower().split()})
            weighting = {"weighting": sum([query_genre.weighting
                                           for genre in genres
                                           for query_genre in query_genres
                                           if query_genre.name == genre])}
            yield dict(weighting, **event)
    filtered_events = [event for event in gen_weighting() if event["weighting"] >= 0.5]
    return sorted(filtered_events, key=itemgetter("weighting"), reverse=True)

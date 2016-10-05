""" Implements connection to Redis server

    @param update_fields: list of strings
    @param request_terms: dictionary with keys matching update_fields

    Cache expiry set to 30 mins by default
"""

from __future__ import unicode_literals
import hashlib
import redis
import simplejson as json

class CacheKeyError(Exception):
    def __init__(self, key):
        super(CacheKeyError, self).__init__(key)

class Cache(object):
    """ Initialise Redis cache """
    def __init__(self, host, port, db, **kwargs):
        self.cache = redis.StrictRedis(host, port, db)
        self.expiration = kwargs.get("expiration", 1800)
        self.update_fields = kwargs["update_fields"]

    def _generate_hash(self, request_terms):
        """ Create unique hash from keys found in update_fields """
        id = hashlib.md5()
        for field in self.update_fields:
            id.update(str(request_terms[field]))
        return id.hexdigest()[:10]

    def events_search_id(self, request_terms):
        """ Create ID to identify event searches """
        return "events:{}".format(self._generate_hash(request_terms))

    def query_genres_id(self, query):
        """ @param query: string
            Create ID for caching genres per query
        """
        return "query_genres:{}".format(query)

    def genre_list_id(self):
        """ Return ID to access list of all genres """
        return "genres"

    def add(self, cache_id, data, expiration=None):
        """ @param cache_id: string
            @param data: serialisable data
            @param expiration: False or expiration time in seconds. Default to self.expiration
            Add serialised data to cache
        """
        if expiration == False:
            return self.cache.set(cache_id, json.dumps(data))
        if expiration is None:
            expiration = self.expiration
        self.cache.set(cache_id, json.dumps(data), ex=expiration)

    def get(self, cache_id):
        """ @param cache_id: string
            Get item from cache. Return JSON or None
        """
        data = self.cache.get(cache_id)
        if data is None:
            raise CacheKeyError(cache_id)
        return json.loads(data)

    def exists(self, cache_id):
        """ @param cache_id: string
            Check if key exists in cache
        """
        return self.cache.exists(cache_id)

cache = Cache("localhost", 6379, 0, update_fields=[
    "mindate", "maxdate", "radius", "latitude", "longitude"])

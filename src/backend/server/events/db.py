""" Implements connection to Postgres DB server """

from __future__ import unicode_literals
import os
import sys
import psycopg2
try:
    from server.conf.database import conf
except ImportError:
    conf = {
        "name": os.environ["db_name"],
        "user": os.environ["db_user"],
        "password": os.environ["db_pass"],
        "host": os.environ["db_host"]
    }

class Database(object):
    """ Implement connection to DB """
    def __init__(self):
        conn = psycopg2.connect("dbname={name} user={user} password={password} \
            host={host}".format(**conf))
        self.conn = conn

    def handle_error(self, cursor):
        """ Rollback and close connection before exiting in case of error """
        self.conn.rollback()
        cursor.close()
        self.conn.close()

    def get_genre_list(self):
        """ Get list of all genres """
        try:
            cur = self.conn.cursor()
            cur.execute("""SELECT DISTINCT genres.name
                           FROM artist_genres genres
                           ORDER BY genres.name;""")
            results = cur.fetchall()
            cur.close()
            return [result[0] for result in results]
        except psycopg2.DatabaseError, exception:
            print exception
            self.handle_error(cur)

    def get_genres_for_query(self, artist_name):
        """ @param artist_name: string
            Get genres and weighting for artist name
        """
        try:
            cur = self.conn.cursor()
            cur.execute("""SELECT genres.name, genres.weighting, artists.id
                           FROM artists
                           INNER JOIN artist_genres genres
                           ON artists.id = genres.artist_id
                           WHERE LOWER(artists.name) = LOWER(%(artist_name)s)
                           AND genres.weighting >= 0.2
                           ORDER BY genres.weighting DESC;
                        """,
                        {"artist_name":artist_name})
            results = cur.fetchall()
            cur.close()
            return results
        except psycopg2.DatabaseError, exception:
            print exception
            self.handle_error(cur)

    def commit(self):
        """ Commit any changes """
        self.conn.commit()
        return self

    def close(self):
        """ Close the connection """
        self.conn.close()
        return self

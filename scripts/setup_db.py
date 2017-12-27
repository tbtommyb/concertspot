""" Initialise DB. Usage:
    setup_db artist_input.json genre_input.json db_name
"""
import sys
import psycopg2
import ijson

ROWS_PER_INSERT = 100000

class Database:
    """ Initialise database with JSON data from args """
    def __init__(self):
        conn = psycopg2.connect("dbname=postgres user=postgres password=example host=db")
        self.conn = conn
        self.cur = conn.cursor()

    def create_artists_table(self):
        """ Create table holding alternative names for artist """
        self.cur.execute("DROP TABLE IF EXISTS artists CASCADE;")
        self.cur.execute("CREATE TABLE artists (id integer PRIMARY KEY, name varchar(80));")
        return self

    def create_artist_genres_table(self):
        """ Create table holding genre information for each artist """
        self.cur.execute("DROP TABLE IF EXISTS artist_genres CASCADE;")
        self.cur.execute("CREATE TABLE artist_genres (artist_id integer, \
                          name varchar(80), weighting real, PRIMARY KEY(artist_id, name));")
        return self

    def commit(self):
        """ Commit all changes """
        self.conn.commit()
        return self

    def close(self):
        """ Close database connection """
        self.cur.close()
        self.conn.close()
        return self

    def load_artists(self, artists):
        print "Loading artists..."
        value_SQL = ["%s", "%s"]
        SQL_rows = []
        for artist in artists:
            SQL_rows += [artist["id"], artist["name"]]
            if (len(SQL_rows)/len(value_SQL)) % ROWS_PER_INSERT == 0:
                insert_SQL = "INSERT INTO artists VALUES " + ",".join(["(" + ",".join(value_SQL) + ")"]*ROWS_PER_INSERT)
                self.cur.execute(insert_SQL, SQL_rows)
                self.commit()
                SQL_rows = []
        if len(SQL_rows):
            insert_SQL = "INSERT INTO artists VALUES " + ",".join(["(" + ",".join(value_SQL) + ")"]*(len(SQL_rows)/len(value_SQL)))
            self.cur.execute(insert_SQL, SQL_rows)
            self.commit()
        return

    def load_artist_genres(self, artists):
        print "Loading artist genres..."
        value_SQL = ["%s", "%s", "%s"]
        SQL_rows = []
        for artist in artists:
            for genre in artist["genres"]:
                SQL_rows += [artist["id"], genre["name"], genre["weighting"]]
                if (len(SQL_rows)/len(value_SQL)) % ROWS_PER_INSERT == 0:
                    insert_SQL = "INSERT INTO artist_genres VALUES " + ",".join(["(" + ",".join(value_SQL) + ")"]*ROWS_PER_INSERT) + " ON CONFLICT DO NOTHING"
                    self.cur.execute(insert_SQL, SQL_rows)
                    self.commit()
                    SQL_rows = []
        if len(SQL_rows):
            print "Calling end of loop..."
            insert_SQL = "INSERT INTO artist_genres VALUES " + ",".join(["(" + ",".join(value_SQL) + ")"]*(len(SQL_rows)/len(value_SQL))) + " ON CONFLICT DO NOTHING"
            self.cur.execute(insert_SQL, SQL_rows)
            self.commit()
        return

    def create_index(self):
        print "Creating index on names"
        self.cur.execute("CREATE INDEX ON artists (LOWER(name))")
        self.commit()

def init_db():
    db = Database()
    db.create_artists_table()
    db.create_artist_genres_table()
    return db

def load_data(db, artist_input, genre_input):

    print "Loading {}...".format(artist_input)
    with open(artist_input) as artist_file:
        artists = ijson.items(artist_file, "artists.item")
        try:
            db.load_artists(artists)
        except psycopg2.DatabaseError as error:
            print error
            sys.exit(1)

    print "Loading {}...".format(genre_input)
    with open(genre_input) as genre_file:
        genres = ijson.items(genre_file, "artists.item")
        try:
            db.load_artist_genres(genres)
        except psycopg2.DatabaseError as error:
            print error
            sys.exit(1)

    db.commit()
    db.create_index()
    db.close()

if __name__ == "__main__":
    db = init_db()
    load_data(db, sys.argv[1], sys.argv[2])

ConcertSpot
===========

[ConcertSpot](https://www.concertspot.co.uk) recommends gigs and clubnights to you based on what you're looking for. It uses React on the front end and Hapi, Postgres and Redis on the back end.

Events are fetched from the [Skiddle API](http://www.skiddle.com/api/) and cached to reduce future lookup times. Queries are looked up against a database built using [Discog's artist and release data](http://data.discogs.com/). At the minute events are recommended based on a simplistic genre-matching algorithm, so there is plenty of scope to improve this.

## Steps

1. Create a `.env` file containing `POSTGRES_PASSWORD`. Load into environment.
1. Fill in values in `backend/config.env`.
1. Run `make setup-db` and `make deploy`.

### Transferring data volume

The script to seed the database uses a lot of memory and doesn't run on small VMs.

On a local machine:
```
$ make setup-db
$ docker run --rm --volumes-from concertspot_db_1 -v $(pwd):/backup ubuntu tar cvf /backup/backup.tar /var/lib/postgresql/data
$ [scp to VM]
```

On the VM:
```
$ docker run --rm --volumes-from concertspot_db_1 -v $(pwd):/var/lib/postgresql/data ubuntu bash -c "cd / && tar xvf backup.tar"
```

Todos
-----

* Perform more server-side analysis of events to build up more sophisticate recommendation mechanism, possibly as a separate API.
* Improve seed script performance.


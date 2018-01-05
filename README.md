ConcertSpot
===========

[ConcertSpot](https://www.concertspot.co.uk) recommends gigs and clubnights to you based on what you're looking for. It uses React on the front end and Hapi, Postgres and Redis on the back end.

Events are fetched from the [Skiddle API](http://www.skiddle.com/api/) and cached to reduce future lookup times. Queries are looked up against a database built using [Discog's artist and release data](http://data.discogs.com/). At the minute events are recommended based on a simplistic genre-matching algorithm, so there is plenty of scope to improve this.

Todos
-----

* Perform more server-side analysis of events to build up more sophisticate recommendation mechanism, possibly as a separate API.


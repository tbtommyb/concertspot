ConcertSpot
===========

ConcertSpot recommends gigs and clubnights to you based on what you're looking for. It uses React on the front end and Flask, Redis and Celery on the back end.

Events are fetched from the [Skiddle API](http://www.skiddle.com/api/) and cached to reduce future lookup times. Queries are looked up against a database built using [Discog's artist and release data](http://data.discogs.com/). At the minute events are recommended based on a simplistic genre-matching algorithm, so there is plenty of scope to improve this.

Todos
-----

* Move to server-sent events rather than client polling for getting results.

* Store events rather than continually fetching from Skiddle's API, so that minor changes to searches (e.g. increasing radius by 0.5 miles) don't require fetching the entire set of events again.

* Perform more server-side analysis of events to build up more sophisticate recommendation mechanism.

* Offer ability to save queries and share permalinks (requires storing that set of events, since the Skiddle API may not return the same results for future queries).

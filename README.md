ConcertSpot
===========

ConcertSpot recommends gigs and clubnights to you based on what you're looking for. It uses React on the front end and Flask on the back end.

Todos
-----

* Move to server-sent events rather than client polling for getting results.

* Store events rather than continually fetching from Skiddle's API, so that minor changes to searches (e.g. increasing radius by 0.5 miles) don't require fetching the entire results set again.

* Perform more server-side analysis of events to build up more sophisticate recommendation mechanism.
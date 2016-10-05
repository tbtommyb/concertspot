""" Fetch and filter list of local events from Skiddle API """
import requests
from server import app

SK_KEY = app.config["SK_API_KEY"]
SK_URL = app.config["SK_URL"]

def fetch(mindate, maxdate, latitude, longitude, radius, *args, **kwargs):
    """ @param mindate, maxdate: date objects
        @param latitude, longitude, radius: float
        Queries the Skiddle Events API and returns a list of event dicts """
    try:
        events = []
        payload = {
            "api_key": SK_KEY,
            "minDate": mindate.strftime("%Y-%m-%d"),
            "maxDate": maxdate.strftime("%Y-%m-%d"),
            "eventcodes[]": ["CLUB", "LIVE"],
            "latitude": latitude,
            "longitude": longitude,
            "radius": radius,
            "order": "4",
            "limit": "100"
        }
    except Exception as e:
        app.logger.error("Invalid parameters to fetch: {}", e)
        return []

    try:
        req = requests.get(SK_URL, params=payload)
        req.raise_for_status()
        response = req.json()
        events.extend(response["results"])

        while len(events) != int(response["totalcount"]):
            payload["offset"] = str(len(events))
            req = requests.get(SK_URL, params=payload)
            req.raise_for_status()
            events.extend(req.json()["results"])
        return events
    except Exception as e:
        app.logger.error("Fetch error: {}", e)
        return []

def filter_event(event):
    """ @param events: dict, keys of which are listed as values below
        Keys used as new key name for returned dict """
    keys = {
        "artists": "artists",
        "date": "date",
        "description": "description",
        "genres": "genres",
        "id": "id",
        "imageurl": "imageurl",
        "largeimageurl": "largeimageurl",
        "link": "link",
        "price": "entryprice",
        "tickets": "tickets",
        "ticketsAvail": "ticketsAvail",
        "title": "eventname",
        "venue": "venue"
    }
    try:
        filtered_event = {key: event[value] for key, value in keys.iteritems()}
        filtered_event["times"] = {
            "opening": event.get("openingtimes", {}).get("doorsopen"),
            "closing": event.get("openingtimes", {}).get("doorsclose")
        }
        filtered_event["active"] = False
        return filtered_event
    except Exception:
        app.logger.warning("Unable to process event, ignoring: {}".format(event))


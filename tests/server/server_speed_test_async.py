import time
import sys
import random
import requests
from Queue import Queue
from threading import Thread

URL = "https://www.concertspot.co.uk/api/search"

QUERIES = ["Abba", "jazz music", "techno", "cher", "HOUSE MUSIC", "jungle", "congo natty",
           "Punk", "ron trent", "folk music"]
LOCATIONS = [(51.534889, -0.137289), (51.442587, -0.153371), (53.492138, -2.242017), (51.506213, -0.126106),
             (54.607153, -5.928896), (53.809100, -1.549376), (51.485047, -3.180686), (51.464045, -2.589421),
             (52.960806, -1.158990), (55.862262, -4.251978)]
RADII = [i for i in range(1, 10)]
DATES = [("2016-09-30", "2016-10-01"), ("2016-09-30", "2016-10-02"), ("2016-10-01", "2016-10-06"),
         ("2016-09-30", "2016-10-06")]

def make_params():
    location = random.choice(LOCATIONS)
    dates = random.choice(DATES)
    return {
        "query": random.choice(QUERIES),
        "latitude": location[0],
        "longitude": location[1],
        "radius": random.choice(RADII),
        "mindate": dates[0],
        "maxdate": dates[1]
    }

def make_request():
    while True:
        params = q.get()
        start = time.time()
        session = requests.Session()

        response = session.post(URL, json=params)

        while response.status_code == 202:
            time.sleep(0.2)
            response = session.get(URL)

        if response.status_code == 200:
            try:
                events = response.json()["events"]
                print "{} events found".format(len(events))
            except ValueError:
                print "invalid response"
            end = time.time()
            durations.append((end - start) * 100)
            q.task_done()

if __name__ == "__main__":
    concurrent = 10
    durations = []
    q = Queue(concurrent * 2)
    connection_count = 0
    for i in range(concurrent):
        t = Thread(target=make_request)
        t.daemon = True
        t.start()

    try:
        for i in range(concurrent * 10):
            q.put(make_params())
            connection_count += 1
        q.join()
    except Exception:
        sys.exit(1)

    print "Average response time for {} connections: {:.2f}ms".format(connection_count,
                                                sum(durations) / float(len(durations)))

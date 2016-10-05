import time
import random
import requests

URL = "https://www.concertspot.co.uk/api/search"

QUERIES = ["Abba", "jazz music", "techno", "cher", "HOUSE MUSIC", "jungle", "congo natty",
           "Punk", "ron trent", "folk music"]
LOCATIONS = [(51.534889, -0.137289), (51.442587, -0.153371), (53.492138, -2.242017), (51.506213, -0.126106),
             (54.607153, -5.928896), (53.809100, -1.549376), (51.485047, -3.180686), (51.464045, -2.589421),
             (52.960806, -1.158990), (55.862262, -4.251978)]
RADII = [i for i in range(1, 10)]
DATES = [("2016-09-30", "2016-10-01"), ("2016-09-30", "2016-10-02"), ("2016-10-01", "2016-10-06"),
         ("2016-09-30", "2016-10-06")]

def make_request():
    start = time.time()
    session = requests.Session()

    location = random.choice(LOCATIONS)
    dates = random.choice(DATES)
    response = session.post(URL, json={
        "query": random.choice(QUERIES),
        "latitude": location[0],
        "longitude": location[1],
        "radius": random.choice(RADII),
        "mindate": dates[0],
        "maxdate": dates[1]
    })

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
        return (end - start) * 100

if __name__ == "__main__":
    durations = [make_request() for i in range(1000)]
    print "Average response time: {:.2f}ms".format(sum(durations) / float(len(durations)))

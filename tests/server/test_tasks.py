# coding=utf-8
""" Test Celery tasks """

from __future__ import unicode_literals
import unittest
from operator import itemgetter
from mock import patch
from flask_testing import TestCase
from server import app as flask_app
from server import Genre
from server.tasks import get_genres_for_query, fetch_events

@patch("server.events.cache.cache.get")
@patch("server.events.cache.cache.add")
class TestQueryGenresTaskMocked(TestCase):

    data = {
        "genres": ["techno", "jazz"]
    }

    def set_val(self, key, val):
        self.data[key] = val

    def get_val(self, key):
        return self.data[key]

    def get_genres(self, artist_name):
        test_data = {
            "metallica": [Genre(name="pop", weighting=1.0)],
            "roxy music": [Genre(name="pop", weighting=0.5)]
        }
        return test_data.get(artist_name, [])

    def create_app(self):
        return flask_app

    @patch("server.celery_init.Database.get_genres_for_query")
    def test_identify_artist(self, mock_DB, mock_set, mock_get):
        """ Correctly identifies an artist """
        test_data = [Genre(name="pop", weighting=1.0)]
        mock_get.side_effect = self.get_val
        mock_set.side_effect = self.set_val
        mock_DB.side_effect = self.get_genres

        assert get_genres_for_query("metallica") == test_data
        assert self.data["query_genres:metallica"] == test_data

    def test_identify_genre(self, mock_set, mock_get):
        """ Correctly identifies genres """
        test_data = [Genre(name="techno", weighting=1.0)]
        mock_get.side_effect = self.get_val
        mock_set.side_effect = self.set_val

        assert get_genres_for_query("techno") == test_data
        assert self.data["query_genres:techno"] == test_data

    def test_no_result(self, mock_set, mock_get):
        """ Returns an empty list if it doesn"t find anything """
        mock_get.side_effect = self.get_val
        mock_set.side_effect = self.set_val

        assert get_genres_for_query("fdhgdfhdfh") == []
        assert self.data["query_genres:fdhgdfhdfh"] == []

    @patch("server.celery_init.Database.get_genres_for_query")
    def test_artist_with_extra_terms_in_names(self, mock_DB, mock_set, mock_get):
        """ First matches query to artist, even with search terms """
        mock_get.side_effect = self.get_val
        mock_set.side_effect = self.set_val
        mock_DB.side_effect = self.get_genres

        expected_result = [Genre(name="pop", weighting=0.5)]
        assert get_genres_for_query("roxy music") == expected_result
        assert self.data["query_genres:roxy music"] == expected_result

    @patch("server.celery_init.Database.get_genres_for_query")
    def test_artist_with_multiple_extra_terms(self, mock_DB, mock_set, mock_get):
        """ Not expected to parse artist name that contains search termms
            in query with search terms """
        mock_get.side_effect = self.get_val
        mock_set.side_effect = self.set_val
        mock_DB.side_effect = self.get_genres

        expected_result = []
        assert get_genres_for_query("roxy music gigs") == expected_result
        assert self.data["query_genres:roxy music gigs"] == expected_result

    @patch("server.celery_init.Database.get_genres_for_query")
    def test_genre_with_extra_terms(self, mock_DB, mock_set, mock_get):
        """ Matches genres with extra search terms """
        mock_get.side_effect = self.get_val
        mock_set.side_effect = self.set_val
        mock_DB.side_effect = self.get_genres

        expected_result = [Genre(name="jazz", weighting=1.0)]
        assert get_genres_for_query("jazz gigs") == expected_result
        assert self.data["query_genres:jazz gigs"] == expected_result

    def tearDown(self):
        self.data = {}

class TestQueryGenresTask(TestCase):

    def create_app(self):
        return flask_app

    def test_artist_with_real_db(self):
        """ Cache and DB correctly function to return actual values """
        expected_result = [Genre(name="rock", weighting=0.986523),
                           Genre(name="heavy metal", weighting=0.714286),
                           Genre(name="thrash", weighting=0.592992)]
        result = get_genres_for_query("metallica")
        assert result == expected_result

    def test_nonsense_with_real_db(self):
        """ Returns empty list for no results """
        result = get_genres_for_query("dfg89u24")
        self.assertEqual(result, [])

    def test_unicode_with_real_db(self):
        """ Returns results as expected with unicode """
        result = get_genres_for_query(unicode("björk"))
        assert len(result)

    def test_empty_string_with_real_db(self):
        """ Returns empty list """
        result = get_genres_for_query("")
        self.assertEqual(result, [])

    def test_identify_genre_real_db(self):
        """ Correctly identifies genres """
        expected_result = [Genre(name="house", weighting=1.0)]
        result = get_genres_for_query("house")
        assert result == expected_result


@patch("server.events.cache.cache.get")
@patch("server.events.cache.cache.add")
class TestFetchEventsTaskMocked(TestCase):

    data = {}
    mock_cache_id = "events:bd87b5f314"
    request_terms = {
        "query": "house",
        "latitude": 51.534889,
        "longitude": -0.137289,
        "radius": 5,
        "mindate": "2016-10-03",
        "maxdate": "2016-10-05"
    }

    def set_val(self, key, val):
        self.data[key] = val

    def get_events(self, mindate, maxdate, latitude, longitude, radius, *args, **kwargs):
        return test_events

    def get_invalid_events(self, mindate, maxdate, latitude, longitude, radius, *args, **kwargs):
        invalid_events = [{
            "location": "here",
            "message": "this is an invalid event"
        }]
        invalid_events.extend(test_events)
        return invalid_events

    def create_app(self):
        return flask_app

    @patch("server.tasks.fetch")
    def test_adds_to_cache(self, mock_fetch, mock_set, mock_get):
        """ Adds events to the cache """
        mock_fetch.side_effect = self.get_events
        mock_set.side_effect = self.set_val
        fetch_events(self.request_terms)
        assert len(self.data[self.mock_cache_id]) == len(filtered_test_events)

    @patch("server.tasks.fetch")
    def test_filters_events(self, mock_fetch, mock_set, mock_get):
        """ Correctly filters keys on each event """
        mock_fetch.side_effect = self.get_events
        events = sorted(fetch_events(self.request_terms), key=itemgetter("id"))
        test_events = sorted(filtered_test_events, key=itemgetter("id"))

        for i, event in enumerate(events):
            for key, value in event.iteritems():
                assert key in test_events[i]
                assert value == test_events[i][key]

    @patch("server.tasks.fetch")
    def test_invalid_event(self, mock_fetch, mock_set, mock_get):
        """ Correctly filters out an invalid event input """
        mock_fetch.side_effect = self.get_invalid_events
        events = fetch_events(self.request_terms)
        assert len(events) == len(filtered_test_events)

    @patch("server.tasks.fetch")
    def test_all_invalids(self, mock_fetch, mock_set, mock_get):
        """ Returns an empty string if all events are invalid """
        mock_fetch.return_value = {"invalid": "event"}
        events = fetch_events(self.request_terms)
        self.assertEquals(events, [])

    @patch("server.tasks.fetch")
    def test_empty_list(self, mock_fetch, mock_set, mock_get):
        """ Correctly handles empty input """
        mock_fetch.return_value = []
        mock_set.side_effect = self.set_val
        events = fetch_events(self.request_terms)
        self.assertEquals(events, [])
        self.assertEquals(self.data[self.mock_cache_id], [])

    def tearDown(self):
        self.data = {}

if __name__ == "__main__":
    unittest.main()

test_events = [
    {
        u'tickets': True,
        u'entryprice': u'\xa315',
        u'largeimageurl': u'https://d31fr2pwly4c4s.cloudfront.net/8/8/1/881597_0_calibro-35.jpg',
        u'minage': u'18',
        u'description': u"AGMP Presents Calibro 35 + Special Guests live at The Jazz Cafe. Italy's Crime Funk Kings return to London.",
        u'openingtimes': {u'lastentry': u'', u'doorsopen': u'19:00', u'doorsclose': u'23:00'},
        u'imageurl': u'https://d31fr2pwly4c4s.cloudfront.net/8/8/1/881597_0_calibro-35_th.jpg',
        u'venue': {
            u'town': u'London',
            u'name': u'The Jazz Cafe',
            u'longitude': -0.143104,
            u'phone': u'',
            u'postcode': u'NW1 7PG',
            u'address': u'5 Parkway',
            u'latitude': 51.538749,
            u'type': u'Nightclub',
            u'id': 65593
        },
        u'genres': [
            {u'genreid': u'46',
            u'name': u'Alternative'},
            {u'genreid': u'45',
            u'name': u'Funk'},
            {u'genreid': u'76',
            u'name': u'Retro'}
        ],
        u'gateway': False,
        u'eventname': u'Calibro 35',
        u'currency': u'GBP',
        u'going': [{u'image': u'https://graph.facebook.com/10152937909817414/picture?type=square',
        u'userid': u'0',
        u'name': u'Maia Chiara Rossi'},
        {u'image': u'https://graph.facebook.com/10153299216067232/picture?type=square',
        u'userid': u'0',
        u'name': u'Alberto Coco'},
        {u'image': u'https://graph.facebook.com/10153401624419720/picture?type=square',
        u'userid': u'0',
        u'name': u'Mauro Mattei'},
        {u'image': u'https://graph.facebook.com/10153443257263714/picture?type=square',
        u'userid': u'0',
        u'name': u'Il Pavone Errante'},
        {u'image': u'https://graph.facebook.com/10153498597014885/picture?type=square',
        u'userid': u'0',
        u'name': u'Paola Pi Nats'},
        {u'image': u'https://graph.facebook.com/10153545670829524/picture?type=square',
        u'userid': u'0',
        u'name': u'Francesca Thatsall Folks Perricone'},
        {u'image': u'https://graph.facebook.com/10153677063563993/picture?type=square',
        u'userid': u'0',
        u'name': u'Francesco Salamina'},
        {u'image': u'https://graph.facebook.com/10153689813170566/picture?type=square',
        u'userid': u'0',
        u'name': u'Chris Parker'},
        {u'image': u'https://graph.facebook.com/10153694278100130/picture?type=square',
        u'userid': u'0',
        u'name': u'Salva Giank'},
        {u'image': u'https://graph.facebook.com/10153952845542828/picture?type=square',
        u'userid': u'0',
        u'name': u'Davide Takeshi Corradi'}],
        u'link': u'http://www.skiddle.com/whats-on/London/The-Jazz-Cafe/Calibro-35/12798889/',
        u'artists': [{u'artistid': u'123538166',
        u'name': u'Calibro 35',
        u'image': u'https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/6/123538166.jpg'}],
        u'date': u'2016-10-04',
        u'ticketsAvail': None,
        u'id': u'12798889',
        u'imgoing': 0
    },
    {
        u'tickets': True,
        u'entryprice': u'Free',
        u'largeimageurl': u'https://d31fr2pwly4c4s.cloudfront.net/f/e/5/895582_1_pegasus-comedy-reborn.jpg',
        u'minage': u'18',
        u'description': u'Pegasus Comedy Reborn is a free night of stand up comedy in Kentish Town.',
        u'openingtimes': {u'lastentry': u'19:30:00', u'doorsopen': u'19:30', u'doorsclose': u'22:00'},
        u'imageurl': u'https://d31fr2pwly4c4s.cloudfront.net/f/e/5/895582_1_pegasus-comedy-reborn_th.jpg',
        u'venue': {
            u'town': u'London',
            u'name': u'The Rose And Crown (Kentish Town)',
            u'longitude': -0.1329178,
            u'phone': u'',
            u'postcode': u'NW5 2SG',
            u'address': u'71-73 Torriano Avenue',
            u'latitude': 51.5502491,
            u'type': u'live',
            u'id': 66392
        },
        u'genres': [],
        u'gateway': False,
        u'eventname': u'Pegasus Comedy Reborn',
        u'currency': u'GBP',
        u'going': [{u'image': u'https://graph.facebook.com/10101831276609401/picture?type=square',
        u'userid': u'0',
        u'name': u'Davina Bentley'},
        {u'image': u'https://graph.facebook.com/10153879978367644/picture?type=square',
        u'userid': u'0',
        u'name': u'Eleanor Tiernan'},
        {u'image': u'https://graph.facebook.com/10153998744709010/picture?type=square',
        u'userid': u'0',
        u'name': u'Frances Greenfield'},
        {u'image': u'https://graph.facebook.com/10154038496173224/picture?type=square',
        u'userid': u'0',
        u'name': u'Adam Joyce'},
        {u'image': u'https://graph.facebook.com/10154408060096605/picture?type=square',
        u'userid': u'0',
        u'name': u'Chris Clark'},
        {u'image': u'https://graph.facebook.com/10154619819455962/picture?type=square',
        u'userid': u'0',
        u'name': u'Pete Cadden'},
        {u'image': u'https://graph.facebook.com/10157347851015184/picture?type=square',
        u'userid': u'0',
        u'name': u'Richard Wright'},
        {u'image': u'https://graph.facebook.com/10157412293595333/picture?type=square',
        u'userid': u'0',
        u'name': u'Sheraz Yousaf'},
        {u'image': u'https://graph.facebook.com/10157518323335252/picture?type=square',
        u'userid': u'0',
        u'name': u'Charlie Fry'},
        {u'image': u'https://graph.facebook.com/10201028661394452/picture?type=square',
        u'userid': u'0',
        u'name': u'Ashley Haden'}],
        u'link': u'http://www.skiddle.com/whats-on/London/The-Rose-And-Crown-%28Kentish-Town%29/Pegasus-Comedy-Reborn/12831461/',
        u'artists': [],
        u'date': u'2016-10-03',
        u'ticketsAvail': None,
        u'id': u'12831461',
        u'imgoing': 0
    },
        {u'tickets': True,
        u'entryprice': u'\xa36',
        u'largeimageurl': u'https://d31fr2pwly4c4s.cloudfront.net/d/5/1/891102_0_milkshake-ministry-of-sound-freshers-rave.jpg',
        u'minage': u'18',
        u'description': u"London's Biggest Midweek Rave At The World Famous Ministry of Sound.",
        u'openingtimes': {u'lastentry': u'02:00:00', u'doorsopen': u'22:00', u'doorsclose': u'03:00'},
        u'imageurl': u'https://d31fr2pwly4c4s.cloudfront.net/d/5/1/891102_0_milkshake-ministry-of-sound-freshers-rave_th.jpg',
        u'venue': {
            u'town': u'London',
            u'name': u'Ministry Of Sound',
            u'longitude': -0.09981,
            u'phone': u'',
            u'postcode': u'SE1 6DP',
            u'address': u'103 Gaunt Street, Elephant and Castle',
            u'latitude': 51.497583,
            u'type': u'Nightclub',
            u'id': 281
        },
        u'genres': [
            {u'genreid': u'70', u'name': u'Grime'},
            {u'genreid': u'39', u'name': u'Hip Hop'},
            {u'genreid': u'1', u'name': u'House'},
            {u'genreid': u'20', u'name': u'Pop'},
            {u'genreid': u'3', u'name': u'UK Garage'}
        ],
        u'gateway': False,
        u'eventname': u'Milkshake Ministry of Sound Freshers Rave',
        u'currency': u'GBP',
        u'going': [{u'image': u'https://graph.facebook.com/10206160629509606/picture?type=square',
        u'userid': u'1633156',
        u'name': u'georgiawebb3'},
        {u'image': u'https://graph.facebook.com/10152808436482927/picture?type=square',
        u'userid': u'1790552',
        u'name': u'AlishaGadhia'},
        {u'image': u'https://graph.facebook.com/10157408071820231/picture?type=square',
        u'userid': u'1981091',
        u'name': u'ChloeSolomon'},
        {u'image': u'https://graph.facebook.com/1397150890295146/picture?type=square',
        u'userid': u'1991743',
        u'name': u'LukeWestern1'},
        {u'image': u'https://graph.facebook.com/1361814587163661/picture?type=square',
        u'userid': u'1991752',
        u'name': u'GiuseppePietroGava'},
        {u'image': u'https://graph.facebook.com/10202113586758098/picture?type=square',
        u'userid': u'1992212',
        u'name': u'KristianReeson'}],
        u'link': u'http://www.skiddle.com/whats-on/London/Ministry-Of-Sound/Milkshake-Ministry-of-Sound-Freshers-Rave/12821529/',
        u'artists': [],
        u'date': u'2016-10-04',
        u'ticketsAvail': None,
        u'id': u'12821529',
        u'imgoing': 0
    },
    {
        u'tickets': True,
        u'entryprice': u'20',
        u'largeimageurl': u'https://d31fr2pwly4c4s.cloudfront.net/9/3/0/871388_0_joyce.jpg',
        u'minage': u'18',
        u'description': u'AGMP presents Joyce live at Jazz Cafe',
        u'openingtimes': {u'lastentry': u'', u'doorsopen': u'19:00', u'doorsclose': u'21:00'},
        u'imageurl': u'https://d31fr2pwly4c4s.cloudfront.net/9/3/0/871388_0_joyce_th.jpg',
        u'venue': {
            u'town': u'London',
            u'name': u'The Jazz Cafe',
            u'longitude': -0.143104,
            u'phone': u'',
            u'postcode': u'NW1 7PG',
            u'address': u'5 Parkway',
            u'latitude': 51.538749,
            u'type': u'Nightclub',
            u'id': 65593
        },
        u'genres': [
            {u'genreid': u'25', u'name': u'Jazz'},
            {u'genreid': u'20', u'name': u'Pop'}
        ],
        u'gateway': False,
        u'eventname': u'Joyce',
        u'currency': u'GBP',
        u'going': [{u'image': u'https://graph.facebook.com/10152995975939219/picture?type=square',
                    u'userid': u'0', u'name': u'Adam Berwick'},
                   {u'image': u'https://graph.facebook.com/10153299216067232/picture?type=square',
                    u'userid': u'0', u'name': u'Alberto Coco'},
                   {u'image': u'https://graph.facebook.com/10153719565681879/picture?type=square',
                    u'userid': u'0', u'name': u'Nikki Yeoh'},
                   {u'image': u'https://graph.facebook.com/10153970199391314/picture?type=square',
                    u'userid': u'0', u'name': u'Ruben Cordero'},
                   {u'image': u'https://graph.facebook.com/10154163242676743/picture?type=square',
                    u'userid': u'0', u'name': u'Dom Harding'},
                   {u'image': u'https://graph.facebook.com/10155478020855080/picture?type=square',
                    u'userid': u'0', u'name': u'Debora Ipekel'},
                   {u'image': u'https://graph.facebook.com/10155587711640574/picture?type=square',
                    u'userid': u'0', u'name': u'Oliver Low'},
                   {u'image': u'https://graph.facebook.com/10210072596229835/picture?type=square',
                    u'userid': u'0', u'name': u'Adrian Gibson'},
                   {u'image': u'https://graph.facebook.com/1717921481790644/picture?type=square',
                    u'userid': u'0', u'name': u'Frank Himmelreich'},
                   {u'image': u'https://graph.facebook.com/1743625085878781/picture?type=square',
                    u'userid': u'0', u'name': u'Malinnga Mandinka Tejan-Sie III'}
                  ],
        u'link': u'http://www.skiddle.com/whats-on/London/The-Jazz-Cafe/Joyce/12779436/',
        u'artists': [],
        u'date': u'2016-10-03',
        u'ticketsAvail': None,
        u'id': u'12779436',
        u'imgoing': 0
    },
    {
        u'tickets': True,
        u'entryprice': u'\xa35 Advance/\xa37 OTD ',
        u'largeimageurl': u'https://d31fr2pwly4c4s.cloudfront.net/a/b/6/886058_0_ignite-.jpg',
        u'minage': u'18',
        u'description': u'IGNITE the brand NEW Drum and Bass LDN #student event!\r\nLaunches 05.10.2016 at our new home, Phonox!',
        u'openingtimes': {u'lastentry': u'', u'doorsopen': u'22:00', u'doorsclose': u'03:00'},
        u'imageurl': u'https://d31fr2pwly4c4s.cloudfront.net/a/b/6/886058_0_ignite-_th.jpg',
        u'venue': {
            u'town': u'London',
            u'name': u'Phonox',
            u'longitude': -0.1147263,
            u'phone': u'',
            u'postcode': u'SW9 7AY',
            u'address': u'418 Brixton Road',
            u'latitude': 51.4644481,
            u'type': u'Nightclub',
            u'id': 65847
        },
        u'genres': [
            {u'genreid': u'78', u'name': u'Bass Music'},
            {u'genreid': u'8', u'name': u'Drum n Bass'},
            {u'genreid': u'80', u'name': u'Jungle'}
        ],
        u'gateway': False,
        u'eventname': u'IGNITE ',
        u'currency': u'GBP',
        u'going': [{u'image': u'https://graph.facebook.com/549810705/picture?type=square',
        u'userid': u'382590',
        u'name': u'Paul-MichaelDaley'},
        {u'image': u'http://graph.facebook.com/1597136907/picture?type=square',
        u'userid': u'621522',
        u'name': u'MersenHowes'},
        {u'image': u'https://graph.facebook.com/10152015457476417/picture?type=square',
        u'userid': u'1502159',
        u'name': u'NickilDhokia1'},
        {u'image': u'http://graph.facebook.com/10154103517932985/picture?type=square',
        u'userid': u'1688313',
        u'name': u'ValmirCaires'},
        {u'image': u'http://graph.facebook.com/10153023750712945/picture?type=square',
        u'userid': u'1860213',
        u'name': u'MarinaMichael'}],
        u'link': u'http://www.skiddle.com/whats-on/London/Phonox/IGNITE-/12809786/',
        u'artists': [],
        u'date': u'2016-10-05',
        u'ticketsAvail': None,
        u'id': u'12809786',
        u'imgoing': 0
    }
]

filtered_test_events = [
    {
        u'tickets': True,
        u'price': u'\xa315',
        u'largeimageurl': u'https://d31fr2pwly4c4s.cloudfront.net/8/8/1/881597_0_calibro-35.jpg',
        u'description': u"AGMP Presents Calibro 35 + Special Guests live at The Jazz Cafe. Italy's Crime Funk Kings return to London.",
        'times': {
            u'opening': u'19:00',
            u'closing': u'23:00'
        },
        u'imageurl': u'https://d31fr2pwly4c4s.cloudfront.net/8/8/1/881597_0_calibro-35_th.jpg',
        u'venue': {
            u'town': u'London',
            u'name': u'The Jazz Cafe',
            u'longitude': -0.143104,
            u'phone': u'',
            u'postcode': u'NW1 7PG',
            u'address': u'5 Parkway',
            u'latitude': 51.538749,
            u'type': u'Nightclub',
            u'id': 65593
        },
        u'genres': [
            {u'genreid': u'46', u'name': u'Alternative'},
            {u'genreid': u'45', u'name': u'Funk'},
            {u'genreid': u'76', u'name': u'Retro'}
        ],
        u'title': u'Calibro 35',
        u'link': u'http://www.skiddle.com/whats-on/London/The-Jazz-Cafe/Calibro-35/12798889/',
        u'artists': [{u'artistid': u'123538166', u'name': u'Calibro 35', u'image': u'https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/6/123538166.jpg'}],
        u'date': u'2016-10-04',
        u'ticketsAvail': None,
        u'id': u'12798889',
        "active": False
    },
    {
        u'tickets': True,
        u'price': u'Free',
        u'largeimageurl': u'https://d31fr2pwly4c4s.cloudfront.net/f/e/5/895582_1_pegasus-comedy-reborn.jpg',
        u'description': u'Pegasus Comedy Reborn is a free night of stand up comedy in Kentish Town.',
        'times': {
            u'opening': u'19:30',
            u'closing': u'22:00'
        },
        u'imageurl': u'https://d31fr2pwly4c4s.cloudfront.net/f/e/5/895582_1_pegasus-comedy-reborn_th.jpg',
        u'venue': {
            u'town': u'London',
            u'name': u'The Rose And Crown (Kentish Town)',
            u'longitude': -0.1329178,
            u'phone': u'',
            u'postcode': u'NW5 2SG',
            u'address': u'71-73 Torriano Avenue',
            u'latitude': 51.5502491,
            u'type': u'live',
            u'id': 66392
        },
        u'genres': [],
        u'title': u'Pegasus Comedy Reborn',
        u'link': u'http://www.skiddle.com/whats-on/London/The-Rose-And-Crown-%28Kentish-Town%29/Pegasus-Comedy-Reborn/12831461/',
        u'artists': [],
        u'date': u'2016-10-03',
        u'ticketsAvail': None,
        u'id': u'12831461',
        "active": False
    },
    {
        u'tickets': True,
        u'price': u'\xa36',
        u'largeimageurl': u'https://d31fr2pwly4c4s.cloudfront.net/d/5/1/891102_0_milkshake-ministry-of-sound-freshers-rave.jpg',
        u'description': u"London's Biggest Midweek Rave At The World Famous Ministry of Sound.",
        'times': {
            u'opening': u'22:00',
            u'closing': u'03:00'
        },
        u'imageurl': u'https://d31fr2pwly4c4s.cloudfront.net/d/5/1/891102_0_milkshake-ministry-of-sound-freshers-rave_th.jpg',
        u'venue': {
            u'town': u'London',
            u'name': u'Ministry Of Sound',
            u'longitude': -0.09981,
            u'phone': u'',
            u'postcode': u'SE1 6DP',
            u'address': u'103 Gaunt Street, Elephant and Castle',
            u'latitude': 51.497583,
            u'type': u'Nightclub',
            u'id': 281
        },
        u'genres': [
            {u'genreid': u'70', u'name': u'Grime'},
            {u'genreid': u'39', u'name': u'Hip Hop'},
            {u'genreid': u'1', u'name': u'House'},
            {u'genreid': u'20', u'name': u'Pop'},
            {u'genreid': u'3', u'name': u'UK Garage'}
        ],
        u'title': u'Milkshake Ministry of Sound Freshers Rave',
        u'link': u'http://www.skiddle.com/whats-on/London/Ministry-Of-Sound/Milkshake-Ministry-of-Sound-Freshers-Rave/12821529/',
        u'artists': [],
        u'date': u'2016-10-04',
        u'ticketsAvail': None,
        u'id': u'12821529',
        "active": False
    },
    {
        u'tickets': True,
        u'price': u'20',
        u'largeimageurl': u'https://d31fr2pwly4c4s.cloudfront.net/9/3/0/871388_0_joyce.jpg',
        u'description': u'AGMP presents Joyce live at Jazz Cafe',
        'times': {
            u'opening': u'19:00',
            u'closing': u'21:00'
        },
        u'imageurl': u'https://d31fr2pwly4c4s.cloudfront.net/9/3/0/871388_0_joyce_th.jpg',
        u'venue': {
            u'town': u'London',
            u'name': u'The Jazz Cafe',
            u'longitude': -0.143104,
            u'phone': u'',
            u'postcode': u'NW1 7PG',
            u'address': u'5 Parkway',
            u'latitude': 51.538749,
            u'type': u'Nightclub',
            u'id': 65593
        },
        u'genres': [
            {u'genreid': u'25', u'name': u'Jazz'},
            {u'genreid': u'20', u'name': u'Pop'}
        ],
        u'title': u'Joyce',
        u'link': u'http://www.skiddle.com/whats-on/London/The-Jazz-Cafe/Joyce/12779436/',
        u'artists': [],
        u'date': u'2016-10-03',
        u'ticketsAvail': None,
        u'id': u'12779436',
        "active": False
    },
    {
        u'tickets': True,
        u'price': u'\xa35 Advance/\xa37 OTD ',
        u'largeimageurl': u'https://d31fr2pwly4c4s.cloudfront.net/a/b/6/886058_0_ignite-.jpg',
        u'description': u'IGNITE the brand NEW Drum and Bass LDN #student event!\r\nLaunches 05.10.2016 at our new home, Phonox!',
        'times': {
            u'opening': u'22:00',
            u'closing': u'03:00'
        },
        u'imageurl': u'https://d31fr2pwly4c4s.cloudfront.net/a/b/6/886058_0_ignite-_th.jpg',
        u'venue': {
            u'town': u'London',
            u'name': u'Phonox',
            u'longitude': -0.1147263,
            u'phone': u'',
            u'postcode': u'SW9 7AY',
            u'address': u'418 Brixton Road',
            u'latitude': 51.4644481,
            u'type': u'Nightclub',
            u'id': 65847
        },
        u'genres': [
            {u'genreid': u'78', u'name': u'Bass Music'},
            {u'genreid': u'8', u'name': u'Drum n Bass'},
            {u'genreid': u'80', u'name': u'Jungle'}
        ],
        u'title': u'IGNITE ',
        u'link': u'http://www.skiddle.com/whats-on/London/Phonox/IGNITE-/12809786/',
        u'artists': [],
        u'date': u'2016-10-05',
        u'ticketsAvail': None,
        u'id': u'12809786',
        "active": False
    }
]

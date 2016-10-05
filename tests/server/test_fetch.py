""" Test fetching of events """

from __future__ import unicode_literals
import unittest
from datetime import date, timedelta
from flask_testing import TestCase
from server import app as flask_app
from server.events.events import fetch

terms = {
    "latitude": 51.534889,
    "longitude": -0.137289,
    "radius": 5,
    "mindate": date.today(),
    "maxdate": date.today() + timedelta(3)
}

class TestFetch(TestCase):

    def setUp(self):
        self.terms = terms.copy()

    def create_app(self):
        return flask_app

    def test_valid_input(self):
        """ Returns a non-empty list for valid queries """
        results = fetch(**self.terms)
        assert len(results)

    def test_invalid_input(self):
        """ Returns an empty list for invalid input """
        self.terms["radius"] = "dfgfrdfg"
        results = fetch(**self.terms)
        self.assertEquals(results, [])

if __name__ == "__main__":
    unittest.main()
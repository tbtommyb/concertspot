""" Test validation of user input """

from __future__ import unicode_literals
import unittest
from datetime import date, timedelta
from voluptuous import MultipleInvalid
from flask_testing import TestCase
from server import app as flask_app
from server.validate import validate

terms = {
    "query": "house",
    "latitude": 51.534889,
    "longitude": -0.137289,
    "radius": 5,
    "mindate": date.today().strftime("%Y-%m-%d"),
    "maxdate": (date.today() + timedelta(3)).strftime("%Y-%m-%d")
}

class TestInputValidation(TestCase):

    def setUp(self):
        self.terms = terms.copy()

    def create_app(self):
        return flask_app

    def test_valid_terms(self):
        validate(self.terms)

    def test_no_query(self):
        """ Should raise exception without query """
        del self.terms["query"]
        with self.assertRaises(Exception):
            validate(self.terms)

    def test_empty_query(self):
        """ Should not allow an empty query string """
        self.terms["query"] = ""
        with self.assertRaises(MultipleInvalid):
            validate(self.terms)

    def test_query_spaces(self):
        """ Should not queries made of spaces """
        self.terms["query"] = "         "
        with self.assertRaises(MultipleInvalid):
            validate(self.terms)

    def test_number_query(self):
        """ Should not allow numbers through """
        self.terms["query"] = 23455
        with self.assertRaises(MultipleInvalid):
            validate(self.terms)

    def test_none_query(self):
        """ Should not allow None through """
        self.terms["query"] = None
        with self.assertRaises(MultipleInvalid):
            validate(self.terms)

    def test_unicode_query(self):
        """ Should allow unicode queries """
        self.terms["query"] = unicode("hello")
        validate(self.terms)

    def test_query_formatting(self):
        """ Should lowercase and strip query string """
        self.terms["query"] = "  tesTING    "
        assert validate(self.terms)["query"] == "testing"

    def test_string_latlng(self):
        """ Should  allow a string value """
        self.terms["latitude"] = "35.24"
        validate(self.terms)

    def test_latlng_bounds(self):
        """ Should catch out of bounds lat and lng """
        self.terms["longitude"] = 240.3
        with self.assertRaises(MultipleInvalid):
            validate(self.terms)

    def test_valid_date(self):
        """ Should not allow date object """
        self.terms["mindate"] = date(2016, 10, 05)
        with self.assertRaises(MultipleInvalid):
            validate(self.terms)

    def test_date_string(self):
        """ Should catch invalid date strings """
        self.terms["mindate"] = "2016-13-10"
        with self.assertRaises(MultipleInvalid):
            validate(self.terms)

    def test_today(self):
        """ Should allow today as date string """
        self.terms["mindate"] = date.today().strftime("%Y-%m-%d")
        validate(self.terms)

    def test_yesterday(self):
        """ Should not allow yesterday as date string """
        self.terms["mindate"] = (date.today() - timedelta(1)).strftime("%Y-%m-%d")
        with self.assertRaises(MultipleInvalid):
            validate(self.terms)

    def test_negative_radius(self):
        """ Should not allow negative radius """
        self.terms["radius"] = -5
        with self.assertRaises(MultipleInvalid):
            validate(self.terms)

    def test_zero_radius(self):
        """ Should not allow zero radius """
        self.terms["radius"] = "0"
        with self.assertRaises(MultipleInvalid):
            validate(self.terms)


if __name__ == "__main__":
    unittest.main()

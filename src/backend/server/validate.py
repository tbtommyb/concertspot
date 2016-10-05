""" Check that POSTed JSON is valid """

from __future__ import unicode_literals
from datetime import datetime, date
from voluptuous import Schema, Required, Length, All, Range, Any, Coerce, Invalid

def DateFormatter(value):
    """ Defines valid date format """
    try:
        input_date = datetime.strptime(value, "%Y-%m-%d").date()
    except Exception:
        raise Invalid("Not a valid date string")
    if input_date < date.today():
        raise Invalid("Date cannot be before today")
    return input_date

def QueryFormatter(value):
    try:
        input_query = value.lower().strip()
    except AttributeError:
        raise Invalid("Query is not a string.")
    if len(input_query) < 1:
        raise Invalid("Query length must be greater than one.")
    return input_query

def validate(request_terms):
    """ Validate input and returns query in stripped lowercase for use elsewhere.
        validator raises exception (caught in route) if any inputs are invalid """

    schema = Schema({
        Required("query"): QueryFormatter,
        Required("latitude"): All(Coerce(float), Range(min=-90.0, max=90.0)),
        Required("longitude"): All(Coerce(float), Range(min=-180.0, max=180.0)),
        Required("radius"): All(Coerce(float), Range(min=1.0, max=9.0)),
        Required("mindate"): DateFormatter,
        Required("maxdate"): DateFormatter
    })

    return schema(request_terms)

""" Generate JSON file of genres per artist from XML input """

import sys
import time
import json
import gzip
from collections import defaultdict
from xml_processor import XMLProcessor

class GenreProcessor(XMLProcessor):
    """ Extract genre information from XML input """
    def __init__(self, input_file, output_file):
        super(GenreProcessor, self).__init__(input_file, output_file)
        self.data = {}

    def add_genre(self, artist_id, genre):
        if genre.text:
            self.data[artist_id]["genre"][genre.text.lower()] += 1

    def process(self, elem):
        """ Build list of genres for each artist """
        for artist in elem.iter("artist"):
            artist_id = str(artist.find("id").text)
            if artist_id not in self.data:
                self.data[artist_id] = {
                    "genre": defaultdict(int),
                    "count": 0
                }
            for genre in elem.iter("genre"):
                self.add_genre(artist_id, genre)
            for style in elem.iter("style"):
                self.add_genre(artist_id, style)
            self.data[artist_id]["count"] += 1

    def write_output(self, *args, **kwargs):
        """ Dump JSON to output file specified """
        output = {
            "artists": []
        }
        for artist in self.data.iteritems():
            output["artists"].append({
                "id": artist[0],
                "genres": [{"name": genre[:79], "weighting": count/float(artist[1]["count"])}
                           for genre, count in artist[1]["genre"].iteritems() if genre if count]
            })
        output_file = open(self.output_file, "w")
        json.dump(output, output_file, **kwargs)

def run_processor(input_file, output_file):
    """ Initiate processing """
    print "Processing genres..."
    start = time.clock()

    with gzip.open(input_file) as uncompressed_input:
        processor = GenreProcessor(uncompressed_input, output_file)
        processor.create_context("master")
        processor.iterate()
        processor.write_output(sort_keys=True, indent=4, separators=(",", ": "))

    end = time.clock()
    print "Took {} seconds".format((end - start) * 100)

if __name__ == "__main__":
    run_processor(sys.argv[1], sys.argv[2])

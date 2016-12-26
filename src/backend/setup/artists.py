""" Generate JSON file of artists from XML input """

import sys
import json
import time
import gzip
from xml_processor import XMLProcessor

class ArtistProcessor(XMLProcessor):
    """ Extract artist information from XML input """
    def __init__(self, input_file, output_file):
        super(ArtistProcessor, self).__init__(input_file, output_file)
        self.data = {
            "artists": []
        }

    def process(self, elem):
        """ Pull out ID, name and description data """
        artist = {}
        artist["id"] = str(elem.find("id").text)
        artist["name"] = (elem.find("name").text or "")[:79]
        if artist["name"]:
            self.data["artists"].append(artist)

    def write_output(self, *args, **kwargs):
        """ Dump JSON to file specified """
        output = open(self.output_file, "w")
        json.dump(self.data, output, **kwargs)

def run_processor(input_file, output_file):
    """ Initiate processing """
    print "Processing artists..."
    start = time.clock()

    with gzip.open(input_file) as uncompressed_input:
        processor = ArtistProcessor(uncompressed_input, output_file)
        processor.create_context("artist")
        processor.iterate()
        processor.write_output(sort_keys=True, indent=4, separators=(",", ": "))

    end = time.clock()
    print "Took {} seconds".format((end - start) * 100)

if __name__ == "__main__":
    run_processor(sys.argv[1], sys.argv[2])

""" Generate XML processor. Implement process method """

import time
from lxml import etree

class XMLProcessor(object):
    """ Process input XML into output """
    def __init__(self, input_file, output_file):
        self.input_file = input_file
        self.output_file = output_file

    def create_context(self, tag):
        """ Create context for iterate method. Must be called before iterate """
        self.context = etree.iterparse(self.input_file, tag=tag)

    def iterate(self, *args, **kwargs):
        """ Iterate through XML tree, calling process method for each element """
        if not self.context:
            raise Exception("No context created. Run create_context() first")
        for _, elem in self.context:
            self.process(elem, *args, **kwargs)
            elem.clear()
            for ancestor in elem.xpath('ancestor-or-self::*'):
                while ancestor.getprevious() is not None:
                    del ancestor.getparent()[0]
        del self.context

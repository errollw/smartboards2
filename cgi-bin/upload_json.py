#!/usr/bin/env python

import xml.etree.ElementTree as ET
import json
import cgi
import os
import time

from utils import simple_success_response_JSON

args =      cgi.FieldStorage()
json_data = args['json_data'].value
r_id =      args['r_id'].value


### Write out that user's new SVG data
### -------------------------------------------------------------

json_path = os.path.join('..', 'content', r_id + '.json')
f = open(json_path,"w+")
f.write(json_data)
f.close()


### -------------------------------------------------------------

simple_success_response_JSON()
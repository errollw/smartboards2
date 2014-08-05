#!/usr/bin/env python

import json
import cgi
import os

from utils import simple_success_response_JSON, simple_failure_response_JSON

args =        cgi.FieldStorage()


json_path = os.path.join('..', 'content', 'starredImages', 'starredImages.json')

try:
    json_data = json.loads(args['starredImages'].value)
    with open(json_path, 'w+') as f:
        json.dump(json_data, f, indent=4, separators=(',', ': '))
        simple_success_response_JSON()
except ValueError:
    # Invalid JSON or error writing to file
    simple_failure_response_JSON()
    
#!/usr/bin/env python

import json
import cgi
import os

from utils import simple_success_response_JSON
from render_rooms import render_room_if_stale

args =      cgi.FieldStorage()
json_data = args['json_data'].value
r_id =      args['r_id'].value


### write out that user's new SVG data
### -------------------------------------------------------------

json_path = os.path.join('..', 'content', r_id + '.json')
f = open(json_path,"w+")
f.write(json_data)
f.close()

### potentially render the room to a png if it's stale
### -------------------------------------------------------------

render_room_if_stale(r_id)

### -------------------------------------------------------------

simple_success_response_JSON()
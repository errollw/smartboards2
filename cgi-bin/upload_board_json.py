#!/usr/bin/env python

import json
import cgi
import os

from utils import simple_success_response_JSON, simple_failure_response_JSON, test_if_room
from render_rooms import render_room_if_stale

args =        cgi.FieldStorage()
json_string = args['json_data'].value
r_id =        args['r_id'].value
ver = 		  int(args['ver'].value)

json_data = json.loads(json_string)

### Verify r_id is a valid room id
if not test_if_room(r_id):
	simple_failure_response_JSON()
	exit(1)

# write in content json data version number
json_data.append(ver)

# write out that user's new board conent data
json_path = os.path.join('..', 'content', r_id + '.json')
with open(json_path, 'w+') as f:
  json.dump(json_data, f, indent=4, separators=(',', ': '))


### potentially render the room to a png if it's stale
### -------------------------------------------------------------

render_room_if_stale(r_id)


### -------------------------------------------------------------

simple_success_response_JSON()
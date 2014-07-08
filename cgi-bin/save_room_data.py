#!/usr/bin/env python

import json
import cgi
import os

from utils import simple_success_response_JSON, simple_failure_response_JSON, test_if_room

args =        cgi.FieldStorage()
json_string = args['json_data'].value
r_id =        args['r_id'].value

json_data = json.loads(json_string)

### Verify r_id is a valid room id
if not test_if_room(r_id):
	simple_failure_response_JSON()
	exit(1)

### Write out the room's data
### -------------------------------------------------------------

json_path = os.path.join('..', 'content', 'room_data_' + r_id + '.json')
with open(json_path, 'w+') as f:
  json.dump(json_data, f, indent=4, separators=(',', ': '))


### -------------------------------------------------------------

simple_success_response_JSON()
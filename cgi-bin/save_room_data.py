#!/usr/bin/env python

import json
import cgi
import os

from utils import simple_success_response_JSON

args =        cgi.FieldStorage()
json_string = args['json_data'].value
r_id =        args['r_id'].value

json_data = json.loads(json_string)

### Write out the room's data
### -------------------------------------------------------------

json_path = os.path.join('..', 'content', 'room_data_' + r_id + '.json')
with open(json_path, 'w+') as f:
  json.dump(json_data, f, indent=4, separators=(',', ': '))


### -------------------------------------------------------------

simple_success_response_JSON()
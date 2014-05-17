#!/usr/bin/env python

import json
import cgi
import os

from utils import simple_success_response_JSON

args =      cgi.FieldStorage()
# json_data = args['json_data'].value
# r_id =      args['r_id'].value

r_id = 'r_SS20';
json_data = {};
json_data['user'] = 'Erroll Wood'
json_data['name'] = 'Erroll Wood'
json_data['description'] = 'PhD student, master of netboards'


### Write out the room's data
### -------------------------------------------------------------

json_path = os.path.join('..', 'content', 'room_data_' + r_id + '.json')
with open(json_path, 'w+') as f:
  json.dump(json_data, f)


### -------------------------------------------------------------

simple_success_response_JSON()
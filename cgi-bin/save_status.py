#!/usr/bin/env python

import json
import cgi
import os

from utils import simple_success_response_JSON, simple_failure_response_JSON, test_if_room

args =        cgi.FieldStorage()
json_string = args['json_data'].value
r_id =        args['r_id'].value

new_status_data = json.loads(json_string)

### Verify r_id is a valid room id
if not test_if_room(r_id):
	simple_failure_response_JSON()
	exit(1)

### -------------------------------------------------------------

json_path = os.path.join('..', 'content', 'room_data_' + r_id + '.json')
json_file_str=open(json_path)
json_file_data = json.load(json_file_str)


for u_new in new_status_data['users']:
	for u_old in json_file_data['users']:
		if u_new['u_id'] == u_old['u_id']:
			u_old.update(u_new)


with open(json_path, 'w+') as f:
  json.dump(json_file_data, f, indent=4, separators=(',', ': '))


### -------------------------------------------------------------

simple_success_response_JSON()

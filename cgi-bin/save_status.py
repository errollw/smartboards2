#!/usr/bin/env python

import json
import cgi
import os

from utils import simple_success_response_JSON

args =        cgi.FieldStorage()
json_string = args['json_data'].value
r_id =        args['r_id'].value

new_status_data = json.loads(json_string)

### Write out the room's data
### -------------------------------------------------------------

json_path = os.path.join('..', 'content', 'room_data_' + r_id + '.json')
json_file_str=open(json_path)
json_file_data = json.load(json_file_str)

# print json_file_data

for u_new in new_status_data['users']:

	for u_old in json_file_data['users']:

		if u_new['u_id'] == u_old['u_id']:

			u_old.update(u_new)
			# u_old['status'] = u_new['status']
			# u_old['status_last_mod'] = u_new['status_last_mod']
			# u_old['status_expiry'] = u_new['status_expiry']

# print json_file_data

with open(json_path, 'w+') as f:
  json.dump(json_file_data, f, indent=4, separators=(',', ': '))

# print json_file_data


# with open(json_path, 'w+') as f:
#   json.dump(json_data, f, indent=4, separators=(',', ': '))


### -------------------------------------------------------------

simple_success_response_JSON()

# result = {}
# result['success'] = True
# result['json_file_data'] = str(json_file_data)

# print "Content-type: application/json"
# print
# print json.dumps(result,indent=1)
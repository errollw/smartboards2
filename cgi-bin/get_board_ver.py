#!/usr/bin/env python

import json
import cgi
import os

from utils import simple_success_response_JSON, simple_failure_response_JSON, test_if_room

args = cgi.FieldStorage()

if not ("r_id" in args):
	simple_failure_response_JSON()
	exit(1)

r_id = args['r_id'].value

### Verify r_id is a valid room id
if not test_if_room(r_id):
	simple_failure_response_JSON()
	exit(1)


### Get board conent version number
### -------------------------------------------------------------

json_path = os.path.join('..', 'content', r_id + '.json')
json_file_str = open(json_path)
json_file_data = json.load(json_file_str)

ver = 0
if len(json_file_data)>1:
	ver = int(json_file_data[-1])


### Return the file version number to the client
### -------------------------------------------------------------

result = {}
result['success'] = True
result['ver'] = ver

print "Content-type: application/json"
print
print json.dumps(result,indent=1)
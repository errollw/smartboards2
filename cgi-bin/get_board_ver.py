#!/usr/bin/env python

import json
import cgi
import os

from utils import simple_success_response_JSON

args = cgi.FieldStorage()
r_id = args['r_id'].value


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
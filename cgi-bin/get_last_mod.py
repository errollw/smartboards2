#!/usr/bin/env python

import json
import cgi
import os
from utils import simple_failure_response_JSON, test_if_room

args = cgi.FieldStorage()
r_id = args['r_id'].value

### Verify r_id is a valid room id
if not test_if_room(r_id):
	simple_failure_response_JSON()
	exit(1)

### Get last modified Epoch timestamp (s) for that room's json data
### -------------------------------------------------------------

json_path = os.path.join('..', 'content', r_id + '.json')
lastmod = int(os.path.getmtime(json_path))


### Return the lastmod time to the client
### -------------------------------------------------------------

result = {}
result['success'] = True
result['lastmod'] = lastmod

print "Content-type: application/json"
print
print json.dumps(result,indent=1)
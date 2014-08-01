#!/usr/bin/env python

import json
import cgi
import os

from utils import simple_success_response_JSON, simple_failure_response_JSON, test_if_room

args = cgi.FieldStorage()

if not ("r_id" in args):
    images = [f for f in os.listdir('../content/archive') if (f.endswith('.jpg'))]
    r_id = ""
else:
    r_id = args['r_id'].value

    ### Verify r_id is a valid room id
    if not test_if_room(r_id):
        simple_failure_response_JSON()
        exit(1)


    ### Get an array of file names matching the room id
    images = [f for f in os.listdir('../content/archive') if (f.endswith(r_id + '.jpg'))]



### Return the file version number to the client
### -------------------------------------------------------------

result = {}
result['success'] = True
result['r_id'] = r_id
result['images'] = images

print "Content-type: application/json"
print
print json.dumps(result,indent=1)
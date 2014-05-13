#!/usr/bin/env python

import json
import cgi
import os

args =      cgi.FieldStorage()
r_id =      args['r_id'].value


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
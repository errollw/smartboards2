#!/usr/bin/env python

import json
import cgi
import os
import re

from utils import simple_success_response_JSON, simple_failure_response_JSON, test_if_room

args =     cgi.FieldStorage()
img_data = args['imgBase64'].value
r_id =     args['r_id'].value

### Verify r_id is a valid room id
if not test_if_room(r_id):
	simple_failure_response_JSON()
	exit(1)

### Write out that room's canvas to a .png
### -------------------------------------------------------------

imgstr = re.search(r'base64,(.*)', img_data).group(1)

img_path = os.path.join('..', 'content', r_id + '.png')
output = open(img_path, 'wb')
output.write(imgstr.decode('base64'))
output.close()

### -------------------------------------------------------------

simple_success_response_JSON()
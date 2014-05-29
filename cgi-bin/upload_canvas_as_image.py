#!/usr/bin/env python

import json
import cgi
import os
import re

from utils import simple_success_response_JSON

args =     cgi.FieldStorage()
img_data = args['imgBase64'].value
r_id =     args['r_id'].value


### Write out that room's canvas to a .png
### -------------------------------------------------------------

imgstr = re.search(r'base64,(.*)', img_data).group(1)

img_path = os.path.join('..', 'content', r_id + '.png')
output = open(img_path, 'wb')
output.write(imgstr.decode('base64'))
output.close()

### -------------------------------------------------------------

simple_success_response_JSON()
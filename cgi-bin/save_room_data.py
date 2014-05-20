#!/usr/bin/env python

import json
import cgi
import os

from utils import simple_success_response_JSON

args =      cgi.FieldStorage()
# json_data = args['json_data'].value
# r_id =      args['r_id'].value

r_id = 'r_SS22';
json_data = {};
users = [];

user_erroll = {};
user_erroll['u_id'] = 'u_ls426'
user_erroll['name'] = 'Lech Swirski'
user_erroll['description'] = 'PhD student, tracks gaze'
user_erroll['img_src'] = 'https://avatars3.githubusercontent.com/u/593597?s=460.jpg'

users.append(user_erroll)

json_data['users'] = users;

### Write out the room's data
### -------------------------------------------------------------

json_path = os.path.join('..', 'content', 'room_data_' + r_id + '.json')
with open(json_path, 'w+') as f:
  json.dump(json_data, f, indent=4, separators=(',', ': '))


### -------------------------------------------------------------

simple_success_response_JSON()
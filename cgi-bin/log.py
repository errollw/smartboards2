#!/usr/bin/env python


import json, cgi, os, time, csv, re
from utils import simple_success_response_JSON, simple_failure_response_JSON, test_if_room

args = cgi.FieldStorage()

### Check that all fields are set and valid
valid = True

## Check all variables are here
if "REMOTE_ADDR" not in os.environ or "HTTP_USER_AGENT" not in os.environ or "interaction" not in args or "r_id" not in args:
  valid = False
## Validate interaction
if "interaction" in args and re.match("^[a-z]+$", args["interaction"].value):
  interaction = args["interaction"].value
else:
  valid = False
## Validate data if provided, else set a default of empty string
if "data" in args:
  if re.match("^[\\w,=; ]*$", args["data"].value):
    extraData = args["data"].value
  else:
    valid = False
else:
  extraData = ""
if "r_id" in args and not test_if_room(args["r_id"].value):
  valid = False

if valid != True:
  simple_failure_response_JSON()
  exit(1)


formattedTime = time.strftime("%Y-%m-%d %H:%M:%S")
ip =  os.environ["REMOTE_ADDR"]
ua = os.environ["HTTP_USER_AGENT"]
room = args["r_id"].value

## Make sure UA isn't too long and there are no special characters
maxUAlen = 200
ua = re.sub("\\s", " ", ua)
if (len(ua) > maxUAlen):
  ua = ua[0:maxUAlen]

logfile = "log.csv"

with open(logfile, "ab") as fp:
  a = csv.writer(fp, dialect="excel")
  data = [ [formattedTime, ip, ua, room, interaction, extraData] ]
  a.writerows(data)

simple_success_response_JSON()
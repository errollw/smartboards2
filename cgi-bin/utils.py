#!/usr/bin/env python

import json, re

def indent(elem, level=0):
    i = "\n" + level*"  "
    if len(elem):
        if not elem.text or not elem.text.strip():
            elem.text = i + "  "
        if not elem.tail or not elem.tail.strip():
            elem.tail = i
        for elem in elem:
            indent(elem, level+1)
        if not elem.tail or not elem.tail.strip():
            elem.tail = i
    else:
        if level and (not elem.tail or not elem.tail.strip()):
            elem.tail = i

def simple_success_response_JSON():
    result = {}
    result['success'] = True

    print "Content-type: application/json"
    print
    print json.dumps(result,indent=1)

def simple_failure_response_JSON():
    result = {}
    result['success'] = False

    print "Content-type: application/json"
    print
    print json.dumps(result,indent=1)

def test_if_room(room):
	return re.match('^r_[gfs][neswc][0-9]{2}$',room);
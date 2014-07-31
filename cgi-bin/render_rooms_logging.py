#!/usr/bin/env python

import os, re, subprocess, time, stat, datetime
from PIL import Image

# the directory to store pngs / json in
content_dir = os.path.join('..', 'content');
archive_dir = os.path.join('..', 'content', 'archive');


# what it does as a script
if __name__ == "__main__":

    # get files which match format of room data: room_data_[r_id].json
    fs = [f for f in os.listdir(content_dir) if (f.startswith('room_data'))]

    # extract room_ids
    pattern = 'room_data_(.+)\.json'
    room_ids = [re.search(pattern, f).group(1).lower() for f in fs]

    # call phantomjs
    subprocess_arr = [os.path.join(os.getcwd(), "phantomjs"), "--ignore-ssl-errors=true", "render_netboard.js"] + room_ids
    print "Starting subprocess: " + " ".join(subprocess_arr)
    subprocess.call(subprocess_arr, shell=(os.name == "nt"))
	
    dateTimeStr = datetime.datetime.now().isoformat()
    dateTimeStr = dateTimeStr.replace(":", "-")
    
	# resize the images
    pngs = [f for f in os.listdir('.') if (f.endswith('.png'))]
    size = 960, 960
    for png in pngs:
        img = Image.open(png)
        img.thumbnail(size, Image.ANTIALIAS)
        img.save(os.path.join(archive_dir, dateTimeStr + png), "JPEG")
		
        # remove old png if it exists
        os.remove(png)

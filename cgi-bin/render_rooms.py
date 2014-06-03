#!/usr/bin/env python

import os, re, subprocess, time, stat

# the directory to store pngs / json in
content_dir = os.path.join('..', 'content');

# do not render if file newer than this
file_age_thresh = 5*60

def render_room_if_stale(r_id):
    old_file = os.path.join(content_dir, r_id + '.png');

    try:
        file_age = time.time() - os.stat(old_file)[stat.ST_MTIME]
        if (file_age > file_age_thresh): render_room(r_id)
    except OSError:
        render_room(r_id)


# renders a single room
def render_room(r_id):
    subprocess.call([os.path.join(os.getcwd(), "phantomjs"),
        "render_netboard.js", r_id], shell=(os.name == "nt"))
    move_pngs()


# moves pngs from current directory into content directory
def move_pngs():
    pngs = [f for f in os.listdir('.') if (f.endswith('.png'))]
    for png in pngs:

        # remove old png if it exists
        try: os.remove(os.path.join(content_dir, png))
        except OSError: pass

        # move png to content directory
        os.rename(png, os.path.join(content_dir, png))


# what it does as a script
if __name__ == "__main__":

    # get files which match format of room data: room_data_[r_id].json
    fs = [f for f in os.listdir(content_dir) if (f.startswith('room_data'))]

    # extract room_ids
    pattern = 'room_data_(.+)\.json'
    room_ids = [re.search(pattern, f).group(1).lower() for f in fs]

    # call phantomjs
    subprocess_arr = [os.path.join(os.getcwd(), "phantomjs"), "render_netboard.js"] + room_ids
    print "Starting subprocess: " + " ".join(subprocess_arr)
    subprocess.call(subprocess_arr, shell=(os.name == "nt"))

    # finally move pngs back to 'content' directory
    move_pngs()

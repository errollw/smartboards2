# NetBoards (aka smartboards2): Personal Noticeboard Displays

The NetBoards project aims to provide interactive digital noticeboards that augment the role of traditional corkboards or whiteboards.

The project is written using web technologies for modern web browsers. The front-end is written using HTML5 and JavaScript, using the jQuery, Paper.js, Lo-Dash and Moment libraries. The back-end is written in Python. SASS is used to generate the CSS for the front-end.

It is a project from The Computer Laboratory - University of Cambridge.

## Setting up and deploying NetBoards
All files should be placed on a webserver. Python files in the cgi-bin directory must be able to excecute, and the user that the webserver runs as must be able to read and write to the content directory.

## File Structure
* __assets/__ images
* __cgi-bin/__ back-end Python scripts
* __css/__ CSS for front-end, including SASS code
* __js/__ JavaScript scripts and libraries
* __archive.html__ view images screenshots of the boards over time
* __board.html__ interactive viewer/editor
* __index.html__ index page for users
* __information.html__ info about the project, and a QR code to the index page
* __logviewer.html__ view usage logs
* __set_status.html__ page to set text status
* __settings.html__ page to configure users for each room
* __viewer.html__ static viewer


## Example deployment
In our deployment, each NetBoard uses a 22-inch portrait-oriented wall-mounted touchscreen, with a resolution of 1080 by 1920 pixels supporting 10-point multitouch. The NetBoards are powered by PCs (Windows 8.1, 3.40 GHz processor and 4GB RAM). Each PC is mounted in the void under the floor and powers two NetBoards.

These PCs are configured to auto-login at boot and to start the Chrome web browser automatically. The [Window Positioner plugin for Chrome](https://github.com/s-haines/chrome-window-positioner) is used to load, position, and fullscreen the browser windows.

The project is hosted on a Virtual Machine in the Computer Laboratory's VM pool. The server supports Python for the server-side scripts, and also runs board-rendering scripts periodically.
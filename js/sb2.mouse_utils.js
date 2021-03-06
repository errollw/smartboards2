
var currentMouse = null;
var previousMouse = null;

var isMouseDown = false;

min_delta_mouse = 2;

// Only executed our code once the DOM is ready.
$(document).ready(function() {

    // Create an empty project and a view for the canvas
    var canvas = document.getElementById('myCanvas');
    paper.setup(canvas);

    canvas.addEventListener("mousedown", handle_mouse_down, false);
    canvas.addEventListener("mousemove", handle_mouse_move, false);
    canvas.addEventListener("mouseup",   handle_mouse_up,   false);
    canvas.addEventListener("mouseout",  handle_mouse_up,   false);
});

function handle_mouse_down(evt) {
    currentMouse = mouseToPoint(evt);
    previousMouse = mouseToPoint(evt);
    isMouseDown = true;

    hide_gifs();
}

function handle_mouse_move(evt) {

    var canvas = document.getElementById('myCanvas');

    var new_pt = mouseToPoint(evt);   

    if ((new_pt).subtract(currentMouse).length < min_delta_mouse)
        return;

	previousMouse = currentMouse;
    currentMouse = new_pt;
}

function handle_mouse_up(evt) {
    previousMouse = mouseToPoint(evt);
    isMouseDown = false;

    if (noTouches()) update_gifs();
}

function noMouse(){
    return currentMouse;
}

function mouseToPoint(mouse){
    var p = new Point(mouse.pageX, mouse.pageY);
    p.timestamp = mouse.timeStamp;
	return p;
}

// keep track of touches
var currentTouches = {};  // touches currently active on this frame
var previousTouches = {}; // touches that registered last frame

min_delta_touch = 4;

// Only executed our code once the DOM is ready.
$(document).ready(function() {

    // Create an empty project and a view for the canvas
    var canvas = document.getElementById('myCanvas');
    paper.setup(canvas);

    // Bind touch handlers for keeping track of multiple touches
    // see: https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Touch_events
    canvas.addEventListener("touchstart",  handle_touch_start,  false);
    canvas.addEventListener("touchend",    handle_touch_end,    false);
    canvas.addEventListener("touchcancel", handle_touch_cancel, false);
    canvas.addEventListener("touchleave",  handle_touch_end,    false);
    canvas.addEventListener("touchmove",   handle_touch_move,   false);

});

function handle_touch_start(evt) {
    evt.preventDefault();

    var ts = evt.changedTouches;
    for (var i=0; i < ts.length; i++) {
		currentTouches[ts[i].identifier] = touchToPoint(ts[i]);
        previousTouches[ts[i].identifier] = touchToPoint(ts[i]);
    }
}

function handle_touch_move(evt) {
    evt.preventDefault();

    var ts = evt.changedTouches;
    for (var i=0; i < ts.length; i++) {
        
        var id = ts[i].identifier;
        var new_pt = touchToPoint(ts[i]);

        if ((new_pt).subtract(currentTouches[id]).length < min_delta_touch)
            continue;

		previousTouches[id] = currentTouches[id];
        currentTouches[id] = new_pt;
    }
}

function handle_touch_end(evt) {
    evt.preventDefault();

    var ts = evt.changedTouches;
    for (var i=0; i < ts.length; i++) {
        previousTouches[ts[i].identifier] = touchToPoint(ts[i]);
        delete currentTouches[ts[i].identifier];
    }
}

function handle_touch_cancel(evt) {
    evt.preventDefault();

    var ts = evt.changedTouches;
    for (var i=0; i < ts.length; i++) {
		previousTouches[ts[i].identifier] = touchToPoint(ts[i]);
        delete currentTouches[ts[i].identifier];
    }     
}

function touchToPoint(touch){
	return new Point(touch.pageX, touch.pageY);
}

function getNumberOfTouches(){
    return Object.keys(currentTouches).length;
}

// gets the 
function getOnlyTouch(){
    keys = Object.keys(currentTouches);
    return currentTouches[keys[0]]; 
}

// keep track of touches
var currentTouches = {};  // touches currently active on this frame
var previousTouches = {}; // touches that registered last frame
var startTouches = {};    // where that touch started

min_delta_touch = 1;

// TODO: REFACTOR GIF CODE ELSEWHERE

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
        startTouches[ts[i].identifier] = touchToPoint(ts[i]);
    }

    hide_gifs();
}

function handle_touch_move(evt) {
    evt.preventDefault();

    var ts = evt.changedTouches;
    for (var i=0; i < ts.length; i++) {
        
        var id = ts[i].identifier;
        var new_pt = touchToPoint(ts[i]);

        if (new_pt.subtract(currentTouches[id]).length > min_delta_touch){
            previousTouches[id] = currentTouches[id];
            currentTouches[id] = new_pt;
        } else {
            evt.stopPropagation();
        }

    }
}

function handle_touch_end(evt) {
    evt.preventDefault();

    var ts = evt.changedTouches;
    for (var i=0; i < ts.length; i++) {
        previousTouches[ts[i].identifier] = touchToPoint(ts[i]);
        delete currentTouches[ts[i].identifier];
    }

    if (noTouches() && !isMouseDown) update_gifs();
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
    var p = new Point(touch.pageX, touch.pageY);
    p.timestamp = _.now();
	return p;
}

function getNumberOfTouches(){
    return Object.keys(currentTouches).length;
}

function noTouches(){
    return (getNumberOfTouches() == 0);
}

function getOnlyTouch(){
    keys = Object.keys(currentTouches);
    return currentTouches[keys[0]]; 
}

function getOnlyTouchIdx(){
    keys = Object.keys(currentTouches);
    return keys[0]; 
}

// called to update touch starts for when user is adding and removing touches
// simulates the user taking all fingers off then only putting the remainder fingers back on
function update_start_touches(){

    for (var key in startTouches) {
        startTouches[key] = currentTouches[key];
    }
}
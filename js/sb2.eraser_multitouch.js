// make the paper scope global, by injecting it into window:
paper.install(window);

// keep track of touches for erasing
var currentTouches = [];  // touches currently active on this frame
var previousTouches = []; // touches that registered last frame

var is_erasing_with_multitouch = false;

// Only execute our code once the DOM is ready.
$(document).ready(function() {

    // create an empty project and a view for the canvas
    var canvas = document.getElementById('myCanvas');
    paper.setup(canvas);

    // bind touch handlers for multi-touch pen drawing
    // see: https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Touch_events
    canvas.addEventListener("touchstart",  handle_touch_start_eraser,  false);
    canvas.addEventListener("touchend",    handle_touch_end_eraser,    false);
    canvas.addEventListener("touchcancel", handle_touch_cancel_eraser, false);
    canvas.addEventListener("touchleave",  handle_touch_end_eraser,    false);
    canvas.addEventListener("touchmove",   handle_touch_move_eraser,   false);
});

function handle_touch_start_eraser(evt) {
    evt.preventDefault();

    if (edit_mode != "ERASING") return;

    var touches = evt.changedTouches;
    for (var i=0; i < touches.length; i++) {
        currentTouches.push(copyTouch(touches[i]));
        previousTouches.push(copyTouch(touches[i]));
    }

    is_erasing_with_multitouch = true;
}

function handle_touch_move_eraser(evt) {
    evt.preventDefault();

    if (edit_mode != "ERASING" || !is_erasing_with_multitouch) return;

    var touches = evt.changedTouches;
    for (var i=0; i < touches.length; i++) {
        var idx = ongoingTouchIndexById(touches[i].identifier);

        if (idx >= 0) {

            //robutstly set previous touch point before changing the current touch array
            previousTouches[idx] = currentTouches[idx] ? copyTouch(currentTouches[idx]) : copyTouch(touches[i]);
            currentTouches[idx] = copyTouch(touches[i]);

        } else {
            console.log("can't figure out which touch to continue");
        }
    }

    for (var idx = 0; idx < currentTouches.length; idx++) {

        prev_pt = new Point(previousTouches[idx].pageX, previousTouches[idx].pageY);
        touch_pt = new Point(currentTouches[idx].pageX, currentTouches[idx].pageY);

        var hit_items = hitTest_along_line(prev_pt, touch_pt);

        for (i=0; i<hit_items.length; i++)
            hit_items[i].remove();
        view.update();
    }

}

function handle_touch_end_eraser(evt) {
    evt.preventDefault();

    if (edit_mode != "ERASING" || !is_erasing_with_multitouch) return;

    var touches = evt.changedTouches;

    // find the touch that changed, and remove it
    for (var i=0; i < touches.length; i++) {
        var idx = ongoingTouchIndexById(touches[i].identifier);

        if(idx >= 0) {
            previousTouches.splice(idx, 1);
            currentTouches.splice(idx, 1);
        } else {
            console.log("can't figure out which touch to end");
        }
    }

    is_erasing_with_multitouch = (currentTouches.length > 0);
}

function handle_touch_cancel_eraser(evt) {
    evt.preventDefault();
    var touches = evt.changedTouches;

    // remove all previous and current touches
    for (var i=0; i < touches.length; i++) {
      previousTouches.splice(i, 1);
      currentTouches.splice(i, 1);
    }

    is_erasing_with_multitouch = (currentTouches.length > 0);
}


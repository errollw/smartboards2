// make the paper scope global, by injecting it into window:
paper.install(window);

// keep track of touches for pen drawing
var currentTouches = [];  // touches currently active on this frame
var previousTouches = []; // touches that registered last frame

var is_drawing_with_multitouch = false;

// Only executed our code once the DOM is ready.
$(document).ready(function() {

    // Create an empty project and a view for the canvas
    var canvas = document.getElementById('myCanvas');
    paper.setup(canvas);

    // Bind touch handlers for multi-touch pen drawing
    // see: https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Touch_events
    canvas.addEventListener("touchstart",  handle_touch_start_pen,  false);
    canvas.addEventListener("touchend",    handle_touch_end_pen,    false);
    canvas.addEventListener("touchcancel", handle_touch_cancel_pen, false);
    canvas.addEventListener("touchleave",  handle_touch_end_pen,    false);
    canvas.addEventListener("touchmove",   handle_touch_move_pen,   false);

         // Disables visual
    canvas.addEventListener("MSHoldVisual", function(e) { e.preventDefault(); }, false);
    // Disables menu
    canvas.addEventListener("contextmenu", function(e) { e.preventDefault(); }, false);
});

function handle_touch_start_pen(evt) {
    evt.preventDefault();

   if (edit_mode != "DRAWING") return;

    var touches = evt.changedTouches;
          
    for (var i=0; i < touches.length; i++) {
        currentTouches.push(copyTouch(touches[i]));
        previousTouches.push(copyTouch(touches[i]));

        var new_stroke = new Path();
        new_stroke.fillColor = '#00000';
        touch_pt = new Point(touches[i].pageX, touches[i].pageY);
        new_stroke.add(touch_pt);
        strokes.push(new_stroke);
    }

    is_drawing_with_multitouch = true;
}

function handle_touch_move_pen(evt) {
    evt.preventDefault();

    if (edit_mode != "DRAWING" || !is_drawing_with_multitouch) return;

    var touches = evt.changedTouches;
    for (var i=0; i < touches.length; i++) {
        var idx = ongoingTouchIndexById(touches[i].identifier);

        if (idx >= 0) {

            // do not register new point unless tool has moved a certain distance
            prev_pt = new Point(previousTouches[idx].pageX, previousTouches[idx].pageY);
            touch_pt = new Point(touches[i].pageX, touches[i].pageY);
            if (prev_pt.subtract(touch_pt).length < min_delta_length) continue;

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
        var delta = touch_pt.subtract(prev_pt);
        var delta_midpoint = prev_pt.add(touch_pt).divide(2);

        // get the clamped speed that the user is drawing at
        var speed = delta.length;

        // get thickness to draw at that point
        var thickness = speed_to_thickness(speed, idx);

        // make orthogonal vector to simulate brush thickness
        var step = delta.normalize(thickness);
        step.angle += 90;

        // add two points to either side of the drawn point
        var top = delta_midpoint.add(step);
        var bottom = delta_midpoint.subtract(step);
        
        strokes[idx].add(top);
        strokes[idx].insert(0, bottom);
    }

}

function handle_touch_end_pen(evt) {
    evt.preventDefault();

    if (edit_mode != "DRAWING" || !is_drawing_with_multitouch) return;

    // find the touch that changed, and remove it
    var touches = evt.changedTouches;
    for (var i=0; i < touches.length; i++) {
        var idx = ongoingTouchIndexById(touches[i].identifier);

        if(idx >= 0) {

            if (!speed_histories[idx]) {
                draw_dot(currentTouches[idx]);
                view.update();
            } else {
                strokes[idx].add([touches[i].pageX, touches[i].pageY]);
                strokes[idx].simplify(5);
            }
            view.update();

            previousTouches.splice(idx, 1);
            currentTouches.splice(idx, 1);
            strokes.splice(idx, 1);
            speed_histories[idx] = null;
        } else {
            console.log("can't figure out which touch to end");
        }
    }

    is_drawing_with_multitouch = (currentTouches.length > 0); 
}

function handle_touch_cancel_pen(evt) {
    evt.preventDefault();

    if (edit_mode != "DRAWING" || !is_drawing_with_multitouch) return;

    // remove all previous and current touches
    var touches = evt.changedTouches;
    for (var i=0; i < touches.length; i++) {
        idx = ongoingTouchIndexById(touches[i].identifier);
        previousTouches.splice(i, 1);
        currentTouches.splice(i, 1);
        strokes.splice(i, 1);
        speed_histories[idx] = null;
    }

    is_drawing_with_multitouch = (currentTouches.length > 0);       
}

// some browsers re-use touch objects so avoid referencing object
function copyTouch(touch) {
    return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
}

function ongoingTouchIndexById(idToFind) {
    for (var i=0; i < currentTouches.length; i++) {
      var id = currentTouches[i].identifier;
      
      if (id == idToFind)
        return i;
    }
    return -1;    // not found
}
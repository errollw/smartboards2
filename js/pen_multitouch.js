// make the paper scope global, by injecting it into window:
paper.install(window);

// keep track of touches for pen drawing
var currentTouches = [];  // touches currently active on this frame
var previousTouches = []; // touches that registered last frame

var min_delta = 8;

// Only executed our code once the DOM is ready.
$(document).ready(function() {

    // Create an empty project and a view for the canvas
    var canvas = document.getElementById('myCanvas');
    paper.setup(canvas);

    // Bind touch handlers for multi-touch pen drawing
    // see: https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Touch_events
    var canv = document.getElementsByTagName("canvas")[0];
    canv.addEventListener("touchstart",  handle_touch_start_pen,  false);
    canv.addEventListener("touchend",    handle_touch_end_pen,    false);
    canv.addEventListener("touchcancel", handle_touch_cancel_pen, false);
    canv.addEventListener("touchleave",  handle_touch_end_pen,    false);
    canv.addEventListener("touchmove",   handle_touch_move_pen,   false);
});

function handle_touch_start_pen(evt) {
    evt.preventDefault();
    var touches = evt.changedTouches;
          
    for (var i=0; i < touches.length; i++) {
        currentTouches.push(copyTouch(touches[i]));
        previousTouches.push(copyTouch(touches[i]));

        var new_stroke = new Path();
        new_stroke.fillColor = '#00000';
        touch_pt_1 = new Point(touches[i].pageX, touches[i].pageY);
        new_stroke.add(touch_pt_1);
        strokes.push(new_stroke);
    }
}

function handle_touch_move_pen(evt) {
    evt.preventDefault();
    var touches = evt.changedTouches;

    for (var i=0; i < touches.length; i++) {
        var idx = ongoingTouchIndexById(touches[i].identifier);

        if (idx >= 0) {

            // do not register new point unless tool has moved a certain distance
            prev_pt = new Point(previousTouches[idx].pageX, previousTouches[idx].pageY);
            touch_pt = new Point(touches[i].pageX, touches[i].pageY);
            if (prev_pt.subtract(touch_pt).length < min_delta) continue;

            //robutstly set previous touch point before changing the current touch array
            previousTouches[idx] = currentTouches[idx] ? copyTouch(currentTouches[idx]) : copyTouch(touches[i]);
            currentTouches[idx] = copyTouch(touches[i]);
        } else {
            console.log("can't figure out which touch to continue");
        }
    }

    for (var idx = 0; idx < currentTouches.length; idx++) {

        prev_pt_1 = new Point(previousTouches[idx].pageX, previousTouches[idx].pageY);
        touch_pt_1 = new Point(currentTouches[idx].pageX, currentTouches[idx].pageY);
        var diff = touch_pt_1.subtract(prev_pt_1);
        var delta_midpoint = prev_pt_1.add(touch_pt_1).divide(2);

        // get the clamped speed that the user is drawing at
        var speed = diff.length;
        speed = Math.min(SPEED_MAX, Math.max(SPEED_MIN, speed));

        // get thickness to draw at that point
        var thickness = speed_to_thickness(speed, idx);

        // make orthogonal vector to simulate brush thickness
        var step = diff.normalize(thickness);
        step.angle += 90;

        // add two points to either side of the drawn point
        var top = delta_midpoint.add(step);
        var bottom = delta_midpoint.subtract(step);
        
        strokes[idx].add(top);
        strokes[idx].insert(0, bottom);

//        strokes[idx].smooth();
    }

}

function handle_touch_end_pen(evt) {
    evt.preventDefault();
    console.log("touchend/touchleave.");
    var touches = evt.changedTouches;

    // find the touch that changed, and remove it
    for (var i=0; i < touches.length; i++) {
        var idx = ongoingTouchIndexById(touches[i].identifier);

        if(idx >= 0) {

            if (!speed_histories[idx]) {
                draw_dot(currentTouches[idx]);
            } else {
                console.log(touches[i])
                strokes[idx].add([touches[i].pageX, touches[i].pageY]);
                strokes[idx].simplify(5);
            }

            previousTouches.splice(idx, 1);
            currentTouches.splice(idx, 1);
            strokes.splice(idx, 1);
            speed_histories[idx] = null;
        } else {
            console.log("can't figure out which touch to end");
        }
    }
}

function handle_touch_cancel_pen(evt) {
    evt.preventDefault();
    var touches = evt.changedTouches;

    // remove all previous and current touches
    for (var i=0; i < touches.length; i++) {
      previousTouches.splice(i, 1);
      currentTouches.splice(i, 1);
      strokes.splice(i, 1);
      speed_histories[idx] = null;
    }
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
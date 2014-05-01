// make the paper scope global, by injecting it into window:
paper.install(window);

// keep track of touches
var currentTouches = [];  // touches currently active on this frame
var previousTouches = []; // touches that registered last frame

var min_delta = 4;

var path;

var strokes = [];

var SPEED_MIN = 4,
    SPEED_MAX = 10;

var speed_histories = [];
var speed_history_length = 8;

var first_drags = true;

// Only executed our code once the DOM is ready.
window.onload = function() {

    // Create an empty project and a view for the canvas
    var canvas = document.getElementById('myCanvas');
    paper.setup(canvas);

    // Bind touch handlers for multi-touch operations
    // see: https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Touch_events
    var canv = document.getElementsByTagName("canvas")[0];
    canv.addEventListener("touchstart",  handleStart,  false);
    canv.addEventListener("touchend",    handleEnd,    false);
    canv.addEventListener("touchcancel", handleCancel, false);
    canv.addEventListener("touchleave",  handleEnd,    false);
    canv.addEventListener("touchmove",   handleMove,   false);
}

function speed_to_thickness(speed, speed_history){

    speed_history.shift();
    speed_history.push(speed);

    var sum = 0;
    for(var i = 0; i < speed_history.length; i++)
        sum += parseInt(speed_history[i]);
    
    return 12-(sum/speed_history.length);
}

function handleStart(evt) {
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

function handleMove(evt) {
    evt.preventDefault();
    var touches = evt.changedTouches;

    for (var i=0; i < touches.length; i++) {
        var idx = ongoingTouchIndexById(touches[i].identifier);

        if (idx >= 0) {

            // do not register new point unless tool has moved
            prev_pt = new Point(previousTouches[idx].pageX, previousTouches[idx].pageY);
            touch_pt = new Point(touches[i].pageX, touches[i].pageY);
            if (prev_pt.subtract(touch_pt).length < min_delta) break;

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

        // reset smoothing speed window at the beginning of a stroke
        if (!speed_histories[idx]){
            speed_histories[idx] = [];
            for(var i = 0; i < speed_history_length; i++)
                speed_histories[idx][i] = speed;
            first_drag = false;
        }

        // get thickness to draw at that point
        var thickness = speed_to_thickness(speed, speed_histories[idx]);

        // make orthogonal vector to simulate brush thickness
        var step = diff.normalize(thickness);
        step.angle += 90;

        // add two points to either side of the drawn point
        var top = delta_midpoint.add(step);
        var bottom = delta_midpoint.subtract(step);
        
        strokes[idx].add(top);
        strokes[idx].insert(0, bottom);

        strokes[idx].smooth();
    }

}

function draw_dot(point){
    var path = new Path();
    path.fillColor = '#00000';
    path.closed = true;
    var center = new Point(point.pageX, point.pageY);
    
    for (var i = 0; i < 6; i++) {
        var delta = new Point({
            length: (10 * 0.7) + (Math.random() * 10 * 0.3),
            angle: (360 / 6) * i
        });
        path.add(center.add(delta));
    }
    path.smooth();
}

function handleEnd(evt) {
    evt.preventDefault();
    console.log("touchend/touchleave.");
    var touches = evt.changedTouches;

    // find the touch that changed, and remove it
    for (var i=0; i < touches.length; i++) {
        var idx = ongoingTouchIndexById(touches[i].identifier);

        if(idx >= 0) {

            if (!speed_histories[idx]) {
                draw_dot(currentTouches[idx]);
                console.log("TEST")
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

function handleCancel(evt) {
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
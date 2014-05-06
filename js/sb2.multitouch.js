// make the paper scope global, by injecting it into window:
paper.install(window);

// keep track of touches
var currentTouches = [];  // pointers currently active on this frame
var previousTouches = [];     // pointers that registered last frame

// special cases for multi-touch drag/scale/rotate
var mt_start_pts = [],
    vec_mt_start_pts,       // vector from one mt start point to the other
    midpt_mt_start_pts;     // midpoint between both mt start pts

// Only executed our code once the DOM is ready.
$(document).ready(function() {

    // Create an empty project and a view for the canvas
    var canvas = document.getElementById('myCanvas');
    paper.setup(canvas);

    // Create a test transform_item image
    var transform_item = new Raster('http://upload.wikimedia.org/wikipedia/en/2/24/Lenna.png');
    transform_item.position = view.center;

    // bind touch handlers for multi-touch transforms
    // see: https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Touch_events
    canvas.addEventListener("touchstart",  handle_touch_start,  false);
    canvas.addEventListener("touchend",    handle_touch_end,    false);
    canvas.addEventListener("touchcancel", handle_touch_cancel, false);
    canvas.addEventListener("touchleave",  handle_touch_end,    false);
    canvas.addEventListener("touchmove",   handle_touch_move,   false);

    // bind mouse handlers for mouse-based transforms
    // canvas.addEventListener("mousedown", handle_mouse_down, false);
    // canvas.addEventListener("mousemove", handle_mouse_move, false);
    // canvas.addEventListener("mouseup",   handle_mouse_up,   false);
    // canvas.addEventListener("mouseout",  handle_mouse_up,   false);
});

// function handle_mouse_down(evt) {

//     edit_mode = "TRANSFORM";

//     console.log(project.hitTest([evt.pageX, evt.pageY]))

//     transform_item = project.hitTest([evt.pageX, evt.pageY]).item

//     if (currentTouches.length == 0){
//         currentTouches[0] = copy_mouse(evt);
//         previousTouches[0] = copy_mouse(evt);
//     }
// }

// function handle_mouse_move(evt) {

//     if (edit_mode != "TRANSFORM") return;

//     // only handle mouse if it is the only active pointer (no touch)
//     if (currentTouches.length == 1){
//         previousTouches[0] = copy_mouse(currentTouches[0]);
//         currentTouches[0] = copy_mouse(evt);

//         // update transform_item position based on pointer delta
//         prev_pt = new Point(previousTouches[0].pageX, previousTouches[0].pageY);
//         current_pt = new Point(currentTouches[0].pageX, currentTouches[0].pageY);
//         var delta = current_pt.subtract(prev_pt);
//         transform_item.position = transform_item.position.add(delta);
//     }
// }

// function handle_mouse_up(evt) {

//     edit_mode = "IDLE";

//     // remove all previous and current touches
//     for (var i=0; i < currentTouches.length; i++) {
//         if (currentTouches[i].mouse) {
//             previousTouches.splice(i, 1);
//             currentTouches.splice(i, 1);
//         }
//     }
// }

function handle_touch_start(evt) {
    evt.preventDefault();

    if (edit_mode != "TRANSFORMING" ) return;

    var touches = evt.changedTouches;
          
    // add new registered touches
    for (var i=0; i < touches.length; i++) {
        currentTouches.push(copyTouch(touches[i]));
        previousTouches.push(copyTouch(touches[i]));
    }

    // if now multitouching, initialize multitouch transform data
    if (currentTouches.length >= 2) {
        mt_start_pts[0] = new Point(currentTouches[0].pageX, currentTouches[0].pageY);
        mt_start_pts[1] = new Point(currentTouches[1].pageX, currentTouches[1].pageY);
        vec_mt_start_pts = mt_start_pts[0].subtract(mt_start_pts[1]);
        midpt_mt_start_pts = mt_start_pts[0].add(mt_start_pts[1]).divide(2);

        selected_group.mt_start_position = selected_group.position;
        selected_group.mt_start_rotation = selected_group.rotation;
        selected_group.mt_start_scaling  = selected_group.scaling;
    }
}

function handle_touch_move(evt) {
    evt.preventDefault();

    if (edit_mode != "TRANSFORMING" ) return;

    var touches = evt.changedTouches;

    for (var i=0; i < touches.length; i++) {
        var idx = ongoingTouchIndexById(touches[i].identifier);

        if(idx >= 0) {
            //robutstly set previous touch point before changing the current touch array
            previousTouches[idx] = currentTouches[idx] ? copyTouch(currentTouches[idx]) : copyTouch(touches[i]);
            currentTouches[idx] = copyTouch(touches[i]);
        } else {
            console.log("can't figure out which touch to continue");
        }
    }

    // if just one touch, move the selected_group
    if (currentTouches.length == 1) {

        prev_pt_1 = new Point(previousTouches[0].pageX, previousTouches[0].pageY);
        touch_pt_1 = new Point(currentTouches[0].pageX, currentTouches[0].pageY);
        var diff = touch_pt_1.subtract(prev_pt_1);
        selected_group.position = selected_group.position.add(diff);
    }

    // TODO: WORK OUT TRANSFORMS BETWEEN POINTS AS 4x3 MATRIX
    // more complex transform operations for two touch points
    if (currentTouches.length == 2) {

        touch_pt_1 = new Point(currentTouches[0].pageX, currentTouches[0].pageY);
        touch_pt_2 = new Point(currentTouches[1].pageX, currentTouches[1].pageY);
        var vec_touch = touch_pt_1.subtract(touch_pt_2);    
        var midpt_touch = touch_pt_1.add(touch_pt_2).divide(2);

        // move the selected_group
        var diff = midpt_touch.subtract(midpt_mt_start_pts)
        selected_group.position = selected_group.mt_start_position.add(diff);

        // rotate the selected_group
        var d_rot = vec_touch.angle - vec_mt_start_pts.angle;
        selected_group.rotation = selected_group.mt_start_rotation + d_rot;

        // scale the selected_group
        var d_scale = vec_touch.length / vec_mt_start_pts.length;
        selected_group.scaling = selected_group.mt_start_scaling.multiply([d_scale,d_scale]);
    }

}

function handle_touch_end(evt) {
    evt.preventDefault();

    if (edit_mode != "TRANSFORMING" ) return;

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
}

function handle_touch_cancel(evt) {
    evt.preventDefault();

    if (edit_mode != "TRANSFORMING" ) return;

    var touches = evt.changedTouches;

    // remove all previous and current touches
    for (var i=0; i < touches.length; i++) {
      previousTouches.splice(i, 1);
      currentTouches.splice(i, 1);
    }
}

function copy_mouse(mouse_evt) {
    return { mouse: true, pageX: mouse_evt.pageX, pageY: mouse_evt.pageY };
}

// make the paper scope global, by injecting it into window:
paper.install(window);

// window edit mode can be TRANSFORM or IDLE
edit_mode = "IDLE";

// keep track of touches
var current_pointers = [];  // pointers currently active on this frame
var prev_pointers = [];     // pointers that registered last frame

// special cases for multi-touch drag/scale/rotate
var mt_start_pts = [],
    vec_mt_start_pts,       // vector from one mt start point to the other
    midpt_mt_start_pts;     // midpoint between both mt start pts

// the image to move
var transform_item;

// Only executed our code once the DOM is ready.
$(document).ready(function() {

    // Create an empty project and a view for the canvas
    var canvas = document.getElementById('myCanvas');
    paper.setup(canvas);

    canvas.width  = 1080;
    canvas.height = 1920;

    // Create a test transform_item image
    transform_item = new Raster('http://upload.wikimedia.org/wikipedia/en/2/24/Lenna.png');
    transform_item.position = view.center;

    // bind touch handlers for multi-touch transforms
    // see: https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Touch_events
    var canv = document.getElementsByTagName("canvas")[0];
    canv.addEventListener("touchstart",  handle_touch_start,  false);
    canv.addEventListener("touchend",    handle_touch_end,    false);
    canv.addEventListener("touchcancel", handle_touch_cancel, false);
    canv.addEventListener("touchleave",  handle_touch_end,    false);
    canv.addEventListener("touchmove",   handle_touch_move,   false);

    // bind mouse handlers for mouse-based transforms
    canv.addEventListener("mousedown", handle_mouse_down, false);
    canv.addEventListener("mousemove", handle_mouse_move, false);
    canv.addEventListener("mouseup",   handle_mouse_up,   false);
    canv.addEventListener("mouseout",  handle_mouse_up,   false);
});

function handle_mouse_down(evt) {

    edit_mode = "TRANSFORM";

    console.log(project.hitTest([evt.pageX, evt.pageY]))

    transform_item = project.hitTest([evt.pageX, evt.pageY]).item

    if (current_pointers.length == 0){
        current_pointers[0] = copy_mouse(evt);
        prev_pointers[0] = copy_mouse(evt);
    }
}

function handle_mouse_move(evt) {

    if (edit_mode != "TRANSFORM") return;

    // only handle mouse if it is the only active pointer (no touch)
    if (current_pointers.length == 1){
        prev_pointers[0] = copy_mouse(current_pointers[0]);
        current_pointers[0] = copy_mouse(evt);

        // update transform_item position based on pointer delta
        prev_pt = new Point(prev_pointers[0].pageX, prev_pointers[0].pageY);
        current_pt = new Point(current_pointers[0].pageX, current_pointers[0].pageY);
        var delta = current_pt.subtract(prev_pt);
        transform_item.position = transform_item.position.add(delta);
    }
}

function handle_mouse_up(evt) {

    edit_mode = "IDLE";

    // remove all previous and current touches
    for (var i=0; i < current_pointers.length; i++) {
        if (current_pointers[i].mouse) {
            prev_pointers.splice(i, 1);
            current_pointers.splice(i, 1);
        }
    }
}

function handle_touch_start(evt) {

    evt.preventDefault();
    var touches = evt.changedTouches;
          
    // add new registered touches
    for (var i=0; i < touches.length; i++) {
        current_pointers.push(copyTouch(touches[i]));
        prev_pointers.push(copyTouch(touches[i]));

        if (transform_item.hitTest([touches[i].pageX, touches[i].pageY])){
            edit_mode = "TRANSFORM";
            transform_item.selected = true;
        }
    }

    // if now multitouching, initialize multitouch transform data
    if (current_pointers.length >= 2) {
        mt_start_pts[0] = new Point(current_pointers[0].pageX, current_pointers[0].pageY);
        mt_start_pts[1] = new Point(current_pointers[1].pageX, current_pointers[1].pageY);
        vec_mt_start_pts = mt_start_pts[0].subtract(mt_start_pts[1]);
        midpt_mt_start_pts = mt_start_pts[0].add(mt_start_pts[1]).divide(2);
        transform_item.mt_start_position = transform_item.position;
        transform_item.mt_start_rotation = transform_item.rotation;
        transform_item.mt_start_scaling  = transform_item.scaling;
    }
}

function handle_touch_move(evt) {

    if (edit_mode != "TRANSFORM") return;

    evt.preventDefault();
    var touches = evt.changedTouches;

    for (var i=0; i < touches.length; i++) {
        var idx = ongoingTouchIndexById(touches[i].identifier);

        if(idx >= 0) {
            //robutstly set previous touch point before changing the current touch array
            prev_pointers[idx] = current_pointers[idx] ? copyTouch(current_pointers[idx]) : copyTouch(touches[i]);
            current_pointers[idx] = copyTouch(touches[i]);
        } else {
            console.log("can't figure out which touch to continue");
        }
    }

    // if just one touch, move the transform_item
    if (current_pointers.length == 1) {

        prev_pt_1 = new Point(prev_pointers[0].pageX, prev_pointers[0].pageY);
        touch_pt_1 = new Point(current_pointers[0].pageX, current_pointers[0].pageY);
        var diff = touch_pt_1.subtract(prev_pt_1);
        transform_item.position = transform_item.position.add(diff);
    }

    // TODO: WORK OUT TRANSFORMS BETWEEN POINTS AS 4x3 MATRIX
    // more complex transform operations for two touch points
    if (current_pointers.length == 2) {

        touch_pt_1 = new Point(current_pointers[0].pageX, current_pointers[0].pageY);
        touch_pt_2 = new Point(current_pointers[1].pageX, current_pointers[1].pageY);
        var vec_touch = touch_pt_1.subtract(touch_pt_2);    
        var midpt_touch = touch_pt_1.add(touch_pt_2).divide(2);

        // move the transform_item
        var diff = midpt_touch.subtract(midpt_mt_start_pts)
        transform_item.position = transform_item.mt_start_position.add(diff);

        // rotate the transform_item
        var d_rot = vec_touch.angle - vec_mt_start_pts.angle;
        transform_item.rotation = transform_item.mt_start_rotation + d_rot;

        // scale the transform_item
        var d_scale = vec_touch.length / vec_mt_start_pts.length;
        transform_item.scaling = transform_item.mt_start_scaling.multiply([d_scale,d_scale]);
    }

}

function handle_touch_end(evt) {

    evt.preventDefault();
    var touches = evt.changedTouches;

    // find the touch that changed, and remove it
    for (var i=0; i < touches.length; i++) {
        var idx = ongoingTouchIndexById(touches[i].identifier);

        if(idx >= 0) {
            prev_pointers.splice(idx, 1);
            current_pointers.splice(idx, 1); 
        } else {
            console.log("can't figure out which touch to end");
        }
    }

    if (current_pointers.length == 0) edit_mode = "IDLE";
}

function handle_touch_cancel(evt) {

    evt.preventDefault();
    var touches = evt.changedTouches;

    // remove all previous and current touches
    for (var i=0; i < touches.length; i++) {
      prev_pointers.splice(i, 1);
      current_pointers.splice(i, 1);
    }

    if (current_pointers.length == 0) edit_mode = "IDLE";
}

// some browsers re-use event objects so avoid referencing object
function copyTouch(touch_event) {
    return { identifier: touch_event.identifier, pageX: touch_event.pageX, pageY: touch_event.pageY };
}

function copy_mouse(mouse_evt) {
    return { mouse: true, pageX: mouse_evt.pageX, pageY: mouse_evt.pageY };
}

function ongoingTouchIndexById(idToFind) {
    for (var i=0; i < current_pointers.length; i++) {
      var id = current_pointers[i].identifier;
      
      if (id == idToFind)
        return i;
    }
    return -1;    // not found
}
// make the paper scope global, by injecting it into window:
paper.install(window);

// special cases for multi-touch drag/scale/rotate
var mt_start_pts = [],
    vec_mt_start_pts,       // vector from one mt start point to the other
    midpt_mt_start_pts;     // midpoint between both mt start pts

var is_transforming_with_multitouch = false;

// Only executed our code once the DOM is ready.
$(document).ready(function() {

    // Create an empty project and a view for the canvas
    var canvas = document.getElementById('myCanvas');
    paper.setup(canvas);

    // bind touch handlers for multi-touch transforms
    // see: https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Touch_events
    canvas.addEventListener("touchstart",  handle_touch_start_transform,  false);
    canvas.addEventListener("touchend",    handle_touch_end_transform,    false);
    canvas.addEventListener("touchcancel", handle_touch_end_transform, false);
    canvas.addEventListener("touchleave",  handle_touch_end_transform,    false);
    canvas.addEventListener("touchmove",   handle_touch_move_transform,   false);
});


function handle_touch_start_transform(evt) {
    evt.preventDefault();

    if (edit_mode != "TRANSFORMING" || !is_transforming_with_multitouch) return;

    // if now multitouching, initialize multitouch transform data
    if (getNumberOfTouches() == 2) {
        mt_start_pts[0] = currentTouches[0];
        mt_start_pts[1] = currentTouches[1];
        
        vec_mt_start_pts = mt_start_pts[0].subtract(mt_start_pts[1]);
        midpt_mt_start_pts = mt_start_pts[0].add(mt_start_pts[1]).divide(2);

        selected_group.mt_start_position = selected_group.position;
        selected_group.m_rotation = 0;
        selected_group.m_scaling = 1;
        selected_group.mt_start_scaling  = new Point(selected_group.scaling);
    }
}

function handle_touch_move_transform(evt) {
    evt.preventDefault();

    if (edit_mode != "TRANSFORMING" || !is_transforming_with_multitouch) return;

    // if just one touch, move the selected_group
    if (getNumberOfTouches() == 1) {
        selected_group.position = selected_group.grab_pt.add(getOnlyTouch())
    }

    // TODO: WORK OUT TRANSFORMS BETWEEN POINTS AS 4x3 MATRIX
    // more complex transform operations for two touch points
    if (getNumberOfTouches() == 2) {

        var vec_touch = currentTouches[0].subtract(currentTouches[1]);    
        var midpt_touch = currentTouches[0].add(currentTouches[1]).divide(2);

        // rotate the selected_group
        var d_rot = vec_touch.angle - vec_mt_start_pts.angle;
        selected_group.rotate(d_rot-selected_group.m_rotation, midpt_touch);
        selected_group.m_rotation = d_rot;

        // scale the selected_group
        var d_scale = vec_touch.length / vec_mt_start_pts.length;
        selected_group.scale(d_scale/selected_group.m_scaling, midpt_touch)
        selected_group.m_scaling = d_scale;

        // move the selected_group
        var diff = midpt_touch.subtract(midpt_mt_start_pts)
        selected_group.position = selected_group.mt_start_position
        selected_group.translate(diff)
    }

}

function handle_touch_end_transform(evt) {

    evt.preventDefault();
    if (edit_mode != "TRANSFORMING" || !is_transforming_with_multitouch) return;

    selected_group.grab_pt = selected_group.position.subtract(currentMouse);


    if (getNumberOfTouches() == 1){

        selected_group.grab_pt = selected_group.position.subtract(getOnlyTouch());

    } else if (getNumberOfTouches() == 0){

        edit_mode = "SELECTING";
        is_transforming_with_multitouch = false;

    }
}
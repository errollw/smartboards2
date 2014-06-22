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
    canvas.addEventListener("touchstart",  handle_touch_start_transform, false);
    canvas.addEventListener("touchend",    handle_touch_end_transform,   false);
    canvas.addEventListener("touchcancel", handle_touch_end_transform,   false);
    canvas.addEventListener("touchleave",  handle_touch_end_transform,   false);
    canvas.addEventListener("touchmove",   handle_touch_move_transform,  false);
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

        _.forEach(project.selectedItems, function(sel_item){
            sel_item.mt_start_pos = sel_item.position;
            sel_item.mt_start_rot = sel_item.rotation;
            sel_item.mt_start_scaling = sel_item.scaling;
        });
    }
}

function handle_touch_move_transform(evt) {

    evt.preventDefault();

    if (edit_mode != "TRANSFORMING" || !is_transforming_with_multitouch) return;

    // if just one touch, move the selected_group
    if (getNumberOfTouches() == 1) {

        // update position of each selected item based on touch delta
        var t_idx = getOnlyTouchIdx();
        var d_pos = currentTouches[t_idx].subtract(previousTouches[t_idx]);
        _.forEach(project.selectedItems, function(sel_item){
            sel_item.position = sel_item.position.add(d_pos);
        });
    }

    // TODO: WORK OUT TRANSFORMS BETWEEN POINTS AS 4x3 MATRIX
    // more complex transform operations for two touch points
    if (getNumberOfTouches() >= 2) {

        var vec_touch = currentTouches[0].subtract(currentTouches[1]);
        var midpt_touch = currentTouches[0].add(currentTouches[1]).divide(2);

        // see http://stackoverflow.com/questions/563198/
        var t = ((mt_start_pts[0].subtract(currentTouches[0])).cross(vec_mt_start_pts)) /
            (vec_touch.cross(vec_mt_start_pts))
        var intersect = currentTouches[0].add(vec_touch.multiply(t))

        // calculate transform deltas from start of multitouch
        var d_rot = vec_touch.angle - vec_mt_start_pts.angle;
        var rotated_st_pt = midpt_mt_start_pts.rotate(d_rot, intersect)
        var d_pos = midpt_touch.subtract(rotated_st_pt)
        var d_scale = vec_touch.length/vec_mt_start_pts.length;

        // do not transform if not necessary, this avoids a weird bug I haven't worked out
        if (d_rot == 0 && d_pos.length == 0) return;

        // create transform matrix
        m = new Matrix();
        m.reset();
        m.translate(d_pos)
        m.rotate(d_rot, intersect)

        _.forEach(project.selectedItems, function(sel_item){

            // reset transform properties of all items
            sel_item.transformContent = false;
            sel_item.rotation = sel_item.mt_start_rot;
            sel_item.position = sel_item.mt_start_pos;

            // transform each item with multitouch
            sel_item.transform(m);
        });

        // handle scaling afterwards separately
        _.forEach(project.selectedItems, function(sel_item){
            sel_item.scaling = sel_item.mt_start_scaling;
            sel_item.scale(d_scale, selected_items_rect.position)
        });

    }

}

function handle_touch_end_transform(evt) {

    evt.preventDefault();
    if (edit_mode != "TRANSFORMING" || !is_transforming_with_multitouch) return;

    if (getNumberOfTouches() == 1){

    } else if (getNumberOfTouches() == 0){

        edit_mode = "SELECTING";
        is_transforming_with_multitouch = false;
        show_floatie(selected_items_rect.position);

    }
}
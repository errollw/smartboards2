// make the paper scope global, by injecting it into window:
paper.install(window);

// special cases for multi-touch drag/scale/rotate
var mt_start_points = [],
    mt_vector_start_points,       // vector from one mt start point to the other
    mt_start_midpoint;  // midpoint of starting pair of touches

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
        mt_start_points[0] = currentTouches[0];
        mt_start_points[1] = currentTouches[1];
        
        mt_vector_start_points = mt_start_points[1].subtract(mt_start_points[0]);
        mt_start_midpoint = mt_start_points[0].add(mt_vector_start_points.divide(2))
        
        _.forEach(project.selectedItems, function(sel_item){
            sel_item.mt_start_position = sel_item.position;
            sel_item.mt_start_rotation = sel_item.rotation;
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
        // TODO: Fix this - items shouldn't slide under the finger
        var t_idx = getOnlyTouchIdx();
        var d_pos = currentTouches[t_idx].subtract(previousTouches[t_idx]);
        _.forEach(project.selectedItems, function(sel_item){
            sel_item.position = sel_item.position.add(d_pos);
        });
    }

    // more complex transform operations for two touch points
    if (getNumberOfTouches() >= 2) {
    

        var mt_vector_end_points = currentTouches[1].subtract(currentTouches[0]);
        var mt_end_midpoint = currentTouches[0].add(mt_vector_end_points.divide(2));
        
        var translation = mt_end_midpoint.subtract(mt_start_midpoint);
        var rotation = mt_vector_end_points.angle - mt_vector_start_points.angle;
        var scale = mt_vector_end_points.length / mt_vector_start_points.length;
        

        // do not transform if not necessary, this avoids a weird bug I haven't worked out
        if (scale == 1 && rotation == 0) return;

        // create transform matrix
        m = new Matrix();
        m.reset();
        m.translate(translation);
        m.rotate(rotation, mt_start_midpoint);
        m.scale(scale, mt_start_midpoint);
		
		/* Sometimes m.tx may become NaN
		 * If the matrix were applied with NaN, the item will disappear from view
		 * and many exceptions will be thrown.
		 * Returning from this function prevents the matrix from being applied.
		 */
		if (isNaN(m.tx)) return false;

        _.forEach(project.selectedItems, function(sel_item){

            // reset transform properties of all items
            sel_item.transformContent = false;
            sel_item.rotation = sel_item.mt_start_rotation;
            sel_item.position = sel_item.mt_start_position;
            sel_item.scaling = sel_item.mt_start_scaling;
			

            // transform each item with multitouch
            sel_item.transform(m);
        });


    }

}

function handle_touch_end_transform(evt) {

    evt.preventDefault();
    if (edit_mode != "TRANSFORMING" || !is_transforming_with_multitouch || !selected_items_rect) return;

    if (getNumberOfTouches() == 1){

    } else if (getNumberOfTouches() == 0){

        edit_mode = "SELECTING";
        is_transforming_with_multitouch = false;
        show_floatie(selected_items_rect.position);

    }
}
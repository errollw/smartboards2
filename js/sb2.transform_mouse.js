// make the paper scope global, by injecting it into window:
paper.install(window);

var mouse_transform_mode = null;
var mouse_transform_anchor_pt = null;

var is_transforming_with_mouse = false;

var transform_start_mouse;

// Only executed our code once the DOM is ready.
$(document).ready(function() {

    // Create an empty project and a view for the canvas
    var canvas = document.getElementById('myCanvas');
    paper.setup(canvas);

    // bind mouse handlers for drawing with mouse
    var canv = document.getElementsByTagName("canvas")[0];
    canv.addEventListener("mousemove", handle_mouse_move_transform, false);
    canv.addEventListener("mouseup",   handle_mouse_up_transform,   false);
    canv.addEventListener("mouseout",  handle_mouse_up_transform,   false);
});

function handle_mouse_move_transform(evt) {
    if (edit_mode != "TRANSFORMING" || !is_transforming_with_mouse) return;

    if (mouse_transform_mode == "RESIZE"){

        vec_prev = mouse_transform_anchor_pt.subtract(previousMouse);
        vec_new = mouse_transform_anchor_pt.subtract(currentMouse);
        d_scale = vec_new.length/vec_prev.length;

        _.forEach(project.selectedItems, function(sel_item){
            sel_item.scale(d_scale, mouse_transform_anchor_pt);
        });

    } else if (mouse_transform_mode == "ROTATE"){

        vec_prev = selected_items_rect.position.subtract(previousMouse);
        vec_new = selected_items_rect.position.subtract(currentMouse);
        d_rot = vec_new.angle - vec_prev.angle;

        _.forEach(project.selectedItems, function(sel_item){
            sel_item.rotate(d_rot, selected_items_rect.position);
        });

    } else {

        // update position of each selected item based on mouse delta
        _.forEach(project.selectedItems, function(sel_item){
            sel_item.position = sel_item.position.add(currentMouse.subtract(previousMouse));
        });

    }
}

function handle_mouse_up_transform(evt){
    if (edit_mode != "TRANSFORMING" || !is_transforming_with_mouse) return;

    is_transforming_with_mouse = false;

    edit_mode = "SELECTING";

    mouse_transform_mode = null;
    document.body.style.cursor = 'auto';

    show_floatie(selected_items_rect.position);

    remove_selection_rects();
    make_selection_rect();
}
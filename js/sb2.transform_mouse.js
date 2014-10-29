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

        vec_start = mouse_transform_anchor_pt.subtract(mouse_transform_start_pt)
        vec_new = mouse_transform_anchor_pt.subtract(currentMouse);
        d_scale = Math.min(vec_new.x/vec_start.x, vec_new.y/vec_start.y);

        _.forEach(project.selectedItems, function(sel_item){
            cloned_item = switch_sel_item_with_orig(sel_item);
            cloned_item.scale(d_scale, mouse_transform_anchor_pt);
        });

    } else if (mouse_transform_mode == "ROTATE"){

        vec_start = selected_items_rect.position.subtract(mouse_transform_start_pt);
        vec_new = selected_items_rect.position.subtract(currentMouse);
        d_rot = vec_new.angle - vec_start.angle;

        _.forEach(project.selectedItems, function(sel_item){
            cloned_item = switch_sel_item_with_orig(sel_item);
            cloned_item.rotate(d_rot, selected_items_rect.position);
        });

    } else if (mouse_transform_mode == "MOVE"){

        vec_delta_pos = currentMouse.subtract(mouse_transform_start_pt)
        console.log(vec_delta_pos)

        _.forEach(project.selectedItems, function(sel_item){
            cloned_item = switch_sel_item_with_orig(sel_item);
            cloned_item.position = cloned_item.position.add(vec_delta_pos);
        });

    }
}

function handle_mouse_up_transform(evt){
    if (edit_mode != "TRANSFORMING" || !is_transforming_with_mouse) return;

    // remove original items so they can be generated fresh for new transforms
    _.forEach(project.selectedItems, function(sel_item){
        delete sel_item.orig_item
    });

    is_transforming_with_mouse = false;

    edit_mode = "SELECTING";

    mouse_transform_mode = null;
    document.body.style.cursor = 'auto';

    show_floatie(selected_items_rect.position);

    remove_selection_rects();
    make_selection_rect();
}
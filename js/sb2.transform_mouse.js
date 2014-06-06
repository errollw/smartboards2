// make the paper scope global, by injecting it into window:
paper.install(window);

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

    // update position of each selected item based on mouse delta
    _.forEach(project.selectedItems, function(sel_item){
        sel_item.position = sel_item.position.add(currentMouse.subtract(previousMouse));
    });
}

function handle_mouse_up_transform(evt){
    if (edit_mode != "TRANSFORMING" || !is_transforming_with_mouse) return;

    is_transforming_with_mouse = false;

    edit_mode = "SELECTING";
    show_floatie(selected_items_rect.position);
}
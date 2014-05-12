// make the paper scope global, by injecting it into window:
paper.install(window);

var selection_start_pt;

var selection_in_progress_rect = null;

var selected_group,             // group of selected objects
    selected_group_rect;        // rectangle to mark out selection bounds

var is_selecting_with_mouse = false;

// Only executed our code once the DOM is ready.
$(document).ready(function() {

    // Create an empty project and a view for the canvas
    var canvas = document.getElementById('myCanvas');
    paper.setup(canvas);

    // bind mouse handlers for drawing with mouse
    var canv = document.getElementsByTagName("canvas")[0];
    canv.addEventListener("mousedown", handle_mouse_down_cursor, false);
    canv.addEventListener("mousemove", handle_mouse_move_cursor, false);
    canv.addEventListener("mouseup",   handle_mouse_up_cursor,   false);
    canv.addEventListener("mouseout",  handle_mouse_up_cursor,   false);
});

function handle_mouse_down_cursor(evt) {
    if (edit_mode != "SELECTING") return;

    var hitTest_result = project.hitTest(currentMouse);

    console.log(hitTest_result)

    if (!hitTest_result){

        project.deselectAll();
        remove_selection_rects();
        selection_start_pt = currentMouse;
        is_selecting_with_mouse = true;

    } else if (hitTest_result.item.selected) {

        edit_mode = "TRANSFORMING";
        is_transforming_with_mouse = true;
        selected_group.grab_pt = selected_group.position.subtract(currentMouse);

    }
}

function handle_mouse_move_cursor(evt) {
    if (edit_mode != "SELECTING" || !is_selecting_with_mouse) return;

    var mouse_pt = new Point(evt.pageX, evt.pageY)

    // redraw the rectangle for selection in progress
    if (selection_in_progress_rect) selection_in_progress_rect.remove();
    selection_in_progress_rect = new Shape.Rectangle(selection_start_pt, mouse_pt)
    selection_in_progress_rect.strokeColor = color_PETER_RIVER;
    selection_in_progress_rect.fillColor = color_PETER_RIVER;
    selection_in_progress_rect.fillColor.alpha = 0.05;

    items =  select_items_in_rect();

    project.deselectAll();
    for (var i=0; i<items.length; i++){
        items[i].selected = true;
    }
}

function handle_mouse_up_cursor(evt){
    if (edit_mode != "SELECTING" || !is_selecting_with_mouse) return;

    if (selection_in_progress_rect) selection_in_progress_rect.remove();

    remove_selection_rects();

    selected_group = new Group(project.selectedItems)
    selected_group_rect = new Shape.Rectangle(selected_group.bounds)
    selected_group_rect.fillColor = color_PETER_RIVER;
    selected_group_rect.fillColor.alpha = 0.05;
    selected_group.addChild(selected_group_rect);

    project.deselectAll();
    selected_group.selected = true;

    is_selecting_with_mouse = false;
}


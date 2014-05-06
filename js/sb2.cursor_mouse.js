// make the paper scope global, by injecting it into window:
paper.install(window);

var selection_start_pt;

var selection_in_progress_rect = null;

var selected_group,             // group of selected objects
    selected_group_rect;        // rectangle to mark out selection bounds

var is_selecting = false;

$(document).ready(function() {

    var cursor_tool = new Tool();

    cursor_tool.onMouseDown = function(event) {

        if (edit_mode != "SELECTING") return;

        selection_start_pt = event.point;

        is_selecting = true;
    }

    cursor_tool.onMouseDrag = function(event) {
        
        if (edit_mode != "SELECTING" || !is_selecting) return;

        // redraw the rectangle for selection in progress
        if (selection_in_progress_rect) selection_in_progress_rect.remove();
        selection_in_progress_rect = new Shape.Rectangle(selection_start_pt, event.point)
        selection_in_progress_rect.strokeColor = color_PETER_RIVER;
        selection_in_progress_rect.fillColor = color_PETER_RIVER;
        selection_in_progress_rect.fillColor.alpha = 0.1;

        items =  project.getItems({
            bounds: function(rect) {
                return selection_in_progress_rect.bounds.contains(rect);
            },
            class: Path
        });

        project.deselectAll();
        for (var i=0; i<items.length; i++){
            items[i].selected = true;
        }

    }

    cursor_tool.onMouseUp = function(event) {
            
        if (edit_mode != "SELECTING" || !is_selecting) return;

        if (selection_in_progress_rect) selection_in_progress_rect.remove();

        selected_group = new Group(project.selectedItems)
        selected_group_rect = new Shape.Rectangle(selected_group.bounds)
        selected_group.addChild(selected_group_rect);

        project.deselectAll();
        selected_group.selected = true;

        is_selecting = false;
    }
});

var selection_start_pt;

var selection_in_progress_rect = null;

var selected_group,             // group of selected objects
    selected_group_rect;        // rectangle to mark out selection bounds

function select_items_in_rect(){
    var items_raster =  project.getItems({ position: pos_fn, class: Raster });
    var items_path =  project.getItems({ position: pos_fn, class: Path });

    return items_raster.concat(items_path);
}


function pos_fn(pos) {
    return selection_in_progress_rect.bounds.contains(pos);
}


// uses very basic assuption that every shape is a selection rect
function remove_selection_rects(){
    selection_rects =  project.getItems({class: Shape});

    for (var i=0; i<selection_rects.length; i++){
        selection_rects[i].remove();
    }
}

function draw_selection_in_progress_rect(pt1, pt2){

    if (selection_in_progress_rect) selection_in_progress_rect.remove();

    selection_in_progress_rect = new Shape.Rectangle(pt1, pt2)
    selection_in_progress_rect.strokeColor = color_PETER_RIVER;
    selection_in_progress_rect.fillColor = color_PETER_RIVER;
    selection_in_progress_rect.fillColor.alpha = 0.05;
}

function make_selection_group(){

    selected_group = new Group(project.selectedItems)
    selected_group_rect = new Shape.Rectangle(selected_group.bounds)
    selected_group_rect.fillColor = color_PETER_RIVER;
    selected_group_rect.fillColor.alpha = 0.05;
    selected_group.addChild(selected_group_rect);
    selected_group.selected = true;

}
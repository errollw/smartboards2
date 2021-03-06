var selection_start_pt;

var selection_in_progress_rect = null;

var selected_items_rect;        // rectangle to mark out selection bounds

var ctrl_pts_resize = [],
    ctrl_pts_rotate = [];

function select_items_in_rect(){
    var items_raster =  project.getItems({ position: pos_fn, class: Raster });
    var items_path =  project.getItems({ position: pos_fn, class: Path });
    var items_text =  project.getItems({ position: pos_fn, class: PointText });

    return items_raster.concat(items_path.concat(items_text));
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


function make_selection_rect(){

    // don't bother if nothing is selected
    if (project.selectedItems.length == 0) return;

    // create the rect for selected items
    selected_items_rect = new Shape.Rectangle(get_selected_items_bounds())
    selected_items_rect.fillColor = color_PETER_RIVER;
    selected_items_rect.fillColor.alpha = 0.05;
    selected_items_rect.selected = true;

    initialize_ctrl_pts();
}

function deselect_all(){
    remove_selection_rects();
    project.deselectAll();
}

// loop over all project items to pull items out of groups
function flatten_project(){

    var groups = project.getItems({class: Group});

    _.each(groups, function(grp){

        // don't modify the layer
        if(grp instanceof Layer) return;

        // copy each item to the single active layer
        var items = grp.children;
        _.each(items, function(itm){ itm.copyTo(project.activeLayer); });

        // finally get rid of the group
        grp.remove();
        delete grp
    });
}

// gets overall bounds of all selected items with reduce
function get_selected_items_bounds(){

    // ned to initialize accumulator
    var acc = project.selectedItems[0].bounds

    return _.reduce(project.selectedItems, function(sel_bounds, sel_item) {
        return sel_bounds.unite(sel_item.bounds);
    }, acc);
}
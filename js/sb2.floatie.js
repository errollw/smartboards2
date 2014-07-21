var is_floatie_open = false;

$(document).ready(function() {

    $('#floatie #trash').click(remove_selected_items);

    $('#floatie #send_to_back').click(send_selected_items_to_back);

    $('#floatie #send_to_front').click(send_selected_items_to_front);
	
	$('#floatie #clone').click(clone_selected_items);


    hide_floatie();

});

function remove_selected_items(){
    _.forEach(project.selectedItems, function(sel_item){
        sel_item.remove();
    });
	view.update();
	hide_floatie();
}

function send_selected_items_to_back(){
	_.forEach(project.selectedItems, function(sel_item){
        sel_item.sendToBack();
    });
	deselect_all();
	view.update();
	hide_floatie();
}

function send_selected_items_to_front(){
	_.forEach(project.selectedItems, function(sel_item){
        sel_item.bringToFront();
    });
	deselect_all();
	view.update();
	hide_floatie();
}

function clone_selected_items() {
	hide_floatie();
	remove_selection_rects();
	var clonedItems = [];
	_.forEach(project.selectedItems, function(sel_item){
		var clone = sel_item.clone();
		clone.position = new Point(clone.position.x + 50, clone.position.y + 50);
		clonedItems.push(clone);
		sel_item.selected = false;
	});
	_.forEach(clonedItems, function(e) {
		e.selected = true;
	});
	make_selection_rect();
	show_floatie(selected_items_rect.position);
	view.update();
}

function toggle_floatie(){
	if (!is_floatie_open){
		$('#floatie, #floatie-triangle').hide();
	} else {
		$('#floatie, #floatie-triangle').show();
	}
	is_floatie_open = !is_floatie_open;
}

function hide_floatie(){
	$('#floatie, #floatie-triangle').hide();
}

function show_floatie(point){
	$('#floatie, #floatie-triangle').show();
	$('#floatie, #floatie-triangle').css({
		top: point.y,
		left: point.x
	});
}
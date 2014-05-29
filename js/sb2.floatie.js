var is_floatie_open = false;

$(document).ready(function() {

    $('#floatie #trash').click(remove_selected_items);

    $('#floatie #send_to_back').click(send_selected_items_to_back);

    $('#floatie #send_to_front').click(send_selected_items_to_back);

    $('#floatie').click(hide_floatie);

    hide_floatie();

});

function remove_selected_items(){
	selected_group.remove();
}

function send_selected_items_to_back(){
	selected_group.sendToBack();
	deselect_all();
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
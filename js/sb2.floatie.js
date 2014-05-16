function make_floatie_widget(){
	
}

$(document).ready(function() {

    $('#floatie #trash').click(remove_selected_items);

    $('#floatie #send_to_back').click(send_selected_items_to_back);

    $('#floatie #send_to_front').click(flatten_project);

});

function remove_selected_items(){
	selected_group.remove();
}

function send_selected_items_to_back(){
	selected_group.sendToBack();
	deselect_all();
}
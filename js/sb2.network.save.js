// make the paper scope global, by injecting it into window:
paper.install(window);

var save_timeout = moment.duration(3, 'seconds');

var lastmod_client = moment();

function save(){

    // don't save if you're currently selecting or transforming
    if (project.selectedItems.length > 0) {
        console.log("Not saving, selected items: " + project.selectedItems);
        debounced_save();
        return;
    }

	json_string = project.exportJSON({asString:true});

    function resp_fn(r){
        if (r.success) {
        	lastmod_client = moment();
        	console.log("Saved at " + lastmod_client.format("HH:mm:ss"));
        } else {
        	console.log("Save FAILED at: " + lastmod_client.format("HH:mm:ss") + "!");
        }
    }

    // update board version
    board_ver = board_ver + 1;

    // do the AJAX post to upload the data
	$.post( "cgi-bin/upload_board_json.py", {
        'r_id': r_id,
        'json_data': json_string,
        'ver': board_ver
    }, resp_fn);
}

var debounced_save;

// Schedule a debounced save every time a user releases finger or mouse from canvas
$(document).ready(function(){

    var canvas = document.getElementById('myCanvas');

    debounced_save = _.debounce(save, save_timeout.asMilliseconds());

    canvas.addEventListener("mouseup", debounced_save);
    canvas.addEventListener("touchend", debounced_save);
});
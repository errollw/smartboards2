// make the paper scope global, by injecting it into window:
paper.install(window);

var save_timeout = moment.duration(15, 'seconds');

var lastmod_client = moment();

var debounced_save, waitingToSave = false, savingOnUnload = false;


function save(callback){
console.log("Saving...");
    // don't save if you're currently selecting or transforming
    if (project.selectedItems.length > 0) {
        console.log("Not saving, selected items: " + project.selectedItems);
        debounced_save();
        return;
    }

	json_string = JSON.stringify(tidyJSONProject(project.exportJSON({asString:false})));

    function resp_fn(r){
        if (r.success) {
        	lastmod_client = moment();
        	console.log("Saved at " + lastmod_client.format("HH:mm:ss"));
			
			var imageCount = 0;
			if (project.layers[0] && project.layers[0].children) {
				var imageCount = _.reduce(_.map(project.layers[0].children, function(el) {
					return (el instanceof Raster) ? 1 : 0;
				}), function(sum, num) {
					return sum + num;
				});
			}
			logAction(r_id, "contentedit", "images=" + imageCount);
			waitingToSave = false;
			if (typeof(callback) === "function") callback();
        } else {
        	console.log("Save FAILED at: " + lastmod_client.format("HH:mm:ss") + "!");
        }
    }

    // update board version
    board_ver = board_ver + 1;

    // do the AJAX post to upload the data
	$.ajax({
		"url": "cgi-bin/upload_board_json.py",
		"type": "post",
		"data": {
			'r_id': r_id,
			'json_data': json_string,
			'ver': board_ver
		},
		"success":resp_fn,
		"async": !savingOnUnload
	});
}


// Schedule a debounced save every time a user releases finger or mouse from canvas
$(document).ready(function(){

    var canvas = document.getElementById('myCanvas');
	
	debounced_save = _.debounce(save, save_timeout.asMilliseconds());
	
    var debounced_save_wrapper = function() {
		waitingToSave = true;
		debounced_save();
	};

    canvas.addEventListener("mouseup", debounced_save_wrapper);
    canvas.addEventListener("touchend", debounced_save_wrapper);
});

$(window).unload(function() {
	if (waitingToSave) {
		deselect_all();
		savingOnUnload = true;
		save();
	}
});
// make the paper scope global, by injecting it into window:
paper.install(window);

var save_timeout = moment.duration(15, 'seconds');

var lastmod_client = moment();

var debounced_save, waitingToSave = false, savingOnUnload = false;


// Function that returns whether an item should be removed (true) or not (false) because it is inaccessible
function removeInaccessibleItemsHelper(item) {
	if (!(view.bounds.intersects(item.strokeBounds))) {
		// The bounds of the item do not intersect with the bounds of the view, so it is definitely not accessible
		return true;
	} else if (item instanceof Path) {
		// The bounds do intersect, but a path could still be inaccessible
		// An example would be a circular path, scaled to be too big to fit on the screen
		for (var i = 0; i < item.segments.length; i++) {
			if (view.bounds.contains(item.segments[i].point)) {
				// At least one point still on screen, so it is accessible
				return false;
			}
		}
		// If we're still in here, then it means there were no points that were accessible
		// Therefore, it is safe to remove the item
		return true;
	} else {
		// It is still possible that the item is inaccessible, but we are not able to determine
		// An example would be an image that is rotated by 45 degrees, and placed such that the
		// image itself is not visible, but its bounding box overlaps the corner of the canvas.
		return false;
	}
}

function removeInaccessibleItems(){
	// Function to remove items that the user can no longer reach
	if (project.layers[0]) {
		var items = project.getItems(function(){return true;});
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (removeInaccessibleItemsHelper(item)) {
				console.log("Removing item", item);
				item.remove();
			} else {
			}
		}
	}
}


function save(callback){
console.log("Saving...");
    // don't save if you're currently selecting or transforming
    if (project.selectedItems.length > 0) {
        console.log("Not saving, selected items: " + project.selectedItems);
        debounced_save();
        return;
    }
	
	// Remove the inaccessible items from the canvas
	removeInaccessibleItems();
	
	// Remove single item paths, shapes etc, and export to JSON string
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
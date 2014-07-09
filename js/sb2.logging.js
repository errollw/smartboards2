// Add a function to log information
// The logAction function is called from other parts of the program

var logAction;

$(function() {
	logAction = function(aRoom, aInteraction, aData) {
		$.ajax({
			url: "cgi-bin/log.py",
			type: 'post',
			data: {
				'r_id': aRoom,
				'interaction': aInteraction,
				'data': aData
			},
			success: function(json, status, jqXHR) {
				if (json.success) {
					// Successfully logged
				} else {
					// Failed to log
					console.log("Failed to log. Interaction = " + aInteraction + ", data = " + aData, json);
				}
			},
			error: function(json) {
				// Failed to log
				console.log("Failed to log. Interaction = " + aInteraction + ", data = " + aData, json);
			}
		});
	};
});
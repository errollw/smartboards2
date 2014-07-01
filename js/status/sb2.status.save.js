
var status_data = {};	// object for entire room settings
var users = [];			// list of users in this room


function saveSuccess() {
	$.simpleMessage("flashMessage", "Saved successfully");
};

function saveFail() {
	$.simpleMessage("flashMessage", "Save failed");
};


function save_status(user_section){
	$.simpleMessage("show", "Saving message...");
	
	users = [];
	extract_status(user_section);
	status_data.users = users;

	json_string = JSON.stringify(status_data);
	
	$.ajax({
		url: "cgi-bin/save_status.py",
		type: 'post',
		data: {
			'r_id': r_id,
			'json_data': json_string
		},
		success: function(json, status, jqXHR) {
			if (json.success) {
				saveSuccess();
			} else {
				saveFail();
			}
		},
		error: function(json) {
			saveFail();
		}
	});
	
}

function extract_status(user_section){
	var user = {};

	user.u_id = $(user_section).data('u_id').toLowerCase();
	user.status = $(user_section).find('input[name="input_status"]').val();
	user.status_last_mod = moment().unix();
	
	// set expiry date on statuses
	var dur = $(user_section).find('.duration.selected');
	if (dur.hasClass('1hr'))
		user.status_expiry = moment().add('hours', 1).unix();
	if (dur.hasClass('4hr'))
		user.status_expiry = moment().add('hours', 4).unix();
	if (dur.hasClass('day'))
		user.status_expiry = moment().add('days',  1).unix();
	if (dur.hasClass('inf'))
		user.status_expiry = moment().add('years', 1).unix(); // not quite forever...

	users.push(user);

}
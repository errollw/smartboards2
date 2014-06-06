
var status_data = {};	// object for entire room settings
var users = [];			// list of users in this room


function resp_fn(resp){
	// TODO: BETTER RESPONSE
	console.log("saved maybe")
}


function save_status(user_section){
	users = [];

	extract_status(user_section);

	status_data.users = users;

	json_string = JSON.stringify(status_data)

	$.post( "cgi-bin/save_status.py", {'r_id': r_id, 'json_data': json_string }, resp_fn);
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
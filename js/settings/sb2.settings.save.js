
var room_settings = {};	// object for entire room settings
var users = [];			// list of users in this room


function resp_fn(resp){
	// TODO: BETTER RESPONSE
	console.log("saved maybe")
}


function save_settings(){
	users = [];

	var user_sections = $('section.user');
	_(user_sections).each(extract_user_details)

	room_settings.users = users;
	console.log(room_settings);

	json_string = JSON.stringify(room_settings)

	$.post( "cgi-bin/save_room_data.py", {'r_id': r_id, 'json_data': json_string }, resp_fn);
}

function extract_user_details(user_section){
	var user = {};

	user.u_id = $(user_section).find('input[name="input_id"]').val().toLowerCase();;
	user.name = $(user_section).find('input[name="input_name"]').val();
	user.description = $(user_section).find('input[name="input_description"]').val();

	user.status = $(user_section).find('input[name="input_status"]').val();
	user.status_last_mod = moment().unix();
	user.status_expiry = moment().add('years', 1).unix();
	
	user.img_src = $(user_section).find('input[name="input_imageUrl"]').val();
	user.webpage_src = $(user_section).find('input[name="input_webpageUrl"]').val();

	users.push(user);
}
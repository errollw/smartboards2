
var room_settings = {};	// object for entire room settings
var users = [];			// list of users in this room

function save_settings(){
	$("#messageBox").find("div").text("Saving changes...").parent().fadeIn();

	users = [];

	var user_sections = $('section.user');
	_(user_sections).each(function(e) {
		users.push(extract_user_details(e));
	})

	room_settings.users = users;

	json_string = JSON.stringify(room_settings)
	
	function saveSuccess() {
		$(".deleted_user").closest("section").slideUp();
		$("#messageBox").find("div").text("Saved successfully").parent().delay(2000).fadeOut();
	};
	function saveFail() {
		$("#messageBox").find("div").text("Save failed").parent().delay(2000).fadeOut();
	};
	
	$.ajax({
		url: "cgi-bin/save_room_data.py",
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

	return user;
}
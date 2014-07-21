var urlParams;

// Default to loading room ss20
var r_id = "r_ss20";

// pic that gets loaded if no profile pic is present
var no_pic_url = 'assets/no_profile_pic.png';

function initializeUrlParams() {
	var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
}


$(document).ready(function(){

    initializeUrlParams();
    if (urlParams['r_id']) r_id = urlParams['r_id'].toLowerCase();

    stripped_r_id = (r_id.lastIndexOf('r_id', 0) === 0 ?
        r_id : r_id.substring(2, r_id.length)).toUpperCase();

    $('h1').text(stripped_r_id + ' NetBoard statuses')

    $.getJSON("content/room_data_"+r_id+".json", function(json_data){
        _(json_data.users).each(add_user);
    });
    
	$("#btn_returntoindex").click(function() {
		window.location.href = window.location.href.replace("set_status.html", "index.html");
	});
});


function add_user(user){

	var usr_sec = $('<section/>').addClass('user');
    usr_sec.data('u_id', user.u_id)
    console.log(usr_sec.data())

	var img = $('<img/>').attr('src', user.img_src ? user.img_src : no_pic_url);
    img.attr('onerror', "this.src='" + no_pic_url + "';");

    var form_div = $('<div/>').addClass('form');

    var text_name = $('<p/>').addClass('user-name mobile-only').text(user.name)

    var text_status = $('<aside/>').html('Status'),
        input_status = $('<input placeholder="write status here"/>').attr('name', 'input_status').val(user.status);

    var text_duration = $('<aside/>').html('Duration'),
    	duration_holder = $('<div/>').addClass('duration-holder'),
        dur_1 = $('<div/>').addClass('duration 1hr').text('1 hour'),
        dur_2 = $('<div/>').addClass('duration 4hr').text('4 hours'),
        dur_3 = $('<div/>').addClass('duration day').text('24 hours'),
        dur_4 = $('<div/>').addClass('duration inf').addClass('selected').text('forever');

    form_div.append(text_status).append(input_status);
    duration_holder.append(dur_1).append(dur_2).append(dur_3).append(dur_4);
    form_div.append(text_duration).append(duration_holder);
	usr_sec.append(img).append(text_name).append(form_div);

    duration_holder.children(".duration").click(function(){
        duration_holder.children(".duration").removeClass('selected');
        $(this).addClass('selected');
    });

    // make and add button elements
    var clear_status_button = $('<button/>').text('clear status').addClass('ALIZARIN');
    var save_status_button = $('<button/>').text('save status').addClass('EMERALD');
    form_div.append(save_status_button).append(clear_status_button);

    // handle button clicks
    save_status_button.click(function(){save_status(usr_sec)});
    clear_status_button.click(function(){
        input_status.val("");
        save_status(usr_sec);
    });

	$('#users').append(usr_sec);
}
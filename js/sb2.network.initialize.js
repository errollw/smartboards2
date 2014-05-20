var urlParams;

// Default to loading room SS20
var r_id = "r_SS20";


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
    if (urlParams['r_id']) r_id = urlParams['r_id'];

    $.getJSON("content/room_data_"+r_id+".json", function(json_data){

    	var gap_between_users = 1980 / json_data.users.length;
    	for (var i=0; i<json_data.users.length; i++){
    		addUser(json_data.users[i], i*gap_between_users)
    	}

    	console.log(json_data)
    });
    
});

function addUser(user, y_pos){

	var header = $('<header/>').css('top', y_pos + 'px');
	var img = $('<img/>').attr('src', user.img_src);
	var sec_details = $('<section/>');
	var p_name = $('<p/>').addClass('title').text(user.name);
	var p_desc = $('<p/>').addClass('subtitle').text(user.description);

	header.append(img).append(sec_details)
	sec_details.append(p_name).append(p_desc)
	$('body').append(header);
}
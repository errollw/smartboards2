var urlParams;

// Default to loading room SS20
var r_id = "r_ss20";

// distance in pixels between users
var gap_between_users;

// time between whole page refreshes
var refresh_timeout_dur = moment.duration(5, 'minutes');

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

    // avoid caching .json files
    $.ajaxSetup({ cache: false });

    $.getJSON("content/room_data_"+r_id+".json", function(json_data){

    	gap_between_users = 1980 / json_data.users.length;
    	for (var i=0; i<json_data.users.length; i++){
    		add_user(json_data.users[i], i*gap_between_users)
    	}
    });

    // refresh the whole page (no cache) every 2 minutes
    window.setTimeout(refresh_page, refresh_timeout_dur.asMilliseconds());
    
});


function add_user(user, y_pos){

    // fist create the basic user components
	var header = $('<header/>').css('top', y_pos + 'px');
	var img = $('<img/>').attr('src', user.img_src);
	var sec_details = $('<section/>');
	var p_name = $('<p/>').addClass('title').text(user.name);
    var p_desc = $('<p/>').addClass('subtitle').text(user.description);
	
    // then add them
    header.append(img).append(sec_details)
    sec_details.append(p_name).append(p_desc)
    $('aside').before(header);

    // if user has a webpage...
    if (user.webpage_src) {
        
        var iframe = $('<iframe/>', {scrolling: "no", 'src': user.webpage_src});
        iframe.css('top', y_pos + 'px').height(gap_between_users);
        var header_bg = $('<div/>').addClass('header_bg').css('top', y_pos + 'px');

        $('canvas').before(iframe);
        $(header).before(header_bg);
    }

    // if user has a status...
    if (user.status) {
        
        var status = $('<div/>').addClass('status');
        var status_msg = $('<p/>').addClass('status_msg').text(user.status);
        var status_time = $('<p/>').addClass('status_time').text('updated ' + moment(user.status_last_mod).fromNow());

        status.append(status_msg).append(status_time);
        $(header).after(status);

        // refresh status time every minute
        var status_refresh_interval_dur = moment.duration(1, 'minutes');
        window.setInterval(function(){
            status_time.text('updated ' + moment(user.status_last_mod).fromNow())
        }, status_refresh_interval_dur.asMilliseconds());
    }

}

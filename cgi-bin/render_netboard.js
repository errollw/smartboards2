var system = require('system');

var base_url = 'http://eww23.user.srcf.net/smartboards2/?r_id=',
	query_str_end = '&render=true'

if (system.args.length === 1) {
    console.log('pass in room ids as arguments (e.g. r_ss20 r_ss22)');
    phantom.exit();
}

var number_of_rooms_to_render = system.args.length-1;
var rendered_rooms = 0;

system.args.forEach(function (arg, i) {

	// skip the first argument, it's the filename
    if (i !== 0) {
    	delayed_render(arg)
	}
});


function delayed_render(r_id){

	// create a new webpage for rendering
	var page = require('webpage').create();

	// open the room, and render after a short timeout (for AJAX)
	page.open(base_url + r_id + query_str_end, function() {
		window.setTimeout(function () {
	    	page.render(r_id+'.png');
			console.log('rendered ' + r_id);
			exit_when_complete();
	    }, 2000);
	});
}


function exit_when_complete(){
	rendered_rooms++;
	if (rendered_rooms == number_of_rooms_to_render) {
		console.log('done, exiting');
		phantom.exit()
	};
}

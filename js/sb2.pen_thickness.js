// thickness is either "THIN", "MEDIUM", or "THICK"
var pen_thickness = "MEDIUM";

var pen_thickness_choices = {
	"pen_thin_container"   : "THIN",
	"pen_medium_container" : "MEDIUM",
	"pen_thick_container"  : "THICK"
}
var default_pen_thickness = 'MEDIUM';

var pen_thickness_multipliers = {
	"THIN"   : 0.5,
	"MEDIUM" : 1,
	"THICK"  : 3
}

var pen_thickness_widths = {
	"THIN"   : 4,
	"MEDIUM" : 8,
	"THICK"  : 20
}

var is_pen_thickness_open = false,
	clicked_id = 'pen_medium_container';


$(document).ready(function(){

	build_pen_thickness_controls();

	$('.pen_thickness_container').click(toggle_pen_thickness);

	close_pen_thickness_controls();
});


function build_pen_thickness_controls(){

	var pen_thin = $("<div/>").attr('id','pen_thin_container').addClass('pen_thickness_container'),
		pen_medium = $("<div/>").attr('id','pen_medium_container').addClass('pen_thickness_container'),
		pen_thick = $("<div/>").attr('id','pen_thick_container').addClass('pen_thickness_container');

	_([pen_thin,pen_medium,pen_thick]).each(function(container){
		container.append($("<div/>").addClass('pen_thin'));
		container.append($("<div/>").addClass('pen_medium'));
		container.append($("<div/>").addClass('pen_thick'));
	});

	// add controls to container
	$('#pen_thickness_controls').append(pen_thin).append(pen_medium).append(pen_thick);

	// close all except for medium - the default
	$('.pen_thickness_container').addClass('closed');
	pen_medium.removeClass('closed');
}


function toggle_pen_thickness(evt){

	if (is_pen_thickness_open) {

		// set pen_thickness according to clicked icon
		var clicked_id = $(evt.currentTarget).attr('id');
		set_pen_thicknes(pen_thickness_choices[clicked_id]);

		// start drawing once thickness is clicked
		set_edit_mode("DRAWING");

	} else {

		// open the whole pen thickness controls
		$('.pen_thickness_container').removeClass('closed').removeClass('chosen');
		is_pen_thickness_open = true;
	}
}

function set_pen_thicknes(new_pen_thickness){
	pen_thickness = new_pen_thickness;

	// close all thickness controls
	$('.pen_thickness_container').removeClass('chosen');
	$('.pen_thickness_container').addClass('closed');

	// re-open clicked thickness icon
	$('#pen_'+new_pen_thickness.toLowerCase()+'_container').removeClass('closed');
	$('#pen_'+new_pen_thickness.toLowerCase()+'_container').addClass('chosen');

	is_pen_thickness_open = false;
}

function close_pen_thickness_controls(){
	set_pen_thicknes(default_pen_thickness);
}

function get_thickness_multiplier(){
	return pen_thickness_multipliers[pen_thickness];
}

function get_thickness_as_width(){
	return pen_thickness_widths[pen_thickness];
}

function get_pen_thickness(){
	return pen_thickness;
}
// thickness is either "THIN", "MEDIUM", or "THICK"
var pen_thickness = "MEDIUM";

var pen_thickness_choices = {
	"pen_thin_container"   : "THIN",
	"pen_medium_container" : "MEDIUM",
	"pen_thick_container"  : "THICK"
}

var pen_thickness_multipliers = {
	"THIN"   : 0.5,
	"MEDIUM" : 1,
	"THICK"  : 3
}

var is_pen_thickness_open = false;


$(document).ready(function(){

	build_pen_thickness_controls();

	$('.pen_thickness_container').click(toggle_pen_thickness);

	// $('#pen_thin_container   .pen_thin'  ).css('background-color',get_pen_color());
	// $('#pen_medium_container .pen_medium').css('background-color',get_pen_color());
	// $('#pen_thick_container  .pen_thick' ).css('background-color',get_pen_color());
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

	$('#pen_thickness_controls').append(pen_thin).append($("<div/>").addClass('spacer'));
	$('#pen_thickness_controls').append(pen_medium).append($("<div/>").addClass('spacer'));
	$('#pen_thickness_controls').append(pen_thick);

	// close all except for medium - the default
	$('#pen_thickness_controls .spacer').addClass('closed');
	$('.pen_thickness_container').addClass('closed');
	pen_medium.removeClass('closed');
}


function toggle_pen_thickness(evt){

	if (is_pen_thickness_open) {

		// close all thickness controls
		$('#pen_thickness_controls .spacer').addClass('closed');
		$('.pen_thickness_container').addClass('closed');

		// re-open clicked thickness icon
		$(evt.currentTarget).removeClass('closed');

		// set pen_thickness according to clicked icon
		var clicked_id = $(evt.currentTarget).attr('id');
		pen_thickness = pen_thickness_choices[clicked_id];

		is_pen_thickness_open = false;

		set_edit_mode("DRAWING");

	} else {

		// open the whole pen thickness controls
		$('#pen_thickness_controls .spacer').removeClass('closed')
		$('.pen_thickness_container').removeClass('closed')
		is_pen_thickness_open = true;
	}
}

function get_thickness_multiplier(){
	return pen_thickness_multipliers[pen_thickness];
}

function get_pen_thickness(){
	return pen_thickness;
}
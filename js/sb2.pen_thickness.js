// thickness is either "THIN", "MEDIUM", or "THICK"
var pen_thickness = "MEDIUM";

var is_pen_thickness_open = false;


$(document).ready(function(){

	$('.pen_thickness_container').click(toggle_pen_thickness)

	$('#pen_thin_container .pen_thin').css('background-color',get_pen_color());
	$('#pen_medium_container .pen_medium').css('background-color',get_pen_color());
	$('#pen_thick_container .pen_thick').css('background-color',get_pen_color());
});



function toggle_pen_thickness(clicked_div){

	console.log(clicked_div);

	// $('#pen_thickness').toggleClass('open', !is_pen_thickness_open);
	is_pen_thickness_open = !is_pen_thickness_open;

	if (is_pen_thickness_open) {
		$('#pen_thickness_controls .spacer').removeClass('closed')
		$('.pen_thickness_container').removeClass('closed')

	} else {
		$('#pen_thickness_controls .spacer').addClass('closed')
		$('#pen_thin_container').addClass('closed')
		$('#pen_thick_container').addClass('closed')
	}

}
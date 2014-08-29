
// the colors and their modifiers
var color_TURQUOISE=     "#1abc9c", color_GREEN_SEA=     "#16a085";
var color_EMERALD=       "#2ecc71", color_NEPHRITIS=     "#27ae60";
var color_PETER_RIVER=   "#3498db", color_BELIZE_HOLE=   "#2980B9";
var color_AMETHYST=      "#9b59b6", color_WISTERIA=      "#8e44ad";
var color_WET_ASPHALT=   "#34495e", color_MIDNIGHT_BLUE= "#2c3e50";
var color_SUN_FLOWER=    "#f1c40f", color_ORANGE=        "#f39c12";
var color_CARROT=        "#e67e22", color_PUMPKIN=       "#d35400";
var color_ALIZARIN=      "#e74c3c", color_POMEGRANATE=   "#c0392b";
var color_CLOUDS=        "#ECF0F1", color_SILVER=        "#BDC3C7";
var color_CONCRETE=      "#95A5A6", color_ASBESTOS=      "#7f8c8d";

// the dimensions of the color picker
var color_picker_rows = 4,
	color_picker_cols = 5;

var color_arrangement = [
	[color_TURQUOISE,  color_EMERALD,   color_PETER_RIVER, color_AMETHYST, color_WET_ASPHALT],
	[color_GREEN_SEA,  color_NEPHRITIS, color_BELIZE_HOLE, color_WISTERIA, color_MIDNIGHT_BLUE],
	[color_SUN_FLOWER, color_CARROT,    color_ALIZARIN,    color_CLOUDS,   color_CONCRETE],
	[color_ORANGE,     color_PUMPKIN,   color_POMEGRANATE, color_SILVER,   color_ASBESTOS]
];

var default_pen_color = color_MIDNIGHT_BLUE;
var pen_color = default_pen_color;

var is_color_picker_open = false;

function build_color_picker(){
	var content = "<div id='color_picker_table'>"

	for(var i=0; i<color_picker_rows; i++){

		for(var j=0; j<color_picker_cols; j++){
			var cell_color = color_arrangement[i][j];
			content += '<span style="background-color:'+cell_color+'"></span>';
		}
	}
	content += "</div>"

	$('#color_picker').append(content);

	$('#color_picker').addClass('closed');

	$('#color_picker').click(function(){
		toggle_color_picker();
	});

	$('#color_picker span').click(function(){
		if (is_color_picker_open){
			$.cookie("penColour", $(this).css("backgroundColor"), {expires:7});
			set_pen_color($(this).css('backgroundColor'));
            if (edit_mode != "TEXT") {
                set_edit_mode("DRAWING");
            }
		}
	});
}


function set_pen_icon_color(){

	// change color of pen icon in main controls
	$('#pen>svg').attr('width', $('#pen').width()+'px');
	$('#pen>svg').attr('height', $('#pen').height()+'px');
	$('#pen path').attr('fill', pen_color);
    
    // text icon
	$('#text>svg').attr('width', $('#text').width()+'px');
	$('#text>svg').attr('height', $('#text').height()+'px');
	$('#text path').attr('fill', pen_color);

	// change color of thickness selector icon
	$('#pen_thin_container   .pen_thin'  ).css('background-color',get_pen_color());
	$('#pen_medium_container .pen_medium').css('background-color',get_pen_color());
	$('#pen_thick_container  .pen_thick' ).css('background-color',get_pen_color());
}

function get_pen_color(){
	return pen_color;
}

function set_pen_color(new_color){
	pen_color = new_color;
	set_pen_icon_color();
}

function toggle_color_picker(){
	if (!is_color_picker_open){
		$('#color_picker').removeClass('closed');
	} else {
		$('#color_picker').addClass('closed');
	}
	is_color_picker_open = !is_color_picker_open;
}

function close_color_picker_controls(){
	$('#color_picker').addClass('closed');
	set_pen_color(default_pen_color);
	is_color_picker_open = false;
}


$(document).ready(function(){
	build_color_picker();
	
	// Load pen colour from cookie if set
	var cookiePenColour = $.cookie("penColour");
	
	$('#pen').load('assets/icon_pen.svg', function() {
		if (typeof cookiePenColour != "undefined") {
			pen_color = cookiePenColour;
		}
		set_pen_icon_color();
	});
	$('#text').load('assets/icon_text.svg', function() {
		if (typeof cookiePenColour != "undefined") {
			pen_color = cookiePenColour;
		}
		set_pen_icon_color();
	});
	
});
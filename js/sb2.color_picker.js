
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

var pen_color = color_MIDNIGHT_BLUE;

var is_color_picker_open = false;

function build_color_picker(){
	var content = "<table>"

	for(var i=0; i<color_picker_rows; i++){
		content += '<tr>';

		for(var j=0; j<color_picker_cols; j++){
			var cell_color = color_arrangement[i][j];
			content += '<td style="background-color:'+cell_color+'"></td>';
		}

	    content += '</tr>';
	}
	content += "</table>"

	$('#color_picker').append(content);

	$('#color_picker').addClass('closed');

	$('#color_picker').click(function(){
		toggle_color_picker();
	});

	$('#color_picker td').click(function(){
		if (is_color_picker_open)
			pen_color = $(this).css('backgroundColor');
	});
}

$(document).ready(function(){
	build_color_picker();
});

function get_pen_color(){
	return pen_color;
}

function set_pen_color(){

}

function toggle_color_picker(){
	if (!is_color_picker_open){
		$('#color_picker').removeClass('closed');
		$('#color_picker').addClass('open');
	} else {
		$('#color_picker').addClass('closed');
		$('#color_picker').removeClass('open');
	}
	is_color_picker_open = !is_color_picker_open;
}
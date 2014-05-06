// Possible edit modes: DRAWING, ERASING, SELECTING, TRANSFORMING
edit_mode = "DRAWING";

$(document).on("keypress", function (evt) {
    var key = (String.fromCharCode(evt.which));

    if(key == 'e') {
  		edit_mode = "ERASING"
  	}

    if(key == 'd') {
      edit_mode = "DRAWING"
    }
});
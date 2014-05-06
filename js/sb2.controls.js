// Possible edit modes: DRAWING, ERASING, SELECTING, TRANSFORMING
edit_mode = "DRAWING";

$(document).on("keypress", function (evt) {
    var key = (String.fromCharCode(evt.which));

    $('#controls div').removeClass('selected');

    if(key == 'd') {
        edit_mode = "DRAWING";
        $('#controls #pen').addClass('selected');
    }

    if(key == 'e') {
        edit_mode = "ERASING";
        $('#controls #eraser').addClass('selected');
    }

    if(key == 'c') {
        edit_mode = "SELECTING";
        $('#controls #cursor').addClass('selected');
    }

    if(key == 't') {
        edit_mode = "TRANSFORMING";
    }

});
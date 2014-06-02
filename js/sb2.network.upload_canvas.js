
// how often to refresh the loaded paperjs json
var auto_upload_canvas_interval_dur = moment.duration(2, 'minutes');

function upload_canvas(){

    var canvas = document.getElementById('myCanvas');
    var dataURL = canvas.toDataURL();

	$.ajax({
	  type: "POST",
	  url: "cgi-bin/upload_canvas_as_image.py",
	  data: { 'r_id': r_id, imgBase64: dataURL }
	}).done(function(){
		console.log("Uploaded canvas at " + moment().format("HH:mm:ss"));
	});
}

function refresh_page(){
    if (is_idle) location.reload(true)
}


$(document).ready(function(){

    // prepare to automatically upload canvas as image
    // window.setInterval(upload_canvas, auto_upload_canvas_interval_dur.asMilliseconds());
    
});
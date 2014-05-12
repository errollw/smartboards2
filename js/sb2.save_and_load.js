// make the paper scope global, by injecting it into window:
paper.install(window);

r_id = "r_SS20";

function save(){

	json_string = project.exportJSON({asString:true});

	$.post( "cgi-bin/upload_json.py", {'r_id': r_id, 'json_data': json_string });

    console.log("SAVED");
}

function load(){

	project.clear();

    $.ajaxSetup({ cache: false });

	$.getJSON("content/"+r_id+".json", function(json_data){
        project.importJSON(json_data);
        view.update();
    });

}

$(document).on("keypress", function (evt) {
    var key = (String.fromCharCode(evt.which));

    if(key == 's') {
  		save();
  	}

  	if(key == 'l') {
  		load();
  	}
});

// load when document has loaded
$(document).ready(load);


// automatically saving

var autosave_timeout = null,
    autosave_timeout_ms = 5000;

function schedule_autosave(){

    window.clearTimeout(autosave_timeout);
    autosave_timeout = window.setTimeout(save, autosave_timeout_ms);
}
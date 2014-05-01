// make the paper scope global, by injecting it into window:
paper.install(window);

r_id = "r_SS20";

function save(){

	json_string = project.exportJSON({asString:true});

	$.post( "cgi-bin/upload_json.py", {'r_id': r_id, 'json_data': json_string });
}

function load(){

	project.clear();

	$.getJSON("content/"+r_id+".json", function(json_data){
      project.importJSON(json_data);
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
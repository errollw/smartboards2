// make the paper scope global, by injecting it into window:
paper.install(window);

// how often to refresh the loaded paperjs json
var autoload_interval_dur = moment.duration(5, 'seconds');

function load(){

    $.ajaxSetup({ cache: false });
	$.getJSON("content/"+r_id+".json", function(json_data){

        // update board version number, it's the last element
        if (json_data.length > 1){
            board_ver = json_data[json_data.length-1]
        }

        // clear all before importing data
        project.clear();
        project.importJSON(json_data);
        view.update();

        // update client last-mod
        lastmod_client = moment();

        console.log("Loaded at " + lastmod_client.format("HH:mm:ss"));
    });
}


function load_if_out_of_date(){

    // if not idle, skip attempting to load
    if (!is_idle) return;

    // GET the last time the server json file was modified
    $.get( "cgi-bin/get_board_ver.py", {'r_id': r_id}, function(resp){

        // resp.lastmod is Epoch TIMESTAMP (in seconds, not ms)
        var board_ver_server = resp.ver

        // check if out of date by minute granularity to avoid global clock issues
        if (board_ver_server > board_ver){
            console.log("Client out of date, "
                + board_ver_server  + " vs "
                + board_ver + " loading...");
            load();
        }
    });
}


function refresh_page(){
    if (is_idle) location.reload(true)
}


$(document).ready(function(){

    // avoid caching .json files
    $.ajaxSetup({ cache: false });

    // load, and prepare to automatically re-load data
    load();
    window.setInterval(load_if_out_of_date, autoload_interval_dur.asMilliseconds());
    
});
// make the paper scope global, by injecting it into window:
paper.install(window);

r_id = "r_SS20";

function load(){

	$.getJSON("content/"+r_id+".json", function(json_data){

        project.clear();
        project.importJSON(json_data);
        view.update();

        lastmod_client = moment();

        console.log("Loaded at " + lastmod_client.format("HH:mm:ss"));
    });
}


var autoload_interval_dur = moment.duration(5, 'seconds');

function schedule_autoloading(){
    window.setInterval(load_if_out_of_date, autoload_interval_dur.asMilliseconds());
}


function load_if_out_of_date(){

    $.get( "cgi-bin/get_last_mod.py", {'r_id': r_id}, function(resp){

        // resp.lastmod is Epoch TIMESTAMP (in seconds, not ms)
        var lastmod_server = moment.unix(resp.lastmod)

        if (lastmod_client.isBefore(lastmod_server)){
            console.log("Client out of date, loading...");
            load();
        }
    });

}

var refresh_timeout_dur = moment.duration(2, 'minutes');

$(document).ready(function(){

    // avoid caching .json files
    $.ajaxSetup({ cache: false });

    // load, and prepare to re-load data
    load();
    schedule_autoloading();

    // refresh the whole page (no cache) every 2 minutes
    window.setTimeout(function(){location.reload(true);}, refresh_timeout_dur.asMilliseconds());
    
});
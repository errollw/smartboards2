// make the paper scope global, by injecting it into window:
paper.install(window);

r_id = "r_SS20";

function load(){

	$.getJSON("content/"+r_id+".json", function(json_data){

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

    $.get( "cgi-bin/get_last_mod.py", {'r_id': r_id}, function(resp){

        // resp.lastmod is Epoch TIMESTAMP (in seconds, not ms)
        var lastmod_server = moment.unix(resp.lastmod)

        // check if out of date by minute granularity to avoid global clock issues
        if (lastmod_client.isBefore(lastmod_server, 'minute')){
            console.log("Client out of date, "
                + lastmod_client.format("HH:mm:ss") + " vs "
                + lastmod_server.format("HH:mm:ss") + " loading...");
            load();
        }
    });

}

var refresh_timeout_dur = moment.duration(2, 'minutes');
var autoload_interval_dur = moment.duration(5, 'seconds');

$(document).ready(function(){

    // avoid caching .json files
    $.ajaxSetup({ cache: false });

    // load, and prepare to automatically re-load data
    load();
    window.setInterval(load_if_out_of_date, autoload_interval_dur.asMilliseconds());

    // refresh the whole page (no cache) every 2 minutes
    window.setTimeout(function(){location.reload(true);}, refresh_timeout_dur.asMilliseconds());
    
});
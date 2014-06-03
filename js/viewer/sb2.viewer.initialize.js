var urlParams;

// make the paper scope global, by injecting it into window:
paper.install(window);

// Default to loading room SS20
var r_id = "r_SS20";

// pic that gets loaded if no profile pic is present
var no_pic_url = 'assets/no_profile_pic.png';

function initializeUrlParams() {
	var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
}


$(document).ready(function(){

    initializeUrlParams();
    if (urlParams['r_id']) r_id = urlParams['r_id'].toLowerCase();

    // set image url
    $("#room-img").attr('src','content/'+r_id+'.png')

    // strip room ID to get room name
    stripped_r_id = (r_id.lastIndexOf('r_id', 0) === 0 ?
        r_id : r_id.substring(2, r_id.length)).toUpperCase();

    // set title of page
    $('h1').text(stripped_r_id + ' NetBoard');

    // show the last time the server json file was modified
    $.get( "cgi-bin/get_last_mod.py", {'r_id': r_id}, function(resp){
        // resp.lastmod is Epoch TIMESTAMP (in seconds, not ms)
        $('#room-last-mod').text('Last updated ' + moment.unix(resp.lastmod).fromNow() +'.')
    });

    $('#open_editor').click(function(){
        var url = window.location.href;
        url = url.substring(0, url.lastIndexOf("/") + 1) + '?r_id=' + r_id;
        window.open(url,'_blank');
    });
    
});
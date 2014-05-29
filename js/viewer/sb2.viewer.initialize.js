var urlParams;

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
    if (urlParams['r_id']) r_id = urlParams['r_id'];

    stripped_r_id = (r_id.lastIndexOf('r_id', 0) === 0 ?
        r_id : r_id.substring(2, r_id.length)).toUpperCase();

    $('h1').text(stripped_r_id + ' NetBoard');

    // $.getJSON("content/room_data_"+r_id+".json", function(json_data){
    //     _(json_data.users).each(add_user);
    // });

    resize();
    
});


function resize(){
    var board_outer = $('#board-container');
    var board_inner = $('#board-inner');
    board_outer.height(board_outer.width()*16/9);
    board_inner.height(board_inner.width()*16/9);
    board_outer.css('border-radius', board_outer.width()*0.03);
}

function add_user(user){

}
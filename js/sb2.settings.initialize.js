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

    $('h1').text(stripped_r_id + ' room settings')

    $("#sortable").sortable();
    $("#sortable").disableSelection();

    $('#save_settings').click(save_settings)
    $('#add_user').click(add_user)

    $.getJSON("content/room_data_"+r_id+".json", function(json_data){
        _(json_data.users).each(add_user);
    });
    
});


function add_user(user){

	var usr_sec = $('<section/>').addClass('user');

	var img = $('<img/>').attr('src', user.img_src ? user.img_src : no_pic_url);
    img.attr('onerror', "this.src='" + no_pic_url + "';");

    var form_div = $('<div/>').addClass('form');

    var text_id = $('<aside/>').text('User ID'),
        input_id = $('<input/>').attr('name', 'input_id').val(user.u_id);

    var text_name = $('<aside/>').text('Name'),
        input_name = $('<input/>').attr('name', 'input_name').val(user.name);

    var text_description = $('<aside/>').text('Description'),
        input_description = $('<input/>').attr('name', 'input_description').val(user.description);

    var text_imageUrl = $('<aside/>').text('Image URL'),
        input_imageUrl = $('<input/>').attr('name', 'input_imageUrl').val(user.img_src);

    var text_status = $('<aside/>').html('Status <br> <span>optional</span>'),
        input_status = $('<input/>').attr('name', 'input_status').val(user.status);

    var text_webpageUrl = $('<aside/>').html('Webpage URL <br> <span>optional</span>'),
        input_webpageUrl = $('<input/>').attr('name', 'input_webpageUrl').val(user.webpage_src);

    var delete_button = $('<button/>').text('delete user').addClass('ALIZARIN');

    // update the preview of the profile picture
    input_imageUrl.on('input', function(evt) {
        img.attr('src', input_imageUrl.val());
    });

    delete_button.click(function(){usr_sec.remove()});

    form_div.append(text_id).append(input_id);
    form_div.append(text_name).append(input_name);
    form_div.append(text_description).append(input_description);
    form_div.append(text_imageUrl).append(input_imageUrl);
    form_div.append(text_status).append(input_status);
    form_div.append(text_webpageUrl).append(input_webpageUrl);
    form_div.append(delete_button);
	usr_sec.append(img).append(form_div);

	$('#sortable').append(usr_sec);
}
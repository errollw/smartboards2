// Implements the JS for index.html

var urlParams;


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



$(function() {
	initializeUrlParams();
	
	// Test whether a given r_id is valid, by looking in the drop-down list
	var isValidBoard = function (aBoard) {
		var returnValue = false;
		$.each($("#board option"), function(index, element) {
			if ($(element).attr("value") == aBoard) {
				returnValue = true;
			}
		});
		return returnValue;
	};
	
	// Hide the buttons
	$("#buttons").hide();
	
	// Only display buttons when a room has been selected
	$("#board").on("change", function() {
		var r_id = $(this).val();
		if (r_id != "") {
			$.cookie("r_id", r_id, {expires:28});
			$("#buttons").slideDown();
		} else {
			$("#buttons").slideUp();
		}
	});
	
	// Select the board from the list if we have it in the query string or cookie
	if (typeof urlParams['r_id'] !== "undefined" && isValidBoard(urlParams['r_id'])) {
		$("#board").val(urlParams['r_id']).trigger("change");
	} else if (typeof $.cookie("r_id") !== "undefined" && isValidBoard($.cookie("r_id"))) {
		$("#board").val($.cookie("r_id")).trigger("change");
	}
	
	// Event handlers for buttons
	$("#btn_go_to_board").on("click", function() {
		window.location.href = "board.html?r_id=" + $("#board").val();
	});
	$("#btn_set_status").on("click", function() {
		window.location.href = "set_status.html?r_id=" + $("#board").val();
	});
	$("#btn_configure_board").on("click", function() {
		window.location.href = "settings.html?r_id=" + $("#board").val();
	});
	$("#btn_static_viewer").on("click", function() {
		window.location.href = "viewer.html?r_id=" + $("#board").val();
	});
});
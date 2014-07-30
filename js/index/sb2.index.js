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
	
	// Set cookie defaults
	$.cookie.defaults = {
		"expires": 14
	};
	
	// Test whether a given r_id is valid, by looking in the drop-down list
	var isValidBoard = function (aBoard) {
		if (typeof aBoard === "undefined" || aBoard == "") return false;
		var returnValue = false;
		$.each($("#board option"), function(index, element) {
			if ($(element).attr("value") == aBoard) {
				returnValue = true;
			}
		});
		return returnValue;
	};
	
	// Only display buttons when a room has been selected
	$("#board").on("change", function() {
		var r_id = $(this).val();
		if (r_id != "") {
			$.cookie("r_id", r_id);
			$("#buttons").slideDown();
		} else {
			$("#buttons").slideUp();
		}
		if (typeof window.history.replaceState == "function") {
			window.history.replaceState({}, "NetBoards", "index.html?r_id=" + r_id);
		}
	});
	
	// Select the board from the list if we have it in the query string or cookie
	if (typeof urlParams['r_id'] !== "undefined" && isValidBoard(urlParams['r_id'])) {
		$("#board").val(urlParams['r_id']).trigger("change");
	} else if (typeof $.cookie("r_id") !== "undefined" && isValidBoard($.cookie("r_id"))) {
		$("#board").val($.cookie("r_id")).trigger("change");
	} else {
		// No room selected, so hide the buttons
		$("#buttons").hide();
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
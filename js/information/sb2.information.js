// Implements JS for information.html

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
	
	
	$("#btn_return").text(urlParams["r_id"] ? "return to board" : "return to index page");
	
	$("#btn_return").on("click", function() {
		if (urlParams["r_id"]) {
			window.location.href = window.location.href.replace("information.html", "board.html");
		} else {
			window.location.href = window.location.href.replace("information.html", "index.html");
		}
	});
	
	var customiseLink = window.location.href.replace("information.html", "").replace("http://", "https://");
	
	var qrCode = new QRCode("qrcode", {
		text: customiseLink,
		width: 256,
		height: 256
	});
	
	$("#customiselink").text(customiseLink);
	// Only make link clickable if it isn't the NetBoards browser
	if (navigator.userAgent.indexOf("NetBoards") == -1) {
		$("#customiselink").attr("href", customiseLink);
	}
	
});
// JS for implementing information button in board.html

$(function() {
	
	$("div.button#information").on("click", function() {
		$.simpleMessage("show", "Loading...");
		save(function() {
			$.simpleMessage("destroy");
			window.location.href = window.location.href.replace("board.html", "information.html");
		});
		
	});
	
});
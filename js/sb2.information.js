// JS for implementing information button in board.html

$(function() {
	
	$("div.button#information").on("click", function() {
		save(function() {
			window.location.href = window.location.href.replace("board.html", "information.html");
		});
		
	});
	
});
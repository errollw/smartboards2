// Implements the pan tool for mouse and touch events

$(function() {
	
	// Only do panning if the client isn't a NetBoards
	if (navigator.userAgent.indexOf("NetBoard/") == -1) {
		// Is the user's finger/mouse dragging?
		var isCurrentlyPanning = false, startPosition, initScrollTop, initScrollLeft;

		
		// Bind event handlers
		$("canvas").on("mousedown touchstart", function(e) {
			// Starting pan
			if (edit_mode != "PANNING" || isCurrentlyPanning == true) return;
			isCurrentlyPanning = true;
			
			startPosition = (e.type.indexOf("mouse") > -1) ? new Point(e.clientX, e.clientY) : new Point(e.originalEvent.touches[0].clientX, e.originalEvent.touches[0].clientY);
			initScrollTop = $(document).scrollTop();
			initScrollLeft = $(document).scrollLeft();
			
		}).on("mouseup mouseout touchend touchcancel touchleave", function(e) {
			// Ending pan
			if (edit_mode != "PANNING" || isCurrentlyPanning == false) return;
			isCurrentlyPanning = false;
			startPosition = null;
		}).on("mousemove touchmove", function(e) {
			// Perform the move
			if (edit_mode != "PANNING" || isCurrentlyPanning == false) return;
			
			var currentPosition = (e.type.indexOf("mouse") > -1) ? new Point(e.clientX, e.clientY) : new Point(e.originalEvent.touches[0].clientX, e.originalEvent.touches[0].clientY);
			
			var delta = currentPosition.subtract(startPosition);
			
			$(document).scrollTop(initScrollTop - delta.y);
			$(document).scrollLeft(initScrollLeft - delta.x);
			
		});
		
	} else {
		// It is the NetBoard, so hide the pan tool
		$("#pan").hide();
	}
});
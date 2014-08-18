// Implements the text tool

$(function() {
	
    // Is the user's finger/mouse dragging?
    var isPointerDown = false, touchID, startPosition;

    // Bind event handlers
    $("canvas").on("mousedown touchstart", function(e) {
        if (edit_mode != "TEXT" || isPointerDown == true) return;
        isPointerDown = true;
        
        
        if (e.type == "mousedown") {
            startPosition = new Point(e.pageX, e.pageY);
        } else {
            touchID = e.originalEvent.changedTouches[0].identifier;
            startPosition = new Point(e.originalEvent.changedTouches[0].pageX, e.originalEvent.changedTouches[0].pageY);
        }
        
    }).on("mouseup mouseout touchend touchcancel touchleave", function(e) {
        if (edit_mode != "TEXT" || isPointerDown == false) return;
        
        var endPosition = null;
        
        if (e.type.indexOf("mouse") > -1) {
            endPosition = new Point(e.pageX, e.pageY);
        } else {
            for (var i = 0; i < e.originalEvent.changedTouches.length; i++) {
                if (touchID == e.originalEvent.changedTouches[i].identifier) {
                    endPosition = new Point(e.originalEvent.changedTouches[i].pageX, e.originalEvent.changedTouches[i].pageY);
                    break;
                }
            }
            if (endPosition == null) {
                // TouchID not found - perhaps they released a different finger to what was first put down
                return;
            }
        }
        
        isPointerDown = false;
        
        // Check whether the distance between starting and ending positions is within the range we're considering
        if (!startPosition.isClose(endPosition, 5)) {
            // Moved too far - ignore it
            return;
        }
        
        // Find midpoint
        var midpoint = new Point((startPosition.x + endPosition.x)/2, (startPosition.y + endPosition.y)/2);
        
        // Wrap in a timeout for https://code.google.com/p/chromium/issues/detail?id=404621
        setTimeout(function() {
            // If we've clicked on a PointText, edit it. If not, create a new text object
            var result = project.hitTest(midpoint);
            if (result && result.item instanceof PointText) {
                var pos = result.item.position.clone();
                var content = prompt("Edit existing text:", result.item.content);
                if (content != null) {
                    content = content.trim();
                    if (content.length > 0) {
                        result.item.position = pos;
                        result.item.content = content;
                    } else {
                        result.item.remove();
                    }
                }
            } else {
                // Prompt for string
                var string = prompt("Enter text to add:");
                
                if (string != null) {
                    string = string.trim();
                    if (string.length > 0) {
                        // Create the PointText
                        var textObj = new PointText({
                            content: string,
                            fontSize: 50,
                            fillColor: get_pen_color(),
                            fontFamily: "Open Sans"
                        });
                        textObj.position = midpoint;
                    }
                }
            }
            view.update();
        }, 0);
    });
	
    // If it is the NetBoard, remove the icon (but still allow interaction via keyboard shortcut)
    if (navigator.userAgent.indexOf("NetBoard/") > -1) {
        $("#controls #text").remove();
    }
    
});
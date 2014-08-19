var is_floatie_open = false;

$(document).ready(function() {

    $('#floatie #trash').click(remove_selected_items);

    $('#floatie #send_to_back').click(send_selected_items_to_back);

    $('#floatie #send_to_front').click(send_selected_items_to_front);
	
	$('#floatie #clone').click(clone_selected_items);


    hide_floatie();

});

function remove_selected_items(){
    _.forEach(project.selectedItems, function(sel_item){
        sel_item.remove();
    });
	view.update();
	hide_floatie();
}

function send_selected_items_to_back(){
	_.forEach(project.selectedItems, function(sel_item){
        sel_item.sendToBack();
    });
	deselect_all();
	view.update();
	hide_floatie();
}

function send_selected_items_to_front(){
	_.forEach(project.selectedItems, function(sel_item){
        sel_item.bringToFront();
    });
	deselect_all();
	view.update();
	hide_floatie();
}

function clone_selected_items() {
	hide_floatie();
	remove_selection_rects();
	var clonedItems = [];
	_.forEach(project.selectedItems, function(sel_item){
		var clone = sel_item.clone();
		clone.position = new Point(clone.position.x + 50, clone.position.y + 50);
		clonedItems.push(clone);
		sel_item.selected = false;
	});
	_.forEach(clonedItems, function(e) {
		e.selected = true;
	});
	make_selection_rect();
	show_floatie(selected_items_rect.position);
	view.update();
}

function toggle_floatie(){
	if (!is_floatie_open){
		$('#floatie, #floatie-triangle').hide();
	} else {
		$('#floatie, #floatie-triangle').show();
	}
	is_floatie_open = !is_floatie_open;
}

function hide_floatie(){
	$('#floatie, #floatie-triangle').hide();
}

function show_floatie(point){
    var fHeight = $("#floatie").height(), fWidth = $("#floatie").width(), triangleDim = $("#floatie-triangle").height()/2 * 1.4142; // triangle dim is the height of the triangle (or half-height of the diamond). jQuery's height() returns the height of the <div> before rotation
    
    var minimumMargin = 30, sideGuide = minimumMargin + fWidth/2, topMargin = minimumMargin + fHeight/2, bottomMargin = minimumMargin + fHeight + triangleDim, triangleSide = "TOP", targetPosition = point.clone();
    
    if (targetPosition.x < minimumMargin) {
        targetPosition.x = minimumMargin;
        triangleSide = "LEFT";
    } else if (minimumMargin <= targetPosition.x && targetPosition.x < sideGuide) {
        triangleSide = "LEFT";
    } else if (view.bounds.width - sideGuide < targetPosition.x && targetPosition.x <= view.bounds.width - minimumMargin) {
        triangleSide = "RIGHT";
    } else if (view.bounds.width - minimumMargin < targetPosition.x) {
        targetPosition.x = view.bounds.width - minimumMargin;
        triangleSide = "RIGHT";
    }
    
    function fixX() {
        targetPosition.x = Math.min(view.bounds.x + view.bounds.width - sideGuide, Math.max(view.bounds.x + sideGuide, targetPosition.x));
    }
    
    if (targetPosition.y < topMargin) {
        fixX();
        targetPosition.y = minimumMargin;
        triangleSide = "TOP";
    } else if (view.bounds.height - bottomMargin < targetPosition.y && targetPosition.y < view.bounds.height - minimumMargin) {
        fixX();
        triangleSide = "BOTTOM";
    } else if (view.bounds.height - minimumMargin < targetPosition.y) {
        fixX();
        targetPosition.y = view.bounds.height - minimumMargin;
        triangleSide = "BOTTOM";
    }
    
    var floatiePoint, trianglePoint;
    switch (triangleSide) {
        case "TOP":
            floatiePoint = targetPosition.clone();
            trianglePoint = targetPosition.clone();
            if (targetPosition.x != point.x) { // Slide the triangle to point towards the selection (important when in corners of screen)
                trianglePoint.x = Math.max(minimumMargin + 2*triangleDim, Math.min(point.x, view.bounds.width - minimumMargin - 2*triangleDim));
            }
            break;
        case "LEFT":
            floatiePoint = targetPosition.clone().add(new Point(fWidth/2 + triangleDim, -triangleDim - fHeight/2));
            trianglePoint = floatiePoint.clone().add(new Point(-fWidth/2, fHeight/2));
            break;
        case "RIGHT":
            floatiePoint = targetPosition.clone().add(new Point(-fWidth/2 - triangleDim, -triangleDim - fHeight/2));
            trianglePoint = floatiePoint.clone().add(new Point(fWidth/2, fHeight/2));
            break;
        case "BOTTOM":
            floatiePoint = targetPosition.clone().add(new Point(0, -fHeight - triangleDim*2));
            trianglePoint = floatiePoint.clone().add(new Point(0, fHeight));
            if (targetPosition.x != point.x) { // Slide the triangle to point towards the selection (important when in corners of screen)
                trianglePoint.x = Math.max(minimumMargin + 2*triangleDim, Math.min(point.x, view.bounds.width - minimumMargin - 2*triangleDim));
            }
            break;
    }
    
	$('#floatie, #floatie-triangle').show();
	$('#floatie').css({
		top: floatiePoint.y,
		left: floatiePoint.x
	});
    $('#floatie-triangle').css({
        top: trianglePoint.y,
        left: trianglePoint.x
    });
}
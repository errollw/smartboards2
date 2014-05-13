
var eraser_hit_options = { fill: true, tolerance: 8}

var eraser_step_dist = 4;

//returns list of items hitTested along a line
function hitTest_along_line(point1, point2){

	var hit_items = [];

	var delta = point2.subtract(point1);
	var delta_step =  delta.normalize().multiply(eraser_step_dist);

	for (i=0; i<(delta.length/eraser_step_dist); i++){

		var hitTest_pt = point1.add(delta_step.multiply(i));
		var hitTest_result = project.hitTest(hitTest_pt, eraser_hit_options);

		// TODO: avoid erasing Rasters

		if (hitTest_result) hit_items.push(hitTest_result.item)
	}

	return hit_items;
}
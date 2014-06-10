

function initialize_ctrl_pts(){

	var bds = selected_items_rect.bounds;

	var col = new Color(0, 0, 0, 0);

	// do rotate cps first - they go on the bottom
	var d = 20;
	ctrl_pts_rotate = [
	    new Shape.Rectangle(bds.topLeft, bds.topLeft.add([-d,-d])),
	    	new Shape.Rectangle(bds.topRight, bds.topRight.add([d,-d])),
	    new Shape.Rectangle(bds.bottomLeft, bds.bottomLeft.add([-d,d])),
	    	new Shape.Rectangle(bds.bottomRight, bds.bottomRight.add([d,d]))];

	_.forEach(ctrl_pts_rotate, function(cp){cp.fillColor=col})
	_.forEach(ctrl_pts_rotate, function(cp){cp.cp_rotate=true})
	_.forEach(ctrl_pts_rotate, function(cp){cp.cursor='url(assets/icon_rotate.svg) 10 10, auto'})

	// do resize cps second, they go on top
	var d = 10;
	ctrl_pts_resize = [
	    new Shape.Rectangle(bds.topLeft, bds.topLeft.add([-d,-d])),
	    	new Shape.Rectangle(bds.topRight, bds.topRight.add([d,-d])),
	    new Shape.Rectangle(bds.bottomLeft, bds.bottomLeft.add([-d,d])),
	    	new Shape.Rectangle(bds.bottomRight, bds.bottomRight.add([d,d]))];

	ctrl_pts_resize[0].counter_pt = ctrl_pts_resize[3];
	ctrl_pts_resize[1].counter_pt = ctrl_pts_resize[2];
	ctrl_pts_resize[2].counter_pt = ctrl_pts_resize[1];
	ctrl_pts_resize[3].counter_pt = ctrl_pts_resize[0];

	ctrl_pts_resize[0].fillColor = new Color(0, 0, 0, 0);
	ctrl_pts_resize[1].fillColor = new Color(0, 0, 0, 0);
	ctrl_pts_resize[2].fillColor = new Color(0, 0, 0, 0);
	ctrl_pts_resize[3].fillColor = new Color(0, 0, 0, 0);

	ctrl_pts_resize[0].cursor = 'nw-resize';
	ctrl_pts_resize[1].cursor = 'ne-resize';
	ctrl_pts_resize[2].cursor = 'sw-resize';
	ctrl_pts_resize[3].cursor = 'se-resize';
}
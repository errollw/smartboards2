// make the paper scope global, by injecting it into window:
paper.install(window);

var prev_mouse_pt;

var is_erasing_with_mouse = false;

// Only executed our code once the DOM is ready.
$(document).ready(function() {

    // Create an empty project and a view for the canvas
    var canvas = document.getElementById('myCanvas');
    paper.setup(canvas);

    // bind mouse handlers for drawing with mouse
    var canv = document.getElementsByTagName("canvas")[0];
    canv.addEventListener("mousedown", handle_mouse_down_eraser, false);
    canv.addEventListener("mousemove", handle_mouse_move_eraser, false);
    canv.addEventListener("mouseup",   handle_mouse_up_eraser,   false);
    canv.addEventListener("mouseout",  handle_mouse_up_eraser,   false);
});

function handle_mouse_down_eraser(evt) {

	if (edit_mode != "ERASING") return;

    is_erasing_with_mouse = true;

    prev_mouse_pt = new Point(evt.pageX, evt.pageY);
}

function handle_mouse_move_eraser(evt) {

    if (edit_mode != "ERASING" || !is_erasing_with_mouse) return;
    
    mouse_pt = new Point(evt.pageX, evt.pageY);

    var hit_items = hitTest_along_line(prev_mouse_pt, mouse_pt);

    for (i=0; i<hit_items.length; i++)
    	hit_items[i].remove();
    view.update();

    prev_mouse_pt = mouse_pt;
}

function handle_mouse_up_eraser(evt) {

    if (edit_mode != "ERASING" || !is_erasing_with_mouse) return;

    is_erasing_with_mouse = false;
}

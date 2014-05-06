// make the paper scope global, by injecting it into window:
paper.install(window);

var pen_mouse_stroke;

var prev_mouse_pt;

var is_drawing_with_mouse = false;

// Only executed our code once the DOM is ready.
$(document).ready(function() {

    // Create an empty project and a view for the canvas
    var canvas = document.getElementById('myCanvas');
    paper.setup(canvas);

    // bind mouse handlers for drawing with mouse
    var canv = document.getElementsByTagName("canvas")[0];
    canv.addEventListener("mousedown", handle_mouse_down_pen, false);
    canv.addEventListener("mousemove", handle_mouse_move_pen, false);
    canv.addEventListener("mouseup",   handle_mouse_up_pen,   false);
    canv.addEventListener("mouseout",  handle_mouse_up_pen,   false);
});

function handle_mouse_down_pen(evt) {

    if (edit_mode != "DRAWING") return;

    is_drawing_with_mouse = true;

    // start drawing by making a new path
    pen_mouse_stroke = new Path();
    pen_mouse_stroke.fillColor = '#00000';
    pen_mouse_stroke.add([evt.pageX, evt.pageY]);

    // record position of previous mouse pointer
    prev_mouse_pt = new Point(evt.pageX, evt.pageY);
}

function handle_mouse_move_pen(evt) {

    if (edit_mode != "DRAWING" || !is_drawing_with_mouse) return;
    
    // get the clamped speed that the user is drawing at
    mouse_pt = new Point(evt.pageX, evt.pageY);
    var delta = prev_mouse_pt.subtract(mouse_pt);
    var delta_midpoint = mouse_pt.add(prev_mouse_pt).divide(2);
    var speed = delta.length;

    if (speed < min_delta_length) return;

    speed = Math.min(SPEED_MAX, Math.max(SPEED_MIN, speed));
    
    // reset smoothing speed window at the beginning of a stroke

    // get thickness to draw at that point
    var thickness = speed_to_thickness(speed, 0);

    // make orthogonal vector to simulate brush thickness
    var step = delta.normalize(thickness);
    step.angle += 90;

    // add two points to either side of the drawn point
    var top = delta_midpoint.add(step);
    var bottom = delta_midpoint.subtract(step);
    pen_mouse_stroke.add(top);
    pen_mouse_stroke.insert(0, bottom);

    // update previous mouse position
    prev_mouse_pt = mouse_pt;

}

function handle_mouse_up_pen(evt) {

    // if not drawing, ignore event
    if (edit_mode != "DRAWING" || !is_drawing_with_mouse) return;

    // if not moved, draw a dot, otherwise finish stroke
    if (!speed_histories[0]) {
        draw_dot(evt);
    } else {

        // close, smooth and simplify path
        pen_mouse_stroke.add([evt.pageX, evt.pageY]);
        pen_mouse_stroke.closed = true;
        pen_mouse_stroke.smooth();
        pen_mouse_stroke.simplify(5);

        // clear history for mouse-pen drawing
        speed_histories[0] = null;
    }

    // clear drawing mode
    is_drawing_with_mouse = false;

}
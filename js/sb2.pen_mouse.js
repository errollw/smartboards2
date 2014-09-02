// make the paper scope global, by injecting it into window:
paper.install(window);

var pen_mouse_stroke;

var has_pen_moved = false;

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

var pen_speed_path;

function handle_mouse_down_pen(evt) {

    if (edit_mode != "DRAWING") return;
    
    is_drawing_with_mouse = true;

    // start drawing by making a new path
    pen_mouse_stroke = new Path();
    pen_mouse_stroke.strokeColor = get_pen_color();
    pen_mouse_stroke.strokeWidth = get_thickness_as_width();
    pen_mouse_stroke.strokeJoin = 'round';


    pen_mouse_stroke.add(currentMouse);

}

function handle_mouse_move_pen(evt) {

    if (edit_mode != "DRAWING" || !is_drawing_with_mouse) return;
    
    has_pen_moved = true;
    pen_mouse_stroke.add(currentMouse);
}

function handle_mouse_up_pen(evt) {

    if (edit_mode != "DRAWING" || !is_drawing_with_mouse) return;

    if (!has_pen_moved) {
        // if not moved, draw a dot, otherwise finish stroke
        draw_dot(previousMouse.clone());
    } else {
        // Check that the path has at least two points after simplification. if not, remove it
        pen_mouse_stroke = robust_simplify(pen_mouse_stroke);
        if (pen_mouse_stroke.segments.length > 0) {
            offsetBezier(pen_mouse_stroke);
        }
        pen_mouse_stroke.remove();

        has_pen_moved = false;
    }

    is_drawing_with_mouse = false;
}
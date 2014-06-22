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

    pen_speed_path = new Path();
    pen_speed_path.strokeColor ='black'

    pen_mouse_stroke.add(currentMouse);

}

function handle_mouse_move_pen(evt) {

    if (edit_mode != "DRAWING" || !is_drawing_with_mouse) return;
    
    var delta = previousMouse.subtract(currentMouse);
    var delta_midpoint = currentMouse.add(previousMouse).divide(2);

    // get thickness to draw at that point
    // var d_time = currentMouse.timestamp - previousMouse.timestamp;
    // var speed = clamp_speed(delta.length / d_time);
    // var thickness = speed_to_thickness(delta.length / d_time, 0);

    // make orthogonal vector to simulate brush thickness
    // var step = delta.normalize(thickness);
    // step.angle += 90;

    // add two points to either side of the mouse point
    // var top = delta_midpoint.add(step);
    // var bottom = delta_midpoint.subtract(step);

    //pen_mouse_stroke.add(top);
    //pen_mouse_stroke.insert(0, bottom);

    has_pen_moved = true;
    pen_mouse_stroke.add(currentMouse);

    // pen_speed_path.add([pen_mouse_stroke.length,speed*PEN_SPEED_PATH_HEIGHT])

    // var bucket = Math.floor(pen_mouse_stroke.length/OFFSET_STEP);
    // if (bucket+1 > speeds[0].length) speeds[0][bucket]=[];
    // speeds[0][bucket].push(speed)
}

function handle_mouse_up_pen(evt) {

    if (edit_mode != "DRAWING" || !is_drawing_with_mouse) return;

    if (!has_pen_moved) {

        // if not moved, draw a dot, otherwise finish stroke
        draw_dot(previousMouse);

    } else {
        
        pen_speed_path.smooth()
        pen_mouse_stroke.simplify(10);

        offsetBezier(pen_mouse_stroke);

        pen_mouse_stroke.remove();

        speed_histories[0] = null;
    }


    is_drawing_with_mouse = false;
}
// make the paper scope global, by injecting it into window:
paper.install(window);

var pen_touch_strokes = {};

var is_drawing_with_multitouch = false;

// Only executed our code once the DOM is ready.
$(document).ready(function() {

    // Create an empty project and a view for the canvas
    var canvas = document.getElementById('myCanvas');
    paper.setup(canvas);

    // Bind touch handlers for multi-touch pen drawing
    // see: https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Touch_events
    canvas.addEventListener("touchstart",  handle_touch_start_pen,  false);
    canvas.addEventListener("touchend",    handle_touch_end_pen,    false);
    canvas.addEventListener("touchcancel", handle_touch_end_pen, false);
    canvas.addEventListener("touchleave",  handle_touch_end_pen,    false);
    canvas.addEventListener("touchmove",   handle_touch_move_pen,   false);

});

function handle_touch_start_pen(evt) {
    evt.preventDefault();

   if (edit_mode != "DRAWING") return;

    var ts = evt.changedTouches;
    for (var i=0; i < ts.length; i++) {

        var new_stroke = new Path();
        new_stroke.fillColor = get_pen_color();
        touch_pt = currentTouches[ts[i].identifier];
        new_stroke.add(touch_pt);
        pen_touch_strokes[ts[i].identifier] = new_stroke;
    }

    is_drawing_with_multitouch = true;
}

function handle_touch_move_pen(evt) {
    evt.preventDefault();

    if (edit_mode != "DRAWING" || !is_drawing_with_multitouch) return;

    var ts = evt.changedTouches;
    for (var i=0; i < ts.length; i++) {
        var id = ts[i].identifier;

        var delta = currentTouches[id].subtract(previousTouches[id]);
        var delta_midpoint = previousTouches[id].add(currentTouches[id]).divide(2);

        // get thickness to draw at that point
        var thickness = speed_to_thickness(delta.length, id);

        // make orthogonal vector to simulate brush thickness
        var step = delta.normalize(thickness);
        step.angle += 90;

        // add two points to either side of the drawn point
        var top = delta_midpoint.add(step);
        var bottom = delta_midpoint.subtract(step);
        pen_touch_strokes[id].add(top);
        pen_touch_strokes[id].insert(0, bottom);
    }
}

function handle_touch_end_pen(evt) {
    evt.preventDefault();

    if (edit_mode != "DRAWING" || !is_drawing_with_multitouch) return;

    var ts = evt.changedTouches;
    for (var i=0; i < ts.length; i++) {
        var id = ts[i].identifier;
        
        if (!speed_histories[id]) {

            // if not moved, draw a dot, otherwise finish stroke
            draw_dot(previousTouches[id]);

        } else if (pen_touch_strokes[id].bounds.area < dot_area_thresh){

            // if the path is too small, convert it to a dot
            pen_touch_strokes[id].remove();
            draw_dot(previousTouches[id]);

        } else {

            // otherwise close, smooth and simplify path
            pen_touch_strokes[id].add(previousTouches[id]);
            pen_touch_strokes[id].closed = true;
            pen_touch_strokes[id].smooth();
            pen_touch_strokes[id].simplify(5);

        }

        view.update();

        // delete items in array as they are no longer used
        delete pen_touch_strokes[id];
        delete speed_histories[id];
    }

    is_drawing_with_multitouch = !($.isEmptyObject(currentTouches));

    schedule_autosave();
}
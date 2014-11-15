// make the paper scope global, by injecting it into window:
paper.install(window);

var pen_touch_strokes = {};

var has_finger_moved = {};

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
    canvas.addEventListener("touchcancel", handle_touch_end_pen,    false);
    canvas.addEventListener("touchleave",  handle_touch_end_pen,    false);
    canvas.addEventListener("touchmove",   handle_touch_move_pen,   false);

});

function handle_touch_start_pen(evt) {
    evt.preventDefault();

   if (edit_mode != "DRAWING") return;

    var ts = evt.changedTouches;
    for (var i=0; i < ts.length; i++) {

        var new_stroke = new Path();

        // new_stroke.fillColor = get_pen_color();
        new_stroke.strokeColor = get_pen_color();
        new_stroke.strokeWidth = get_thickness_as_width();
        new_stroke.strokeJoin = 'round';

        touch_pt = currentTouches[ts[i].identifier];
        new_stroke.add(touch_pt);
        has_finger_moved[ts[i].identifier] = false;
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

        has_finger_moved[id] = true;
        pen_touch_strokes[id].add(currentTouches[id]);
    }
}

function handle_touch_end_pen(evt) {
    evt.preventDefault();

    if (edit_mode != "DRAWING" || !is_drawing_with_multitouch) return;

    var ts = evt.changedTouches;
    for (var i=0; i < ts.length; i++) {
        var id = ts[i].identifier;

        if (!has_finger_moved[id] || pen_touch_strokes[id].length < 10) {

            // if not moved, draw a dot, otherwise finish stroke
            draw_dot(previousTouches[id]);

        } else {

            pen_touch_strokes[id].add(previousTouches[id]);
            pen_touch_strokes[id] = robust_simplify(pen_touch_strokes[id])

            offsetBezier(pen_touch_strokes[id]);
            pen_touch_strokes[id].remove();

        }

        view.update();

        // delete items in array as they are no longer used
        delete pen_touch_strokes[id];
        delete has_finger_moved[id];
    }

    is_drawing_with_multitouch = !($.isEmptyObject(currentTouches));
}
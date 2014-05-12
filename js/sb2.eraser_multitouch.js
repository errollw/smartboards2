// make the paper scope global, by injecting it into window:
paper.install(window);

var is_erasing_with_multitouch = false;

// Only execute our code once the DOM is ready.
$(document).ready(function() {

    // create an empty project and a view for the canvas
    var canvas = document.getElementById('myCanvas');
    paper.setup(canvas);

    // bind touch handlers for multi-touch pen drawing
    // see: https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Touch_events
    canvas.addEventListener("touchstart",  handle_touch_start_eraser,  false);
    canvas.addEventListener("touchend",    handle_touch_end_eraser,    false);
    canvas.addEventListener("touchcancel", handle_touch_end_eraser,    false);
    canvas.addEventListener("touchleave",  handle_touch_end_eraser,    false);
    canvas.addEventListener("touchmove",   handle_touch_move_eraser,   false);
});

function handle_touch_start_eraser(evt) {
    evt.preventDefault();

    if (edit_mode != "ERASING") return;

    is_erasing_with_multitouch = true;
}

function handle_touch_move_eraser(evt) {
    evt.preventDefault();

    if (edit_mode != "ERASING" || !is_erasing_with_multitouch) return;

    var ts = evt.changedTouches;
    for (var i=0; i < ts.length; i++) {
        var id = ts[i].identifier;

        old_pt = previousTouches[id];
        new_pt = currentTouches[id];

        var hit_items = hitTest_along_line(old_pt, new_pt);

        for (var j=0; j<hit_items.length; j++)
            hit_items[j].remove();
        view.update();
    }

}

function handle_touch_end_eraser(evt) {
    evt.preventDefault();

    if (edit_mode != "ERASING" || !is_erasing_with_multitouch) return;

    is_erasing_with_multitouch = !($.isEmptyObject(currentTouches));
}


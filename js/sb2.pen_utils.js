// make the paper scope global, by injecting it into window:
paper.install(window);

var speed_min = 0, speed_max = 10;
var thick_min = 2, thick_max = 8;

var speed_histories = [],       // mouse speed at previous frames
    speed_history_length = 10;  // number of speeds to keep in buffer

var dot_area_thresh = 150;      // minimum stroke bounds area before conversion to dot


// chooses a pen thickness based on speed (how far mouse has moved)
function speed_to_thickness(speed, touch_id){

    // if speed NaN, default to thin
    if (speed != speed) return thick_min;

    // clamp speed
    speed = Math.min(speed_max, Math.max(speed_min, speed));

    // choose correct buffer depending on which finger is being used
    speed_history = speed_histories[touch_id];

    // if no buffer exists for that stroke, create one
    if (!speed_history){
        speed_history = speed_histories[touch_id] = [];
        for(var i = 0; i < speed_history_length; i++)
            speed_history[i] = 0;
    }

    // rotate the buffer, and push new value
    speed_history.shift();
    speed_history.push(speed);

    // sum items in the speed history
    var sum = 0;
    for(var i = 0; i < speed_history.length; i++)
        sum += parseInt(speed_history[i]);
    
    thickness = (8-(sum/speed_history.length)*4)
    thickness = Math.min(thick_max, Math.max(thick_min, thickness));

    if (get_pen_thickness() == "THIN") return thick_min;

    return thickness * get_thickness_multiplier();
}


// draws a slightly wobbly dot at a point
function draw_dot(point){

    var dot_path = new Path();
    dot_path.fillColor = get_pen_color();
    dot_path.closed = true;
    
    for (var i = 0; i < 6; i++) {
        var delta = new Point({
            length: ((10 * 0.7) + (Math.random() * 10 * 0.3)) * get_thickness_multiplier(),
            angle: (360 / 6) * i
        });
        dot_path.add(point.add(delta));
    }
    dot_path.smooth();
}
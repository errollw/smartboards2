// make the paper scope global, by injecting it into window:
paper.install(window);

var speed_min = 0, speed_max = 2.5;
var thick_min = 2, thick_max = 8;

var speed_histories = [],       // mouse speed at previous frames
    speed_history_length = 10;  // number of speeds to keep in buffer

var dot_area_thresh = 150;      // minimum stroke bounds area before conversion to dot


var PEN_SPEED_PATH_HEIGHT = 32;


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

function draw_dot(point){

    var dot_path = new Path();
    
    
    dot_path.closed = true;
    
    for (var i = 0; i < 4; i++) {
        var delta = new Point({
            length: (0.7 + (Math.random() * 0.3)) * get_thickness_as_width(),
            angle: (360 / 4) * i
        });
        dot_path.add(point.add(delta));
    }
    dot_path.smooth();
    
    // Code for rainbow (dash) pen mode
    if (typeof rainbow !== "undefined" && rainbow == true) {
        dot_path.fillColor = {
            gradient: {
                stops: ['red', 'orange', 'yellow', 'green', 'blue', 'purple']
            },
            origin: dot_path.bounds.topLeft,
            destination: dot_path.bounds.bottomRight
        };
    } else {
        dot_path.fillColor = get_pen_color();
    }

}

function clamp_speed(speed){
    if (isNaN(speed)) return 0;
    return Math.min(Math.max(speed, 0), 2.5);
}

function lineIntersect(p1,p2,q1,q2) {

    var x1 = p1.x, y1 = p1.y,
        x2 = p2.x, y2 = p2.y,
        x3 = q1.x, y3 = q1.y,
        x4 = q2.x, y4 = q2.y;

    var x=((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
    var y=((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
    return new Point(x,y);
}
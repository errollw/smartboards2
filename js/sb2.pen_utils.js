// make the paper scope global, by injecting it into window:
paper.install(window);

var speed_min = 4,
    speed_max = 10;

var speed_histories = [];
var speed_history_length = 8;

function speed_to_thickness(speed, touch_id){

    speed = Math.min(speed_max, Math.max(speed_min, speed));

    speed_history = speed_histories[touch_id];

    // if no history exists for that stroke, create one
    if (!speed_history){
        speed_history = speed_histories[touch_id] = [];
        for(var i = 0; i < speed_history_length; i++)
            speed_history[i] = speed;
    }   

    speed_history.shift();
    speed_history.push(speed);

    var sum = 0;
    for(var i = 0; i < speed_history.length; i++)
        sum += parseInt(speed_history[i]);
    
    return (12-(sum/speed_history.length));
}

function draw_dot(point){

    var dot_path = new Path();
    dot_path.fillColor = get_pen_color();
    dot_path.closed = true;
    
    for (var i = 0; i < 6; i++) {
        var delta = new Point({
            length: (10 * 0.7) + (Math.random() * 10 * 0.3),
            angle: (360 / 6) * i
        });
        dot_path.add(point.add(delta));
    }
    dot_path.smooth();
}
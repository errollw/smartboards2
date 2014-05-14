// make the paper scope global, by injecting it into window:
paper.install(window);

var is_idle = true;

var idle_throttle = moment.duration(1, 'seconds');
var idle_timeout = moment.duration(10, 'seconds');

function set_busy(){
    is_idle = false;
}

function set_idle(){

    // can only be idle if no mouse or touches are active
    if ((getNumberOfTouches() == 0) && !isMouseDown){
        is_idle = true;
    }
}


$(document).ready(function(){

    var canvas = document.getElementById('myCanvas');

    var throttled_set_busy = _.throttle(set_busy, idle_throttle.asMilliseconds());
    var debounced_set_idle = _.debounce(set_idle, idle_timeout.asMilliseconds());

    // set busy on any activity (moving mouse)
    canvas.addEventListener("touchmove",  throttled_set_busy);
    canvas.addEventListener("mousemove",  throttled_set_busy);

    // after a time has passed with no movement
    canvas.addEventListener("mouseup",    debounced_set_idle);
    canvas.addEventListener("mouseout",   debounced_set_idle);
    canvas.addEventListener("touchend",   debounced_set_idle);
    canvas.addEventListener("touchleave", debounced_set_idle);
});
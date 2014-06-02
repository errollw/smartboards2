// make the paper scope global, by injecting it into window:
paper.install(window);

var is_idle = true;

var idle_timeout = moment.duration(30, 'seconds');

function set_idle(){

    // can only be idle if no mouse or touches are active
    if ((getNumberOfTouches() == 0) && !isMouseDown){
        is_idle = true;
        deselect_all();
        set_edit_mode(default_edit_mode);
        hide_controls();
    }
}

var debounced_set_idle = _.debounce(set_idle, idle_timeout.asMilliseconds());

function set_busy(){
    if(is_idle){
        show_controls();
        is_idle = false;
    }

    // after a time has passed with no movement, set idle
    debounced_set_idle();
}

$(document).ready(function(){

    var canvas = document.getElementById('myCanvas');
    var controls = document.getElementById('controls');

    // set busy on any activity (moving mouse or using controls)
    canvas.addEventListener("touchmove",  set_busy);
    canvas.addEventListener("mousemove",  set_busy);
    canvas.addEventListener("touchstart", set_busy);
    canvas.addEventListener("mousedown",  set_busy);
    controls.addEventListener("touchmove",  set_busy);
    controls.addEventListener("mousemove",  set_busy);
    controls.addEventListener("touchstart", set_busy);
    controls.addEventListener("mousedown",  set_busy);
});

var OFFSET_STEP = 5;

function offsetBezier(pen_mouse_stroke){

    var length = pen_mouse_stroke.length;

    var inner_path = new Path();
    var outer_path = new Path();

    // inner_path.strokeColor = 'pink';
    // outer_path.strokeColor = 'LightSkyBlue';

    var pt, normal, thick;

    for (var offset=0; offset<length; offset+=OFFSET_STEP) {

        // Find the point on the pen_mouse_stroke at the given offset:
        point = pen_mouse_stroke.getPointAt(offset);

        // Find the normal vector on the pen_mouse_stroke at the given offset:
        thick = get_thickness_as_width()/2;
        normal = pen_mouse_stroke.getNormalAt(offset).normalize(thick);

        inner_path.add(point.add(normal));
        outer_path.add(point.subtract(normal));
    }

    inner_path.add(pen_mouse_stroke.lastSegment.point);
    
    console.log("before simplify", inner_path, outer_path);
    
    inner_path = robust_simplify(inner_path);
    outer_path = robust_simplify(outer_path);
    
    console.log("after simplyify", inner_path, outer_path);
    
    outer_path.reverse();
    if (inner_path.segments.length > 0 && outer_path.segments.length > 0) {
        inner_path.join(outer_path);
    }
    
    // Code for rainbow (dash) pen mode
    if (typeof rainbow !== "undefined" && rainbow == true) {
        inner_path.fillColor = {
            gradient: {
                stops: ['red', 'orange', 'yellow', 'green', 'blue', 'purple']
            },
            origin: inner_path.bounds.topLeft,
            destination: inner_path.bounds.bottomRight
        };
    } else {
        inner_path.fillColor = get_pen_color();
    }
}


function robust_simplify(path){

    var prev_area = path.bounds.area;
    var simplified_path;

    for (t=2; t<200; t+=10){
        simplified_path = path.clone();
        simplified_path.simplify(t);

        if ((simplified_path.bounds.area/prev_area) < 1.1){
            path.remove();
            return simplified_path;
        } else {
            simplified_path.remove();
        }
    }

    path.simplify(10);
    return path;
}
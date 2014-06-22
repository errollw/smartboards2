// http://math.stackexchange.com/questions/465782/control-points-of-offset-bezier-curve



function offsetBezier(pen_mouse_stroke){

    // start drawing by making a new path
    // pen_mouse_stroke_new = new Path();
    // pen_mouse_stroke_new.strokeColor = 'lightgrey'//get_pen_color();

    var inner_path = new Path();
    var outer_path = new Path();
    inner_path.strokeColor = 'pink'//get_pen_color();
    outer_path.strokeColor = 'LightSkyBlue'

    _.forEach(pen_mouse_stroke.segments, function(seg) {

        // if(is_problem_segment(seg, pen_mouse_stroke)){
        //     var shape = new Shape.Circle({
        //         center: seg.point,
        //         radius: 6,
        //         fillColor: 'red'
        //     });
        //     return;
        // }

        var A = Math.random()*4+4;

        if (seg.next == null){

            var p0 = seg.previous.point.add(seg.previous.handleOut)
            var p1 = seg.point.add(seg.handleIn)
            var p2 = seg.point;

            var t = seg.location.tangent;

            var n0 = p1.subtract(p0).normalize();
            n0.angle+=90; n0.length = A;
            var n1 = seg.location.tangent.normalize();
            n1.angle += 90; n1.length = A;

            var q0 = p0.add(n0);
            var q1 = p1.add(n0);
            var q2 = p2.add(n1);

            var r0 = p0.subtract(n0);
            var r1 = p1.subtract(n0);
            var r2 = p2.subtract(n1);

            var i0 = lineIntersect(q0,q1,q2,q2.add(t))
            var j0 = lineIntersect(r0,r1,r2,r2.add(t))

            var s1 = seg.clone();
            s1.point = q2;
            s1.handleIn = i0.subtract(q2)

            // pen_mouse_stroke_new.add(s1);

            var s2 = seg.clone();
            s2.point = r2;
            s2.handleIn = j0.subtract(r2)

            // pen_mouse_stroke_new.insert(0, s2);

            inner_path.add(s1);
            outer_path.add(s2);

            return;

        } else if (seg.previous == null){

            var p2 = seg.point;
            var p3 = seg.point.add(seg.handleOut)
            var p4 = seg.next.point.add(seg.next.handleIn)

            var t = seg.location.tangent;

            var n1 = seg.location.tangent.normalize();
            n1.angle += 90; n1.length = A;
            var n2 = p4.subtract(p3).normalize();
            n2.angle+=90; n2.length = A;

            var q2 = p2.add(n1);
            var q3 = p3.add(n2);
            var q4 = p4.add(n2);

            var r2 = p2.subtract(n1);
            var r3 = p3.subtract(n2);
            var r4 = p4.subtract(n2);

            var i1 = lineIntersect(q3,q4,q2,q2.add(t))

            var j1 = lineIntersect(r3,r4,r2,r2.add(t))

            var s1 = seg.clone();
            s1.point = q2;
            s1.handleOut = i1.subtract(q2)
            if (seg.handleOut.length<4) s1.handleOut = seg.handleOut

            // pen_mouse_stroke_new.add(s1);

            var s2 = seg.clone();
            s2.point = r2;
            s2.handleOut = j1.subtract(r2)
            if (seg.handleOut.length<4) s2.handleOut = seg.handleOut

            // pen_mouse_stroke_new.insert(0, s2);

            inner_path.add(s1);
            outer_path.add(s2);

            return;
        }

        var p0 = seg.previous.point.add(seg.previous.handleOut)
        var p1 = seg.point.add(seg.handleIn)
        var p2 = seg.point;
        var p3 = seg.point.add(seg.handleOut)
        var p4 = seg.next.point.add(seg.next.handleIn)

        var t = seg.location.tangent;

        var n0 = p1.subtract(p0).normalize();
        n0.angle+=90; n0.length = A;
        var n1 = seg.location.tangent.normalize();
        n1.angle += 90; n1.length = A;
        var n2 = p4.subtract(p3).normalize();
        n2.angle+=90; n2.length = A;

        var q0 = p0.add(n0);
        var q1 = p1.add(n0);
        var q2 = p2.add(n1);
        var q3 = p3.add(n2);
        var q4 = p4.add(n2);

        var r0 = p0.subtract(n0);
        var r1 = p1.subtract(n0);
        var r2 = p2.subtract(n1);
        var r3 = p3.subtract(n2);
        var r4 = p4.subtract(n2);

        var i0 = lineIntersect(q0,q1,q2,q2.add(t))
        var i1 = lineIntersect(q3,q4,q2,q2.add(t))

        var j0 = lineIntersect(r0,r1,r2,r2.add(t))
        var j1 = lineIntersect(r3,r4,r2,r2.add(t))

        var s1 = seg.clone();
        s1.point = q2;
        s1.handleIn = i0.subtract(q2)
        s1.handleOut = i1.subtract(q2)

        // if (s1.handleIn.length / seg.handleIn.length > 8) s1.handleIn = new Point(0,0)
        // if (s1.handleOut.length / seg.handleOut.length > 8) s1.handleOut = new Point(0,0)

        // pen_mouse_stroke_new.add(s1);

        var s2 = seg.clone();
        s2.point = r2;
        s2.handleIn = j0.subtract(r2)
        s2.handleOut = j1.subtract(r2)

        if (seg.handleIn.dot(s1.handleIn)<0) {
            s1.selected = true;
            danger_dot(seg.point)
            // s1.handleIn = new Point(0,0)
        }
        if (seg.handleIn.dot(s2.handleIn)<0) {
            s2.selected = true;
            danger_dot(seg.point)
            // s2.handleIn = new Point(0,0)
        }
        if (seg.handleOut.dot(s1.handleOut)<0) {
            s1.selected = true;
            danger_dot(seg.point)
            // s1.handleOut = new Point(0,0)
        }
        if (seg.handleOut.dot(s2.handleOut)<0) {
            s2.selected = true;
            danger_dot(seg.point)
            // s2.handleOut = new Point(0,0)
        }

        // if (s2.handleIn.length / seg.handleIn.length > 8) s2.handleIn = new Point(0,0)
        // if (s2.handleOut.length / seg.handleOut.length > 8) s2.handleOut = new Point(0,0)

        // pen_mouse_stroke_new.insert(0, s2);


        inner_path.add(s1);
        outer_path.add(s2);
    });

    // pen_mouse_stroke_new.insert(0, pen_mouse_stroke.firstSegment.point);

    // pen_mouse_stroke.selectedColor = get_pen_color();
    // pen_mouse_stroke.fullySelected = true;

    inner_path.selectedColor = 'pink'
    outer_path.selectedColor = 'LightSkyBlue'
    // inner_path.fullySelected = true;
    // outer_path.fullySelected = true;

    // clear history for mouse-pen drawing
    speed_histories[0] = null;
}

function split_up_path(path) {

    for (i=1; i<path.segments.length-1; i++){
        seg = path.segments[i]

        var n1 = path.getNormalAt(seg.location.offset+4);
        var n2 = path.getNormalAt(seg.location.offset-4);

        console.log(n1, n2, i)

        if (Math.abs(n1.angle - n2.angle)>45){
            var shape = new Shape.Circle({
                center: seg.point,
                radius: 4,
                fillColor: 'red'
            });

            rest_of_path = path.split(i,0)

            return [path].concat(split_up_path(rest_of_path))
        }
    }

    return [path]


    // _.forEach(path.segments, function(seg) {

    //     var tangent = seg.location.tangent;

    //     var n1 = pen_mouse_stroke.getNormalAt(seg.location.offset+1);
    //     var n2 = pen_mouse_stroke.getNormalAt(seg.location.offset-1);

    //     if (n1 == null || n2 == null) return;

    //     // console.log(pen_mouse_stroke.getNormalAt(seg.location.offset+1).angle)
    //     // console.log(pen_mouse_stroke.getNormalAt(seg.location.offset-1).angle)

    //     // console.log(seg.location.normal.length)
        
    //     var line1 = new Path({
    //         segments: [seg.point, seg.point.add(n1)],
    //         strokeColor: 'blue'
    //     });
    //     var line2 = new Path({
    //         segments: [seg.point, seg.point.add(n2)],
    //         strokeColor: 'red'
    //     });

    //     if (Math.abs(n1.angle - n2.angle)>45){
    //         var shape = new Shape.Circle({
    //             center: seg.point,
    //             radius: 6,
    //             fillColor: 'red'
    //         });
    //     }

}

function is_problem_segment(seg, path){

    var n1 = path.getNormalAt(seg.location.offset+4);
    var n2 = path.getNormalAt(seg.location.offset-4);

    if (n1==null){n1=seg.location.normal}
    if (n2==null){n2=seg.location.normal}

    return (Math.abs(n1.angle - n2.angle)>45)
}

function danger_dot(pt){
    shape = new Shape.Circle({
        center: pt,
        radius: 3,
        fillColor: 'red'
    });
    return;
}
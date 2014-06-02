function load_room_canvas(){

    // Create an empty project and a view for the canvas
    var canvas = document.getElementById('room-canvas');
    paper.setup(canvas);

    $.getJSON("content/"+r_id+".json", function(json_data){

        // clear all before importing data
        project.clear();
        project.importJSON(json_data);
        view.update();

        console.log("Loaded at " + moment().format("HH:mm:ss"));
    });

}
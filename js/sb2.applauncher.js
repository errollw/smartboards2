// Shows the button to launch an app if this board is on the whitelist

$(function() {   

    var enabled_rooms = [ {"r_id": "r_ss12", "port": 8080} ];

    for (var i = 0; i < enabled_rooms.length; i++) {
        if (enabled_rooms[i].r_id == r_id) {
            $controls = $("#controls");
            $button = $("<div />").addClass("button").attr("id", "applauncher").html("Start<br />App").css({
                "font-weight":"bold",
                "text-align":"center",
                "line-height":"30px",
                "padding":"10px 0",
                "height":"60px",
                "color":"#a7a9ac"
            }).on("click", function() {
                var img = new Image();
                img.src = "http://localhost:" + enabled_rooms[i].port + "/?rand=" + Math.random();
            });
            $("<section />").append($button).appendTo($controls);
            
            // Don't continue searching
            break;
        }
    }
});
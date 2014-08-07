// Shows the button to launch an app if this board is on the whitelist

$(function() {   

    var enabled_rooms = [ "r_ss12" ];

    if (enabled_rooms.indexOf(r_id) > -1) {
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
            img.src = "http://localhost:8080/?rand=" + Math.random();
        });
        $("<section />").append($button).appendTo($controls);
    }
});
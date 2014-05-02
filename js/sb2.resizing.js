var wb_aspect_ratio = 16/9;

$(document).ready(function() {

    var $container =    $('body'),
        $wb_container = $('#myCanvas')

    function resize() {

        console.log($wb_container)

        var narrow_screen = (($container.height()/$container.width()) > wb_aspect_ratio);

        // Snap to SIDES if narrow or mobile, else snap to TOP/BOTTOM
        $wb_container.css({
            width:  narrow_screen ? $container.width() : $container.height() / wb_aspect_ratio,
            height: narrow_screen ? $container.width() * wb_aspect_ratio : $container.height(),
        });
    }

    $(window).resize(resize);
    resize();
});
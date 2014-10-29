// Add support for dragging images into the browser window and auto-uploading to imgur
var showSpinner, hideSpinner;
showSpinner = function () {
    $("#uploadingmessage").show().animate({"left": 50}, "slow");
}
hideSpinner = function () {
    $("#uploadingmessage").stop(true).animate({"left": -450}, "slow", function () {
        $("#uploadingmessage").hide();
    });
}

$(function () {

    $("html").on("dragover", function (event) {
        event.preventDefault();
        event.stopPropagation();
    });

    $("html").on("dragleave", function (event) {
        event.preventDefault();
        event.stopPropagation();
    });

    $("html").on("drop", function (e) {

        // Function to draw an image onto the page, and resize to fit
        function drawImage(url) {

            // Require a non-empty URL starting with http
            var margin = 100, new_img = new Raster(url);
            new_img.onLoad = function () {
                // Position the image where the mouse was when it was released
                new_img.position = new Point(e.originalEvent.pageX, e.originalEvent.pageY);
                if (new_img.bounds.height > view.bounds.height - 2 * margin) {
                    new_img.scale(($("#myCanvas").height() - 2 * margin) / new_img.bounds.height);
                }
                if (new_img.bounds.width > view.bounds.width - 2 * margin) {
                    new_img.scale(($("#myCanvas").width() - 2 * margin) / new_img.bounds.width);
                }

                view.update();
                update_gifs();
                hideSpinner();
            };
        }
        
        e.preventDefault();
        e.stopPropagation();
        var dataTransfer = e.originalEvent.dataTransfer;
        if (dataTransfer.files.length > 0) {
            // File drop from OS
            showSpinner();
            for (var i = 0; i < dataTransfer.files.length; i++) {
                var file = dataTransfer.files[i];
                var reader = new FileReader();
                
                reader.onload = function (ev) {
                    var img_base64 = ev.target.result;
                    var img = img_base64.substr(img_base64.indexOf(",") + 1);
                    
                    
                    $.ajax({
                        url: 'https://api.imgur.com/3/image',
                        type: 'post',
                        headers: {
                            Authorization: 'Client-ID c51cfd61471e714'
                        },
                        data: {
                            image: img
                        },
                        dataType: 'json',
                        success: function (json, status, jqXHR) {
                            var url = json.data.link;
                            /* Take the "Huge" thumbnail - max 1024x1024 pixels
                             * Reduces memory overhead and hopefully faster
                             * Doesn't enlarge smaller images
                             * https://api.imgur.com/models/image
                             */
                            url = url.replace(/\.([^\.]*)$/, 'h.$1').replace("http://","https://");
                            drawImage(url);
                        },
                        error: function (json) {
                            console.log(json);
                            hideSpinner();
                        }
                    });
                    
                };
                
                reader.readAsDataURL(file);
            }

        } else if (dataTransfer.types.length > 0 && dataTransfer.getData("Text") != "") {

            // Image drop from browser

            showSpinner();
            var url = dataTransfer.getData("Text");
            console.log(url, e.originalEvent.pageX, e.originalEvent.pageY);

            // Test if the URL is of an image (http://stackoverflow.com/a/9714891)
            
            if (!(/^https?:\/\//.test(url))) {
                // Require image to be served over HTTP or HTTPS (not data URIs or anything exotic)
                var message = "The image that you dropped is not served over HTTP or HTTPS.\nPlease save the image to your computer and then drag-and-drop it onto the board.";
                alert(message);
                console.log(message);
                hideSpinner();
                return;
            }
            
            var timedOut = false, timer;
            var img = new Image();
            img.onerror = function () {
                if (!timedOut) {
                    clearTimeout(timer);
                    // callback - error
                    hideSpinner();
                    console.log("Could not load image: " + url);
                }
            };
            img.onload = function () {
                if (!timedOut) {
                    clearTimeout(timer);
                    // callback - success
                    drawImage(url);
                }
            };
            img.src = url;
            timer = setTimeout(function () {
                timedOut = true;
                console.log("Image timed out: " + url);
                hideSpinner();
            }, 3000);
        }
    });
    
});

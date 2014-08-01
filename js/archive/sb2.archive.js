// Implements JS for archive.html

$(function() {
    
    $.ajax({
        "url": "cgi-bin/get_archive_images.py",
        "success": function(data) {
            var imageContainer = $("#imagecontainer");
            
            for (var i = 0; i < data.images.length; i++) {
                var imageName = data.images[i];
                var imageUrl = "content/archive/" + imageName;
                var link = $("<a />").attr({
                   "href": imageUrl,
                   "target": "_blank"
                });
                $("<img />").attr({
                    "src": imageUrl
                }).appendTo(link);
                
                link.appendTo(imageContainer);
            }
        },
        "error": function(jqXHR) {
            
        }
    });
    
});
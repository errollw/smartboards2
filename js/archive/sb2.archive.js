// Implements JS for archive.html

var urlParams;

(function initializeUrlParams() {
	var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
})();

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

$(function() {
    
    var extractImageMetadata = function(url) {
        var re = /(\d{2})\-(\d{2})\-(\d{2})T(\d{2})\-(\d{2})\-(\d{2})\.(?:\d{6})(r_([GFS][NESWC]\d{2}))\.jpg/ig
        var match = re.exec(url);
        var output = {
            "imageName": match[0],
            "date": new Date("20" + pad(match[1],2), match[2], match[3], match[4], match[5], match[6]),
            "r_id": match[7],
            "room": match[8].toUpperCase()
        }
        return output;
    };
    
    var getData = ("r_id" in urlParams && "r_id".length > 0) ? { "r_id":urlParams.r_id} : {};
    
    $.ajax({
        "url": "cgi-bin/get_archive_images.py",
        "data": getData,
        "success": function(response) {
            var imageContainer = $("#imagecontainer");
            
            for (var i = 0; i < response.images.length; i++) {
                var imageName = response.images[i];
                var imageUrl = "content/archive/" + imageName;
                var imageMetadata = extractImageMetadata(imageName);
                var link = $("<a />").attr({
                   "href": imageUrl,
                   "target": "_blank",
                   "title": imageMetadata.room + ": " + pad(imageMetadata.date.getDate(),2) + "/" + pad(imageMetadata.date.getMonth() + 1, 2) + "/" + imageMetadata.date.getFullYear() + " " + pad(imageMetadata.date.getHours(), 2) + ":" + pad(imageMetadata.date.getMinutes(), 2)
                });
                var image = $("<img />").attr({
                    "src": imageUrl
                }).appendTo(link);
                
                //var metadata = $("<div />").text(imageName).appendTo(link);
                
                link.appendTo(imageContainer);
            }
        },
        "error": function(jqXHR) {
            
        }
    });
    
    $("#board").on("change", function() {
        $(this).parents("form").submit();
    }).val("r_id" in getData ? getData.r_id : "");
    
});
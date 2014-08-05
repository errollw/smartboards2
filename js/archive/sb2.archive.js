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
        var re = /(\d{4})\-(\d{2})\-(\d{2})T(\d{2})\-(\d{2})\-(\d{2})\.(?:\d{6})(r_([GFS][NESWC]\d{2}))\.jpg/ig
        var match = re.exec(url);
        var output = {
            "imageName": match[0],
            "date": new Date(pad(match[1],2), parseInt(match[2]) - 1, match[3], match[4], match[5], match[6]),
            "r_id": match[7],
            "room": match[8].toUpperCase()
        }
        return output;
    };
    
    var getData = ("r_id" in urlParams && urlParams["r_id"].length > 0) ? { "r_id":urlParams.r_id} : {};
    
    // Default from and to dates
    var dateFilter = {};
    dateFilter.from = new Date(); dateFilter.from.setMonth(dateFilter.from.getMonth() - 3); dateFilter.from.setHours(0,0,0); // 3 months ago
    dateFilter.to = new Date(); dateFilter.to.setHours(23,59,59); // End of current day (to allow for clocks not lining up properly)
    
    // Override the default dates if supplied in the URL
    var fields = ["from", "to"];
    for (i in fields) {
        if (fields[i] in urlParams && urlParams[fields[i]].length > 0) {
            var input = urlParams[fields[i]];
            var re = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(2[0-9]{3})$/ig;
            var matches = re.exec(input);
            if (matches !== null) {
                dateFilter[fields[i]] = new Date(matches[3], matches[2] - 1, matches[1]);
                if (fields[i] == "from") {
                    dateFilter.from.setHours(0,0,0);
                } else if (fields[i] == "to") {
                    dateFilter.to.setHours(23,59,59);
                }
            }
        }
        // Update the value in the text boxes
        $("#" + fields[i]).val(dateToString(dateFilter[fields[i]]));
    }
    
    function dateToString(myDate) {
        return pad(myDate.getDate(),2) + "/" + pad(myDate.getMonth() + 1, 2) + "/" +myDate.getFullYear()
    };
    
    var starredImages, starringEnabled = false;
    var displayOnlyStarredImages = false;
    if ("displayOnlyStarredImages" in urlParams && urlParams["displayOnlyStarredImages"].length > 1) {
        displayOnlyStarredImages = true;
        $("#displayOnlyStarredImages").prop('checked', true);
    }
    
    $.ajax({
        "url": displayOnlyStarredImages ? "content/starredImages/starredImages.json" : "cgi-bin/get_archive_images.py",
        "data": getData,
        "success": function(response) {
            var imageContainer = $("#imagecontainer");
            var lastDate = "";
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            
            
            
            for (var i = 0; i < response.images.length; i++) {
                var imageName = response.images[i];
                var imageUrl = "content/archive/" + imageName;
                var imageMetadata = extractImageMetadata(imageName);
                
                // Check that the date is within the desired range
                if (dateFilter.from < imageMetadata.date && imageMetadata.date < dateFilter.to) {
                    var formattedDate = dateToString(imageMetadata.date);
                    var formattedTime = pad(imageMetadata.date.getHours(), 2) + ":" + pad(imageMetadata.date.getMinutes(), 2);
                    
                    // Display the date whenever it changes
                    if (lastDate != formattedDate) {
                        $("<div />").html("<div><span class=\"day\">" + imageMetadata.date.getDate() + "</span><br /><span class=\"month\">" + monthNames[imageMetadata.date.getMonth()] + "</span></div>").appendTo(imageContainer);
                    }
                    lastDate = formattedDate;
                    
                    var link = $("<a />").attr({
                       "href": imageUrl,
                       "target": "_blank",
                       "title": imageMetadata.room + ": " + formattedDate + " " + formattedTime
                    });
                    var image = $("<img />").attr({
                        "src": imageUrl
                    }).appendTo(link);
                    
                    $("<div />").addClass("star").appendTo(link);
                    
                    $.data(link[0], "imageName", imageName);
                    
                    link.appendTo(imageContainer);
                }
            }
            
            
            // Retrieve the list of of starred images
            $.ajax({
                "url": "content/starredImages/starredImages.json",
                "type": "GET",
                "cache": false,
                "success": function(data) {
                    starredImages = data;
                    starringEnabled = true;
                    for (i in starredImages.images) {
                        var imageName = starredImages.images[i];
                        $("#imagecontainer img[src*=" + imageName.replace(/\./g, "\\.") + "] + div").addClass("star-selected");
                    }
                },
                "error": function(jqXHR) {
                    console.log("Unable to load the list of starred images. Starring will be disabled.");
                }
            });
        },
        "error": function(jqXHR) {
            
        }
    });
    
    $("#board").on("change", function() {
        $(this).parents("form").submit();
    }).val("r_id" in getData ? getData.r_id : "");
    
    $( "#from" ).datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 1,
        onClose: function( selectedDate ) {
            $( "#to" ).datepicker( "option", "minDate", selectedDate );
        },
        dateFormat: "dd/mm/yy",
        showOtherMonths: true,
        selectOtherMonths: true
    });
    $( "#to" ).datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 1,
        onClose: function( selectedDate ) {
            $( "#from" ).datepicker( "option", "maxDate", selectedDate );
        },
        dateFormat: "dd/mm/yy",
        showOtherMonths: true,
        selectOtherMonths: true
    });
    
    
    $("#imagecontainer").on("click", ".star", function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (starringEnabled) {
            var linkEl = $(this).parents("a")[0];
            var imageName = $.data(linkEl, "imageName");
            var changesMade = false;
            
            if ($(this).hasClass("star-selected") == false) {
                // Starring the item
                // Only insert if not already present
                if (starredImages.images.indexOf(imageName) == -1) {
                    starredImages.images.push(imageName);
                    $(this).addClass("star-selected");
                    changesMade = true;
                }
            } else {
                // Un-starring the item
                // Only delete if already present
                if (starredImages.images.indexOf(imageName) != -1) {
                    starredImages.images = _.without(starredImages.images, imageName);
                    $(this).removeClass("star-selected");
                    changesMade = true;
                }
            }
            
            // If changes have been made, then save to server
            if (changesMade) {
                $.ajax({
                    "url": "cgi-bin/set_starred_images.py",
                    "type": "POST",
                    "data": {"starredImages":JSON.stringify(starredImages)},
                    "success": function(response) {
                        
                    },
                    "error": function(jqXHR) {
                        alert("Unable to save starred images.");
                    }
                });
            }
        }
    });
});
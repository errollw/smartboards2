// Implements JS for logviewer.html

$(function() {
    
    $table = $("#logs");
    
    // Load the CSV file
    $.ajax({
        "url":"cgi-bin/log.csv",
        "dataType": "text",
        "error": function(jqXHR) {
            console.log("Unable to fetch CSV file.");
        },
        "success": function(plainData) {
            var csvArrays = $.csv.toArrays(plainData);
            var $tbody = $table.find("tbody");
            $.each(csvArrays, function(i,e) {
                var $row = $("<tr />");
                $.each(e, function(j,f) {
                    $("<td />").text(f).appendTo($row);
                });
                $row.appendTo($tbody);
            });
            $table.stupidtable();
        }
    });
    
    $("#returntoindex").on("click",function() {
        window.location.href = window.location.href.replace("logviewer.html", "index.html");
    });
    $("#downloadcsv").on("click",function() {
        window.open("cgi-bin/log.csv");
    });
    
});
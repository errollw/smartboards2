// Add support for dragging images into the browser window and auto-uploading to imgur

$(function() {
	
	$("html").on("dragover", function(event) {
		event.preventDefault();  
		event.stopPropagation();
	});

	$("html").on("dragleave", function(event) {
		event.preventDefault();  
		event.stopPropagation();
	});
	
	$("html").on("drop", function(e) {
		// Function to draw an image onto the page, and resize to fit
		function drawImage(url) {
			// Require a non-empty URL starting with http
			if (url == "" || url.indexOf("http") != 0) {
				alert("Invalid image url:\n" + url);
			}
			var margin = 200;
			
			var new_img = new Raster(url);
			new_img.onLoad = function() {
				new_img.position = view.center;
				if (new_img.bounds.top < margin) {
					new_img.scale( ($("#myCanvas").height() - margin) / new_img.bounds.height);
				}
				if (new_img.bounds.left < margin) {
					new_img.scale( ($("#myCanvas").width() - margin) / new_img.bounds.width);
				}
			};
			
		};
		
		e.preventDefault();
		e.stopPropagation();
		var dataTransfer = e.originalEvent.dataTransfer;
		if (dataTransfer.types.length > 0) {
			// Image drop from browser
			var url = dataTransfer.getData("Text");
			if (url != "") {
				drawImage(url);
			}
		}
		if (dataTransfer.files.length > 0) {
			// File drop from OS
			for (var i = 0; i < dataTransfer.files.length; i++) {
				var file = dataTransfer.files[i];
				var reader = new FileReader();
				
				reader.onload = function(ev) {
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
						success: function(json, status, jqXHR) {
							var url = json.data.link;
							drawImage(url);
						},
						error: function(json) {
							console.log(json);
						}
					});
					
				};
				
				reader.readAsDataURL(file);
			}
		}
	});
	
});

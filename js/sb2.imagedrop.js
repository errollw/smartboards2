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
			var margin = 100;
			
			var new_img = new Raster(url);
			new_img.onLoad = function() {
				// Position the image where the mouse was when it was released
				new_img.position = new Point(e.originalEvent.pageX, e.originalEvent.pageY);
				
				if (new_img.bounds.height > view.bounds.height - 2 * margin) {
					new_img.scale( ($("#myCanvas").height() - 2 * margin) / new_img.bounds.height );
				}
				if (new_img.bounds.width > view.bounds.width - 2 * margin) {
					new_img.scale( ($("#myCanvas").width() - 2 * margin) / new_img.bounds.width );
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
				// Test if the URL is of an image (http://stackoverflow.com/a/9714891)
				var timedOut = false, timer;
				var img = new Image();
				img.onerror = function() {
					if (!timedOut) {
						clearTimeout(timer);
						// callback - error
						console.log("Could not load image: " + url);
					}
				};
				img.onload = function() {
					if (!timedOut) {
						clearTimeout(timer);
						// callback - success
						drawImage(url);
					}
				};
				img.src = url;
				timer = setTimeout(function() {
					timedOut = true;
					console.log("Image timed out: " + url);
				}, 1000);
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
							/* Take the "Huge" thumbnail - max 1024x1024 pixels
							 * Reduces memory overhead and hopefully faster
							 * Doesn't enlarge smaller images
							 * https://api.imgur.com/models/image
							 */
							url = url.replace(/\.([^\.]*)$/, 'b.$1').replace("http://","https://");
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

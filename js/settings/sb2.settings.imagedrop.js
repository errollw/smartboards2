// Implements drag-and-drop images for the profile pic

$(function() {
	
	$("html").on("dragover", ".user img", function(event) {
		event.preventDefault();  
		event.stopPropagation();
	});

	$("html").on("dragleave", ".user img", function(event) {
		event.preventDefault();  
		event.stopPropagation();
	});
	
	$("html").on("drop", ".user img", function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		// Display working message
		$("#imageLoading").show();
		
		var dataTransfer = e.originalEvent.dataTransfer;
		var theImage = this;
		
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
						$("#imageLoading").hide();
					}
				};
				img.onload = function() {
					if (!timedOut) {
						clearTimeout(timer);
						// callback - success
						$(theImage).closest("section").find("input[name=input_imageUrl]").val(url).trigger("input");
						$("#imageLoading").hide();
					}
				};
				img.src = url;
				timer = setTimeout(function() {
					timedOut = true;
					console.log("Image timed out: " + url);
					$("#imageLoading").hide();
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
							/* Use the big square thumbnail
							 * https://api.imgur.com/models/image
							 */
							url = url.replace(/\.([^\.]*)$/, 'b.$1');
							
							var tmpImg = new Image();
							tmpImg.onload = function() {
								$(theImage).closest("section").find("input[name=input_imageUrl]").val(url).trigger("input");
								$("#imageLoading").hide();
							};
							tmpImg.src = url;
						},
						error: function(json) {
							console.log(json);
							$("#imageLoading").hide();
						}
					});
					
				};
				
				reader.readAsDataURL(file);
			}
		}
	});
	
});

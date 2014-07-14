/**
 * Listens for the app launching then sets a time for checking for updates
 */

chrome.runtime.onStartup.addListener(function() {
	
	var notificationsEnabled = true;
	var notificationsDisableTimer;
	
	// Create the timer
		// Retrieve the latest settings
		chrome.storage.sync.get("NetBoardsNotificationPlugin", function(storedData) {
			// Only check for updates if the URL has been set
			if (storedData.NetBoardsNotificationPlugin.baseUrl) {
				// Create and send the XMLHttpRequest
				var xhr = new XMLHttpRequest();
				xhr.open("GET", storedData.NetBoardsNotificationPlugin.baseUrl + "cgi-bin/get_board_ver.py?r_id=" + storedData.NetBoardsNotificationPlugin.room, true);
				xhr.onreadystatechange = function() {
					if (xhr.readyState == 4) {
						// Parse the response text
						var latest = JSON.parse(xhr.responseText);
						// Was the request successful?
						if (latest.success == true) {
							// Is there a stored version?
							if (storedData.NetBoardsNotificationPlugin.ver) {
								// Yes, compare the versions
								if (notificationsEnabled == true && latest.ver > storedData.NetBoardsNotificationPlugin.ver) {
									// Latest version is newer, display a notification
									chrome.notifications.create("NetBoardsNotificationPlugin", {
										"type": "basic",
										"iconUrl": "icon_128.png",
										"title": "Your NetBoard has been updated",
										"message": "Click here to view your NetBoard"
									}, function() {
										// What to do when you click the notification
										chrome.notifications.onClicked.addListener(function() {
											// Open a window showing the NetBoard
											window.open(storedData.NetBoardsNotificationPlugin.baseUrl + "?r_id=" + storedData.NetBoardsNotificationPlugin.room);
											// Disable notifications for five minutes
											notificationsEnabled = false;
											// Clear existing timer
											clearTimeout(notificationsDisableTimer);
											// Start new timer
											notificationsDisableTimer = setTimeout(function(){
												notificationsEnabled = true;
											}, 300000);
										});
									} );
								} else {
									// Notifications disabled, or no change
								}
							} else {
								// No stored version, just store this version
							}
							// Update the stored version information
							storedData.NetBoardsNotificationPlugin.ver = latest.ver;
							chrome.storage.sync.set({
								"NetBoardsNotificationPlugin" : storedData.NetBoardsNotificationPlugin
							});
						}
					}
				}
				xhr.send();
			}
		});
	}, 30000); // check twice per minute
	
})
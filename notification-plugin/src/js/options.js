$(function() {
	
	
	$("#saveButton").click(save);
	
	function save() {
		var data = {
			"baseUrl" : $("#baseUrl").val(),
			"room" : $("#room").val().toLowerCase()
		};
		chrome.storage.sync.set({
			"NetBoardsNotificationPlugin" : data
		});
	};
	
	function load() {
		chrome.storage.sync.get("NetBoardsNotificationPlugin", function(data) {
			$("#baseUrl").val(data.NetBoardsNotificationPlugin.baseUrl);
			$("#room").val(data.NetBoardsNotificationPlugin.room);
		});
	};
	
	function reset() {
		chrome.storage.sync.remove("windowPositioner");
	};
	
	load();
	
	
});
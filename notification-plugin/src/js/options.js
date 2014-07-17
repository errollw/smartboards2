$(function() {
	
	
	$("#saveButton").click(save);
	
	function save() {
		var data = {
			"boardUrl" : $("#boardUrl").val(),
			"boardVersionUrl" : $("#boardVersionUrl").val(),
			"room" : $("#room").val().toLowerCase()
		};
		chrome.storage.sync.set({
			"NetBoardsNotificationPlugin" : data
		});
	};
	
	function load() {
		chrome.storage.sync.get("NetBoardsNotificationPlugin", function(data) {
			$("#boardUrl").val(data.NetBoardsNotificationPlugin.boardUrl);
			$("#boardVersionUrl").val(data.NetBoardsNotificationPlugin.boardVersionUrl);
			$("#room").val(data.NetBoardsNotificationPlugin.room);
		});
	};
	
	function reset() {
		chrome.storage.sync.remove("NetBoardsNotificationPlugin");
	};
	
	load();
	
	
});
// Implements an undo function

/* Fixed Queue implementation
 * Ben Nadel
 * http://www.bennadel.com/blog/2308-creating-a-fixed-length-queue-in-javascript-using-arrays.htm
 */
function FixedQueue(e,t){t=t||[];var n=Array.apply(null,t);n.fixedSize=e;n.push=FixedQueue.push;n.splice=FixedQueue.splice;n.unshift=FixedQueue.unshift;FixedQueue.trimTail.call(n);return n}FixedQueue.trimHead=function(){if(this.length<=this.fixedSize){return}Array.prototype.splice.call(this,0,this.length-this.fixedSize)};FixedQueue.trimTail=function(){if(this.length<=this.fixedSize){return}Array.prototype.splice.call(this,this.fixedSize,this.length-this.fixedSize)};FixedQueue.wrapMethod=function(e,t){var n=function(){var n=Array.prototype[e];var r=n.apply(this,arguments);t.call(this);return r};return n};FixedQueue.push=FixedQueue.wrapMethod("push",FixedQueue.trimHead);FixedQueue.splice=FixedQueue.wrapMethod("splice",FixedQueue.trimTail);FixedQueue.unshift=FixedQueue.wrapMethod("unshift",FixedQueue.trimTail);

var undo_stackLength = 25;
var undo_undoStack = FixedQueue(undo_stackLength);
var undo_redoStack = FixedQueue(undo_stackLength);
var undo_saveState, undo_performUndo, undo_updateButtons, tidyJSONProject;
$(function(){
	
	/* Function to perform an in-place tidy up the generated JSON representation
	 *
	 * Removes shapes
	 * Removes Paths
	 * Deselects everything
	 */
	tidyJSONProject = function (input) {
		if (input.length > 0) {
			var els = input[0][1].children;
			if (input[0][1].selected) {
				delete input[0][1].selected;
			}
			if (els) {
				var len = els.length;
				while (len--) { // go backwards through array because we are deleting elements from it
					var theEl = els[len];
					if (theEl[0] == "Shape") { // remove Shapes - they are the selection boxes
						els.splice(len,1);
					} else if (theEl[0] == "Path" && (typeof theEl[1].segments == "undefined" || theEl[1].segments.length <= 1)) { // remove paths with one or fewer points
						els.splice(len,1);
					} else if (theEl[1].selected) { // deselect everything in the exported JSON
						delete theEl[1].selected;
					}
				}
			}
		}
		return input;
	};
	
	/* Function to save the current state if different to the last state on the stack
	 */
	 undo_saveState = function() {
		var newState = JSON.stringify(tidyJSONProject(project.exportJSON({asString:false})));
		var prevState =  undo_undoStack.pop();
		if (typeof prevState != "undefined") { // was there even a previous state?
			if (prevState != newState) { // only add a state if there has been a change
				console.log("Adding new undo state");
				undo_undoStack.push(prevState);
				undo_undoStack.push(newState);
				
				// Clear the redo-stack
				undo_redoStack = new FixedQueue(undo_stackLength);
			} else {
				 undo_undoStack.push(prevState);
			}
		} else {
			console.log("Adding new undo state");
			undo_undoStack.push(newState);
			// Clear the redo-stack
			undo_redoStack = new FixedQueue(undo_stackLength);
		}
		undo_updateButtons();
	};
	
	/* Function to undo changes to the last saved state that is different to the current state
	 */
	undo_performUndo = function() {
		console.log("undo stack length: " +  undo_undoStack.length);
		var lastState =  undo_undoStack.pop();
		if (lastState) { // Only attempt to undo if there is actually an undo state
			var current = JSON.stringify(tidyJSONProject(project.exportJSON({asString:false})));
			if (lastState != current) { // Only undo if the previous state is different
				console.log("Undone");
				project.clear();
				project.importJSON(lastState);
				hide_floatie();
				view.update();
				// Save 'current' state to redo stack
				undo_redoStack.push(current);
			} else {
				console.log("Last state no different, going further back");
				 undo_performUndo(); // previous state is no different, so try undoing again
			}
		} else {
			console.log("Nothing to undo");
		}
		undo_updateButtons();
	};
	
	/* Function to redo changes after an undo
	 */
	undo_performRedo = function() {
		console.log("redo stack length: " +  undo_redoStack.length);
		var nextState =  undo_redoStack.pop();
		if (nextState) { // Only attempt to undo if there is actually an undo state
			var current = JSON.stringify(tidyJSONProject(project.exportJSON({asString:false})));
			if (nextState != current) { // Only undo if the previous state is different
				console.log("Redone");
				project.clear();
				project.importJSON(nextState);
				hide_floatie();
				view.update();
				// Save 'current' state to undo stack
				undo_undoStack.push(current);
			} else {
				console.log("Next state no different, going further forward");
				 undo_performRedo(); // previous state is no different, so try undoing again
			}
		} else {
			console.log("Nothing to redo");
		}
		undo_updateButtons();
	};
	
	/* Function to show/hide the undo and redo buttons
	 */
	undo_updateButtons = function() {
		var btn = $("div.button#undo");
		var isVisible = btn.css("background-image").indexOf("enabled") > -1;
		if (isVisible && undo_undoStack.length == 0) {
			btn.css({"background-image":'url("assets/icon_undo-disabled.svg")'});
		} else if (!isVisible && undo_undoStack.length > 0) {
			btn.css({"background-image":'url("assets/icon_undo-enabled.svg")'});
		}
		// TODO: Add redo button code
		var btn = $("div.button#redo");
		var isVisible = btn.css("background-image").indexOf("enabled") > -1;
		if (isVisible && undo_redoStack.length == 0) {
			btn.css({"background-image":'url("assets/icon_redo-disabled.svg")'});
		} else if (!isVisible && undo_redoStack.length > 0) {
			btn.css({"background-image":'url("assets/icon_redo-enabled.svg")'});
		}
	};
	
	/* Bind undo_saveState to mousedown and touchstart events
	 */
	$(document).on("mousedown touchstart", function(event) {
		// Ignore clicks on the controls (but do pay attention to floatie clicks as these can change the board)
		if ($(event.target).parents("#controls").length == 0) {
			undo_saveState();
		}
	});
	
	/* Bind undo_performUndo to the Control-Z keyboard shortcut
	 */
	$(document).on("keyup", function(event) {
		if (event.ctrlKey && event.keyCode == 90) {
			 undo_performUndo();
		}
	});
	
	/* Bind to undo button in controls
	 */
	$("div.button#undo").on("click", undo_performUndo);
	
	/* Bind to redo button in controls
	 */
	$("div.button#redo").on("click", undo_performRedo);
	
});
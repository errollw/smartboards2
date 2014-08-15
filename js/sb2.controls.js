// Possible edit modes: DRAWING, ERASING, SELECTING, TRANSFORMING
edit_mode = "DRAWING";
default_edit_mode = "SELECTING";

// Clipboard (array of exported JSON strings)
var clipboard = [];
var moveSelectedItems = function (d) {
    for (var i = 0; i < project.selectedItems.length; i++) {
        project.selectedItems[i].position = project.selectedItems[i].position.add(d);
    }
    if (project.selectedItems.length > 0) {
        show_floatie(selected_items_rect.position);
    }
}

$(document).on("keydown", function (evt) {
    
    // Cancel the default behaviour if this gets set to true
    var dealtWith = false;
    
    if (evt.ctrkKey && evt.altKey) {
        // Control key and alt key
    } else if (evt.ctrlKey && !evt.altKey) {
        // Control key only
        switch(evt.keyCode) {
            case 65: // A key for Ctrl-A select all
                set_edit_mode("SELECTING");
                remove_selection_rects();
                for (var i = 0; i < project.layers.length; i++) {
                    for (var j = 0; j < project.layers[i].children.length; j++) {
                        project.layers[i].children[j].selected = true;
                    }
                }
                make_selection_rect();
                if (project.selectedItems.length > 0) {
                    show_floatie(selected_items_rect.position);
                }
                dealtWith = true;
                break;
            case 68: // D key for Ctrl-D duplicate
                clone_selected_items();
                dealtWith = true;
                break;
            case 90: // Z key for Ctrl-Z undo
                undo_performUndo();
                dealtWith = true;
                break;
            case 89: // Y key for Ctrl-Y redo
                undo_performRedo();
                dealtWith = true;
                break;
            case 88: // X key for Ctrl-X cut
                clipboard = [];
                for (var i = project.selectedItems.length - 1; i >= 0 ; i--) { // iterate backwards because we are deleting elements
                    if (!(project.selectedItems[i] instanceof Shape)) {
                        clipboard.push(project.selectedItems[i].exportJSON());
                        project.selectedItems[i].remove();
                    }
                }
                hide_floatie();
                deselect_all();
                remove_selection_rects();
                dealtWith = true;
                break;
            case 67: // C key for Ctrl-C copy
                clipboard = [];
                for (var i = 0; i < project.selectedItems.length; i++) {
                    if (!(project.selectedItems[i] instanceof Shape)) {
                        clipboard.push(project.selectedItems[i].exportJSON());
                    }
                }
                dealtWith = true;
                break;
            case 86: // V key for Ctrl-V paste
                hide_floatie();
                deselect_all();
                remove_selection_rects();
                for (var i = 0; i < clipboard.length; i++) {
                    project.activeLayer.importJSON(clipboard[i]);
                }
                make_selection_rect();
                show_floatie(selected_items_rect.position);
                dealtWith = true;
                break;
            case 82: // R key for Ctrl-R reset board
                project.clear();
                hide_floatie();
                dealtWith = true;
                break;
        }
    } else if (!evt.ctrlKey && evt.altKey) {
        // Alt key only
    } else {
        // No modifiers
        switch(evt.keyCode) {
            case 8: // Backspace key for delete item (using fall-through)
            case 46: // Delete key for delete item
                remove_selected_items();
                hide_floatie();
                dealtWith = true;
                break;
            case 36: // Home key for bring to top
                for (var i = 0; i < project.selectedItems.length; i++) {
                    project.selectedItems[i].bringToFront();
                }
                dealtWith = true;
                break;
            case 35: // End key for send to back
                for (var i = project.selectedItems.length - 1; i >= 0; i--) {
                    project.selectedItems[i].sendToBack();
                }
                dealtWith = true;
                break;
            case 33: // Page up key for bring forward
                for (var i = project.selectedItems.length - 1; i >= 0; i--) {
                    var item = project.selectedItems[i];
                    while (item.nextSibling !== null && (item.selected == true || item instanceof Shape)) {
                        item = item.nextSibling;
                    }
                    project.selectedItems[i].insertAbove(item);
                }
                dealtWith = true;
                break;
            case 34: // Page down key for send backward
                for (var i = project.selectedItems.length - 1; i >= 0; i--) {
                    var item = project.selectedItems[i];
                    while (item.previousSibling !== null && (item.selected == true || item instanceof Shape)) {
                        item = item.previousSibling;
                    }
                    project.selectedItems[i].insertBelow(item);
                }
                dealtWith = true;
                break;
            case  67: // C for cursor tool selection
                set_edit_mode("SELECTING");
                dealtWith = true;
                break;
            case  69: // E for eraser tool selection
                set_edit_mode("ERASING");
                dealtWith = true;
                break;
            case  68: // D for drawing tool selection
                set_edit_mode("DRAWING");
                dealtWith = true;
                break;
            case  80: // P for pan tool selection
                set_edit_mode("PANNING");
                dealtWith = true;
                break;
            case  73: // I for image tool selection
                imageUrlPrompt();
                dealtWith = true;
                break;
            case 27: // Escape for cancel selection
                deselect_all();
                hide_floatie();
                dealtWith = true;
                break;
            case 38: // Up arrow for move up (Shift-Up for fine movement)
                moveSelectedItems(new Point(0,evt.shiftKey ? -1 : -10));
                dealtWith = true;
                break;
            case 40: // Down arrow for move up (Shift-Down for fine movement)
                moveSelectedItems(new Point(0,evt.shiftKey ? 1 : 10));
                dealtWith = true;
                break;
            case 37: // Left arrow for move up (Shift-Left for fine movement)
                moveSelectedItems(new Point(evt.shiftKey ? -1 : -10, 0));
                dealtWith = true;
                break;
            case 39: // Right arrow for move up (Shift-Right for fine movement)
                moveSelectedItems(new Point(evt.shiftKey ? 1 : 10, 0));
                dealtWith = true;
                break;
            case 84: // T for text modes
                set_edit_mode("TEXT");
                dealtWith = true;
                break;
        }
    }
    
    if (dealtWith == true) {
        view.update();
        evt.preventDefault();
        return false;
    } else {
        console.log("Keyboard event not captured: keyCode=" + evt.keyCode);
    }
});

$(document).ready(function() {
    $('#controls #pen').click(function(){set_edit_mode("DRAWING")});
    $('#controls #eraser').click(function(){set_edit_mode("ERASING")});
    $('#controls #cursor').click(function(){set_edit_mode("SELECTING")});
    $('#controls #pan').click(function(){set_edit_mode("PANNING")});
    $('#controls #text').click(function(){set_edit_mode("TEXT")});

    set_edit_mode(default_edit_mode);
});


function hide_controls(){
    $('#controls').addClass('hidden');
    close_pen_thickness_controls();
    close_color_picker_controls();
}


function show_controls(){
    $('#controls').removeClass('hidden');
}


function imageUrlPrompt(){
    var url = prompt("Please enter image url", "image url");

    if (url != null) {
        var new_img = new Raster(url);
        new_img.position = view.center;
    }
}

// TODO: TIDY THIS UP!
function set_edit_mode(new_edit_mode){

    hide_floatie();

    edit_mode = new_edit_mode;

    // adjust touch & mouse sensitivity
    // min_delta_touch = (edit_mode == "DRAWING") ? 4 : 1;

    // potentially cancel all selection procedures
    if (edit_mode == "DRAWING" || edit_mode == "ERASING" || edit_mode == "TEXT"){
        project.deselectAll();
        remove_selection_rects();
		view.update();
    }

    $('#controls div').removeClass('selected');
    $('#controls #pen').toggleClass('selected', edit_mode == "DRAWING");
    $('#controls #eraser').toggleClass('selected', edit_mode == "ERASING");
    $('#controls #cursor').toggleClass('selected', edit_mode == "SELECTING");
    $('#controls #pan').toggleClass('selected', edit_mode == "PANNING");
    $('#controls #text').toggleClass('selected', edit_mode == "TEXT");

    //view.update();
}
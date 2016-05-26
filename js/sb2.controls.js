// Possible edit modes: DRAWING, ERASING, SELECTING, TRANSFORMING
edit_mode = "DRAWING";
default_edit_mode = "SELECTING";

nudge_amount_px = 10;

// Clipboard (array of exported JSON strings)
var clipboard = [];

// for nudging selected items around
var moveSelectedItems = function (d) {
    for (var i = 0; i < project.selectedItems.length; i++) {
        project.selectedItems[i].position = project.selectedItems[i].position.add(d);
    }
    if (project.selectedItems.length > 0) {
        show_floatie(selected_items_rect.position);
    }
}

// This is for Banana Mode
var keyPressBuffer = "";
var keyboardMap = ["","","","CANCEL","","","HELP","","BACK_SPACE","TAB","","","CLEAR","ENTER","RETURN","","SHIFT","CONTROL","ALT","PAUSE","CAPS_LOCK","KANA","EISU","JUNJA","FINAL","HANJA","","ESCAPE","CONVERT","NONCONVERT","ACCEPT","MODECHANGE","SPACE","PAGE_UP","PAGE_DOWN","END","HOME","LEFT","UP","RIGHT","DOWN","SELECT","PRINT","EXECUTE","PRINTSCREEN","INSERT","DELETE","","0","1","2","3","4","5","6","7","8","9","COLON","SEMICOLON","LESS_THAN","EQUALS","GREATER_THAN","QUESTION_MARK","AT","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","WIN","","CONTEXT_MENU","","SLEEP","NUMPAD0","NUMPAD1","NUMPAD2","NUMPAD3","NUMPAD4","NUMPAD5","NUMPAD6","NUMPAD7","NUMPAD8","NUMPAD9","MULTIPLY","ADD","SEPARATOR","SUBTRACT","DECIMAL","DIVIDE","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12","F13","F14","F15","F16","F17","F18","F19","F20","F21","F22","F23","F24","","","","","","","","","NUM_LOCK","SCROLL_LOCK","WIN_OEM_FJ_JISHO","WIN_OEM_FJ_MASSHOU","WIN_OEM_FJ_TOUROKU","WIN_OEM_FJ_LOYA","WIN_OEM_FJ_ROYA","","","","","","","","","","CIRCUMFLEX","EXCLAMATION","DOUBLE_QUOTE","HASH","DOLLAR","PERCENT","AMPERSAND","UNDERSCORE","OPEN_PAREN","CLOSE_PAREN","ASTERISK","PLUS","PIPE","HYPHEN_MINUS","OPEN_CURLY_BRACKET","CLOSE_CURLY_BRACKET","TILDE","","","","","VOLUME_MUTE","VOLUME_DOWN","VOLUME_UP","","","","","COMMA","","PERIOD","SLASH","BACK_QUOTE","","","","","","","","","","","","","","","","","","","","","","","","","","","OPEN_BRACKET","BACK_SLASH","CLOSE_BRACKET","QUOTE","","META","ALTGR","","WIN_ICO_HELP","WIN_ICO_00","","WIN_ICO_CLEAR","","","WIN_OEM_RESET","WIN_OEM_JUMP","WIN_OEM_PA1","WIN_OEM_PA2","WIN_OEM_PA3","WIN_OEM_WSCTRL","WIN_OEM_CUSEL","WIN_OEM_ATTN","WIN_OEM_FINISH","WIN_OEM_COPY","WIN_OEM_AUTO","WIN_OEM_ENLW","WIN_OEM_BACKTAB","ATTN","CRSEL","EXSEL","EREOF","PLAY","ZOOM","","PA1","WIN_OEM_CLEAR",""];
var developerMode = false;

// String.endsWith function - http://stackoverflow.com/a/2548133
if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
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
                // project.clear();
                hide_floatie();
                dealtWith = true;
                break;
        }
    } else if (!evt.ctrlKey && evt.altKey) {
        // Alt key only
        switch(evt.keyCode) {
            case 88: // X key for Alt-X developer mode
                developerMode = true;
                dealtWith = true;
                break;
        }
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
                moveSelectedItems(new Point(0,evt.shiftKey ? -1 : -nudge_amount_px));
                dealtWith = true;
                break;
            case 40: // Down arrow for move down (Shift-Down for fine movement)
                moveSelectedItems(new Point(0,evt.shiftKey ? 1 : nudge_amount_px));
                dealtWith = true;
                break;
            case 37: // Left arrow for move left (Shift-Left for fine movement)
                moveSelectedItems(new Point(evt.shiftKey ? -1 : -nudge_amount_px, 0));
                dealtWith = true;
                break;
            case 39: // Right arrow for move right (Shift-Right for fine movement)
                moveSelectedItems(new Point(evt.shiftKey ? 1 : nudge_amount_px, 0));
                dealtWith = true;
                break;
            case 84: // T for text modes
                set_edit_mode("TEXT");
                dealtWith = true;
                break;
            case 189: // - for toggling rainbow (dash) pen mode
                if (typeof window.rainbow !== "undefined" && window.rainbow == true) {
                    window.rainbow = false;
                } else {
                    window.rainbow = true;
                }
                dealtWith = true;
                break;
        }
    }
    
    if (dealtWith == true) {
        view.update();
        evt.preventDefault();
        keyPressBuffer = "";
        return false;
    } else {
        keyPressBuffer += keyboardMap[evt.keyCode] + "|";
        if (keyPressBuffer.endsWith("B|A|N|A|N|A|S|")) {
            $("div.profile-pic").css("background-image", "url('http://l-userpic.livejournal.com/8052766/396814')");
            var names = $("header").has(".title");
            for (var i = 0; i < names.length; i++) {
                var titleField = $(names[i]).find(".title"), subtitleField = $(names[i]).find(".subtitle");

                if (subtitleField.text().length > 0) {
                    subtitleField.text(subtitleField.text() + " on the Moon for " + titleField.text().length + " years");
                }
                titleField.text(titleField.text().replace(/ /, ' "The Banana" '));
            }
            keyPressBuffer = "";
        }
        if (developerMode) {
            console.log("Keyboard event not captured: keyCode=" + evt.keyCode, "Key press buffer is: " + keyPressBuffer);
        }
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

    if (url != null && (url.match(/\.(jpeg|jpg|gif|png)$/) != null)) {
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

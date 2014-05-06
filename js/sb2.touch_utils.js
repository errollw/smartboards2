
// some browsers re-use touch objects so avoid referencing object
function copyTouch(touch) {
    return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
}

function ongoingTouchIndexById(idToFind) {
    for (var i=0; i < currentTouches.length; i++) {
      var id = currentTouches[i].identifier;
      
      if (id == idToFind)
        return i;
    }
    return -1;    // not found
}
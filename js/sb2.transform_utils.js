
// when transforming, now reset to pre-transform item before applying transfrom
// no longer works on a delta-transform basis
// add orig_item to each selected item
function switch_sel_item_with_orig(sel_item){

	// add orig_item if it doesn't already exist
	if (sel_item.orig_item == undefined){
        orig_item = sel_item.clone(false);
        sel_item.orig_item = orig_item;
    }

	// clone original item before transforming it
    cloned_item = sel_item.orig_item.clone();
    cloned_item.orig_item = sel_item.orig_item;

    // replace old item with new item
    cloned_item.insertAbove(sel_item)
    cloned_item.selected = true;
    sel_item.remove(); delete sel_item;

    return cloned_item;
}
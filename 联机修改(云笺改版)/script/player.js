import { lib,game,ui,get,ai,_status } from '../../../noname.js';
lib.element.player.chooseButtonAndWriteNameOL = function(list, callback, ai) {
    var next = game.createEvent("chooseButtonAndWriteNameOL");
    next.list = list;
    next.setContent("chooseButtonAndWriteNameOL");
    next.ai = ai;
    next.callback = callback;
    next._args = Array.from(arguments);
    return next;
}
lib.element.player.chooseButtonAndWriteName = function(){
    const next = game.createEvent("chooseButtonAndWriteName");
    for (let i = 0; i < arguments.length; i++) {
        const item = arguments[i]
        const type = typeof item
        const itemtype = get.itemtype(item)
        if (type == "boolean") {
            if (!next.forced) next.forced = item;
            else next.complexSelect = item;
        } else if (itemtype == "dialog") {
            next.dialog = item;
            next.closeDialog = true;
        } else if (itemtype == "select") {
            next.selectButton = item;
        } else if (type == "number") {
            next.selectButton = [item, item];
        } else if (type == "function") {
            if (next.ai) next.filterButton = item;
            else next.ai = item;
        } else if (Array.isArray(item)) {
            next.createDialog = item;
        }
    }
    next.player = this;
    if (typeof next.forced != "boolean") next.forced = false;
    if (next.isMine() == false && next.dialog) next.dialog.style.display = "none";
    if (next.filterButton == undefined) next.filterButton = lib.filter.filterButton;
    if (next.selectButton == undefined) next.selectButton = [1, 1];
    if (next.ai == undefined)
        next.ai = function () {
            return 1;
        };
    if (next.complexSelect !== false) next.complexSelect = true;
    next.setContent("chooseButtonAndWriteName");
    next._args = Array.from(arguments);
    next.forceDie = true;
    return next;
}

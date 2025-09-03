import { lib, game, ui, get, ai, _status } from '../../../noname.js';
lib.element.content.chooseButtonAndWriteNameOL = function () {
    "step 0";
    //ui.arena.classList.add('markhidden');
    for (let i = 0; i < event.list.length; i++) {
        const current = event.list[i];
        current[0].wait();
        if (current[0].isOnline()) {
            const target = current.shift();
            target.send(
                function (func, content , args, callback, switchToAuto, processAI,tip) {
                    lib.element.content.chooseButtonAndWriteName = content
                    //ui.arena.classList.add('markhidden');
                    const next = func.apply(game.me, args);
                    next.callback = callback;
                    next.switchToAuto = switchToAuto;
                    next.processAI = processAI;
                    next.complexSelect = true;
                    next.set('inputTip',tip)
                    game.resume();
                },
                lib.element.player.chooseButtonAndWriteName,
                lib.element.content.chooseButtonAndWriteName,
                current,
                event.callback,
                event.switchToAuto,
                event.processAI,
                event.inputTip
            );
            target._choose_button_ol = current;
            event.list.splice(i--, 1);
        } else if (current[0] == game.me) {//去掉了主机
            event.last = current;
            event.last.shift();
            event.list.splice(i--, 1);
        }
    }
    "step 1";
    if (event.list.length) {
        var current = event.list.shift();
        event.target = current.shift();
        const next = event.target.chooseButtonAndWriteName.apply(event.target, current);
        next.set('inputTip',event.inputTip)
        next.callback = event.callback;
        next.switchToAuto = event.switchToAuto;
        next.processAI = event.processAI;
    } else {
        event.goto(3);
    }
    "step 2";
    event.target.unwait(result);
    event.goto(1);
    "step 3";
    if (event.last) {
        const next = game.me.chooseButtonAndWriteName.apply(game.me, event.last);
        next.set('inputTip',event.inputTip)
        next.callback = event.callback;
        next.switchToAuto = event.switchToAuto;
        next.processAI = event.processAI;
    } else {
        event.goto(5);
    }
    "step 4";
    game.me.unwait(result);
    "step 5";
    if (!event.resultOL) {
        game.pause();
    }
    "step 6";
    /*game.broadcastAll(function(){
        ui.arena.classList.remove('markhidden');
    });*/
    event.result = event.resultOL;
}
lib.element.content.chooseButtonAndWriteName = function () {
    "step 0";
    if (typeof event.dialog == "number") {
        event.dialog = get.idDialog(event.dialog);
    }
    if (event.createDialog && !event.dialog) {
        if (Array.isArray(event.createDialog)) {
            event.createDialog.add("hidden");
            event.dialog = ui.create.dialog.apply(this, event.createDialog);
        }
        event.closeDialog = true;
    }
    if (event.dialog == undefined) event.dialog = ui.dialog;
    if (event.isMine() || event.dialogdisplay) {
        event.dialog.style.display = "";
        event.dialog.open();
    }
    // if (['chooseCharacter', 'chooseButtonOL'].includes(event.getParent().name)) event.complexSelect = true;
    var filterButton =
        event.filterButton ||
        function () {
            return true;
        };
    var selectButton = get.select(event.selectButton);
    var buttons = event.dialog.buttons;
    var buttonsx = [];
    var num = 0;
    for (let i = 0; i < buttons.length; i++) {
        var button = buttons[i];
        if (filterButton(button, player)) {
            num++;
            buttonsx.add(button);
        }
    }
    if (event.isMine()) {
        if (event.hsskill && !event.forced && _status.prehidden_skills.includes(event.hsskill)) {
            ui.click.cancel();
            return;
        } else if ((event.direct && num == selectButton[0]) || event.forceDirect) {
            var buttons = buttonsx.slice(0, num);
            event.result = {
                bool: true,
                button: [buttons],
                links: get.links(buttons),
            };
            event.dialog.close();
        } else {
            game.check();
            game.pause();
        }
    } else if (event.isOnline()) {
        if ((event.direct && num == 1) || event.forceDirect) {
            var buttons = buttonsx.slice(0, num);
            event.result = {
                bool: true,
                button: [buttons],
                links: get.links(buttons),
            };
            event.dialog.close();
        } else {
            event.send();
        }
        delete event.callback;
    } else {
        event.result = "ai";
    }
    if (event.onfree) {
        lib.init.onfree();
    }
    "step 1";
    if(event.result){
        const input = _status.event.dialog.querySelector('input')
        if(input){
            // event.result.tempName = input.value
        }
    }
    if (event.result == "ai") {
        if (event.processAI) {
            event.result = event.processAI();
        } else {
            game.check();
            if ((ai.basic.chooseButton(event.ai) || forced) && (!event.filterOk || event.filterOk()))
                ui.click.ok();
            else ui.click.cancel();
        }
    }
    if (event.closeDialog) {
        event.dialog.close();
    }
    if (event.callback) {
        event.callback(event.player, event.result);
    }
    event.resume();
}
const {lib,game,ui,get,ai,_status} = suiSet
suiSet.modeConfig.doudizhu = {
    chooseMode() {
        if (lib.configOL.doudizhu_select != 'no1') {
            suiSet.onlineSelectNum = parseInt(lib.configOL.doudizhu_select)
        }
        const mode = _status.mode.slice(0, 1).toUpperCase() + _status.mode.slice(1);
        if (typeof game['chooseCharacter' + mode + 'OL'] === 'function') {
            game['chooseCharacter' + mode + 'OL']()
            return;
        }
        const next = game.createEvent('chooseCharacter');
        next.setContent(function () {
            "step 0"
            ui.arena.classList.add('choose-character');
            var i;
            var identityList = ['zhu', 'fan', 'fan'];
            identityList.randomSort();
            for (i = 0; i < game.players.length; i++) {
                game.players[i].identity = identityList[i];
                game.players[i].showIdentity();
                game.players[i].identityShown = true;
                if (identityList[i] == 'zhu') game.zhu = game.players[i];
            }

            var list;
            var list4 = [];
            event.list = [];

            var libCharacter = {};
            for (var i = 0; i < lib.configOL.characterPack.length; i++) {
                var pack = lib.characterPack[lib.configOL.characterPack[i]];
                for (var j in pack) {
                    if (j == 'zuoci') continue;
                    if (lib.character[j]) libCharacter[j] = pack[j];
                }
            }
            for (i in lib.characterReplace) {
                var ix = lib.characterReplace[i];
                for (var j = 0; j < ix.length; j++) {
                    if (!libCharacter[ix[j]] || lib.filter.characterDisabled(ix[j], libCharacter)) ix.splice(j--, 1);
                }
                if (ix.length) {
                    event.list.push(i);
                    list4.addArray(ix);
                }
            }
            game.broadcast(function (list) {
                for (var i in lib.characterReplace) {
                    var ix = lib.characterReplace[i];
                    for (var j = 0; j < ix.length; j++) {
                        if (!list.contains(ix[j])) ix.splice(j--, 1);
                    }
                }
            }, list4);
            for (i in libCharacter) {
                if (list4.contains(i) || lib.filter.characterDisabled(i, libCharacter)) continue;
                event.list.push(i);
                list4.push(i)
            }
            _status.characterlist = list4;
            "step 1"
            var list = [];
            var selectButton = (lib.configOL.double_character ? 2 : 1);

            var num, num2 = 0;
            num = Math.floor(event.list.length / game.players.length);
            num2 = event.list.length - num * game.players.length;
            if (num > 5) {
                num = 5;
            }
            if (num2 > 2) {
                num2 = 2;
            }
            let selectNum = 5
            if (lib.configOL.doudizhu_select != '11' && lib.configOL.doudizhu_select != 'no1') {
                selectNum = parseInt(lib.configOL.doudizhu_select)
            } else if (lib.configOL.doudizhu_select == '11') {
                selectNum = Math.floor(event.list.length / game.players.length) || 5
            }
            for (var i = 0; i < game.players.length; i++) {
                var num3 = 0;
                if (game.players[i] == game.zhu) num3 = 3;
                var str = '欧尼酱桑~选择角色吧！';
                let snum = selectNum + num3;
                list.push([game.players[i], [str, [event.list.randomRemove(snum), 'characterx']], selectButton, true]);
            }
            game.me.chooseButtonOL(list, function (player, result) {
                if (game.online || player == game.me) player.init(result.links[0], result.links[1]);//选择角色完成
            });
            "step 2"
            for (var i in result) {
                if (result[i] && result[i].links) {
                    for (var j = 0; j < result[i].links.length; j++) {
                        event.list.remove(get.sourceCharacter(result[i].links[j]));
                    }
                }
            }
            for (var i in result) {
                if (result[i] == 'ai') {
                    var listc = event.list.randomRemove(lib.configOL.double_character ? 2 : 1);
                    for (var i = 0; i < listc.length; i++) {
                        var listx = lib.characterReplace[listc[i]];
                        if (listx && listx.length) listc[i] = listx.randomGet();
                    }
                    result[i] = listc;
                }
                else {
                    result[i] = result[i].links
                }
                if (!lib.playerOL[i].name) {
                    lib.playerOL[i].init(result[i][0], result[i][1]);
                }
            }

            game.zhu.maxHp++;
            game.zhu.hp++;
            game.zhu.update();

            game.broadcast(function (result, zhu) {
                for (var i in result) {
                    if (!lib.playerOL[i].name) {
                        lib.playerOL[i].init(result[i][0], result[i][1]);
                    }
                }
                game.zhu = zhu;
                zhu.maxHp++;
                zhu.hp++;
                zhu.update();

                setTimeout(function () {
                    ui.arena.classList.remove('choose-character');
                }, 500);
            }, result, game.zhu);
            for (var i = 0; i < game.players.length; i++) {
                _status.characterlist.remove(game.players[i].name1);
                _status.characterlist.remove(game.players[i].name2);
            }
            setTimeout(function () {
                ui.arena.classList.remove('choose-character');
            }, 500);
        });

    },
    modeConfig() {
        game.chooseCharacterKaiheiOL = function () {
            var next = game.createEvent('chooseCharacter');
            next.setContent(function () {
                "step 0"
                ui.arena.classList.add('choose-character');
                var i;
                var identityList = ['fan', 'fan', 'fan'];
                var aiList = game.filterPlayer(function (current) {
                    return current != game.me && !current.isOnline();
                });
                if (aiList.length == 1) {
                    identityList[game.players.indexOf(aiList[0])] = 'zhu';
                }
                else {
                    identityList[0] = 'zhu';
                    identityList.randomSort();
                }
                for (i = 0; i < game.players.length; i++) {
                    game.players[i].identity = identityList[i];
                    game.players[i].showIdentity();
                    game.players[i].identityShown = true;
                    if (identityList[i] == 'zhu') game.zhu = game.players[i];
                }
                event.list = [];
                var list4 = [];

                var libCharacter = {};
                for (var i = 0; i < lib.configOL.characterPack.length; i++) {
                    var pack = lib.characterPack[lib.configOL.characterPack[i]];
                    for (var j in pack) {
                        // if(j=='zuoci') continue;
                        if (lib.character[j]) libCharacter[j] = pack[j];
                    }
                }
                for (i in lib.characterReplace) {
                    var ix = lib.characterReplace[i];
                    for (var j = 0; j < ix.length; j++) {
                        if (!libCharacter[ix[j]] || lib.filter.characterDisabled(ix[j], libCharacter)) ix.splice(j--, 1);
                    }
                    if (ix.length) {
                        event.list.push(ix.randomGet());
                        list4.addArray(ix);
                    }
                }
                for (i in libCharacter) {
                    if (list4.includes(i) || lib.filter.characterDisabled(i, libCharacter)) continue;
                    event.list.push(i);
                }
                _status.characterlist = event.list.slice(0);

                var map = {};
                const num = suiSet.getSelect(event.list);
                for (var player of game.players) {
                    player._characterChoice = event.list.randomRemove(num + (player.identity == 'zhu' ? 5 : 3));
                    if (player.identity == 'fan') player._friend = (player.next.identity == 'fan' ? player.next : player.previous);
                    map[player.playerid] = player._characterChoice;
                }
                game.broadcastAll(function (map) {
                    for (var i in map) {
                        lib.playerOL[i]._characterChoice = map[i];
                    }
                }, map);
                "step 1"
                var list = [];
                for (var i = 0; i < game.players.length; i++) {
                    var dialog = ['请选择武将', [game.players[i]._characterChoice, 'character']];
                    if (game.players[i]._friend) {
                        dialog.push('队友的武将');
                        dialog.push([game.players[i]._friend._characterChoice, 'character']);
                    }
                    list.push([game.players[i], dialog, true, function () { return Math.random() }, function (button) {
                        return _status.event.player._characterChoice.includes(button.link);
                    }]);
                }
                game.me.chooseButtonOL(list, function (player, result) {
                    if (game.online || player == game.me) player.init(result.links[0]);
                });
                "step 2"
                for (var i in lib.playerOL) {
                    if (!result[i] || result[i] == 'ai' || !result[i].links || !result[i].links.length) {
                        result[i] = lib.playerOL[i]._characterChoice.randomGet();
                    }
                    else {
                        result[i] = result[i].links[0];
                    }
                    if (!lib.playerOL[i].name) {
                        lib.playerOL[i].init(result[i]);
                    }
                }

                game.zhu.maxHp++;
                game.zhu.hp++;
                game.zhu.update();

                game.broadcast(function (result, zhu) {
                    for (var i in result) {
                        if (!lib.playerOL[i].name) {
                            lib.playerOL[i].init(result[i]);
                        }
                    }
                    game.zhu = zhu;
                    zhu.maxHp++;
                    zhu.hp++;
                    zhu.update();

                    setTimeout(function () {
                        ui.arena.classList.remove('choose-character');
                    }, 500);
                }, result, game.zhu);
                for (var i = 0; i < game.players.length; i++) {
                    _status.characterlist.remove(game.players[i].name1);
                    _status.characterlist.remove(game.players[i].name2);
                }
                setTimeout(function () {
                    ui.arena.classList.remove('choose-character');
                }, 500);
            });
        }
        game.chooseCharacterHuanleOL = function () {
            var next = game.createEvent('chooseCharacter');
            next.setContent(function () {
                "step 0"
                ui.arena.classList.add('choose-character');
                var i;
                event.list = [];
                event.list2 = [];
                var list4 = [];
                event.controls = ['不叫', '叫地主'];
                if (!event.map) event.map = {};
                var libCharacter = {};
                for (var i = 0; i < lib.configOL.characterPack.length; i++) {
                    var pack = lib.characterPack[lib.configOL.characterPack[i]];
                    for (var j in pack) {
                        // if(j=='zuoci') continue;
                        if (lib.character[j]) libCharacter[j] = pack[j];
                    }
                }
                for (i in lib.characterReplace) {
                    var ix = lib.characterReplace[i];
                    for (var j = 0; j < ix.length; j++) {
                        if (!libCharacter[ix[j]] || lib.filter.characterDisabled(ix[j], libCharacter)) ix.splice(j--, 1);
                    }
                    if (ix.length) {
                        var name = ix.randomGet();
                        event.list.push(name);
                        if (game.recommendDizhu.includes(name)) event.list2.push(name);
                        list4.addArray(ix);
                    }
                }
                for (i in libCharacter) {
                    if (list4.includes(i) || lib.filter.characterDisabled(i, libCharacter)) continue;
                    event.list.push(i);
                    if (game.recommendDizhu.includes(i)) event.list2.push(i);
                }
                const num = suiSet.getSelect(event.list)
                for (var player of game.players) {
                    var id = player.playerid;
                    if (!event.map[id]) event.map[id] = [];
                    event.map[id].addArray(event.list2.randomRemove(1));
                    event.list.removeArray(event.map[id]);
                    event.map[id].addArray(event.list.randomRemove(num - event.map[id].length));
                    event.list2.removeArray(event.map[id]);
                }
                _status.characterlist = event.list.slice(0);
                event.videoId = lib.status.videoId++;
                game.broadcastAll(function (map, id) {
                    ui.create.dialog('你的选将框', [map[game.me.playerid], 'character']).videoId = id;
                }, event.map, event.videoId);
                event.start = game.players.randomGet();
                event.current = event.start;
                if (event.current != game.me || !event.current.isOnline()) game.delay(3);
                "step 1"
                event.current.chooseControl(event.controls).set('ai', function () {
                    return Math.random() > 0.5 ? '不叫' : '叫地主';
                });
                "step 2"
                event.current.chat(result.control);
                if (result.control == '叫地主' || event.current == event.start.next) {
                    game.zhu = result.control == '叫地主' ? event.current : event.current.next;
                    for (var player of game.players) {
                        player.identity = player == game.zhu ? 'zhu' : 'fan';
                        player.showIdentity();
                        player.identityShown = true;
                    }
                    game.broadcastAll('closeDialog', event.videoId)
                    event.map[game.zhu.playerid].addArray(event.list.randomRemove(3));
                }
                else {
                    event.current = event.current.next;
                    event.goto(1);
                }
                "step 3"
                var list = [];
                var str = '选择角色';
                for (var i = 0; i < game.players.length; i++) {
                    list.push([game.players[i], [str, [event.map[game.players[i].playerid], 'character']], true]);
                }
                game.me.chooseButtonOL(list, function (player, result) {
                    if (game.online || player == game.me) player.init(result.links[0], result.links[1]);
                });
                "step 4"
                for (var i in result) {
                    if (result[i] && result[i].links) {
                        for (var j = 0; j < result[i].links.length; j++) {
                            event.list2.remove(result[i].links[j]);
                        }
                    }
                }
                for (var i in result) {
                    if (result[i] == 'ai') {
                        result[i] = event.list2.randomRemove(lib.configOL.double_character ? 2 : 1);
                    }
                    else {
                        result[i] = result[i].links
                    }
                    if (!lib.playerOL[i].name) {
                        lib.playerOL[i].init(result[i][0], result[i][1]);
                    }
                }

                game.zhu.maxHp++;
                game.zhu.hp++;
                game.zhu.update();

                game.broadcast(function (result, zhu) {
                    for (var i in result) {
                        if (!lib.playerOL[i].name) {
                            lib.playerOL[i].init(result[i][0], result[i][1]);
                        }
                    }
                    game.zhu = zhu;
                    zhu.maxHp++;
                    zhu.hp++;
                    zhu.update();

                    setTimeout(function () {
                        ui.arena.classList.remove('choose-character');
                    }, 500);
                }, result, game.zhu);
                for (var i = 0; i < game.players.length; i++) {
                    _status.characterlist.remove(game.players[i].name1);
                    _status.characterlist.remove(game.players[i].name2);
                }
                setTimeout(function () {
                    ui.arena.classList.remove('choose-character');
                }, 500);
            });
        }
        game.chooseCharacterBinglinOL = function () {
            var next = game.createEvent('chooseCharacter');
            next.setContent(function () {
                "step 0"
                ui.arena.classList.add('choose-character');
                var i;
                var libCharacter = {};
                for (var i = 0; i < lib.configOL.characterPack.length; i++) {
                    var pack = lib.characterPack[lib.configOL.characterPack[i]];
                    for (var j in pack) {
                        // if(j=='zuoci') continue;
                        if (lib.character[j]) libCharacter[j] = pack[j];
                    }
                }
                event.list = [];
                event.map = {};
                for (i in libCharacter) {
                    if (lib.filter.characterDisabled(i, libCharacter)) continue;
                    event.list.push(i);
                }
                event.list.randomSort();
                _status.characterlist = event.list.slice(0);
                event.controls = ['不叫地主', '一倍', '两倍', '三倍'];
                const num = suiSet.getSelect(event.list)
                for (var player of game.players) {
                    var id = player.playerid;
                    event.map[id] = event.list.randomRemove(num);
                }
                event.start = game.players.randomGet();
                event.current = event.start;

                event.videoId = lib.status.videoId++;
                game.zhuSkill = 'zhuSkill_' + ['xiangyang', 'jiangling', 'fancheng'].randomGet();
                game.broadcastAll(function (map, id, skill) {
                    ui.create.dialog('本局城池：' + get.translation(skill), [map[game.me.playerid], 'character']).videoId = id;
                }, event.map, event.videoId, game.zhuSkill);
                game.delay(6);
                "step 1"
                game.broadcastAll(function (id, current) {
                    var dialog = get.idDialog(id);
                    if (dialog) {
                        if (game.me == current) dialog.content.firstChild.innerHTML = '是否叫地主？';
                        else dialog.content.firstChild.innerHTML = '请等待其他玩家叫地主';
                    }
                }, event.videoId, event.current);
                if (event.current != game.me && !event.current.isOnline()) game.delay(2);
                event.current.chooseControl(event.controls).set('ai', function () {
                    return _status.event.getParent().controls.randomGet();
                });
                "step 2"
                event.current._control = result.control;
                event.current.chat(result.control);
                if (result.control == '三倍') {
                    game.bonusNum = 3;
                    game.zhu = event.current;
                    return;
                }
                else if (result.control != '不叫地主') {
                    event.controls.splice(1, event.controls.indexOf(result.control));
                    event.tempDizhu = event.current;
                    if (result.control == '二倍') game.bonusNum = 2;
                }
                event.current = event.current.next;
                if (event.current == event.start) {
                    game.zhu = event.tempDizhu || event.start;
                }
                else event.goto(1);
                if (event.current == event.start.previous && !event.tempDizhu) event.controls.remove('不叫地主');
                "step 3"
                for (var player of game.players) {
                    player.identity = player == game.zhu ? 'zhu' : 'fan';
                    player.showIdentity();
                    player.identityShown = true;
                    player._characterChoice = event.map[player.playerid];
                }
                event.map[game.zhu.playerid].addArray(event.list.randomRemove(3));
                game.broadcastAll(function (id, map) {
                    var dialog = get.idDialog(id);
                    if (dialog) dialog.close();
                    game.me._characterChoice = map[game.me.playerid];
                }, event.videoId, event.map);
                var list = [];
                for (var i = 0; i < game.players.length; i++) {
                    var dialog = ['请选择武将', [event.map[game.players[i].playerid], 'character']];
                    if (game.players[i].identity == 'fan') {
                        var friend = game.findPlayer(function (current) {
                            return current != game.players[i] && current.identity == 'fan';
                        });
                        dialog.push('<div class="text center">队友的选将框</div>');
                        dialog.push([event.map[friend.playerid], 'character']);
                    }
                    list.push([game.players[i], dialog, true, function () { return Math.random() }, function (button) {
                        return _status.event.player._characterChoice.includes(button.link);
                    }]);
                }
                game.me.chooseButtonOL(list, function (player, result) {
                    if (game.online || player == game.me) player.init(result.links[0]);
                });
                "step 4"
                for (var i in lib.playerOL) {
                    if (!result[i] || result[i] == 'ai' || !result[i].links || !result[i].links.length) {
                        result[i] = event.map[i].randomGet();
                    }
                    else {
                        result[i] = result[i].links[0];
                    }
                    if (!lib.playerOL[i].name) {
                        lib.playerOL[i].init(result[i]);
                    }
                }

                game.zhu.maxHp++;
                game.zhu.hp++;
                game.zhu.update();

                game.broadcast(function (result, zhu) {
                    for (var i in result) {
                        if (!lib.playerOL[i].name) {
                            lib.playerOL[i].init(result[i]);
                        }
                    }
                    game.zhu = zhu;
                    zhu.maxHp++;
                    zhu.hp++;
                    zhu.update();

                    setTimeout(function () {
                        ui.arena.classList.remove('choose-character');
                    }, 500);
                }, result, game.zhu);
                for (var player of game.players) {
                    if (player == game.zhu) {
                        player.addSkill(game.zhuSkill);
                    }
                    else player.addSkill(['binglin_shaxue', 'binglin_neihong']);
                }
                for (var i = 0; i < game.players.length; i++) {
                    _status.characterlist.remove(game.players[i].name1);
                    _status.characterlist.remove(game.players[i].name2);
                }
                setTimeout(function () {
                    ui.arena.classList.remove('choose-character');
                }, 500);
            });
        }
        game.chooseCharacterZhidouOL = function () {
            var next = game.createEvent('chooseCharacter');
            next.setContent(function () {
                "step 0"
                ui.arena.classList.add('choose-character');
                var i;
                var libCharacter = {};
                for (var i = 0; i < lib.configOL.characterPack.length; i++) {
                    var pack = lib.characterPack[lib.configOL.characterPack[i]];
                    for (var j in pack) {
                        // if(j=='zuoci') continue;
                        if (lib.character[j]) libCharacter[j] = pack[j];
                    }
                }
                var groups = [];
                event.list = [];
                event.map = {};
                var chara = (get.config('character_online') || lib.characterOnline);
                for (i in chara) {
                    var list = chara[i];
                    for (var j = 0; j < list.length; j++) {
                        if (!lib.character[list[j]] || lib.connectBanned.includes(list[j]) || (i == 'key' && lib.filter.characterDisabled(list[j], libCharacter))) list.splice(j--, 1);
                    }
                    if (list.length >= 3) {
                        groups.push(i);
                        event.list.addArray(list);
                    }
                }
                event.list.randomSort();
                _status.characterlist = event.list.slice(0);
                event.controls = ['不叫地主', '一倍', '两倍', '三倍'];
                const num = suiSet.getSelect(event.list)
                for (var player of game.players) {
                    var id = player.playerid;
                    player._group = groups.randomRemove(Math.floor(num/2))[0];
                    event.map[id] = chara[player._group].randomGets(Math.floor(num/2));
                    player.storage.doudizhu_cardPile = get.cards(20).sort(function (a, b) {
                        if (a.name != b.name) return lib.sort.card(a.name, b.name);
                        else if (a.suit != b.suit) return lib.suit.indexOf(a) - lib.suit.indexOf(b);
                        else return a.number - b.number;
                    });
                    player.markSkill('doudizhu_cardPile');
                }
                event.start = game.players.randomGet();
                event.current = event.start;

                event.videoId = lib.status.videoId++;
                game.broadcastAll(function (map, id) {
                    ui.create.dialog('你的选将框和底牌', [map[game.me.playerid], 'character'], game.me.storage.doudizhu_cardPile).videoId = id;
                }, event.map, event.videoId);
                game.delay(4);
                "step 1"
                game.broadcastAll(function (id, current) {
                    var dialog = get.idDialog(id);
                    if (dialog) {
                        if (game.me == current) dialog.content.firstChild.innerHTML = '是否叫地主？';
                        else dialog.content.firstChild.innerHTML = '请等待其他玩家叫地主';
                    }
                }, event.videoId, event.current);
                if (event.current != game.me && !event.current.isOnline()) game.delay(2);
                event.current.chooseControl(event.controls).set('ai', function () {
                    return _status.event.getParent().controls.randomGet();
                });
                "step 2"
                event.current._control = result.control;
                event.current.chat(result.control);
                if (result.control == '三倍') {
                    game.bonusNum = 3;
                    game.zhu = event.current;
                    return;
                }
                else if (result.control != '不叫地主') {
                    event.controls.splice(1, event.controls.indexOf(result.control));
                    event.tempDizhu = event.current;
                    if (result.control == '二倍') game.bonusNum = 2;
                }
                event.current = event.current.next;
                if (event.current == event.start && (event.start == event.tempDizhu || event.start._control == '不叫地主')) {
                    game.zhu = event.tempDizhu || event.start.previous;
                }
                else if (event.current == event.start.next && event.current._control) {
                    game.zhu = event.tempDizhu;
                }
                else event.goto(1);
                if (event.current == event.start.previous && !event.tempDizhu) event.controls.remove('不叫地主');
                "step 3"
                for (var player of game.players) {
                    player.identity = player == game.zhu ? 'zhu' : 'fan';
                    player.showIdentity();
                    player.identityShown = true;
                }
                game.broadcastAll('closeDialog', event.videoId);
                var list = [];
                for (var i = 0; i < game.players.length; i++) {
                    list.push([game.players[i], ['选择' + (game.players[i] == game.zhu ? '两' : '一') + '张武将牌', [event.map[game.players[i].playerid], 'character']], true, game.players[i] == game.zhu ? 2 : 1]);
                }
                game.me.chooseButtonOL(list, function (player, result) {
                    if (game.online || player == game.me) player.init(result.links[0], result.links[1]);
                });
                "step 4"
                for (var i in result) {
                    if (result[i] == 'ai') {
                        result[i] = event.map[i].randomRemove(lib.playerOL[i] == game.zhu ? 2 : 1);
                    }
                    else {
                        result[i] = result[i].links;
                    }
                    if (!lib.playerOL[i].name) {
                        lib.playerOL[i].init(result[i][0], result[i][1]);
                    }
                }

                game.zhu.hp = 4;
                game.zhu.maxHp = 4;
                game.zhu.update();

                game.broadcast(function (result, zhu) {
                    for (var i in result) {
                        if (!lib.playerOL[i].name) {
                            lib.playerOL[i].init(result[i][0], result[i][1]);
                        }
                    }
                    game.zhu = zhu;
                    game.zhu.hp = 4;
                    game.zhu.maxHp = 4;
                    game.zhu.update();

                    setTimeout(function () {
                        ui.arena.classList.remove('choose-character');
                    }, 500);
                }, result, game.zhu);
                for (var i = 0; i < game.players.length; i++) {
                    _status.characterlist.remove(game.players[i].name1);
                    _status.characterlist.remove(game.players[i].name2);
                }
                setTimeout(function () {
                    ui.arena.classList.remove('choose-character');
                }, 500);
            });
        }
        game.chooseCharacterWechatOL = function () {
            const next = game.createEvent('chooseCharacter')
            next.setContent(function () {
                'step 0'
                if (lib.character[lib.config.connect_avatar][4].includes('hiddenSkill')) {
                    lib.character[lib.config.connect_avatar][4].remove('hiddenSkill')
                }
                game.me.init(lib.config.connect_avatar)
                game.me.node.name.innerHTML = lib.config.connect_nickname
                game.me.clearSkills(true)
                game.me.maxHp = game.me.hp = 4
                game.me.update()
                game.broadcast((zhu, init, nickname) => {
                    if (lib.character[lib.config.connect_avatar][4].includes('hiddenSkill')) {
                        lib.character[lib.config.connect_avatar][4].remove('hiddenSkill')
                    }
                    if (lib.character[init][4].includes('hiddenSkill')) {
                        lib.character[init][4].remove('hiddenSkill')
                    }
                    game.send('initAvatar', game.onlineID, lib.config.connect_avatar)
                    zhu.init(init)
                    zhu.node.name.innerHTML = nickname
                    zhu.clearSkills(true)
                }, game.me, lib.config.connect_avatar, lib.config.connect_nickname)
                const characterList = Object.keys(suiSet.initList());
                game.broadcastAll(list => {
                    ui.arena.classList.add('choose-character');
                    const style = document.createElement('style')
                    style.innerHTML = /*css*/`
							.player:not([data-position="0"]) .playerskillList {
								width: 50px;
								height: auto;
								background-color: rgba(0,0,0,0.3);
								top: 25%;
								right: -40%;
								border-radius: 5px;
								text-align: center;
								line-height: 2;
							}
							.player[data-position="0"] .playerskillList {
								display:none;
							}
							.player.rightPlayer .playerskillList {
								left: -40%;
							}
						`
                    document.head.appendChild(style)
                    game.players.forEach((p, i) => {
                        p.node.rightskillList = ui.create.div('.playerskillList', p)
                        if (!p.nickname) {
                            p.init(list[i])
                            p.maxHp = p.hp = 4
                            p.clearSkills()
                            game.me.update()
                        }
                    })
                }, characterList.randomGets(10))
                let num = suiSet.getSelect(characterList)
                event.list = characterList
                _status.characterlist = characterList.slice()
                const map = {}
                game.players.forEach(p => {
                    if (!map[p.playerid]) map[p.playerid] = {}
                    const some = characterList.randomRemove(num)
                    some.forEach(s => {
                        const skills = lib.character[s][3].filter(p => {
                            const info = lib.skill[p]
                            return !(info.zhuSkill || info.juexingji || info.hiddenSkill || info.charlotte || info.dutySkill)
                        })
                        // const [,,,skills] = lib.character[s]
                        const random = Math.ceil((Math.floor(Math.random() * skills.length) + 1) / 2)
                        const skill = skills.randomGets(random)
                        skill.forEach(ss => {
                            if (map[p.playerid].length >= num) return;
                            map[p.playerid][ss] = s
                        })
                    })
                });
                event.pushList = suiSet.getSkillByName(characterList.randomRemove(10), map)
                event.map = map
                ui.arena.classList.add('choose-character');
                event.target = game.players.randomGet();
                event.first = event.target
                event.control = ['一倍', '两倍', '三倍', '不叫']
                event.videoId = lib.status.videoId++;;
                game.broadcastAll(function (map, id) {
                    lib.configOL.choose_timeout = '999999'
                    for (const s in map) {
                        const player = map[s]
                        const skill_name = Object.entries(player);
                        skill_name.forEach(i => {
                            lib.card[i[0]] = {
                                fullimage: true,
                                image: 'character:' + i[1]
                            }
                        })
                    }
                    const list = Object.keys(map[game.me.playerid])
                    ui.create.dialog('你的技能框<br>注意看武将旁边的技能而不是武将原画', [list, 'vcard']).videoId = id;
                }, map, event.videoId);
                if (event.target != game.me || !event.target.isOnline()) game.delay(2);
                'step 1'
                event.target.chooseControl(event.control).set('ai', function () {
                    return event.control.randomGet();
                })
                'step 2'
                event.target.chat(result.control)
                if (result.control === '三倍') {
                    const players = game.players.filter(p => {
                        return p !== event.target
                    })
                    game.broadcastAll((target, players) => {
                        target.setIdentity('zhu')
                        target.identity = 'zhu'
                        game.zhu = target
                        target.maxHp++
                        target.hp++
                        game.zhu.addSkill(['feiyang', 'bahu'])
                        players.forEach(p => {
                            p.setIdentity('fan')
                            p.identity = 'fan'
                        });
                    }, event.target, players)
                } else {
                    event.target = event.target.next
                    // event.control = 
                    event.control = event.control.remove(result.control);
                    if (event.control.length === 1) {
                        result.control = event.control[0]
                        event.redo()
                    } else {
                        event.goto(1)
                    }
                }
                'step 3'
                game.broadcastAll('closeDialog', event.videoId)
                const list = [];
                const str = '选择技能';
                for (var i = 0; i < game.players.length; i++) {
                    const selectButton = game.players[i] === game.zhu ? 3 : 2
                    const pushList = game.players[i] === game.zhu ? event.pushList : []
                    const skillList = Object.keys(event.map[game.players[i].playerid]).addArray(pushList);
                    list.push([game.players[i], [str, [skillList, 'vcard']], selectButton, true]);
                }
                game.me.chooseButtonOL(list, function (player, result) {
                    if (game.online || player == game.me) player.init(result.links[0], result.links[1]);
                });
                'step 4'
                for (const r in result) {
                    const skills = result[r].links.map(s => {
                        return s[2]
                    })
                    game.broadcastAll((player, skills) => {
                        let str = ''
                        skills.forEach(s => {
                            return str += lib.translate[s] + '<br>'
                        })
                        player.node.rightskillList.innerHTML = str
                    }, lib.playerOL[r], skills)
                    lib.playerOL[r].addSkill(skills)
                    game.log(`${lib.playerOL[r].node.name.innerHTML}选择了`, skills)
                }
                game.broadcastAll(() => {
                    lib.configOL.choose_timeout = '60'
                    ui.arena.classList.remove('choose-character');
                })
            })
        }
    }
}

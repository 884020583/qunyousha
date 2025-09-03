const { lib, game, ui, get, ai, _status } = suiSet
lib.mode.versus.connect.update = function (config, map) {
	const switchMode = {
		"2v2"() {
			const hide = [
				'connect_replace_number', 'connect_choice_num'
			]
			hide.forEach(i => map[i] && map[i].hide())

			const show = [
				'connect_versus_dianfengsai', 'connect_versus_lockCharacter'
			]
			show.forEach(i => map[i] && map[i].show())
		},
		default() {
			const hide = [
				'connect_replace_number', 'connect_choice_num', 'connect_versus_dianfengsai', 'connect_versus_lockCharacter'
			]

			const show = [
				
			]
			hide.forEach(i => map[i].hide())
			show.forEach(i => map[i] && map[i].show())
		}
	}
	switchMode[config.connect_versus_mode in switchMode ? config.connect_versus_mode : 'default']()
}
suiSet.modeConfig.versus = {
	chooseMode() {
        switch (lib.configOL.versus_mode) {
            case '1v1': game.chooseCharacterOL1(); break;
			case '2v2': {
				if (!lib.configOL.versus_dianfengsai) suiSet.modeConfig.versus.chooseCharacterOL2(); 
				else suiSet.modeConfig.versus.chooseCharacterOLbp();
				break;
			}
            case '3v3': suiSet.modeConfig.versus.chooseCharacterOL3(); break;
            case '4v4': game.chooseCharacterOL4(); break;
            case 'guandu': game.chooseCharacterOLGuandu(); break;
			case 'hulaoguan': game.chooseCharacterOLHulaoguan(); break;
        }
    },
    modeConfig() {
        let m = lib.configOL.versus_mode
        Object.defineProperty(lib.configOL, 'versus_mode', {
            get() {
                return m
            },
            set(v) {
                if (v === 'hulaoguan') {
                    lib.configOL.number = 4;
                }
                m = v
            }
		})
        game.chooseCharacterOLHulaoguan = function () {
            const next = game.createEvent('chooseCharacter');
            next.setContent(() => {
                'step 0'
                const Lvbu = game.players.randomGet()
                game.zhu = Lvbu
                const name = Lvbu.nickname || '电脑玩家'
                game.createTip(`${name}被选为了敌方`)
                game.broadcast(str => {
                    game.createTip(`${str}被选为了敌方`)
                }, name)
                _status.players = game.players.filter(p => {
                    if (p !== game.zhu) {
                        p.side = 'mengjun'
                        p.setIdentity('mengjun')
                        return true
                    } else {
                        p.side = 'lvbu'
                        p.setIdentity('boss_lvbu')
                    }
                })

                let seat = game.zhu.next
                _status.firstAct = seat
                event.sort = []//game.players.filter(p=>p!==game.zhu)
                let i = 1
                while (true) {
                    event.sort[i - 1] = seat
                    seat.seatNum = i
                    seat = seat.next
                    i++
                    if (seat.next.seatNum === 2) {
                        break
                    }
                }
                event.sort.remove(game.zhu)

                let select = Object.keys(lib.modeCharacter.hulaoguan.character);
                select.remove('boss_lvbu2', 'boss_lvbu3', 'boss_nianshou_jingjue', 'boss_nianshou_renxing', 'boss_nianshou_ruizhi', 'boss_nianshou_baonu')
                const nextt = game.zhu.chooseButton(true)
                nextt.set('createDialog', ['选择角色', [select, 'character']]);
                nextt.set('selectButton', (lib.configOL.double_character ? 2 : 1));
                nextt.set('ai', () => Math.random());
                event.Lvbu = Lvbu
                'step 1'
                if (result.bool) {
                    event.Lvbu.choose = result.links[0]
                }
                if (game.zhu.isOnline2()) {
                    game.zhu.send((link) => {
                        game.me.init(link)
                    }, result.links[0])
                } else if (game.zhu === game.me) {
                    game.me.init(result.links[0])
                }
                game.broadcast((Lvbu) => {
                    Lvbu.setIdentity('boss_lvbu')
                    game.zhu = Lvbu
                    _status.players = game.players.filter(p => {
                        if (p !== game.zhu) {
                            p.side = 'mengjun'
                            p.setIdentity('mengjun')
                            return true
                        } else {
                            p.side = 'lvbu'
                        }
                    })
                    ui.arena.classList.add('choose-character');
                }, game.zhu)



                ui.arena.classList.add('choose-character');

                const list3 = [];
                const list4 = [];
                event.list = [];
                event.list2 = [];

                const libCharacter = {};
                for (let i = 0; i < lib.configOL.characterPack.length; i++) {
                    var pack = lib.characterPack[lib.configOL.characterPack[i]];
                    for (var j in pack) {
                        if (lib.character[j]) libCharacter[j] = pack[j];
                    }
                }
                for (const i in lib.characterReplace) {
                    var ix = lib.characterReplace[i];
                    for (var j = 0; j < ix.length; j++) {
                        if (!libCharacter[ix[j]] || lib.filter.characterDisabled(ix[j])) ix.splice(j--, 1);
                    }
                    if (ix.length) {
                        event.list.push(i);
                        event.list2.push(i);
                        list4.addArray(ix);
                        list3.push(i);
                    }
                }
                game.broadcast(list => {
                    for (var i in lib.characterReplace) {
                        var ix = lib.characterReplace[i];
                        for (var j = 0; j < ix.length; j++) {
                            if (!list.contains(ix[j])) ix.splice(j--, 1);
                        }
                    }
                }, list4);
                for (const i in libCharacter) {
                    if (list4.contains(i)) continue;
                    if (lib.filter.characterDisabled(i, libCharacter)) continue;
                    event.list.push(i);
                    event.list2.push(i);
                    list4.push(i);
                    list3.push(i);
                }
                _status.characterlist = list4.slice(0);
                game.broadcast((list) => {
                    _status.characterlist = list
                }, _status.characterlist);
                if (lib.configOL.versus_select == '11') {
                    suiSet.onlineSelectNum = Math.floor(event.list.length / game.players.length - 1)
                } else {
                    suiSet.onlineSelectNum = parseInt(lib.configOL.versus_select) || 6
                }
                event.players = event.sort
                'step 2'
                const tac = event.players.shift()
                event.player = tac
                const list = event.list.randomRemove(suiSet.onlineSelectNum || 8)
                const next = tac.chooseButton(true)
                next.set('createDialog', ['选择角色', [list, 'characterx']]);
                next.set('selectButton', (lib.configOL.double_character ? 2 : 1));
                next.set('ai', () => Math.random());
                'step 3'
                game.broadcastAll((player, link) => {
                    player.init(link)
                    _status.characterlist.remove(link)
                }, event.player, result.links[0])
                if (event.players.length) {
                    event.goto(2)
                }
                'step 4'
                game.broadcastAll((choose) => {
                    game.zhu.init(choose)
                    setTimeout(function () {
                        ui.arena.classList.remove('choose-character');
                    }, 500);
                }, game.zhu.choose)
                'step 5'
                lib.card.lianjunshengyan.mode.add('versus')
                const whileLoop = ['boss_nianshou_heti', 'boss_sunce']
                if (whileLoop.includes(game.zhu.name1)) {
                    game.zhu.addSkill('boss_baonu_end')
                }
                lib.skill.boss_hulaoguan.init();
                game.gameDraw(_status.firstAct, p => {
                    return 2 + p.seatNum
                })
                let first = _status.firstAct;
                if (!whileLoop.includes(game.zhu.name1)) {
                    first = game.zhu
                }
                game.phaseLoop(first);
            })
        }
        game.Kangjin22OL = type => {
            if (type == 'hidden') {
                ui.arena.classList.add('playerhidden');
            }
            game.prepareArena();
            if (window.isNonameServer) {
                game.me = ui.create.player();
            }

            const meseat = Math.floor(Math.random() * 4) + 1
            let myTeam;
            if (meseat === 1 || meseat === 3) {
                myTeam = game.me.previous
            } else {
                myTeam = game.me.next
            }
            const ling = lib.node.clients[0]
            myTeam.ws = ling
            myTeam.playerid = ling.id
            myTeam.nickname = ling.nickname
            myTeam.setNickname()

            var map = [];
            if (!window.isNonameServer) {
                game.me.playerid = get.id();
                game.me.nickname = get.connectNickname();
                game.me.setNickname();
            }
            for (var i = 0; i < game.players.length; i++) {
                if (!game.players[i].playerid) {
                    game.players[i].playerid = get.id();
                }
                map.push([game.players[i].playerid, game.players[i].nickname]);
                lib.playerOL[game.players[i].playerid] = game.players[i];
            }
            game.broadcast(function (map, config, hidden) {
                if (hidden) {
                    ui.arena.classList.add('playerhidden');
                }
                lib.configOL = config;
                ui.create.players();
                ui.create.me();
                game.me.playerid = game.onlineID;
                game.me.nickname = get.connectNickname();
                for (var i = 0; i < map.length; i++) {
                    if (map[i][0] == game.me.playerid) {
                        map = map.concat(map.splice(0, i));
                        break;
                    }
                }
                for (var i = 0; i < game.players.length; i++) {
                    game.players[i].playerid = map[i][0];
                    game.players[i].nickname = map[i][1];
                    game.players[i].setNickname();
                    lib.playerOL[game.players[i].playerid] = game.players[i];
                }
                _status.mode = lib.configOL[lib.configOL.mode + '_mode'];
            }, map, lib.configOL, type == 'hidden');
            _status.mode = lib.configOL[lib.configOL.mode + '_mode'];
            game.chooseCharacterOL();
        }
        game.createTip = text => {
            const clog = ui.create.div('div', '.olskilllog', text, ui.arena)
            clog.css({
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: "100",
                fontSize: "20px",
                backgroundColor: "rgba(0,0,0,.3)",
                padding: "10px",
                top: "25%",
                borderRadius: "5px",
                textShadow: "1px 1px black"
            })
            setTimeout(() => {
                clog.style.opacity = '0'
            }, 4000)
            setTimeout(() => {
                clog.remove()
            }, 6000)
            return clog
        }
        const mode = {
            character: {
                boss_lvbu1: ['male', 'shen', 8, ['mashu', 'wushuang', 'boss_baonu', 'boss_jingjia', 'boss_aozhan'], ['qun', 'mode:boss'], 'wei'],
                boss_lvbu2: ['male', 'shen', 6, ['mashu', 'wushuang', 'xiuluo', 'shenwei', 'shenji'], ['qun', 'mode:boss'], 'qun'],
                boss_lvbu3: ['male', 'shen', 6, ['wushuang', 'shenqu', 'jiwu'], ['qun', 'mode:boss'], 'qun'],

                boss_caocao: ['male', 'shen', 12, ['boss_guixin', 'xiongcai'], ['wei', 'mode:boss'], 'wei'],
                boss_liubei: ['male', 'shen', 8, ['xiaoxiong', 'boss_zhangwu'], ['shu', 'mode:boss'], 'qun'],

                boss_nianshou_heti: ['male', 'shen', 12, ['boss_nianrui', 'boss_mengtai', 'boss_nbianshen', 'boss_nbianshenx'], ['shu', 'mode:boss'], 'shu'],
                boss_nianshou_jingjue: ['male', 'shen', 12, ['boss_nianrui', 'boss_mengtai', 'boss_jingjue', 'boss_nbianshen'], ['shu', 'mode:boss'], 'shu'],
                boss_nianshou_renxing: ['male', 'shen', 12, ['boss_nianrui', 'boss_mengtai', 'boss_renxing', 'boss_nbianshen'], ['shu', 'mode:boss'], 'shu'],
                boss_nianshou_ruizhi: ['male', 'shen', 12, ['boss_nianrui', 'boss_mengtai', 'boss_ruizhi', 'boss_nbianshen'], ['shu', 'mode:boss'], 'shu'],
                boss_nianshou_baonu: ['male', 'shen', 12, ['boss_nianrui', 'boss_mengtai', 'boss_nbaonu', 'boss_shouyi', 'boss_nbianshen'], ['shu', 'mode:boss'], 'shu'],
                boss_zuoci: ['male', 'shen', 0, ['huanhua'], ['qun', 'mode:boss'], 'shu'],
                "boss_sunce": ["male", "shen", "1/8", ["boss_jiang", "boss_hunzi", "boss_hunyou", "boss_taoni"], ['qun', 'mode:boss'], 'wu'],
            },
            skill: {
                boss_hulaoguan: {
                    loopType: 2,
                    gameDraw: function (player) {
                        if (player == game.zhu) return 8;
                        if (player == game.zhu.previous) return 5;
                        return 4;
                    },
                    loopFirst: function () {
                        return game.zhu.nextSeat;
                    },
                    init: function () {
                        lib.inpile.remove('wugu');
                        lib.inpile.remove('taoyuan');
                        lib.inpile.remove('bagua');
                        lib.inpile.remove('tengjia');
                        lib.inpile.remove('fangtian');
                        lib.inpile.remove('muniu');

                        lib.inpile.addArray(['wushuangfangtianji', 'shufazijinguan', 'hongmianbaihuapao', 'linglongshimandai', 'lianjunshengyan']);
                        lib.inpile.sort(lib.sort.card);
                        var equiplist = [];
                        for (var i = 0; i < ui.cardPile.childElementCount; i++) {
                            var node = ui.cardPile.childNodes[i];
                            if (node.name == 'bagua') {
                                node.init([node.suit, node.number, 'linglongshimandai']);
                                equiplist.push(node);
                            }
                            else if (node.name == 'tengjia') {
                                node.init([node.suit, node.number, 'hongmianbaihuapao']);
                                equiplist.push(node);
                            }
                            else if (node.name == 'fangtian') {
                                node.init([node.suit, node.number, 'wushuangfangtianji']);
                                equiplist.push(node);
                            }
                            else if (node.name == 'muniu') {
                                node.init([node.suit, node.number, 'shufazijinguan']);
                                equiplist.push(node);
                            }
                            else if (node.name == 'wugu' || node.name == 'taoyuan') {
                                node.init([node.suit, node.number, 'lianjunshengyan']);
                            }
                        }
                        equiplist.randomSort();
                        const next = game.createEvent('boss_jingjia');
                        next.player = game.zhu;
                        next.cards = equiplist;
                        next.setContent(function () {
                            'step 0'
                            if (!cards.length) {
                                event.finish(); return;
                            }
                            player.logSkill('boss_jingjia');
                            event.num = 1.5;
                            'step 1'
                            var card = cards.shift();
                            if (player.canEquip(card) && Math.random() < event.num) {
                                player.equip(card);
                                event.num = 0.5;
                            }
                            if (cards.length) event.redo();
                        });
                    }
                },

                boss_baonu: {
                    unique: true,
                    trigger: { player: 'changeHp', global: 'boss_baonuwash' },
                    forced: true,
                    priority: 100,
                    fixed: true,
                    group: 'boss_baonu_end',
                    audio: 2,
                    mode: ['identity', 'guozhan', 'boss', 'stone', 'versus'],
                    init: function (player) {
                        if (player == game.zhu) {
                            lib.onwash.push(function () {
                                if (!_status.boss_baonuwash) {
                                    _status.boss_baonuwash = true;
                                    _status.event.parent.trigger('boss_baonuwash');
                                }
                                else {
                                    _status.event.player.addSkill('boss_baonuwash');
                                }
                            });
                            for (var i in lib.card) {
                                if (lib.card[i].subtype == 'equip1') lib.card[i].recastable = true;
                            }
                        }
                    },
                    filter: function (event, player) {
                        return player.hp <= 4 || _status.boss_baonuwash;
                    },
                    content: function () {
                        'step 0'
                        if (player.hp > 6) {
                            game.delay();
                        }
                        'step 1'
                        player.chooseControl('暴怒战神', '神鬼无前', function () {
                            if (Math.random() < 0.5) return '神鬼无前';
                            return '暴怒战神';
                        }).set('prompt', '选择一个形态');
                        'step 2'
                        var hp = player.hp;
                        player.removeSkill('boss_baonu', true);
                        if (result.control == '暴怒战神') {
                            game.broadcast(player => {
                                player.init('boss_lvbu2');
                            }, player)
                            player.init('boss_lvbu2');
                        }
                        else {
                            game.broadcast(player => {
                                player.init('boss_lvbu3');
                            }, player)
                            player.init('boss_lvbu3');
                        }
                        if (hp > 6) {
                            player.maxHp = hp;
                            player.hp = hp;
                        }
                        player.update();
                        ui.clear();
                        if (player.isLinked()) player.link();
                        if (player.isTurnedOver()) player.turnOver();
                        player.discard(player.getCards('j'));
                        'step 3'
                        while (_status.event.name != 'phaseLoop') {
                            _status.event = _status.event.parent;
                        }
                        game.resetSkills();
                        _status.paused = false;
                        _status.event.player = player;
                        _status.event.step = 0;
                        if (game.zhuinfo) {
                            game.zhuinfo.loopType = 1;
                            _status.roundStart = game.zhu;
                        }
                    },
                    ai: {
                        effect: {
                            target: function (card, player, target) {
                                if (get.tag(card, 'damage') || get.tag(card, 'loseHp')) {
                                    if (player.hp == 5) {
                                        if (game.players.length < 4) return [0, 5];
                                        var num = 0
                                        for (var i = 0; i < game.players.length; i++) {
                                            if (game.players[i] != game.zhu && game.players[i].hp == 1) {
                                                num++;
                                            }
                                        }
                                        if (num > 1) return [0, 2];
                                        if (num && Math.random() < 0.7) return [0, 1];
                                    }
                                }
                            }
                        }
                    },
                    subSkill: {
                        end: {
                            trigger: {
                                global: 'phaseEnd',
                                player: 'phaseBeginStart',
                            },
                            forced: true,
                            charlotte: true,
                            popup: false,
                            filter(event, player, triggername) {
                                if (triggername === "phaseEnd" && event.player !== player) {
                                    return true
                                }
                                return event.parent.name !== 'boss_baonu_end'
                            },
                            content() {
                                if (event.triggername === "phaseEnd" && trigger.player !== player) {
                                    player.phase()
                                } else if (event.triggername === 'phaseBeginStart') {
                                    trigger.cancel()
                                }
                            }
                        }
                    }
                },
                "boss_jingjia": {},
                "boss_aozhan": {
                    forced: true,
                    locked: true,
                    charlotte: true,
                    group: ["boss_aozhan_wuqi", "boss_aozhan_fangju", "boss_aozhan_zuoji", "boss_aozhan_baowu"],
                    subSkill: {
                        wuqi: {
                            mod: {
                                cardUsable: function (card, player, num) {
                                    if (player.getEquip(1) && card.name == 'sha') return num + 1;
                                },
                            },
                            sub: true,
                        },
                        fangju: {
                            trigger: {
                                player: "damageBegin4",
                            },
                            forced: true,
                            filter: function (event, player) {
                                return player.getEquip(2) && event.num > 1;
                            },
                            content: function () {
                                trigger.num = 1;
                            },
                            sub: true,
                        },
                        zuoji: {
                            trigger: {
                                player: "phaseDrawBegin",
                            },
                            forced: true,
                            filter: function (event, player) {
                                return (player.getEquip(3) || player.getEquip(4));
                            },
                            content: function () {
                                trigger.num++;
                            },
                            sub: true,
                        },
                        baowu: {
                            trigger: {
                                player: "phaseJudgeBefore",
                            },
                            forced: true,
                            filter: function (event, player) {
                                return player.getEquip(5);
                            },
                            content: function () {
                                trigger.cancel();
                                game.log(player, '跳过了判定阶段');
                            },
                            sub: true,
                        },
                    },
                },
                shenwei: {
                    audio: 2,
                    unique: true,
                    trigger: { player: 'phaseDrawBegin' },
                    forced: true,
                    content: function () {
                        trigger.num += Math.min(3, game.players.length - 1);
                    },
                    mod: {
                        maxHandcard: function (player, current) {
                            return current + Math.min(3, game.players.length - 1);
                        }
                    }
                },
                shenqu: {
                    audio: 2,
                    group: 'shenqu2',
                    trigger: { global: 'phaseZhunbeiBegin' },
                    filter: function (event, player) {
                        return player.countCards('h') <= player.maxHp;
                    },
                    frequent: true,
                    content: function () {
                        player.draw(2);
                    }
                },
                shenqu2: {
                    trigger: { player: 'damageAfter' },
                    direct: true,
                    filter: function (event, player) {
                        return player.hasSkillTag('respondTao') || player.countCards('h', 'tao') > 0;
                    },
                    content: function () {
                        player.chooseToUse({ name: 'tao' }, '神躯：是否使用一张桃？').logSkill = 'shenqu';
                    }
                },
                jiwu: {
                    derivation: ['olqiangxi', 'retieji', 'decadexuanfeng', 'rewansha'],
                    audio: 2,
                    enable: 'phaseUse',
                    filter: function (event, player) {
                        if (player.countCards('h') == 0) return false;
                        if (!player.hasSkill('olqiangxi')) return true;
                        if (!player.hasSkill('retieji')) return true;
                        if (!player.hasSkill('decadexuanfeng')) return true;
                        if (!player.hasSkill('rewansha')) return true;
                        return false;
                    },
                    filterCard: true,
                    position: 'he',
                    check: function (card) {
                        if (get.position(card) == 'e' && _status.event.player.hasSkill('decadexuanfeng')) return 16 - get.value(card);
                        return 7 - get.value(card);
                    },
                    content: function () {
                        'step 0'
                        var list = [];
                        if (!player.hasSkill('olqiangxi')) list.push('olqiangxi');
                        if (!player.hasSkill('retieji')) list.push('retieji');
                        if (!player.hasSkill('decadexuanfeng')) list.push('decadexuanfeng');
                        if (!player.hasSkill('rewansha')) list.push('rewansha');
                        if (list.length == 1) {
                            player.addTempSkill(list[0]);
                            event.finish();
                        }
                        else {
                            player.chooseControl(list, function () {
                                if (list.contains('decadexuanfeng') && player.countCards('he', { type: 'equip' })) return 'decadexuanfeng';
                                if (!player.getStat().skill.olqiangxi) {
                                    if (player.hasSkill('olqiangxi') && player.getEquip(1) && list.contains('decadexuanfeng')) return 'decadexuanfeng';
                                    if (list.contains('rewansha') || list.contains('olqiangxi')) {
                                        var players = game.filterPlayer();
                                        for (var i = 0; i < players.length; i++) {
                                            if (players[i].hp == 1 && get.attitude(player, players[i]) < 0) {
                                                if (list.contains('rewansha')) return 'rewansha';
                                                if (list.contains('olqiangxi')) return 'olqiangxi';
                                            }
                                        }
                                    }
                                }
                                if (list.contains('olqiangxi')) return 'olqiangxi';
                                if (list.contains('rewansha')) return 'rewansha';
                                if (list.contains('decadexuanfeng')) return 'decadexuanfeng';
                                return 'retieji';
                            }).set('prompt', '选择获得一项技能直到回合结束');
                        }
                        'step 1'
                        player.addTempSkill(result.control);
                        player.popup(get.translation(result.control));
                    },
                    ai: {
                        order: function () {
                            var player = _status.event.player;
                            if (player.countCards('e', { type: 'equip' })) return 10;
                            if (!player.getStat().skill.olqiangxi) {
                                if (player.hasSkill('olqiangxi') && player.getEquip(1) && !player.hasSkill('decadexuanfeng')) return 10;
                                if (player.hasSkill('rewansha')) return 1;
                                var players = game.filterPlayer();
                                for (var i = 0; i < players.length; i++) {
                                    if (players[i].hp == 1 && get.attitude(player, players[i]) < 0) return 10;
                                }
                            }
                            return 1;
                        },
                        result: {
                            player: function (player) {
                                if (player.countCards('e', { type: 'equip' })) return 1;
                                if (!player.getStat().skill.olqiangxi) {
                                    if (player.hasSkill('olqiangxi') && player.getEquip(1) && !player.hasSkill('decadexuanfeng')) return 1;
                                    if (!player.hasSkill('rewansha') || !player.hasSkill('olqiangxi')) {
                                        var players = game.filterPlayer();
                                        for (var i = 0; i < players.length; i++) {
                                            if (players[i].hp == 1 && get.attitude(player, players[i]) < 0) return 1;
                                        }
                                    }
                                }
                                return 0;
                            }
                        }
                    }
                },
                xiuluo: {
                    audio: 2,
                    trigger: { player: 'phaseZhunbeiBegin' },
                    direct: true,
                    filter: function (event, player) {
                        return player.countCards('j') > 0;
                    },
                    content: function () {
                        "step 0"
                        var next = player.discardPlayerCard(player, 2, 'hj', '是否一张手牌来弃置一张花色相同的判定牌？');
                        next.filterButton = function (button) {
                            var card = button.link;
                            if (!lib.filter.cardDiscardable(card, player)) return false;
                            if (ui.selected.buttons.length == 0) return true;
                            if (get.position(ui.selected.buttons[0].link) == 'h') {
                                if (get.position(card) != 'j') return false;
                            }
                            if (get.position(ui.selected.buttons[0].link) == 'j') {
                                if (get.position(card) != 'h') return false;
                            }
                            return get.suit(card) == get.suit(ui.selected.buttons[0].link)
                        };
                        next.ai = function (button) {
                            var card = button.link;
                            if (get.position(card) == 'h') {
                                return 11 - get.value(card);
                            }
                            if (card.name == 'lebu') return 5;
                            if (card.name == 'bingliang') return 4;
                            if (card.name == 'guiyoujie') return 3;
                            return 2;
                        };
                        next.logSkill = 'xiuluo';
                        "step 1"
                        if (result.bool && player.countCards('j')) event.goto(0);
                    }
                },

                boss_guixin: {
                    trigger: { global: 'drawAfter' },
                    forced: true,
                    logTarget: 'player',
                    filter: function (event, player) {
                        return event.result && event.result.length >= 2 && event.player != player;
                    },
                    content: function () {
                        'step 0'
                        trigger.player.chooseCard('h', '归心：交给' + get.translation(player) + '一张牌', true);
                        'step 1'
                        if (result.bool) {
                            player.gain(result.cards, trigger.player);
                            trigger.player.$give(1, player);
                        }
                    }
                },
                xiongcai: {
                    unique: true,
                    trigger: { player: 'phaseAfter' },
                    direct: true,
                    init: function (player) {
                        player.storage.xiongcai = [];
                        // player.storage.xiongcai2=0;
                    },
                    intro: {
                        content: 'characters'
                    },
                    content: function () {
                        'step 0'
                        // if(player.storage.xiongcai2<1){
                        //		player.storage.xiongcai2++;
                        //		event.finish();
                        // }
                        // else{
                        //		player.storage.xiongcai2=0;
                        // }
                        'step 1'
                        player.logSkill('xiongcai');
                        var list = [];
                        var list2 = [];
                        var players = game.players.concat(game.dead);
                        for (var i = 0; i < players.length; i++) {
                            list2.add(players[i].name);
                            list2.add(players[i].name1);
                            list2.add(players[i].name2);
                        }
                        _status.characterlist.forEach(s => {
                            const [sex, group, hp, skills, att] = lib.character[s]
                            if (group === 'wei' && !att.includes('boss') && att.includes('minskin') && !player.storage.xiongcai.includes(s) && !list2.includes(s)) {
                                list.push(s)
                            }
                        })
                        var name = list.randomGet();
                        player.storage.xiongcai.push(name);
                        player.markSkill('xiongcai');
                        var skills = lib.character[name][3];
                        for (var i = 0; i < skills.length; i++) {
                            player.addSkill(skills[i]);
                        }
                        event.dialog = ui.create.dialog('<div class="text center">' + get.translation(player) + '发动了【雄才】', [[name], 'character']);
                        game.delay(2);
                        'step 2'
                        event.dialog.close();
                    }
                },
                xiaoxiong: {
                    trigger: { global: 'useCardAfter' },
                    forced: true,
                    unique: true,
                    forceunique: true,
                    filter: function (event, player) {
                        var type = get.type(event.card, 'trick');
                        return event.player != player && (type == 'basic' || type == 'trick');
                    },
                    content: function () {
                        player.gain(game.createCard(trigger.card), 'gain2');
                    },
                    group: 'xiaoxiong_damage',
                    subSkill: {
                        damage: {
                            trigger: { global: 'phaseJieshuBegin' },
                            forced: true,
                            filter: function (event, player) {
                                return event.player != player && event.player.countUsed() == 0;
                            },
                            logTarget: 'player',
                            content: function () {
                                trigger.player.damage();
                            }
                        }
                    }
                },
                boss_zhangwu: {
                    global: 'boss_zhangwu_ai',
                    trigger: { player: 'damageEnd' },
                    check: function (event, player) {
                        return event.source && event.source.isIn() && get.damageEffect(event.source, player, player) > 0;
                    },
                    filter: function (event) {
                        return event.source && event.source.isAlive();
                    },
                    direct: true,
                    logTarget: 'source',
                    content: function () {
                        'step 0'
                        player.chooseToDiscard(get.prompt('boss_zhangwu', trigger.source), 'he', [1, Infinity]).set('ai', function (card) {
                            if (get.attitude(player, target) < 0) return 8 - get.value(card);
                            return 0;
                        }).set('logSkill', ['boss_zhangwu', trigger.source]);
                        'step 1'
                        if (result.bool) {
                            var num = result.cards.length;
                            var cnum = get.cnNumber(num);
                            event.num = num;
                            trigger.source.chooseToDiscard('he', '章武：弃置' + cnum + '张牌，或取消并受到' + cnum + '点伤害', num).set('ai', function (card) {
                                if (!trigger.source.hasSkillTag('nodamage')) return 10 - get.value(card);
                                return 0;
                            });
                        }
                        else {
                            event.finish();
                        }
                        'step 2'
                        if (!result.bool) {
                            trigger.source.damage(event.num);
                        }
                    },
                    ai: {
                        maixie: true,
                        maixie_hp: true,
                        effect: {
                            target: function (card, player, target) {
                                if (get.tag(card, 'damage') && get.attitude(target, player) < 0 && player.countCards('he') < target.countCards('he')) {
                                    return [0, 2];
                                }
                            }
                        }
                    }
                },
                boss_zhangwu_ai: {
                    ai: {
                        effect: {
                            target: function (card, player, target) {
                                if (get.tag(card, 'recover') && card.name != 'recover') {
                                    for (var i = 0; i < game.players.length; i++) {
                                        if (game.players[i].hasSkill('xiaoxiong') && get.attitude(target, game.players[i]) < 0) {
                                            return 'zeroplayertarget';
                                        }
                                    }
                                }
                            }
                        }
                    }
                },

                boss_nianrui: {
                    trigger: { player: 'phaseDrawBegin' },
                    forced: true,
                    content: function () {
                        trigger.num += 3;
                    },
                    ai: {
                        threaten: 1.6
                    }
                },
                boss_mengtai: {
                    group: ['boss_mengtai_begin', 'boss_mengtai_draw', 'boss_mengtai_use',
                        'boss_mengtai_discard', 'boss_mengtai_end'],
                    subSkill: {
                        begin: {
                            trigger: { player: 'phaseZhunbeiBegin' },
                            forced: true,
                            popup: false,
                            content: function () {
                                player.storage.boss_mengtai_draw = true;
                                player.storage.boss_mengtai_use = true;
                            }
                        },
                        draw: {
                            trigger: { player: 'phaseDrawBegin' },
                            forced: true,
                            popup: false,
                            content: function () {
                                player.storage.boss_mengtai_draw = false;
                            }
                        },
                        use: {
                            trigger: { player: 'phaseUseBegin' },
                            forced: true,
                            popup: false,
                            content: function () {
                                player.storage.boss_mengtai_use = false;
                            }
                        },
                        discard: {
                            trigger: { player: 'phaseDiscardBefore' },
                            forced: true,
                            filter: function (event, player) {
                                if (player.storage.boss_mengtai_use) return true;
                                return false;
                            },
                            content: function () {
                                trigger.cancel();
                            }
                        },
                        end: {
                            trigger: { player: 'phaseJieshuBegin' },
                            forced: true,
                            filter: function (event, player) {
                                if (player.storage.boss_mengtai_draw) return true;
                                return false;
                            },
                            content: function () {
                                player.draw(3);
                            }
                        }
                    }
                },
                boss_nbianshen: {
                    trigger: { global: 'roundStart' },
                    forced: true,
                    popup: false,
                    priority: 25,
                    fixed: true,
                    filter: function (event, player) {
                        if (player.name == 'boss_nianshou_heti' || player.storage.boss_nbianshen) return true;
                        return false;
                    },
                    content: function () {
                        if (player.storage.boss_nbianshen) {
                            const hp = player.hp,
                                maxHp = player.maxHp,
                                hujia = player.hujia;
                            game.broadcastAll((player, result) => {
                                player.init(result);
                            }, player, 'boss_nianshou_' + player.storage.boss_nbianshen_next)
                            player.storage.boss_nbianshen.remove(player.storage.boss_nbianshen_next);
                            if (!player.storage.boss_nbianshen.length) {
                                player.storage.boss_nbianshen = ['jingjue', 'renxing', 'ruizhi', 'baonu'];
                            }
                            player.storage.boss_nbianshen_next = player.storage.boss_nbianshen.randomGet(player.storage.boss_nbianshen_next);
                            player.hp = hp;
                            player.maxHp = maxHp;
                            player.hujia = hujia;
                            player.update();
                        }
                        else {
                            player.storage.boss_nbianshen = ['jingjue', 'renxing', 'ruizhi', 'baonu'];
                            player.storage.boss_nbianshen_next = player.storage.boss_nbianshen.randomGet();
                            player.markSkill('boss_nbianshen');
                        }
                    },
                    intro: {
                        content: function (storage, player) {
                            var map = {
                                jingjue: '警觉',
                                renxing: '任性',
                                ruizhi: '睿智',
                                baonu: '暴怒'
                            };
                            return '下一个状态：' + map[player.storage.boss_nbianshen_next];
                        }
                    }
                },
                boss_nbianshenx: {},
                boss_jingjue: {
                    trigger: {
                        player: 'loseAfter',
                        global: ['equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter', 'addToExpansionAfter'],
                    },
                    forced: true,
                    filter(event, player) {
                        return event.player === player && _status.currentPhase != player;
                    },
                    content() {
                        'step 0'
                        player.judge()
                        'step 1'
                        if (result.color === 'red') {
                            player.recover()
                            event.finish()
                        } else {
                            player.chooseTarget('对一名角色造成一点火焰伤害', 1)
                        }
                        'step 2'
                        if (result.bool) {
                            result.targets[0].damage(1, 'fire')
                        }
                    }
                },
                boss_renxing: {
                    trigger: { global: ['damageEnd', 'recoverEnd'] },
                    forced: true,
                    filter: function (event, player) {
                        return true
                    },
                    content: function () {
                        player.draw();
                    }
                },
                boss_ruizhi: {
                    trigger: { global: 'phaseZhunbeiBegin' },
                    forced: true,
                    filter: function (event, player) {
                        return event.player != player && (event.player.countCards('h') > 1 || event.player.countCards('e') > 1);
                    },
                    content: function () {
                        'step 0'
                        player.line(trigger.player, 'green');
                        game.broadcastAll(function (tr) {
                            _status.trigger = tr
                        }, trigger)
                        var next = trigger.player.chooseCard(true, '选择保留一张手牌和一张装备区内的牌，然后弃置其它牌', 'he', function (card) {
                            switch (get.position(card)) {
                                case 'h': {
                                    if (ui.selected.cards.length) {
                                        return get.position(ui.selected.cards[0]) == 'e';
                                    }
                                    else {
                                        return _status.trigger.player.countCards('h') > 1;
                                    }
                                }
                                case 'e': {
                                    if (ui.selected.cards.length) {
                                        return get.position(ui.selected.cards[0]) == 'h';
                                    }
                                    else {
                                        return _status.trigger.player.countCards('e') > 1;
                                    }
                                }
                            }
                        });
                        var num = 0;
                        if (trigger.player.countCards('h') > 1) {
                            num++;
                        }
                        if (trigger.player.countCards('e') > 1) {
                            num++;
                        }
                        next.selectCard = [num, num];
                        next.ai = function (card) {
                            return get.value(card);
                        };
                        'step 1'
                        if (result.bool) {
                            var he = [];
                            var hs = trigger.player.getCards('h');
                            var es = trigger.player.getCards('e');
                            if (hs.length > 1) {
                                he = he.concat(hs);
                            }
                            if (es.length > 1) {
                                he = he.concat(es);
                            }
                            for (var i = 0; i < result.cards.length; i++) {
                                he.remove(result.cards[i]);
                            }
                            trigger.player.discard(he);
                        }
                    }
                },
                boss_nbaonu: {
                    group: ['boss_nbaonu_sha'],
                    trigger: { player: 'phaseDrawBegin' },
                    forced: true,
                    priority: -1,
                    content: function () {
                        if (player.hp > 4) {
                            trigger.num = 4 + Math.floor(Math.random() * (player.hp - 3));
                        }
                        else {
                            trigger.num = 4;
                        }
                    },
                    subSkill: {
                        sha: {
                            mod: {
                                cardUsable: function (card, player, num) {
                                    if (card.name == 'sha' && player.hp < 5) return Infinity;
                                }
                            },
                            trigger: { source: 'damageBegin1' },
                            filter: function (event, player) {
                                return event.card && event.card.name == 'sha' && event.notLink() && player.hp < 5;
                            },
                            forced: true,
                            content: function () {
                                trigger.num++;
                            }
                        }
                    }
                },
                huanhua: {
                    audio: 2,
                    trigger: { global: 'gameDrawAfter' },
                    forced: true,
                    unique: true,
                    content: function () {
                        for (var i = 0; i < game.players.length; i++) {
                            if (game.players[i] == player) continue;
                            player.maxHp += game.players[i].maxHp;
                            if (!game.players[i].name || !lib.character[game.players[i].name]) continue;
                            var skills = lib.character[game.players[i].name][3];
                            for (var j = 0; j < skills.length; j++) {
                                if (!lib.skill[skills[j]].forceunique) {
                                    player.addSkill(skills[j]);
                                }
                            }
                        }
                        player.hp = player.maxHp;
                        player.update();
                    },
                    group: ['huanhua2', 'huanhua3', 'huanhua4'],
                    ai: {
                        threaten: 0.8,
                        effect: {
                            target: function (card) {
                                if (card.name == 'bingliang') return 0;
                            }
                        }
                    }
                },
                huanhua2: {
                    trigger: { player: 'phaseDrawBefore' },
                    priority: 10,
                    forced: true,
                    popup: false,
                    check: function () {
                        return false;
                    },
                    content: function () {
                        trigger.cancel();
                    }
                },
                huanhua3: {
                    trigger: { global: 'drawAfter' },
                    forced: true,
                    filter: function (event, player) {
                        if (event.parent.name != 'phaseDraw') return false;
                        return event.player != player;
                    },
                    content: function () {
                        player.draw(trigger.num);
                    }
                },
                huanhua4: {
                    trigger: { global: 'discardAfter' },
                    forced: true,
                    filter: function (event, player) {
                        if (event.parent.parent.name != 'phaseDiscard') return false;
                        return event.player != player;
                    },
                    content: function () {
                        player.chooseToDiscard(trigger.cards.length, true);
                    }
                },
                "boss_hunzi": {
                    skillAnimation: true,
                    animationColor: "wood",
                    audio: "hunzi",
                    juexingji: true,
                    derivation: ["reyingzi", "yinghun"],
                    unique: true,
                    trigger: {
                        player: "phaseZhunbeiBegin",
                    },
                    filter: function (event, player) {
                        return player.hp <= 2 && !player.storage.boss_hunzi;
                    },
                    forced: true,
                    content: function () {
                        player.removeSkill('boss_hunyou');
                        player.removeSkill("boss_hunyou_dying");
                        player.removeSkill("boss_hunyou_dieBegin")
                        player.loseMaxHp();
                        player.addSkill('reyingzi');
                        player.addSkill('yinghun');
                        game.log(player, '获得了技能', '#g【英姿】和【英魂】');
                        game.log(player, '', '#y【魂佑】')
                        player.awakenSkill('boss_hunzi');
                        player.storage.boss_hunzi = true;
                    },
                    ai: {
                        threaten: function (player, target) {
                            if (target.hp == 1) return 2;
                            return 0.5;
                        },
                        maixie: true,
                        effect: {
                            target: function (card, player, target) {
                                if (!target.hasFriend()) return;
                                if (get.tag(card, 'damage') == 1 && target.hp == 2 && !target.isTurnedOver() &&
                                    _status.currentPhase != target && get.distance(_status.currentPhase, target, 'absolute') <= 3) return [0.5, 1];
                            },
                        },
                    },
                },
                "boss_jiang": {
                    audio: "jiang",
                    trigger: {
                        global: ["respondEnd"],
                    },
                    charlotte: true,
                    locked: true,
                    init: function (player) {
                        var a = window.setInterval(function () {
                            if (player.hasSkill('boss_jiang')) {
                                player.storage.boss_jiang = true;
                            }
                            else {
                                game.addGlobalSkill('boss_jiang');
                                game.addGlobalSkill('boss_jiang_use');
                                window.clearInterval(a);
                            }
                        }, 1000);
                    },
                    filter2: function (event, player) {
                        if (!event.respondTo[1]) return false;
                        if (get.itemtype(event.cards) != 'cards') return false;
                        if (['h', 'e', 'j'].contains(get.position(event.cards[0]))) return false;
                        if (event.respondTo[1] && get.itemtype(event.respondTo[1]) != 'card') return false;
                        if (event.respondTo[1] && ['h', 'e', 'j'].contains(get.position(event.respondTo[1]))) return false;
                    },
                    filter: function (event, player) {
                        if (!player.storage.boss_jiang) return false;
                        if (!event.respondTo) return false;
                        if (get.color(event.card) != 'red') return false;
                        if (event.respondTo[0] != player) {
                            return event.player == player;
                        }
                        else {
                            return event.player != player;
                        }
                    },
                    frequent: true,
                    content: function () {
                        player.draw();
                        if (!lib.skill.boss_jiang.filter2(trigger, player)) return;
                        if (trigger.respondTo[0] != player) {
                            if (trigger.respondTo[1] && get.position(trigger.respondTo[1]) == 'd') player.gain(trigger.respondTo[1], 'gain2');
                        }
                        else {
                            if (get.position(trigger.cards[0]) == 'd') player.gain(trigger.cards, 'gain2');
                        }
                    },
                    group: ["boss_jiang_use"],
                    subSkill: {
                        use: {
                            trigger: {
                                global: ["useCard"],
                            },
                            filter: function (event, player) {
                                if (!player.storage.boss_jiang) return false;
                                if (get.color(event.card) != 'red') return false;
                                return player == event.player || event.targets.contains(player);
                            },
                            frequent: true,
                            content: function () {
                                player.draw();
                                if (trigger.player != player && get.itemtype(trigger.cards) == 'cards' && get.position(trigger.cards[0]) == 'd') player.gain(trigger.cards, 'gain2');
                            },
                            sub: true,
                        },
                    },
                },
                "boss_hunyou": {
                    forced: true,
                    init: function (player) {
                        player.hp = 1;
                        player.storage.hp = player.hp;
                        player.storage.maxHp = player.maxHp;
                        player.update();
                    },
                    trigger: {
                        player: ["damageBefore", "recoverBefore", "loseHpBefore", "loseMaxHpBefore", "gainMaxHpBefore"],
                    },
                    content: function () {
                        trigger.cancel();
                    },
                    group: ["boss_hunyou_dying", "boss_hunyou_dieBegin"],
                    subSkill: {
                        dying: {
                            trigger: {
                                player: "dying",
                            },
                            silent: true,
                            filter: function (event, player) {
                                if (player.hp != player.storage.hp && player.storage.hp > 0) return true;
                                return false;
                            },
                            content: function () {
                                trigger.cancel();
                                player.maxHp = player.storage.maxHp;
                                player.hp = player.storage.hp;
                                player.update();
                            },
                            sub: true,
                            forced: true,
                            popup: false,
                        },
                        dieBegin: {
                            trigger: {
                                player: "dieBegin",
                            },
                            silent: true,
                            filter: function (event, player) {
                                if (player.maxHp != player.storage.maxHp && player.storage.maxHp > 0) return true;
                                return false;
                            },
                            content: function () {
                                trigger.cancel();
                                player.maxHp = player.storage.maxHp;
                                player.hp = player.storage.hp;
                                player.update();
                            },
                            sub: true,
                            forced: true,
                            popup: false,
                        },
                    },
                },
            },
            translate: {
                boss_lvbu: '将领',
                mengjun: '盟军',
                boss_caocao: '魏武大帝',
                boss_liubei: '蜀汉烈帝',
                boss_zuoci: '迷之仙人',

                boss_lvbu1: '最强神话',
                boss_lvbu2: '暴怒战神',
                boss_lvbu3: '神鬼无前',
                boss_baonu: '暴怒',
                boss_baonu_info: '锁定技，当你的体力值降至4或更低时，你变身为暴怒战神或神鬼无前，并立即开始你的回合。',
                shenwei: '神威',
                shenwei_info: '锁定技，摸牌阶段，你额外摸X张牌，你的手牌上限+X（X为场上其他角色的数目且至多为3）。',
                xiuluo: '修罗',
                xiuluo_info: '准备阶段，你可以弃置一张牌，然后弃置你判定区内一张同花色的牌，然后你可以重复此流程。',
                shenqu: '神躯',
                shenqu_info: '每名角色的准备阶段，若你的手牌数少于或等于你的体力上限数，你可以摸两张牌；当你受到伤害后，你可以使用一张【桃】。',
                jiwu: '极武',
                jiwu_info: '出牌阶段，你可以弃置一张牌，然后获得获得以下一项技能直到回合结束：〖强袭〗、〖铁骑〗、〖旋风〗、〖完杀〗。',

                "boss_jingjia": "精甲",
                "boss_jingjia_info": "锁定技，游戏开始时，将本局游戏中加入的装备随机置入你的装备区。",
                "boss_aozhan": "鏖战",
                "boss_aozhan_info": "锁定技，若你装备区内有：武器牌，你可以多使用一张【杀】；防具牌，防止你受到的超过1点的伤害；坐骑牌，摸牌阶段多摸一张牌；宝物牌，跳过你的判定阶段。",

                boss_guixin: '归心',
                boss_guixin_info: '锁定技，其他角色摸牌时，若摸牌数不少于2，须将摸到的牌中的一张交给你。',
                xiongcai: '雄才',
                xiongcai_info: '锁定技，你在回合结束后随机获得一个魏势力角色的所有技能。',
                xiaoxiong: '枭雄',
                xiaoxiong_info: '锁定技，每当一名其他角色使用一张基本牌或锦囊牌，你获得一张与之同名的牌；在一名其他角色的结束阶段，若其本回合没有使用牌，你对其造成1点伤害。',
                boss_zhangwu: '章武',
                boss_zhangwu_info: '每当你受到一次伤害，你可以弃置任意张牌并令伤害来源选择一项：弃置等量的牌，或受到等量的伤害。',

                boss_nianshou: '年兽',
                boss_nianshou_heti: '年兽',
                boss_nianshou_jingjue: '警觉年兽',
                boss_nianshou_renxing: '任性年兽',
                boss_nianshou_baonu: '暴怒年兽',
                boss_nianshou_ruizhi: '睿智年兽',
                boss_nbianshen: '变形',
                boss_nbianshenx: '变形',
                boss_nbianshenx_info: '你从第二轮开始，每一轮幻化为警觉、任性、睿智、暴怒四种随机状态中的一种。',
                boss_mengtai: '萌态',
                boss_mengtai_info: '锁定技，若你的出牌阶段被跳过，你跳过本回合的弃牌阶段；若你的摸牌阶段被跳过，结束阶段开始时，你摸三张牌。',
                boss_ruizhi: '睿智',
                boss_ruizhi_info: '锁定技，其他角色的准备阶段开始时，其选择一张手牌和一张装备区里的牌，然后弃置其余的牌。',
                boss_jingjue: '警觉',
                boss_jingjue_info: '每当你于回合外失去、获得牌时，你进行一次判定，若结果为红色，你回复一点体力，若为黑色，你对一名角色造成一点火焰伤害。',
                boss_renxing: '任性',
                boss_renxing_info: '锁定技，一名角色受到1点伤害后或回复1点体力时，你摸一张牌。',
                boss_nbaonu: '暴怒',
                boss_nbaonu_info: '锁定技，摸牌阶段，你改为摸X张牌（X为4到你体力值间的随机数）；若你的体力值小于5，则你使用【杀】造成的伤害+1且无次数限制。',
                boss_shouyi: '兽裔',
                boss_shouyi_info: '锁定技，你使用牌无距离限制。',

                boss_nianrui: '年瑞',
                boss_nianrui_info: '锁定技，摸牌阶段，你额外摸三张牌。',
                boss_qixiang: '祺祥',
                boss_qixiang1: '祺祥',
                boss_qixiang2: '祺祥',
                boss_qixiang_info: '乐不思蜀判定时，你的方块判定牌视为红桃；兵粮寸断判定时，你的黑桃判定牌视为草花。',
                huanhua: '幻化',
                huanhua_info: '锁定技，你跳过摸牌阶段，游戏开始时，你获得其他角色的所有技能，体力上限变为其他角色之和；其他角色于摸牌阶段摸牌时，你摸等量的牌；其他角色于弃牌阶段弃牌时，你弃置等量的手牌。',

                "boss_sunce": "那个男人",
                "boss_hunzi": "魂姿",
                "boss_hunzi_info": "觉醒技，准备阶段，若你的体力值为1，你减1点体力上限，失去技能〖魂佑〗并获得技能〖英姿〗和〖英魂〗。",
                "boss_jiang": "激昂",
                "boss_jiang_info": "①锁定技，〖激昂〗不会无效。<br>②每当你使用或打出红色牌时，你可以摸一张牌。若你是因响应其他角色使用或打出的牌，则你获得对方使用或打出的牌。<br>③当有其他角色使用或打出红色牌指定你为目标或响应你后，你可以摸一张牌并获得这些牌。",
                "boss_hunyou": "魂佑",
                "boss_hunyou_info": "锁定技，你的体力值变化和体力上限变化无效。",
            }
        }
        lib.modeCharacter.hulaoguan = {
            character: mode.character,
            skill: mode.skill,
            functions: {
                createTip: game.createTip
            },
            translate: mode.translate
        }
        for (const i in mode) {
            for (const c in mode[i]) {
                lib[i][c] = mode[i][c]
            }
        }
        const die = lib.element.player.dieAfter
        lib.element.player.dieAfter = function (source) {
            if (_status.mode === 'hulaoguan') {
                if (this === game.zhu) {
                    if (game.zhu !== game.me) {
                        game.over(true)
                    } else {
                        game.over(false)
                    }
                } else if (game.players.length === 1) {
                    if (game.zhu.isDead()) {
                        if (game.me == game.zhu) {
                            game.over(false)
                        } else {
                            game.over(true)
                        }
                    } else {
                        game.over(true)
                    }
                }
                return
            }
            return die.call(this, source)
        }

		suiSet.modeConfig.versus.chooseCharacterOL2 = function () {
            var next = game.createEvent("chooseCharacterOL");
            next.setContent(function () {
                "step 0";
                var ref = game.players[0];
				var bool = Math.random() < 0.5;
				event.abool = bool;
                var bool2 = Math.random() < 0.5;
                ref.side = bool;
                ref.next.side = bool2;
                ref.next.next.side = !bool;
                ref.previous.side = !bool2;
                var firstChoose = game.players.randomGet();
                if (firstChoose.next.side == firstChoose.side) {
                    firstChoose = firstChoose.next;
                }
                _status.firstAct = firstChoose;
                for (var i = 0; i < 4; i++) {
                    firstChoose.node.name.innerHTML = get.verticalStr(get.cnNumber(i + 1, true) + "号位");
                    firstChoose = firstChoose.next;
                }
                for (var i = 0; i < game.players.length; i++) {
                    if (game.players[i].side == game.me.side) {
                        game.players[i].node.identity.firstChild.innerHTML = "友";
                    } else {
                        game.players[i].node.identity.firstChild.innerHTML = "敌";
                    }
                    game.players[i].node.identity.dataset.color = game.players[i].side + "zhu";
                }
                ui.arena.classList.add("choose-character");
                game.broadcast(
                    function (ref, bool, bool2, firstChoose) {
                        ref.side = bool;
                        ref.next.side = bool2;
                        ref.next.next.side = !bool;
                        ref.previous.side = !bool2;
                        for (var i = 0; i < 4; i++) {
                            firstChoose.node.name.innerHTML = get.verticalStr(
                                get.cnNumber(i + 1, true) + "号位"
                            );
                            firstChoose = firstChoose.next;
                        }
                        for (var i = 0; i < game.players.length; i++) {
                            if (game.players[i].side == game.me.side) {
                                game.players[i].node.identity.firstChild.innerHTML = "友";
                            } else {
                                game.players[i].node.identity.firstChild.innerHTML = "敌";
                            }
                            game.players[i].node.identity.dataset.color = game.players[i].side + "zhu";
                        }
                        ui.arena.classList.add("choose-character");
                    },
                    ref,
                    bool,
                    bool2,
                    _status.firstAct
                );
                _status.onreconnect = [
                    function () {
                        var players = game.players.concat(game.dead);
                        for (var i = 0; i < players.length; i++) {
                            if (players[i].side == game.me.side) {
                                players[i].node.identity.firstChild.innerHTML = "友";
                            } else {
                                players[i].node.identity.firstChild.innerHTML = "敌";
                            }
                        }
                    },
                ];

                //22联机分配武将
                var list = [];
                var libCharacter = {};
                var list4 = [];
                for (var i = 0; i < lib.configOL.characterPack.length; i++) {
                    var pack = lib.characterPack[lib.configOL.characterPack[i]];
                    for (var j in pack) {
                        if (lib.connectBanned.includes(j)) continue;
                        if (lib.character[j]) libCharacter[j] = pack[j];
                    }
                }
                for (i in lib.characterReplace) {
                    var ix = lib.characterReplace[i];
                    for (var j = 0; j < ix.length; j++) {
                        if (!libCharacter[ix[j]] || lib.filter.characterDisabled(ix[j], libCharacter))
                            ix.splice(j--, 1);
                    }
                    if (ix.length) {
                        list.push(i);
                        list4.addArray(ix);
                    }
                }
                game.broadcast(function (list) {
                    for (var i in lib.characterReplace) {
                        var ix = lib.characterReplace[i];
                        for (var j = 0; j < ix.length; j++) {
                            if (!list.includes(ix[j])) ix.splice(j--, 1);
                        }
                    }
                }, list4);
                for (i in libCharacter) {
                    if (list4.includes(i) || lib.filter.characterDisabled(i, libCharacter)) continue;
                    list.push(i);
                    list4.push(i);
                }
                var choose = {};
                event.list = list;
                _status.characterlist = list4;
                //推荐队友选将
                //给所有人生成对话框
                const select = suiSet.getSelect(list)
                for (var i = 0; i < game.players.length; i++) {
                    choose[game.players[i].playerid] = list.randomRemove(select);
                }
                game._characterChoice = choose;
                event._choiceMap = {};
                event.videoId = lib.status.videoId++;
                game.broadcastAll(
                    function (id, choice) {
                        game._characterChoice = choice;
                        game._characterDialogID = id;
                        var dialog = ui.create.dialog("请选择武将");
                        dialog.videoId = id;
                        var players, friends;
                        var player = game.me;
                        for (var i in choice) {
                            var current = lib.playerOL[i];
                            if (current == player) players = choice[i];
                            else if (current.side == player.side) friends = choice[i];
                        }
                        dialog.addText("你的选将框");
                        var buttons = ui.create.div(".buttons", dialog.content);
                        dialog.players = ui.create.buttons(players, "characterx", buttons);
                        dialog.buttons = dialog.buttons.concat(dialog.players);
                        dialog.addText("队友的选将框（点击可为其推荐武将）");
                        buttons = ui.create.div(".buttons", dialog.content);
                        dialog.friends = ui.create.buttons(friends, "characterx", buttons);
                        dialog.buttons = dialog.buttons.concat(dialog.friends);
                    },
                    event.videoId,
                    choose
                );
                //发送选择事件
                var send = function () {
                    var next = game.me.chooseButton([1, 2], true);
                    next.set("dialog", game._characterDialogID);
                    next.set("callback", function (player, result) {
                        player.init(result.links[0], null, null, false);
                        var button = game._playerChoice;
                        button.classList.remove("glow2");
                        button.classList.add("selected");
                        delete game._playerChoice;
                    });
                    //托管选择
                    next.set("ai", function (button) {
                        if (ui.selected.buttons.length) return 0;
                        var dialog = get.idDialog(game._characterDialogID);
                        if (dialog.friends && dialog.friends.includes(button)) return 0;
                        if (dialog.classList.contains("glow2")) return 1 + Math.random();
                        return 0.5 + Math.random();
                    });
                    //修改点击按钮后的反应
                    next.set("custom", {
                        replace: {
                            button: function (button) {
                                var dialog = get.idDialog(game._characterDialogID);
                                var origin = button._link,
                                    choice = button.link;
                                //选择按钮时自动取消选择上一个按钮
                                if (dialog.players.includes(button)) {
                                    if (!button.classList.contains("selected")) {
                                        button.classList.add("selected");
                                        ui.selected.buttons.add(button);
                                        game._playerChoice = button;
                                        for (var other of dialog.players) {
                                            if (other != button && other.classList.contains("selected")) {
                                                other.classList.remove("selected");
                                                ui.selected.buttons.remove(other);
                                            }
                                        }
                                    }
                                    game.check();
                                } else {
                                    //给队友推荐选将
                                    if (game._friendConfirmed) return;
                                    if (button == dialog._recommending) return;
                                    dialog._recommending = button;
                                    button.classList.add("glow2");
                                    for (var other of dialog.friends) {
                                        if (other != button && other.classList.contains("glow2")) {
                                            other.classList.remove("glow2");
                                        }
                                    }
                                    //将最小发送延时间隔设置为0.5秒 避免通过频繁点击进行炸服
                                    if (dialog.delay) return;
                                    if (game.online) game.send("tempResult", origin);
                                    else game.me.tempUnwait(origin);
                                    dialog.delay = setTimeout(function () {
                                        delete dialog.delay;
                                        if (game._friendConfirmed) return;
                                        var recommend = dialog._recommending._link;
                                        if (recommend != origin) {
                                            if (game.online) game.send("tempResult", recommend);
                                            else game.me.tempUnwait(recommend);
                                        }
                                    }, 500);
                                }
                            },
                        },
                        add: {},
                    });
                    if (game.online) game.resume();
                };
                //推荐选将后的回传函数
                event.recommend = function (player, choice) {
                    if (player.name1 || game._characterDialogID == undefined) return;
                    var dialog = get.idDialog(game._characterDialogID);
                    if (dialog) {
                        for (var button of dialog.players) {
                            if (button._link == choice) button.classList.add("glow2");
                            else if (button.classList.contains("glow2")) button.classList.remove("glow2");
                        }
                    }
                };
                //确认选将后的回传函数
                event.confirm = function (player, choice) {
                    if (!player.name1) player.init(choice, null, null, false);
                    game._friendConfirmed = true;
                    if (game._characterDialogID == undefined) return;
                    var dialog = get.idDialog(game._characterDialogID);
                    if (!dialog) return;
                    for (var button of dialog.friends) {
                        button.classList.remove("glow2");
                        if (
                            button.link == choice ||
                            (lib.characterReplace[button._link] &&
                                lib.characterReplace[button._link].includes(choice))
                        )
                            button.classList.add("selected");
                    }
                };
                //处理result
                var sendback = function (result, player) {
                    var type = typeof result;
                    var friend = game.findPlayer(function (current) {
                        return current != player && current.side == player.side;
                    });
                    //处理推荐选将
                    if (type == "string") {
                        if (friend == game.me) event.recommend(friend, result);
                        else if (friend.isOnline()) friend.send(event.recommend, friend, result);
                        else friend._aiChoice = result;
                    }
                    //处理确认选将
                    else if (result && type == "object") {
                        var choice = result.links[0];
                        event._choiceMap[player.playerid] = choice;
                        if (friend == game.me) event.confirm(player, choice);
                        else if (friend.isOnline()) friend.send(event.confirm, player, choice);
                    }
                };
                event.sendback = sendback;

                //发送
                event.ai_targets = [];
                for (var i = 0; i < game.players.length; i++) {
                    if (game.players[i].isOnline()) {
                        event.withol = true;
                        game.players[i].send(send);
                        game.players[i].wait(sendback);
                    } else if (game.players[i] == game.me) {
                        event.withme = true;
                        send();
                        game.me.wait(sendback);
                    } else {
                        event.ai_targets.push(game.players[i]);
                        game.players[i].showTimer();
                    }
                }
                //模拟AI思考后选择
                if (event.ai_targets.length) {
                    event.ai_targets.randomSort();
                    setTimeout(function () {
                        event.interval = setInterval(function () {
                            var target = event.ai_targets.shift();
                            var list = game._characterChoice[target.playerid];
                            var choice;
                            //AI必选玩家推荐角色
                            if (target._aiChoice && list.includes(target._aiChoice))
                                choice = target._aiChoice;
                            else choice = list.randomGet();
                            if (lib.characterReplace[choice])
                                choice = lib.characterReplace[choice].randomGet();
                            event.sendback(
                                {
                                    result: bool,
                                    links: [choice],
                                },
                                target
                            );
                            target.hideTimer();
                            if (!event.ai_targets.length) {
                                clearInterval(event.interval);
                                if (event.withai) game.resume();
                            }
                        }, 1000);
                    }, 6000);
                }
                "step 1";
                if (event.withme) {
                    game.me.unwait(result);
                }
                "step 2";
                if (event.withol && !event.resultOL) {
                    game.pause();
                }
                "step 3";
                if (event.ai_targets.length > 0) {
                    event.withai = true;
                    game.pause();
                }
                "step 4";
                game.broadcastAll(function (id) {
                    var dialog = get.idDialog(id);
                    if (dialog) {
                        dialog.close();
                        clearInterval(dialog.delay);
                    }
                }, event.videoId);
                var result = event._choiceMap;
                for (var i in lib.playerOL) {
                    if (!lib.character[result[i]]) {
                        result[i] = game._characterChoice[i].randomGet();
                    }
                    _status.characterlist.remove(result[i]);
                    if (!lib.playerOL[i].name1) {
                        lib.playerOL[i].init(result[i]);
                    }
                    lib.playerOL[i].update();
                }
                game.broadcast(function (result) {
                    for (var i in result) {
                        if (!lib.playerOL[i].name1) {
                            lib.playerOL[i].init(result[i]);
                            lib.playerOL[i].update();
                        }
                    }
                    setTimeout(function () {
                        ui.arena.classList.remove("choose-character");
                    }, 500);
                }, result);
                setTimeout(function () {
                    ui.arena.classList.remove("choose-character");
                }, 500);
                if (lib.configOL.olfeiyang_four) {
                    var target = _status.firstAct.previous;
                    if (target.isIn()) target.addSkill("olfeiyang");
                }
                game.addGlobalSkill("versus_viewHandcard");
            });
        }

        suiSet.modeConfig.versus.chooseCharacterOL3 = function () {
            const next = game.createEvent("chooseCharacterOL");
            next.setContent(function () {
                "step 0";
                game.additionaldead = [];
                game.broadcastAll(
                    function (ref, bool) {
                        ui.arena.classList.add("choose-character");
                        for (var i = 0; i < 6; i++) {
                            ref.side = bool;
                            ref = ref.next;
                            bool = !bool;
                        }
                        for (var i = 0; i < game.players.length; i++) {
                            if (game.players[i].side == game.me.side) {
                                game.players[i].node.identity.firstChild.innerHTML = "友";
                            } else {
                                game.players[i].node.identity.firstChild.innerHTML = "敌";
                            }
                            game.players[i].node.identity.dataset.color = game.players[i].side + "zhu";
                        }
                    },
                    game.players[0],
                    Math.random() < 0.5
                );
                if (game.me.side == undefined) {
                    game.me.side = game.players[0].side;
                }
                _status.onreconnect = [
                    function () {
                        var players = game.players.concat(game.dead);
                        for (var i = 0; i < players.length; i++) {
                            if (players[i].side == game.me.side) {
                                players[i].node.identity.firstChild.innerHTML = "友";
                            } else {
                                players[i].node.identity.firstChild.innerHTML = "敌";
                            }
                        }
                    },
                ];
                var list = get.charactersOL();
                var choose = [];
                event.list = list;
                const select = suiSet.getSelect(list)
                for (var i = 0; i < game.players.length; i++) {
                    choose.push([
                        game.players[i],
                        ["选择出场和备用武将", [list.randomRemove(select), "character"]],
                        2,
                        true,
                    ]);
                }
                game.me.chooseButtonOL(choose, function (player, result) {
                    if (game.online || player == game.me) player.init(result.links[0]);
                });
                "step 1";
                for (var i in result) {
                    if (result[i] == "ai") {
                        result[i] = event.list.randomRemove(2);
                    } else {
                        result[i] = result[i].links;
                    }
                }
                game.broadcastAll(
                    function (result, func1, func2) {
                        setTimeout(function () {
                            ui.arena.classList.remove("choose-character");
                        }, 500);
                        _status.friendDied = [];
                        _status.enemyDied = [];

                        _status.friend = [];
                        _status.enemy = [];

                        _status.enemyCount = ui.create.system(
                            "杀敌: " + get.cnNumber(0, true),
                            null,
                            true
                        );
                        _status.friendCount = ui.create.system(
                            "阵亡: " + get.cnNumber(0, true),
                            null,
                            true
                        );

                        lib.setPopped(_status.friendCount, func1);
                        lib.setPopped(_status.enemyCount, func2);

                        for (var i in result) {
                            if (!lib.playerOL[i].name1) {
                                lib.playerOL[i].init(result[i][0]);
                            }
                            if (lib.playerOL[i].side == game.me.side) {
                                _status.friend.push(result[i][1]);
                            } else {
                                _status.enemy.push(result[i][1]);
                            }
                        }
                    },
                    result,
                    game.versusHoverFriend,
                    game.versusHoverEnemy
                );
                _status.onreconnect = [
                    function (list1, list2, list3, list4, side, func1, func2) {
                        if (side != game.me.side) {
                            var tmp;
                            tmp = list1;
                            list1 = list2;
                            list2 = tmp;
                            tmp = list3;
                            list3 = list4;
                            list4 = tmp;
                        }
                        _status.friendDied = list1;
                        _status.enemyDied = list2;

                        _status.friend = list3;
                        _status.enemy = list4;

                        _status.enemyCount = ui.create.system(
                            "杀敌: " + get.cnNumber(_status.enemyDied.length, true),
                            null,
                            true
                        );
                        _status.friendCount = ui.create.system(
                            "阵亡: " + get.cnNumber(_status.friendDied.length, true),
                            null,
                            true
                        );

                        lib.setPopped(_status.friendCount, func1);
                        lib.setPopped(_status.enemyCount, func2);

                        for (var i = 0; i < game.players.length; i++) {
                            if (game.players[i].side == game.me.side) {
                                game.players[i].node.identity.firstChild.innerHTML = "友";
                            } else {
                                game.players[i].node.identity.firstChild.innerHTML = "敌";
                            }
                        }
                    },
                    _status.friendDied,
                    _status.enemyDied,
                    _status.friend,
                    _status.enemy,
                    game.me.side,
                    game.versusHoverFriend,
                    game.versusHoverEnemy,
                ];
            });
        }
		suiSet.modeConfig.versus.chooseCharacterOLbp = function () {
			var next = game.createEvent("chooseCharacterOL");
			next.setContent(function () {
				"step 0";
				//_status.noReplaceCharacter = true;//取消替换选将
				var ref = game.players[0];
				var bool = Math.random() < 0.5;
				var bool2 = Math.random() < 0.5;
				ref.side = bool;
				ref.next.side = bool2;
				ref.next.next.side = !bool;
				ref.previous.side = !bool2;
				var firstChoose = game.players.randomGet();
				event.firstChooseHave = firstChoose;
				if (firstChoose.next.side == firstChoose.side) {
					firstChoose = firstChoose.next;
				}
				_status.firstAct = firstChoose;
				for (var i = 0; i < 4; i++) {
					firstChoose.node.name.innerHTML = get.verticalStr(get.cnNumber(i + 1, true) + "号位");
					firstChoose = firstChoose.next;
				}
				for (var i = 0; i < game.players.length; i++) {
					if (game.players[i].side == game.me.side) {
						game.players[i].node.identity.firstChild.innerHTML = "友";
					} else {
						game.players[i].node.identity.firstChild.innerHTML = "敌";
					}
					game.players[i].node.identity.dataset.color = game.players[i].side + "zhu";
				}
				ui.arena.classList.add("choose-character");
				game.broadcast(
					function (ref, bool, bool2, firstChoose) {
						ref.side = bool;
						ref.next.side = bool2;
						ref.next.next.side = !bool;
						ref.previous.side = !bool2;
						for (var i = 0; i < 4; i++) {
							firstChoose.node.name.innerHTML = get.verticalStr(
								get.cnNumber(i + 1, true) + "号位"
							);
							firstChoose = firstChoose.next;
						}
						for (var i = 0; i < game.players.length; i++) {
							if (game.players[i].side == game.me.side) {
								game.players[i].node.identity.firstChild.innerHTML = "友";
							} else {
								game.players[i].node.identity.firstChild.innerHTML = "敌";
							}
							game.players[i].node.identity.dataset.color = game.players[i].side + "zhu";
						}
						ui.arena.classList.add("choose-character");
					},
					ref,
					bool,
					bool2,
					_status.firstAct
				);
				_status.onreconnect = [
					function () {
						var players = game.players.concat(game.dead);
						for (var i = 0; i < players.length; i++) {
							if (players[i].side == game.me.side) {
								players[i].node.identity.firstChild.innerHTML = "友";
							} else {
								players[i].node.identity.firstChild.innerHTML = "敌";
							}
						}
					},
				];

				//22联机分配武将
				var list = [];
				var libCharacter = {};
				var list4 = [];
				var characterOnListBP = ['wangji', 'luji', 'junk_xuyou', 'haozhao', 'zhoufei', 'lukang', 'zhangxiu', 'shen_lvmeng', 'shen_zhouyu', 'shen_zhaoyun', 'shen_luxun', 'shen_zhangliao', 'shen_zhenji', 'shen_xunyu', 'shen_sunce', 'shen_lusu', 'caorui', 'zhangsong', 'zhangrang', 'cenhun', 'qinmi', 're_zhangliao', 're_simayi', 're_xuzhu', 're_xiahoudun', 're_lvmeng', 're_zhouyu', 're_luxun', 're_zhaoyun', 're_guanyu', 're_zhangfei', 're_machao', 're_caocao', 're_guojia', 're_lvbu', 're_huanggai', 're_daqiao', 're_ganning', 're_huatuo', 're_liubei', 're_diaochan', 're_huangyueying', 're_sunquan', 're_sunshangxiang', 're_zhugeliang', 're_zhenji', 're_huaxiong', 're_zhangjiao', 're_sunce', 'ol_sp_zhugeliang', 'ol_yuanshao', 'ol_liushan', 'ol_wangrong', 'ddd_xiahouxuan', 'xizhicai', 'maliang', 'zhanghua', 'shamoke', 'OL_luyusheng', 'luyusheng', 'sunru', 'ol_sunru', 'ol_pengyang', 'zhugeke', 'sp_zhaoyun', 'caochun', 'ddd_baosanniang', 're_baosanniang', 'fengfangnv', 'lvdai', 'tangji', 'xurong', 'zhangqiying', 'sp_zhangchangpu', 'fengfang', 'dc_mengda', 'sunhuan', 'gunning', 'xushao', 'star_zhangchunhua', 'ol_zhangchunhua', 'jin_simayi', 'jin_simazhao', 'jin_simashi', 'clan_wuxian', 'clan_xuncai', 'clan_zhonghui', 'dc_liuli', 'liuyong', 'tenggongzhu', 'lvlingqi', 'chenjiao', 'dc_dongzhao', 'qinlang', 'chengui', 'dc_liuba', 'xianglang', 'zhenghun', 'sunhanhua', 'yue_zoushi', 'liuzan', 'zhaozhi', 'luotong', 'dingshangwan', 'yuanji', 'ruanyu', 'panshu', 'caohua', 'sp_zhenji', 'huanfan', 'zhoubuyi', 'yj_zhoubuyi', 'dc_zhaoxiang', 'old_jiakui', 'majun', 'yanghuiyu', 'zhouqun', 'peixiu', 're_xiaoqiao', 'mb_caomao', 're_caozhi', 're_xusheng', 're_liru', 'xin_jushou', 'mb_sunluyu', 'wujing', 'qiaogong', 'zhangzhongjing', 'db_wenyang', 'liucheng', 'sb_huanggai', 'sb_zhouyu', 'sb_caocao', 'sb_ganning', 'sb_machao', 'sb_zhangfei', 'sb_zhaoyun', 'sb_liubei', 'sb_fazheng', 'sb_diaochan', 'sb_pangtong', 'sb_sunce', 'sb_daqiao', 'sb_xiaoqiao', 'sb_sp_zhugeliang', 'sb_huangyueying', 'sb_caopi', 'sb_xunyu', 'sb_xiahoudun', 'sb_luxun', 'yue_zhugeguo', 'huan_zhugeguo', 'zhugeguo', 'wuming_bg', 'jsrg_zhugeliang', 'key_shiori', 'key_misuzu', 'key_haruko', 'key_sunohara', 'key_nagisa', 'key_midori', 'key_mio', 'key_saya', 'key_lucia', 'key_shizuru', 'key_abyusa', 'key_ayato', 'key_iwasawa', 'key_shiina', 'key_shiroha', 'key_kiyu', 'key_seira', 'QQdiy_shouwang', 'QQdiy_shenaoliao', 'QQdiy_lutiandilang', 'QQdiy_gushenlangfeite'];
				for (var i = 0; i < lib.configOL.characterPack.length; i++) {
					var pack = lib.characterPack[lib.configOL.characterPack[i]];
					for (var j in pack) {
						if (lib.connectBanned.includes(j)) continue;
						if (lib.configOL.versus_lockCharacter && !characterOnListBP.includes(j)) continue;
						if (lib.character[j]) libCharacter[j] = pack[j];
					}
				}
				for (i in lib.characterReplace) {
					var ix = lib.characterReplace[i];
					for (var j = 0; j < ix.length; j++) {
						if (!libCharacter[ix[j]] || lib.filter.characterDisabled(ix[j], libCharacter))
							ix.splice(j--, 1);
					}
					if (ix.length) {
						list.push(i);
						list4.addArray(ix);
					}
				}
				game.broadcast(function (list) {
					for (var i in lib.characterReplace) {
						var ix = lib.characterReplace[i];
						for (var j = 0; j < ix.length; j++) {
							if (!list.includes(ix[j])) ix.splice(j--, 1);
						}
					}
				}, list4);
				for (i in libCharacter) {
					if (list4.includes(i) || lib.filter.characterDisabled(i, libCharacter)) continue;
					list.push(i);
					list4.push(i);
				}
				var choose = {};
				event.list = list;
				_status.characterlist = list4;

				//event.chooseTime = lib.configOL.versus_more_time
				//game.broadcastAll((num) => {
				//	lib.configOL.choose_timeout = Number(num)
				//}, event.chooseTime)
				//推荐队友选将
				//给所有人生成对话框
				//随机分配武将
				const select = suiSet.getSelect(list)
				for (var i = 0; i < game.players.length; i++) {
					choose[game.players[i].playerid] = list.randomRemove(select);
				}
				game._characterChoice = choose;
				event._choiceMap = {};
				//event._enemyMap = {};
				event.videoId = lib.status.videoId++;
				game.broadcastAll(
					function (id, choice, firstChoose) {
						event._enemyMap = {};
						game._characterChoice = choice;
						game._characterDialogID = id;
						var dialog = ui.create.dialog(`<span style="color:red;font-weight:700;">请禁用敌方的武将</span><br>点击后将框显示<span style="color:blue;">蓝色</span>则表示推荐队友禁用，显示<span style="color:red;">红色</span>则表示你选择的禁用`);
						dialog.videoId = id;
						var players, friends, enemys1, enemys2;
						var player = game.me;
						var friend;
						
						for (var j = 0; j < 4; j++) {
							for (var i in choice) {
								var current = lib.playerOL[i];
								if (current == firstChoose) {
									var str = firstChoose.node.name.innerHTML + " 的选将框";
									if (current == player) {
										players = choice[i];
										dialog.addText(str + "(你)");
										game._characterPlayerPosition = firstChoose.node.name.innerHTML;
										var buttons = ui.create.div(".buttons", dialog.content);
										dialog.players = ui.create.buttons(players, "characterx", buttons, true);
										dialog.buttons = dialog.buttons.concat(dialog.players);
									}
								}
							}
							firstChoose = firstChoose.next;
						}
						for (var j = 0; j < 4; j++) {
							for (var i in choice) {
								var current = lib.playerOL[i];
								if (current == firstChoose) {
									var str = firstChoose.node.name.innerHTML + " 的选将框";
									if (current.side == player.side && current != player) {
										friends = choice[i];
										friend = current;
										dialog.addText(str + "(队友)");
										game._characterPlayerFriendPosition = firstChoose.node.name.innerHTML;
										buttons = ui.create.div(".buttons", dialog.content);
										dialog.friends = ui.create.buttons(friends, "characterx", buttons, true);
										dialog.buttons = dialog.buttons.concat(dialog.friends);
									}
								}
							}
							firstChoose = firstChoose.next;
						}
						for (var j = 0; j < 4; j++) {
							for (var i in choice) {
								var current = lib.playerOL[i];
								if (current == firstChoose && current.side != player.side && current != player) {
									var str = firstChoose.node.name.innerHTML + " 的选将框";
									if (game._characterPlayerPosition === "一号位" || game._characterPlayerPosition === "二号位") {
										if (enemys1 === undefined) {
											enemys1 = choice[i];
											event._enemyMap[player.playerid] = current.playerid;
											event._enemyMap[current.playerid] = player.playerid;
											dialog.addText(str);
											buttons = ui.create.div(".buttons", dialog.content);
											dialog.enemys1 = ui.create.buttons(enemys1, "characterx", buttons);
											dialog.buttons = dialog.buttons.concat(dialog.enemys1);
										}
										else {
											enemys2 = choice[i];
											event._enemyMap[friend.playerid] = current.playerid;
											event._enemyMap[current.playerid] = friend.playerid;
											dialog.addText(str);
											buttons = ui.create.div(".buttons", dialog.content);
											dialog.enemys2 = ui.create.buttons(enemys2, "characterx", buttons);
											dialog.buttons = dialog.buttons.concat(dialog.enemys2);
										}
									}
									else {
										if (enemys2 === undefined) {
											enemys2 = choice[i];
											event._enemyMap[friend.playerid] = current.playerid;
											event._enemyMap[current.playerid] = friend.playerid;
											dialog.addText(str);
											buttons = ui.create.div(".buttons", dialog.content);
											dialog.enemys2 = ui.create.buttons(enemys2, "characterx", buttons);
											dialog.buttons = dialog.buttons.concat(dialog.enemys2);
										}
										else {
											enemys1 = choice[i];
											event._enemyMap[player.playerid] = current.playerid;
											event._enemyMap[current.playerid] = player.playerid;
											dialog.addText(str);
											buttons = ui.create.div(".buttons", dialog.content);
											dialog.enemys1 = ui.create.buttons(enemys1, "characterx", buttons);
											dialog.buttons = dialog.buttons.concat(dialog.enemys1);
										}
									}
								}
							}
							firstChoose = firstChoose.next;
						}
					},
					event.videoId,
					choose,
					firstChoose
				);
				//发送选择事件
				var send = function () {
					var playerChoose = game._characterChoice;
					var next = game.me.chooseButton([1, 2], true);
					next.set("dialog", game._characterDialogID);
					next.set("callback", function (player, result) {//点确定了 
						//alert("禁用：" + result.links[0]);
						//var str;
						//for (var i in result) {
						//	str += result[i] + "  " + i + "----";
						//}
						//alert(str);
						//player.init(result.links[0], null, null, false);
						var button = game._playerChoice;
						//var dialog = get.idDialog(game._characterDialogID);
						//var loca = 0;
						//for (var other of dialog.enemys1) {
						//	if (typeof button === typeof other) loca++;
						//	//if (button === other) alert(game._characterPlayerPosition + "禁用位置：" + loca);
						//}
						button.classList.remove("glow");
						button.classList.add("selected");
						delete game._playerChoice;
					});
					//托管选择
					next.set("ai", function (button) {
						if (ui.selected.buttons.length) return 0;
						var dialog = get.idDialog(game._characterDialogID);
						if (dialog.enemys2 && dialog.enemys2.includes(button) || dialog.players && dialog.players.includes(button) || dialog.friends && dialog.friends.includes(button)) return 0;
						if (dialog.classList.contains("glow")) return 1 + Math.random();
						return 0.5 + Math.random();
					});
					//修改点击按钮后的反应
					next.set("custom", {
						replace: {
							button: function (button) {
								var dialog = get.idDialog(game._characterDialogID);
								var origin = button._link,
									choice = button.link;
								//选择按钮时自动取消选择上一个按钮
								//alert(ui.selected.buttons.length + "   " + get.select(event.selectButton));
								if (dialog.enemys1.includes(button)) {
									if (!button.classList.contains("selected")) {
										button.classList.add("selected");
										ui.selected.buttons.add(button);
										game._playerChoice = button;
										for (var other of dialog.enemys1) {
											if (other != button && other.classList.contains("selected")) {
												other.classList.remove("selected");
												ui.selected.buttons.remove(other);
											}
										}
									}
									game.check();
								} else if (dialog.enemys2.includes(button)) {
									//给队友推荐选将
									if (game._friendConfirmed) return;
									if (button == dialog._recommending) return;
									dialog._recommending = button;
									button.classList.add("glow");
									for (var other of dialog.enemys2) {
										if (other != button && other.classList.contains("glow")) {
											other.classList.remove("glow");
										}
									}
									//将最小发送延时间隔设置为0.5秒 避免通过频繁点击进行炸服
									if (dialog.delay) return;
									if (game.online) game.send("tempResult", origin);
									else game.me.tempUnwait(origin);
									dialog.delay = setTimeout(function () {
										delete dialog.delay;
										if (game._friendConfirmed) return;
										var recommend = dialog._recommending._link;
										if (recommend != origin) {
											if (game.online) game.send("tempResult", recommend);
											else game.me.tempUnwait(recommend);
										}
									}, 500);
								} 
							},
						},
						add: {},
					});
					if (game.online) game.resume();
				};
				//推荐禁将后的回传函数
				event.recommend = function (player, choice) {
					if (player.name1 || game._characterDialogID == undefined) return;
					var dialog = get.idDialog(game._characterDialogID);
					if (dialog) {
						for (var button of dialog.enemys1) {
							if (button._link == choice) button.classList.add("glow");
							else if (button.classList.contains("glow")) button.classList.remove("glow");
						}
					}
				};
				//确认禁将后的回传函数
				event.confirm = function (player, choice) {
					//if (!player.name1) player.init(choice, null, null, false);//TODO:禁将初始化
					game._friendConfirmed = true;
					if (game._characterDialogID == undefined) return;
					var dialog = get.idDialog(game._characterDialogID);
					if (!dialog) return;
					for (var button of dialog.enemys2) {
						button.classList.remove("glow");
						if (
							button.link == choice ||
							(lib.characterReplace[button._link] &&
								lib.characterReplace[button._link].includes(choice))
						)
							button.classList.add("selected");
					}
				};
				//处理result
				var sendback = function (result, player) {
					var type = typeof result;
					var friend = game.findPlayer(function (current) {
						return current != player && current.side == player.side;
					});
					//处理推荐禁将
					if (type == "string") {
						if (friend == game.me) event.recommend(friend, result);
						else if (friend.isOnline()) friend.send(event.recommend, friend, result);
					}
					//处理确认禁将
					else if (result && type == "object") {
						var choice = result.links[0];
						//if (button.link == choice || (lib.characterReplace[button._link] && lib.characterReplace[button._link].includes(choice)))

						event._choiceMap[player.playerid] = choice;
						if (friend == game.me) event.confirm(player, choice);
						else if (friend.isOnline()) friend.send(event.confirm, player, choice);
					}
				};
				event.sendback = sendback;

				//发送
				event.ai_targets = [];
				for (var i = 0; i < game.players.length; i++) {
					if (game.players[i].isOnline()) {
						event.withol = true;
						game.players[i].send(send);
						game.players[i].wait(sendback);
					} else if (game.players[i] == game.me) {
						event.withme = true;
						send();
						game.me.wait(sendback);
					} else {
						event.ai_targets.push(game.players[i]);
						game.players[i].showTimer();
					}
				}
				//模拟AI思考后选择
				if (event.ai_targets.length) {
					event.ai_targets.randomSort();
					setTimeout(function () {
						event.interval = setInterval(function () {
							var target = event.ai_targets.shift();
							var list = game._characterChoice[event._enemyMap[target.playerid]];
							//var choice = Math.floor(Math.random() * 10) + 1;
							var choice = list.randomGet();
							event._choiceMap[target.playerid] = choice;//添加AI禁将
							//AI必选玩家推荐角色
							//if (target._aiChoice && list.includes(target._aiChoice))
							//	choice = target._aiChoice;
							//else choice = list.randomGet();
							//if (lib.characterReplace[choice])
							//	choice = lib.characterReplace[choice].randomGet();
							//event.sendback(
							//	{
							//		result: bool,
							//		links: [choice],
							//	},
							//	target
							//);
							target.hideTimer();
							if (!event.ai_targets.length) {
								clearInterval(event.interval);
								if (event.withai) game.resume();
							}
						}, 1000);
					}, 2000);
				}
				"step 1";
				if (event.withme) {
					game.me.unwait(result);
				}
				"step 2";
				if (event.withol && !event.resultOL) {
					game.pause();
				}
				"step 3";
				if (event.ai_targets.length > 0) {
					event.withai = true;
					game.pause();
				}
				"step 4";
				for (var lk in event._choiceMap) {
					var choice = event._choiceMap[lk];
					var replaceChoice = [];

					for (var tt in lib.characterReplace) {
						if (lib.characterReplace[tt].includes(choice)) {
							replaceChoice = lib.characterReplace[tt];
							replaceChoice.push(tt);
						}
					}
					//if (replaceChoice.length == 0) alert(choice + "没有可替换列表");
					//else {
					//	for (var kp in replaceChoice) alert(choice + "可以替换为：--"+replaceChoice[kp]+"--");
					//}
					//if (!replaceChoice.inlcudes(choice)) replaceChoice.push(choice);
					//for (var lp in replaceChoice) alert(replaceChoice[lp]);
					for (var i in game._characterChoice) {
						var lenq = game._characterChoice[i].length;
						game._characterChoice[i] = game._characterChoice[i].filter(element => !replaceChoice.includes(element) && element != choice);
/*						if (lenq != game._characterChoice[i].length) alert("删除成功：" + choice);*/
					}
				}
				//for (var i in game._characterChoice) {
				//	if (game._characterChoice[i].length == 10) {
				//		for (var c in game._characterChoice[i]) alert("含有的角色：----" + game._characterChoice[i][c] + "-----");
				//	}
				//}
				
				"step 5";
				//game.broadcastAll('closeDialog', event.videoId);
				game.broadcastAll(function (id) {
					var dialog = get.idDialog(id);
					if (dialog) {
						dialog.close();
						//dialog.remove();
						clearInterval(dialog.delay);
					}
				}, event.videoId);
				//var result = event._choiceMap;
				for (var i in lib.playerOL) {
					//if (!lib.character[result[i]]) {
					//	result[i] = game._characterChoice[i].randomGet();
					//}
					//_status.characterlist.remove(result[i]);
					//if (!lib.playerOL[i].name1) {
					//	lib.playerOL[i].init(result[i]);
					//}
					//lib.playerOL[i].update();
					//alert(game._enemyMap[i] + "----");
					//if (event._choiceMap[i] == undefined) event._choiceMap[i] = Math.floor(Math.random() * 10) + 1;
					//alert(lib.playerOL[i].playerid + "禁用了" + event._choiceMap[i]);
				}

				"step 6";
				/*game._characterChoice = choose;*/
				/*event._choiceMap = {};*/
				var choose = game._characterChoice;
				event.videoId = lib.status.videoId++;
				game._friendConfirmed = false;
				game._playerChoice = {};
				event.resultOL = false;//重置在线玩家确认情况

				//for (var a in event._enemyMap) {
				//	alert(event._enemyMap[a] + "对 " + a);
				//}
				game.broadcastAll(
					function (id, choice, firstChoose, enemyTarget) {
						game._characterChoice = choice;
						game._characterDialogID = id;
						var dialog = ui.create.dialog(`欧尼酱~请选择你的武酱！<br><span style="color:red;font-weight:700;">请务必至少选择一个位于你将池内的武将，直接点击确定会随机选将！！</span><br>可以点击队友的将池为他推荐选将`);
						dialog.videoId = id;
						var players, friends, enemys1, enemys2;
						var player = game.me;
						
						for (var j = 0; j < 4; j++) {
							for (var i in choice) {
								var current = lib.playerOL[i];
								if (current == firstChoose) {
									var str = firstChoose.node.name.innerHTML + " 的选将框";
									if (current == player) {
										players = choice[i];
										//删除被禁用武将
										dialog.addText(str + "(你)");
										var buttons = ui.create.div(".buttons", dialog.content);
										dialog.players = ui.create.buttons(players, "characterx", buttons);
										dialog.buttons = dialog.buttons.concat(dialog.players);
									}
								}
							}
							firstChoose = firstChoose.next;
						}
						for (var j = 0; j < 4; j++) {
							for (var i in choice) {
								var current = lib.playerOL[i];
								if (current == firstChoose) {
									var str = firstChoose.node.name.innerHTML + " 的选将框";
									if (current.side == player.side && current != player) {
										friends = choice[i];
										dialog.addText(str + "(队友)");
										buttons = ui.create.div(".buttons", dialog.content);
										dialog.friends = ui.create.buttons(friends, "characterx", buttons);
										dialog.buttons = dialog.buttons.concat(dialog.friends);
									}
								}
							}
							firstChoose = firstChoose.next;
						}
						for (var j = 0; j < 4; j++) {
							for (var i in choice) {
								var current = lib.playerOL[i];
								if (current == firstChoose && current.side != player.side && current != player) {
									var str = firstChoose.node.name.innerHTML + " 的选将框";
									if (game._characterPlayerPosition === "一号位" || game._characterPlayerPosition === "二号位") {
										if (enemys1 === undefined) {
											enemys1 = choice[i];
											dialog.addText(str);
											buttons = ui.create.div(".buttons", dialog.content);
											dialog.enemys1 = ui.create.buttons(enemys1, "characterx", buttons, true);
											dialog.buttons = dialog.buttons.concat(dialog.enemys1);
										}
										else {
											enemys2 = choice[i];
											dialog.addText(str);
											buttons = ui.create.div(".buttons", dialog.content);
											dialog.enemys2 = ui.create.buttons(enemys2, "characterx", buttons, true);
											dialog.buttons = dialog.buttons.concat(dialog.enemys2);
										}
									}
									else {
										if (enemys2 === undefined) {
											enemys2 = choice[i];
											dialog.addText(str);
											buttons = ui.create.div(".buttons", dialog.content);
											dialog.enemys2 = ui.create.buttons(enemys2, "characterx", buttons, true);
											dialog.buttons = dialog.buttons.concat(dialog.enemys2);
										}
										else {
											enemys1 = choice[i];
											dialog.addText(str);
											buttons = ui.create.div(".buttons", dialog.content);
											dialog.enemys1 = ui.create.buttons(enemys1, "characterx", buttons, true);
											dialog.buttons = dialog.buttons.concat(dialog.enemys1);
										}
									}
								}
							}
							firstChoose = firstChoose.next;
						}
					},
					event.videoId,
					choose,
					event.firstChooseHave,
					event._enemyMap
				);
				event._choiceMap = {};
				//发送选择事件
				var send = function () {
					game.uncheck();
					var next = game.me.chooseButton([lib.config.touchscreen ? 1 : 0, 2], true);
					next.set("dialog", game._characterDialogID);
					next.set("callback", function (player, result) {
						player.init(result.links[0], null, null, false);
						var button = game._playerChoice;
						button.classList.remove("glow");
						button.classList.add("glow2");
						delete game._playerChoice;
					});
					//托管选择
					next.set("ai", function (button) {
						if (ui.selected.buttons.length) return 0;
						var dialog = get.idDialog(game._characterDialogID);
						if (dialog.friends && dialog.friends.includes(button) || dialog.enemys1 && dialog.enemys1.includes(button) || dialog.enemys2 && dialog.enemys2.includes(button)) return 0;
						if (dialog.classList.contains("glow")) return 1 + Math.random();
						return 0.5 + Math.random();
					});
					//修改点击按钮后的反应
					next.set("custom", {
						replace: {
							button: function (button) {
								var dialog = get.idDialog(game._characterDialogID);
								var origin = button._link,
									choice = button.link;
								//选择按钮时自动取消选择上一个按钮
								if (dialog.players.includes(button)) {
									if (!button.classList.contains("glow2")) {
										button.classList.add("glow2");
										ui.selected.buttons.add(button);
										game._playerChoice = button;
										for (var other of dialog.players) {
											if (other != button && other.classList.contains("glow2")) {
												other.classList.remove("glow2");
												ui.selected.buttons.remove(other);
											}
										}
									}
									game.check();
								} else {
									game.check();
									//给队友推荐选将
									if (game._friendConfirmed) return;
									if (button == dialog._recommending) return;
									dialog._recommending = button;
									button.classList.add("glow");
									for (var other of dialog.friends) {
										if (other != button && other.classList.contains("glow")) {
											other.classList.remove("glow");
										}
									}
									//将最小发送延时间隔设置为0.5秒 避免通过频繁点击进行炸服
									if (dialog.delay) return;
									if (game.online) game.send("tempResult", origin);
									else game.me.tempUnwait(origin);
									dialog.delay = setTimeout(function () {
										delete dialog.delay;
										if (game._friendConfirmed) return;
										var recommend = dialog._recommending._link;
										if (recommend != origin) {
											if (game.online) game.send("tempResult", recommend);
											else game.me.tempUnwait(recommend);
										}
									}, 500);
								}
							},
						},
						add: {},
					});
					if (game.online) game.resume();
					
				};
				//推荐选将后的回传函数
				event.recommend = function (player, choice) {
					if (player.name1 || game._characterDialogID == undefined) return;
					var dialog = get.idDialog(game._characterDialogID);
					if (dialog) {
						for (var button of dialog.players) {
							if (button._link == choice) button.classList.add("glow");
							else if (button.classList.contains("glow")) button.classList.remove("glow");
						}
					}
				};
				//确认选将后的回传函数
				event.confirm = function (player, choice) {
					if (!player.name1) player.init(choice, null, null, false);
					game._friendConfirmed = true;
					if (game._characterDialogID == undefined) return;
					var dialog = get.idDialog(game._characterDialogID);
					if (!dialog) return;
					for (var button of dialog.friends) {
						button.classList.remove("glow");
						if (
							button.link == choice ||
							(lib.characterReplace[button._link] &&
								lib.characterReplace[button._link].includes(choice))
						)
							button.classList.add("glow2");
					}
				};
				//处理result
				var sendback = function (result, player) {
					var type = typeof result;
					var friend = game.findPlayer(function (current) {
						return current != player && current.side == player.side;
					});
					//处理推荐选将
					if (type == "string") {
						if (friend == game.me) event.recommend(friend, result);
						else if (friend.isOnline()) friend.send(event.recommend, friend, result);
					}
					//处理确认选将
					else if (result && type == "object") {
						var choice = result.links[0];
						event._choiceMap[player.playerid] = choice;
						if (friend == game.me) event.confirm(player, choice);
						else if (friend.isOnline()) friend.send(event.confirm, player, choice);
					}
				};
				event.sendback = sendback;

				event.withme = false;
				event.withol = false;
				event.withai = false;

				//发送
				event.ai_targets = [];
				
				for (var i = 0; i < game.players.length; i++) {
					if (game.players[i].isOnline()) {
						event.withol = true;
						game.players[i].send(send);
						game.players[i].wait(sendback);
					} else if (game.players[i] == game.me) {
						event.withme = true;
						send();
						game.me.wait(sendback);
					} else {
						event.ai_targets.push(game.players[i]);
						game.players[i].showTimer();
					}
				}
				//模拟AI思考后选择
				if (event.ai_targets.length) {
					event.ai_targets.randomSort();
					setTimeout(function () {
						event.interval = setInterval(function () {
							var target = event.ai_targets.shift();
							var list = game._characterChoice[target.playerid];
							var choice = list.randomGet();
							if (lib.characterReplace[choice])
								choice = lib.characterReplace[choice].randomGet();
							event.sendback(
								{
									result: event.abool,
									links: [choice],
								},
								target
							);
							target.hideTimer();
							if (!event.ai_targets.length) {
								clearInterval(event.interval);
								if (event.withai) game.resume();
							}
						}, 1000);
					}, 2000);
				}
				"step 7";
				if (event.withme) {
					game.me.unwait(result, game.me);
				}
				"step 8";
				if (event.withol && !event.resultOL) {
					game.pause();
				}
				"step 9";
				if (event.ai_targets.length > 0) {
					event.withai = true;
					game.pause();
				}
				"step 10";
				game.broadcastAll(function (id) {
					var dialog = get.idDialog(id);
					if (dialog) {
						dialog.close();
						clearInterval(dialog.delay);
					}
				}, event.videoId);
				var result = event._choiceMap;
				for (var i in lib.playerOL) {
					if (!lib.character[result[i]]) {
						result[i] = game._characterChoice[i].randomGet();
					}
					_status.characterlist.remove(result[i]);
					if (!lib.playerOL[i].name1) {
						lib.playerOL[i].init(result[i]);
					}
					lib.playerOL[i].update();
				}

				//event.chooseTime = lib.configOL.choose_timeout
				//game.broadcastAll((num) => {
				//	lib.configOL.choose_timeout = Number(num)
				//}, event.chooseTime)

				game.broadcast(function (result) {
					for (var i in result) {
						if (!lib.playerOL[i].name1) {
							lib.playerOL[i].init(result[i]);
							lib.playerOL[i].update();
						}
					}
					setTimeout(function () {
						ui.arena.classList.remove("choose-character");
					}, 500);
				}, result);
				setTimeout(function () {
					ui.arena.classList.remove("choose-character");
				}, 500);
				//开始游戏
				if (lib.configOL.olfeiyang_four) {
					var target = _status.firstAct.previous;
					if (target.isIn()) target.addSkill("olfeiyang");
				}
				game.addGlobalSkill("versus_viewHandcard");
			});
		}
    }
}
/*
lib.mode.versus.start = function () {
	alert("aaaaaaaaaaaaaa");
	"step 0";
	_status.mode = get.config("versus_mode");
	if (_status.connectMode) _status.mode = lib.configOL.versus_mode;
	if (_status.brawl && _status.brawl.submode) {
		_status.mode = _status.brawl.submode;
	}
	if (lib.config.test_game) {
		_status.mode = "standard";
	}
	"step 1";
	var playback = localStorage.getItem(lib.configprefix + "playback");
	if (playback) {
		ui.create.me();
		ui.arena.style.display = "none";
		ui.system.style.display = "none";
		_status.playback = playback;
		localStorage.removeItem(lib.configprefix + "playback");
		var store = lib.db.transaction(["video"], "readwrite").objectStore("video");
		store.get(parseInt(playback)).onsuccess = function (e) {
			if (e.target.result) {
				game.playVideoContent(e.target.result.video);
			} else {
				alert("播放失败：找不到录像");
				game.reload();
			}
		};
		event.finish();
		return;
	}
	if (_status.connectMode) {
		game.waitForPlayer(function () {
			switch (lib.configOL.versus_mode) {
				case "1v1":
					lib.configOL.number = 2;
					break;
				case "2v2":
					lib.configOL.number = 4;
					break;
				case "3v3":
					lib.configOL.number = 6;
					break;
				case "4v4":
				case "guandu":
					lib.configOL.number = 8;
					break;
			}
		});
	} else if (
		_status.mode == "jiange" ||
		_status.mode == "siguo" ||
		_status.mode == "four" ||
		_status.mode == "guandu"
	) {
		if (_status.mode == "four" && !get.config("enable_all_cards_four")) {
			lib.card.list = lib.cardsFour;
			game.fixedPile = true;
		} else if (_status.mode == "siguo") {
			for (var i = 0; i < lib.card.list.length; i++) {
				switch (lib.card.list[i][2]) {
					case "tao":
						lib.card.list[i][2] = "zong";
						break;
					case "jiu":
						lib.card.list[i][2] = "xionghuangjiu";
						break;
					case "wuzhong":
						lib.card.list[i][2] = "tongzhougongji";
						break;
					case "wugu":
					case "taoyuan":
						lib.card.list[i][2] = "lizhengshangyou";
						break;
				}
			}
		} else if (_status.mode == "guandu") {
			for (var i = 0; i < lib.card.list.length; i++) {
				switch (lib.card.list[i][2]) {
					case "jiu":
						lib.card.list[i][2] = "xujiu";
						break;
					case "wugu":
						lib.card.list[i][2] = "tunliang";
						break;
					case "nanman":
						lib.card.list[i][2] = "lulitongxin";
						break;
					case "taoyuan":
					case "shandian":
						lib.card.list[i][2] = "yuanjun";
						break;
					case "muniu":
						lib.card.list.splice(i--, 1);
						break;
				}
			}
		}
		game.prepareArena(8);
	} else if (_status.mode == "two") {
		game.prepareArena(4);
	} else if (_status.mode == "endless") {
		game.prepareArena(2);
	} else if (_status.mode == "three") {
		if (lib.character.wenpin) lib.character.wenpin[3] = ["zhenwei_three"];
		if (lib.character.zhugejin)
			lib.character.zhugejin[3] = ["hongyuan", "huanshi_three", "mingzhe"];
		if (lib.character.key_yuzuru) {
			lib.character.key_yuzuru[2] = 4;
			lib.character.key_yuzuru[3] = ["yuzuru_bujin"];
		}
		if (lib.character.guanyu) lib.character.guanyu[3] = ["wusheng", "zhongyi"];
		if (lib.character.lvbu) lib.character.lvbu[3] = ["wushuang", "zhanshen"];
		if (lib.character.xiahoudun) lib.character.xiahoudun[3] = ["ganglie_three"];
		if (!get.config("enable_all_cards")) {
			lib.translate.wuzhong_info += "若对方存活角色多于己方，则额外摸一张牌";
			lib.translate.zhuge_info = "锁定技，出牌阶段，你使用【杀】的次数上限+3";
			lib.card.list = lib.cardsThree;
			game.fixedPile = true;
		} else if (Array.isArray(lib.config.forbidthreecard)) {
			for (var i = 0; i < lib.card.list.length; i++) {
				if (lib.config.forbidthreecard.includes(lib.card.list[i][2])) {
					lib.card.list.splice(i--, 1);
				}
			}
		}
		ui.create.cardsAsync();
		game.finishCards();
	} else {
		if (lib.storage.choice == undefined) game.save("choice", 20);
		if (lib.storage.zhu == undefined) game.save("zhu", true);
		if (lib.storage.noreplace_end == undefined) game.save("noreplace_end", true);
		if (get.config("first_less") == undefined) game.saveConfig("first_less", true, true);
		if (lib.storage.autoreplaceinnerhtml == undefined) game.save("autoreplaceinnerhtml", true);
		if (lib.storage.single_control == undefined) game.save("single_control", true);
		if (lib.storage.number == undefined) game.save("number", 3);
		if (lib.storage.versus_reward == undefined) game.save("versus_reward", 3);
		if (lib.storage.versus_punish == undefined) game.save("versus_punish", "弃牌");
		if (lib.storage.replace_number == undefined) game.save("replace_number", 3);

		switch (lib.storage.seat_order) {
			case "交叉":
				lib.storage.cross_seat = true;
				lib.storage.random_seat = false;
				break;
			case "随机":
				lib.storage.cross_seat = false;
				lib.storage.random_seat = true;
				break;
			default:
				lib.storage.cross_seat = false;
				lib.storage.random_seat = false;
		}
		game.save("only_zhu", true);
		ui.wuxie.hide();
		ui.create.cardsAsync();
		game.finishCards();
	}
	// game.delay();
	"step 2";//进入游戏

	if (!_status.connectMode && _status.brawl && _status.brawl.chooseCharacterBefore) {
		_status.brawl.chooseCharacterBefore();
	}
	if (_status.connectMode) {
		if (_status.mode == "guandu") {
			for (var i = 0; i < lib.card.list.length; i++) {
				switch (lib.card.list[i][2]) {
					case "jiu":
						lib.card.list[i][2] = "xujiu";
						break;
					case "wugu":
						lib.card.list[i][2] = "tunliang";
						break;
					case "nanman":
						lib.card.list[i][2] = "lulitongxin";
						break;
					case "taoyuan":
					case "shandian":
						lib.card.list[i][2] = "yuanjun";
						break;
					case "muniu":
						lib.card.list.splice(i--, 1);
						break;
				}
			}
		}
		if (lib.configOL.versus_mode == "1v1") {
			game.randomMapOL("hidden");
		} else {
			game.randomMapOL();
		}
	} else if (_status.mode == "guandu") {
		var list = [
			["zhu", "ezhu", "ezhong", "zhong", "ezhong", "zhong", "zhong", "ezhong"],
			["zhu", "ezhong", "zhong", "ezhu", "ezhong", "zhong", "ezhong", "zhong"],
			["zhu", "ezhong", "zhong", "ezhong", "zhong", "ezhong", "zhong", "ezhu"],
			["zhu", "ezhu", "zhong", "ezhong", "zhong", "ezhong", "zhong", "ezhong"],
			["zhu", "ezhong", "zhong", "ezhong", "zhong", "ezhu", "zhong", "ezhong"],
		].randomGet();

		var side = true;
		var num = Math.floor(Math.random() * 8);
		list = list.splice(8 - num).concat(list);
		_status.firstAct = game.players[num];
		for (var i = 0; i < 8; i++) {
			if (list[i][0] == "e") {
				game.players[i].side = side;
				game.players[i].identity = list[i].slice(1);
			} else {
				game.players[i].side = !side;
				game.players[i].identity = list[i];
			}
			if (game.players[i].identity == "zhu") {
				game[game.players[i].side + "Zhu"] = game.players[i];
				game.players[i].isZhu = true;
			}
			game.players[i].setIdentity(game.players[i].identity);
			game.players[i].node.identity.dataset.color = get.translation(
				game.players[i].side + "Color"
			);
			game.players[i].getId();
		}
		game.chooseCharacterGuandu();
	} else if (_status.mode == "four") {
		_status.fouralign = [0, 1, 2, 3, 4];
		var list = [
			["zhong", "ezhong", "ezhong", "zhong", "zhong", "ezhong", "ezhong", "zhong"],
			["zhong", "ezhong", "zhong", "ezhong", "ezhong", "zhong", "ezhong", "zhong"],
			["zhong", "ezhong", "ezhong", "zhong", "ezhong", "zhong", "zhong", "ezhong"],
			["zhong", "ezhong", "zhong", "ezhong", "zhong", "ezhong", "zhong", "ezhong"],
			["zhong", "ezhong", "ezhong", "zhong", "ezhong", "zhong", "ezhong", "zhong"],
		][_status.fouralign.randomRemove()];
		var rand1 = Math.floor(Math.random() * 4);
		var rand2 = Math.floor(Math.random() * 4);
		for (var i = 0; i < list.length; i++) {
			if (list[i] == "zhong") {
				if (rand1 == 0) {
					list[i] = "zhu";
				}
				rand1--;
			} else {
				if (rand2 == 0) {
					list[i] = "ezhu";
				}
				rand2--;
			}
		}

		for (var i in lib.skill) {
			if (lib.skill[i].changeSeat) {
				lib.skill[i] = {};
				if (lib.translate[i + "_info"]) {
					lib.translate[i + "_info"] = "此模式下不可用";
				}
			}
		}

		var side = Math.random() < 0.5;
		var num = Math.floor(Math.random() * 8);
		list = list.splice(8 - num).concat(list);
		_status.firstAct = game.players[num];
		for (var i = 0; i < 8; i++) {
			if (list[i][0] == "e") {
				game.players[i].side = side;
				game.players[i].identity = list[i].slice(1);
			} else {
				game.players[i].side = !side;
				game.players[i].identity = list[i];
			}
			if (game.players[i].identity == "zhu") {
				game[game.players[i].side + "Zhu"] = game.players[i];
				game.players[i].isZhu = true;
			}
			game.players[i].setIdentity(game.players[i].identity);
			game.players[i].node.identity.dataset.color = get.translation(
				game.players[i].side + "Color"
			);
			game.players[i].getId();
		}
		game.chooseCharacterFour();
	} else if (_status.mode == "two") {
		for (var i = 0; i < game.players.length; i++) {
			game.players[i].getId();
		}
		game.chooseCharacterTwo();
	} else if (_status.mode == "endless") {
		game.chooseCharacterEndless();
	} else if (_status.mode == "siguo") {
		var list = ["wei", "wei", "shu", "shu", "wu", "wu", "qun", "qun"].randomSort();
		for (var i = 0; i < game.players.length; i++) {
			game.players[i].side = list[i];
			game.players[i].identity = list[i];
			game.players[i].setIdentity(list[i]);
			game.players[i].node.identity.style.display = "none";
			game.players[i].getId();
			game.players[i].node.action.innerHTML = "即将<br>获胜";
			game.players[i].node.action.style.letterSpacing = "0px";
			game.players[i].node.action.style.lineHeight = "22px";
			game.players[i].node.action.style.top = "3px";
			game.players[i].node.action.style.right = "3px";
		}
		game.chooseCharacterSiguo();
	} else if (_status.mode == "jiange") {
		var list = ["shumech", "shu", "shuboss", "shu", "wei", "weiboss", "wei", "weimech"];
		var pos = Math.floor(Math.random() * 8);
		for (var i = 0; i < 8; i++) {
			var j = pos + i;
			if (j >= 8) {
				j -= 8;
			}
			if (list[i][0] == "w") {
				game.players[j].side = true;
				game.players[j].setIdentity("wei");
				game.players[j].identity = "wei";
			} else {
				game.players[j].side = false;
				game.players[j].setIdentity("shu");
				game.players[j].identity = "shu";
			}
			if (list[i].indexOf("mech") != -1) {
				game.players[j].type = "mech";
			} else if (list[i].indexOf("boss") != -1) {
				game.players[j].type = "boss";
			} else {
				game.players[j].type = "human";
			}
			game.players[i].getId();
		}
		game.chooseCharacterJiange();
	} else if (_status.mode == "three") {
		game.chooseCharacterThree();
	} else {
		game.chooseCharacter();
	}
	"step 3";
	//游戏开始，选完角色
	var players = get.players(lib.sort.position);
	var info = [];
	for (var i = 0; i < players.length; i++) {
		info.push({
			name: players[i].name1,
			name2: players[i].name2,
			identity: players[i].node.identity.firstChild.innerHTML,
			nickname: players[i].node.nameol.innerHTML,
			color: players[i].node.identity.dataset.color,
		});
	}
	_status.videoInited = true;
	if (
		_status.mode == "four" ||
		_status.mode == "jiange" ||
		_status.connectMode ||
		_status.mode == "two" ||
		_status.mode == "siguo" ||
		_status.mode == "endless"
	) {
		info.push(false);
	} else if (_status.mode == "three") {
		info.push(true);
	} else {
		info.push(lib.storage.single_control && game.players.length >= 4);
	}
	game.addVideo("init", null, info);
	event.trigger("gameStart");

	if (_status.connectMode) {
		if (_status.mode == "1v1") {
			_status.first_less = true;
			game.gameDraw(_status.firstChoose.next);
			game.phaseLoop(_status.firstChoose.next);
		} else if (_status.mode == "2v2" || _status.mode == "3v3") {
			_status.first_less = true;
			var firstChoose = _status.firstAct || game.players.randomGet();
			if (firstChoose.next.side == firstChoose.side) {
				firstChoose = firstChoose.next;
			}
			game.gameDraw(firstChoose, function (player) {
				if (lib.configOL.replace_handcard && player == firstChoose.previousSeat) {
					return 5;
				}
				return 4;
			});
			game.replaceHandcards(game.players.slice(0));
			game.phaseLoop(firstChoose);
		} else if (_status.mode == "guandu") {
			game.gameDraw(_status.firstAct);
			game.phaseLoop(_status.firstAct);
		} else if (_status.mode == "4v4") {
			game.gameDraw(_status.firstAct, function (player) {
				if (player == _status.firstAct.previousSeat) {
					return 5;
				}
				return 4;
			});
			game.replaceHandcards(_status.firstAct.previous, _status.firstAct.previous.previous);
			game.phaseLoop(_status.firstAct);
		}
		event.finish();
	} else {
		if (_status.mode == "guandu") {
			game.gameDraw(_status.firstAct, 4);
			game.phaseLoop(_status.firstAct);
		} else if (_status.mode == "two") {
			_status.first_less = true;
			_status.first_less_forced = true;
			var firstChoose = _status.firstAct;
			game.gameDraw(firstChoose, function (player) {
				if (player == _status.firstAct.previousSeat && get.config("replace_handcard_two")) {
					return 5;
				}
				return 4;
			});
			game.phaseLoop(firstChoose);
		} else if (_status.mode == "endless") {
			_status.first_less = true;
			_status.first_less_forced = true;
			var firstChoose = _status.firstAct;
			game.gameDraw(firstChoose);
			game.phaseLoop(firstChoose);
		} else if (_status.mode == "four") {
			game.gameDraw(_status.firstAct, function (player) {
				if (player == _status.firstAct.previousSeat) {
					return 5;
				}
				return 4;
			});
			if (
				game.me == _status.firstAct.previous ||
				game.me == _status.firstAct.previous.previous
			) {
				game.me.chooseBool("是否置换手牌？");
				event.replaceCard = true;
			}
		} else if (_status.mode == "siguo") {
			_status.siguoai = [
				[-7.5, -2, 0, -4.5, -6, -7.5],
				[-7.5, -2, 0, -4.5, -6, -7.5],
				[-6, -6, -1, -4.5, -6, -7.5],
				[-6, -3, 0, -3, -3, -6],
				[-6, -3, 0, -3, -3, -6],
				[-6, -6, -6, -6, -6, -6],
			].randomGet();
			var firstChoose = _status.firstAct;
			game.gameDraw(firstChoose);
			game.phaseLoop(firstChoose);
		} else if (_status.mode == "jiange") {
			var firstAct;
			for (var i = 0; i < game.players.length; i++) {
				if (game.players[i].type == "mech" && game.players[i].group == "wei") {
					firstAct = game.players[i];
					break;
				}
			}
			_status.actlist = [
				firstAct,
				firstAct.next,
				firstAct.previous,
				firstAct.next.next,
				firstAct.previous.previous,
				firstAct.next.next.next,
				firstAct.previous.previous.previous,
				firstAct.next.next.next.next,
			];
			game.gameDraw(firstAct);
			game.phaseLoopJiange();
		} else if (_status.mode == "three") {
			var firstAct;
			if (_status.color) {
				firstAct = game.enemyZhu;
			} else {
				firstAct = game.friendZhu;
			}
			game.gameDraw(firstAct, 4);
			game.addGlobalSkill("autoswap");
			if (lib.config.show_handcardbutton) {
				ui.versushs = ui.create.system("手牌", null, true);
				lib.setPopped(ui.versushs, game.versusHoverHandcards, 220);
			}
			game.phaseLoopThree(firstAct);
		} else {
			var firstAct;
			if (lib.storage.zhu) {
				_status.currentSide = true;
				firstAct = _status.currentSide == game.me.side ? game.friendZhu : game.enemyZhu;
			} else {
				if (!lib.storage.cross_seat && !lib.storage.random_seat && lib.storage.number > 1) {
					for (var i = 0; i < game.players.length - 1; i++) {
						if (game.players[i].side != game.players[i + 1].side) {
							var actcount;
							if (Math.random() < 0.5) {
								actcount = i;
							} else {
								if (i >= lib.storage.number) {
									actcount = i - lib.storage.number;
								} else {
									actcount = i + lib.storage.number;
								}
							}
							if (actcount > 0) {
								actcount--;
							} else {
								actcount = game.players.length - 1;
							}
							firstAct = game.players[actcount];
							break;
						}
					}
				} else {
					firstAct = game.players[Math.floor(Math.random() * game.players.length)];
				}
			}
			game.gameDraw(firstAct, 4);
			_status.first_less = true;
			_status.round = 0;
			if (lib.storage.single_control) {
				game.addGlobalSkill("autoswap");
				if (game.players.length > 2 && lib.config.show_handcardbutton) {
					ui.versushs = ui.create.system("手牌", null, true);
					lib.setPopped(ui.versushs, game.versusHoverHandcards, 220);
				}
			}
			_status.enemyCount = ui.create.system("杀敌: " + get.cnNumber(0, true), null, true);
			_status.friendCount = ui.create.system("阵亡: " + get.cnNumber(0, true), null, true);

			lib.setPopped(_status.friendCount, game.versusHoverFriend);
			lib.setPopped(_status.enemyCount, game.versusHoverEnemy);

			if (lib.storage.zhu) {
				game.versusPhaseLoop(firstAct);
			} else {
				game.versusPhaseLoop(firstAct);
			}
		}
		if (_status.mode != "four") {
			event.finish();
		}
	}
	"step 4";//不会执行
	if (event.replaceCard && result.bool) {
		var hs = game.me.getCards("h");
		for (var i = 0; i < hs.length; i++) {
			hs[i].discard(false);
		}
		game.me.directgain(get.cards(hs.length));
	}
	if (_status.ladder) {
		lib.storage.ladder.current -= 40;
		_status.ladder_tmp = true;
		game.save("ladder", lib.storage.ladder);
		game.addGlobalSkill("versus_ladder");
	}
	game.phaseLoop(_status.firstAct);
}
*/

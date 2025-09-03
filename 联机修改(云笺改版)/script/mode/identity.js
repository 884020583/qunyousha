const { lib, game, ui, get, ai, _status } = suiSet
lib.mode.identity.connect.update = function (config, map) {
	const stratagemShowHide = config.connect_identity_mode == "stratagem" ? 'show' : 'hide'
	map.connect_round_one_use_fury[stratagemShowHide]()

	const switchMode = {
		zhong() {
			const hide = [
				'connect_limit_zhu', 'connect_enhance_zhu', 'connect_double_nei',
				'connect_enable_commoner', 'connect_special_identity',
				'connect_identit_toushi', 'connect_identity_AplayerLevel', 'connect_identity_playsLevel', 'connect_identity_tafangRound'
			]
			hide.forEach(i => map[i] && map[i].hide())

			const show = [
				'connect_enable_year_limit', 'connect_zhong_card', 'connect_double_character', 'connect_player_number'
			]
			show.forEach(i => map[i] && map[i].show())
		},
		stratagem() {
			const show = ['connect_double_character', 'connect_player_number', 'connect_enable_year_limit']
			show.forEach(i => map[i] && map[i].show())

			const hide = ['connect_limit_zhu', 'connect_enhance_zhu', 'connect_double_nei', 'connect_enable_commoner',
				'connect_zhong_card', 'connect_special_identity',
				'connect_identit_toushi', 'connect_identity_AplayerLevel', 'connect_identity_playsLevel', 'connect_identity_tafangRound'
			]
			hide.forEach(i => map[i] && map[i].hide())
		},
		purple() {
			const hide = [
				'connect_player_number', 'connect_limit_zhu', 'connect_enhance_zhu', 'connect_double_nei', 'connect_enable_commoner',
				'connect_enable_year_limit', 'connect_enable_year_limit', 'connect_zhong_card', 'connect_special_identity', 'connect_double_character',
				'connect_identit_toushi', 'connect_identity_AplayerLevel', 'connect_identity_playsLevel', 'connect_identity_tafangRound'
			]
			hide.forEach(i => map[i] && map[i].hide())
		},
		kangjin() {
			const hide = [
				'connect_identity_tafangRound'
			]

			const show = [
				'connect_double_character', 'connect_player_number', 'connect_limit_zhu',
				'connect_identit_toushi', 'connect_identity_AplayerLevel', 'connect_identity_playsLevel',
				// 'connect_enhance_zhu','connect_enable_year_limit'
			]
			hide.forEach(i => map[i].hide())
			show.forEach(i => map[i] && map[i].show())
		},
		ywzw() {
			const hide = [
				'connect_identity_tafangRound'
			]

			const show = [
				'connect_double_character', 'connect_player_number', 'connect_limit_zhu',
				'connect_identit_toushi', 'connect_identity_AplayerLevel', 'connect_identity_playsLevel',
				// 'connect_enhance_zhu','connect_enable_year_limit'
			]
			hide.forEach(i => map[i].hide())
			show.forEach(i => map[i] && map[i].show())
		},
		tafang() {
			const show = [
				'connect_player_number', 'connect_identity_mode', 'connect_identity_tafangRound'
			]
			for (const m in map) {
				if (show.includes(m)) {
					map[m].show()
				} else {
					map[m].hide()
				}
			}
		},
		default() {
			const hide = [
				'connect_identit_toushi', 'connect_identity_AplayerLevel', 'connect_identity_playsLevel', 'connect_identity_tafangRound'
			]

			const show = [
				'connect_double_character', 'connect_player_number', 'connect_limit_zhu',
				'connect_enhance_zhu', 'connect_enable_year_limit'
			]
			hide.forEach(i => map[i].hide())
			show.forEach(i => map[i] && map[i].show())
			map.connect_double_nei[config.connect_player_number != "2" && !config.connect_enable_commoner ? "show" : "hide"]();
			map.connect_enable_commoner[config.connect_player_number != "2" && !config.connect_double_nei ? "show" : "hide"]();
			map.connect_zhong_card.hide();

			const playerNumberShowHide = config.connect_player_number == "8" ? 'show' : 'hide'
			map.connect_special_identity[playerNumberShowHide]()
		}
	}
	switchMode[config.connect_identity_mode in switchMode ? config.connect_identity_mode : 'default']()
}
suiSet.modeConfig.identity = {
	chooseMode() {
		const mode = _status.mode.slice(0, 1).toUpperCase() + _status.mode.slice(1);
		if (typeof game['chooseCharacter' + mode + 'OL'] === 'function') {
			game['chooseCharacter' + mode + 'OL']()
			return;
		}
		const next = game.createEvent('chooseCharacter');
		next.set('mode', mode)
		if (lib.configOL.identity_Selects == 'dianjiang') {
			next.setContent(function () {
				"step 0"
				ui.arena.classList.add('choose-character');
				var i;
				var identityList;
				if (_status.mode == 'zhong') {
					event.zhongmode = true;
					identityList = ['zhu', 'zhong', 'mingzhong', 'nei', 'fan', 'fan', 'fan', 'fan'];
				}
				else {
					identityList = get.identityList(game.players.length);
					if (lib.configOL.double_nei) {
						switch (lib.configOL.number) {
							case 8:
								identityList.remove('fan');
								identityList.push('nei');
								break;
							case 7:
								identityList.remove('zhong');
								identityList.push('nei');
								break;
							case 6:
								identityList.remove('fan');
								identityList.push('nei');
								break;
							case 5:
								identityList.remove('fan');
								identityList.push('nei');
								break;
							case 4:
								identityList.remove('zhong');
								identityList.push('nei');
								break;
							case 3:
								identityList.remove('fan');
								identityList.push('nei');
								break;
						}
					}
				}
				identityList.randomSort();
				const OLset = {
					get: {
						connect_players: function () {
							const players = game.connectPlayers || game.players
							const playertrue = []
							const playersfalse = []
							players.forEach(p => {
								if (p.avatar || p.nickname) {
									playertrue.push(p)
								} else {
									playersfalse.push(p)
								}
							})
							return [playertrue, playersfalse]
						}
					}
				}
				const allplayer = OLset.get.connect_players()
				const plays = allplayer[0] //普通玩家
				const aplays = allplayer[1] //人机玩家,都人机了，还玩家？是不是有点怪？额。不管了
				_status.gplayer = {
					plays,
					aplays
				}

				if (lib.configOL.identity_mode == 'kangjin' && plays.length > 1 && plays.length < 6) {
					switch (plays.length) {
						case 2: {
							plays.forEach(element => {
								element.identity = 'zhong'
								element.setIdentity('cai')
								element.node.identity.classList.add('guessing')
							})
							let identitys = ['zhu', 'fan', 'fan', 'fan', 'fan', 'nei'].randomSort()
							for (let i = 0; i < aplays.length; i++) {
								aplays[i].identity = identitys[i]//也给它们设置一下身份
								aplays[i].setIdentity('cai')
								aplays[i].node.identity.classList.add('guessing')
								if (identitys[i] == 'zhu') {
									game.zhu = aplays[i]
								}
							}
							break
						}
						case 3: {
							let identitys = ['zhu', 'zhong', 'zhong'].randomSort() //就把主忠拿出来，打乱
							for (let i = 0; i < plays.length; i++) { //然后遍历一下玩家
								plays[i].identity = identitys[i]
								plays[i].setIdentity('cai')
								if (identitys[i] == 'zhu') {
									game.zhu = plays[i]
								}
								plays[i].node.identity.classList.add('guessing')
							} //随机设置身份
							if (game.players.length === 10) {
								aplays.forEach(a => {
									a.identity = 'fan' //也给它们设置一下身份
									a.setIdentity('cai')
									a.node.identity.classList.add('guessing')
								})
							} else {
								let identitys2 = ['fan', 'fan', 'fan', 'fan', 'nei'].randomSort() //再把剩下的反内拿出来，遍历一下
								for (let i = 0; i < aplays.length; i++) {
									aplays[i].identity = identitys2[i] //也给它们设置一下身份
									aplays[i].setIdentity('cai')
									aplays[i].node.identity.classList.add('guessing')
								}
							}
							break
						}
						case 4: {
							plays.forEach(element => {
								element.identity = 'fan'
								element.setIdentity('cai')
								element.node.identity.classList.add('guessing')
							});//那就遍历所有玩家，把他们都设置成反贼
							let identitys = ['zhu', 'zhong', 'zhong', 'nei'].randomSort()//然后把剩下的身份拿出来打乱
							for (let i = 0; i < aplays.length; i++) {//再遍历一下人机
								aplays[i].identity = identitys[i]//给它们也随机设置一个身份
								aplays[i].setIdentity('cai')
								if (identitys[i] == 'zhu') {
									game.zhu = aplays[i]
								}
								aplays[i].node.identity.classList.add('guessing')
							}
						}
						case 5: {
							plays.forEach(element => {
								element.identity = 'fan'
								element.setIdentity('cai')
								element.node.identity.classList.add('guessing')
							});//那就遍历所有玩家，把他们都设置成反贼
							let identitys = identityList.filter(i => {
								return i != 'fan'
							})
							identitys = identitys.randomSort()
							for (let i = 0; i < aplays.length; i++) {//再遍历一下人机
								aplays[i].identity = identitys[i]//给它们也随机设置一个身份
								aplays[i].setIdentity('cai')
								if (identitys[i] == 'zhu') {
									game.zhu = aplays[i]
								}
								aplays[i].node.identity.classList.add('guessing')
							}
						}
					}
				} else {
					for (i = 0; i < game.players.length; i++) {
						game.players[i].identity = identityList[i];
						game.players[i].setIdentity('cai');
						game.players[i].node.identity.classList.add('guessing');
						if (event.zhongmode) {
							if (identityList[i] == 'mingzhong') {
								game.zhu = game.players[i];
							} else if (identityList[i] == 'zhu') {
								game.zhu2 = game.players[i];
							}
						} else {
							if (identityList[i] == 'zhu') {
								game.zhu = game.players[i];
							}
						}
						game.players[i].identityShown = false;
					}
				}
				if (lib.configOL.special_identity && !event.zhongmode && game.players.length == 8) {
					var map = {};
					var zhongs = game.filterPlayer(function (current) {
						return current.identity == 'zhong';
					});
					var fans = game.filterPlayer(function (current) {
						return current.identity == 'fan';
					});
					if (fans.length >= 1) {
						map.identity_zeishou = fans.randomRemove();
					}
					if (zhongs.length > 1) {
						map.identity_dajiang = zhongs.randomRemove();
						map.identity_junshi = zhongs.randomRemove();
					}
					else if (zhongs.length == 1) {
						if (Math.random() < 0.5) {
							map.identity_dajiang = zhongs.randomRemove();
						}
						else {
							map.identity_junshi = zhongs.randomRemove();
						}
					}
					game.broadcastAll(function (zhu, map) {
						for (var i in map) {
							map[i].special_identity = i;
						}
					}, game.zhu, map);
					event.special_identity = map;
				}

				game.zhu.setIdentity();
				game.zhu.identityShown = true;
				game.zhu.isZhu = (game.zhu.identity == 'zhu');
				game.zhu.node.identity.classList.remove('guessing');
				game.me.setIdentity();
				game.me.node.identity.classList.remove('guessing');
				if (game.me.special_identity) {
					game.me.node.identity.firstChild.innerHTML = get.translation(game.me.special_identity + '_bg');
				}

				for (var i = 0; i < game.players.length; i++) {
					game.players[i].send(function (zhu, zhuid, me, identity) {
						for (var i in lib.playerOL) {
							lib.playerOL[i].setIdentity('cai');
							lib.playerOL[i].node.identity.classList.add('guessing');
						}
						zhu.identityShown = true;
						zhu.identity = zhuid;
						if (zhuid == 'zhu') zhu.isZhu = true;
						zhu.setIdentity();
						zhu.node.identity.classList.remove('guessing');
						me.setIdentity(identity);
						me.node.identity.classList.remove('guessing');
						if (me.special_identity) {
							me.node.identity.firstChild.innerHTML = get.translation(me.special_identity + '_bg');
						}
						ui.arena.classList.add('choose-character');
					}, game.zhu, game.zhu.identity, game.players[i], game.players[i].identity);
				}

				var list;
				var list2 = [];
				var list3 = [];
				var list4 = [];
				event.list = [];
				event.list2 = [];

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
						if (!libCharacter[ix[j]] || lib.filter.characterDisabled(ix[j])) ix.splice(j--, 1);
					}
					if (ix.length) {
						event.list.push(i);
						event.list2.push(i);
						list4.addArray(ix);
						var bool = false;
						for (var j of ix) {
							if (libCharacter[j][4] && libCharacter[j][4].includes('zhu')) {
								bool = true; break;
							}
						}
						(bool ? list2 : list3).push(i);
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
					if (list4.includes(i)) continue;
					if (lib.filter.characterDisabled(i, libCharacter)) continue;
					event.list.push(i);
					event.list2.push(i);
					list4.push(i);
					if (libCharacter[i][4] && libCharacter[i][4].includes('zhu')) {
						list2.push(i);
					}
					else {
						list3.push(i);
					}
				}
				_status.characterlist = list4.slice(0);
				game.broadcastAll(function (list, id) {
					_status.characterlist = list;
					var filter = function (name) {
						return !_status.characterlist.includes(name);
					};
					var dialog = ui.create.characterDialog('heightset', filter).open();//自由选将，选将框
					dialog.videoId = id;
					ui.arena.classList.add('choose-character');
				}, list4, event.videoId);
				game.zhu.chooseButton(true).set('ai', function (button) {
					return Math.random();
				}).set('dialog', event.videoId);
				"step 1"
				game.broadcastAll(function (player, character, id) {
					player.init(character);
					player.maxHp += 2
					player.hp += 2
					player.update()
					_status.characterlist.remove(character);
					if (player == game.me) game.addRecentCharacter(character);
				}, game.zhu, result.links[0]);
				if (game.zhu.group == 'shen' && !game.zhu.isUnseen(0)) {
					var grouplist = lib.group.filter(function (id) {
						return id != "shen";
					});
					for (var i = 0; i < grouplist.length; i++) {
						grouplist[i] = ['', '', 'group_' + grouplist[i]];
					}
					game.zhu.chooseButton(['请选择神武将的势力', [grouplist, 'vcard']], false).set('ai', function () {
						return Math.random();
					});
				} else if (get.is.double(game.zhu.name1)) {
					game.zhu._groupChosen = true;
					var grouplist = get.is.double(game.zhu.name1, true);
					for (var i = 0; i < grouplist.length; i++) {
						if (!lib.group.includes(grouplist[i])) grouplist.splice(i--, 1);
						else grouplist[i] = ['', '', 'group_' + grouplist[i]];
					}
					game.zhu.chooseButton(['请选择你的势力', [grouplist, 'vcard']], true).set('ai', function () {
						return Math.random();
					});
				} else event.goto(3);
				event.allPlayer = game.players.filter(i => {
					return i !== game.zhu
				});
				event.allPlayer = event.allPlayer.randomSort()
				event.chosoe = []
				"step 2"
				const name = result.links[0][2].slice(6);
				if (!lib.group.includes(name)) {
					lib.group.push(name)
				}
				game.zhu.changeGroup(name);
				"step 3"
				const thisplayer = event.allPlayer.shift()
				thisplayer.chooseButton(true).set('ai', function (button) {
					return Math.random();
				}).set('dialog', event.videoId);
				event.playera = thisplayer
				"step 4"
				event.chosoe.push([event.playera, result.links[0]])
				event.playera.group = lib.character[result.links[0]][1]
				game.broadcastAll(function (player, result) {
					if (player === game.me) {
						player.init(result.links[0]);
					}
				}, event.playera, result)
				if (event.playera.group === 'shen' && !event.playera.isUnseen(0)) {
					var grouplist = lib.group.filter(function (id) {
						return id != "shen";
					});
					grouplist.forEach((g, i) => {
						grouplist[i] = ['', '', 'group_' + grouplist[i]];
					})
					event.playera.chooseButton(['请选择神武将的势力', [grouplist, 'vcard']], false).set('ai', function () {
						return Math.random();
					});
				} else if (get.is.double(event.playera.name1)) {
					event.playera._groupChosen = true;
					const grouplist = get.is.double(event.playera.name1, true);
					grouplist.forEach((g, i) => {
						if (!lib.group.includes(g)) {
							grouplist.splice(i--, 1);
						} else {
							grouplist[i] = ['', '', 'group_' + grouplist[i]];
						}
					})
					event.playera.chooseButton(['请选择你的势力', [grouplist, 'vcard']], true).set('ai', function () {
						return Math.random();
					});
				} else {
					event.goto(6)
				}
				"step 5"
				const gname = result.links[0][2].slice(6);
				event.playera.ggroup = gname;
				if (!lib.group.includes(gname)) {
					lib.group.push(gname)
				}
				'step 6'
				if (event.allPlayer.length) {
					event.goto(3)
				}
				'step 7'
				game.broadcastAll('closeDialog', event.videoId);
				game.broadcastAll(function (playercharacter, id) {
					playercharacter.forEach(e => {
						e[0].init(e[1])
						e[0].changeGroup(e[0].ggroup)
						_status.characterlist.remove(e[1]);
						if (e[0] == game.me) game.addRecentCharacter(e[1]);
					})
					var dialog = get.idDialog(id);
					if (dialog) {
						dialog.close();
					}
					setTimeout(function () {
						ui.arena.classList.remove('choose-character');
					}, 500);
				}, event.chosoe, event.videoId);
				setTimeout(function () {
					if (lib.configOL.identity_AplayerLevel != 'no') {
						let anum = parseInt(lib.configOL.identity_AplayerLevel)
						_status.gplayer.aplays.forEach(a => {
							a.maxHp += anum
							a.hp += anum
							a.update()
						})
					}
					if (lib.configOL.identity_playsLevel != 'no') {
						let anum = parseInt(lib.configOL.identity_playsLevel)
						_status.gplayer.plays.forEach(a => {
							a.maxHp += anum
							a.hp += anum
							a.update()
						})
					}
					if (lib.configOL.identit_toushi) {
						_status.gplayer.plays.forEach(a => {
							a.addSkill('dcjinjing')
						})
					}
					ui.arena.classList.remove('choose-character');
				}, 500);
				_status.gplayer.plays.forEach(a => {
					a.addSkill('dcjinjing')
				})
			});
			return;
		} else {
			next.setContent(function () {
				"step 0"
				ui.arena.classList.add('choose-character');
				var i;
				let identityList;
				if (_status.mode == 'zhong') {
					event.zhongmode = true;
					identityList = ['zhu', 'zhong', 'mingzhong', 'nei', 'fan', 'fan', 'fan', 'fan'];
				} else {
					identityList = get.identityList(game.players.length);
					if (lib.configOL.double_nei) {
						switch (lib.configOL.number) {
							case 8:
								identityList.remove('fan');
								identityList.push('nei');
								break;
							case 7:
								identityList.remove('zhong');
								identityList.push('nei');
								break;
							case 6:
								identityList.remove('fan');
								identityList.push('nei');
								break;
							case 5:
								identityList.remove('fan');
								identityList.push('nei');
								break;
							case 4:
								identityList.remove('zhong');
								identityList.push('nei');
								break;
							case 3:
								identityList.remove('fan');
								identityList.push('nei');
								break;
						}
					}
				}
				const switchModeIdentity = {
					'4v4'() {
						identityList.remove('nei')
						identityList.push('zhong')
					},
					// 'Neimin'(){
					//     if(identityList.includes('commoner')){
					//         identityList.remove('nei')
					//         identityList.push('fan')
					//     }
					// }
				}
				const func = switchModeIdentity[event.mode]
				if (func) func()
				identityList.randomSort();
				const allplayer = suiSet.connect_players()
				const plays = allplayer[0] //普通玩家
				const aplays = allplayer[1] //人机玩家,都人机了，还玩家？是不是有点怪？额。不管了
				_status.gplayer = {
					plays,
					aplays
				}

				if (lib.configOL.identity_mode == 'kangjin' && plays.length > 1 && plays.length < 6) {
					switch (plays.length) {
						case 2: {
							plays.forEach(element => {
								element.identity = 'zhong'
								element.setIdentity('cai')
								element.node.identity.classList.add('guessing')
							})
							let identitys = ['zhu', 'fan', 'fan', 'fan', 'fan', 'nei'].randomSort()
							for (let i = 0; i < aplays.length; i++) {
								aplays[i].identity = identitys[i]//也给它们设置一下身份
								aplays[i].setIdentity('cai')
								aplays[i].node.identity.classList.add('guessing')
								if (identitys[i] == 'zhu') {
									game.zhu = aplays[i]
								}
							}
							break
						}
						case 3: {
							let identitys = ['zhu', 'zhong', 'zhong'].randomSort() //就把主忠拿出来，打乱
							for (let i = 0; i < plays.length; i++) { //然后遍历一下玩家
								plays[i].identity = identitys[i]
								plays[i].setIdentity('cai')
								if (identitys[i] == 'zhu') {
									game.zhu = plays[i]
								}
								plays[i].node.identity.classList.add('guessing')
							} //随机设置身份
							if (game.players.length === 10) {
								aplays.forEach(a => {
									a.identity = 'fan' //也给它们设置一下身份
									a.setIdentity('cai')
									a.node.identity.classList.add('guessing')
								})
							} else {
								let identitys2 = ['fan', 'fan', 'fan', 'fan', 'nei'].randomSort() //再把剩下的反内拿出来，遍历一下
								for (let i = 0; i < aplays.length; i++) {
									aplays[i].identity = identitys2[i] //也给它们设置一下身份
									aplays[i].setIdentity('cai')
									aplays[i].node.identity.classList.add('guessing')
								}
							}
							break
						}
						case 4: {
							plays.forEach(element => {
								element.identity = 'fan'
								element.setIdentity('cai')
								element.node.identity.classList.add('guessing')
							});//那就遍历所有玩家，把他们都设置成反贼
							let identitys = ['zhu', 'zhong', 'zhong', 'nei'].randomSort()//然后把剩下的身份拿出来打乱
							for (let i = 0; i < aplays.length; i++) {//再遍历一下人机
								aplays[i].identity = identitys[i]//给它们也随机设置一个身份
								aplays[i].setIdentity('cai')
								if (identitys[i] == 'zhu') {
									game.zhu = aplays[i]
								}
								aplays[i].node.identity.classList.add('guessing')
							}
						}
						case 5: {
							plays.forEach(element => {
								element.identity = 'fan'
								element.setIdentity('cai')
								element.node.identity.classList.add('guessing')
							});//那就遍历所有玩家，把他们都设置成反贼
							let identitys = identityList.filter(i => {
								return i != 'fan'
							})
							identitys = identitys.randomSort()
							for (let i = 0; i < aplays.length; i++) {//再遍历一下人机
								aplays[i].identity = identitys[i]//给它们也随机设置一个身份
								aplays[i].setIdentity('cai')
								if (identitys[i] == 'zhu') {
									game.zhu = aplays[i]
								}
								aplays[i].node.identity.classList.add('guessing')
							}
						}
					}
				} else {
					for (i = 0; i < game.players.length; i++) {
						game.players[i].identity = identityList[i];
						game.players[i].setIdentity('cai');
						game.players[i].node.identity.classList.add('guessing');
						if (event.zhongmode) {
							if (identityList[i] == 'mingzhong') {
								game.zhu = game.players[i];
							} else if (identityList[i] == 'zhu') {
								game.zhu2 = game.players[i];
							}
						} else {
							if (identityList[i] == 'zhu') {
								game.zhu = game.players[i];
							}
						}
						game.players[i].identityShown = false;
					}
				}
				if (lib.configOL.special_identity && !event.zhongmode && game.players.length == 8) {
					var map = {};
					var zhongs = game.filterPlayer(function (current) {
						return current.identity == 'zhong';
					});
					var fans = game.filterPlayer(function (current) {
						return current.identity == 'fan';
					});
					if (fans.length >= 1) {
						map.identity_zeishou = fans.randomRemove();
					}
					if (zhongs.length > 1) {
						map.identity_dajiang = zhongs.randomRemove();
						map.identity_junshi = zhongs.randomRemove();
					}
					else if (zhongs.length == 1) {
						if (Math.random() < 0.5) {
							map.identity_dajiang = zhongs.randomRemove();
						}
						else {
							map.identity_junshi = zhongs.randomRemove();
						}
					}
					game.broadcastAll(function (zhu, map) {
						for (var i in map) {
							map[i].special_identity = i;
						}
					}, game.zhu, map);
					event.special_identity = map;
				}

				game.zhu.setIdentity();
				game.zhu.identityShown = true;
				game.zhu.isZhu = (game.zhu.identity == 'zhu');
				game.zhu.node.identity.classList.remove('guessing');
				game.me.setIdentity();
				game.me.node.identity.classList.remove('guessing');
				if (game.me.special_identity) {
					game.me.node.identity.firstChild.innerHTML = get.translation(game.me.special_identity + '_bg');
				}

				for (var i = 0; i < game.players.length; i++) {
					game.players[i].send(function (zhu, zhuid, me, identity) {
						for (var i in lib.playerOL) {
							lib.playerOL[i].setIdentity('cai');
							lib.playerOL[i].node.identity.classList.add('guessing');
						}
						zhu.identityShown = true;
						zhu.identity = zhuid;
						if (zhuid == 'zhu') zhu.isZhu = true;
						zhu.setIdentity();
						zhu.node.identity.classList.remove('guessing');
						me.setIdentity(identity);
						me.node.identity.classList.remove('guessing');
						if (me.special_identity) {
							me.node.identity.firstChild.innerHTML = get.translation(me.special_identity + '_bg');
						}
						ui.arena.classList.add('choose-character');
					}, game.zhu, game.zhu.identity, game.players[i], game.players[i].identity);
				}

				var list;
				var list2 = [];
				var list3 = [];
				var list4 = [];
				event.list = [];
				event.list2 = [];

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
						if (!libCharacter[ix[j]] || lib.filter.characterDisabled(ix[j])) ix.splice(j--, 1);
					}
					if (ix.length) {
						event.list.push(i);
						event.list2.push(i);
						list4.addArray(ix);
						var bool = false;
						for (var j of ix) {
							if (libCharacter[j][4] && libCharacter[j][4].includes('zhu')) {
								bool = true; break;
							}
						}
						(bool ? list2 : list3).push(i);
					}
				}
				game.broadcast(function (list) {
					for (var i in lib.characterReplace) {
						var ix = lib.characterReplace[i];
						for (var j = 0; j < ix.length; j++) {
							if (!list.includes(ix[j])) ix.splice(j--, 1);
						}
					}
					_status.characterlist = list
				}, list4);
				for (i in libCharacter) {
					if (list4.includes(i)) continue;
					if (lib.filter.characterDisabled(i, libCharacter)) continue;
					event.list.push(i);
					event.list2.push(i);
					list4.push(i);
					if (libCharacter[i][4] && libCharacter[i][4].includes('zhu')) {
						list2.push(i);
					}
					else {
						list3.push(i);
					}
				}
				_status.characterlist = list4.slice(0);
				if (lib.configOL.identity_Selects == 'no1') {
					let finalNum = 5;
					if (lib.configOL.unbalanced_mode) finalNum = 12;
					var getZhuList = function (list2) {
						var limit_zhu = lib.configOL.limit_zhu;
						if (!limit_zhu || limit_zhu == 'off') return list2.slice(0).sort(lib.sort.character);
						if (limit_zhu != 'group') {
							var num = (parseInt(limit_zhu) || 6);
							return list2.randomGets(num).sort(lib.sort.character);
						}
						var getGroup = function (name) {
							if (lib.characterReplace[name]) return lib.character[lib.characterReplace[name][0]][1];
							return lib.character[name][1];
						}
						var list2x = list2.slice(0);
						list2x.randomSort();
						for (var i = 0; i < list2x.length; i++) {
							for (var j = i + 1; j < list2x.length; j++) {
								if (getGroup(list2x[i]) == getGroup(list2x[j])) {
									list2x.splice(j--, 1);
								}
							}
						}
						list2x.sort(lib.sort.character);
						return list2x;
					}
					list = getZhuList(list2).concat(list3.randomGets(finalNum));
				} else {
					let finalNum = 11;
					if (lib.configOL.identity_Selects == '11') {
						if (_status.gplayer.aplays.includes(game.zhu)) {
							suiSet.onlineSelectNum = 1//Math.floor(event.list.length/game.players.length)
						} else {
							suiSet.onlineSelectNum = Math.floor(event.list.length / _status.gplayer.plays.length)
						}
						// suiSet.onlineSelectNum = Math.floor(event.list.length/game.players.length)
					} else {
						suiSet.onlineSelectNum = parseInt(lib.configOL.identity_Selects) || 6
					}
					if (_status.gplayer.plays.length === 1) {
						suiSet.onlineSelectNum -= game.players.length - 1
					}
					finalNum = suiSet.onlineSelectNum
					if (lib.configOL.unbalanced_mode) finalNum = 12;
					var getZhuList = function (list2) {
						var limit_zhu = lib.configOL.limit_zhu;
						if (!limit_zhu || limit_zhu == 'off') return list2.slice(0).sort(lib.sort.character);
						if (limit_zhu != 'group') {
							var num = (parseInt(limit_zhu) || 6);
							return list2.randomGets(num).sort(lib.sort.character);
						}
						var getGroup = function (name) {
							if (lib.characterReplace[name]) return lib.character[lib.characterReplace[name][0]][1];
							return lib.character[name][1];
						}
						var list2x = list2.slice(0);
						list2x.randomSort();
						for (var i = 0; i < list2x.length; i++) {
							for (var j = i + 1; j < list2x.length; j++) {
								if (getGroup(list2x[i]) == getGroup(list2x[j])) {
									list2x.splice(j--, 1);
								}
							}
						}
						list2x.sort(lib.sort.character);
						return list2x;
					}
					list = getZhuList(list2).concat(list3.randomGets(finalNum));
				}
				if (event.zhongmode) {
					list = event.list.randomGets(8);
				}
				event.useTime = lib.configOL.choose_timeout
				event.chooseTime = lib.configOL.identity_more_time
				game.broadcastAll((num) => {
					lib.configOL.choose_timeout = Number(num)
				}, event.chooseTime)
				var next = game.zhu.chooseButton(true);
				next.set('selectButton', (lib.configOL.double_character ? 2 : 1));
				next.set('createDialog', ['选择角色', [list, 'characterx']]);
				next.set('ai', function (button) {
					return Math.random();
				});
				"step 1"
				if (!game.zhu.name) {
					game.zhu.init(result.links[0], result.links[1])
				}
				event.list.remove(get.sourceCharacter(game.zhu.name1));
				event.list.remove(get.sourceCharacter(game.zhu.name2));
				event.list2.remove(get.sourceCharacter(game.zhu.name1));
				event.list2.remove(get.sourceCharacter(game.zhu.name2));

				if (game.players.length > 4) {
					if (!game.zhu.isInitFilter('noZhuHp')) {
						game.zhu.maxHp++;
						game.zhu.hp++;
						game.zhu.update();
					}
				}
				game.broadcast(function (zhu, name, name2, addMaxHp) {
					if (!zhu.name) {
						zhu.init(name, name2);
					}
					if (addMaxHp) {
						zhu.maxHp++;
						zhu.hp++;
						zhu.update();
					}
				}, game.zhu, result.links[0], result.links[1], game.players.length > 4);

				if (game.zhu.group == 'shen' && !game.zhu.isUnseen(0)) {
					var list = lib.group.filter(function (id) {
						return id != "shen";
					});
					for (var i = 0; i < list.length; i++) {
						if (!lib.group.includes(list[i])) list.splice(i--, 1);
						else list[i] = ['', '', 'group_' + list[i]];
					}
					game.zhu.chooseButton(['请选择神武将的势力', [list, 'vcard']], true).set('ai', function () {
						return Math.random();
					});
				}
				else if (get.is.double(game.zhu.name1)) {
					game.zhu._groupChosen = true;
					var list = get.is.double(game.zhu.name1, true);
					for (var i = 0; i < list.length; i++) {
						if (!lib.group.includes(list[i])) list.splice(i--, 1);
						else list[i] = ['', '', 'group_' + list[i]];
					}
					game.zhu.chooseButton(['请选择你的势力', [list, 'vcard']], true).set('ai', function () {
						return Math.random();
					});
				}
				else event.goto(3);
				"step 2"
				var name = result.links[0][2].slice(6);
				game.zhu.changeGroup(name);
				"step 3"
				var list = [];
				var selectButton = (lib.configOL.double_character ? 2 : 1);

				var num, num2 = 0;
				if (event.zhongmode) {
					num = 6;
				}
				else {
					num = Math.floor(event.list.length / (game.players.length - 1));
					if (num > 5) {
						num = 5;
					}
					num2 = event.list.length - num * (game.players.length - 1);
					if (lib.configOL.double_nei) {
						num2 = Math.floor(num2 / 2);
					}
					if (num2 > 2) {
						num2 = 2;
					}
				}
				for (var i = 0; i < game.players.length; i++) {
					if (lib.configOL.identity_Selects == '11') {
						if (_status.gplayer.aplays.includes(game.players[i])) {
							suiSet.onlineSelectNum = 1
						} else {
							suiSet.onlineSelectNum = Math.floor(event.list.length / _status.gplayer.plays.length)
						}
						if (_status.gplayer.plays.length === 1) {
							suiSet.onlineSelectNum -= game.players.length - 1
						}
					} else {
						suiSet.onlineSelectNum = parseInt(lib.configOL.identity_Selects) || 6
					}
					if (game.players[i] != game.zhu) {
						var num3 = 0;
						if (event.zhongmode) {
							if (game.players[i].identity == 'nei' || game.players[i].identity == 'zhu') {
								num3 = 2;
							}
						}
						else {
							if (game.players[i].identity == 'nei') {
								num3 = num2;
							}
						}
						var str = '选择角色';
						if (game.players[i].special_identity) {
							str += '（' + get.translation(game.players[i].special_identity) + '）';
						}
						let numFinal = num + num3;
						if (lib.configOL.unbalanced_mode && !event.zhongmode) {
							switch (game.players[i].identity) {
								case 'zhu': case 'zhong': case 'fan': numFinal = 12; break;
								case 'nei': numFinal = 20; break;
							}
						}
						if (lib.configOL.identity_mode == 'kangjin' && _status.gplayer.plays.length > 1 && _status.gplayer.plays.length < 6) {
							str = '<span style="color:red;font-size:1.5em;">本房为玩家打人机模式，所有玩家都是队友</span>'
						}
						if (suiSet.onlineSelectNum) {
							list.push([game.players[i],
							[str, [event.list.randomRemove(suiSet.onlineSelectNum), 'characterx']], selectButton, true
							]);
						} else {
							list.push([game.players[i],
							[str, [event.list.randomRemove(numFinal), 'characterx']], selectButton, true
							]);
						}
					}
				}
				game.me.chooseButtonOL(list, function (player, result) {
					if (game.online || player == game.me) player.init(result.links[0], result.links[1]);
				});
				"step 4"
				game.broadcastAll((num) => {
					lib.configOL.choose_timeout = Number(num)
				}, event.useTime)
				var shen = [];
				for (var i in result) {
					if (result[i] && result[i].links) {
						for (var j = 0; j < result[i].links.length; j++) {
							event.list2.remove(get.sourceCharacter(result[i].links[j]));
						}
					}
				}
				for (var i in result) {
					if (result[i] == 'ai') {
						result[i] = event.list2.randomRemove(lib.configOL.double_character ? 2 : 1);
						for (var j = 0; j < result[i].length; j++) {
							var listx = lib.characterReplace[result[i][j]];
							if (listx && listx.length) result[i][j] = listx.randomGet();
						}
					}
					else {
						result[i] = result[i].links;
					}
					if (get.is.double(result[i][0]) ||
						lib.character[result[i][0]] && lib.character[result[i][0]][1] == 'shen' && !lib.character[result[i][0]][4].includes('hiddenSkill')) shen.push(lib.playerOL[i]);
				}
				event.result2 = result;
				if (shen.length) {
					// var list = ['wei', 'shu', 'wu', 'qun', 'jin'];
					var list = lib.group.filter(function (id) {
						return id != "shen";
					});
					for (var i = 0; i < list.length; i++) {
						if (!lib.group.includes(list[i])) list.splice(i--, 1);
						else list[i] = ['', '', 'group_' + list[i]];
					}
					for (var i = 0; i < shen.length; i++) {
						if (get.is.double(result[shen[i].playerid][0])) {
							shen[i]._groupChosen = true;
							shen[i] = [shen[i], ['请选择你的势力', [get.is.double(result[shen[i].playerid][0], true).map(function (i) {
								return ['', '', 'group_' + i];
							}), 'vcard']], 1, true];
						}
						else shen[i] = [shen[i], ['请选择神武将的势力', [list, 'vcard']], 1, true];
					}
					game.me.chooseButtonOL(shen, function (player, result) {
						if (player == game.me) player.changeGroup(result.links[0][2].slice(6), true, true);
					}).set('switchToAuto', function () {
						_status.event.result = 'ai';
					}).set('processAI', function () {
						return {
							bool: true,
							links: [_status.event.dialog.buttons.randomGet().link],
						}
					});
				}
				else event._result = {};
				"step 5"
				if (!result) result = {};
				for (var i in result) {
					if (result[i] && result[i].links) result[i] = result[i].links[0][2].slice(6);
					else if (result[i] == 'ai') result[i] = function () {
						var player = lib.playerOL[i];
						var list = ['wei', 'shu', 'wu', 'qun', 'jin'];
						for (var ix = 0; ix < list.length; ix++) {
							if (!lib.group.includes(list[ix])) list.splice(ix--, 1);
						}
						if (_status.mode != 'zhong' && game.zhu && game.zhu.group) {
							if (['re_zhangjiao', 'liubei', 're_liubei', 'caocao', 're_caocao', 'sunquan', 're_sunquan', 'zhangjiao', 'sp_zhangjiao', 'caopi', 're_caopi', 'liuchen', 'caorui', 'sunliang', 'sunxiu', 'sunce', 're_sunben', 'ol_liushan', 're_liushan', 'key_akane', 'dongzhuo', 're_dongzhuo', 'ol_dongzhuo', 'jin_simashi', 'caomao'].includes(game.zhu.name)) return game.zhu.group;
							if (game.zhu.name == 'yl_yuanshu') {
								if (player.identity == 'zhong') list.remove('qun');
								else return 'qun';
							}
							if (['sunhao', 'xin_yuanshao', 're_yuanshao', 're_sunce', 'ol_yuanshao', 'yuanshu', 'jin_simazhao', 'liubian'].includes(game.zhu.name)) {
								if (player.identity != 'zhong') list.remove(game.zhu.group);
								else return game.zhu.group;
							}
						}
						return list.randomGet();
					}();
				}
				var result2 = event.result2;
				game.broadcast(function (result, result2) {
					for (var i in result) {
						if (!lib.playerOL[i].name) {
							lib.playerOL[i].init(result[i][0], result[i][1]);
						}
						if (result2[i] && result2[i].length) lib.playerOL[i].changeGroup(result2[i], false, false);
					}
					setTimeout(function () {
						ui.arena.classList.remove('choose-character');
					}, 500);
				}, result2, result);

				for (var i in result2) {
					if (!lib.playerOL[i].name) {
						lib.playerOL[i].init(result2[i][0], result2[i][1]);
					}
					if (result[i] && result[i].length) lib.playerOL[i].changeGroup(result[i], false, false);
				}

				if (event.special_identity) {
					for (var i in event.special_identity) {
						game.zhu.addSkill(i);
					}
				}
				for (var i = 0; i < game.players.length; i++) {
					_status.characterlist.remove(game.players[i].name);
					_status.characterlist.remove(game.players[i].name1);
					_status.characterlist.remove(game.players[i].name2);
				}
				//修改开始
				setTimeout(function () {
					if (lib.configOL.identity_AplayerLevel != 'no') {
						let anum = parseInt(lib.configOL.identity_AplayerLevel)
						_status.gplayer.aplays.forEach(a => {
							a.maxHp += anum
							a.hp += anum
							a.update()
						})
					}
					if (lib.configOL.identity_playsLevel != 'no') {
						let anum = parseInt(lib.configOL.identity_playsLevel)
						_status.gplayer.plays.forEach(a => {
							a.maxHp += anum
							a.hp += anum
							a.update()
						})
					}
					if (lib.configOL.identit_toushi) {
						_status.gplayer.plays.forEach(a => {
							a.addSkill('dcjinjing')
						})
					}
					ui.arena.classList.remove('choose-character');
				}, 500);
				//结束
			});
		}
	},
	setPlayersIdentity(identityList, func) {
		if (func) {
			func(identityList)
		} else {
			game.players.forEach((p, i) => {
				p.identity = identityList[i]
				p.setIdentity('cai')
				p.node.identity.classList.add('guessing')
				if (identityList[i] === 'zhu') game.zhu = p
			})
		}
		game.zhu.showIdentity()
		game.zhu.identityShown = true;
		game.zhu.isZhu = (game.zhu.identity === 'zhu');
		game.zhu.node.identity.classList.remove('guessing');
		game.me.setIdentity();
		game.me.node.identity.classList.remove('guessing');
		game.players.forEach(p => {
			p.send((zhu, zhuid, me, identity) => {
				for (const i in lib.playerOL) {
					lib.playerOL[i].setIdentity('cai')
					lib.playerOL[i].node.identity.classList.add('guessing');
				}
				zhu.identityShown = true;
				zhu.identity = zhuid;
				if (zhuid == 'zhu') zhu.isZhu = true;
				zhu.setIdentity();
				zhu.node.identity.classList.remove('guessing');
				me.setIdentity(identity);
				me.node.identity.classList.remove('guessing');
				ui.arena.classList.add('choose-character');
			}, game.zhu, game.zhu.identity, p, p.identity)
		})
	},
	modeConfig() {
		game.chooseCharacterWhlwOL = function () {
			const next = game.createEvent('chooseCharacter')
			const Player = {
				dieAfter(source) {
					this.$dieAfter(source)
					game.checkResult();
					if (source) {
						let num = 1
						if (_status.whlwevent === 'zhongshang') {
							num = 2
						}
						if (source.draw) {
							source.draw(3 * num)
						}
						if (source.gainMaxHp) {
							source.gainMaxHp(1 * num);
						}
					}
				},
				$dieAfter() {
					if (_status.video) return;
					if (!this.node.dieidentity) {
						const str = get.translation(this.identity) + '阵亡';
						const node = ui.create.div('.damage.dieidentity', str, this)
						node.style.fontSize = '40px';
						ui.refresh(node);
						node.style.opacity = 1;
						this.node.dieidentity = node;
					}
					const trans = this.style.transform;
					if (trans) {
						if (trans.indexOf('rotateY') != -1) {
							this.node.dieidentity.style.transform = 'rotateY(180deg)';
						}
						else if (trans.indexOf('rotateX') != -1) {
							this.node.dieidentity.style.transform = 'rotateX(180deg)';
						}
						else {
							this.node.dieidentity.style.transform = '';
						}
					}
					else {
						this.node.dieidentity.style.transform = '';
					}

				}
			}
			const Skills = {

			}
			for (const p in Player) lib.element.player[p] = Player[p]
			next.setContent(async event => {
				const { list, list2, list3, list4 } = suiSet.getSelecList()
				game.broadcastAll(list => _status.characterlist = list, list)
				ui.arena.classList.add('choose-character');
				event.list = list
				event.list2 = list2
				event.list3 = list3
				event.list4 = list4
				game.broadcastAll(() => {
					const style = document.createElement('style')
					style.innerHTML =
						`
                    .player:not([data-position="0"]) .showSeatNum {
                        bottom: -15%;
                        width: 100%;
                        text-align: center;
                    }
                    .player[data-position="0"] .showSeatNum {
                        top: -20%;
                        left: 5%;
                        width: fit-content;
                        height: fit-content;
                    }
                    `
					document.head.appendChild(style)
				})
				let first = game.players.randomGet()
				game.zhu = first
				let s = 1
				while (!first.next.seatNum || !first.seatNum) {
					first.identity = '参与者'
					first.seatNum = s
					first.setSeatNum(s)
					first.node.showSeatNum = ui.create.div('.showSeatNum', `${get.cnNumber(s, true)}号位`, first)
					first = first.next
					s++
				}
				game.checkResult = () => {
					switch (game.players.length) {
						case 1: game.over(game.me.isIn()); break;
						case 2: {
							if (game.me.isIn()) {
								ui.create.system('投降', function () {
									game.log(game.me, '投降');
									game.over(false);
								}, true);
							}
							break;
						}
						default: return; break;
					}
				};

				const chooseList = []
				const num = suiSet.getSelect(list)
				const selectButton = (lib.configOL.double_character ? 2 : 1);
				game.players.forEach(p => {
					const str = `你是${p.seatNum}号位，请选择武将`
					chooseList.push([p, [str, [list.randomRemove(num), 'characterx']], selectButton, true]);
				})
				const { result } = await game.me.chooseButtonOL(chooseList, function (player, result) {
					if (game.online || player == game.me) player.init(result.links[0], result.links[1]);
				})
				const shen = []
				for (const i in result) {
					if (result[i] && result[i].links) {
						for (var j = 0; j < result[i].links.length; j++) {
							event.list2.remove(get.sourceCharacter(result[i].links[j]));
						}
					}
				}
				for (const i in result) {
					if (result[i] == 'ai') {
						result[i] = event.list2.randomRemove(lib.configOL.double_character ? 2 : 1);
						for (var j = 0; j < result[i].length; j++) {
							var listx = lib.characterReplace[result[i][j]];
							if (listx && listx.length) result[i][j] = listx.randomGet();
						}
					}
					else {
						result[i] = result[i].links;
					}
					if (get.is.double(result[i][0]) ||
						lib.character[result[i][0]] && lib.character[result[i][0]][1] == 'shen' && !lib.character[result[i][0]][4].includes('hiddenSkill')) shen.push(lib.playerOL[i]);
				}
				event.result2 = result

				let chooseGroup = {}
				if (shen.length) {
					const list = lib.group.filter(function (id) {
						return id != "shen";
					});
					for (let i = 0; i < list.length; i++) {
						if (!lib.group.includes(list[i])) list.splice(i--, 1);
						else list[i] = ['', '', 'group_' + list[i]];
					}
					for (let i = 0; i < shen.length; i++) {
						if (get.is.double(result[shen[i].playerid][0])) {
							shen[i]._groupChosen = true;
							shen[i] = [shen[i], ['请选择你的势力', [get.is.double(result[shen[i].playerid][0], true).map(function (i) {
								return ['', '', 'group_' + i];
							}), 'vcard']], 1, true];
						}
						else shen[i] = [shen[i], ['请选择神武将的势力', [list, 'vcard']], 1, true];
					}
					chooseGroup = await game.me.chooseButtonOL(shen, function (player, result) {
						if (player == game.me) player.changeGroup(result.links[0][2].slice(6), false, false);
					}).set('switchToAuto', function () {
						_status.event.result = 'ai';
					}).set('processAI', function () {
						return {
							bool: true,
							links: [_status.event.dialog.buttons.randomGet().link],
						}
					});
				}
				else event._result = {};
				if (!chooseGroup.result) {
					chooseGroup.result = {}
				}

				const { result: groupResult } = chooseGroup
				for (const i in groupResult) {
					if (groupResult[i] && groupResult[i].links) groupResult[i] = groupResult[i].links[0][2].slice(6);
					else if (groupResult[i] == 'ai') groupResult[i] = function () {
						const player = lib.playerOL[i];
						const list = ['wei', 'shu', 'wu', 'qun', 'jin'];
						for (let ix = 0; ix < list.length; ix++) {
							if (!lib.group.includes(list[ix])) list.splice(ix--, 1);
						}
						if (_status.mode != 'zhong' && game.zhu && game.zhu.group) {
							if (['re_zhangjiao', 'liubei', 're_liubei', 'caocao', 're_caocao', 'sunquan', 're_sunquan', 'zhangjiao', 'sp_zhangjiao', 'caopi', 're_caopi', 'liuchen', 'caorui', 'sunliang', 'sunxiu', 'sunce', 're_sunben', 'ol_liushan', 're_liushan', 'key_akane', 'dongzhuo', 're_dongzhuo', 'ol_dongzhuo', 'jin_simashi', 'caomao'].includes(game.zhu.name)) return game.zhu.group;
							if (game.zhu.name == 'yl_yuanshu') {
								if (player.identity == 'zhong') list.remove('qun');
								else return 'qun';
							}
							if (['sunhao', 'xin_yuanshao', 're_yuanshao', 're_sunce', 'ol_yuanshao', 'yuanshu', 'jin_simazhao', 'liubian'].includes(game.zhu.name)) {
								if (player.identity != 'zhong') list.remove(game.zhu.group);
								else return game.zhu.group;
							}
						}
						return list.randomGet();
					}();
				}
				const { result2 } = event
				game.broadcast(function (result, result2) {
					for (const i in result) {
						if (!lib.playerOL[i].name) {
							lib.playerOL[i].init(result[i][0], result[i][1]);
						}
						if (result2[i] && result2[i].length) lib.playerOL[i].changeGroup(result2[i], false, false);
					}
					setTimeout(function () {
						ui.arena.classList.remove('choose-character');
					}, 500);
				}, result2, groupResult);

				for (const i in result2) {
					if (!lib.playerOL[i].name) {
						lib.playerOL[i].init(result2[i][0], result2[i][1]);
					}
					if (groupResult[i] && groupResult[i].length) lib.playerOL[i].changeGroup(groupResult[i], false, false);
				}

				game.players.forEach(p => {
					const { name, name1, name2 } = p
					_status.characterlist.remove(name, name1, name2)
				})
				setTimeout(function () {
					ui.arena.classList.remove('choose-character');
				}, 500);
			})
		}

		game.chooseCharacterWechatOL = function () {
			_status.weChat = true
			_status.videoInited = true
			game.broadcast((vcardx) => {
				ui.create.buttonPresets.vcardx = vcardx
			}, suiSet.vcardx)
			lib.skillReplace = {}
			const initPlayers = game.players.map(p => {
				if (p.ws || p === game.me) {
					let avatar
					let nickname
					if (p === game.me) {
						avatar = lib.config.connect_avatar
						nickname = lib.config.connect_nickname
					} else {
						avatar = p.ws.avatar
						nickname = p.nickname
					}
					game.addVideo('initAvatar', null, { avatar, nickname, playerid: p.playerid })
					return [p.playerid, avatar, nickname]
				}
			}).filter(Boolean)
			game.broadcastAll((players) => {
				players = players.map(p => [lib.playerOL[p[0]], p[1], p[2]])
				ui.arena.classList.add('choose-character');
				players.forEach(([player, avatar, name]) => {
					name = name.replace('※', '')
					const id = name + player.playerid
					let { 0: sex, 1: group, 2: hp, 3: skills, 4: fromTrash, 5: extraModeData } = lib.character[avatar]
					if (!fromTrash) fromTrash = [`character:${avatar}`]
					else fromTrash.push(`character:${avatar}`)
					lib.character[id] = new lib.element.Character([sex, group, hp, skills, fromTrash, extraModeData])
					lib.translate[id] = name
					player.init(id)
					player.update()
				})
			}, initPlayers)
			const next = game.createEvent('chooseCharacter')
			_status.characterListSelect = Object.keys(suiSet.initList(() => { }));
			next.setContent(() => {
				'step 0'
				// const cards = suiSet.getCardPileSkills().filter(c=>c+"_skill" in lib.skill&&lib.skill[c+"_skill"].equipSkill)
				const characterList = _status.characterListSelect
				lib.playerSkillOL = {}
				lib.playerCharacterOL = {}
				_status.playerCharacters = {}
				_status.style = {
					innerHTML:/*css*/`
                    .player .playerskillList {
                        color: orange;
                        font-weight: 700;
                        text-shadow: 1px 1px black;
                        z-index: 90000000;
                    }
                    .player:not([data-position="0"]) .playerskillList {
                        width: 70px;
                        height: auto;
                        top: 35%;
                        border-radius: 5px;
                        text-align: center;
                        line-height: 2;
                        left: 20%;
                        padding: 0 10px;
                        font-size: 15px;
                    }
                    .player[data-position="0"] .playerskillList {
                        top: -30px;
                        left: 15px;
                    }
                `
				}
				let identityList = get.identityList(game.players.length);
				identityList = identityList.randomSort()

				game.zhu = game.players.randomGet()
				suiSet.setPlayersSeat(game.zhu)
				identityList = identityList.remove('zhu')//.remove('nei')
				// identityList.push('zhong')
				const anothplayers = game.players.filter(p => p != game.zhu)
				anothplayers.forEach((p, i) => {
					game.broadcastAll((p, id) => {
						const me = p === game.me
						p.setIdentity(me ? id : 'cai')
						p.node.identity.classList.add(me ? id : 'guessing')
						p.identity = id
					}, p, identityList[i])
				})
				game.broadcastAll((list, innerHTML) => {
					const style = document.createElement('style')
					style.innerHTML = innerHTML
					document.head.appendChild(style)
					game.players.forEach((p, i) => {
						p.node.rightskillList = ui.create.div('.playerskillList', p)
						if (!p.nickname) {//||(p.ws&&!p.isOnline2())
							lib.character[list[i]][3] = []
							lib.character[list[i]][2] = 4
							p.init(list[i])
						}
					})
					game.me.update()
				}, characterList.randomGets(10), _status.style.innerHTML)

				game.addVideo('init', null, game.players.map(p => {
					return {
						name: p.name1,
						name2: p.name2,
						identity: (p === game.me || p === game.zhu) ? p.identity : 'cai'
					}
				}))
				game.addVideo('addStyle', null, {
					style: _status.style, globalSkills: {
						playerchangeSkill: lib.skill.playerchangeSkill,
						PVPaozhan: lib.skill.PVPaozhan
					}
				})

				let num = suiSet.getSelect(characterList)
				event.list = characterList
				_status.characterlist = characterList.slice()
				const map = {}

				_status.skillMap = {}
				const skillList = []
				_status.zhuSkills = {}
				suiSet.getSkillMapOfCharacter(characterList, (skill, name) => {
					const translate = lib.translate[skill]
					if (!lib.skillReplace[translate]) {
						lib.skillReplace[translate] = []
						skillList.push({ skill, name })
					}
					const group = lib.character[name].group
					const theSkill = lib.skill[skill]
					if (theSkill && theSkill.zhuSkill) {
						if (group in _status.zhuSkills) {
							_status.zhuSkills[group].push(skill)
						} else {
							_status.zhuSkills[group] = []
						}
					}
					if (!theSkill.zhuSkill) {
						lib.skillReplace[translate].add(skill)
					}
					_status.skillMap[skill] = name
				})
				game.broadcast((translates) => {
					lib.skillReplace = translates
				}, lib.skillReplace)


				game.broadcastAll((map) => {
					_status.skillMap = map
					for (const m in map) {
						if (m.includes('_skill')) {
							lib.card[m] = {
								fullimage: true,
								cardimage: m.slice(0, -6)
							}
							lib.translate[m + "_info"] = lib.translate[m.slice(0, -6) + "_info"]
						} else {
							lib.card[m] = {
								fullimage: true,
								image: 'character:' + map[m]
							}
						}
					}
				}, _status.skillMap)
				// cards.forEach(c=>{
				//     const info = lib.skill[c+"_skill"]
				//     if(!info) return;
				//     skillList.push({ skill: c+"_skill", name: c })
				//     skillList2.push(c+"_skill")
				// })
				game.players.forEach(p => {
					if (!lib.playerCharacterOL[p.playerid]) {
						lib.playerCharacterOL[p.playerid] = []
					}
					if (p.identity === 'nei') {
						num += Math.floor(num * 0.3)
					}
					const skills = skillList.randomRemove(num)
					if (!map[p.playerid]) map[p.playerid] = {}
					skills.forEach(({ skill, name }) => {
						map[p.playerid][skill] = name
						if (skill.includes("_skill")) return
						lib.playerCharacterOL[p.playerid].add(name)
					})
				})
				game.broadcastAll((target) => {
					target.setIdentity('zhu')
					target.identity = 'zhu'
					target.showIdentity();
					target.isZhu = true;
					target.seatNum = 1
					target.identityShown = true;
					game.zhu = target
					// target.maxHp++
					// target.hp++
				}, game.zhu)
				event.map = map;
				ui.arena.classList.add('choose-character');
				event.videoId = lib.status.videoId++;
				event.chooseTime = lib.configOL.choose_timeout
				game.broadcastAll((map, id, time) => {
					lib.configOL.choose_timeout = time
					let str = ''
					if (game.me !== game.zhu) {
						str = '请等待主公选将<br>'
					} else {
						str = '本局你是主公，请先选择两个技能<br>'
					}
					const list = Object.keys(map[game.me.playerid])
					const dialog = ui.create.dialog(`${str}你的技能框↓<br>注意看武将旁边的技能而不是武将原画`, [list, 'vcardx'])
					dialog.videoId = id;
					dialog.classList.add('chooseSkills')
				}, map, event.videoId, lib.configOL.identity_more_time);
				game.addVideo('characterMap', null, {
					playerMap: map,
					map: _status.skillMap,
					replace: lib.skillReplace,
					ids: game.players.map(p => p.playerid),
					id: event.videoId,
					nicknames: game.players.map(p => p.nickname)
				})
				if (event.target != game.me || !event.target.isOnline()) game.delay(2);
				'step 1'
				const next = game.zhu.chooseButton(true).set('ai', Math.random)
				next.set('selectButton', 2);
				'step 2'
				const skills = result.links.map(p => p[2])
				const players = game.players.filter(p => p !== game.zhu)
				game.broadcastAll((target, players, skills) => {
					game.zhu.addSkill(skills)
					lib.character[game.zhu.name1].skills = skills
					let str = ''
					skills.forEach(s => str += get.translation(s) + ' ')
					target.node.rightskillList.innerHTML = str

					game.players.forEach(p => {
						const { x } = p.getBoundingClientRect()
						if (ui.window.clientWidth - x < 200) {
							p.classList.add('rightPlayer')
						} else if (x > 0 && x < 400) {
							p.classList.add('leftPlayer')
						}
					})
				}, game.zhu, players, skills)
				lib.playerSkillOL[game.zhu.playerid] = skills
				game.addVideo('initSkill', game.zhu, { skills, zhu: true })
				if (game.zhu === game.me) {
					game.addVideo('closeDialog')
				}
				'step 3'
				game.broadcastAll('closeDialog', event.videoId)
				game.broadcastAll(() => {
					const dialog = ui.arena.querySelector('.dialog.scroll1.scroll2')
					if (dialog) dialog.remove()
				})
				const list = [];
				const anothPlayer = game.players.filter(p => p !== game.zhu)
				for (let i = 0; i < anothPlayer.length; i++) {
					const player = anothPlayer[i]
					const skillList = Object.keys(event.map[player.playerid])
					list.push([player, ['选择技能', [skillList, 'vcardx']], 2, true]);
				}
				game.me.chooseButtonOL(list);
				'step 4'
				for (const r in result) {
					const player = lib.playerOL[r]
					const skills = result[r].links.map(s => s[2])
					game.addVideo('initSkill', player, { skills, me: player === game.me })
					if (player === game.me) {
						game.addVideo('closeDialog')
					}
					game.broadcastAll((player, skills) => {
						if (player === game.me) {
							let str = ''
							skills.forEach(s => str += get.translation(s) + ' ')
							player.node.rightskillList.innerHTML = str
						}
					}, player, skills)
					lib.playerSkillOL[player.playerid] = skills
				}

				//选形象
				const playerAvatarMap = {}
				game.players.forEach(p => playerAvatarMap[p.playerid] = lib.playerCharacterOL[p.playerid])

				const avatarList = [];
				game.players.forEach(player => {
					const list = playerAvatarMap[player.playerid]
					avatarList.push([player, [
						`<span style="color:red;font-weight:700;">你可以选择一个武将作为你本局的形象</span><br>
                        <span class="tempName" style="color:orange;font-weight:700;text-align:center;font-size:20px;border-radius: 5px;">还可以在下方输入框写一个名字作为本局形象名字</span><br>
                        <input maxlength="8"  style="width:45%;text-align: center;font-size: 20px;font-weight: 700;border-radius: 5px;" value="${player.nickname || get.translation(player.name1)}">`, [list, 'characterx']], 1, false])
				})//
				game.me.chooseButtonOL(avatarList, (player, result) => {
					const input = _status.event.dialog.querySelector('input')
					if (input) {
						result.tempName = input.value
					}
					if (!result.bool) return;
					if (player === game.me) {
						const character = result.links[0]
						player.node.avatar.setBackground(character, 'character')
						// player.sex = lib.character[character][0]
					}
				}).set('switchToAuto', function () {
					_status.event.result = 'ai';
				}).set('processAI', function () {
					return false
				})
				'step 5'
				for (const i in result) {
					const bool = result[i]
					if (bool.tempName) {
						game.addVideo('flashName', lib.playerOL[i], {
							avatar: lib.playerOL[i].name,
							tempName: bool.tempName
						})
						game.broadcastAll((player, tempName) => {
							player.tempName = tempName
							player.node.name.innerHTML = tempName
						}, lib.playerOL[i], bool.tempName)
					}
					if (!bool.bool) continue
					game.broadcastAll((player, avatar, skills, tempName) => {
						const nickname = tempName || player.nickname || player.node.name1.innerText
						const id = nickname + player.playerid

						player.node.name.innerHTML = nickname
						player.tempName = tempName

						suiSet.copyCharacter({
							character: avatar,
							hp: 4,
							skills: skills || [],
							name: id,
							translate: nickname
						})
						player.init(id)
						player.update()
					}, lib.playerOL[i], bool.links[0], lib.playerSkillOL[lib.playerOL[i].playerid], bool.tempName)
					game.addVideo('flashAvatar', lib.playerOL[i], {
						avatar: bool.links[0],
						skills: lib.playerSkillOL[lib.playerOL[i].playerid]
					})
					game.addVideo('flashName', lib.playerOL[i], {
						avatar: bool.links[0],
						tempName: bool.tempName
					})
				}

				//选势力
				const select = lib.group.map(g => ['', '', `group_${g}`])
				const groupList = game.players.map(i => {
					return [i, ['你可以选择一个势力', [select, 'vcard']], 1, false]
				})
				game.me.chooseButtonOL(groupList, (player, result) => {
					if (!result.links) return
					if (player === game.me) {
						player.changeGroup(result.links[0][2].slice(6), false, false);
					}
				}).set('processAI', function () {
					return false
				})
				'step 6'
				for (const g in result) {
					if (!result[g].bool) continue
					const player = lib.playerOL[g]
					const group = result[g].links[0][2].slice(6)
					game.broadcastAll((player, group) => {
						lib.character[player.name1][1] = group
						player.changeGroup(group)
					}, player, group)
					game.addVideo('flashGroup', player, { group })
				}

				game.players.forEach(p => {
					const skills = lib.playerSkillOL[p.playerid]
					lib.character[p.name1].skills = skills
					_status.playerCharacters[p.playerid] = {
						player: p,
						skills: lib.character[p.name1][3],
						name: p.tempName || (p.nickname && p.nickname.replace('※', '')) || '',
						character: p.name1,
						info: lib.character[p.name1],
						group: p.group
					}
					p.addSkill(skills)
					game.broadcastAll((player, skills) => {
						lib.character[player.name1][3] = skills
						let str = ''
						skills.forEach(s => str += get.translation(s) + ' ')
						player.node.rightskillList.innerHTML = str
						if (player.nickname) {
							lib.translate[player.name1] = player.tempName || player.nickname.replace('※', '')
						}
					}, p, skills)
					game.log(`${p.node.name.innerHTML}选择了`, skills)
				})
				_status.playerCharactersUse = (characters, innnerHtml, needFunction) => {
					if (!window.suiSet) {
						window.suiSet = {
							copyCharacter: needFunction
						}
					}
					lib.skill.playerchangeSkill = {
						trigger: { player: 'changeSkillsAfter' },
						forced: true,
						charlotte: true,
						popup: false,
						filter() { return true },
						async content(event, trigger, player) {
							let str = ''
							const skills = player.getSkills(null, false, false).filter(s => get.translation(s) !== s);
							game.addVideo('initSkill', player, { skills })
							skills.forEach(i => {
								if (i === 'playerchangeSkill') return;
								const info = get.info(i);
								if (info && !info.charlotte) {
									str += get.translation(i) + ' '
								}
							});
							if (!player.node.rightskillList) {
								player.node.rightskillList = ui.create.div('.playerskillList', str, player)
							} else {
								player.node.rightskillList.innerHTML = str
							}
						}
					}
					lib.skill.PVPaozhan = {
						trigger: { global: 'dieAfter' },
						filter() { return game.players.length === 2 && !game.PVPaozhan },
						async content(event, trigger, player) {
							var color = get.groupnature(player.group, "raw");
							if (player.isUnseen()) color = "fire";
							player.$fullscreenpop("鏖战模式", color);
							game.broadcastAll(function () {
								_status._aozhan = true;
								ui.aozhan = ui.create.div(".touchinfo.left", ui.window);
								ui.aozhan.innerHTML = "鏖战模式";
								if (ui.time3) ui.time3.style.display = "none";
								ui.aozhanInfo = ui.create.system("鏖战模式", null, true);
								lib.setPopped(
									ui.aozhanInfo,
									function () {
										var uiintro = ui.create.dialog("hidden");
										uiintro.add("鏖战模式");
										var list = [
											"当游戏中仅剩两名玩家",
											"在鏖战模式下，任何角色均不是非转化的【桃】的合法目标。【桃】可以被当做【杀】或【闪】使用或打出。",
											"进入鏖战模式后，即使之后有两名或者更多的角色出现，仍然不会取消鏖战模式。",
										];
										var intro = '<ul style="text-align:left;margin-top:0;width:450px">';
										for (var i = 0; i < list.length; i++) {
											intro += "<li>" + list[i];
										}
										intro += "</ul>";
										uiintro.add('<div class="text center">' + intro + "</div>");
										var ul = uiintro.querySelector("ul");
										if (ul) {
											ul.style.width = "180px";
										}
										uiintro.add(ui.create.div(".placeholder"));
										return uiintro;
									},
									250
								);
								game.playBackgroundMusic();
							});
							game.countPlayer(function (current) {
								current.addSkill("aozhan");
							});
						},
						forced: true,
						charlotte: true,
					}
					const style = document.createElement('style')
					style.innerHTML = innnerHtml
					document.head.appendChild(style)
					for (const s in characters) {
						const { skills, name, character, info, group } = characters[s]
						skills.push('playerchangeSkill')
						lib.character[character] = info
						const thecharacter = lib.character[character]
						if (!thecharacter) continue
						thecharacter.group = group
						thecharacter.trashBin.remove('hiddenSkill')
						thecharacter.skills = skills
						lib.translate[character] = name || get.translation(character)
					}
					const oldme = ui.create.me
					ui.create.me = () => {
						const me = oldme.call(this, ...arguments)
						for (const s in characters) {
							const player = lib.playerOL[s]
							// const {skills,name} = characters[s]
							const { skills } = characters[s]
							let str = ''
							skills.forEach(s => {
								if (s === 'playerchangeSkill') return;
								str += get.translation(s) + ' '
							})
							if (!player.node.rightskillList) player.node.rightskillList = ui.create.div('.playerskillList', player)
							player.node.rightskillList.innerHTML = str
							// if(name) player.node.name.innerHTML = name
							const { x } = player.getBoundingClientRect()
							if (ui.window.clientWidth - x < 200) {
								player.classList.add('rightPlayer')
							} else if (x > 0 && x < 400) {
								player.classList.add('leftPlayer')
							}
						}
						ui.create.me = oldme
						return me
					}
				}
				const nei = game.players.some(p => p.identity === 'nei')
				// if(!nei){
				//     const zhuSkill = (map, id) => {
				//         const str = '请选择一个主公技'
				//         const list = map
				//         const dialog = ui.create.dialog(`${str}你的技能框↓<br>注意看武将旁边的技能而不是武将原画`, [list, 'vcard'])
				//         dialog.videoId = id;
				//     }
				//     const select = _status.zhuSkills[game.zhu.group]
				//     if(game.zhu.ws){
				//         game.zhu.send(zhuSkill, select, ++event.videoId);
				//     }else {
				//         zhuSkill(select, ++event.videoId)
				//     }
				//     const next = game.zhu.chooseButton(true).set('ai', Math.random)
				//     next.set('selectButton', 1);
				//     next.then(value=>game.zhu.addSkill(value.result.links[0][2]))
				// }
				game.broadcastAll((time, nei) => {
					if (nei) {
						game.zhu.maxHp++
						game.zhu.hp++
						game.zhu.update()
					}
					lib.configOL.choose_timeout = time
					setTimeout(function () {
						ui.arena.classList.remove("choose-character");
					}, 500);
					lib.skill.playerchangeSkill = {
						trigger: { player: 'changeSkillsAfter' },
						forced: true,
						charlotte: true,
						popup: false,
						filter() { return true },
						async content(event, trigger, player) {
							let str = ''
							const skills = player.getSkills(null, false, false).filter(s => get.translation(s) !== s);;
							skills.forEach(i => {
								if (i === 'playerchangeSkill') return;
								const info = get.info(i);
								if (info && !info.charlotte) {
									str += get.translation(i) + ' '
								}
							});
							if (!player.node.rightskillList) {
								player.node.rightskillList = ui.create.div('.playerskillList', player)
							}
							game.broadcastAll((player, str) => {
								player.node.rightskillList.innerHTML = str
							}, player, str)
						}
					}
					lib.skill.PVPaozhan = {
						trigger: { global: 'dieAfter' },
						filter() { return game.players.length === 2 && !game.PVPaozhan },
						async content(event, trigger, player) {
							game.PVPaozhan = true
							var color = get.groupnature(player.group, "raw");
							if (player.isUnseen()) color = "fire";
							player.$fullscreenpop("鏖战模式", color);
							game.broadcastAll(function () {
								_status._aozhan = true;
								ui.aozhan = ui.create.div(".touchinfo.left", ui.window);
								ui.aozhan.innerHTML = "鏖战模式";
								if (ui.time3) ui.time3.style.display = "none";
								ui.aozhanInfo = ui.create.system("鏖战模式", null, true);
								lib.setPopped(
									ui.aozhanInfo,
									function () {
										var uiintro = ui.create.dialog("hidden");
										uiintro.add("鏖战模式");
										var list = [
											"当游戏中仅剩两名玩家",
											"在鏖战模式下，任何角色均不是非转化的【桃】的合法目标。【桃】可以被当做【杀】或【闪】使用或打出。",
											"进入鏖战模式后，即使之后有两名或者更多的角色出现，仍然不会取消鏖战模式。",
										];
										var intro = '<ul style="text-align:left;margin-top:0;width:450px">';
										for (var i = 0; i < list.length; i++) {
											intro += "<li>" + list[i];
										}
										intro += "</ul>";
										uiintro.add('<div class="text center">' + intro + "</div>");
										var ul = uiintro.querySelector("ul");
										if (ul) {
											ul.style.width = "180px";
										}
										uiintro.add(ui.create.div(".placeholder"));
										return uiintro;
									},
									250
								);
								game.playBackgroundMusic();
							});
							game.countPlayer(function (current) {
								current.addSkill("aozhan");
							});
						},
						forced: true,
						charlotte: true,
					}
				}, event.chooseTime, nei)
				// game.addGlobalSkill('PVPaozhan')
				// game.players.forEach(p => p.addSkill('playerchangeSkill'))
				game.addGlobalSkill('playerchangeSkill')
				_status.videoInited = false
			})
		}
		//game.addZhuFellow = function (position, character, animation = "zoominanim") {
		//	game.addVideo("addFellow", null, [position, character, animation]);

		//	const totalPlayerNum = game.players.length + game.dead.length;
		//	position = (position + game.zhu.dataset.position + totalPlayerNum) % totalPlayerNum;
		//	//alert(position);

		//	game.broadcastAll((position) => {
		//		ui.arena.setNumber(totalPlayerNum + 1);

		//		const player = ui.create.player(ui.arena).addTempClass(animation || "start");//在布局面板中创建一个player用于显示
		//		player.dataset.position = position || game.players.length + game.dead.length;

		//		player.getId();
		//		if (character) player.init(character);
		//		game.players.push(player);

		//		game.players
		//			.concat(game.dead)
		//			.sort(lib.sort.position)
		//			.forEach((p) => {
		//				if (p.dataset.position >= player.dataset.position) p.dataset.position++;
		//			})
		//		game.playerMap = {};
		//		var players = game.players.concat(game.dead);
		//		for (var i = 0; i < players.length; i++) {
		//			game.playerMap[players[i].dataset.position] = players[i];
		//		}

		//		game.arrangePlayers();

		//		player.gain(4)._triggered = null;
		//		player.side = false;
		//		player.identity = "zhong";
		//		player.setIdentity("zhong");
		//		player.identityShown = true

		//		//fellow.setSeatNum(position);
		//	}, position)


		//	game.addVideo("setIdentity", player, "zhong");
		//	return player;
		//}


		game.chooseCharacterYwzqOL = function () {

			game.broadcastAll(() => {//发送数据包

				_status.gameInfomation = {};
				_status.gameInfomation.killNum = [0];
				_status.gameInfomation.huanhundan = 1;

				lib.group.push('lonely'); // 添加势力
				lib.translate.lonely = '望'; // 势力翻译
				lib.translate.lonely2 = '守望'; // 势力翻译
				lib.translate.lonelyColor = "#6652ff"; // 文字颜色\
				lib.groupnature.lonely = 'water'; // 描边颜色

				lib.group.push('chest'); // 添加势力
				lib.translate.chest = '箱'; // 势力翻译
				lib.translate.chest2 = '箱子'; // 势力翻译
				lib.translate.chestColor = "#FFD500"; // 文字颜色\
				lib.groupnature.chest = 'shen'; // 描边颜色

				//const imgUrl = "https://img2.baidu.com/it/u=1196734671,2605357388&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500";
				//const cachedImg = new Image();
				//cachedImg.src = imgUrl;


				const mode = {
					pack: {
						character: {
							boss_lvbu1: ['male', 'shen', 8, ['mashu', 'wushuang', 'boss_baonu', 'boss_jingjia', 'boss_aozhan'], ['qun', 'mode:boss'], 'wei'],
							boss_lvbu2: ['male', 'shen', 6, ['mashu', 'wushuang', 'xiuluo', 'shenwei', 'shenji'], ['qun', 'mode:boss'], 'qun'],
							boss_lvbu3: ['male', 'shen', 6, ['wushuang', 'shenqu', 'jiwu'], ['qun', 'mode:boss'], 'qun'],

							boss_caocao: ['male', 'shen', 12, ['boss_guixin', 'xiongcai'], ['wei', 'mode:boss'], 'wei'],

							boss_liubei: ['male', 'shen', 8, ['xiaoxiong', 'boss_zhangwu'], ['shu', 'mode:boss'], 'qun'],
							boss_zhugeliang: {
								sex: "male",
								group: "shen",
								hp: Infinity,
								maxHp: Infinity,
								skills: ["xiangxing", "yueyin", "fengqi", "gaiming"],
								img: "image/mode/boss/character/boss_zhugeliang.jpg",
							},
							//boss_zhugeliang: ["male", "shen", "Infinity/Infinity", ["xiangxing", "yueyin", "fengqi", "gaiming"], ["shu", "boss", "bossallowed"], "qun", ["img:image/mode/boss/character/boss_zhugeliang.jpg"] ],
							boss_huangyueying: ["female", "shen", 4, ["boss_gongshen", "boss_jizhi", "qicai", "boss_guiyin"], ["shu", "boss", "bossallowed"], "wei"],
							boss_pangtong: ["male", "shen", 4, ["boss_tianyu", "qiwu", "niepan", "boss_yuhuo"], ["shu", "boss", "bossallowed"], "zhu"],
							boss_zhenji: ["female", "shen", 4, ["tashui", "lingbo", "jiaoxia", "fanghua"], ["wei", "boss", "bossallowed", "img: image/mode/boss/character/boss_zhenji.jpg"], "wei"],

							boss_nianshou_heti: ['male', 'shen', 12, ['boss_nianrui', 'boss_mengtai', 'boss_nbianshen', 'boss_nbianshenx'], ['shu', 'mode:boss'], 'shu'],
							boss_nianshou_jingjue: ['male', 'shen', 12, ['boss_nianrui', 'boss_mengtai', 'boss_jingjue', 'boss_nbianshen'], ['shu', 'mode:boss'], 'shu'],
							boss_nianshou_renxing: ['male', 'shen', 12, ['boss_nianrui', 'boss_mengtai', 'boss_renxing', 'boss_nbianshen'], ['shu', 'mode:boss'], 'shu'],
							boss_nianshou_ruizhi: ['male', 'shen', 12, ['boss_nianrui', 'boss_mengtai', 'boss_ruizhi', 'boss_nbianshen'], ['shu', 'mode:boss'], 'shu'],
							boss_nianshou_baonu: ['male', 'shen', 12, ['boss_nianrui', 'boss_mengtai', 'boss_nbaonu', 'boss_shouyi', 'boss_nbianshen'], ['shu', 'mode:boss'], 'shu'],
							boss_zuoci: ['male', 'shen', 0, ['huanhua'], ['qun', 'mode:boss'], 'shu'],
							"boss_sunce": ["male", "shen", "1/8", ["boss_jiang", "boss_hunzi", "boss_hunyou", "boss_taoni", "olbuyi", "sbzhichi"], ['qun', 'mode:boss'], 'wu'],

							//sw_silverchest: ['male', 'chest', 2, ["sw_chest", "sw_chestsilver"], ['character:hhzz_takaramono1']],
							//sw_goldchest: ['male', 'chest', 3, ["sw_chest", "sw_chestgold"], ['character:hhzz_takaramono1']],
							//sw_diamondchest: ['male', 'chest', 4, ["sw_chest", "sw_chestdiamond"], ['character:hhzz_takaramono1']],

							sw_silverchest: {
								sex: "male",
								group: "chest",
								hp: 2,
								skills: ["sw_chest", "sw_chestsilver"],
								img: "https://img2.baidu.com/it/u=1196734671,2605357388&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
							},
							sw_goldchest: {
								sex: "male",
								group: "chest",
								hp: 4,
								skills: ["sw_chest", "sw_chestgold"],
								img: "https://img2.baidu.com/it/u=1196734671,2605357388&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
							},
							sw_diamondchest: {
								sex: "male",
								group: "chest",
								hp: 6,
								skills: ["sw_chest", "sw_chestdiamond"],
								img: "https://img2.baidu.com/it/u=1196734671,2605357388&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
							},
							sw_legendchest: {
								sex: "male",
								group: "chest",
								hp: 10,
								skills: ["sw_chest", "sw_chestlegend"],//
								img: "https://b0.bdstatic.com/61eeb8b79c892b428a66d6589dab6c84.jpg@h_1280",
							},
							sw_ironchest: {
								sex: "male",
								group: "chest",
								hp: 1,
								skills: ["sw_chest", "sw_chestiron"],//
								img: "https://iphoto.mac89.com/photo/180413/180413_153/Y9tA58t5lN_small.jpg",
							},
						},
						skill: {
							sw_test: {
								trigger: {
									player: "phaseUseBegin",
								},
								direct: true,
								async content(event, trigger, player) {
									// 创建同步事件
									var next = game.createEvent('customEvent');
									next.player = player;
									next.setContent(function () {
										// 事件内容
										game.addZhuFellow(1, ["sw_silverchest"], "nei");

									});

									// 等待事件完成
									await next;
								}
							},
							sw_huisheng: {
								enable: 'chooseToUse',
								mark: true,
								skillAnimation: true,
								limited: true,
								animationColor: 'orange',
								filter: function (event, player) {
									if (event.type == 'dying') {
										if (player != event.dying) return false;
										return true;
									}
									return false;
								},
								content: function () {
									'step 0'
									player.awakenSkill('sw_huisheng');
									player.discard(player.getCards('hej'));
									'step 1'
									player.link(false);
									player.turnOver(false);
									'step 2'
									player.draw(3);
									if (player.hp < 3) player.recover(3 - player.hp);
								},
								ai: {
									order: 1,
									skillTagFilter: function (player, arg, target) {
										if (player != target || player.storage.wechatniepan) return false;
									},
									save: true,
									result: {
										player: function (player) {
											if (player.hp <= 0) return 10;
											if (player.hp <= 2 && player.countCards('he') <= 1) return 10;
											return 0;
										}
									},
									threaten: 0.6,
								},
							},
							_sw_zhuDie: {
								trigger: { player: "die" },
								forced: true,
								forceDie: true,
								filter: function (event, player) {
									return player == game.zhu;
								},
								async content(event, trigger, player) {
									console.log("主公死亡");
									game.players.concat(player.dead)
										.sortBySeat()
										.forEach(function (current) {
											current.removeSkill("sw_huisheng");
										});
								},
							},
							_sw_chestDie: {
								trigger: { player: "dieAfter" },
								forced: true,
								forceDie: true,
								filter: function (event, player) {
									console.log(player.name);
									let arr = ["sw_silverchest", "sw_goldchest", "sw_diamondchest", "sw_ironchest", "sw_legendchest"];
									return arr.includes(player.name);
								},
								async content(event, trigger, player) {
									console.log("宝箱死亡");
									await game.removeZhuFellow(player);
								},
							},
							sw_getSkill: {

								//trigger: { source: "damageEnd" },
								//forced: true,
								//popup: false,
								//filter: function (event, player) {
								//	return event.player == player._toKill;
								//},
								//content: function () {
								//	game.log(player, "对击杀目标造成了伤害");
								//	player.changeLingli(trigger.num);
								//},


								locked: true,
								forced: true,
								priority: -100,
								charlotte: true,
								popup: false,
								trigger: {
									player: "damageEnd",
									source: "damageSource",
								},
								//filter: function (event, player) {
								//	return player.hasMark("sw_getSkill") && player.countMark("sw_getSkill") % 3 == 0;
								//},
								init: function (player) {
									if (!player.storage.sw_getSkillName) player.storage.sw_getSkillName = [];
									if (!player.storage.sw_getSkillMaxcnt) player.storage.sw_getSkillMaxcnt = 3;
									player.updateMarks();
								},
								content: function () {
									"step 0";
									if (!player.storage.sw_getSkillName) player.storage.sw_getSkillName = [];
									if (!player.storage.sw_getSkillMaxcnt) player.storage.sw_getSkillMaxcnt = 3;

									player.addMark("sw_getSkill", trigger.num);
									if (player.countMark("sw_getSkill") >= 4) {
										event.goto(1);
									}
									else event.finish();
									"step 1";
									list = game.getSWSkillsList(player)
										.filter(function (i) {
											return !player.hasSkill(i, null, null, false);
										})
										.randomGets(5);
									if (list.length == 0) game.log(player, "没有技能可选");
									else {
										event.videoId = lib.status.videoId++;
										game.broadcastAll((skills, id) => {
											var dialog = ui.create.dialog("forcebutton");
											dialog.videoId = id;
											dialog.add("选择一个技能获得");
											for (var i = 0; i < skills.length; i++) {
												dialog.add('<div class="popup pointerdiv" style="width:80%;display:inline-block"><div class="skill">【' + get.translation(skills[i]) + "】</div><div>" + lib.translate[skills[i] + "_info"] + "</div></div>");
											}
											dialog.addText(" <br> ");
										}, list, event.videoId);

										player.chooseControl(list);
									}
									"step 2";
									game.broadcastAll("closeDialog", event.videoId);
									player.addSkills(result.control);
									player.storage.sw_getSkillName.push(result.control);
									player.removeMark("sw_getSkill", 4);
									"step 3";
									if (player.countMark("sw_getSkill") >= 4) {
										event.goto(1);
									}
									"step 4";
									var skills = player.getSkills(null, false, false).filter(function (i) {
										if (i == "sw_getSkill") return false;
										var info = get.info(i);
										return info && !info.charlotte;
									});
									event.skills = skills;

									player.storage.sw_getSkillName = player.storage.sw_getSkillName.filter(skill =>
										skills.includes(skill)
									);

									if (player.storage.sw_getSkillMaxcnt >= player.storage.sw_getSkillName.length) event.finish();
									else event.goto(5);
									"step 5";
									var skills = player.storage.sw_getSkillName.slice().reverse();
									var list = [];
									for (var skill of skills) {
										list.push([skill, '<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">【' + get.translation(skill) + "】</div><div>" + lib.translate[skill + "_info"] + "</div></div>"]);
									}
									var num = player.storage.sw_getSkillName.length - player.storage.sw_getSkillMaxcnt;
									player.chooseButton([`请选择失去` + get.cnNumber(num) + `个技能`, [list, "textbutton"]]).set("forced", true).set("selectButton", num).set("skills", skills);
									"step 6";
									if (result.bool) {
										var skills = result.links;
										player.removeSkills(skills.slice(0));
									}
									"step 7";
									var sks = player.getSkills(null, false, false).filter(function (i) {
										if (i == "sw_getSkill") return false;
										var info = get.info(i);
										return info && !info.charlotte;
									});

									player.storage.sw_getSkillName = player.storage.sw_getSkillName.filter(skill =>
										sks.includes(skill)
									);
									player.checkMarks();
								},
								mark: true,
								marktext: "灵",
								intro: {
									name: "灵气",
									content: function (storage, player) {
										if (!player.storage.sw_getSkillName) player.storage.sw_getSkillName = [];
										if (!player.storage.sw_getSkillMaxcnt) player.storage.sw_getSkillMaxcnt = 3;
										return `灵气值：` + player.countMark("sw_getSkill") + `<br><li>每当你造成或受到伤害时，你获得等同于伤害量的灵气值，若此时当灵气值大于等于4，你令系统随机检索五个技能，你选择其一获得之并失去四点灵气。<br><li>你通过此法获得的技能数：` + player.storage.sw_getSkillName.length + "/" + player.storage.sw_getSkillMaxcnt;
									},
								},
							},
							sw_bossGetSkill: {
								forced: true,
								charlotte: true,
								popup: false,
								trigger: {
									global: "phaseBefore",
									player: "enterGame",
								},
								filter(event, player) {
									return !player.storage.sw_bossGetSkill_have;
								},
								content: function () {
									player.storage.sw_bossGetSkill_have = true;

									list = game.getSWSkillsList(player)
										.filter(function (i) {
											return !player.hasSkill(i, null, null, false);
										})
										.randomGets(_status.gameInfomation.killNum[0]);
									player.addSkills(list);
									player.removeSkill("sw_bossGetSkill");
								},
							},
							sw_bossGetSkill2: {
								forced: true,
								charlotte: true,
								popup: false,
								trigger: {
									player: ["phaseZhunbeiBegin"],
								},
								//filter: function (event, player, name) {
								//	return !player.storage.sw_bossGetSkill;
								//},
								content: function () {
									list = game.getSWSkillsList(player)
										.filter(function (i) {
											return !player.hasSkill(i, null, null, false);
										})
										.randomGets(2);
									player.addSkills(list);
								},
							},
							sw_xionge: {
								charlotte: true,
								forced: true,
								silent: true,
								trigger: { player: "phaseDrawBegin2" },
								content: function () {
									trigger.num += Math.floor(_status.gameInfomation.killNum[0] / 2);
								},
								mod: {
									cardUsable: function (card, player, num) {
										if (card.name == "sha") return num + Math.floor(_status.gameInfomation.killNum[0] / 3);
									},
								},
								//mark: true,
								//direct: true,
								//marktext: "恶",
								//intro: {
								//	name: "凶恶",
								//	content(storage, player) {
								//		return `<li>摸牌阶段额外摸${Math.floor(_status.killNum[0] / 2)}张牌<br><li>出【杀】次数+${Math.floor(_status.killNum[0] / 3)}`;
								//	},
								//},
							},
							sw_getHuihe: {
								charlotte: true,
								forced: true,
								silent: true,
								popup: false,
								nopop: true,
								trigger: {
									global: "phaseJieshuBegin",
								},
								content: function () {
									"step 0";
									//if (trigger.player.identity != "fan") event.finish();
									player.addMark("sw_getHuihe");
									if (player.countMark("sw_getHuihe") < 5) {
										event.finish();
									}
									"step 1";
									player.removeMark("sw_getHuihe", player.countMark("sw_getHuihe"));
									player.insertPhase();
									player.logSkill("sw_getHuihe");
								},
								mark: true,
								marktext: "额",
								intro: {
									name: "额外回合",
									content: function (storage, player) {
										return `已经经过了：` + player.countMark("sw_getHuihe") + `回合，达到5时获得额外回合。`;
									},
								},
							},
							_sw_viewTeamHand: {
								charlotte: true,
								forced: true,
								silent: true,
								locked: true,
								ai: {
									viewHandcard: true,
									skillTagFilter(player, tag, target) {
										if (!target || player == target || target.identity != "fan") return false;
									},
								},
							},

							sw_chest: {
								trigger: { player: "damage" },
								forced: true,
								persevereSkill: true,
								logTarget: "source",
								filter: function (event, player) {
									return event.source != undefined && player.countCards("hej") > 0;
								},
								content: function () {
									"step 0";
									player.draw();
									"step 1";
									var cards = player.getCards("hej");
									cards.randomSort();
									cards = cards.slice(0, trigger.num);
									trigger.source.gain("give", cards, player);
									console.log(event.name);
									//player.addSkill("sw_test2");
									//trigger.source.addSkill("sw_test2");
								},
								group: ["sw_chest_jump"],
								//subSkill: {
								//	jump: {
								//		persevereSkill: true,
								//		popup: false,
								//		trigger: {
								//			player: ["phaseUseBefore", "phaseDiscardBefore"],
								//		},
								//		forced: true,
								//		content: function () {
								//			trigger.cancel();
								//		},
								//	},
								//},
							},
							sw_chest_jump: {
								mod: {
									cardEnabled2(card, player) {
										if (get.position(card) == "h") return false;
									},
								},
								persevereSkill: true,
								popup: false,
								trigger: {
									player: ["phaseUseBefore", "phaseDiscardBefore"],
								},
								forced: true,
								content: function () {
									trigger.cancel();
								},
							},

							sw_chestsilver: {
								trigger: { player: "die" },
								filter(event) {
									return event.source && event.source.isIn() && event.source.identity == "fan";
								},
								forced: true,
								forceDie: true,
								persevereSkill: true,
								logTarget: "source",
								content() {
									"step 0";
									trigger.source.draw(5);
									trigger.source.recover();
								},
							},

							sw_chestgold: {
								trigger: { player: "die" },
								filter(event) {
									return event.source && event.source.isIn() && event.source.identity == "fan";
								},
								forced: true,
								forceDie: true,
								persevereSkill: true,
								logTarget: "source",
								content() {
									"step 0";
									trigger.source.addMark("sw_getSkill", 20);
								},
							},

							sw_chestdiamond: {
								trigger: { player: "die" },
								filter(event) {
									return event.source && event.source.isIn() && event.source.identity == "fan";
								},
								forced: true,
								forceDie: true,
								persevereSkill: true,
								logTarget: "source",
								content() {
									"step 0";
									trigger.source.gainMaxHp();
									"step 1";
									trigger.source.recover(trigger.source.maxHp - trigger.source.hp);
								},
							},


							fanghua: {
								trigger: { player: "phaseJieshuBegin" },
								forced: true,
								persevereSkill: true,
								locked: false,
								unique: true,
								filter: function (event, player) {
									if (player.name1 != "boss_zhenji" && player.name2 != "boss_zhenji") return false;
									return game.hasPlayer(function (current) {
										return current.isTurnedOver();
									});
								},
								content: function () {
									"step 0";
									event.players = get.players(player);
									event.num = 0;
									for (var i = 0; i < event.players.length; i++) {
										if (!event.players[i].isTurnedOver()) {
											event.players.splice(i--, 1);
										}
									}
									"step 1";
									if (event.players.length) {
										event.players.shift().loseHp();
										event.redo();
									}
								},
								group: ["fanghua_addMaxHp"],
							},
							fanghua_addMaxHp: {
								filter: function (event, player) {
									return (player.name1 == "boss_zhenji" || player.name2 == "boss_zhenji");
								},
								trigger: { global: 'loseHpAfter' },
								persevereSkill: true,
								forced: true,
								unique: true,
								content: function () {
									player.gainMaxHp();
								},
							},
							tashui: {
								audio: 2,
								persevereSkill: true,
								trigger: { player: ['useCard2', 'respondAfter'] },
								unique: true,
								popup: false,
								filter: function (event, player) {
									if (player.name1 != "boss_zhenji" && player.name2 != "boss_zhenji") return false;
									return event.card && get.color(event.card) == "black";
								},

								content: function () {
									"step 0"
									player.chooseTarget(get.prompt('tashui'), function (card, player, target) {
										return player != target;
									}).ai = function (target) {
										//	if(target.isTurnedOver()) return -1;
										var player = _status.event.player;
										if (get.attitude(_status.event.player, target) == 0) return 0;
										if (get.attitude(_status.event.player, target) > 0) {
											if (target.classList.contains('turnedover')) return 3;
											if (target.hasSkillTag('noturn')) return 1;
											return -1;
										}
										else {
											if (target.hasSkillTag('noturn')) return 0;
											if (target.classList.contains('turnedover')) return -1;
											return 5 - target.getDamagedHp();
										}
										return 1;
									}
									"step 1"
									if (result.bool) {
										player.logSkill('tashui', result.targets, 'thunder');
										result.targets[0].turnOver();
									}
								},
								ai: {
									effect: {
										player: function (card) {
											if (get.color(card) == 'black') {
												return [1, 2];
											}
										}
									}
								}
							},
							lingbo: {
								filter: function (event, player) {
									if (player.name1 != "boss_zhenji" && player.name2 != "boss_zhenji") return false;
									if (_status.currentPhase != player) return false;
									return true;
								},
								frequent: true,
								audio: 2,
								trigger: { player: ['damageBegin2', 'loseHpBegin'] },
								forced: true,
								content: function () {
									trigger.cancel();
								},
							},
							jiaoxia: {
								audio: 2,
								trigger: { target: "useCardToTargeted" },
								filter: function (event, player) {
									if (!event.player) return false;
									if (event.player == player) return false;
									return event.card && get.color(event.card) == "red" && (player.name1 == "boss_zhenji" || player.name2 == "boss_zhenji");
								},
								persevereSkill: true,
								frequent: true,
								content: function () {
									player.draw(player.maxHp);
								},
							},

							boss_taoni: {
								forced: true,
								trigger: { global: "useCardAfter" },
								filter(event, player) {
									return (
										game.hasPlayer(function (current) {
											return current.hp > player.hp && player.hp >= 1;
										})
									) && (player.name1 == "boss_sunce" || player.name2 == "boss_sunce");
								},
								content: function () {
									var players = game.players.filter(current => {
										return current.hp > player.hp && current.hp > 1;
									}).sortBySeat();
									for (var p of players) {
										player.line(p);
										p.loseHp(p.hp - player.hp);
									}

								}
							},
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

							yueyin: {
								unique: true,
								mark: true,
								intro: {
									content: function (storage, player) {
										var str = "扣减" + (7 - player.storage.xiangxing_count) + "点体力后失去下一枚星；";
										str += "防止禳星伤害条件：" + lib.translate["xiangxing" + player.storage.xiangxing + "_info"];
										return str;
									},
									markcount: function (storage, player) {
										return Math.max(0, 7 - player.storage.xiangxing_count);
									},
								},
								skipDamage: {
									x7: function (player) {
										return player.countCards("h") == 0;
									},
									x6: function (player, event) {
										if (event.hasNature) return event.hasNature("fire");
									},
									x5: function (player, event) {
										if (event.hasNature) return event.hasNature("thunder");
									},
									x4: function (player, event) {
										return event.name == "loseHp";
									},
									x3: function (player, event) {
										return game.hasPlayer(function (current) {
											return current != player && current.countCards("e") >= 4;
										});
									},
									x2: function (player) {
										return player.countCards("j") >= 1;
									},
									x1: function () {
										let res = true;
										for (var i = 0; i < game.players.length; i++) {
											if (game.players[i].identity == "fan" && game.players[i].hp != 1) res = false;
										}
										return res;
									},
								},
								ai: {
									combo: "xiangxing",
									neg: true,
									effect: {
										target(card, player, target) {
											if (!target.hasSkill("xiangxing") || !target.storage.xiangxing || target.storage.xiangxing_count < 6) return;
											switch (target.storage.xiangxing) {
												case 7:
													if (get.tag(card, "discard") || get.tag(card, "lose")) {
														if (player !== target) return [1, 0, 1, 6 / (1 + target.countCards("h"))];
													}
													if (get.tag(card, "damage") || get.tag(card, "losehp")) {
														if (target.countCards("h")) return [1, 7, 1, -7];
													}
													break;
												case 6:
													if (typeof card === "object" && game.hasNature(card, "fire")) return;
													if (get.tag(card, "damage") || get.tag(card, "losehp")) return [1, 6, 1, -6];
													break;
												case 5:
													if (typeof card !== "object" || game.hasNature(card, "thunder")) return;
													if (get.tag(card, "damage") || get.tag(card, "losehp")) return [1, 5, 1, -5];
													break;
												case 4:
													if (get.tag(card, "damage")) return [1, 2, 1, -2];
													if (get.tag(card, "losehp")) return [1, -4];
													break;
												case 3:
													if (get.tag(card, "damage") || get.tag(card, "losehp")) {
														if (!game.hasPlayer(current => {
															return current !== target && current.countCards("e") >= 4;
														})) return [1, 3, 1, -3];
													}
													break;
												case 2:
													if (typeof card === "object" && get.type(card) === "delay") {
														if (target.countCards("j")) return [1, -4];
													}
													if (get.tag(card, "damage") || get.tag(card, "losehp")) {
														if (target.countCards("j") <= 1) return [1, 2, 1, -3];
													}
													break;
												case 1:
													return [1, 2, 1, -3];
											}
										}
									}
								},
							},
							xiangxing: {
								unique: true,
								init: function (player) {
									player.storage.xiangxing = 7;
									player.storage.xiangxing_count = 0;
									player.addSkill("xiangxing7");
								},
								mark: true,
								intro: {
									content: "当前有#枚星",
								},
								trigger: { player: ["damageEnd", "loseHpEnd"] },
								forced: true,
								popup: false,
								content: function () {
									"step 0";
									var num = trigger.num;
									if (num) {
										player.storage.xiangxing_count += num;
									}
									if (player.storage.xiangxing_count >= 7) {
										if (player.hasSkill("yueyin") && lib.skill.yueyin.skipDamage["x" + player.storage.xiangxing](player, trigger)) {
											event.goto(3);
										}
										player.removeSkill("xiangxing" + player.storage.xiangxing);
										player.storage.xiangxing--;
										player.storage.xiangxing_count = 0;
										player.updateMarks();
										if (player.storage.xiangxing) {
											player.addSkill("xiangxing" + player.storage.xiangxing);
										} else {
											player.awakenSkill("xiangxing");
										}
										player.popup("xiangxing");
										player.updateMarks();
										game.log(player, "失去了一枚星");
									} else {
										player.updateMarks();
										event.finish();
									}
									"step 1";
									var list = game.filterPlayer(c => c.isIn() && c.identity == "fan").sortBySeat();
									//var list = game.filterPlayer();
									//list.remove(player);
									//list.sort(lib.sort.seat);

									for (var i = 0; i < list.length; i++) {
										list[i].addTempSkill("sbfangzhu_baiban");
									}
									var list2 = [];
									for (var i = 0; i < list.length; i++) {
										list2.push(0);
									}
									for (var i = 0; i < 7 * list.length; i++) {
										list2[Math.floor(Math.random() * list2.length)]++;
									}
									event.list = list;
									event.list2 = list2;
									"step 2";
									if (event.list.length) {
										var target = event.list.shift();
										target.damage(event.list2.shift(), "thunder");
										player.line(target, "thunder");
										event.redo();
									}
									"step 3";
									var list = game.filterPlayer();
									for (var i = 0; i < list.length; i++) {
										if (list[i].identity == "fan") list[i].removeSkill("sbfangzhu_baiban");
									}
									if (player.storage.xiangxing == 0) {
										player.maxHp = 3;
										player.update();
									}
								},
								//subSkill: {
								//	baiban: {
								//		charlotte: true,
								//		init(player, skill) {
								//			player.addSkillBlocker(skill);
								//			//player.addTip(skill, "放逐 技能失效");
								//		},
								//		onremove(player, skill) {
								//			player.removeSkillBlocker(skill);
								//			//player.removeTip(skill);
								//		},
								//		skillBlocker: function (skill, player) {
								//			return !lib.skill[skill].persevereSkill && !lib.skill[skill].charlotte;
								//		},
								//		mark: true,
								//		//inherit: "baiban",
								//		marktext: "逐",
								//		intro: {
								//			content: function (storage, player, skill) {
								//				var list = player.getSkills(null, false, false).filter(function (i) {
								//					return lib.skill.xiangxing_baiban.skillBlocker(i, player);
								//				});
								//				if (list.length) return "失效技能：" + get.translation(list);
								//				return "无失效技能";
								//			},
								//		},
								//	},
								//},
							},

							fengqi: {
								trigger: { player: ["phaseZhunbeiBegin", "phaseJieshuBegin"] },
								direct: true,
								async content(event, trigger, player) {
									var list = { basic: [], equip: [], trick: [], delay: [] };
									for (var i = 0; i < lib.inpile.length; i++) {
										var name = lib.inpile[i];
										var info = lib.card[name];
										if (info.autoViewAs || name == "yuansuhuimie") continue;
										if (lib.filter.cardEnabled({ name: name }, player)) {
											if (!list[info.type]) {
												list[info.type] = [];
											}
											list[info.type].push([get.translation(lib.card[name].type), "", name]);
										}
									}
									list.trick.sort(lib.sort.name);
									var dialog = ui.create.dialog("风起", [list.trick, "vcard"]);
									// for(var i in list){
									//		dialog.addText(get.translation(i)+'牌');
									//		dialog.add([list[i],'vcard']);
									// }
									var rand1 = Math.random() < 1 / 3;
									var rand2 = Math.random() < 0.5;
									var rand3 = Math.random() < 1 / 3;
									var rand4 = Math.random() < 1 / 3;

									var usednum = 0;
									var totalusenum = 1;

									while (usednum < totalusenum) {
										const result = await player.chooseButton(dialog).set("ai", function (button) {
											var name = button.link[2];
											if (player.hp <= 1) {
												switch (name) {
													case "zhiliaobo":
														return 1;
													case "dunpaigedang":
														return 0.8;
													case "nanman":
														return 0.5;
													default:
														return 0;
												}
											}
											if (rand4 && player.countCards("h") <= 1) {
												switch (name) {
													case "zengbin":
														return 1;
													case "wuzhong":
														return 0.8;
													default:
														return 0;
												}
											}
											if (player.hasSkill("qinglonglingzhu")) {
												if (rand2) return name == "chiyuxi" ? 0.8 : 0;
												return name == "jingleishan" ? 0.8 : 0;
											}
											if (rand2) return name == "wanjian" ? 0.8 : 0;
											return name == "nanman" ? 0.8 : 0;
										}).forResult();
										if (result.bool) {
											player.chooseUseTarget(result.links[0][2], true, false);
											usednum++;
										}
										else break;
									}
								},
								ai: {
									threaten: 3,
								},
							},
							gaiming: {
								trigger: { player: "judgeBefore" },
								direct: true,
								priority: 1,
								unique: true,
								content: function () {
									"step 0";
									event.cards = get.cards(7);
									player.chooseCardButton(true, event.cards, "改命：选择一张牌作为你的" + trigger.judgestr + "判定结果").ai = function (button) {
										if (get.attitude(player, trigger.player) > 0) {
											return 1 + trigger.judge(button.link);
										}
										if (get.attitude(player, trigger.player) < 0) {
											return 1 - trigger.judge(button.link);
										}
										return 0;
									};
									"step 1";
									if (!result.bool) {
										event.finish();
										return;
									}
									player.logSkill("gaiming", trigger.player);
									var card = result.links[0];
									event.cards.remove(card);
									var judgestr = get.translation(trigger.player) + "的" + trigger.judgestr + "判定";
									event.videoId = lib.status.videoId++;
									event.dialog = ui.create.dialog(judgestr);
									event.dialog.classList.add("center");
									event.dialog.videoId = event.videoId;

									game.addVideo("judge1", player, [get.cardInfo(card), judgestr, event.videoId]);
									for (var i = 0; i < event.cards.length; i++) event.cards[i].discard();
									// var node=card.copy('thrown','center',ui.arena).addTempClass('start');
									var node;
									if (game.chess) {
										node = card.copy("thrown", "center", ui.arena).addTempClass("start");
									} else {
										node = player.$throwordered(card.copy(), true);
									}
									node.classList.add("thrownhighlight");
									ui.arena.classList.add("thrownhighlight");
									if (card) {
										trigger.cancel();
										trigger.result = {
											card: card,
											judge: trigger.judge(card),
											node: node,
											number: get.number(card),
											suit: get.suit(card),
											color: get.color(card),
										};
										if (trigger.result.judge > 0) {
											trigger.result.bool = true;
											trigger.player.popup("改命成功");
										}
										if (trigger.result.judge < 0) {
											trigger.result.bool = false;
											trigger.player.popup("改命失败");
										}
										game.log(trigger.player, "的判定结果为", card);
										trigger.direct = true;
										trigger.position.appendChild(card);
										game.delay(2);
									} else {
										event.finish();
									}
									"step 2";
									ui.arena.classList.remove("thrownhighlight");
									event.dialog.close();
									game.addVideo("judge2", null, event.videoId);
									ui.clear();
									var card = trigger.result.card;
									trigger.position.appendChild(card);
									trigger.result.node.delete();
									game.delay();
								},
								ai: {
									effect: {
										target(card, player, target) {
											if (typeof card !== "object" || get.type(card) !== "delay") return;
											if (target.storage.xiangxing === 2 && target.storage.xiangxing_count > 4 && target.hasSkill("xiangxing") && target.hasSkill("yueyin")) return;
											return 0.13;
										}
									}
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
								usable: 30,
								filter: function (event, player) {
									return event.result && event.result.length >= 1 && event.player != player && (player.name1 == "boss_caocao" || player.name2 == "boss_caocao");
								},
								content: function () {
									'step 0'
									//console.log(_status.event.getParent());
									//console.log(_status.event.getParent().cards);
									////event.cards = trigger.result;
									//trigger.player.chooseCard(
									//	function (card) {
									//		console.log(_status.event.getParent().cards);
									//		return _status.event.getParent().cards.includes(card);
									//	},
									//	"归心：交给" + get.translation(player) + "一张牌",
									//	true
									//);
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
								trigger: { player: "phaseAfter" },
								direct: true,
								init: function (player) {
									player.storage.xiongcai = [];
									// player.storage.xiongcai2=0;
								},
								intro: {
									content: "characters",
								},
								content: function () {
									"step 0";
									// if(player.storage.xiongcai2<1){
									//		player.storage.xiongcai2++;
									//		event.finish();
									// }
									// else{
									//		player.storage.xiongcai2=0;
									// }
									"step 1";
									player.logSkill("xiongcai");
									var list = [];
									var list2 = [];
									var players = game.players.concat(game.dead);
									for (var i = 0; i < players.length; i++) {
										list2.add(players[i].name);
										list2.add(players[i].name1);
										list2.add(players[i].name2);
									}
									for (var i in lib.character) {
										if (lib.character[i][1] != "wei") continue;
										if (lib.character[i].isBoss) continue;
										if (lib.character[i].isMinskin) continue;
										if (player.storage.xiongcai.includes(i)) continue;
										if (list2.includes(i)) continue;
										list.push(i);
									}
									var name = list.randomGet();
									player.storage.xiongcai.push(name);
									player.markSkill("xiongcai");
									var skills = lib.character[name][3];
									for (var i = 0; i < skills.length; i++) {
										player.addSkill(skills[i]);
									}
									game.broadcastAll((player, name) => {
										event.dialog = ui.create.dialog(
											'<div class="text center">' + get.translation(player) + "发动了【雄才】",
											[[name], "character"]
										);
									}, player, name);
									game.delay(2);
									"step 2";
									game.broadcastAll(() => { event.dialog.close(); });
								},
							},
							xiaoxiong: {
								trigger: { global: 'useCardAfter' },
								forced: true,
								unique: true,
								forceunique: true,
								filter: function (event, player) {
									var type = get.type(event.card, 'trick');
									return event.player != player && (type == 'basic' || type == 'trick') && (player.name1 == "boss_liubei" || player.name2 == "boss_liubei");
								},
								content: function () {
									"step 0";
									player.gain(game.createCard(trigger.card), 'gain2');
									"step 1";
									player.draw();
									//player.recover();
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
								global: "boss_zhangwu_ai",
								trigger: { player: "damageEnd" },
								check: function (event, player) {
									return event.source && event.source.isIn() && get.damageEffect(event.source, player, player) > 0;
								},
								filter: function (event) {
									return event.source && event.source.isAlive() && (player.name1 == "boss_liubei" || player.name2 == "boss_liubei");
								},
								direct: true,
								logTarget: "source",
								content: function () {
									"step 0";
									player
										.chooseToDiscard(get.prompt("boss_zhangwu", trigger.source), "he", [1, Infinity])
										.set("ai", function (card) {
											//if (get.attitude(player, target) < 0) return 8 - get.value(card);
											if (trigger.source.getEquip("baiyin") != null || trigger.source.getEquip("rw_baiyin") != null) return 0.2;
											return 8 - get.value(card);
											//return trigger.source.countCards("he") + 1;
											//return 3
										})
										.set("logSkill", ["boss_zhangwu", trigger.source]);
									"step 1";
									if (result.bool) {
										var num = result.cards.length;
										var cnum = get.cnNumber(num);
										event.num = num;
										trigger.source.chooseToDiscard("he", "章武：弃置" + cnum + "张牌，或取消并受到" + cnum + "点伤害", num).set("ai", function (card) {
											if (!trigger.source.hasSkillTag("nodamage")) return 10 - get.value(card);
											return 0;
										});
									} else {
										event.finish();
									}
									"step 2";
									if (!result.bool) {
										trigger.source.damage(event.num);
									}
								},
								ai: {
									maixie: true,
									maixie_hp: true,
									effect: {
										target: function (card, player, target) {
											if (get.tag(card, "damage") && player.countCards("he") < target.countCards("he")) {
												return [0, 2];
											}
										},
									},
								},
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
								trigger: {
									global: "phaseBefore",
									player: "enterGame",
								},
								filter(event, player) {
									return !player.storage.huanhua_chufa;
								},
								forced: true,
								unique: true,
								content: function () {
									player.storage.huanhua_chufa = true;
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
								filter(event, player) {
									return player.name1 == "boss_sunce" || player.name2 == "boss_sunce";
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
							// fan: '<span style="color:#faecd1;data-nature="orangemm;">盟</span>',
							// zhong: '<span data-color="zhong">从</span>',
							// nei: '<span data-color="nei">箱</span>',
							// fan2: ' ',
							// zhu2: ' ',
							// zhong2: ' ',
							// nei2: ' ',
							sw_getSkill: '灵韵',
							sw_huisheng: '回生',
							sw_huisheng_info: '限定技，当你处于濒死状态时，你可以弃置你区域内的所有牌并复原你的武将牌，然后摸三张牌并将体力回复至3点。（此技能在下一关会被清除）',
							sw_getHuihe: '额外',
							sw_test: '测试',
							sw_test_info: '技能仅供测试。',
							sw_bossGetSkill: '圣战',
							sw_bossGetSkill2: '狂暴',
							sw_xionge: '凶恶',
							sw_bossGetSkill_info: '锁定技。游戏开始时，你获得等同于BOSS击杀次数个随机技能，然后失去此技能。',
							sw_bossGetSkill2_info: '锁定技。你的每个回合开始时，你获得2个随机技能。',
							sw_silverchest: "白银宝箱",
							sw_goldchest: "黄金宝箱",
							sw_diamondchest: "钻石宝箱",
							sw_ironchest: "黑铁宝箱",
							sw_legendchest: "传奇宝箱",
							sw_chest: "聚宝",
							sw_chest_info: "持恒技。当你受到伤害后，你摸一张牌并令伤害来源随机获得你区域内的X张牌(X为伤害值)。你始终跳过出牌和弃牌阶段且你无法使用和打出任何手牌。",
							sw_chestsilver: "白银",
							sw_chestsilver_info: "持恒技。杀死你的角色若为盟军，则其摸5张牌并回复1点体力。若其持有白银钥匙，则其可以选择一项白银奖励。",
							sw_chestgold: "黄金",
							sw_chestgold_info: "持恒技。杀死你的角色若为盟军，则其获得20点灵气。若其持有黄金钥匙，则其可以选择一项黄金奖励。",
							sw_chestdiamond: "钻石",
							sw_chestdiamond_info: "持恒技。杀死你的角色若为盟军，则其增加1点体力上限并将体力回复至体力上限。若其持有钻石钥匙，则其可以选择一项钻石奖励。",
							sw_chest_egend: "传奇",
							sw_chestlegend_info: "持恒技。杀死你的角色若为盟军，则其可以获得一项自选技能。",
							sw_chestiron: "黑铁",
							sw_chestiron_info: "持恒技。杀死你的角色可以选择失去武将牌上的任意一个技能。",


							boss_lvbu: '将领',
							mengjun: '盟军',
							boss_caocao: '魏武大帝',
							boss_liubei: '蜀汉烈帝',
							boss_zuoci: '迷之仙人',

							boss_huangyueying: "奇智女杰",
							boss_zhangchunhua: "冷血皇后",
							boss_satan: "堕落天使",
							boss_dongzhuo: "乱世魔王",
							boss_zhouyu: "赤壁火神",
							boss_pangtong: "涅槃凤雏",
							boss_zhugeliang: "祭风卧龙",
							boss_zhenji: "洛水仙子",

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
							boss_guixin_info: '锁定技，每回合限30次，其他角色摸牌时，须将摸到的牌中的一张交给你。（此技能仅魏武大帝可用）',
							xiongcai: '雄才',
							xiongcai_info: '锁定技，你在回合结束后随机获得一个魏势力角色的所有技能。',
							xiaoxiong: '枭雄',
							xiaoxiong_info: '锁定技，每当一名其他角色使用一张基本牌或锦囊牌，你获得一张与之同名的牌并摸一张牌；在一名其他角色的结束阶段，若其本回合没有使用牌，你对其造成1点伤害。(此技能仅蜀汉烈帝可用)',
							boss_zhangwu: '章武',
							boss_zhangwu_info: '每当你受到一次伤害，你可以弃置任意张牌并令伤害来源选择一项：弃置等量的牌，或受到等量的伤害。(此技能仅蜀汉烈帝可用)',

							fanghua: "芳华",
							fanghua_info: "持恒技。结束阶段，你可以令所有已翻面角色失去1点体力。每当有角色失去体力，你增加1点体力上限。（此技能仅洛水仙子可用）",
							tashui: "踏水",
							tashui_info: "持恒技。每当你使用或打出一张黑色牌，你可以令一名其他角色翻面。（此技能仅洛水仙子可用）",
							jiaoxia: "皎霞",
							jiaoxia_info: "持恒技。每当你成为其他角色使用红色牌的目标时，你可以摸体力上限张牌。（此技能仅洛水仙子可用）",
							lingbo: "凌波",
							lingbo_info: "你的回合内，当你受到伤害或失去体力时，取消之。（此技能仅洛水仙子可用）",

							xiangxing: '禳星',
							xiangxing_info: '锁定技，游戏开始时，你获得7枚星；每当你累计扣减7点体力，你失去一枚星，并造成 7*盟军存活人数 点雷属性伤害，随机分配给其他盟军角色，你令所有其他盟军角色技能失效直到技能结算完毕；当你失去全部星后，你的体力上限变为3。',
							yueyin: '月隐',
							yueyin_info: '锁定技，你的每一枚星对应的一个特定条件，当你失去星时，若满足此条件，则不结算雷电伤害。',
							xiangxing7_info: '你没有手牌',
							xiangxing6_info: '此次受到的是火属性伤害',
							xiangxing5_info: '此次受到的是雷属性伤害',
							xiangxing4_info: '此次为失去体力',
							xiangxing3_info: '一名其他角色有至少4件装备',
							xiangxing2_info: '你的判定区内至少有一张牌',
							xiangxing1_info: '场上存活盟军角色的血量均为1',
							gaiming: '改命',
							gaiming_info: '锁定技，在你的判定牌生效前，你观看牌堆顶的七张牌并选择一张作为判定结果，此结果不可更改。',
							fengqi: '风起',
							fengqi_info: '准备阶段和结束阶段，你可以视为使用任意一张普通锦囊牌。',


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
							"boss_hunyou_info": "锁定技，你的体力值变化和体力上限变化无效。（此技能仅那个男人可用）",
							"boss_taoni": "讨逆",
							"boss_taoni_info": "锁定技。当有角色使用牌后，若你的体力值不为最高，则你令所有体力值高于你的角色失去体力至与你相同。（此技能仅那个男人可用）",
						},
					},
					eltp: {
						dieAfter: function (source) {
							if (this === game.zhu) {
								//if (game.zhu !== game.me) {
								//	game.over(true)
								//} else {
								//	game.over(false)
								//}
							} else if (game.players.length === 1) {
								if (game.zhu.isDead()) {
									if (game.me == game.zhu) {
										game.over(false)
									} else {
										game.over(true)
									}
								} else {
									game.over(false)
								}
							} else if (get.population("fan") == 0) {
								game.over(false)
							}
							return
						},
						dieAfter2: function (source) {
							if (this === game.zhu) {

								var next = game.createEvent("ywzq_revive", false);
								next.setContent(() => {
									"step 0";
									var evt = _status.event.getParent("phaseUse");
									if (evt && evt.name == "phaseUse") {
										evt.skipped = true;
									}
									var evt = _status.event.getParent("phase");
									if (evt && evt.name == "phase") {
										evt.finish();
									}
									"step 1";
									event.targets = [];
									var dead = game.dead.slice(0);
									if (_status.gameInfomation.huanhundan > 0) {
										for (var i = 0; i < dead.length && _status.gameInfomation.huanhundan > 0; i++) {
											if (dead[i] != game.zhu && !dead[i].side) {
												if (dead[i].maxHp <= 0) {
													game.broadcastAll((player) => {
														player.maxHp = 1;
														player.update();
													}, dead[i]);
												}
												event.targets.push(dead[i]);
												_status.gameInfomation.huanhundan--;
											}
										}
									}
									"step 2";
									if (event.targets.length) {
										var target = event.targets.shift();
										game.createTip(`【${target.nickname || "电脑玩家"}】已被还魂丹复活！`);

										game.broadcastAll((p) => {
											p.revive(Math.min(4, p.maxHp));
											p.update();
										}, target)

										target.draw(4, false);
										target.$draw(4);

										event.redo();
										event.dealy = true;
									}
									"step 3";
									if (event.dealy) {
										game.delay();
									}
								});

								var next = game.createEvent("ywzq_replace", false);
								next.setContent(() => {
									"step 0";
									//game.broadcastAll(() => {
									//	ui.arena.setNumber(parseInt(ui.arena.dataset.number) + 1);
									//	var fellow = game.addFellow(1, "zhaoyun", "zoominanim");
									//	fellow.directgain(get.cards(4));
									//	fellow.side = true;
									//	fellow.identity = "zhong";
									//	fellow.setIdentity("zhong");
									//	fellow.identityShown = true;
									//	fellow.node.identity.classList.remove("guessing");
									//	game.addVideo("setIdentity", fellow, "zhong");
									//})
									//var evt = trigger.getParent("phaseUse");
									//if (evt && evt.name == "phaseUse") {
									//	evt.skipped = true;
									//}
									//var evt = trigger.getParent("phase");
									//if (evt && evt.name == "phase") {
									//	game.log(evt.player, "结束了回合");
									//	evt.finish();
									//	evt.untrigger(true);
									//}

									_status.gameInfomation.killNum[0]++;
									game.broadcastAll((mm) => {
										var str = "BOSS 已被击杀！击杀次数：" + mm
										if ((mm + 1) % 3 == 0) str += "，所有玩家技能上限+1";
										game.createTip(str);
									}, _status.gameInfomation.killNum[0])
									event.targets = game.filterPlayer(function (current) {
										return current.isIn() && current.identity == "fan";
									}).sortBySeat(game.zhu || player);

									if ((_status.gameInfomation.killNum[0] + 1) % 3 == 0) {
										for (var p of event.targets) {
											p.storage.sw_getSkillMaxcnt++;
										}
									}
									"step 1";
									var target = targets.shift();
									event.target = target;

									var list = ["回复1点体力并摸一张牌", "摸三张牌", "将一张防具牌置入装备区并摸一张牌", "将一张武器牌置入装备区并摸一张牌", "回复2点体力并弃置一张牌", "摸五张牌，然后弃置三张牌", "获得两张锦囊牌", "获得五张基本牌", "失去1点体力，然后摸五张牌", "失去体力至1点，然后摸七张牌", "获得三点“灵气”", "获得五点“灵气”", "获得两点护甲", "获得还魂丹一个", "体力上限+1", "向当前牌堆中添加六根【如意金箍棒】", "向当前牌堆中添加各个花色的8点【毒】各五张", "获得还魂丹一个，体力上限+1", "获得一个不计上限的随机技能", "从游戏外获得两张【桃园结义】", "复原武将牌并恢复所有废弃的装备栏", "在下一关中获得技能【回生】"].randomGets(4);
									event.lt = list;
									target
										.chooseControl()
										.set("choiceList", list)
										.set("prompt", "请选择一项奖励");
									"step 2";
									var str = event.lt[result.index];
									game.log(target, "选择了", "#y" + str);
									//game.createTip(`【${target.nickname || "电脑玩家"}】选择了：${str}`);

									if (str == "回复1点体力并摸一张牌") {
										target.recover();
										target.draw();
									} else if (str == "摸三张牌") {
										target.draw(3);
									} else if (str == "将一张防具牌置入装备区并摸一张牌") {
										var card = get.cardPile(function (card) {
											return get.subtype(card) == "equip2" && !get.cardtag(card, "gifts");
										});
										if (card) target.equip(card);
										target.draw();
									}
									else if (str == "将一张武器牌置入装备区并摸一张牌") {
										var card = get.cardPile(function (card) {
											return get.subtype(card) == "equip1" && !get.cardtag(card, "gifts");
										});
										if (card) target.equip(card);
										target.draw();
									}
									else if (str == "回复2点体力并弃置一张牌") {
										target.recover(2);
										target.chooseToDiscard("he", true);
									}
									else if (str == "摸五张牌，然后弃置三张牌") {
										target.draw(5);
										target.chooseToDiscard(3, "he", true);
									}
									else if (str == "从游戏外获得两张【桃园结义】") {
										let cards = [];
										while (cards.length < 2) {
											const card = game.createCard2("taoyuan", "heart", 1);
											cards.push(card);
										}
										if (cards.length) target.gain(cards, "gain2");
									}
									else if (str == "获得两张锦囊牌") {
										var list = [];
										while (list.length < 2) {
											var card = get.cardPile(function (card) {
												return !list.includes(card) && get.type(card, "trick") == "trick";
											});
											if (!card) break;
											list.push(card);
										}
										if (list.length) target.gain(list, "gain2", "log");
									}
									else if (str == "获得五张基本牌") {
										var list = [];
										while (list.length < 5) {
											var card = get.cardPile(function (card) {
												return !list.includes(card) && get.type(card) == "basic";
											});
											if (!card) break;
											list.push(card);
										}
										if (list.length) target.gain(list, "gain2", "log");
									}
									else if (str == "失去1点体力，然后摸五张牌") {
										target.loseHp();
										target.draw(5);
									}
									else if (str == "失去体力至1点，然后摸七张牌") {
										var num = target.hp - 1;
										if (num > 0) target.loseHp(num);
										target.draw(7);
									}
									else if (str == "获得三点“灵气”") {
										target.addMark("sw_getSkill", 3);
									}
									else if (str == "获得五点“灵气”") {
										target.addMark("sw_getSkill", 5);
									}
									else if (str == "获得一个不计上限的随机技能") {
										var list, skills = [];
										if (_status.connectMode) list = get.charactersOL();
										else {
											list = [];
											for (var i in lib.character) {
												if (lib.filter.characterDisabled2(i) || lib.filter.characterDisabled(i)) continue;
												list.push(i);
											}
										}
										for (var i of list) {
											if (i.indexOf("gz_jun") == 0) continue;
											for (var j of lib.character[i][3]) {
												if (j.indexOf("sw_") == 0 || j.indexOf("_sw_") == 0 || j.indexOf("qd_") == 0 || j.indexOf("zhinang") == 0 || j.indexOf("shiki_omusubi") == 0) continue;
												var skill = lib.skill[j];
												if (!skill || skill.zhuSkill) continue;
												if (skill.ai && (skill.ai.combo || skill.ai.notemp || skill.ai.neg)) continue;
												var info = get.translation(j + "_info");
												skills.add(j);
											}
										}
										list = skills
											.filter(function (i) {
												return !target.hasSkill(i, null, null, false);
											})
											.randomGets(1);
										if (list.length == 0) game.log(target, "没有技能可得");
										else {
											event.videoId = lib.status.videoId++;
											target.addSkills(list[0]);
										}

									}
									else if (str == "获得两点护甲") {
										target.changeHujia(2);
									}
									//else if (str == "可获得的技能上限+1，失去1点体力") {
									//	target.storage.sw_getSkillMaxcnt++;
									//	target.loseHp();
									//}
									//else if (str == "可获得的技能上限+1，弃置三张牌") {
									//	target.storage.sw_getSkillMaxcnt++;
									//	target.chooseToDiscard(3, "he", true);
									//}
									else if (str == "获得还魂丹一个") {
										_status.gameInfomation.huanhundan++;
										game.log(`还魂丹当前剩余量：${_status.gameInfomation.huanhundan}`);
										game.refreshInfo();
									}
									else if (str == "获得还魂丹一个，体力上限+1") {
										_status.gameInfomation.huanhundan++;
										game.log(`还魂丹当前剩余量：${_status.gameInfomation.huanhundan}`);
										target.gainMaxHp();
										game.refreshInfo();
									}
									else if (str == "体力上限+1") {
										target.gainMaxHp();
									}
									else if (str == "向当前牌堆中添加六根【如意金箍棒】") {
										var cds = [];
										for (var i = 2; i < 8; i++) {
											cds.push(game.createCard2("ruyijingubang", i % 2 ? "club" : "spade", i));
										}
										game.broadcastAll(function () {
											lib.inpile.add("ruyijingubang");
										});
										game.cardsGotoPile(cds, () => {
											return ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)];
										});
									}
									else if (str == "向当前牌堆中添加各个花色的8点【毒】各五张") {
										var cds = [];
										for (var i of lib.suit) {
											for (var j = 0; j < 5; j++) {
												cds.push(game.createCard2("du", i, 8));
											}
										}
										game.broadcastAll(function () {
											lib.inpile.add("du");
										});
										game.cardsGotoPile(cds, () => {
											return ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)];
										});
									}
									else if (str == "复原武将牌并恢复所有废弃的装备栏") {
										target.link(false);
										target.turnOver(false);
										var list = [];
										for (var i = 1; i <= 5; i++) {
											for (var j = 0; j < target.countDisabledSlot(i); j++) {
												list.push("equip" + i);
											}
										}
										target.enableEquip(list);
									}
									else if (str == "在下一关中获得技能【回生】") {
										target.addSkill("sw_huisheng");
										target.restoreSkill("sw_huisheng");
									}
									else target.draw(1);

									"step 3";
									if (event.targets.length) event.goto(1);
									"step 4";
									//定义下一关的BOSS
									const select = [
										{ name: "boss_zhenji", weight: 2 },
										{ name: "boss_zhugeliang", weight: 2 },
										{ name: "boss_zuoci", weight: 1 },
										{ name: "boss_caocao", weight: 1 },
										{ name: "boss_liubei", weight: 1 },
										{ name: "boss_sunce", weight: 1 },
									];

									var ll = _status.characterListSelect.randomGets(1);
									if (_status.gameInfomation.killNum[0] % 5 == 0) {//大BOSS关=============
										const totalWeight = select.reduce((sum, item) => sum + item.weight, 0);
										let random = Math.random() * totalWeight;
										for (let i = 0; i < select.length; i++) {
											random -= select[i].weight;
											if (random < 0) {
												ll[0] = select[i].name;
												game.log(ll);
												break;
											}
										}
									}
									//ll = select.randomGets(1);
									game.broadcastAll((list, p) => {
										p.revive(null, false);
										p.uninit();
										p.init(list[0]);
										p.update();
									}, ll, game.zhu)

									game.zhu.storage.sw_bossGetSkill_have = false;

									game.zhu.addSkill("sw_bossGetSkill");//圣战技能
									game.zhu.addSkill("sw_getHuihe");
									//game.zhu.addSkill("sw_qingchu");
									if (_status.gameInfomation.killNum[0] > 5) game.zhu.addSkill("sw_bossGetSkill2");//狂暴技能
									game.zhu.addSkill("sw_xionge");

									game.players.filter(p => p.identity == "fan").forEach(i => {
										i.addMark("sw_getSkill", 3);
									})
								},);
								let killNum_temp = _status.gameInfomation.killNum[0];
								game.zhu.lose(game.zhu.getCards("hej"))._triggered = null;
								game.zhu.gain(get.cards(4 + Math.min(killNum_temp, 8)))._triggered = null;
								if (Math.min(Math.floor(killNum_temp / 2), 5) != 0) game.zhu.gainMaxHp(Math.min(Math.floor(killNum_temp / 2), 7));
								game.zhu.recover(Math.min(Math.floor(killNum_temp / 2), 7));

								game.triggerEnter(game.zhu);

								game.zhu.checkMarks();

								//player.classList.add("highlight");

								game.zhu.insertPhase();

								var next = game.createEvent('ywzq_spawnChest');
								next.setContent(function () {
									// 事件内容
									const select = [
										{ name: "null", weight: 5 },
										{ name: "sw_silverchest", weight: 5 },
										{ name: "sw_goldchest", weight: 3 },
										{ name: "sw_diamondchest", weight: 1 },
									];
									var ll = "null";

									const totalWeight = select.reduce((sum, item) => sum + item.weight, 0);
									let random = Math.random() * totalWeight;
									for (let i = 0; i < select.length; i++) {
										random -= select[i].weight;
										if (random < 0) {
											ll = select[i].name;
											break;
										}
									}

									var locc = parseInt(Math.floor(Math.random() * game.players.concat(game.dead).length) + 1, 10);
									//console.log(locc);
									if (ll != "null") game.addZhuFellow(locc, ll, "nei");

								});
							}

						},
					},
					game: {
						createTip: function (text) {
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
						},
						addZhuFellow: function (position, name, identity = "zhong", side = null, animation = "zoominanim") {//此处的位置是相对于主公的位置，正数表示右边，负数表示左边,0表示主公左边1个（即在主公的位置，把主公往后推了一个）
							let players = game.players.concat(game.dead);
							let playerCnt = players.length;//总人数

							game.addVideo("addFellow", null, [position, name, animation]);

							game.broadcastAll((id, num, players, character, pos, identity, side) => {
								character = Array.isArray(character) ? character[0] : character;

								ui.arena.setNumber(num + 1);//设置多出一个位置

								if (game.zhu != null) {
									pos = (parseInt(game.zhu.dataset.position) + parseInt(pos) + parseInt(num * num)) % parseInt(num);//计算对于每个人视角下新增随从的相对位置
								}
								if (pos == 0) pos = num;

								players.forEach(value => {
									if (parseInt(value.dataset.position) >= pos) value.dataset.position = parseInt(value.dataset.position) + 1;//将新增随从后面的人位置+1
								});

								let fellow = ui.create.player();
								game.zhuFellow = fellow;
								fellow.playerid = id;
								game.playerMap[fellow.playerid] = fellow;
								lib.playerOL[fellow.playerid] = fellow;
								fellow.dataset.position = pos || playerCnt - 1;

								game.players.push(fellow);
								game.arrangePlayers();
								ui.arena.appendChild(fellow);
								//console.log(game.players);

								if (character) fellow.init(character);

								fellow.side = side;
								fellow.identity = identity;
								fellow.setIdentity(identity);
								fellow.identityShown = true;

								//game.addVideo('init', null, game.players.map(p => {
								//	return {
								//		name: p.name1,
								//		name2: p.name2,
								//		identity: (p === game.me || p === game.zhu) ? p.identity : 'cai'
								//	}
								//}))

								game.addVideo("setIdentity", fellow, "zhong");
							}, get.id(), playerCnt, players, name, position, identity, side);

							game.zhuFellow.directgain(get.cards(4));
						},

						removeZhuFellow: function (player) {
							let players = game.players.concat(game.dead);
							let playerCnt = players.length - 1;//随从后的总人数

							game.broadcastAll((num, players, diePlayer) => {
								ui.arena.setNumber(num);//设置多出一个位置

								players.forEach(value => {
									if (parseInt(value.dataset.position) > diePlayer.dataset.position) value.dataset.position = parseInt(value.dataset.position) - 1;//将新增随从后面的人位置+1
								});


								game.players.remove(diePlayer);
								game.dead.remove(diePlayer);
								game.arrangePlayers();
								delete game.playerMap[diePlayer.playerid];
								delete lib.playerOL[diePlayer.playerid];
								diePlayer.delete();

							}, playerCnt, game.players.concat(game.dead), player);
						},

						refreshInfo: function () {
							game.broadcast((info) => {
								_status.gameInfomation = info;
							}, _status.gameInfomation)
						},

						getSWSkillsList: function (player = undefined, isAll = false) {//全扩获取技能
							const banSkill = ["kunyu", "twfuxi", "dclieqiong", "new_dclieqiong", "iwasawa_mysong", "twfengpo", "twgongge"];
							var skills = [];
							var list = {};
							if (!isAll) list = get.charactersOL();
							else list = lib.character;
							for (var i of list) {
								if (i.indexOf("gz_jun") == 0) continue;
								for (var j of lib.character[i][3]) {//j为技能名
									if (!lib.translate[j]) continue;
									if (j.indexOf("sw_") == 0 || j.indexOf("_sw_") == 0 || j.indexOf("qd_") == 0) continue;
									var skill = lib.skill[j];
									if (!skill || skill.zhuSkill) continue;
									if (skill.ai && (skill.ai.combo || skill.ai.notemp || skill.ai.neg)) continue;

									if (player != undefined && player.getSkills(true, false, false).includes(j)) continue;
									if (banSkill.includes(j)) continue;
									//var info = get.translation(j + "_info");
									skills.add(j);
								}
							}
							return skills;
						},

					},
				}

				for (var i in mode.pack) {
					for (var j in mode.pack[i]) lib[i][j] = mode.pack[i][j];
				}
				//for (var i in mode.eltc) lib.element.content[i] = mode.eltc[i];
				for (var i in mode.eltp) lib.element.player[i] = mode.eltp[i];
				for (var i in mode.game) game[i] = mode.game[i];
				//for (var i in mode.get) get[i] = mode.get[i];
				lib.yongwangzhiqian = mode;

			});


			game.broadcastAll(function () {
				lib.inpile.remove('muniu');
				lib.inpile.remove('bingliang');
				lib.inpile.remove('lebu');
			});
			const cardsList = Array.from(ui.cardPile.childNodes).filter(currentcard => currentcard.name == 'muniu' || currentcard.name == 'bingliang' || currentcard.name == 'lebu');
			const cardsList2 = Array.from(ui.cardPile.childNodes).filter(currentcard => currentcard.name != 'muniu' && currentcard.name != 'bingliang' && currentcard.name != 'lebu');
			game.cardsGotoSpecial(cardsList);

			var cards = [];
			for (var i = 0; i < cardsList2.length; i++) {
				cards.push(game.createCard2(cardsList2[i]));
				cards.push(game.createCard2(cardsList2[i]));
				cards.push(game.createCard2(cardsList2[i]));
			}
			game.cardsGotoPile(cards, () => {
				return ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)];
			});

			_status.randomSkill = true
			_status.videoInited = true
			lib.playerSkillOL = {}
			game.broadcast((copyCharacter) => {
				if (!window.suiSet) {
					window.suiSet = { copyCharacter }
				}
			}, suiSet.copyCharacter)
			_status.playerCharacters = {}
			const initSkillInfo = skills => {
				if (!Array.isArray(skills)) skills = [skills]
				let str = ''
				skills.forEach(s => {
					if (s === 'changeUseSkill') return
					str += get.translation(s) + ' '
				})
				return str
			}
			_status.characterListSelect = Object.keys(suiSet.initList());
			const characterList = _status.characterListSelect;
			const skillList = game.getSWSkillsList();
			//const theSkills = lib.character[s][3]
			//theSkills.forEach(t => {
			//	const info = lib.skill[t]
			//	if (!info) return
			//	if (info.equipSkill) return;
			//	const derivation = (Array.isArray(info.derivation) ? [...theSkills, ...info.derivation] : [...theSkills, info.derivation]).filter(Boolean)
			//	derivation.forEach(is => {
			//		const groupSkill = lib.skill[is]
			//		if (!groupSkill) return;
			//		const { subSkill, global, viewAs, chooseButton, mod, charlotte, equipSkill, content, nopop, dutySkill, hiddenSkill, juexingji, zhuSkill } = groupSkill
			//		if (!charlotte && !equipSkill && (subSkill || global || content || viewAs || chooseButton || mod) && !nopop && !dutySkill && !hiddenSkill && !juexingji && !zhuSkill) {
			//			skillList.add(is)
			//		}
			//	})
			//})
			/*			})*/
			// const cards = suiSet.getCardPileSkills().filter(c=>c+"_skill" in lib.skill&&lib.skill[c+"_skill"].equipSkill)
			// cards.forEach(c=>skillList.push(c))

			_status.style = {
				innerHTML:/*css*/`
                .player .playerskillList {
                    color: orange;
                    font-weight: 700;
                    text-shadow: 1px 1px black;
                    z-index: 90000000;
                }
                .player:not([data-position="0"]) .playerskillList {
                    width: 70px;
                    height: auto;
                    top: 35%;
                    border-radius: 5px;
                    text-align: center;
                    line-height: 2;
                    left: 20%;
                    padding: 0 10px;
                    font-size: 15px;
                }
                .player[data-position="0"] .playerskillList {
                    top: -30px;
                    left: 15px;
                }
            `
			}

			const [plays, aplays] = suiSet.connect_players();
			game.players.forEach(element => element.identity = 'fan');//遍历所有玩家，把他们都设置成反贼
			if (aplays.length > 0) game.zhu = aplays.randomGet()//人机必定是主公
			else game.zhu = plays.randomGet()

			game.broadcastAll((zhu, setSeat) => {
				game.zhu = zhu
				game.zhu.isZhu = true
				game.zhu.identityShown = true
				game.zhu.identity = 'zhu'
				game.zhu.setIdentity('zhu')
				setSeat(game.zhu)
				const players = game.players.filter(p => p !== game.zhu)
				players.forEach((p, i) => {
					p.identity = "fan"
					p.setIdentity("fan")
					p.identityShown = true
				})
				if (!ui.count_dan) {
					ui.count_dan = ui.create.system("还魂丹", null, true, true);
				}
				lib.setPopped(
					ui.count_dan,
					function () {
						var uiintro = ui.create.dialog("hidden");

						uiintro.add("还魂丹");
						var table = ui.create.div(".bosschongzheng");

						uiintro.add(`<div class="text center">还魂丹剩余数量：${_status.gameInfomation.huanhundan}</div>`);
						uiintro.add(`<div class="text center">BOSS击杀次数：${_status.gameInfomation.killNum[0]}</div>`);
						uiintro.add(ui.create.div(".placeholder.slim"));

						return uiintro;
					},
					180
				);

				//if (!ui.huanhuazhizhan) {
				//	ui.huanhuazhizhan = ui.create.div(".touchinfo.left", ui.window);
				//}
				//ui.huanhuazhizhan.innerHTML = "无尽模式";

			}, game.zhu, suiSet.setPlayersSeat)

			const clp = characterList.randomGets(10);
			game.broadcastAll((list, pls) => {
				pls.forEach((p, i) => {
					if (!p.nickname) {
						lib.character[list[i]][3] = []
						lib.character[list[i]][2] = 4//TODO: 存在疑问？
						p.init(list[i])
						//lib.playerCharacterOL[p.playerid] = list[i];
						//p.addSkill("sw_bossGetSkill");
					}
				})
				game.me.update()
			}, clp, aplays)


			const skillMap = {}
			game.players.forEach(p => {
				skillMap[p.playerid] = skillList.randomGets(24)
				if (p.nickname == "守望" || p.nickname == "神守望") {
					//此处可添加测试性技能

					skillMap[p.playerid].add("sw_test");
				}
				//skillList.removeArray(skillMap[p.playerid])
				lib.playerSkillOL[p.playerid] = skillMap[p.playerid]
			})
			skillMap[game.zhu.playerid] = [];
			const initPlayers = game.players.map(p => {
				if (p.ws || p === game.me) {
					let avatar
					let nickname
					if (p === game.me) {
						avatar = lib.config.connect_avatar
						nickname = lib.config.connect_nickname
					} else {
						avatar = p.ws.avatar
						nickname = p.nickname
					}
					game.addVideo('initAvatar', null, { avatar, nickname, playerid: p.playerid })
					return [p, avatar, skillMap[p.playerid]]
				}
			}).filter(Boolean)
			game.broadcastAll((players, { me, name, avatar, skill }) => {
				players.forEach(([player, avatar, skill]) => {
					player.nowSkill = skill
					const nickname = player.nickname
					const id = nickname + player.playerid
					suiSet.copyCharacter({
						character: avatar,
						hp: 4,
						skills: [],
						name: id,
						translate: nickname
					})
					player.init(id)
				})
				name = name.replace('※', '')
				const id = name + me.playerid
				suiSet.copyCharacter({
					character: avatar,
					hp: 4,
					skills: [],
					name: id,
					translate: name
				})
				me.init(id)
				me.update()
				me.nowSkill = skill
			}, initPlayers, { me: game.me, name: lib.config.connect_nickname, avatar: lib.config.connect_avatar, skill: skillMap[game.me.playerid] })

			game.addVideo('init', null, game.players.map(p => {
				return {
					name: p.name1,
					name2: p.name2,
					identity: (p === game.me || p === game.zhu) ? p.identity : 'cai'
				}
			}))


			//function addfe(position, character, animation = "zoominanim") {
			//	game.addVideo("addFellow", null, [position, character, animation]);

			//	const totalPlayerNum = game.players.length + game.dead.length;
			//	position = (position + game.zhu.dataset.position + totalPlayerNum) % totalPlayerNum;
			//	//alert(position);

			//	game.broadcastAll((position) => {
			//		ui.arena.setNumber(totalPlayerNum + 1);

			//		const player = ui.create.player(ui.arena).addTempClass(animation || "start");//在布局面板中创建一个player用于显示
			//		player.dataset.position = position || game.players.length + game.dead.length;

			//		player.getId();
			//		if (character) player.init(character);
			//		game.players.push(player);

			//		game.players
			//			.concat(game.dead)
			//			.sort(lib.sort.position)
			//			.forEach((p) => {
			//				if (p.dataset.position >= player.dataset.position) p.dataset.position++;
			//			})
			//		game.playerMap = {};
			//		var players = game.players.concat(game.dead);
			//		for (var i = 0; i < players.length; i++) {
			//			game.playerMap[players[i].dataset.position] = players[i];
			//		}

			//		game.arrangePlayers();

			//		player.gain(4)._triggered = null;
			//		player.side = false;
			//		player.identity = "zhong";
			//		player.setIdentity("zhong");
			//		player.identityShown = true

			//		//fellow.setSeatNum(position);
			//	}, position)
			//}
			//addfe(3, "zhaoyun");
			//game.players
			//	.concat(game.dead)
			//	.sort(lib.sort.position)
			//	.forEach((p) => {
			//		alert(p.name1 + p.dataset.position);
			//	})




			const next = game.createEvent('chooseCharacter')
			next.setContent(async event => {


				lib.playerCharacterOL = {}
				_status.playerCharacters = {}
				_status.characterlist = characterList.slice()
				_status.skillList = skillList
				_status.skillList2 = skillList.slice()


				game.broadcastAll(() => ui.arena.classList.add('choose-character'))

				//选技能
				const skList = game.players.map(i => {
					const lt = [];
					for (const skill of skillMap[i.playerid]) lt.push([skill, '<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">【' + get.translation(skill) + "】</div><div>" + lib.translate[skill + "_info"] + "</div></div>"]);
					return [i, ['你可以选择三个初始技能（可以触发“游戏开始时”时机）', [lt, 'textbutton']], 3, true]
				})

				if (game.me != game.zhu) {
					const xuanjineng = await game.me.chooseButtonOL(skList);

					for (const i in xuanjineng.result) {
						const player = lib.playerOL[i]
						const bool = xuanjineng.result[i]
						if (!bool.bool) {
							if (skillMap[player.playerid] && skillMap[player.playerid].length > 3) skillMap[player.playerid] = skillMap[player.playerid].randomGets(3);
							continue
						}
						const skills = xuanjineng.result[i].links
						skillMap[player.playerid] = xuanjineng.result[i].links
					}
				}

				//选势力
				const select = lib.group.map(g => ['', '', `group_${g}`])
				const groupList = game.players.map(i => {
					return [i, ['你可以选择一个势力', [select, 'vcard']], 1, false]
				})
				const shili = await game.me.chooseButtonOL(groupList, (player, result) => {
					if (!result) return
					if (player === game.me) {
						player.changeGroup(result.links[0][2].slice(6), false, false);
					}
				}).set('processAI', function () {
					return false
				})
				for (const g in shili.result) {
					if (!shili.result[g].bool) continue
					const player = lib.playerOL[g]
					const group = shili.result[g].links[0][2].slice(6)
					game.broadcastAll((player, group) => {
						lib.character[player.name1][1] = group
						player.changeGroup(group)
						//player.addSkill("xiangxing_baiban");
					}, player, group)
					game.addVideo('flashGroup', player, { group })
				}




				game.players.forEach(p => {
					game.broadcastAll((player, name, skill) => {
						//player.addSkill('sw_getSkill')
						player.nowSkill = skill
						player.addSkill(skill)
						lib.character[name][3] = skill
						player.firstCharacter = name
						if (player.nickname == "守望" || player.nickname == "神守望") {
							lib.characterSubstitute[name] = [];
							lib.characterSubstitute[name].push([name + "_shadow1", ["img: https://b0.bdstatic.com/ugc/V8res5ZIyEQ1vv7O6Ql19A03d71c8243056672399a4eebd72cf1fa.jpg"]]);
							lib.characterSubstitute[name].push([name + "_shadow2", ["img: https://img2.baidu.com/it/u=1280038412,797311059&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=823"]]);
							lib.characterSubstitute[name].push([name + "_shadow3", ["img: https://img2.baidu.com/it/u=3883723759,912156004&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=708"]]);
							lib.characterSubstitute[name].push([name + "_shadow4", ["img: https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F811d10fa-e850-4df0-ac57-229699c9ecb0%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1745842423&t=a7761d00b264c95c534e8754faabdbbf"]]);
							lib.characterSubstitute[name].push([name + "_shadow5", ["img: https://img0.baidu.com/it/u=2536943837,1492977612&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=616"]]);
							lib.characterSubstitute[name].push([name + "_shadow6", ["img: https://pic.rmb.bdstatic.com/bjh/058dc53124683a55cc1acd72e80a72fc2461.png@h_1280"]]);
						}
						if (player.nickname == "神山识") {
							lib.characterSubstitute[name] = [];
							lib.characterSubstitute[name].push([name + "_shadow1", ["img: https://img1.baidu.com/it/u=2513486530,1456942170&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667"]]);
							lib.characterSubstitute[name].push([name + "_shadow2", ["img: https://img0.baidu.com/it/u=1267198437,3811822010&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=500"]]);
							lib.characterSubstitute[name].push([name + "_shadow3", ["img: https://img2.baidu.com/it/u=1272673039,3136507784&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750"]]);
							lib.characterSubstitute[name].push([name + "_shadow4", ["img: https://img2.baidu.com/it/u=2929851874,2141388761&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=705"]]);
						}
						//if (player.nickname == "狗托" || player.nickname == "陆逊") {
						//	lib.characterSubstitute[name] = [];
						//	lib.characterSubstitute[name].push([name + "_shadow1", ["img: https://img1.baidu.com/it/u=2513486530,1456942170&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667"]]);
						//	lib.characterSubstitute[name].push([name + "_shadow2", ["img: https://img0.baidu.com/it/u=1267198437,3811822010&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=500"]]);
						//	lib.characterSubstitute[name].push([name + "_shadow3", ["img: https://img2.baidu.com/it/u=1272673039,3136507784&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750"]]);
						//	lib.characterSubstitute[name].push([name + "_shadow4", ["img: https://img2.baidu.com/it/u=2929851874,2141388761&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=705"]]);
						//}
					}, p, p.name1, skillMap[p.playerid])

					_status.playerCharacters[p.playerid] = {
						player: p,
						skills: lib.character[p.name1][3],
						name: (p.nickname && p.nickname.replace('※', '')) || '',
						character: p.name1,
						info: lib.character[p.name1],
						group: p.group,
						sex: p.sex,
					}
					if (game.videoContent.initSkill) {
						game.addVideo('initSkill', p, { skills: skillMap[p.playerid], zhu: p === game.zhu, me: p === game.me })
					}
				})

				game.broadcastAll(() => {
					lib.message.server.changeSkinFun = function (playerr) {
						game.broadcastAll((player) => {
							if (lib.characterSubstitute[player.firstCharacter]) {
								var num = Math.floor(Math.random() * lib.characterSubstitute[player.firstCharacter].length) + 1;
								player.changeSkin({ characterName: player.firstCharacter }, player.firstCharacter + "_shadow" + num);
							}
						}, playerr);
						game.log(playerr.nickname, "换肤成功！");
					};
					if (lib.characterSubstitute[game.me.firstCharacter] != undefined && lib.characterSubstitute[game.me.firstCharacter] != []) {
						if (ui.changeSkin) return;
						ui.changeSkin = ui.create.system(
							"换肤",
							function () {
								if (game.online) {
									game.send("changeSkinFun", game.me);
								}
								else {
									var playerr = game.me;
									game.broadcastAll((player) => {
										if (lib.characterSubstitute[player.firstCharacter]) {
											var num = Math.floor(Math.random() * lib.characterSubstitute[player.firstCharacter].length) + 1;
											player.changeSkin({ characterName: player.firstCharacter }, player.firstCharacter + "_shadow" + num);
										}
									}, playerr);
									game.log(playerr.nickname, "换肤成功！");
								}
							},
							true,
							true
						);
						lib.setPopped(
							ui.changeSkin,
							null,
							120
						);
					}
				});

				const aps = game.players.filter(p => p != game.zhu)//非主的所有玩家
				for (var i of aps) {
					i.addSkill("sw_getSkill");
					//i.addSkill("sw_viewTeamHandcard");
					//i.addSkill("sw_getSkillLimit");//限制技能的获取
				}
				game.broadcastAll((map) => {
					game.players.forEach(p => {
						if (!p.storage.sw_getSkillName) p.storage.sw_getSkillName = [];
						for (const abc of map[p.playerid]) {
							p.storage.sw_getSkillName.push(abc);
						}
					})
				}, skillMap);


				var list = ["_sw_chestDie", "_sw_zhuDie", "_sw_viewTeamHand"];
				for (var i = 0; i < list.length; i++) {
					game.addGlobalSkill(list[i]);
				}


				//观战和重连同步
				_status.reloadResource = (mode, characters, info) => {

					_status.gameInfomation = info;

					for (const c in characters) {
						const { name, character, info } = characters[c]
						//if (lp.includes(character)) info.skills.push('sw_getSkill')
						lib.character[character] = info
						if (name) {
							lib.translate[character] = name
						}
					}

					lib.group.push('lonely'); // 添加势力
					lib.translate.lonely = '望'; // 势力翻译
					lib.translate.lonely2 = '守望'; // 势力翻译
					lib.translate.lonelyColor = "#6652ff"; // 文字颜色\
					lib.groupnature.lonely = 'water'; // 描边颜色

					lib.group.push('chest'); // 添加势力
					lib.translate.chest = '箱'; // 势力翻译
					lib.translate.chest2 = '箱子'; // 势力翻译
					lib.translate.chestColor = "#FFD500"; // 文字颜色\
					lib.groupnature.chest = 'shen'; // 描边颜色


					if (!ui.count_dan) {
						ui.count_dan = ui.create.system("还魂丹", null, true, true);
					}
					lib.setPopped(
						ui.count_dan,
						function () {
							var uiintro = ui.create.dialog("hidden");

							uiintro.add("还魂丹");
							var table = ui.create.div(".bosschongzheng");

							uiintro.add(`<div class="text center">还魂丹剩余数量：${_status.gameInfomation.huanhundan}</div>`);
							uiintro.add(ui.create.div(".placeholder.slim"));

							return uiintro;
						},
						180
					);

					for (var i in mode.pack) {
						for (var j in mode.pack[i]) lib[i][j] = mode.pack[i][j];
					}
					//for (var i in mode.eltc) lib.element.content[i] = mode.eltc[i];
					for (var i in mode.eltp) lib.element.player[i] = mode.eltp[i];
					for (var i in mode.game) game[i] = mode.game[i];
				}

				game.broadcastAll(() => {
					setTimeout(function () {
						ui.arena.classList.remove('choose-character');
					}, 500);
				})
				_status.videoInited = false

				//game.zhu.die();
			})
		}

		game.chooseCharacterCloneOL = function () {
			const next = game.createEvent('chooseCharacter')
			next.setContent(async event => {
				const identityList = get.identityList(game.players.length).remove('zhu').randomSort().randomSort().randomSort()
				game.broadcastAll((zhu, setSeat, identityList) => {
					ui.arena.classList.add('choose-character');
					game.zhu = zhu
					game.zhu.isZhu = true
					game.zhu.identityShown = true
					game.zhu.identity = 'zhu'
					game.zhu.setIdentity('zhu')
					setSeat(game.zhu)
					const players = game.players.filter(p => p !== game.zhu)
					players.forEach((p, i) => {
						p.identity = identityList[i]
						p.setIdentity(p === game.me ? identityList[i] : 'cai')
					})
				}, game.players.randomGet(), suiSet.setPlayersSeat, identityList)
				const { list, list2, list3, list4, libCharacter } = suiSet.getSelecList()
				event.list = list
				event.list2 = list2
				_status.characterlist = list4.slice(0);
				game.broadcastAll((list, id) => {
					_status.characterlist = list;
					const filter = name => !_status.characterlist.includes(name);
					const dialog = ui.create.characterDialog('heightset', filter).open();
					dialog.videoId = id;
					ui.arena.classList.add('choose-character');
				}, list4, event.videoId)
				const { result } = await game.zhu.chooseButton(true).set('ai', Math.random).set('dialog', event.videoId)
				game.broadcastAll('closeDialog', event.videoId);
				game.broadcastAll(link => game.players.forEach(p => p.init(link)), result.links[0])
				game.broadcastAll((zhu, name, name2, addMaxHp) => {
					if (!zhu.name) zhu.init(name, name2);
					if (addMaxHp) {
						if (!zhu.isInitFilter('noZhuHp')) {
							zhu.maxHp++;
							zhu.hp++;
							zhu.update();
						}
					}
					ui.arena.classList.remove('choose-character');
				}, game.zhu, result.links[0], result.links[1], game.players.length > 4);
			})
		}

		game.chooseCharacterSkillOL = function () {
			_status.randomSkill = true
			_status.videoInited = true
			lib.playerSkillOL = {}
			game.broadcast((copyCharacter) => {
				if (!window.suiSet) {
					window.suiSet = { copyCharacter }
				}
			}, suiSet.copyCharacter)
			_status.playerCharacters = {}
			const initSkillInfo = skills => {
				if (!Array.isArray(skills)) skills = [skills]
				let str = ''
				skills.forEach(s => {
					if (s === 'changeUseSkill') return
					str += get.translation(s) + ' '
				})
				return str
			}
			_status.characterListSelect = Object.keys(suiSet.initList());
			const characterList = _status.characterListSelect
			const skillList = []
			characterList.forEach(s => {
				const theSkills = lib.character[s][3]
				theSkills.forEach(t => {
					const info = lib.skill[t]
					if (!info) return
					if (info.equipSkill) return;
					const derivation = (Array.isArray(info.derivation) ? [...theSkills, ...info.derivation] : [...theSkills, info.derivation]).filter(Boolean)
					derivation.forEach(is => {
						const groupSkill = lib.skill[is]
						if (!groupSkill) return;
						const { subSkill, global, viewAs, chooseButton, mod, charlotte, equipSkill, content, nopop, dutySkill, hiddenSkill, juexingji, zhuSkill } = groupSkill
						if (!charlotte && !equipSkill && (subSkill || global || content || viewAs || chooseButton || mod) && !nopop && !dutySkill && !hiddenSkill && !juexingji && !zhuSkill) {
							skillList.add(is)
						}
					})
				})
			})
			// const cards = suiSet.getCardPileSkills().filter(c=>c+"_skill" in lib.skill&&lib.skill[c+"_skill"].equipSkill)
			// cards.forEach(c=>skillList.push(c))

			_status.style = {
				innerHTML:/*css*/`
                .player .playerskillList {
                    color: orange;
                    font-weight: 700;
                    text-shadow: 1px 1px black;
                    z-index: 90000000;
                }
                .player:not([data-position="0"]) .playerskillList {
                    width: 70px;
                    height: auto;
                    top: 35%;
                    border-radius: 5px;
                    text-align: center;
                    line-height: 2;
                    left: 20%;
                    padding: 0 10px;
                    font-size: 15px;
                }
                .player[data-position="0"] .playerskillList {
                    top: -30px;
                    left: 15px;
                }
            `
			}
			game.broadcastAll((zhu) => {
				game.zhu = zhu
				game.zhu.setIdentity('zhu')
				game.zhu.identity = 'zhu'
				game.zhu.identityShown = true
				game.zhu.isZhu = true
			}, game.players.randomGet())
			suiSet.setPlayersSeat(game.zhu)
			const identityList = get.identityList(game.players.length).remove('zhu').remove('nei').randomSort().randomSort().randomSort();
			identityList.push('zhong')
			const anothplayers = game.players.filter(p => p != game.zhu)
			anothplayers.forEach((p, i) => {
				game.broadcastAll((p, id) => {
					if (p !== game.me) {
						p.setIdentity('cai')
						p.node.identity.classList.add('guessing');
					} else {
						game.me.setIdentity(id)
						game.me.node.identity.classList.add(id)
						game.me.identity = id
					}
					p.identity = id
				}, p, identityList[i])
			})
			game.broadcastAll((list, innerHTML) => {
				ui.arena.classList.add('choose-character');
				const style = document.createElement('style')
				style.innerHTML = innerHTML
				document.head.appendChild(style)
				game.players.forEach((p, i) => {
					if (!p.nickname) {//||(p.ws&&!p.isOnline2())
						lib.character[list[i]][3] = []
						lib.character[list[i]][2] = 4
						p.init(list[i])
					}
				})
				game.me.update()
			}, characterList.randomGets(10), _status.style.innerHTML)

			//初始技能
			game.broadcastAll(() => {
				lib.skill.changeUseSkill = {//'logSkill',
					trigger: { player: ['damageEnd', 'phaseEnd', 'phaseBeginStart', 'changeSkillsAfter', 'useSkillAfter', 'logSkill'] },
					filter(trigger, player, triggername) {
						if (['phaseBeginStart', 'phaseEnd', 'damageEnd'].includes(triggername)) return true
						if (triggername === 'changeSkillsAfter') {
							return trigger.removeSkill.length > 0 && player.nowSkill.some(s => trigger.removeSkill.includes(s))
						}
						let skill = trigger.sourceSkill || trigger.skill
						if (/\d/.test(skill)) {
							const strings = [...skill]
							let index = 0
							strings.find((s, i) => {
								if (/\d/.test(s)) {
									index = i
									return true
								}
							})
							skill = skill.slice(0, index)
						}
						return player.nowSkill.includes(skill) || player.nowSkill.includes(trigger.skill) || player.nowSkill.includes(trigger.sourceSkill)
					},
					async content(event, trigger, player) {
						if (['phaseBeginStart', 'phaseEnd', 'damageEnd'].includes(event.triggername)) {
							const phase = {
								phaseEnd: '结束阶段',
								phaseBeginStart: '回合开始',
								damageEnd: ''
							}
							const controls = [...player.nowSkill.slice(), '全部失去', 'cancel']
							const { result } = await player.chooseControl(controls).set('prompt', `${phase[event.triggername]}选择要失去的技能`)//.set('ai',()=>{})
							if (result.control !== 'cancel') {
								if (result.control === '全部失去') {
									result.control = player.nowSkill.slice()
								}
								await player.removeSkills(result.control)
								if (event.triggername === 'damageEnd') {
									await player.draw()
								}
							}
						} else {
							// if(_status.skillList.length===0){
							//     _status.skillList = _status.skillList2
							// }
							let num = 1;
							if (trigger.removeSkill && trigger.removeSkill.length > 1) {
								const noRepeat = []
								num = trigger.removeSkill.reduce((a, b) => {
									if (player.nowSkill.includes(b) && !noRepeat.includes(b)) {
										a++
										noRepeat.add(b)
									}
									return a
								}, 0)
							}
							const skill = _status.skillList.randomRemove(num)
							if (!skill.length) {
								game.log('技能库里已经没有更多技能了')
							} else {
								const characterSkills = lib.character[player.name1].skills
								let log;
								if (Array.isArray(trigger.removeSkill)) {
									log = trigger.removeSkill
									characterSkills.remove(...log)
									if (player.firstCharacter && player.firstCharacter !== player.name1) {
										characterSkills.removeArray(characterSkills)
										player.firstCharacter = player.name1
									}
								} else {
									log = trigger.sourceSkill || trigger.skill
									characterSkills.remove(log)
								}
								let result
								if (event.triggername === 'logSkill') {
									result = await player.chooseBool().set('prompt', `是否失去${get.translation(log)}？否则取消失去一点体力上限`)
								}
								if (result && result.result && !result.result.bool) {
									player.loseMaxHp()
								} else {
									await player.removeSkills(log)
									await player.addSkills(skill)
									skill.forEach(s => characterSkills.push(s))
									const str = initSkillInfo(lib.character[player.name1].skills)
									game.broadcastAll((player, str, skill, audioSkill) => {
										if (!Array.isArray(audioSkill)) audioSkill = [audioSkill]
										player.nowSkill = skill
										if (!player.node.rightskillList) {
											player.node.rightskillList = ui.create.div('.playerskillList', str, player)
										} else {
											player.node.rightskillList.innerHTML = str
										}
										lib.character[player.name1].skills = skill
										audioSkill.forEach(s => game.playSkillAudio(s))
										if (game.videoContent.initSkill) {
											game.addVideo('initSkill', player, { skills: skill, str })
										}
									}, player, str, characterSkills, skill)
								}
							}
						}
					},
					charlotte: true,
					popup: false,
					forced: true,
					locked: true,
				}
				lib.translate.changeUseSkill = '随机'
				lib.translate.changeUseSkill_info = '锁定技，你使用或失去技能后会获得一个新技能'
				lib.dynamicTranslate.changeUseSkill = player => {
					const skill = get.translation(player.nowSkill)
					return `锁定技，你使用或失去技能【${skill}】其中之一后，你失去该技能或一点体力上限并获得一个技能并将此技能发动条件目标改为此次获得的技能若为因受到伤害失去的技能则摸一张牌；你武将牌上的技能视为此技能；回合开始、结束、受到伤害后，你可以失去【${skill}】`
				}
				lib.skill.PVPaozhan = {
					trigger: { global: 'dieAfter' },
					filter() { return game.players.length === 2 && !game.PVPaozhan },
					async content(event, trigger, player) {
						var color = get.groupnature(player.group, "raw");
						if (player.isUnseen()) color = "fire";
						player.$fullscreenpop("鏖战模式", color);
						game.broadcastAll(function () {
							_status._aozhan = true;
							ui.aozhan = ui.create.div(".touchinfo.left", ui.window);
							ui.aozhan.innerHTML = "鏖战模式";
							if (ui.time3) ui.time3.style.display = "none";
							ui.aozhanInfo = ui.create.system("鏖战模式", null, true);
							lib.setPopped(
								ui.aozhanInfo,
								function () {
									var uiintro = ui.create.dialog("hidden");
									uiintro.add("鏖战模式");
									var list = [
										"当游戏中仅剩两名玩家",
										"在鏖战模式下，任何角色均不是非转化的【桃】的合法目标。【桃】可以被当做【杀】或【闪】使用或打出。",
										"进入鏖战模式后，即使之后有两名或者更多的角色出现，仍然不会取消鏖战模式。",
									];
									var intro = '<ul style="text-align:left;margin-top:0;width:450px">';
									for (var i = 0; i < list.length; i++) {
										intro += "<li>" + list[i];
									}
									intro += "</ul>";
									uiintro.add('<div class="text center">' + intro + "</div>");
									var ul = uiintro.querySelector("ul");
									if (ul) {
										ul.style.width = "180px";
									}
									uiintro.add(ui.create.div(".placeholder"));
									return uiintro;
								},
								250
							);
							game.playBackgroundMusic();
						});
						game.countPlayer(function (current) {
							current.addSkill("aozhan");
						});
					},
					forced: true,
					charlotte: true,
				}
			})
			// game.addGlobalSkill('PVPaozhan')
			const skillMap = {}
			// const gameStartSkill = skillList.slice().filter(s=>lib.translate[s+"_info"]&&lib.translate[s+"_info"].includes('游戏开始'))
			// const dieSkill = skillList.slice().filter(s=>lib.translate[s+"_info"]&&lib.translate[s+"_info"].includes('你死亡'))
			// _status.dieSkill = dieSkill
			// skillList.removeArray(dieStartSkill)
			game.players.forEach(p => {
				// skillMap[p.playerid] = gameStartSkill.randomRemove(2)
				skillMap[p.playerid] = skillList.randomRemove(2)
				skillList.removeArray(skillMap[p.playerid])
				game.broadcastAll((player, str) => {
					player.node.rightskillList = ui.create.div('.playerskillList', str, player)
				}, p, initSkillInfo(skillMap[p.playerid]), skillMap[p.playerid])
				lib.playerSkillOL[p.playerid] = skillMap[p.playerid]
			})



			const initPlayers = game.players.map(p => {
				if (p.ws || p === game.me) {
					let avatar
					let nickname
					if (p === game.me) {
						avatar = lib.config.connect_avatar
						nickname = lib.config.connect_nickname
					} else {
						avatar = p.ws.avatar
						nickname = p.nickname
					}
					game.addVideo('initAvatar', null, { avatar, nickname, playerid: p.playerid })
					return [p, avatar, skillMap[p.playerid]]
				}
			}).filter(Boolean)
			game.broadcastAll((players, { me, name, avatar, skill }) => {
				players.forEach(([player, avatar, skill]) => {
					player.nowSkill = skill
					const nickname = player.nickname
					const id = nickname + player.playerid
					suiSet.copyCharacter({
						character: avatar,
						hp: 4,
						skills: skill,
						name: id,
						translate: nickname
					})
					player.init(id)
				})
				name = name.replace('※', '')
				const id = name + me.playerid
				suiSet.copyCharacter({
					character: avatar,
					hp: 4,
					skills: skill,
					name: id,
					translate: name
				})
				me.init(id)
				me.update()
				me.nowSkill = skill
			}, initPlayers, { me: game.me, name: lib.config.connect_nickname, avatar: lib.config.connect_avatar, skill: skillMap[game.me.playerid] })

			game.addVideo('init', null, game.players.map(p => {
				return {
					name: p.name1,
					name2: p.name2,
					identity: (p === game.me || p === game.zhu) ? p.identity : 'cai'
				}
			}))
			game.addVideo('addStyle', null, {
				style: _status.style, globalSkills: {
					changeUseSkill: lib.skill.changeUseSkill,
					PVPaozhan: lib.skill.PVPaozhan
				}
			})

			const next = game.createEvent('chooseCharacter')
			next.setContent(async event => {
				lib.playerCharacterOL = {}
				_status.playerCharacters = {}
				_status.characterlist = characterList.slice()
				_status.skillList = skillList
				_status.skillList2 = skillList.slice()


				game.broadcastAll(() => ui.arena.classList.add('choose-character'))
				//选形象
				const playerAvatarMap = {}
				const num = suiSet.getSelect(characterList)
				game.players.forEach(p => playerAvatarMap[p.playerid] = characterList.randomRemove(num))

				const avatarList = [];
				game.players.forEach(player => {
					const list = playerAvatarMap[player.playerid]
					avatarList.push([player, ['<span style="color:red;font-weight:700;">你可以选择一个武将作为你本局的形象</span>', [list, 'characterx']], 1, false])
				})
				const xingxiang = await game.me.chooseButtonOL(avatarList, (player, result) => {
					if (!result) return;
					if (!result.bool) return;
					if (player === game.me && result.bool) {
						const character = result.links[0]
						player.node.avatar.setBackground(character, 'character')
						// player.sex = lib.character[character][0]
					}
				}).set('switchToAuto', function () {
					_status.event.result = 'ai';
				}).set('processAI', function () {
					return false
				})
				for (const i in xingxiang.result) {
					const bool = xingxiang.result[i]
					if (!bool.bool) continue
					const player = lib.playerOL[i]
					const link = xingxiang.result[i].links[0]
					const skills = [skillMap[player.playerid]]
					game.broadcastAll((player, avatar, skills) => {
						const nickname = player.nickname || player.node.name1.innerText
						const id = nickname + player.playerid
						suiSet.copyCharacter({
							character: avatar,
							hp: 4,
							skills: skills || [],
							name: id,
							translate: nickname
						})
						player.init(id)
						player.update()
					}, player, link, skills)
					game.addVideo('flashAvatar', player, {
						avatar: link,
						skills: lib.playerSkillOL[player.playerid]
					})
				}

				//选势力
				const select = lib.group.map(g => ['', '', `group_${g}`])
				const groupList = game.players.map(i => {
					return [i, ['你可以选择一个势力', [select, 'vcard']], 1, false]
				})
				const shili = await game.me.chooseButtonOL(groupList, (player, result) => {
					if (!result) return
					if (player === game.me) {
						player.changeGroup(result.links[0][2].slice(6), false, false);
					}
				}).set('processAI', function () {
					return false
				})
				for (const g in shili.result) {
					if (!shili.result[g].bool) continue
					const player = lib.playerOL[g]
					const group = shili.result[g].links[0][2].slice(6)
					game.broadcastAll((player, group) => {
						lib.character[player.name1][1] = group
						player.changeGroup(group)
					}, player, group)
					game.addVideo('flashGroup', player, { group })
				}
				game.players.forEach(p => {
					game.broadcastAll((player, name, skill, info) => {
						player.addSkill('changeUseSkill')
						player.node.rightskillList.innerHTML = info
						player.nowSkill = skill
						player.addSkill(skill)
						lib.character[name][3] = skill
						player.firstCharacter = name
					}, p, p.name1, skillMap[p.playerid], initSkillInfo(skillMap[p.playerid]))
					_status.playerCharacters[p.playerid] = {
						player: p,
						skills: lib.character[p.name1][3],
						name: (p.nickname && p.nickname.replace('※', '')) || '',
						character: p.name1,
						info: lib.character[p.name1],
						group: p.group,
						sex: p.sex,
					}
					if (game.videoContent.initSkill) {
						game.addVideo('initSkill', p, { skills: skillMap[p.playerid], zhu: p === game.zhu, me: p === game.me })
					}
				})
				_status.playerCharactersUse = (characters, innnerHtml, needFunction) => {
					if (!window.suiSet) {
						window.suiSet = {
							copyCharacter: needFunction
						}
					}
					for (const c in characters) {
						const { name, character, info } = characters[c]
						info.skills.push('changeUseSkill')
						lib.character[character] = info
						if (name) {
							lib.translate[character] = name
						}
					}

					lib.skill.changeUseSkill = {//'logSkill',
						trigger: { player: ['damageEnd', 'phaseEnd', 'phaseBeginStart', 'changeSkillsAfter', 'useSkillAfter', 'logSkill'] },
						filter(trigger, player, triggername) {
							if (['phaseBeginStart', 'phaseEnd', 'damageEnd'].includes(triggername)) return true
							if (triggername === 'changeSkillsAfter') {
								return trigger.removeSkill.length > 0 && player.nowSkill.some(s => trigger.removeSkill.includes(s))
							}
							let skill = trigger.sourceSkill || trigger.skill
							if (/\d/.test(skill)) {
								const strings = [...skill]
								let index = 0
								strings.find((s, i) => {
									if (/\d/.test(s)) {
										index = i
										return true
									}
								})
								skill = skill.slice(0, index)
							}
							return player.nowSkill.includes(skill) || player.nowSkill.includes(trigger.skill) || player.nowSkill.includes(trigger.sourceSkill)
						},
						async content(event, trigger, player) {
							if (['phaseBeginStart', 'phaseEnd', 'damageEnd'].includes(event.triggername)) {
								const controls = [...player.nowSkill.slice(), '全部失去', 'cancel']
								const { result } = await player.chooseControl(controls).set('prompt', `选择要失去的技能`)//.set('ai',()=>{})
								if (result.control !== 'cancel') {
									if (result.control === '全部失去') {
										result.control = player.nowSkill.slice()
									}
									await player.removeSkills(result.control)
									if (event.triggername === 'damageEnd') {
										await player.draw()
									}
								}
							} else {
								// if(_status.skillList.length===0){
								//     _status.skillList = _status.skillList2
								// }
								let num = 1;
								if (trigger.removeSkill && trigger.removeSkill.length > 1) {
									const noRepeat = []
									num = trigger.removeSkill.reduce((a, b) => {
										if (player.nowSkill.includes(b) && !noRepeat.includes(b)) {
											a++
											noRepeat.add(b)
										}
										return a
									}, 0)
								}
								const skill = _status.skillList.randomRemove(num)
								if (!skill.length) {
									game.log('技能库里已经没有更多技能了')
								} else {
									const characterSkills = lib.character[player.name1].skills
									let log;
									if (Array.isArray(trigger.removeSkill)) {
										log = trigger.removeSkill
										characterSkills.remove(...log)
									} else {
										log = trigger.sourceSkill || trigger.skill
										characterSkills.remove(log)
									}
									await player.removeSkills(log)
									await player.addSkills(skill)
									skill.forEach(s => characterSkills.push(s))
									const str = initSkillInfo(lib.character[player.name1].skills)
									game.broadcastAll((player, str, skill, audioSkill) => {
										if (!Array.isArray(audioSkill)) audioSkill = [audioSkill]
										player.nowSkill = skill
										if (!player.node.rightskillList) {
											player.node.rightskillList = ui.create.div('.playerskillList', str, player)
										} else {
											player.node.rightskillList.innerHTML = str
										}
										lib.character[player.name1].skills = skill
										audioSkill.forEach(s => game.playSkillAudio(s))
									}, player, str, characterSkills, skill)
								}
							}
						},
						charlotte: true,
						popup: false,
						forced: true,
						locked: true,
					}
					lib.translate.changeUseSkill = '随机'
					lib.translate.changeUseSkill_info = '锁定技，你使用或失去技能后会获得一个新技能'
					lib.dynamicTranslate.changeUseSkill = player => {
						const skill = get.translation(player.nowSkill)
						return `锁定技，你使用或失去技能【${skill}】其中之一后，你失去该技能或一点体力上限并获得一个技能并将此技能发动条件目标改为此次获得的技能若为因受到伤害失去的技能则摸一张牌；你武将牌上的技能视为此技能；回合开始、结束、受到伤害后，你可以失去【${skill}】`
					}
					lib.skill.PVPaozhan = {
						trigger: { global: 'dieAfter' },
						filter() { return game.players.length === 2 && !game.PVPaozhan },
						async content(event, trigger, player) {
							var color = get.groupnature(player.group, "raw");
							if (player.isUnseen()) color = "fire";
							player.$fullscreenpop("鏖战模式", color);
							game.broadcastAll(function () {
								_status._aozhan = true;
								ui.aozhan = ui.create.div(".touchinfo.left", ui.window);
								ui.aozhan.innerHTML = "鏖战模式";
								if (ui.time3) ui.time3.style.display = "none";
								ui.aozhanInfo = ui.create.system("鏖战模式", null, true);
								lib.setPopped(
									ui.aozhanInfo,
									function () {
										var uiintro = ui.create.dialog("hidden");
										uiintro.add("鏖战模式");
										var list = [
											"当游戏中仅剩两名玩家",
											"在鏖战模式下，任何角色均不是非转化的【桃】的合法目标。【桃】可以被当做【杀】或【闪】使用或打出。",
											"进入鏖战模式后，即使之后有两名或者更多的角色出现，仍然不会取消鏖战模式。",
										];
										var intro = '<ul style="text-align:left;margin-top:0;width:450px">';
										for (var i = 0; i < list.length; i++) {
											intro += "<li>" + list[i];
										}
										intro += "</ul>";
										uiintro.add('<div class="text center">' + intro + "</div>");
										var ul = uiintro.querySelector("ul");
										if (ul) {
											ul.style.width = "180px";
										}
										uiintro.add(ui.create.div(".placeholder"));
										return uiintro;
									},
									250
								);
								game.playBackgroundMusic();
							});
							game.countPlayer(function (current) {
								current.addSkill("aozhan");
							});
						},
						forced: true,
						charlotte: true,
					}

					const style = document.createElement('style')
					style.innerHTML = innnerHtml
					document.head.appendChild(style)

					const oldme = ui.create.me
					ui.create.me = () => {
						const me = oldme.call(this, ...arguments)
						for (const s in characters) {
							const player = lib.playerOL[s]
							const { skills } = characters[s]
							let str = ''
							skills.forEach(s => {
								if (s === 'changeUseSkill') return;
								str += get.translation(s) + ' '
							})
							if (!player.node.rightskillList) player.node.rightskillList = ui.create.div('.playerskillList', player)
							player.node.rightskillList.innerHTML = str
						}
						ui.create.me = oldme
						return me
					}
				}
				game.broadcastAll(() => {
					game.zhu.maxHp++
					game.zhu.hp++
					game.zhu.update()
					ui.arena.classList.remove('choose-character')
				})
				_status.videoInited = false
			})
		}

		return;
		game.chooseCharacterTafangOL = () => {//你看这里的代码干什么？
			return;
			lib.config.mode_config.identity.tafang_turn = lib.configOL.identity_tafangRound
			lib.config.mode_config.identity.tafang_difficulty = lib.configOL.identity_tafangRound
			game.players.forEach(p => p.remove())
			lib.init.css(lib.assetURL + "layout/mode", "chess");
			lib.init.css(lib.assetURL + "layout/mode", "tafang");
			game.loadModeAsync("tafang", content => {
				const next = game.createEvent('chooseCharacter')
				next.setContent(content.start)
				suiSet.comboObject(lib, content)
			});

			ui.chessContainer = ui.create.div("#chess-container", ui.arena);
			ui.chessContainer.move = ui.click.moveContainer;
			ui.chessContainer.chessLeft = 0;
			ui.chessContainer.chessTop = 0;
			ui.chess = ui.create.div("#chess", ui.chessContainer);



			// const grid = ui.create.div(".player.minskin.obstacle", ui.chess).addTempClass("start");

			// game.pause()
		}

		game.chooseCharacterKangjinOL = function () {
			const next = game.createEvent('chooseCharacter');
			next.setContent(async event => {
				ui.arena.classList.add('choose-character');
				let i;
				const identityList = get.identityList(game.players.length);
				identityList.randomSort();
				const [plays, aplays] = suiSet.connect_players()
				suiSet.modeConfig.identity.setPlayersIdentity(identityList, (identityList) => {
					switch (plays.length) {
						case 2: {
							plays.forEach(p => p.identity = 'zhong')
							const identitys = ['zhu', 'fan', 'fan', 'fan', 'fan', 'nei'].randomSort()
							for (let i = 0; i < aplays.length; i++) {
								aplays[i].identity = identitys[i]//也给它们设置一下身份
								if (identitys[i] == 'zhu') game.zhu = aplays[i]
							}
							break
						}
						case 3: {
							const identitys = ['zhu', 'zhong', 'zhong'].randomSort()
							identitys.forEach((i, index) => {
								plays[index].identity = i
								if (i === 'zhu') game.zhu = plays[index]
							})
							if (game.players.length === 10) {
								aplays.forEach(a => a.identity = 'fan')
							} else {
								const identitys2 = ['fan', 'fan', 'fan', 'fan', 'nei'].randomSort()
								aplays.forEach((id, index) => identitys2[index] = id)
							}
							break;
						}
						case 4: {
							plays.forEach(element => element.identity = 'fan');//那就遍历所有玩家，把他们都设置成反贼
							const identitys = ['zhu', 'zhong', 'zhong', 'nei'].randomSort()//然后把剩下的身份拿出来打乱
							for (let i = 0; i < aplays.length; i++) {//再遍历一下人机
								aplays[i].identity = identitys[i]//给它们也随机设置一个身份
								if (identitys[i] == 'zhu') game.zhu = aplays[i]
							}
						}
						case 5: {
							plays.forEach(element => element.identity = 'fan')
							//那就遍历所有玩家，把他们都设置成反贼
							const identitys = identityList.filter(i => i != 'fan')
							identitys = identitys.randomSort()
							for (let i = 0; i < aplays.length; i++) {//再遍历一下人机
								aplays[i].identity = identitys[i]//给它们也随机设置一个身份
								if (identitys[i] == 'zhu') game.zhu = aplays[i]
							}
						}
						default: {
							const identitys = identityList.slice(0, plays.length)
							identitys.forEach((item, index) => plays[index].identity = item)
							const aidentitys = identityList.slice(plays.length)
							aidentitys.forEach((item, index) => aplays[index].identity = item)
							break;
						}
					}
					game.players.forEach(p => {
						p.setIdentity('cai');
						p.node.identity.classList.add('guessing')
						if (p.identity === 'zhu') {
							game.zhu = p
							game.zhu.setIdentity();
							game.zhu.identityShown = true;
							game.zhu.isZhu = (game.zhu.identity == 'zhu');
							game.zhu.node.identity.classList.remove('guessing');
							game.me.setIdentity();
							game.me.node.identity.classList.remove('guessing');
						} else {
							p.identityShown = false
						}
					})
				})
				const { list, list2, list3, list4, libCharacter } = suiSet.getSelecList()
				event.list = list
				event.list2 = list2
				_status.characterlist = list4.slice(0);
				let result;
				if (lib.configOL.identity_Selects === 'dianjiang') {
					game.broadcastAll((list, id) => {
						_status.characterlist = list;
						const filter = name => !_status.characterlist.includes(name);
						const dialog = ui.create.characterDialog('heightset', filter).open();
						dialog.videoId = id;
						ui.arena.classList.add('choose-character');
					}, list4, event.videoId)
					result = await game.zhu.chooseButton(true).set('ai', function (button) {
						return Math.random();
					}).set('dialog', event.videoId);
				} else {
					const getZhuList = list2 => {
						const limit_zhu = lib.configOL.limit_zhu;
						if (!limit_zhu || limit_zhu == 'off') return list2.slice(0).sort(lib.sort.character);
						if (limit_zhu != 'group') {
							const num = (parseInt(limit_zhu) || 6);
							return list2.randomGets(num).sort(lib.sort.character);
						}
						const getGroup = name => {
							if (lib.characterReplace[name]) return lib.character[lib.characterReplace[name][0]][1];
							return lib.character[name][1];
						}
						const list2x = list2.slice(0);
						list2x.randomSort();
						for (let i = 0; i < list2x.length; i++) {
							for (let j = i + 1; j < list2x.length; j++) {
								if (getGroup(list2x[i]) == getGroup(list2x[j])) {
									list2x.splice(j--, 1);
								}
							}
						}
						list2x.sort(lib.sort.character);
						return list2x;
					}
					const zhulist = getZhuList(list2).concat(list3.randomGets(parseInt(lib.configOL.identity_Selects)));
					const next = game.zhu.chooseButton(true)
					next.set('selectButton', (lib.configOL.double_character ? 2 : 1));
					next.set('createDialog', ['选择角色', [zhulist, 'characterx']]);
					next.set('ai', () => Math.random());
					result = await next
				}
				result = result.result
				if (!game.zhu.name) game.zhu.init(result.links[0], result.links[1])
				event.list.remove(get.sourceCharacter(game.zhu.name1));
				event.list.remove(get.sourceCharacter(game.zhu.name2));
				event.list2.remove(get.sourceCharacter(game.zhu.name1));
				event.list2.remove(get.sourceCharacter(game.zhu.name2));
				if (game.players.length > 4) {
					if (!game.zhu.isInitFilter('noZhuHp')) {
						game.zhu.maxHp++;
						game.zhu.hp++;
						game.zhu.update();
					}
				}
				game.broadcast((zhu, name, name2, addMaxHp) => {
					if (!zhu.name) zhu.init(name, name2);
					if (addMaxHp) {
						if (!zhu.isInitFilter('noZhuHp')) {
							zhu.maxHp++;
							zhu.hp++;
							zhu.update();
						}
					}
				}, game.zhu, result.links[0], result.links[1], game.players.length > 4);

				let chooseGroup;
				if (game.zhu.group == 'shen' && !game.zhu.isUnseen(0)) {
					const list = ['wei', 'shu', 'wu', 'qun', 'jin', 'key'];
					for (let i = 0; i < list.length; i++) {
						if (!lib.group.includes(list[i])) list.splice(i--, 1);
						else list[i] = ['', '', 'group_' + list[i]];
					}
					chooseGroup = await game.zhu.chooseButton(['请选择神武将的势力', [list, 'vcard']], true).set('ai', function () {
						return Math.random();
					});
				}
				else if (get.is.double(game.zhu.name1)) {
					game.zhu._groupChosen = true;
					const list = get.is.double(game.zhu.name1, true);
					for (let i = 0; i < list.length; i++) {
						if (!lib.group.includes(list[i])) list.splice(i--, 1);
						else list[i] = ['', '', 'group_' + list[i]];
					}
					chooseGroup = await game.zhu.chooseButton(['请选择你的势力', [list, 'vcard']], true).set('ai', function () {
						return Math.random();
					});
				}
				if (chooseGroup && chooseGroup.result) {
					const name = chooseGroup.result.links[0][2].slice(6);
					await game.zhu.changeGroup(name);
				}

				let playerschoose;
				if (lib.configOL.identity_Selects === 'dianjiang') {

				} else {
					const chooseNum = parseInt(lib.configOL.identity_Selects)
					const selectButton = (lib.configOL.double_character ? 2 : 1);
					const chooseList = game.players.map(p => {
						if (p !== game.zhu) {
							const str = lib.configOL.identity_SelectsTip || '请选择角色'
							return [p, [str, [event.list.randomRemove(chooseNum), 'characterx']], selectButton, true]
						}
					}).filter(Boolean)
					playerschoose = await game.me.chooseButtonOL(chooseList, (player, result) => {
						if (game.online || player == game.me) player.init(result.links[0], result.links[1]);
					})
				}
				playerschoose = playerschoose.result
			})
		}
	}
}

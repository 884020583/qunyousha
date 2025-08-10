import { lib, game, ui, get, ai, _status } from '../../noname.js'
export const skill = {
	keai: {
		trigger: {
			player: "damageBegin",
		},
		forced: true,
		filter: function (event, player) {
			return event.card &&
				(event.card.name == "sha" || (get.tag(event.card, "damage") && get.type(event.card) == "trick"));
		},
		async content(event, trigger, player) {
			if (trigger.source.getCards("h").length < 1) {
				trigger.cancel();
				return;
			}
			const result = await trigger.source.chooseBool("请弃置1张手牌，否则此伤害对" + get.translation(player.name) + "无效").forResult();
			if (!result.bool) {
				trigger.cancel();
			} else {
				await trigger.source.chooseToDiscard("h", 1, true).set("ai", function (card) {
					return get.value(card, player) - 2;
				});
			}
		},
		mod: {
			maxHandcard: function (player, num) {
				return num + player.hp;
			},
		},
		"_priority": 0,
	},
	zako_dejiban: {
		group: ["zako_dejiban_subskill1", "zako_dejiban_subskill2"],
		subSkill: {
			"subskill1": {
				trigger: {
					player: "recoverBegin",
				},
				forced: true,
				filter: function (event, player) {
					return event.source.hasSkill("zako_dejiban") && (event.source !== player);
				},
				content: function () {
					trigger.num++;
				},
				sub: true,
				sourceSkill: "zako_dejiban",
				"_priority": 0,
			},
			"subskill2": {
				trigger: {
					player: "recoverAfter",
				},
				forced: true,
				filter: function (event, player) {
					return event.card && event.card.name == "tao" && event.source != player && !player.isDying();
				},
				content: function () {
					trigger.source.draw();
				},
				sub: true,
				sourceSkill: "zako_dejiban",
				"_priority": 0,
			},
		},
		"_priority": 0,
	},
	haqi: {
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		async content(event, trigger, player) {
			player.skip("phaseDraw");
			event.cards = [];

			var continueBool = true;
			while (continueBool) {
				var judgeMent = player.judge(function (card) {
					if (get.color(card) == "black") return 1.5;
					return -1.5;
				});

				if (!player.hasSkillTag("rejudge")) {
					judgeMent.set("callback", function () {
						if (event.judgeResult.color == "black" && get.position(card, true) == "o") {
							player.gain(card, "gain2").gaintag.add("haqi");
						}
					});
				}

				var judgeBool = await judgeMent.forResultBool();
				var judgeCard = await judgeMent.forResultCard();
				if (judgeBool) {
					event.cards.push(judgeCard);
					continueBool = await player.chooseBool("是否再次发动【哈气！！！】？")
						.forResultBool();
				} else {
					await player.$throw(event.cards, 1000);
					await player.lose(event.cards, ui.discardPile, "visible");

					var x = event.cards.length;
					let damage_num = Math.ceil(x / 2);
					damage_num = Math.max(1, Math.min(damage_num, 3));
					if (damage_num > 0) {
						var target = await player.chooseTarget("请选择一名其他角色对其造成" + damage_num + "点伤害",
							(card, player, target) => target !== player).set("ai", function (target) {
							var num = 1 + (target.maxHp - target.hp);
							if (target.hp <= 1) num += 0.5;
							if (get.attitude(player, target) > 0) num = -1;
							return num;
						}).forResult('targets');
						if (target[0]) {
							game.log(player, "的【哈气！！！】判定失败");
							await target[0].damage(damage_num);
							player.draw();
						}
					}

					return;
				}

				if (!continueBool) {
					player.removeGaintag("haqi");
					return;
				}
			}
		},
		"_priority": 0,
	},
	test1: {
		trigger: {
			player: "lose_[fangbaodun]",
		},
		forced: true,
		locked: false,
		filter: function (event, player) {
			return true;
		},
		content: function () {
			player.draw(5);
		},
	},
	test2: {
		enable: "phaseUse",
		usable: 1,
		content: function () {
			var card = get.cardPile("fangbaodun");
			player.gain(card, "draw");
		},
	},
	mengwu: {
		group: ["mengwu_subskill1", "mengwu_subskill2_sha", "mengwu_subskill2_trick"],
		subSkill: {
			"subskill1": {
				enable: "phaseUse",
				usable: 1,
				selectTarget: 1,
				filterTarget: function (card, player, target) {
					return target != player;
				},
				content: function () {
					"step 0";
					player.chooseCard(true, "h").set("prompt2", "将一张手牌交给" + get.translation(target)).set("ai", function (card) {
						return get.value(card, target) - 2;
					});

					"step 1";
					if (result.cards) target.gain(result.cards[0], player);
					game.log(lib.translate[player.name] + "交给了" + lib.translate[target.name] + "1张牌");
					target.recover();

					"step 2";
					target.addTempSkill("mengwu_damageAdd", {player: "phaseAfter"});
					if (!target.hasMark("mengwu_subskill1")) {
						target.setMark("mengwu_subskill1", 1, false);
						game.log(lib.translate[target.name] + "萌物");
					}
				},
				marktext: "萌",
				intro: {
					name: "萌物",
					content: "该角色在其回合内造成的伤害+1，持续1个其的回合",
					nocount: true,
				},
				sub: true,
				sourceSkill: "mengwu",
				"_priority": 0,
			},
			damageAdd: {
				trigger: {
					global: "damageBegin",
				},
				forced: true,
				filter: function (event, player) {
					return event.source == player && event.num > 0;
				},
				content: function () {
					trigger.num++;
				},
				onremove: function (player) {
					if (player.hasMark("mengwu_subskill1")) {
						player.removeMark("mengwu_subskill1", 1, false);
						game.log(lib.translate[player.name] + "失去了【萌物】标记");
					}
				},
				sub: true,
				sourceSkill: "mengwu",
				"_priority": 0,
			},
			"subskill2_sha": {
				trigger: {
					global: "damageBegin",
				},
				forced: true,
				filter: function (event, player) {
					return event.source == player && event.num > 0 &&
						event.card && event.card.name == "sha";
				},
				content: function () {
					trigger.cancel();
				},
				sub: true,
				sourceSkill: "mengwu",
				"_priority": 0,
			},
			"subskill2_trick": {
				trigger: {
					global: "damageBegin",
				},
				locked: false,
				prompt: function (event, player) { 
					return "是否令此" + get.translation(event.card) + "对" + get.translation(event.player) + "的伤害+1";
				},
				filter: function (event, player) {
					return event.source == player && event.num > 0 &&
						event.card && event.card.name != "sha" && get.tag(event.card, "damage");
				},
				content: function () {
					trigger.num++;
				},
				sub: true,
				sourceSkill: "mengwu",
				"_priority": 0,
			},
		},
		"_priority": 0,
	},
	nihenbangle: {
		group: ["nihenbangle_subskill1", "nihenbangle_subskill2", "nihenbangle_subskill3", "nihenbangle_subskill4", "nihenbangle_subskill5_mark", "nihenbangle_subskill5_content"],
		subSkill: {
			"subskill1": {
				trigger: {
					global: "useCard1",
				},
				forced: true,
				firstDo: true,
				filter(event, player) {
					// if (event.player == player) return false;
					if (get.name(event.card) != "sha" && get.name(event.card) != "bingliang") return false;
					var info = lib.card[event.card.name];
					return info && info.selectTarget && info.selectTarget == -1 && !info.toself;
				},
				content: function () {
				},
				mod: {
					targetEnabled: function (card, player, target) {
						if (get.name(card) == "sha" || get.name(card) == "bingliang") return false;
					},
				},
				sub: true,
				sourceSkill: "nihenbangle",
				"_priority": 0,
			},
			"subskill2": {
				trigger: {
					player: "loseEnd",
				},
				forced: true,
				filter: function (event, player) {
					if (_status.currentPhase == player) return false;
					if (player.hp >= player.maxHp) return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (["h", "e"].contains(event.cards[i].original)) return true;
					}
					return false;
				},
				content: function () {
					player.recover();
				},
				sub: true,
				sourceSkill: "nihenbangle",
				"_priority": 0,
			},
			"subskill3": {
				enable: ["chooseToUse"],
				usable: Infinity,
				locked: false,
				filterCard: {
					name: "sha",
				},
				viewAs: function (cards, player) {
					var name = false;
					switch (get.color(cards[0])) {
						case "red":
							name = "lebu";
							break;
						case "black":
							name = "bingliang";
							break;
					}
					if (name) return {name: name};
				},
				viewAsFilter: function (player) {
					return player.countCards("hs") > 0;
				},
				position: "hs",
				prompt: "将红色【杀】当做【乐不思蜀】使用，黑色【杀】当做【兵粮寸断】使用",
				sub: true,
				sourceSkill: "nihenbangle",
				"_priority": 0,
			},
			"subskill4": {
				trigger: {
					global: "dieAfter",
				},
				forced: true,
				filter: function (event, player) {
					return event.player != player;
				},
				content: function () {
					player.draw();
				},
				sub: true,
				sourceSkill: "nihenbangle",
				"_priority": 0,
			},
			"subskill5_mark": {
				trigger: {
					player: "useSkillAfter",
				},
				forced: true,
				filter: function (event, player) {
					return event.skill == "mengwu_subskill1";
				},
				content: function () {
					var last = game.filterPlayer(function (current) {
						return current.hasMark("nihenbangle_subskill5_mark");
					});
					if (last[0]) last[0].removeMark("nihenbangle_subskill5_mark");
					var target = trigger.targets[0];
					if (!target.hasMark("nihenbangle_subskill5_mark")) target.setMark("nihenbangle_subskill5_mark", 1, false);
					game.log(lib.translate[target.name] + "获得了【nihenbangle】标记");
				},
				marktext: "棒",
				intro: {
					name: "你很棒了",
					content: function (storage, player) {
						return "该角色为【萌物】的上一个目标";
					},
					nocount: true,
				},
				sub: true,
				sourceSkill: "nihenbangle",
				"_priority": 0,
			},
			"subskill5_content": {
				trigger: {
					player: "dieBegin",
				},
				forced: true,
				filter: function (event, player) {
					var last = game.filterPlayer(function (current) {
						return current.hasMark("nihenbangle_subskill5_mark");
					});
					return last[0];
				},
				content: function () {
					var last = game.filterPlayer(function (current) {
						return current.hasMark("nihenbangle_subskill5_mark");
					});
					last[0].gain(player.getCards("h"), "gain2");
					last[0].recover(player.maxHp);
				},
				sub: true,
				sourceSkill: "nihenbangle",
				"_priority": 0,
			},
		},
		"_priority": 0,
	},
	jiayou: {
		trigger: {
			player: "phaseDrawBegin",
		},
		forced: true,
		locked: false,
		filter: function (event, player) {
			if (game.hasPlayer(current => current.name == "huli")) return true;
			return false;
		},
		content: function () {
			trigger.num++;
		},
		"_priority": 0,
	},
	hufeng: {
		enable: "phaseUse",
		usable: Infinity,
		selectTarget: 1,
		filterTarget: function (card, player, target) {
			return target != player && !target.hasMark("hufeng");
		},
		content: function () {
			player.loseHp(2);
			game.log(lib.translate[target.name] + "获得了【hufeng】标记");
			target.setMark("hufeng", 1, false);
			target.addTempSkill(["baiban", "hufeng_subskill_removeMark"], "phaseAfter");
			// player.addTempSkill("hufeng_subskill_sha", "phaseAfter");
		},
		marktext: "封",
		intro: {
			name: "狐封",
			content: function (storage, player) {
				return "该角色在本回合内所有技能失效，且" + get.translation("huli") + "对其使用【杀】无次数限制";
			},
			nocount: true,
		},
		group: ["hufeng_subskill_sha"],
		subSkill: {
			"subskill_removeMark": {
				charlotte: true,
				onremove: function (player) {
					game.log(lib.translate[player.name] + "失去了【hufeng】标记");
					player.removeMark("hufeng", 1, false);
				},
			},
			"subskill_sha": {
				trigger: {
					player: "useCard",
				},
				forced: true,
				charlotte: true,
				filter: function (event, player) {
					return event.card.name == "sha" && event.targets[0].hasMark("hufeng");
				},
				content: function () {
					var stat = player.getStat().card;
					if (typeof stat["sha"] == "number") {
						stat["sha"]--;
					}
				},
			},
		},
	},
	dengxian: {
		group: ["dengxian_draw", "dengxian_recover"],
		subSkill: {
			draw: {
				trigger: {
					player: "damageAfter",
				},
				filter: function (event, player) {
					return event.num >= 0;
				},
				"prompt2": function (event, player) {
					return "是否摸一张牌？";
				},
				content: function () {
					player.draw();
				},
			},
			recover: {
				trigger: {
					source: "damageAfter",
				},
				filter: function (event, player) {
					return event.card && event.card.name == "sha" && event.num > 0 && player.hp < player.maxHp;
				},
				"prompt2": function (event, player) {
					return "是否回复1点体力？";
				},
				content: function () {
					player.recover();
				},
			},
		},
	},
	nizhendehenbang: {
		group: ["nizhendehenbang_ison", "nizhendehenbang_die"],
		subSkill: {
			ison: {
				init: function (player) { 
					if (game.hasPlayer(current => current.name == "lianyu")) {
						player.gainMaxHp();
						player.recover();
					}
				},
			},
			die: {
				trigger: {
					global: "dieAfter",
				},
				forced: true,
				filter: function (event, player) {
					return event.player.name == "lianyu";
				},
				content: function () {
					player.loseMaxHp(2);
					if (player.hp < player.maxHp) player.recover(player.maxHp - player.hp);
					player.draw(3);
					player.addSkill("nizhendehenbang_sha");
					player.setMark("nizhendehenbang_sha", 1, false);
				},
			},
			sha: {
				trigger: {
					player: "useCardToPlayered",
				},
				forced: true,
				charlotte: true,
				popup: false,
				logTarget: "target",
				filter: function (event, player) {
					return event.card && event.card.name == "sha" && !event.getParent().directHit.includes(event.target);
				},
				content: function () {
					const id = trigger.target.playerid;
					const map = trigger.getParent().customArgs;
					if (!map[id]) {
						map[id] = {};
					}
					if (typeof map[id].shanRequired == "number") {
						map[id].shanRequired++;
					} else {
						map[id].shanRequired = 2;
					}
				},
				marktext: "棒",
				intro: {
					name: "你真的很棒",
					content: "其使用的【杀】需要2张【闪】才能抵消",
					nocount: true,
				},
			},
		},
	},
	Restrict: {
		init: function (player) {
			player.storage.Restrict = {
				last_suit: null,
			};
		},
		group: ["Restrict_subskill1", "Restrict_subskill2", "Restrict_subskill3"],
		subSkill: {
			subskill1: {
				trigger: {
					player: "phaseDrawBegin",
				},
				forced: true,
				filter: function (event, player) {
					return true;
				},
				async content(event, trigger, player) {
					trigger.num = 0;

					var cards = get.cards(3, false);
					game.cardsGotoOrdering(cards);
					var result = await player.chooseToMove("选择1张牌放回牌堆顶并标记其花色，获得其余牌", true)
						.set("list", [["获得的牌", cards], ["放回牌堆顶并标记花色的牌"]])
						.set("filterMove", function(from, to, moved) {
							return !(to == 1 && moved[1].length >= 1);
						}).set("filterOk", function (moved) {
						return moved[1].length == 1;
						}).set("processAI", function (list) {
						var cards = list[0][1].slice(0).sort(function (a, b) {
							return get.value(b) - get.value(a);
						});
						return [cards, cards.splice(1)];
						}).forResult();

					const gain = result.moved[0];
					const mark = result.moved[1][0];
					player.gain(gain);
					ui.cardPile.insertBefore(mark, ui.cardPile.firstChild);

					const suits = ["heart", "diamond", "club", "spade"];
					for (const suit of suits) {
						const now_suit = get.suit(mark);
						if (player.storage.Restrict.last_suit == null) {
							player.storage.Restrict.last_suit = now_suit;
							player.setMark("Restrict_subskill1_suit_" + now_suit, 1, false);
						} else {
							if (player.storage.Restrict.last_suit != now_suit) {
								player.removeMark("Restrict_subskill1_suit_" + player.storage.Restrict.last_suit, 1, false);
								player.setMark("Restrict_subskill1_suit_" + now_suit, 1, false);
								player.storage.Restrict.last_suit = now_suit;
							}
						}
					}
				},
			},
			subskill1_suit_heart: {
				charlotte: true,
				marktext: "<span style=\"color: red;\">♥<\span>",
				intro: {
					nocount: true,
					content: function (storage, player) {
						return '当有角色使用或打出♥花色的牌时，' + get.translation(player. name) + "获得1【权限】标记";
					},
				},
			},
			subskill1_suit_diamond: {
				charlotte: true,
				marktext: "<span style=\"color: red;\">♦<\span>",
				intro: {
					nocount: true,
					content: function (storage, player) {
						return "当有角色使用或打出♦花色的牌时，" + get.translation(player. name) + "获得1【权限】标记";
					},
				},
			},
			subskill1_suit_club: {
				charlotte: true,
				marktext: "<span style=\"color: black;\">♣<\span>",
				intro: {
					nocount: true,
					content: function (storage, player) {
						return "当有角色使用或打出♣花色的牌时，" + get.translation(player. name) + "获得1【权限】标记";
					},
				},
			},
			subskill1_suit_spade: {
				charlotte: true,
				marktext: "<span style=\"color: black;\">♠<\span>",
				intro: {
					nocount: true,
					content: function (storage, player) {
						return "当有角色使用或打出♠花色的牌时，" + get.translation(player. name) + "获得1【权限】标记";
					},
				},
			},
			subskill2: {
				mod: {
					maxHandcard: function (player, num) {
						const suit = player.storage.Restrict.last_suit;
						var add = player.getCards("h", function (card) {
							return get.suit(card) == suit;
						}).length;
						return num + add;
					},
				},
			},
			subskill3: {
				trigger: {
					global: ["useCardAfter", "respondAfter"]
				},
				forced: true,
				filter: function (event, player) {
					if (!event.card) return false;
					const suit1 = player.getStorage("Restrict").last_suit;
					const suit2 = get.suit(event.card);
					return suit1 == suit2;
				},
				content: function () {
					player.addMark("Permissions_subskill1", 1, true);
				}
			},
		},
	},
	Permissions: {
		group: ["Permissions_subskill1", "Permissions_subskill2", "Permissions_subskill3"],
		subSkill: {
			subskill1: {
				trigger: {
					player: "phaseZhunbeiBefore",
				},
				forced: true,
				filter: function (event, player) {
					return true;
				},
				content: function () {
					player.addMark("Permissions_subskill1", 1, true);
				},
				marktext: "权",
				intro: {
					name: "权限",
					content: function (storage, player) {
						return "其手牌上限+" + player.countMark("Permissions_subskill1");
					},
				},
			},
			subskill2: {
				enable: "phaseUse",
				usable: Infinity,
				locked: false,
				selectCard: 1,
				filterCard: function (card, player, event) {
					return get.position(card) == "h" || get.position(card) == "e";
				},
				filter: function (event, player) {
					return player.countMark("Permissions_subskill1") > 0 && player.getCards("he").length > 0;
				},
				content: function() {
					player.removeMark("Permissions_subskill1", 1, true);
					player.discard(cards);
					player.useCard({name: "wuzhong"}, player, false);
				},
			},
			subskill3: {
				mod: {
					maxHandcard: function (player, num) {
						return num + player.countMark("Permissions_subskill1");
					},
				},
			},
		},
	},
	Root: {
		enable: "phaseUse",
		usable: Infinity,
		locked: false,
		selectTarget: 1,
		filterTarget: function (card, player, target) {
			return player.countMark("Permissions_subskill1") >= target.maxHp && target != player;
		},
		filter: function (event, player) {
			var num = player.countMark("Permissions_subskill1");
			return game.filterPlayer(function (current) {
				return num >= current.maxHp;
			}).length > 0;
		},
		async content(event, trigger, player) {
			player.setMark("Permissions_subskill1", 0, true);
			const num = Math.floor(Math.max(1, (event.targets[0].maxHp / 2)));
			await player.gainPlayerCard(event.targets[0], "he", num, false).set("ai", function (card) {
				return get.value(card, player);
			});
		},
	},
	lingguang: {
		mark: true,
		marktext: "<span style=\"color: orangered;\">光<\span>",
		intro: {
			name: "灵光",
			content: function (storage, player) {
				var title = "<span style=\"color: #000000;\">灵感之光仍在沉寂<\span>";
				var extra = "";
				if (player.hasSkill("chushi")) {
					title = "<span style=\"color: #651f9a;\">灵感之光开始萌动<\span>";
					extra = "<br>已获得【初试】";
				}
				if (player.hasSkill("jianqi")) {
					title = "<span style=\"color: #257fa7;\">灵感之光正在壮大<\span>";
					extra = "<br>已获得【初试】<br>已获得【渐起】";
				}
				if (player.hasSkill("zhongcheng")) {
					title = "<span style=\"color: orangered;\">灵感之光完善，伟大之作终成！<\span>";
					extra = "<br>已获得【初试】<br>已获得【渐起】<br>已获得【终成】";
				}
				return title + extra;
			},
		},
		init: function (player) {
			player.storage.lingguang2 = {
				awaken: false,
			};
		},
		derivation: ["chushi", "jianqi", "zhongcheng"],
		group: ["lingguang_add1", "lingguang_add2", "lingguang_awaken"],
		subSkill: {
			add1: {
				trigger: {
					global: "phaseZhunbeiBegin",
				},
				forced: true,
				persevereSkill: true,
				charlotte: true,
				filter: function(event, player) {
					return player.countMark("lingguang") >= 33 && !player.hasSkill("chushi");
				},
				content: function() {
					player.gainMaxHp();
					player.recover();
					player.addSkill("chushi");
				},
			},
			add2: {
				trigger: {
					global: "phaseZhunbeiBegin",
				},
				forced: true,
				persevereSkill: true,
				charlotte: true,
				filter: function(event, player) {
					return player.countMark("lingguang") >= 66 && !player.hasSkill("jianqi");
				},
				content: function() {
					player.draw(2);
					player.addSkill("jianqi");
				},
			},
			awaken: {
				trigger: {
					global: "phaseZhunbeiBegin",
				},
				skillAnimation: true,
				animationColor: "orange",
				juexingjie: true,
				unique: true,
				forced: true,
				filter: function(event, player) {
					return player.countMark("lingguang") >= 99 && !player.storage.lingguang2.awaken;
				},
				content: function() {
					player.awakenSkill("lingguang_awaken");
					player.storage.lingguang2.awaken = true;
					player.gainMaxHp();
					player.recover();
					player.draw(3);
					player.addSkill("zhongcheng");
				},
			},
		},
	},
	chushi: {
		trigger: {
			global: "useCardAfter",
		},
		forced: true,
		usable: 1,
		filter: function(event, player) {
			return true;
		},
		content: function() {
			const type = get.type(trigger.card);
			switch (type) {
				case "basic":
					player.draw(); break;
				case "trick":
					player.addMark("lingguang", 5, true); break;
				case "equip":
					player.recover(); break;
				case "delay":
					player.gainMaxHp();
			}
		},
	},
	jianqi: {
		enable: "phaseUse",
		usable: Infinity,
		zhuanhuanji: true,
		filter: function (event, player) {
			return player.countMark("lingguang") >= 10;
		},
		async content(event, trigger, player) {
			player.removeMark("lingguang", 10, true);
			if (player.storage.jianqi == true) {
				const targets = await player.chooseTarget("获得一名其他角色区域里的1张牌", 1,
					(card, player, target) => target != player && target.getCards("hej").length > 0
				).forResultTargets();
				if (targets.length > 0) {
					await player.gainPlayerCard(targets[0], "hej", 1, false).set("ai", function (card) {
						return get.value(card, player);
					});
				}
			} else {
				player.draw();
				const bool = await player.chooseBool("是否交给一名其他角色1张牌？").forResultBool();
				if (bool) {
					const result = await player.chooseTarget(1,
						(card, player, target) => target != player).forResult();
					if (result.bool) await player.chooseToGive(result.targets[0], "he", 1, false);
				}
			}
			player.changeZhuanhuanji("jianqi");
		},
		init: function(player) {
			player.storage.jianqi = false;
		},
		mark: true,
		marktext: "☯",
		intro: {
			name: "初试",
			content: function(storage, player) {
				var mode = player.storage.jianqi ? "阳" : "阴";
				return "下次使用为 " + mode + " 效果";
			},
		},
	},
	zhongcheng: {
		enable: "phaseUse",
		usable: 3,
		filter: function(event, player) {
			return player.countMark("lingguang") >= 20;
		},
		async content(event, trigger, player) {
			player.removeMark("lingguang", 20);
			const list = [
				"视为使用一张无点数和花色的<br>基本牌或非延时锦囊牌",
				"对一名其他角色造成1伤害",
				"令所有角色摸1张牌，<br>然后其需交给你1或2张牌"
			];
			const result = await player.chooseControl(list[0], list[1], list[2]).set("ai", function() {
				return list[Math.floor(Math.random() * list.length)];
			}).forResult();

			if (result.control == list[0]) {
				var list1 = lib.inpile.filter(function (cardName) {
					return get.type(cardName) == "basic" || get.type(cardName) == "trick";
				});

				var list2 = [];
				for (var i of list1) {
					if (lib.filter.cardUsable({name: i}, player, event.getParent("chooseToUse")) &&
						game.hasPlayer(function (current) {
							return player.canUse({name: i}, current);
						})
					) {
						if (i == "sha") {
							list2.push(["基本", "", "sha"]);
							for (var j of lib.inpile_nature) list2.push(["基本", "", "sha", j]);
						} else {
							list2.push([get.type(i), "", i]);
						}
					}
				}
				if (list2.length) {
					var resultcb = await player.chooseButton(["视为使用一张基本牌或非延时锦囊牌", [list2, "vcard"]], true).forResult();
				} else {
					event.finish();
				}
				if (resultcb && resultcb.bool && resultcb.links[0]) {
					var card = {
						name: resultcb.links[0][2],
						nature: resultcb.links[0][3],
						isCard: true,
					};
					await player.chooseUseTarget(card, true);
				}
			} else if (result.control == list[1]) {
				const targets = await player.chooseTarget("对一名其他角色造成1伤害", 1,
					(card, player, target) => target != player
				).set("ai", function (target) {
					var num = 1 + (target.maxHp - target.hp);
					if (target.hp <= 1) num += 0.5;
					if (get.attitude(player, target) > 0) num = -1;
					return num;
				}).forResultTargets();
				if (targets.length) targets[0].damage();
			} else {
				for (var current of game.players) {
					current.draw();
					if (current == player) continue;
					await current.chooseToGive(player, "he", [1, 2], false)
						.set("prompt", "交给" + get.translation(current.name) + "1或2张牌")
						.set("ai", function(card) {
							return get.value(card, current);
						});
				}
			}
		},
	},
	gousi: {
		enable: "phaseUse",
		usable: 1,
		filter: function(event, player) {
			return player.getCards("h").length > 0;
		},
		async content(event, trigger, player) {
			const targets = [];
			for (const current of game.players) {
				const bool = await current.chooseBool("h", true)
					.set("prompt", "你可以随机弃置1张手牌以参加" + get.translation(player.name) + "的议事")
					.forResultBool();
				if (bool) targets.push(current);
			}
			targets.forEach(current => { current.randomDiscard("h", 1); });

			await player.chooseToDebate(targets).set("callback", async event => {
				const { debateResult: result } = event;
				const { bool, opinion, targets, opinions } = result;
				if (bool && opinion) {
					if (opinion && ["red", "black"].includes(opinion)) {
						if (opinion == "red") result.red.map(i => i[0]).sortBySeat().forEach(target => { target.recover(); });
						else result.black.map(i => i[0]).sortBySeat().forEach(target => { target.draw(2); });
						if (result[opinion].slice().map(i => i[0]).includes(player)) {
							player.draw(2);
							player.addMark("lingguang", 15, true);
						}
					}
					if (opinions.some(idea =>
						targets.every(target =>
							result[idea].slice().map(i => i[0]).includes(target)
						)
					)) {
						targets.forEach(target => {
							target.recover();
							target.draw();
						});
						const num = Math.max(15, 4 * targets.length);
						player.addMark("lingguang", num, true);
					}
				}
			});
			player.addMark("lingguang", 5, true);
		},
	},
	gongmian: {
		locked: true,
		group: ["gongmian_gain", "gongmian_phase"],
		subSkill: {
			gain: {
				trigger: {
					global: "useCard",
				},
				forced: true,
				locked: true,
				content: function () {
					// 当有角色使用牌时，获得1【灵光】标记
					player.addMark("lingguang", 1, true);
				},
			},
			phase: {
				trigger: {
					player: "phaseUseEnd",
				},
				locked: true,
				filter: function (event, player) {
					// 检查是否有足够的【灵光】标记
					return player.countMark("lingguang") >= 10 && player.countCards("h") > 0;
				},
				async content (event, trigger, player) {
					// 失去10【灵光】标记
					player.removeMark("lingguang", 10, true);
					
					// 选择其他任意名角色
					const result = await player.chooseTarget(
						"请选择要分配手牌的角色",
						[1, Infinity],
						function (card, player, target) {
							return target != player;
						}
					).set("ai", function (target) {
						return get.attitude(player, target);
					}).forResult();
					
					if (result.bool) {
						const targets = result.targets;
						
						// 将手牌随机均分给这些角色
						const handcards = player.getCards("h");
						const num = Math.floor(handcards.length / targets.length);
						
						if (num > 0) {
							// 洗牌以实现随机分配
							handcards.randomSort();
							
							// 分配手牌
							for (let i = 0; i < targets.length; i++) {
								const cards = handcards.slice(i * num, (i + 1) * num);
								if (cards.length > 0) {
									targets[i].gain(cards, player, "gainAuto");
								}
							}
						}
					}
					
					player.draw(player.getHandcardLimit());
				},
				ai: {
					order: 8,
					result: {
						player: function (player) {
							// 只在玩家手牌较多且有足够灵光标记时使用
							if (player.countMark("lingguang") < 10) return 0;
							if (player.countCards("h") >= player.getHandcardLimit()) return 1;
							return 0;
						}
					}
				}
			}
		}
	},
	zhongmu: {
		group: ["zhongmu_subskill1", "zhongmu_subskill2", "zhongmu_subskill3", "zhongmu_subskill4", "zhongmu_subskill5"],
		subSkill: {
			subskill1: {
				mod: {
					cardUsable: function (card, player, num) {
						if (card.name == "sha") return Infinity;
					},
					targetInRange: function (card, player, target) {
						if (card.name == "sha") return true;
					},
				},
			},
			subskill2: {
				trigger: {
					source: "damageEnd",
				},
				forced: true,
				locked: false,
				filter: function (event, player) {
					return event.card && event.card.name == "sha";
				},
				content: function () {
					player.recover(trigger.num);
				},
			},
			subskill3: {
				trigger: {
					player: "shaBegin",
				},
				forced: true,
				locked: false,
				filter: function (event, player) {
					return get.color(event);
				},
				content: function () {
					if (get.color(trigger) == "black") {
						trigger.baseDamage++;
					} else {
						trigger.target.addTempSkill("qinggang2");
					}
				},
			},
			subskill4: {
				enable: ["chooseToUse", "chooseToRespond"],
				usable: Infinity,
				locked: false,
				position: "h",
				prompt: "将点数大于等于11的牌视为【杀】使用或打出",
				filterCard: function (card, player, event) {
					return get.number(card) >= 11;
				},
				viewAs: function (cards, player) {
					return { name: "sha" };
				},
				filter: function (event, player) {
					return player.countCards("h", function (card) {
						return get.number(card) >= 11;
					}) > 0;
				},
			},
			subskill5: {
				trigger: {
					source: "dying",
				},
				forced: true,
				locked: false,
				content: function () {
					player.draw(3);
				},
			},
		},
	},
	fancha: {
		group: ["fancha_subskill1", "fancha_subskill2", "fancha_subskill3"],
		subSkill: {
			subskill1: {
				trigger: {
					player: "useCardToPlayered",
				},
				forced: true,
				popup: false,
				filter: function (event, player) {
					return get.type(event.card) == "trick";
				},
				content: function () {
					trigger.directHit.addArray(game.players);
				},
			},
			subskill2: {
				enable: "chooseToUse",
				usable: Infinity,
				position: "h",
				prompt: "将锦囊牌视为【万箭齐发】使用",
				filterCard: function (card, player, event) {
					return get.type(card) == "trick";
				},
				viewAs: function (cards, player) {
					return { name: "wanjian" };
				},
				filter: function (event, player) {
					return player.countCards("h", function (card) {
						return get.type(card) == "trick";
					}) > 0;
				},
			},
			subskill3: {
				trigger: {
					player: "damageEnd",
				},
				prompt2: function (event, player) {
					return "你可以获得此" + get.translation(event.cards);
				},
				filter: function (event, player) {
					return event.cards;
				},
				content: function () {
					player.gain(trigger.cards, "gain2");
				},
			},
		},
	},
	guangzhiyongzhe_lianjie: {
		mod: {
			targetEnabled: function (card, player, target) {
				if (game.hasPlayer(function (current) {
					return (current.name == "ailisi" || current.name == "kaiyi");
				})) {
					if (card.name == "lebu") return false;
				}
			},
			maxHandcard: function (player, num) {
				var add = 0;
				var targets = game.filterPlayer(function (current) {
					return current.name == "ailisi" || current.name == "kaiyi";
				});
				if (targets[0]) add = 2 * (targets[0].maxHp - targets[0].hp);
				return num + add;
			},
		},
	},
	zuduishenqing: {
		init: function (player) {
			player.storage.zuduishenqing = {
				lastPlayer: null,
				forever: null,
			};
		},
		enable: "phaseUse",
		usable: 1,
		selectTarget: 1,
		filterTarget: function (card, player, target) {
			return target != player && !target.hasMark("zuduishenqing");
		},
		content: function () {
			if (player.storage.zuduishenqing.lastPlayer == null) {
				target.addMark("zuduishenqing", 1, true);
				target.addSkill("zuduishenqing_subskill");
				player.storage.zuduishenqing.lastPlayer = target;
			} else {
				const lastPlayer = player.storage.zuduishenqing.lastPlayer;
				if (lastPlayer != player.storage.zuduishenqing.forever) {
					lastPlayer.removeMark("zuduishenqing", 1, true);
					lastPlayer.removeSkill("zuduishenqing_subskill");
				}

				target.addMark("zuduishenqing", 1, true);
				target.addSkill("zuduishenqing_subskill");
				player.storage.zuduishenqing.lastPlayer = target;
			}
		},
		marktext: "友",
		intro: {
			name: "队友",
			nocount: true,
			content: "体力上限+1，摸牌阶段的摸牌数+1，无法成为【铁索连环】的目标",
		},
		subSkill: {
			subskill: {
				init: function (player) {
					player.gainMaxHp();
				},
				onremove: function (player) {
					player.loseMaxHp();
				},
				mod: {
					targetEnabled: function (card, player, target) {
						if (card.name == "tiesuo") return false;
					},
				},
				trigger: {
					player: "phaseDrawBegin",
				},
				forced: true,
				locked: false,
				popup: false,
				content: function () {
					trigger.num++;
				},
			},
		},
	},
	guangzhijian_shouhu: { 
		group: ["guangzhijian_shouhu_subskill1", "guangzhijian_shouhu_subskill2"],
		subSkill: {
			subskill1: {
				trigger: {
					global: "damageBegin",
				},
				filter: function (event, player) {
					if (event.player != player && !event.player.hasMark("zuduishenqing")) return false;
					return event.num > 0 && player.countCards("he") >= event.num;
				},
				prompt2: function (event, player) {
					return "是否弃置" + event.num + "张牌以取消此对" + get.translation(event.player) +"的伤害，并视为对" + get.translation(event.source) + "使用一张【杀】？";
				},
				async content (event, trigger, player) {
					const bool = await player.chooseToDiscard("he", trigger.num, true).forResultBool();
					if (bool) {
						trigger.cancel();
						if (player.canUse({ name: "sha" }, trigger.source, false)) player.useCard({ name: "sha" }, trigger.source, false);
					}
				},
			},
			subskill2: {
				trigger: {
					global: "useCard",
				},
				prompt2: "是否摸一张牌？",
				filter(event, trigger) {
					return event.card && (get.type(event.card) == "trick" || get.type(event.card) == "delay");
				},
				content: function () {
					player.draw();
				},
			},
		},
	},
	wumingwangnv: {
		group: ["wumingwangnv_subskill1", "wumingwangnv_subskill2", "wumingwangnv_subskill3"],
		subSkill: {
			subskill1: {
				trigger: {
					player: "damageBefore",
				},
				forced: true,
				locked: false,
				firstDo: true,
				filter: function (event, player) {
					return event.card && ((event.card.name == "sha" && !event.nature) || event.card.name == "wanjian");
				},
				content: function () {
					trigger.cancel();
				},
			},
			subskill2: { 
				mod: {
					targetEnabled: function (card, player, target) {
						if (["lebu", "bingliang", "tiesuo"].includes(card.name)) {
							return false;
						}
					},
				},
			},
			subskill3: {
				trigger: {
					player: "damageEnd",
				},
				forced: true,
				locked: false,
				filter: function (event, player) {
					return event.source && event.source != player;
				},
				content: function () { 
					player.gainPlayerCard(trigger.source, "hej", 1, false).set("ai", function (card) {
						return get.value(card, player);
					});
				},
			},
		},
	},
	yongzhedezeren: {
		group: ["yongzhedezeren_subskill1", "yongzhedezeren_subskill2"],
		subSkill: {
			subskill1: {
				trigger: {
					global: "useCardToPlayered",
				},
				forced: true,
				locked: false,
				filter: function (event, player) {
					if (!event.card) return false;
					const Hina = game.findPlayer(function (current) {
						return current.name == "Hina";
					});
					return event.target == Hina;
				},
				content: function () {
					const Hina = game.findPlayer(function (current) {
						return current.name == "Hina";
					});
					Hina.draw();
				},
			},
			subskill2: {
				trigger: {
					global: "dying",
				},
				forced: true,
				locked: false,
				filter: function (event, player) {
					const Hina = game.findPlayer(function (current) {
						return current.name == "Hina";
					});
					return event.player == Hina;
				},
				content: async function (event, trigger, player) { 
					const Hina = game.findPlayer(function (current) {
						return current.name == "Hina";
					});
					player.$fullscreenpop("勇者的责任", "water");
					await game.delay(3);
					Hina.recover();
					Hina.addSkill("zuduishenqing_subskill");
					Hina.addTempSkill("yongzhedezeren_subskill2_damageDefened", "phaseAfter");
					Hina.addMark("zuduishenqing", 1, true);
					player.storage.zuduishenqing.forever = Hina;
					player.turnCharacter();
				},
			},
			subskill2_damageDefened: {
				init: function (player) { 
					player.addMark("yongzhedezeren_subskill2_damageDefened", 1, false);
				},
				onremove: function (player) { 
					player.removeMark("yongzhedezeren_subskill2_damageDefened", 1, false);
				},
				trigger: {
					player: "damageBegin",
				},
				forced: true,
				locked: false,
				content: function () {
					trigger.num = 0;
				},
				marktext: "勇",
				intro: {
					name: "勇者的责任",
					content: "本回合内受到的伤害均为0",
					nocount: true,
				},
			},
		},
	},
	jianglin: {
		async init(player) {
			player.logSkill("jianglin");
			player.$fullscreenpop("王女手持钥匙<br>方舟静候多时", "fire");
			await game.delay(3);
			player.draw(player.maxHp);
		},
		forced: true,
		locked: false,
		charlotte: true,
		trigger: {
			player: "changeHp",
		},
		filter: function (event, player) {
			return player.hp <= 0;
		},
		content: function () { 
			player.die(event.source);
		},
	},
	guangzhijian_chongneng: {
		trigger: {
			global: ["useCard", "phaseEnd", "useCardToTargeted"],
			player: ["damage"],
		},
		forced: true,
		filter: function (event, player, name) {
			if (player.countMark("guangzhijian_chongneng") >= 20) return false;
			switch (name) {
				case "useCard":
					return true;
				case "phaseEnd":
					return true;
				case "damage":
					return true;
				case "useCardToTargeted":
					return event.target.name == "Hina" && event.player !="Hina" && event.player != player;
				default:
					return false;
			}
		},
		content: function () {
			let num = 0;
			const name = event.triggername;

			switch (name) {
				case "useCard":
					if (get.type(trigger.card) == "trick") {
						num = 3;
					} else {
						num = 1;
					}
					break;
				case "phaseEnd":
					num = 2;
					break;
				case "damage":
					num = 2;
					break;
				case "useCardToTargeted":
					num = 4;
					break;
			}

			if (num > 0) {
				const currentMarks = player.countMark("guangzhijian_chongneng");
				const addMarks = Math.min(num, 20 - currentMarks);
				if (addMarks > 0) {
					player.addMark("guangzhijian_chongneng", addMarks, true);
				}
			}
		},
		marktext: "能",
		intro: {
			name: "充能",
			content: "当前拥有#个【充能】标记"
		}
	},
	guangzhijian_zuidaedinggonglv: {
		enable: "phaseUse",
		filter: function (event, player) {
			return player.hasMark("guangzhijian_chongneng");
		},
		selectTarget: 1,
		filterTarget: function (card, player, target) {
			return target != player;
		},
		prompt2: function (event, player) {
			const damage = Math.max(1, Math.floor(markCount / 2));
			return "你可以移除所有【充能】标记，对一名其他角色造成" + damage + "伤害";
		},
		content: function () {
			// 获取充能标记数量
			const markCount = player.countMark("guangzhijian_chongneng");
			// 移除所有充能标记
			player.removeMark("guangzhijian_chongneng", markCount);
			// 计算伤害值，最少为1
			const damageNum = Math.max(1, Math.floor(markCount / 2));
			// 对目标造成伤害
			target.damage(damageNum);
		},
	},
	guangzhijian_huimie: {
		enable: "phaseUse",
		filter: function (event, player) {
			// 需要至少20个充能标记才能使用
			return player.hasMark("guangzhijian_chongneng") && player.countMark("guangzhijian_chongneng") >= 20;
		},
		selectTarget: 1,
		filterTarget: function (card, player, target) {
			return target != player;
		},
		content: function () {
			// 失去所有充能标记
			const markCount = player.countMark("guangzhijian_chongneng");
			player.removeMark("guangzhijian_chongneng", markCount);
			
			// 对目标造成等于其体力上限的伤害
			const damageValue = target.maxHp;
			target.damage(damageValue);
			
			// 令目标弃置所有手牌
			if (target.countCards("h") > 0) {
				target.discard(target.getCards("h"));
			}
			
			// 切换角色
			player.turnCharacter();
		},
	},
	huimiedeyaoshi: {
		locked: true,
		group: ["huimiedeyaoshi_draw", "huimiedeyaoshi_sha", "huimiedeyaoshi_judge", "huimiedeyaoshi_nanman"],
		subSkill: {
			draw: {
				trigger: {
					source: "damageEnd",
				},
				filter: function (event, player) {
					// 仅当使用杀造成伤害时触发
					return event.card && event.card.name == "sha";
				},
				forced: true,
				locked: false,
				content: function () {
					// 摸1张牌
					player.draw();
				},
			},
			sha: {
				mod: {
					cardDiscardable: function (card, player, target) {
						// 杀需要目标弃置2张基本牌才能抵消
						if (card.name == "sha") {
							return function (event, player, target) {
								if (target.countCards("h", { type: "basic" }) < 2) {
									return false;
								}
								return true;
							};
						}
					},
				},
				trigger: {
					source: "damageBegin",
				},
				forced: true,
				locked: false,
				filter: function (event, player) {
					if (!player.hasMark("guangzhijian_chongneng")) return false;
					return event.card && event.card.name == "sha" && (get.nature(event) == "fire" || get.nature(event) == "thunder");
				},
				async content(event, trigger, player) {
					// 进行判定
					const judgeResult = await player.judge(function (card) {
						return get.color(card) == "black" ? 1.5 : -1.5;
					}).forResult();
					// 若结果为黑色
					if (get.color(judgeResult) == "black") {
						// 失去1充能标记
						player.removeMark("guangzhijian_chongneng", 1);
						// 令此牌伤害+1
						trigger.num++;
					}
				},
			},
			nanman: {
				trigger: {
					global: "useCard",
				},
				locked: false,
				filter: function (event, player) {
					return event.card && event.card.name == "nanman" && event.player != player;
				},
				prompt2: function (event, player) {
					return "是否令" + get.translation(event.player) + "失去1体力？";
				},
				content: function () {
					trigger.player.loseHp();
				},
			},
		},
	},
	wangnvdeyiyuan: {
		trigger: {
			global: "damageBegin",
		},
		forced: true,
		locked: false,
		filter: function (event, player) {
			// 当Hina受到伤害时触发
			return event.player.name == "Hina";
		},
		priority: 10,
		content: function () {
			// 检查是否有足够的充能标记
			const markCount = player.countMark("guangzhijian_chongneng");
			if (markCount >= trigger.num) {
				// 有足够的充能标记，失去相应数量的充能标记令伤害失效
				player.removeMark("guangzhijian_chongneng", trigger.num);
				trigger.cancel();
				event.finish();
			} else {
				// 没有足够的充能标记，代为承受伤害
				trigger.player = player;
				trigger.targets = [player];
			}
		},
	},
	feitiandazhou: {
		enable: "phaseUse",
		filter: function (event, player) {
			// 体力大于1且能失去2体力但不会降到1以下
			return player.hp > 1;
		},
		content: function () {
			// 失去2体力
			if (player.hp - 2 < 1) player.loseHp(player.hp - 1);
			else player.loseHp(2);
			
			// 添加本回合伤害+1的技能效果
			player.addTempSkill("feitiandazhou_buff");
			player.addMark("feitiandazhou_buff", 1, false);
		},
		subSkill: {
			buff: {
				trigger: { 
					source: "damageBegin" 
				},
				forced: true,
				locked: false,
				popup: false,
				onremove: function (player) {
					player.removeMark("feitiandazhou_buff", player.countMark("feitiandazhou_buff"), false);
				},
				content: function () {
					// 伤害+1
					trigger.num += player.countMark("feitiandazhou_buff");
					
					// 令目标随机失去装备区的1张牌
					if (trigger.player.countCards("e") > 0) {
						const cards = trigger.player.getCards("e");
						const card = cards.randomGet();
						if (card) {
							trigger.player.discard(card);
						}
					}
				},
				marktext: "肘",
				intro: {
					name: "飞天大肘",
					content: "本回合内造成的伤害+#，且目标随机失去装备区的1张牌",
				},
			}
		}
	},
	lurenwangdefanying: {
		forced: true,
		locked: false,
		init: function (player) { 
			player.storage.lurenwangdefanying = {
				defend: false,
			};
		},
		group: ["lurenwangdefanying_damage", "lurenwangdefanying_phase"],
		subSkill: {
			damage: {
				trigger: {
					player: "damageBegin",
				},
				forced: true,
				locked: false,
				content: function () {
					if (!player.storage.lurenwangdefanying.defend) {
						player.addMark("lurenwangdefanying_damage", 1, true);
						player.storage.lurenwangdefanying.defend = true;
					} else {
						trigger.num = 0;
						player.removeMark("lurenwangdefanying_damage", 1, true);
						player.storage.lurenwangdefanying.defend = false;
					}
				},
				marktext: "反",
				intro: {
					name: "路人王的反应",
					nocount: true,
					content: "防止下一次受到的伤害",
				},
			},
			phase: {
				trigger: {
					player: "phaseBegin",
				},
				forced: true,
				locked: false,
				content: function () {
					// 计算x/2，x为体力上限，向下取整
					const halfMaxHp = Math.floor(player.maxHp / 2);
					// 如果当前体力不足x/2
					if (player.hp < halfMaxHp) {
						// 将体力回复至x/2+1
						const targetHp = halfMaxHp + 1;
						if (targetHp > player.hp) {
							player.recoverTo(targetHp);
						}
					}
				}
			}
		}
	},
	chudifantan: {
		trigger: {
			player: "changeHp",
		},
		forced: true,
		locked: false,
		popup: false,
		content: function () { 
			if (player.hp <= 1) {
				player.addMark("chudifantan", 1, true);
				player.addSkill("chudifantan_baseDamage");
				player.addSkill("chudifantan_directHit");
				player.addSkill("chudifantan_dying");
			} else {
				player.removeMark("chudifantan", 1, true);
				player.removeSkill("chudifantan_baseDamage");
				player.removeSkill("chudifantan_directHit");
				player.removeSkill("chudifantan_dying");
			}
		},
		marktext: "底", 
		intro: {
			name: "触底反弹",
			nocount: true,
			content: "其使用的【杀】无法被响应且伤害+1。当其使用【杀】令其他角色进入濒死状态时：其回复所有体力；其获得该角色的所有手牌",
		},
		subSkill: {
			baseDamage: {
				trigger: {
					player: "shaBegin",
				},
				forced: true,
				locked: false,
				popup: false,
				content: function () { 
					trigger.baseDamage++;
				},
			},
			directHit: {
				trigger: {
					player: "useCardToPlayered",
				},
				forced: true,
				locked: false,
				popup: false,
				filter: function (event, player) {
					return event.card.name == "sha";
				},
				content: function () {
					trigger.directHit.addArray(trigger.targets);
				},
			},
			dying: {
				trigger: {
					source: "dying",
				},
				filter: function (event, player) {
					if (event.getParent("damage").card.name != "sha") return false;
					return event.player != player;
				},
				forced: true,
				locked: false,
				popup: false,
				content: function () {
					player.recoverTo(player.maxHp);
					
					const cards = trigger.player.getCards("h");
					if (cards.length > 0) {
						player.gain(cards, trigger.player);
					}
				},
			},
		},
	},
	jiuchengsanwujin: {
		trigger: {
			global: "useSkill",
		},
		forced: true,
		locked: false,
		filter: function (event, player) { 
			return event.player.name == "shijiu" && event.skill == "chaojuefeidan";
		},
		content: function () { 
			player.recover();
			player.draw();
		},
	},
	"xunhangdaodan": {
		mark: true,
		marktext: "乐",
		intro: {
			name: "乐子",
			content: function (storage, player) {
				const str = "当前拥有" + player.countMark("xunhangdaodan") + "个【乐子】标记";
				const skillGet = "<br>已获得【超绝飞弹】技能";
				if (player.storage.xunhangdaodan_awakened) return str + skillGet;
				return str;
			} 
		},
		derivation: ["chaojuefeidan"],
		group: ["xunhangdaodan_hp", "xunhangdaodan_die", "xunhangdaodan_toOne", "xunhangdaodan_awaken"],
		subSkill: {
			hp: {
				trigger: {
					global: ["changeHp", "changeMaxHp"],
				},
				forced: true,
				locked: false,
				content: function () {
					// 获得1【乐子】标记
					player.addMark("xunhangdaodan", 1, true);
				},
			},
			die: {
				trigger: {
					global: "die",
				},
				forced: true,
				locked: false,
				content: function () {
					// 当有角色阵亡，获得2【乐子】标记
					player.addMark("xunhangdaodan", 2, true);
				},
			},
			toOne: {
				trigger: {
					player: "changeHp",
				},
				forced: true,
				filter: function (event, player) {
					// 当你体力变为1时触发
					return player.hp == 1;
				},
				content: function () {
					// 获得1【乐子】标记
					player.addMark("xunhangdaodan", 5, true);
				},
			},
			awaken: {
				trigger: {
					player: "phaseZhunbeiBegin",
				},
				forced: true,
				locked: false,
				skillAnimation: true,
				filter: function (event, player) {
					// 准备阶段，若【乐子】标记数不小于5
					return player.countMark("xunhangdaodan") >= 5 && !player.storage.xunhangdaodan_awakened;
				},
				content: function () {
					// 觉醒标记
					player.awakenSkill("xunhangdaodan_awaken");
					player.storage.xunhangdaodan_awakened = true;
					
					// 获得技能【超绝飞弹】
					player.addSkill("chaojuefeidan");
				},
			},
		},
	},
	chaojuefeidan: {
		enable: "phaseUse",
		usable: 1,
		selectTarget: 1,
		filterTarget: function (card, player, target) {
			// 只能对其他角色使用
			return target != player;
		},
		content: function () {
			// 计算伤害值 x-3 (x为【乐子】标记数)
			const num = player.countMark("xunhangdaodan");
			const damageValue = num - 3;
			
			// 对目标造成伤害
			if (damageValue > 0) {
				event.target.damage(damageValue);
			}
			
			// 令目标获得【破甲】
			if (!event.target.hasSkill("chaojuefeidan_pojia")) {
				event.target.addSkill("chaojuefeidan_pojia");
				event.target.addMark("chaojuefeidan_pojia", 1, true);
			}
		},
		subSkill: {
			// 【破甲】的效果实现
			pojia: {
				marktext: "破",
				intro: {
					name: "破甲",
					nocount: true,
					content: "受到伤害时伤害值+1",
				},
				trigger: {
					player: "damageBegin",
				},
				forced: true,
				locked: false,
				content: function () {
					// 伤害值+1
					trigger.num++;
				},
			},
		},
	},
	niaoshoushourenzhuli: {
		group: ["niaoshoushourenzhuli_defense", "niaoshoushourenzhuli_thunder", "niaoshoushourenzhuli_dying"],
		subSkill: {
			defense: {
				trigger: {
					player: "damageBegin",
				},
				forced: true,
				firstDo: true,
				filter: function (event, player) {
					// 不受黑色杀和南蛮入侵伤害
					if (event.card) {
						if (event.card.name == "sha" && get.color(event.card) == "black") return true;
						if (event.card.name == "nanman") return true;
					}
					// 不受火焰伤害
					if (event.nature == "fire") return true;
					return false;
				},
				content: function () {
					// 取消伤害
					trigger.cancel();
				},
			},
			thunder: {
				trigger: {
					player: "damageBegin",
				},
				forced: true,
				filter: function (event, player) {
					// 受到雷电伤害时伤害值-1
					return event.nature == "thunder" && event.num > 0;
				},
				content: function () {
					// 伤害值-1
					trigger.num--;
				},
			},
			dying: {
				trigger: {
					player: "dying",
				},
				filter: function (event, player) {
					// 濒死时持有父标记和母标记
					return player.countMark("jiuzhuandacheng_fu") > 0 && player.countMark("jiuzhuandacheng_mu") > 0;
				},
				content: function () {
					// 获取父标记和母标记数量
					var fuCount = player.countMark("jiuzhuandacheng_fu");
					var muCount = player.countMark("jiuzhuandacheng_mu");
					
					// 失去所有父标记和母标记
					player.removeMark("jiuzhuandacheng_fu", fuCount, true);
					player.removeMark("jiuzhuandacheng_mu", muCount, true);
					
					// 弃置所有手牌
					if (player.countCards("h") > 0) {
						player.discard(player.getCards("h"));
					}
					
					// 回复(x+y)/2体力（向下取整）
					var recoverNum = Math.floor((trigger.fuCount + trigger.muCount) / 2);
					if (recoverNum > 0) {
						player.recover(recoverNum);
					}
				},
			},
		},
	},
	jiuzhuandacheng: {
		locked: false,
		init: function (player) {
			// 初始化存储，用于记录橙子造成的伤害和回复的体力
			// [伤害累计值, 回复累计值]
			player.storage.jiuzhuandacheng = [0, 0];
		},
		group: ["jiuzhuandacheng_transfer", "jiuzhuandacheng_fu", "jiuzhuandacheng_mu"],
		subSkill: {
			transfer: {
				trigger: {
					player: "damageBegin",
				},
				locked: false,
				prompt2: function (event, player) {
					return "是否将此" + event.num + "点伤害转移给橙子？"
				},
				filter: function (event, player) {
					// 检查是否有角色名为"橙子"的玩家在场
					return game.hasPlayer(function (current) {
						return current.name == "chengzi";
					});
				},
				content: function () {
					// 将伤害转移到橙子身上
					var chengzi = game.findPlayer(function (current) {
						return current.name == "chengzi";
					});
					
					if (chengzi) {
						trigger.player = chengzi;
					}
				},
			},
			fu: {
				trigger: {
					global: "damage",
				},
				forced: true,
				locked: false,
				filter: function (event, player) {
					// 检查伤害来源是否为橙子
					return event.source && event.source.name == "chengzi" && event.num > 0;
				},
				content: function () {
					// 累计橙子造成的伤害
					player.storage.jiuzhuandacheng[0] += trigger.num;
					
					// 每造成2点伤害，获得1个【父】标记
					var now = player.storage.jiuzhuandacheng[0];
					var add = Math.floor(now / 2);
					if (add > 0) {
						player.addMark("jiuzhuandacheng_fu", add, true);
						player.storage.jiuzhuandacheng[0] -= 2 * add;
					}
				},
				marktext: "父",
				intro: {
					name: "父",
					content: "当前拥有#个【父】标记",
				},
			},
			mu: {
				trigger: {
					global: "recoverAfter",
				},
				forced: true,
				locked: false,
				filter: function (event, player) {
					// 检查回复体力的角色是否为橙子
					return event.player.name == "chengzi";
				},
				content: function () {
					// 累计橙子回复的体力
					player.storage.jiuzhuandacheng[1] += trigger.num;
					
					// 每回复2点体力，获得1个【母】标记
					var now = player.storage.jiuzhuandacheng[1];
					var add = Math.floor(now / 2);
					if (add > 0) {
						player.addMark("jiuzhuandacheng_mu", add, true);
						player.storage.jiuzhuandacheng[1] -= 2 * add;
					}
				},
				marktext: "母",
				intro: {
					name: "母",
					content: "当前拥有#个【母】标记",
				},
			},
		},
	},
	aidechuanbo: {
		init: function(player) { 
			player.storage.aidechuanbo_mark = null;
		},
		group: ["aidechuanbo_mark", "aidechuanbo_draw", "aidechuanbo_recover", "aidechuanbo_dying", "aidechuanbo_transfer"],
		subSkill: {
			mark: {
				trigger: {
					player: "phaseBegin",
				},
				filter: function (event, player) { 
					return player.storage.aidechuanbo_mark == null;
				},
				async content (event, trigger, player) {
					const result = await player.chooseTarget("令一名其他角色获得【<span style=\"color: #FFC0CB;\">❤</span>】标记", 1, function (card, player, target) {
						return target != player && !target.hasSkill("aidechuanbo_ai");
					}).set("ai", function (target) {
						return get.attitude(player, target);
					}).forResult();

					if (result.bool) {
						var target = result.targets[0];
						target.addSkill("aidechuanbo_ai");
						player.storage.aidechuanbo_mark = target;
					}
				},
			},
			ai: {
				mark: true,
				marktext: "<span style=\"color: #FFC0CB;\">❤</span>",
				intro: {
					name: "<span style=\"color: #FFC0CB;\">爱</span>",
					nocount: true,
					content: function(storage, player) { 
						return "<span style=\"color: #FFC0CB;\">来自某不正经粉毛的爱</span>";
					},
				},
			},
			draw: {
				trigger: {
					global: "drawAfter",
				},
				forced: true,
				filter: function (event, player) {
					return event.player.hasSkill("aidechuanbo_ai") && event.num > 0;
				},
				content: function () {
					player.draw();
				},
			},
			recover: {
				trigger: {
					global: "phaseEnd",
				},
				forced: true,
				filter: function (event, player) {
					return event.player.hasSkill("aidechuanbo_ai");
				},
				content: function () {
					player.recover();
					trigger.player.recover();
				},
			},
			dying: {
				trigger: {
					global: "dying",
				},
				prompt2: function (event, player) {
					return "是否弃置" + player.maxHp + "张手牌将" + get.translation(event.player) + "体力回复至" + player.maxHp + "？"
				},
				filter: function (event, player) {
					return event.player.hasSkill("aidechuanbo_ai") && player.getCards("h").length >= player.maxHp;
				},
				async content (event, trigger, player) {
					var target = trigger.player;
					var maxHp = player.maxHp;
					const result = await player.chooseToDiscard("h", maxHp).set("ai", function (card) {
						return get.value(card) * (target.hp < maxHp ? 1.5 : 1);
					}).forResult();

					if (result.bool) {
						target.recoverTo(maxHp);
					}
				},
			},
			transfer: {
				trigger: {
					player: "damageBefore",
				},
				prompt2: function (event, player) { 
					return "是否将此" + event.num + "伤害转移给" + get.translation(player.storage.aidechuanbo_mark);
				},
				filter: function (event, player) {
					if (player.storage.aidechuanbo_mark == null) return false;
					return player.storage.aidechuanbo_mark.isAlive();
				},
				content: function () {
					var target = player.storage.aidechuanbo_mark;
					player.storage.aidechuanbo_mark = null;
					trigger.player = target;
				},
			},
		},
	},
	aishen: {
		locked: false,
		group: ["aishen_maxHandcard", "aishen_useCard", "aishen_disable", "aishen_useCardToPlayered", "aishen_lose", "aishen_useCardAfter"],
		subSkill: {
			maxHandcard: {
				lastDo: true,
				locked: true,
				mod: {
					maxHandcard: function (player, num) {
						// 手牌上限始终为2x（x为体力上限）
						return player.maxHp * 2;
					},
				},
			},
			useCard: {
				locked: false,
				mod: {
					targetInRange: function (card, player, target, now) {
						// 使用锦囊牌不受距离限制
						if (["trick", "delay"].includes(get.type(card))) return true;
					},
				},
			},
			disable: {
				locked: false,
				mod: {
					targetEnabled: function (card, player, target) {
						// 无法成为【乐不思蜀】的目标
						if (card.name == "lebu") return false;
					},
				},
			},
			useCardToPlayered: {
				init: function (player) { 
					player.storage.aishen_maxHp = 0;
				},
				trigger: {
					player: "useCard",
				},
				forced: true,
				locked: false,
				filter: function (event, player) {
					// 当使用的锦囊牌仅有1个目标时
					if (!["trick", "delay"].includes(get.type(event.card))) return false;
					if (player.storage.aishen_maxHp >= 7) return false; // 最多获得7体力上限
					// 检查目标数是否为1
					var targets = event.targets;
					return targets && targets.length == 1;
				},
				content: function () {
					// 体力上限+1
					player.gainMaxHp();
					player.storage.aishen_maxHp++;
				},
			},
			lose: {
				trigger: {
					player: "loseEnd",
				},
				forced: true,
				locked: false,
				filter: function (event, player) {
					// 当失去装备区的牌时
					for (var i = 0; i < event.cards.length; i++) {
						if (event.cards[i].original == "e") return true;
					}
				},
				content: function () {
					// 回复1体力
					player.recover();
				},
			},
			useCardAfter: {
				trigger: {
					target: "useCardToTargeted",
				},
				forced: true,
				locked: false,
				filter: function (event, player) {
					// 目标包含你在内的锦囊牌结算完成后
					if (!["trick", "delay"].includes(get.type(event.card))) return false;
					return true;
				},
				content: function () {
					// 回复1体力
					player.recover();
				},
			},
		},
	},
	fenseyaojing: {
		enable: ["chooseToUse"],
		filterCard: function (card, player) {
			return get.color(card);
		},
		viewAs: function (cards, player) {
			var name = false;
			switch (get.color(cards[0])) {
				case "red":
					name = "lebu";
					break;
				case "black":
					name = "juedou";
					break;
			}
			if (name) return { name: name };
		},
		position: "hes",
		prompt2: "将红色牌当做【乐不思蜀】使用或打出，黑色牌当做【决斗】使用或打出",
		viewAsFilter: function (player) {
			return player.countCards("hes") > 0;
		},
	},
	yuanxing: {
		mod: {
			maxHandcard: function (card, player) {
				return Infinity;
			},
		},
		group: ["yuanxing_draw", "yuanxing_gain"],
		subSkill: {
			draw: {
				trigger: {
					source: "damageAfter",
					player: ["useCardAfter", "respondAfter"],
				},
				filter: function (event, player) {
					if (event.name == "damage") return event.num > 0;
					else return event.card && _status.currentPhase != player && ["sha", "shan", "wuxie"].includes(event.card.name);
				},
				prompt2: "你可以摸1张牌",
				content: function () {
					player.draw();
				}
			},
			gain: {
				trigger: {
					global: "useSkill",
				},
				usable: 3,
				filter: function (event, player) {
					return event.player != player;
				},
				prompt2: function (event, player) {
					return "你可以获得" + get.translation(event.player) +"的1张手牌";
				},
				async content (event, trigger, player) {
					await player.gainPlayerCard(trigger.player, "h", 1, false).set("ai", function (card) {
						return get.value(card, player);
					});
				},
			},
		},
	},
	xurui: {
		trigger: {
			global: "useCard",
		},
		forced: true,
		locked: false,
		filter: function (event, player) { 
			return event.card && ["guohe", "shunshou"].includes(event.card.name) && event.targets.contains(player);
		},
		content: function () {
			trigger.cancel();
		},
	},
	wuhui: {
		trigger: {
			player: "damageBegin",
		},
		forced: true,
		locked: false,
		lastDo: true,
		filter: function (event, player) {
			return event.card && ["trick", "delay"].includes(get.type(event.card));
		},
		content: function () {
			trigger.num = 0;
		},
	},
	huigui: {
		trigger: {
			global: "phaseBegin",
		},
		forced: true,
		locked: false,
		async content(event, trigger, player) {
			const result = await player.judge(function (card) {
				return get.color(card) == "black" ? 1.5 : -1.5;
			}).forResult();
			if (result.color == "black") player.recover();
		},
	},
	huizhang: {
		mod: {
			canBeReplaced: function (card, pkayer) {
				// 防具无法被替换
				if (get.type(card) == "equip2") return false;
			},
			canBeDiscarded: function (card, player, target) {
				// 防具无法被弃置
				if (get.type(card) == "equip2") return false;
			}
		},
		trigger: {
			global: "gameStart",
			player: "enterGame",
		},
		forced: true,
		locked: false,
		content: function () {
			// 创建防爆盾并装备
			var card = game.createCard("fangbaodun", "heart", 13);
			player.equip(card);
		},
		group: ["huizhang_lose", "huizhang_equip"],
		subSkill: {
			lose: {
				trigger: {
					player: "loseAfter",
				},
				forced: true,
				locked: false,
				popup: false,
				filter: function (event, player) {
					// 失去防具时重新装备
					return event.es && event.es.some(card => get.subtype(card) == "equip2");
				},
				content: function () {
					game.delay(0.5);
					// var card = game.createCard("fangbaodun", "diamond", 1);
					var card = null;
					trigger.cards.forEach(function (now) {
						if (now.name == "fangbaodun") {
							card = now;
							return;
						}
					})
					player.equip(card);
				},
			},
			equip: {
				trigger: {
					player: "equipBefore",
				},
				forced: true,
				popup: false,
				filter: function (event, player) {
					// 尝试装备其他防具时阻止
					return get.subtype(event.card) == "equip2" && event.card.name != "fangbaodun";
				},
				content: function () {
					trigger.cancel();
					game.log(player, "无法装备其他防具");
				},
			},
		},
	},
	danchun: {
		locked: false,
		mod: {
			targetEnabled: function (card, player, target) {
				if (get.type(card) == "delay") return false;
			},
		},
		ai: {
			noCompareTarget: true,
		},
	},
	huanzhai: {
		trigger: {
			global: "phaseEnd",
		},
		forced: true,
		locked: false,
		async content (event, trigger, player) {
			var list = ["受到1伤害", "弃置2张手牌"];
			if (player.countCards("h") < 2) list = ["受到1伤害"];
			const result = await player.chooseControl(list).set("ai", function () {
				if (player.hp > 3 || player.countCards("h") < 2) return list[0];
				return list[1];
			}).forResult();

			if (result.control == list[0]) {
				player.damage();
			} else {
				await player.chooseToDiscard("h", 2).set("ai", function (card) {
					return 6 - get.value(card);
				});
			}
		},
	},
};

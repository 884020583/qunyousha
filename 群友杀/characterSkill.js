import { lib, game, ui, get, ai, _status } from '../../noname.js'
export const skill = {
	keai: {
		trigger: {
			player: "damageBegin",
		},
		forced: true,
		locked: true,
		filter: function (event, player) {
			return event.card && event.source;
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
		ai: {
			nodamage: true,
			effect: {
				target: function (card, player, target) {
					if (player.countCards("h") < 2) return 0;
				},
			},
		},
		group: ["keai_draw"],
		subSkill: {
			draw: {
				trigger: {
					player: "damageAfter",
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					return event.num > 0;
				},
				content: function () {
					player.draw();
				},
			},
		},
		"_priority": 0,
	},
	zako_dejiban: {
		locked: true,
		group: ["zako_dejiban_subskill1", "zako_dejiban_subskill2"],
		subSkill: {
			"subskill1": {
				trigger: {
					player: "recoverBegin",
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					return event.source && event.source.hasSkill("zako_dejiban") && (event.source !== player);
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
				locked: true,
				filter: function (event, player) {
					return event.card && event.card.name == "tao" && event.source != player 
						&& !player.isDying() && event.source.hasSkill("zako_dejiban");
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
					continueBool = await player.chooseBool("是否再次发动【哈气！！！】？").forResultBool();
				} else {
					await player.$throw(event.cards, 1000);
					await player.lose(event.cards, ui.discardPile, "visible");

					var x = event.cards.length;
					let damage_num = Math.ceil(x / 2);
					damage_num = Math.max(1, Math.min(damage_num, 3));
					if (damage_num > 0) {
						const chooseTarget = await player.chooseTarget("请选择一名其他角色对其造成" + damage_num + "点伤害", function (card, player, target) { 
							return target != player ;
						}).set("ai", function (target) {
							var num = 1 + (target.maxHp - target.hp);
							if (target.hp <= 1) num += 0.5;
							if (get.attitude(player, target) > 0) num = -1;
							return num;
						}).forResult();
						if (chooseTarget.bool) {
							await chooseTarget.targets[0].damage(damage_num);
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
	wodaoyaokankan: {
		trigger: {
			source: "damageAfter",
		},
		filter: function (event, player) { 
			return event.num > 0 && event.player != player && event.player.countCards("h") > 0;
		},
		async content (event, trigger, player) { 
			await player.discardPlayerCard("你可以弃置其中1张", trigger.player, "h", 1, false, "visible").set("ai", function (card) {
				return get.value(card, trigger.player);
			});
		},
	},
	test1: {
		enable: "phaseUse",
		content: function () { 
			const newPlayer = ui.create.player();
			newPlayer.getId();
			newPlayer.init(player.name).addTempClass("start");
			newPlayer.setIdentity("fan");
			newPlayer.identity = "fan";
			newPlayer.side = true;
			
			newPlayer.dataset.position = game.players.length;
			game.players.push(newPlayer);
			if (game.players.length > 1) {
				const previousPlayer = game.players[game.players.length - 2];
				previousPlayer.next = newPlayer;
				newPlayer.previous = previousPlayer;
				newPlayer.next = game.players[0];
				game.players[0].previous = newPlayer;
			} else {
				newPlayer.next = newPlayer;
				newPlayer.previous = newPlayer;
			}
			
			ui.arena.appendChild(newPlayer);
			ui.arena.setNumber(game.players.length);
		},
	},
	test2: {
		enable :"phaseUse",
		content: function () { 
			game.createTrigger("phaseEnd", "test2_b", player, { player: player }, null);
			
		},
		group: ["test2_a", "test2_b"],
		subSkill: {
			a: {
				trigger: {
					player: "phaseEnd",
				},
				content: function () {
					player.draw(5);
				},
			},
			b: {
				trigger: {
					player: "phaseEnd",
				},
				content: function () {
					player.damage();
				},
			},
		},
	},
	mengwu: {
		locked: true,
		group: ["mengwu_subskill1", "mengwu_subskill2_sha", "mengwu_subskill2_trick"],
		subSkill: {
			"subskill1": {
				enable: "phaseUse",
				usable: 1,
				selectTarget: 1,
				locked: true,
				filterTarget: function (card, player, target) {
					return target != player;
				},
				async content (event, trigger, player) {
					const target = event.target;
					const result = await player.chooseToGive(target, "h", 1, true).set("ai", function (card) {
						return target.getUseValue(card);
					}).forResult();

					if (result.bool) {
						target.recover();
						target.addTempSkill("mengwu_damageAdd", { player: "phaseAfter" });
						if (!target.hasMark("mengwu_subskill1")) target.setMark("mengwu_subskill1", 1, true);
					}
				},
				marktext: "萌",
				intro: {
					name: "萌物",
					nocount: true,
					content: "该角色在其回合内造成的伤害+1",
				},
				check: function (event, player) {
					return game.hasPlayer(current => current != player && get.attitude(player, current) > 0);
				},
				ai: {
					order: 10,
					threaten: 1.2,
					result: {
						target: function (player, target) {
							var num = target.countCards("h");
							if (get.attitude(player, target) > 0 && target.getDamagedHp() > 0) {
								num++;
								if (target.hp <= 2) num++;
							}
							return num;
						},
					},
				},
				sub: true,
				sourceSkill: "mengwu",
				"_priority": 0,
			},
			damageAdd: {
				trigger: {
					source: "damageBegin",
				},
				forced: true,
				locked: true,
				charlotte: true,
				filter: function (event, player) {
					return event.num > 0 && _status.currentPhase == player;
				},
				content: function () {
					trigger.num++;
				},
				onremove: function (player) {
					if (player.hasMark("mengwu_subskill1")) player.removeMark("mengwu_subskill1", 1, true);
				},
				ai: {
					threaten: 1.5,
				},
				sub: true,
				sourceSkill: "mengwu",
				"_priority": 0,
			},
			"subskill2_sha": {
				trigger: {
					source: "damageBegin1",
				},
				forced: true,
				locked: true,
				firstDo: true,
				filter: function (event, player) {
					return event.num > 0 && event.card && event.card.name == "sha";
				},
				content: function () {
					trigger.cancel();
					ui.clear();
				},
				ai: {
					nodamage: true,
					effect: {
						player: function (card, player, target) {
							if (card.name == "sha") return [-1, 0, 0, 0];
						},
					},
				},
				sub: true,
				sourceSkill: "mengwu",
				"_priority": 0,
			},
			"subskill2_trick": {
				trigger: {
					source: "damageBegin",
				},
				locked: true,
				prompt2: function (event, player) { 
					return "是否令此" + get.translation(event.card) + "对" + get.translation(event.player) + "的伤害+1";
				},
				filter: function (event, player) {
					return event.num > 0 && event.card && get.type(event.card) == "trick" && get.tag(event.card, "damage");
				},
				content: function () {
					trigger.num++;
				},
				check: function (event, player) {
					return get.attitude(player, event.player) < 0;
				},
				ai: {
					threaten: 1.1,
					effect: {
						player: function (card, player, target) {
							if (get.tag(card, "damage") && get.type(card) == "trick") return [0, 0, 1, 1];
						},
					},
				},
				sub: true,
				sourceSkill: "mengwu",
				"_priority": 0,
			},
		},
		"_priority": 0,
	},
	nihenbangle: {
		locked: true,
		group: ["nihenbangle_subskill1", "nihenbangle_subskill2", "nihenbangle_subskill3", "nihenbangle_subskill4", "nihenbangle_subskill5_mark", "nihenbangle_subskill5_content"],
		subSkill: {
			"subskill1": {
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
				locked: true,
				filter: function (event, player) {
					if (_status.currentPhase == player) return false;
					if (player.getDamagedHp() == 0) return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (["h", "e"].includes(event.cards[i].original)) return true;
					}
					return false;
				},
				content: function () {
					player.recover();
				},
				ai: {
					effect: {
						target: function (card, player, target) {
							if (["guohe", "shunshou"].includes(card.name) && target.getDamagedHp() > 0) return [1, -1.5];
						},
					},
				},
				sub: true,
				sourceSkill: "nihenbangle",
				"_priority": 0,
			},
			"subskill3": {
				enable: ["chooseToUse"],
				usable: Infinity,
				locked: true,
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
					if (name) return { name: name };
				},
				viewAsFilter: function (player) {
					return player.countCards("hs") > 0;
				},
				position: "hs",
				prompt2: "你可以将红色【杀】当做【乐不思蜀】使用，黑色【杀】当做【兵粮寸断】使用",
				ai: {
					threaten: 2,
				},
				sub: true,
				sourceSkill: "nihenbangle",
				"_priority": 0,
			},
			"subskill4": {
				trigger: {
					global: "dieAfter",
				},
				forced: true,
				locked: true,
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
				locked: true,
				filter: function (event, player) {
					return event.skill == "mengwu_subskill1";
				},
				content: function () {
					var last = game.findPlayer(function (current) {
						return current.hasMark("nihenbangle_subskill5_mark");
					});
					if (last) last.removeMark("nihenbangle_subskill5_mark");
					const target = trigger.targets[0];
					if (!target.hasMark("nihenbangle_subskill5_mark")) target.setMark("nihenbangle_subskill5_mark", 1, true);
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
				locked: true,
				filter: function (event, player) {
					return game.hasPlayer(function (current) {
						return current.hasMark("nihenbangle_subskill5_mark");
					});
				},
				content: function () {
					var last = game.findPlayer(function (current) {
						return current.hasMark("nihenbangle_subskill5_mark");
					});
					last.gain(player.getCards("h"), "gain2");
					last.recover(player.maxHp);
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
		locked: true,
		filter: function (event, player) {
			if (game.hasPlayer(current => current.name == "huli", false)) return true;
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
			player.loseHp();
			target.addMark("hufeng", 1, true);
			target.addTempSkill(["baiban", "hufeng_subskill_removeMark"], "phaseAfter");
			target.storage.hufeng_source = player;
		},
		marktext: "封",
		intro: {
			name: "狐封",
			nocount: true,
			content: function (storage, player) {
				return "该角色在本回合内所有技能失效，且" + get.translation(player.storage.hufeng_source) + "对其使用【杀】无次数限制";
			},
		},
		ai: {
			order: 10,
			threaten: 2,
			effect: {
				player: function (card, player, target) { 
					if (card.name == "sha") return [1, 1, 1, 1];
					if (get.tag(card, "damage")) return [1, 0, 1, 0];
				},
			},
			result: {
				player: function (player) {
					const damageCard = player.getCards("h", card => get.tag(card, "damage"));
					if (damageCard.length > 0) {
						for (const card of damageCard) {
							if (game.hasPlayer(current => current != player && get.attitude(player, current) < 0 && player.canUse(card, current))) {
								return player.hp > 3 ? 1 : -5;
							}
						}
					}
					return -10;
				},
				target: function (player, target) {
					if (get.attitude(player, target) > 0) return -10;
					var order = 0;
					const damageCard = player.getCards("h", card => get.tag(card, "damage"));
					if (damageCard.length > 0) {
						for (const card of damageCard) {
							if (player.canUse(card, target)) order++;
						}
					}
					const threaten = get.threaten(target, player, true);
					return -threaten - order;
				},
			},
		},
		group: ["hufeng_subskill_sha"],
		subSkill: {
			"subskill_removeMark": {
				charlotte: true,
				onremove: function (player) {
					player.removeMark("hufeng", 1, true);
					delete player.storage.hufeng_source;
				},
			},
			"subskill_sha": {
				trigger: {
					player: "useCard",
				},
				forced: true,
				locked: true,
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
				ai: {
					effect: {
						target: function (card, player, target) {
							if (get.tag(card, "damage")) return [1, -1, 0, 0];
						},
					},
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
				ai: {
					effect: {
						player: function (card, player, target) {
							if (card.name == "sha" && player.hp < player.maxHp) return [1, 1];
						},
					},
				},
			},
		},
	},
	nizhendehenbang: {
		locked: true,
		group: ["nizhendehenbang_ison", "nizhendehenbang_die"],
		subSkill: {
			ison: {
				trigger: {
					global: "gameStart",
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					return game.hasPlayer(current => current.name == "lianyu");
				},
				content: function () {
					player.maxHp++;
					player.hp++;
				},
			},
			die: {
				trigger: {
					global: "dieAfter",
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					return event.player.name == "lianyu";
				},
				content: function () {
					player.loseMaxHp(2);
					if (player.hp < player.maxHp) player.recoverTo(player.maxHp);
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
				locked: true,
				charlotte: true,
				popup: false,
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
				ai: {
					threaten: 1.2,
					effect: {
						player: function (card, player, target) {
							if (card.name == "sha") return [0, 0, 0, -1];
						},
					},
				},
			},
		},
	},
	heshu: {
		trigger: {
			player: "loseEnd",
		},
		filter: function (event, player) {
			return player.countCards("h") < 3;
		},
		forced: true,
		locked: true,
		content: function () { 
			player.drawTo(3);
		},
		ai: {
			threaten: function (player, target) {
				const equip1 = target.getEquip(1);
				if (equip1 && equip1.name == "zhangba") return 3;
				return 1.2;
			},
			noh: true,
			freeSha: true,
			freeShan: true,
			skillTagFilter: function (player, tag , arg) {
				const equip1 = player.getEquip(1);
				if (equip1 && equip1.name == "zhangba" && tag == "freeSha") return true;
				if (player.countCards("h") > 3) return false;
			},
			value: function (card, player) {
				if (card.name == "zhangba") return 15;
				if (card.name == "guanshi") return 8;
				const equip1 = player.getEquip(1);
				if (equip1 && equip1.name == "zhangba" && card.name == "sha") return 10;
				return get.value(card);
			},
			effect: {
				player: function (card, player, target) {
					const equip1 = player.getEquip(1);
					if (equip1 && equip1.name == "zhangba") {
						if (card.name == "sha") return [1, 10, 1, -10];
						if (get.subtype(card) == "equip1") return -10;
					} 
					if (player.countCards("h") <= 3) return [1, 1, 1, 0];
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
				},
				ai: {
					effect: {
						player: function (card, player, target) {
							if (card.suit == player.storage.Restrict.last_suit) return [1, 1];
						},
						target: function (card, player, target) {
							if (card.suit == target.storage.Restrict.last_suit) return [1, 1];
						},
					},
				},
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
				locked: true,
				selectCard: 1,
				filterCard: true,
				position: "hes",
				filter: function (event, player) {
					return player.countMark("Permissions_subskill1") > 0 && player.getCards("he").length > 0;
				},
				content: function() {
					player.removeMark("Permissions_subskill1", 1, true);
					player.useCard({name: "wuzhong"}, player, false);
				},
				ai: {
					order: 9,
					threaten: 1.2,
					result: {
						player: function (player) {
							return 2;
						},
					},
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
		locked: true,
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
			player.gain(event.targets[0].getCards("h"), "gainAuto");
		},
		ai: {
			order: 10,
			threaten: function (player, target) {
				if (target.countMark("Permissions_subskill1") >= player.maxHp) return 2;
				return 1.2;
			},
			result: {
				player: function (player) {
					return 10;
				},
				target: function (player, target) { 
					return -10;
				},
			},
		},
	},
	Database: {
		trigger: {
			global: "discardEnd",
		},
		forced: true,
		locked: true,
		filter: function (event, player) {
			if (event.player == player) return false;
			if (event.cards.length <= 0) return false;
			for (let card of event.cards) {
				if (card.original == "h") return true;
			}
			return false;
		},
		content: function () { 
			player.draw();
		},
		ai: {
			threaten: 1.1,
		},
	},
	lingguang: {
		persevereSkill: true,
		locked: true,
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
				juexingji: true,
				persevereSkill: true,
				forced: true,
				locked: true,
				unique: true,
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
		ai: {
			threaten: 1.1,
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
		ai: {
			threaten: 1.2,
			effect: {
				player: function (card, player, target) {
					switch (get.type(card)) {
						case "baisc":
							return [1, 1];
						case "trick":
							return [1, 2];
						case "equip":
							return player.getDamagedHp() > 0 ? [1, 1] : [1, 0];
						case "delay":
							return [1, 1.5];
					}
				},
			},
		},
	},
	jianqi: {
		init: function (player) {
			player.storage.jianqi = false;
		},
		enable: "phaseUse",
		zhuanhuanji: true,
		filter: function (event, player) {
			return player.countMark("lingguang") >= 10;
		},
		async content(event, trigger, player) {
			player.removeMark("lingguang", 10, true);
			if (player.storage.jianqi == true) {
				const targets = await player.chooseTarget("获得一名其他角色区域里的1张牌", 1, function (card, player, target) {
					return target != player && target.getCards("hej").length > 0;
				}).set("ai", function (target) {
					return get.attitude(player, target) < 0;
				}).forResultTargets();
				if (targets.length > 0) {
					await player.gainPlayerCard(targets[0], "hej", 1, false).set("ai", lib.card.shunshou.ai.button);
				}
			} else {
				player.draw();
				const bool = await player.chooseBool("是否交给一名其他角色1张牌？").set("ai", function () {
					return game.hasPlayer(function (target) {
						return get.attitude(player, target) > 0 && target.countCards("h") < 3;
					});
				}).forResultBool();
				if (bool) {
					const result = await player.chooseTarget(1, function (target) {
						return target != player;
					}).set("ai", function (target) {
						return get.attitude(player, target) > 0;
					}).forResult();
					if (result.bool) await player.chooseToGive(result.targets[0], "he", 1, false).set("ai", function (card) {
						return get.value(card, result.targets[0]);
					});
				}
			}
			player.changeZhuanhuanji("jianqi");
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
		ai: {
			threaten: 1.2,
			order: 9,
			result: {
				player: function (player) {
					return player.getHistory("useSkill", evt => evt.skill == "jianqi").length < 2 ? 10 : -10;
				},
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
			const result = await player.chooseControl(list).set("ai", function() {
				return list[Math.floor(Math.random() * list.length)];
			}).forResult();

			if (result.control == list[0]) {
				var list1 = lib.inpile.filter(function (card) {
					return get.type(card) == "basic" || get.type(card) == "trick";
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
					var resultcb = await player.chooseButton(["视为使用一张基本牌或非延时锦囊牌", [list2, "vcard"]], true).set("ai", function (button) {
						return player.getUseValue(button.link);
					}).forResult();
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
				const targets = await player.chooseTarget("对一名其他角色造成1伤害", 1, function (card, player, target) {
					return target != player;
				}).set("ai", function (target) {
					return get.damageEffect(target, player, player);
				}).forResultTargets();
				if (targets.length) targets[0].damage();
			} else {
				for (var current of game.players) {
					current.draw();
					if (current == player) continue;
					await current.chooseToGive(player, "he", [1, 2], true)
						.set("prompt", "交给" + get.translation(player) + "1或2张牌")
						.set("ai", function (card) {
							return get.attitude(current, player) <= 0 ? -10 : player.getUseValue(card);
						});
				}
			}
		},
		ai: {
			threaten: 2,
			order: 10,
			result: {
				player: function (player) {
					return 10;
				},
			},
		},
	},
	gousi: {
		enable: "phaseUse",
		usable: 1,
		async content(event, trigger, player) {
			const targets = await Promise.all(
				game.players.map(async current => {
					const bool = await current.chooseBool("h", true)
						.set("prompt", "你可以随机弃置1张手牌以参加" + get.translation(player.name) + "的议事")
						.set("ai", function () { return current.countCards("h") >= 2; })
						.forResultBool();
					return bool ? current : null;
				})
			).then(results => results.filter(Boolean));

			await Promise.all(targets.map(current => current.randomDiscard("h", 1)));

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
		ai: {
			threaten: 1.1,
			order: 11,
			result: {
				player: function (player) {
					return player.countCards("h") >= 2 ? 10 : -10;
				},
			},
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
					player.addMark("lingguang", 1, true);
				},
			},
			phase: {
				trigger: {
					player: "phaseUseEnd",
				},
				locked: true,
				filter: function (event, player) {
					return player.countMark("lingguang") >= 10 && player.countCards("h") > 0;
				},
				async content (event, trigger, player) {
					player.removeMark("lingguang", 10, true);
					
					const result = await player.chooseTarget(
						"请选择要分配手牌的角色",
						[1, Infinity],
						function (card, player, target) {
							return target != player;
						}
					).set("ai", function (target) {
						return get.attitude(player, target) > 0;
					}).forResult();
					
					if (result.bool) {
						const targets = result.targets;
						
						const handcards = player.getCards("h");
						const num = Math.floor(handcards.length / targets.length);
						
						if (num > 0) {
							handcards.randomSort();
							
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
				check: function (event, player) { 
					if (!game.hasPlayer(function (current) { return current != player && get.attitude(player, current) > 0; })) return false;;
					const num = player.countCards("h");
					return num > player.getHandcardLimit() || num <= 1;
				},
				ai: {
					threaten: 1.5
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
				locked: true,
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
				locked: true,
				filter: function (event, player) {
					return get.color(event);
				},
				content: function () {
					if (get.color(trigger) == "black") {
						trigger.baseDamage++;
					} else {
						trigger.target.addTempSkill("qinggang2");
						trigger.target.markSkill("qinggang2");
					}
				},
			},
			subskill4: {
				enable: ["chooseToUse", "chooseToRespond"],
				usable: Infinity,
				locked: true,
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
				locked: true,
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
				locked: true,
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
				usable: 4,
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
		locked: true,
		group: ["wumingwangnv_subskill1", "wumingwangnv_subskill2", "wumingwangnv_subskill3"],
		subSkill: {
			subskill1: {
				trigger: {
					player: "damageBefore",
				},
				forced: true,
				locked: true,
				firstDo: true,
				filter: function (event, player) {
					return event.card && event.card.name == "wanjian";
				},
				content: function () {
					trigger.cancel();
				},
			},
			subskill2: { 
				locked: true,
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
				locked: true,
				filter: function (event, player) {
					return event.source && event.source != player;
				},
				content: function () { 
					player.gainPlayerCard(trigger.source, "hej", 1, false).set("ai", lib.card.shunshou.ai.button);
				},
			},
		},
	},
	yongzhedezeren: {
		locked: true,
		group: ["yongzhedezeren_subskill1", "yongzhedezeren_subskill2"],
		subSkill: {
			subskill1: {
				trigger: {
					global: "useCardToPlayered",
				},
				forced: true,
				locked: true,
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
				locked: true,
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
				locked: true,
				charlotte: true,
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
		locked: true,
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
				locked: true,
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
				locked: true,
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
				locked: true,
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
		locked: true,
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
		init: function (player) {
			player.storage.feitiandazhou_num = 0;
		},
		group: ["feitiandazhou_loseHp", "feitiandazhou_damage"],
		subSkill: {
			loseHp: { 
				enable: "phaseUse",
				filter: function (event, player) {
					return player.hp > 1;
				},
				content: function () {
					if (player.hp - 3 < 1) player.loseHp(player.hp - 1);
					else player.loseHp(3);

					player.addTempSkill("feitiandazhou_buff");
					player.addMark("feitiandazhou_buff", 1, true);
				},
			},
			buff: {
				trigger: { 
					source: "damageBegin",
				},
				forced: true,
				locked: true,
				popup: false,
				onremove: function (player) {
					player.removeMark("feitiandazhou_buff", player.countMark("feitiandazhou_buff"), false);
				},
				filter: function (event, player) {
					return event.card && event.card.name == "sha" && player.hasMark("feitiandazhou_buff");
				},
				content: function () {
					// 伤害+1
					trigger.num += player.countMark("feitiandazhou_buff");
					
					// 令目标随机失去装备区的1张牌
					if (trigger.player.countCards("e") > 0) {
						const cards = trigger.player.getCards("e");
						const card = cards.randomGet();
						if (card) trigger.player.discard(card);
					}
				},
				marktext: "肘",
				intro: {
					name: "飞天大肘",
					content: "本回合内使用【杀】造成的伤害+#，且目标随机失去装备区的1张牌",
				},
			},
			damage: {
				trigger: {
					source: "damageEnd",
				},
				forced: true,
				filter: function (event, player) { 
					return event.num > 0;
				},
				content: function () { 
					player.recover();
					player.storage.feitiandazhou_num++;
					player.addTempSkill("feitiandazhou_cardUsable");
				},
			},
			cardUsable: {
				charlotte: true,
				onremove: function (player) {
					player.storage.feitiandazhou_num = 0;
				},
				mod: {
					cardUsable: function (card, player, num) {
						if (player.storage.feitiandazhou_num > 0 && card.name == "sha") return num + player.storage.feitiandazhou_num;
					}
				},
			},
		},
	},
	lurenwangdefanying: {
		forced: true,
		locked: true,
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
				locked: true,
				popup: false,
				content: function () {
					if (!player.storage.lurenwangdefanying.defend) {
						player.logSkill("lurenwangdefanying_damage");
						player.addMark("lurenwangdefanying_damage", 1, true);
						player.storage.lurenwangdefanying.defend = true;
					} else {
						player.logSkill("lurenwangdefanying_damage");
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
				locked: true,
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
		locked: true,
		popup: false,
		content: function () { 
			if (player.hp <= 1) {
				player.addMark("chudifantan", 1, true);
				player.addSkill("chudifantan_directHit");
				player.addSkill("chudifantan_dying");
			} else {
				player.removeMark("chudifantan", 1, true);
				player.removeSkill("chudifantan_directHit");
				player.removeSkill("chudifantan_dying");
			}
		},
		marktext: "底", 
		intro: {
			name: "触底反弹",
			nocount: true,
			content: "其使用的【杀】无法被响应，且当其使用【杀】令其他角色进入濒死状态时，其回复所有体力",
		},
		subSkill: {
			directHit: {
				trigger: {
					player: "useCardToPlayered",
				},
				forced: true,
				locked: true,
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
				locked: true,
				popup: false,
				content: function () {
					player.recoverTo(player.maxHp);
				},
			},
		},
	},
	jiuchengsanwujin: {
		trigger: {
			global: "useSkill",
		},
		forced: true,
		locked: true,
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
					global: "changeHpAfter",
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					return event.num < 0;
				},
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
				locked: true,
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
				locked: true,
				skillAnimation: true,
				filter: function (event, player) {
					// 准备阶段，若【乐子】标记数不小于10
					return player.countMark("xunhangdaodan") >= 10 && !player.storage.xunhangdaodan_awakened;
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
			const damageValue = num - 9;
			
			// 对目标造成伤害
			if (damageValue > 0) {
				target.damage(damageValue);
			}
			
			// 令目标获得【破甲】
			if (target.getEquip(2)) {
				target.discard(target.getEquip(2));
			}
		},
	},
	niaoshoushourenzhuli: {
		group: ["niaoshoushourenzhuli_defense", "niaoshoushourenzhuli_nature", "niaoshoushourenzhuli_dying"],
		subSkill: {
			defense: {
				trigger: {
					player: "damageBegin2",
				},
				forced: true,
				firstDo: true,
				filter: function (event, player) {
					if (event.card) {
						if (event.card.name == "sha" && get.color(event.card) == "black") return true;
					}
					return false;
				},
				content: function () {
					trigger.cancel();
				},
			},
			nature: {
				trigger: {
					player: "damageBegin2",
				},
				forced: true,
				filter: function (event, player) {
					return (event.nature == "thunder" || event.nature == "fire") && event.num > 0;
				},
				content: function () {
					trigger.num--;
				},
			},
			dying: {
				trigger: {
					player: "dying",
				},
				filter: function (event, player) {
					return player.countMark("jiuzhuandacheng_fu") > 0 && player.countMark("jiuzhuandacheng_mu") > 0;
				},
				content: function () {
					var fuCount = player.countMark("jiuzhuandacheng_fu");
					var muCount = player.countMark("jiuzhuandacheng_mu");
					
					player.removeMark("jiuzhuandacheng_fu", fuCount, true);
					player.removeMark("jiuzhuandacheng_mu", muCount, true);
					
					if (player.countCards("h") > 0) {
						player.discard(player.getCards("h"));
					}
					
					var recoverNum = Math.floor((trigger.fuCount + trigger.muCount) / 2);
					if (recoverNum > 0) {
						player.recover(recoverNum);
					}
				},
			},
		},
	},
	jiuzhuandacheng: {
		locked: true,
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
				locked: true,
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
				locked: true,
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
				locked: true,
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
		group: ["aidechuanbo_mark", "aidechuanbo_draw", "aidechuanbo_phaseEndDraw", "aidechuanbo_dying", "aidechuanbo_transfer"],
		subSkill: {
			mark: {
				trigger: {
					player: "phaseBegin",
				},
				async content (event, trigger, player) {
					const result = await player.chooseTarget("令一名其他角色获得【<span style=\"color: #FFC0CB;\">❤</span>】标记", 1, function (card, player, target) {
						return target != player && !target.hasSkill("aidechuanbo_ai");
					}).set("ai", function (target) {
						return get.attitude(player, target);
					}).forResult();

					if (result.bool) {
						var target = result.targets[0];
						var last = player.storage.aidechuanbo_mark;
						if (last) last.removeSkill("aidechuanbo_ai");
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
				usable: 5,
				forced: true,
				filter: function (event, player) {
					return event.player.hasSkill("aidechuanbo_ai") && event.num > 0;
				},
				content: function () {
					player.draw();
				},
			},
			phaseEndDraw: {
				trigger: {
					global: "phaseEnd",
				},
				forced: true,
				filter: function (event, player) {
					return event.player.hasSkill("aidechuanbo_ai");
				},
				content: function () {
					player.draw();
					trigger.player.draw();
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
				round: 1,
				prompt2: function (event, player) { 
					return "是否将此伤害转移给" + get.translation(player.storage.aidechuanbo_mark) + "并将伤害值调整为1？";
				},
				filter: function (event, player) {
					if (player.storage.aidechuanbo_mark == null) return false;
					return player.storage.aidechuanbo_mark.isAlive();
				},
				content: function () {
					var target = player.storage.aidechuanbo_mark;
					trigger.num = 1;
					trigger.player = target;
				},
			},
		},
	},
	aishen: {
		locked: true,
		group: ["aishen_maxHandcard", "aishen_useCard", "aishen_disable", "aishen_useCardToPlayered", "aishen_lose"],
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
				locked: true,
				mod: {
					targetInRange: function (card, player, target, now) {
						// 使用锦囊牌不受距离限制
						if (["trick", "delay"].includes(get.type(card))) return true;
					},
				},
			},
			disable: {
				locked: true,
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
				locked: true,
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
				locked: true,
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
		},
	},
	fenseyaojing: {
		enable: "chooseToUse",
		usable: 3,
		filterCard: function (card, player, event) {
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
				},
			},
			gain: {
				trigger: {
					global: "useSkill",
				},
				usable: Infinity,
				filter: function (event, player) {
					return event.player != player && !["_recasting", "muniu_skill", "muniu_skill7"].some(skill => event.skill.includes(skill));
				},
				prompt2: function (event, player) {
					return "你可以获得" + get.translation(event.player) +"的1张手牌";
				},
				async content (event, trigger, player) {
					player.gain(trigger.player.getCards("h").randomGet(), trigger.player, "giveAuto");
				},
				check: function (event, player) {
					return get.attitude(player, event.player) <= 0;
				},
			},
		},
	},
	xurui: {
		locked: true,
		group: ["xurui_cancel", "xurui_draw"],
		subSkill: { 
			cancel: {
				trigger: {
					global: "useCard",
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					return event.card && ["guohe", "shunshou"].includes(event.card.name) && event.targets.contains(player);
				},
				content: function () {
					trigger.cancel();
				},
				ai: {
					effect: {
						target: function (card, player, target) {
							if (["guohe", "shunshou"].includes(card.name)) return 0;
						},
					},
				},
			},
			draw: {
				trigger: {
					global: "phaseEnd",
				},
				forced: true,
				locked: true,
				content: function () { 
					player.draw();
				},
			},
		},
	},
	wuhui: {
		trigger: {
			player: "damageBegin",
		},
		forced: true,
		locked: true,
		lastDo: true,
		filter: function (event, player) {
			return event.card && ["trick", "delay"].includes(get.type(event.card));
		},
		content: function () {
			trigger.num = 0;
		},
		ai: {
			effect: {
				target: function (card, player, target) {
					if (get.type(card) == "trick") return 0;
				}
			}
		},
	},
	huigui: {
		trigger: {
			global: "phaseBegin",
		},
		forced: true,
		locked: true,
		async content(event, trigger, player) {
			const result = await player.judge(function (card) {
				return get.color(card) == "black" ? 1.5 : -1.5;
			}).forResult();
			if (result.color == "black") player.draw();
		},
	},
	huizhang: {
		mod: {
			canBeReplaced: function (card, player) {
				if (card.name == "fangbaodun" && get.position(card) == "e") return false;
			},
		},
		trigger: {
			global: "gameStart",
			player: "enterGame",
		},
		forced: true,
		locked: true,
		content: function () {
			var card = game.createCard("fangbaodun", "heart", 13);
			player.equip(card);
		},
		group: ["huizhang_lose", "huizhang_equip", "huizhang_draw", "huizhang_remove"],
		subSkill: {
			lose: {
				trigger: {
					player: "loseAfter",
				},
				forced: true,
				locked: true,
				popup: false,
				filter: function (event, player) {
					return event.es && event.es.some(card => get.subtype(card) == "equip2");
				},
				content: function () {
					game.delay(0.5);
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
				locked: true,
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
			draw: {
				trigger: {
					player: "damage",
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					return event.num > 0 && player.countCards("h") < player.hp && player.maxHp - player.hp > 0;
				},
				content: function () {
					player.draw(player.maxHp - player.hp);
				},
			},
			remove: {
				trigger: {
					player: "dying",
				},
				forced: true,
				locked: true,
				content: function () { 
					player.recover();
					player.removeSkill("huizhang");
				},
			},
		},
	},
	danchun: {
		locked: true,
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
		locked: true,
		async content (event, trigger, player) {
			var list = ["受到1伤害", "弃置2张手牌"];
			if (player.countCards("h") < 2) list = ["受到1伤害"];
			const result = await player.chooseControl(list).set("ai", function () {
				if (player.countCards("h") < 2) return list[0];
				return list[1];
			}).forResult();

			if (result.control == list[0]) {
				player.damage();
			} else {
				await player.chooseToDiscard("h", 2, true).set("ai", function (card) {
					return 6 - get.value(card);
				});
			}
		},
	},
	koukoukongjian: {
		init: function (player) {
			if (player.identity != "zhu") player.removeSkill("koukoukongjian");
		},
		trigger: {
			player: "phaseBegin",
		},
		prompt2: "是否选择至多2名其他角色获得【bt】标记",
		filter: function (event, player) {
			return game.hasPlayer(function (current) {
				return !current.hasSkill("koukoukongjian_bt");
			});
		},
		async content (event, trigger, player) {
			const result = await player.chooseTarget([1, 2], function (card, player, target) {
				return target != player && !target.hasSkill("koukoukongjian_bt");
			}).set("ai", function () {
				return get.attitude(player, target);
			}).forResult();
			if (result.bool) {
				const targets = result.targets;
				targets.forEach(function (target) {
					target.addSkill("koukoukongjian_bt");
				});
				for (var target of targets) {
					if (target.group == player.group) {
						const num = game.filterPlayer(current => {
							return current.hasSkill("koukoukongjian_bt") && current != player;
						}).length;
						if (num > 0) player.recover(num);
						return;
					}
				}
			}
		},
		group: ["koukoukongjian_bt", "koukoukongjian_maxHp"],
		subSkill: {
			bt: {
				mark: true,
				marktext: "bt",
				intro: {
					name: "bt",
					nocount: true,
					content: "heitai!"
				},
				trigger: {
					player: "damageEnd",
				},
				forced: true,
				locked: true,
				charlotte: true,
				filter: function (event, player) {
					return event.num > 0 && event.source && !event.source.hasSkill("koukoukongjian_koukou");
				},
				async content (event, trigger, player) { 
					trigger.source.addSkill("koukoukongjian_koukou");
					trigger.source.loseMaxHp();
				},
			},
			koukou: {
				mark: true,
				marktext: "扣",
				intro: {
					name: "扣扣",
					nocount: true,
					content: "扣死你~",
				},
				forced: true,
				locked: true,
				charlotte: true,
				superCharlotte: true,
			},
			maxHp: {
				trigger: {
					global: "loseMaxHpAfter",
				},
				forced: true,
				locked: true,
				charlotte: true,
				superCharlotte: true,
				filter: function (event, player) {
					return event.num > 0 && event.player.hasSkill("koukoukongjian_koukou");
				},
				content: function () {
					player.gainMaxHp();
				},
			},
		},
	},
	wobinida: {
		trigger: {
			player: "damageAfter",
		},
		forced: true,
		locked: true,
		filter: function (event, player) {
			return event.num > 0 && event.source;
		},
		content: function () { 
			const target = trigger.source;
			const num = Math.max(1, Math.ceil((target.maxHp - target.hp) / 2));
			target.damage(num);
		},
		group: ["wobinida_lose", "wobinida_viewAs"],
		subSkill: {
			lose: { 
				trigger: {
					player: "loseEnd",
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					return player.hp == 1 && event.cards.filter(card => card.original == "h").length > 0;
				},
				async content (event, trigger, player) {
					const result = await player.judge(function (card) {
						return get.color(card) == "black" ? 1.5 : -1.5;
					}).forResult();
					if (result.color == "black") {
						player.recover();
						player.draw();
					}
				},
			},
			viewAs: {
				enable: ["chooseToUse"],
				usable: 1,
				filterCard: function (card, player, event) {
					return true;
				},
				position: "hes",
				viewAs: function (cards, player) {
					return {name: "juedou"};
				},
				filter: function (event, player) {
					return player.countCards("hes") > 0;
				},
			},
		},
	},
	woyizhidouzai: {
		trigger: {
			player: "changeHpAfter",
		},
		forced: true,
		locked: true,
		lastDo: true,
		filter: function (event, player) {
			return player.hp < 1 && player.countCards("h") > 0;
		},
		content: function () {
			player.recoverTo(1);
		},
	},
	chuangzaozhelianjie: {
		trigger: {
			player: "dyingBefore",
		},
		forced: true,
		locked: true,
		filter: function (event, player) {
			const yuchuanluo = game.findPlayer(function (current) {
				return current.name == "yuchuanluo" && current.isAlive();
			});
			return yuchuanluo;
		},
		content: function () {
			player.recoverTo(1);
		},
	},
	huahaimanbu: {
		init: function (player) {
			if (player.identity != "zhu") player.removeSkill("huahaimanbu");
		},
		enable: "phaseUse",
		usable: 1,
		filter: function (event, player) {
			return game.hasPlayer(function (current) {
				return current.group == player.group && current != player && current.isAlive();
			});
		},
		async content (event, trigger, player) {
			const targets = game.filterPlayer(function (current) {
				return current.group == player.group && current != player && current.isAlive();
			});
			const max = targets.length + 1;
			const promises = targets.sortBySeat().map(async function (target) {
				if (target.countCards("h") == 0) {
					player.draw().gaintag.add("huahaimanbu");
				} else {
					const cards = await target.chooseCard("交给" + get.translation(player) + "至多" + max + "张牌", "h", [1, max], true).set("ai", function (card) {
						return get.value(card, player) - 2;
					}).forResultCards();
					player.gain(cards).gaintag.add("huahaimanbu");
				}
			});

			// 等待所有异步操作完成
			await Promise.all(promises);

			const num = player.getCards("h", function (card) {
				return card.gaintag.contains("huahaimanbu");
			}).length;
			const add = Math.max(1, Math.ceil(num / 3));
			const list = ["将以此法获得的牌自由分配给任意角色，你回复1体力", "本回合内你造成伤害的伤害值+" + add];
			const result = await player.chooseControl(list).set("ai", function () {
				return list[1];
			}).forResult();

			if (result.control == list[0]) {
				var flag = true;
				while (flag) {
					const remain = player.getCards("h", function (card) {
						return card.gaintag.contains("huahaimanbu");
					}).length;
					if (remain == 0) {
						flag = false;
						break;
					}

					const result = await player.chooseTarget("是否继续将获得的牌自由分配给任意角色?", 1).forResult();
					if (result.bool) {
						const give = await player.chooseCard("选择交给" + get.translation(result.targets[0]) + "的牌", "h", [1, remain], function (card) {
							return card.gaintag.contains("huahaimanbu");
						}).forResult();
						if (give.bool) {
							// 移除后再转移，保证remain正确计算
							give.cards.forEach(card => {
								card.removeGaintag("huahaimanbu");
							});
							result.targets[0].gain(give.cards);
						} else flag = false;
					} else {
						flag = false;
					}
				}
				player.recover();
			} else {
				player.addMark("huahaimanbu_add", add, false);
				player.addTempSkill("huahaimanbu_add");
			}

			player.removeGaintag("huahaimanbu");
		},
		subSkill: {
			add: {
				marktext: "漫",
				intro: {
					name: "花海漫步",
					content: function (storage, player) {
						return "本回合其造成伤害的伤害值+" + player.countMark("huahaimanbu_add");
					},
				},
				onremove: function (player) {
					player.removeMark("huahaimanbu_add", player.countMark("huahaimanbu_add"), false);
				},
				trigger: {
					source: "damageBegin",
				},
				forced: true,
				locked: true,
				charlotte: true,
				popup: false,
				content: function () {
					trigger.num += player.countMark("huahaimanbu_add");
				},
			},
		},
	},
	manbomanbo: {
		init: function (player) {
			if (player.identity == "zhu") player.removeSkill("manbomanbo");
		},
		locked: true,
		group: ["manbomanbo_judge", "manbomanbo_guohe", "manbomanbo_damage"],
		subSkill: {
			judge: {
				trigger: {
					source: "damageAfter",
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					return event.num > 0 && event.player != player && !event.player.hasSkill("manbomanbo_skip");
				},
				async content(event, trigger, player) {
					const result = await player.judge(function (card) {
						return get.suit(card) == "heart" ? -1.5 : 1.5;
					}).forResult();
					if (result.suit != "heart") trigger.player.addTempSkill("manbomanbo_skip", { player: "phaseBefore" });
				},
			},
			skip: {
				init: function (player) {
					player.skip("phaseUse");
				},
				mark: true,
				marktext: "波",
				intro: {
					name: "曼波曼波",
					nocount: true,
					content: "其将跳过其下个回合的出牌阶段，在此之前受到伤害其需弃置1张牌",
				},
				trigger: {
					player: "damageEnd",
				},
				forced: true,
				locked: true,
				charlotte: true,
				async content(event, trigger, player) {
					await player.chooseToDiscard("he", 1, true).set("ai", function (card) {
						return 5 - get.value(card);
					});
				},
			},
			guohe: {
				locked: true,
				mod: {
					targetEnabled: function (card, player, target) {
						if (card.name == "guohe") return false;
					},
				},
			},
			damage: {
				trigger: {
					player: "damageEnd",
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					return event.num > 0 && event.card && get.type(event.card) == "trick";
				},
				async content(event, trigger, player) {
					const num = player.countCards("h");
					const result = await player.judge(function (card) {
						return get.number(card) > num ? -1.5 : 1.5;
					}).forResult();
					if (result.number > num) {
						trigger.source.damage();
						player.gain(trigger.source.getCards("h").randomGet());
					}
				},
			},
		},
	},
	manyou: {
		init: function (player) {
			player.storage.manyou_maxHp = 0;
		},
		locked: true,
		group: ["manyou_target", "manyou_defend"],
		subSkill: {
			target: {
				locked: true,
				mod: {
					targetEnabled: function (card, player, target) { 
						if (["tiesuo", "lebu"].includes(card.name)) return false;
					},
				},
			},
			defend: {
				trigger: {
					player: "phaseEnd",
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					if (player.getHistory("useSkill", evt => evt.skill == "huahaimanbu").length > 0) return false;
					return true;
				},
				content: function () { 
					player.addSkill("manyou_defendContent");
					const num = game.filterPlayer(function (current) {
						return current.group == player.group;
					}).length;
					const now = player.storage.manyou_maxHp;
					if (now < 4) {
						const next = now + num;
						player.storage.manyou_maxHp = Math.min(next, 4);
						const add = player.storage.manyou_maxHp - now;
						player.gainMaxHp(add);
					}
				},
			},
			defendContent: {
				mark: true,
				marktext: "游",
				intro: {
					name: "漫游",
					nocount: true,
					content: "防止其下次受到的伤害",
				},
				trigger: {
					player: "damageBegin",
				},
				forced: true,
				locked: true,
				charlotte: true,
				lastDo: true,
				filter: function (event, player) {
					return event.num > 0;
				},
				content: function () {
					trigger.num = 0;
					player.removeSkill("manyou_defendContent");
				},
			},
		},
	},
	shujugongxiang: {
		init: function (player) {
			if (player.identity != "zhu") player.removeSkill("shujugongxiang");
		},
		trigger: {
			global: "useSkill",
		},
		forced: true,
		locked: true,
		filter: function (event, player) {
			return event.skill && !["_recasting", "muniu_skill", "muniu_skill7"].some(skill => event.skill.includes(skill));
		},
		content: function () {
			player.draw(3);
		},
		mod: {
			maxHandcard: function (player, num) {
				return num + 1;
			},
		},
		ai: {
			threaten: 1.3,
		},
	},
	bug: {
		locked: true,
		mod: {
			maxHandcard: function (player, num) {
				return num + 2;
			},
		},
		group: ["bug_recover", "bug_cancel", "bug_dying"],
		subSkill: {
			recover: {
				trigger: {
					player: "addJudgeBegin",
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					return event.card;
				},
				content: function () { 
					player.recover();
				},
				ai: {
					effect: {
						target: function (card, player, target) {
							if (get.type(card) == "delay" && target.getDamagedHp() > 0) return 0.8;
						},
					},
				},
			},
			cancel: { 
				trigger: {
					global: "dyingBegin",
				},
				locked: true,
				prompt2: function (event, player) {
					return "是否弃置2张手牌以将" + get.translation(event.player) + "的体力回复至1？";
				},
				filter: function (event, player) {
					return event.player != player && player.countCards("h") >= 2;
				},
				async content (event, trigger, player) {
					await player.chooseToDiscard("h", 2, true);
					trigger.player.recoverTo(1);
				},
				check: function (event, player) {
					return get.attitude(player, event.player) > 0 ? true : false;
				},
				ai: {
					threaten: 1.5,
					expose: 0.4,
					effect: {
						target: function (card, player, target) {
							if (["guohe", "shunshou"].includes(card.name)) return [1, 1];
						},
					},
					save: true,
				},
			},
			dying: {
				trigger: {
					player: "dyingBegin",
				},
				forced: true,
				locked: true,
				content: function () {
					player.recover(player.maxHp);
					player.gainMaxHp(2);
					player.removeSkill("bug");
					player.addSkill("fanghuoqiang");
				},
			},
		},
		derivation: ["fanghuoqiang"],
	},
	fanghuoqiang: {
		group: ["fanghuoqiang_delay", "fanghuoqiang_overflow", "fanghuoqiang_cancel"],
		subSkill: {
			delay: {
				trigger: {
					target: "useCardToTargeted",
				},
				forced: true,
				filter: function (event, player) {
					return event.card && get.type(event.card) == "delay";
				},
				content: function () { 
					player.gainMaxHp();
					player.recover();
				},
				ai: {
					effect: {
						target: function (card, player, target) {
							if (get.type(card) == "delay") return 0.8;
						},
					},
				},
			},
			overflow: { 
				trigger: {
					player: "damageBefore",
				},
				lastDo: true,
				forced: true,
				filter: function (event, player) {
					return event.num > 2;
				},
				content: function () {
					trigger.num = 2;
				},
				ai: {
					filterDamage: true,
				},
			},
			cancel: {
				trigger: {
					player: "damageBegin",
				},
				lastDo: true,
				prompt2: function (event, player) {
					return "是否弃置" + event.num + "张牌以取消此" + event.num + "伤害？"
				},
				filter: function (event, player) {
					return event.num > 0 && player.countCards("he") >= event.num;
				},
				async content (event, trigger, player) {
					const result = await player.discardPlayerCard("he", player, trigger.num, true).forResult();
					if (result.bool) trigger.num = 0;
				},
				ai: {
					skillTagFilter: function (player, tag, arg) {
						if (tag == "nodamage") return player.countCards("he") > 0;
					},
					nodamage: true,
					effect: {
						target: function (card, player, target) {
							if (["guohe", "shunshou"].includes(card.name)) return 1.5;
						},
					},
				},
			},
		},
	},
	lianxieguankong: { 
		trigger: {
			source: "damageEnd",
		},
		forced: true,
		locked: true,
		filter: function (event, player) {
			const dajiejie = game.findPlayer(function (current) {
				return current.name == "dajiejie" && current.isAlive();
			});
			return dajiejie && event.num > 0;
		},
		async content (event, trigger, player) {
			const target = trigger.player;
			if (target.countCards("e") > 0) {
				await player.discardPlayerCard(target, "e", 1, true);
			} else if (target.countCards("h") > 0) {
				await player.discardPlayerCard(target, "h", Math.min(2, target.countCards("h")), true);
			} else {
				target.loseHp();
				player.loseHp();
			}
		},
		ai: {
			threaten: 1.2,
			effect: {
				player: function (card, player, target) { 
					if (get.tag(card, "damage")) return [1, 1];
				},
			},
		},
	},
	qishizhengjing: {
		trigger: {
			source: "damageAfter",
		},
		filter: function (event, player) {
			return event.num > 0 && (event.player.countCards("hej") > 0 || player.getDamagedHp() > 0);
		},
		async content (event, trigger, player) {
			const judgeResult = await player.judge(function (card) {
				if (card.color != "black") return 1.5;
				return -1.5;
			}).forResult();
			if (judgeResult.bool) {
				const target = trigger.player;
				var list = [];
				if (target.countCards("hej" > 0)) list.push("获得" + get.translation(target) + "区域里的1张牌");
				if (player.getDamagedHp() > 0) list.push("回复1体力并摸1张牌");
				const result = await player.chooseControl(list).set("ai", function () {
					return list.randomGet();
				}).forResult();
				if (result.control == "获得" + get.translation(target) + "区域里的1张牌") {
					await player.gainPlayerCard("hej", target, 1, true).set("ai", lib.card.shunshou.ai.button);
				} else {
					player.recover();
					player.draw();
				} 
			}
		},
		ai: {
			neg: true,
		},
	},
	zako_zhiwang: {
		init: function (player) {
			if (player.identity != "zhu") player.removeSkill("zako_zhiwang");
		},
		group: ["zako_zhiwang_damage", "zako_zhiwang_card"],
		subSkill: {
			damage: {
				trigger: {
					player: "damageBegin3",
				},
				forced: true,
				filter: function (event, player) {
					return event.source && event.source.group == player.group && event.num > 0;
				},
				content: function () {
					trigger.num--;
				},
			},
			card: {
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					return game.hasPlayer(function (current) {
						return current.group == player.group && current != player;
					});
				},
				async content (event, trigger, player) {
					const targets = game.filterPlayer(function (current) {
						return current.group == player.group && current != player;
					});
					const choices = targets.map(target => {
						return target.chooseBool("是否交给" + get.translation(player) + "1张手牌？").set("ai", () => {
							return get.attitude(target, player) > 0;
						});
					});
					const choiceResults = await Promise.all(choices.map(choice => choice.forResult()));

					var cardSelectPromise = [];
					var players = [];
					var recoverNum = 0;
					for (let i = 0; i < targets.length; i++) {
						if (choiceResults[i].bool) {
							players.push(targets[i]);
							cardSelectPromise.push(
								targets[i].chooseCard("请选择一张手牌交给" + get.translation(player), true).set("ai", function (card) {
									return 5 - get.value(card);
								}).forResult()
							);
						} else {
							recoverNum++;
						}
					}
					const cardSelectResults = await Promise.all(cardSelectPromise);

					for (let i = 0; i < players.length; i++) {
						const current = players[i];
						const result = cardSelectResults[i];
						const card = result.cards[0];
						current.give(card, player, false);
						if (["trick", "delay"].includes(get.type(card))) recoverNum++;
					}
					if (recoverNum > 0) player.recover(recoverNum);
				},
			},
		},
	},
	caibushizayumaoniang: {
		trigger: {
			player: 'phaseZhunbeiBegin',
		},
		forced: true,
		locked: true,
		filter: function (event, player) {
			return player.countCards("h") > 0;
		},
		async content (event, trigger, player) {
			const cards = await player.chooseCard("选择1张牌展示", "h", 1, true).forResultCards();
			player.showCards(cards);

			const suit = get.suit(cards[0]);
			var num = 0;
			game.players.forEach(function (current) {
				if (current != player) {
					const cards = current.getCards("h", function (card) {
						return get.suit(card) == suit;
					});
					if (cards.length > 0) {
						current.discard(cards);
					}
					game.delay();
					num += current.countCards("h");
				}
			});

			if (num <= player.maxHp) {
				game.players.forEach(function (current) {
					if (current != player) current.damage();
				});
				player.addTempSkill("caibushizayumaoniang_drawNum", { player: "phaseDrawEnd" });
			}
		},
		subSkill: {
			drawNum: {
				trigger: {
					player: "phaseDrawBegin",
				},
				forced: true,
				locked: true,
				charlotte: true,
				popup: false,
				lastDo: true,
				content: function () {
					trigger.num = 1;
				},
			},
		},
	},
	zayu: {
		init: function (player) {
			player.storage.zayu_mark = [];
		},
		mark: true,
		marktext: "杂",
		intro: {
			name: "杂鱼",
			nocount: true,
			mark: function (dialog, storage, player) {
				if (player.storage.zayu_mark.length) {
					dialog.addText("其本回合不再受到来自这些牌名的牌的伤害");
					var cards = [];
					for (var card of player.storage.zayu_mark) {
						cards.push(game.createCard(card));
					}
					dialog.addAuto(cards);
				}
			},
		},
		locked: true,
		group: ["zayu_damage", "zayu_mark", "zayu_remove", "zayu_defend"],
		subSkill: {
			damage: { 
				trigger: {
					player: "damageBegin1",
				},
				forced: true,
				locked: true,
				popup: false,
				content: function () {
					trigger.num++;
				},
			},
			mark: {
				trigger: {
					player: "damageEnd",
				},
				forced: true,
				locked: true,
				popup: false,
				filter: function (event, player) {
					if (!event.card) return false;
					if (event.num <= 0) return false;
					if (player.storage.zayu_mark.includes(event.card.name)) return false;
					return true;
				},
				content: function () { 
					player.storage.zayu_mark.push(trigger.card.name);
				},
			},
			remove: {
				trigger: {
					global: "phaseAfter",
				},
				forced: true,
				locked: true,
				charlotte: true,
				popup: false,
				filter: function (event, player) {
					return player.storage.zayu_mark.length > 0;
				},
				content: function () {
					player.storage.zayu_mark = [];
				},
			},
			defend: {
				trigger: {
					player: "damageBegin3",
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					if (!event.card) return false;
					if (event.num <= 0) return false;
					if (!player.storage.zayu_mark.includes(event.card.name)) return false;
					return true;
				},
				content: function () { 
					trigger.num = 0;
				},
			},
		},
	},
	daka: {
		init: function (player) {
			if (player.identity != "zhu") player.removeSkill("daka");
			else player.storage.daka_losers = [];
		},
		enable: "phaseUse",
		usable: 1,
		multitarget: true,
		multiline: true,
		selectTarget: function () {
			const num = game.filterPlayer(function (current) {
				return current.group == "aoye";
			}).length;
			return [1, num];
		},
		filterTarget: function (card, player, target) {
			return player.canCompare(target);
		},
		prompt: function (event, player) {
			const num = game.filterPlayer(function (current) {
				return current.group == "aoye";
			}).length;
			return "与至多" + num + "名其他角色拼点";
		},
		filter: function (event, player) {
			return player.countCards("h") > 0;
		},
		async content (event, trigger, player) {
			await player.chooseToCompare(event.targets).set("callback", () => {
				if (event.winner == player) player.storage.daka_losers.push(event.target);
				else if (event.winner == event.target) player.storage.daka_losers.push(player);
			});

			const losers = [...new Set(player.storage.daka_losers)];
			if (losers.length) {
				const list = ["输的角色各受到1伤害", "你摸" + losers.length + "张牌，输的角色各弃置1张牌"];
				const result = await player.chooseControl(list).set("ai", function () {
					if (losers.includes(player) && (player.hp <= 2 || losers.length == 1)) return list[1];
					return Math.random() < 0.5 ? list[0] : list[1];
				}).forResult();
				if (result.control == list[0]) {
					losers.forEach(function (target) {
						target.damage();
					});
				} else {
					player.draw(losers.length);
					const promises = losers.map(async function (target) {
						if (target.countCards("he") > 0) {
							await target.chooseToDiscard("he", 1, true).set("ai", function (card) {
								return 5 - get.value(card);
							});
						}
					});
					await Promise.all(promises);
				}
				player.storage.daka_losers = [];
			}
		},
	},
	yeyou: {
		group: ["yeyou_mod", "yeyou_draw", "yeyou_content"],
		subSkill: {
			mod: {
				mod: {
					targetInRange: function (card, player, target, now) {
						if (["trick", "delay"].includes(get.type(card))) return true;
					},
					selectTarget: function (card, player, range) {
						if (card.name == "tiesuo") range[1]++;
					},
				},
			},
			draw: {
				trigger: {
					global: "useCard",
				},
				usable: 2,
				forced: true,
				filter: function (event, player) {
					return event.card && get.type(event.card, "trick") == "trick";
				},
				content: function (event, trigger, player) {
					player.draw();
				}
			},
			content: {
				trigger: {
					player: "useCard",
				},
				forced: true,
				firstDo: true,
				popup: false,
				filter: function (event, player) { 
					return event.card;
				},
				async content (event, trigger, player) {
					const name = trigger.card.name;
					switch (name) {
						case "lebu":
						case "bingliang":
							player.logSkill("yeyou_content");
							player.draw();
							const cardMent = await player.chooseCard("将1张牌放回牌堆顶", "he", 1, true).set("ai", function (card) {
								return 5 - get.value(card);
							}).forResult();
							if (cardMent.bool) {
								const card = cardMent.cards[0];
								game.cardsGotoPile(card, "insert");
							}
							break;
						case "shunshou":
						case "guohe":
							trigger.effectCount++;
							break;
						case "huogong":
						case "wanjian":
						case "nanman":
							player.logSkill("yeyou_content");
							trigger.baseDamage++;
							break;
						case "taoyuan":
							player.logSkill("yeyou_content");
							player.recover();
							break;
						case "wuzhong":
							player.logSkill("yeyou_content");
							player.draw(2);
							break;
						case "wuxie":
							player.logSkill("yeyou_content");
							const card = get.cardPile(card => get.type(card, "trick") == "trick");
							if (card) {
								player.gain(card, "gain2");
							}
							break;
					}
				},
			},
		},
	},
	yexing: {
		locked: true,
		group: ["yexing_nature", "yexing_dying"],
		subSkill: {
			nature: {
				trigger: {
					player: "damageBegin4",
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					return event.nature && event.num > 0;
				},
				content: function () {
					trigger.num = 0;
				},
			},
			dying: {
				trigger: {
					source: "dyingBegin",
				},
				forced: true,
				locked: true,
				content: function () {
					trigger.player.addTempSkill("yexing_ban"); 
				},
			},
			ban: {
				mark: true,
				marktext: "夜",
				intro: {
					name: "夜行",
					nocount: true,
					content: "本回合内无法使用【桃】",
				},
				locked: true,
				charlotte: true,
				mod: {
					cardEnabled: function (card, player) {
						if (card.name == "tao") return false;
					},
					cardSavable: function (card, player) {
						if (card.name == "tao") return false;
					},
				},
			},
		},
	},
	yuanzexingwenti: {
		init: function (player) { 
			player.storage.yuanzexingwenti_target = false;
			player.storage.yuanzexingwenti_discard = false;
			player.storage.yuanzexingwenti_target_and_range = false;
			player.storage.yuanzexingwenti_usable = false;
		},
		mark: true,
		marktext: "原",
		intro: {
			name: "原则性问题",
			nocount: true,
			content: function (storage, player) {
				if (!player.storage.yuanzexingwenti_target && !player.storage.yuanzexingwenti_discard &&
					!player.storage.yuanzexingwenti_target_and_range && !player.storage.yuanzexingwenti_usable) return "一切正常";
				
				var str = "";
				if (player.storage.yuanzexingwenti_target) str += "使用的【杀】可以额外选择1个目标<br>";
				if (player.storage.yuanzexingwenti_discard) str += "使用【杀】造成伤害时，随机弃置其1张手牌<br>";
				if (player.storage.yuanzexingwenti_target_and_range) str += "使用的【杀】可以再额外选择1个目标<br>使用【杀】无距离限制<br>";
				if (player.storage.yuanzexingwenti_usable) str += "使用【杀】无次数限制";
				return str;
			},
		},
		group: ["yuanzexingwenti_dying", "yuanzexingwenti_damage", "yuanzexingwenti_add", "yuanzexingwenti_target", "yuanzexingwenti_discard", "yuanzexingwenti_target_and_range", "yuanzexingwenti_usable"],
		subSkill: {
			dying: {
				trigger: {
					player: "dying",
				},
				forced: true,
				filter: function (event, player) {
					return player.countCards("h") > 0;
				},
				content: function () {
					player.discard(player.getCards("h"));
					player.recover(player.countCards("h"));
					player.removeSkill("yuanzexingwenti");
				},
			},
			damage: {
				trigger: {
					player: "damageBegin4",
				},
				forced: true,
				filter: function (event, player) {
					return event.num > 0;
				},
				content: function () {
					trigger.num *= 2;
				},
			},
			add: {
				trigger: {
					player: "changeHpAfter",
				},
				forced: true,
				popup: false,
				filter: function (event, player) {
					return !player.storage.yuanzexingwenti_target || !player.storage.yuanzexingwenti_discard ||
						!player.storage.yuanzexingwenti_target_and_range || !player.storage.yuanzexingwenti_usable;
				},
				content: function () {
					const hp = player.hp;
					if (hp <= 5) {
						player.logSkill("yuanzexingwenti");
						player.storage.yuanzexingwenti_usable = true;
					}
					if (hp <= 10) {
						player.logSkill("yuanzexingwenti");
						player.storage.yuanzexingwenti_target_and_range = true;
					}
					if (hp <= 20) {
						player.logSkill("yuanzexingwenti");
						player.storage.yuanzexingwenti_discard = true;
					}
					if (hp <= 40) {
						player.logSkill("yuanzexingwenti");
						player.storage.yuanzexingwenti_target = true;
					}
				},
			},
			target: {
				mod: {
					selectTarget: function (card, player, range) { 
						if (player.storage.yuanzexingwenti_target && card.name == "sha") {
							range[1]++;
						}
					},
				},
			},
			discard: {
				trigger: {
					source: "damageEnd",
				},
				forced: true,
				filter: function (event, player) {
					if (!player.storage.yuanzexingwenti_discard) return false;
					return event.card && event.card.name == "sha" && event.num > 0;
				},
				content: function () {
					trigger.player.randomDiscard("h", 1);
				},
			},
			target_and_range: {
				mod: {
					targetInRange: function (card, player, target) {
						if (player.storage.yuanzexingwenti_target_and_range) return true;
					},
					selectTarget: function (card, player, range) {
						if (player.storage.yuanzexingwenti_target_and_range && card.name == "sha") range[1]++;
					},
				},
			},
			usable: {
				mod: {
					cardUsable: function (card, player, num) {
						if (player.storage.yuanzexingwenti_usable && card.name == "sha") return Infinity;
					}
				},
			},
		},
	},
	wojiushiyuanze: {
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "wood",
		unique: true,
		selectTarget: [0, Infinity],
		multitarget: true,
		multiline: true,
		filterTarget: function (card, player, target) {
			return target != player;
		},
		filter: function (event, player) {
			return player.hp > 1;
		},
		content: function () { 
			player.awakenSkill(event.name);
			const num = Math.floor(player.hp / 2);
			player.loseHp(num);
			event.targets.forEach(target => target.addTempSkill("baiban", "roundEnd"));
		},
	},
	zhanli: {
		locked: true,
		group: ["zhanli_overflow", "zhanli_draw", "zhanli_recover_or_loseHp", "zhanli_viewAs"],
		subSkill: {
			overflow: {
				trigger: {
					player: "damageBegin4",
				},
				forced: true,
				locked: true,
				lastDo: true,
				filter: function (event, player) {
					return event.num > 15;
				},
				content: function () {
					trigger.num = 15;
				},
			},
			draw: {
				trigger: {
					player: "damageAfter",
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					return event.num > 0;
				},
				content: function () {
					player.draw(trigger.num);
				},
			},
			recover_or_loseHp: {
				trigger: {
					source: "damageAfter",
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					return event.num > 0;
				},
				content: function () {
					if (player.hp <= 10) player.recover(trigger.num);
					else player.loseHp(trigger.num);
				},
			},
			viewAs: {
				enable: ["chooseToUse", "chooseToRespond"],
				locked: true,
				filterCard: function (card, player, event) {
					return ["equip1", "equip2"].includes(get.subtype(card));
				},
				position: "hes",
				viewAs: function (cards, player) {
					const subtype = get.subtype(cards[0]);
					return subtype == "equip1" ? { name: "sha" } : { name: "shan" };
				},
				filter: function (event, player) {
					return player.countCards("hes", function (card) {
						return ["equip1", "equip2"].includes(get.subtype(card));
					}) > 0;
				},
			},
		},
	},
	huanji: {
		init: function (player) {
			player.disableEquip([1, 2]);
		},
	},
	shiyi: {
		trigger: {
			global: "discardEnd",
		},
		prompt2: function (event, player) { 
			return "是否获得来自" + get.translation(event.player) + "的" + get.translation(event.cards) + "？";
		},
		filter: function (event, player) {
			return _status.currentPhase != player && event.cards && event.cards.length > 0;
		},
		content: function () { 
			const cards = trigger.cards;
			player.gain(cards, "gain2");
		},
	},
	xiewei: {
		enable: "phaseUse",
		usable: 1,
		filter: function (event, player) {
			return player.countCards("he") > 0;
		},
		selectTarget: 1,
		filterTarget: function (card, player, target) {
			return target != player;
		},
		async content (event, trigger, player) {
			await player.chooseToDiscard("he", 1, true);
			const num = Math.max(player.hp, player.getDamagedHp(true));
			const target = event.targets[0];
			const drawCards = await target.draw(num).forResult();

			var suits = [];
			for (let i = 0; i < drawCards.length; i++) {
				const card = drawCards[i];
				if (!suits.includes(get.suit(card))) suits.push(get.suit(card));
			}
			const handCards = target.getCards("h");
			var discardCards = [];
			for (let i = 0; i < handCards.length; i++) {
				const card = handCards[i];
				if (!suits.includes(get.suit(card))) discardCards.push(card);
			}
			if (discardCards.length > 0) await target.discard(discardCards);

			if (target.countCards("h") > target.hp) target.damage();
		},
	},
	polao: {
		trigger: {
			player: "loseEnd",
		},
		forced: true,
		locked: true,
		filter: function (event, player) { 
			return player.countCards("h") < player.hp;
		},
		content: function () { 
			player.drawTo(player.hp);
		},
		mod: {
			targetEnabled: function (card, player, target) {
				if (get.type(card) == "delay") return false;
			},
			maxHandcard: function (player, num) {
				return player.maxHp * 4;
			},
		},
	},
	xiami: {
		init: function (player) {
			player.storage.xiami_count = 2;
		},
		trigger: {
			global: "phaseBefore",
		},
		prompt2: function (event, player) { 
			return "是否弃置一张牌，对" + get.translation(event.player) + "使用一张无花色和点数的【杀】？";
		},
		filter: function (event, player) {
			return player.storage.xiami_count == 2 && event.player != player && player.countCards("he") > 0;
		},
		async content (event, trigger, player) { 
			const result = await player.chooseToDiscard("he", 1, true).set("ai", function (card) {
				return 5 - get.value(card);
			}).forResult();

			if (result.bool) {
				player.storage.xiami_count = 0;
				player.discard(event.cards);
				const card = { name: "sha" };
				player.useCard(card, trigger.player);
			}
		},
		check: function (event, player) {
			return get.attitude(player, event.player) >= 0 ? false : true; 
		},
		ai: {
			threaten: 1.3,
		},
		group: ["xiami_count", "xiami_damage", "xiami_draw"],
		subSkill: {
			count: {
				trigger: {
					global: "phaseBegin",
				},
				forced: true,
				locked: true,
				charlotte: true,
				lastDo: true,
				popup: false,
				filter: function (event, player) {
					return player.storage.xiami_count < 2;
				},
				content: function () {
					player.storage.xiami_count++;
				}
			},
			damage: {
				trigger: {
					source: "damageEnd",
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					return event.num > 0 && _status.currentPhase != player;
				},
				async content (event, trigger, player) {
					const target = trigger.player;
					target.discard(target.getCards("e").randomGet());
					const result1 = await target.chooseToDiscard("he", [1, Infinity], true).set("ai", function (card) {
						return 5 - get.value(card);
					}).forResult();
					const num = result1.cards.length + 1;
					const result2 = await player.chooseToDiscard("你可以弃置" + num + "张牌令" + get.translation(target) + "翻面并摸1张牌", "he", num, false)
						.set("ai", function (card) {
							return 5 - get.value(card);
						}).forResult();
					if (result2.bool) {
						target.turnOver();
						target.draw();
					}
				}
			},
			draw: {
				trigger: {
					global: "phaseEnd",
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					const now = _status.currentPhase;
					return now != player && now.getHistory("damage", evt => evt.source == player).length <= 0;
				},
				content: function () {
					player.draw();
				}
			},
		},
	},
	qianshui: {
		init: function (player) {
			player.storage.qianshui = true;
		},
		zhuanhuanji: true,
		mark: true,
		marktext: "☯",
		intro: {
			name: "潜水",
			content: function (storage, player) {
				var mode = player.storage.qianshui ? "阳" : "阴";
				return "下次使用为 " + mode + " 效果";
			},
		},
		group: ["qianshui_yang", "qianshui_yin"],
		subSkill: {
			yang: {
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					return player.storage.qianshui && player.countCards("h") > 0 && game.hasPlayer(function (current) {
						return current != player && current.countCards("hej") > 0;
					});
				},
				async content (event, trigger, player) { 
					const discard = await player.chooseToDiscard("h", [1, Infinity], true).set("ai", function (card) {
						return -player.getUseValue(card);
					}).forResult();

					if (discard.bool) {
						const targets = await player.chooseTarget("选择一名其他角色，观看其手牌", 1, true, function (card, player, target) {
							return target != player && target.countCards("hej") > 0;
						}).set("ai", function (target) {
							return -get.attitude(player, target);
						}).forResultTargets();
						const target = targets[0];
						await player.gainPlayerCard(target, "hej", [1, discard.cards.length], false, "visible").set("ai", lib.card.shunshou.ai.button);
					}
					player.changeZhuanhuanji("qianshui");
				},
				ai: {
					order: 10,
					result: {
						player: 1,
					},
				},
			},
			yin: {
				trigger: {
					global: "roundEnd",
				},
				prompt2: function (event, player) {
					const num = Math.min(3, Math.max(1, Math.floor(player.maxHp / 4)));
					return "你可以弃置2张手牌对一名其他角色造成" + num + "伤害";
				},
				filter: function (event, player) {
					return !player.storage.qianshui && player.countCards("h") >= 2;
				},
				async content (event, trigger, player) { 
					const num = Math.min(3, Math.max(1, Math.floor(player.maxHp / 4)));
					const discard = await player.chooseToDiscard("h", 2, false).set("ai", function (card) {
						return 5 - get.value(card);
					}).forResult();

					if (discard.bool) {
						const targets = await player.chooseTarget(1, true, function (card, player, target) {
							return target != player;
						}).set("ai", function (target) {
							return -get.attitude(player, target);
						}).forResultTargets();
						targets[0].damage(num);
					}
					player.changeZhuanhuanji("qianshui");
				},
			},
		},
	},
	kapai: {
		trigger: {
			global: "useSkillEnd",
		},
		forced: true,
		filter: function (event, player) {
			return !["_recasting", "muniu_skill", "muniu_skill7"].some(skill => event.skill.includes(skill));
		},
		async content (event, trigger, player) {
			player.draw();

			if (player.maxHp < 12) {
				const num = Math.min(6, Math.max(2, player.hp - 1));
				const result = await player.chooseToDiscard("你可以弃置" + num + "张牌，令你的体力和体力上限+1", "he", num, false).set("ai", function (card) {
					return _status.currentPhase == player ? player.getUseValue(card) : -get.value(card);
				}).forResult();
				if (result.bool) {
					player.gainMaxHp();
					player.recover();
				}
			}
		},
		group: ["kapai_maxHp"],
		subSkill: {
			maxHp: {
				trigger: {
					player: "gainMaxHpBegin",
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					return player.maxHp + event.num > 12; 
				},
				content: function () {
					if (player.maxHp == 12) trigger.cancel();
					else trigger.num = 12 - player.maxHp;
				},
			},
		},
	},
	bendan: {
		trigger: {
			player: "damageBegin2",
		},
		forced: true,
		locked: true,
		filter: function (event, player) {
			return event.num > 0 && event.card && player.maxHp >= 2;
		},
		async content (event, trigger, player) {
			const result = await player.judge(function (card) {
				if (get.number(card) >= 11) return 1.5;
				return -1.5;
			}).forResult();
			if (result.bool) {
				trigger.num = 0;
				player.draw();
			}
		},
	},
	xueyan: {
		locked: true,
		group: ["xueyan_skip", "xueyan_turnOver"],
		subSkill: {
			skip: {
				trigger: {
					player: "phaseBefore",
				},
				forced: true,
				locked: true,
				popup: false,
				content: function () {
					player.skip("phaseDiscard");
				},
			},
			turnOver: {
				trigger: {
					player: "turnOverBefore",
				},
				forced: true,
				locked: true,
				content: function () {
					trigger.cancel();
				},
			},
		},
	},
	sb_shiyi: {
		marktext: "遗",
		intro: {
			name: "遗",
			content: "当前有#个【遗】标记",
		},
		group: ["sb_shiyi_discardAfter", "sb_shiyi_phaseEnd"],
		subSkill: {
			discardAfter: { 
				trigger: {
					global: "discardAfter",
				},
				filter: function (event, player) {
					return event.player != player && event.player.getHistory("lose", function (evt) {
						return evt.type == "discard" && evt.getParent("phaseDiscard") == _status.event.getParent("phaseDiscard");
					}).length > 0;
				},
				async content(event, trigger, player) {
					var list = ["你摸2张牌，获得1【遗】标记", "你失去1【遗】标记，获得这些牌",];
					if (!player.hasMark("sb_shiyi")) list = ["你摸2张牌，获得1【遗】标记"];
					const result = await player.chooseControl(list).set("ai", function () {
						if (!player.hasMark("sb_shiyi")) return list[0];
						return Math.random() < 0.5 ? list[0] : list[1];
					}).forResult();
					if (result.control == list[0]) {
						player.draw(2);
						player.addMark("sb_shiyi", 1, true);
					} else {
						player.removeMark("sb_shiyi", 1, true);
						player.gain(trigger.cards, "gain2");
					}
				},
			},
			phaseEnd: {
				trigger: {
					player: "phaseEnd",
				},
				filter: function (event, player) {
					return event.num > 0 && player.countCards("he") >= 2;
				},
				async cost (event, trigger, player) { 
					event.result = await player.chooseToDiscard("你可以弃置2张牌以获得1【遗】标记", "he", 2, false).forResult();
				},
				content: function () {
					player.addMark("sb_shiyi", 1, true);
				},
			},
		},
	},
	qiutian: {
		init: function(player) {
			player.storage.qiutian_card = {};
		},
		enable: ["chooseToUse", "chooseToRespond"],
		viewAs: {
			name: "sha",
			nature: "fire",
		},
		filterCard: function (card, player, event) {
			return get.type(card) == "equip";
		},
		position: "he",
		filter: function(event, player) {
			return player.countCards("he", { type: "equip" }) > 0;
		},
		async onuse (result, player) {
			const card = result.cards[0];
			player.storage.qiutian_card = card;
		},
		group: ["qiutian_equip1", "qiutian_equip2", "qiutian_equip34", "qiutian_equip5"],
		subSkill: {
			equip1: {
				trigger: {
					player: "shaBegin",
				},
				forced: true,
				locked: true,
				popup: false,
				filter: function (event, player) {
					const card = player.storage.qiutian_card;
					const subtype = get.subtype(card);
					return event.card.name == "sha" && get.nature(event.card) == "fire" && subtype == "equip1" &&
						player.getHistory("useSkill", function (evt) {
							return evt.skill == "qiutian" && _status.event.getParent("useSkill") == evt;
						});
				},
				content: function () {
					trigger.baseDamage++;
				},
			},
			equip2: {
				trigger: {
					player: "useCardToPlayered",
				},
				forced: true,
				locked: true,
				popup: false,
				filter: function (event, player) {
					const card = player.storage.qiutian_card;
					const subtype = get.subtype(card);
					return event.card.name == "sha" && get.nature(event.card) == "fire" && subtype == "equip2" && 
						player.getHistory("useSkill", function (evt) {
							return evt.skill == "qiutian" && _status.event.getParent("useSkill") == evt;
						});
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
			},
			equip34: {
				trigger: {
					source: "damageBefore",
				},
				forced: true,
				locked: true,
				popup: false,
				filter: function (event, player) {
					const card = player.storage.qiutian_card;
					const subtype = get.subtype(card);
					return event.card.name == "sha" && get.nature(event.card) == "fire" && ["equip3", "equip4"].includes(subtype) &&
						event.num > 0 && player.getHistory("useSkill", function (evt) {
							return evt.skill == "qiutian" && _status.event.getParent("useSkill") == evt;
						});
				},
				async content(event, trigger, player) {
					trigger.cancel();
					const target = trigger.player;
					if (target.countCards("hej") > 0) await player.discardPlayerCard(target, "hej", 1, true);
					player.addMark("sb_shiyi", 1, true);
				},
			},
			equip5: {
				trigger: {
					player: "shaBegin",
				},
				forced: true,
				locked: true,
				popup: false,
				filter: function (event, player) {
					const card = player.storage.qiutian_card;
					const subtype = get.subtype(card);
					return event.card.name == "sha" && get.nature(event.card) == "fire" && subtype == "equip5" &&
						player.getHistory("useSkill", function (evt) {
							return evt.skill == "qiutian" && _status.event.getParent("useSkill") == evt;
						});
				},
				content: function () {
					player.draw(2);
				},
			},
		},
	},
	yili: {
		group: ["yili_damage", "yili_dying"],
		subSkill: { 
			damage: {
				trigger: {
					player: "damageEnd",
				},
				prompt2: "你可以失去1【遗】标记，你回复1体力并摸2张牌",
				filter: function (event, player) {
					return event.num > 0 && player.hasMark("sb_shiyi");
				},
				content: function () { 
					player.removeMark("sb_shiyi", 1, true);
					player.recover();
					player.draw(2);
				},
			},
			dying: {
				trigger: {
					player: "dying",
				},
				prompt2: "你可以失去4【遗】标记将体力回复至1",
				filter: function (event, player) {
					return player.countMark("sb_shiyi") >= 4;
				},
				content: function () {
					player.removeMark("sb_shiyi", 4, true);
					player.recoverTo(1);
				},
			},
		},
	},
	ranmingbuqudejuejiang: {
		trigger: {
			player: "dying",
		},
		forced: true,
		persevereSkill: true,
		filter: function (event, player) {
			return event.getParent("damage") && player.maxHp > 1;
		},
		async content (event, trigger, player) { 
			await player.link(false);
			await player.turnOver(false);
			await player.loseMaxHp();
			await player.recoverTo(player.maxHp);
		},
	},
	dumibudingdeduice: {
		group: ["dumibudingdeduice_j", "dumibudingdeduice_defend", "dumibudingdeduice_draw"],
		subSkill: {
			j: {
				trigger: {
					player: "phaseBegin",
				},
				forced: true,
				filter: function (event, player) {
					return player.countCards("j") > 0;
				},
				content: function () { 
					player.discard(player.getCards("j"));
				},
			},
			defend: { 
				trigger: {
					player: "damageBegin4",
				},
				usable: 2,
				prompt2: function (event, player) {
					const suit = get.suit(event.card);
					const number = get.number(event.card);
					return "你可以弃置1张点数为" + number + "或花色为" + get.translation(suit) + "的手牌，以防止此" + event.num + "伤害";
				},
				filter: function (event, player) {
					if (!event.card) return false;
					if (event.num <= 0) return false;
					const suit = get.suit(event.card);
					const number = get.number(event.card);
					return player.countCards("h", function (card) {
						return get.suit(card) == suit || get.number(card) == number;
					}) > 0;
				},
				async cost (event, trigger, player) {
					const suit = get.suit(trigger.card);
					const number = get.number(trigger.card);
					event.result = await player.chooseToDiscard("h", 1, false, function (card) {
						return get.suit(card) == suit || get.number(card) == number;
					}).forResult();
				},
				async content (event, trigger, player) {
					trigger.num = 0;
				},
			},
			draw: {
				trigger: {
					player: "loseEnd",
				},
				forced: true,
				filter: function (event, player) { 
					return player.countCards("h") < 2;
				},
				content: function () {
					player.drawTo(2);
				},
			},
		},
	},
	wuweizhongshidekangzheng: {
		mark: true,
		marktext: "争",
		intro: {
			name: "无谓众矢的抗争",
			noucount: true,
			content: function (storage, player) { 
				let str = "";
				const list = player.storage.wuweizhongshidekangzheng_content;
				if (list[7]) str += "其使用锦囊牌不受距离限制<br>";
				if (list[6]) str += "其回合结束时摸1张牌<br>";
				let draw = 0;
				if (list[5]) draw++;
				let sha = 0;
				if (list[4]) sha++;
				if (list[3]) sha++;
				let hujia = 0;
				if (list[2]) {
					draw++;
					hujia++;
				}
				if (list[1]) sha = Infinity;

				if (draw > 0) str += "其摸牌阶段摸牌数+" + draw + "<br>";
				if (sha == Infinity) str += "其使用【杀】无距离和次数限制<br>";
				else if (sha > 0) str += "其每回合可使用【杀】次数+" + sha + "<br>";
				if (hujia > 0) str += "其造成伤害时获得" + hujia + "护甲<br>";

				return str;
			},
		},
		init: function (player) {
			player.storage.wuweizhongshidekangzheng_content = [true, false, false, false, false, false, false, false];
		},
		trigger: {
			player: "loseMaxHpAfter",
		},
		forced: true,
		locked: true,
		filter: function (event, player) { 
			return player.storage.wuweizhongshidekangzheng_content.includes(false);
		},
		content: function () { 
			const now = player.maxHp;
			if (now <= 7) player.storage.wuweizhongshidekangzheng_content[7] = true;
			if (now <= 6) player.storage.wuweizhongshidekangzheng_content[6] = true;
			if (now <= 5) player.storage.wuweizhongshidekangzheng_content[5] = true;
			if (now <= 4) player.storage.wuweizhongshidekangzheng_content[4] = true;
			if (now <= 3) player.storage.wuweizhongshidekangzheng_content[3] = true;
			if (now <= 2) player.storage.wuweizhongshidekangzheng_content[2] = true;
			if (now <= 1) player.storage.wuweizhongshidekangzheng_content[1] = true;
		},
		group: ["wuweizhongshidekangzheng_mods", "wuweizhongshidekangzheng_phaseEnd", 
			"wuweizhongshidekangzheng_phaseDraw", "wuweizhongshidekangzheng_hujia"
		],
		subSkill: {
			mods: {
				locked: true,
				mod: {
					targetInRange: function (card, player, target) {
						if (player.storage.wuweizhongshidekangzheng_content[7] && ["trick", "delay"].includes(get.type(card))) return true;
						if (player.storage.wuweizhongshidekangzheng_content[1] && card.name == "sha") return true;
					},
					cardUsable: function (card, player, num) { 
						if (player.storage.wuweizhongshidekangzheng_content[1] && card.name == "sha") return Infinity;

						let add = 0;
						if (player.storage.wuweizhongshidekangzheng_content[4]) add++;
						if (player.storage.wuweizhongshidekangzheng_content[3]) add++;
						if (card.name == "sha") return num + add;
					},
				},
			},
			phaseEnd: {
				trigger: {
					player: "phaseEnd",
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					return player.storage.wuweizhongshidekangzheng_content[6] == true && player.getDamagedHp() > 0;
				},
				content: function () {
					player.draw();
				},
			},
			phaseDraw: {
				trigger: {
					player: "phaseDrawBegin",
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					return player.storage.wuweizhongshidekangzheng_content[5] || player.storage.wuweizhongshidekangzheng_content[2];
				},
				content: function () {
					let add = 0;
					if (player.storage.wuweizhongshidekangzheng_content[5]) add++;
					if (player.storage.wuweizhongshidekangzheng_content[2]) add++;
					trigger.num += add;
				},
			},
			hujia: {
				trigger: {
					source: "damageAfter",
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					return player.storage.wuweizhongshidekangzheng_content[2] && event.num > 0;
				},
				content: function () {
					player.changeHujia(1, "gain");
				},
			},
		},
	},
	qinxue: {
		init: function (player) {
			player.storage.qinxue_mark = [];
		},
		mark: true,
		marktext: "勤",
		intro: {
			name: "勤学",
			nocount: true,
			mark: function (dialog, storage, player) {
				dialog.addText("已记录的牌名：");
				if (player.storage.qinxue_mark.length) {
					var cards = [];
					for (var name of player.storage.qinxue_mark) {
						cards.push(game.createCard(name));
					}
					dialog.addAuto(cards);
				}
			},
		},
		locked: true,
		group: ["qinxue_mark", "qinxue_use"],
		subSkill: {
			mark: {
				trigger: {
					global: "useCardEnd",
				},
				forced: true,
				locked: true,
				popup: false,
				filter: function (event, player) {
					const card = event.card;
					return card && get.type(card) != "equip" && !player.storage.qinxue_mark.includes(card.name)
				},
				content: function () {
					const card = trigger.card;
					player.storage.qinxue_mark.push(card.name);
				}
			},
			use: {
				enable: ["chooseToUse", "chooseToRespond"],
				popup: true,
				filter: function (event, player) { 
					return player.storage.qinxue_mark.length > 0 && player.countCards("hes") > 0;
				},
				hiddenCard: function (player, name) {
					if (!lib.inpile.includes(name)) return false;
					return player.storage.qinxue_mark.includes(name) && player.countCards("hes") > 0;
				},
				chooseButton: {
					dialog: function (event, player) { 
						var list = [];
						for (var i = 0; i < player.storage.qinxue_mark.length; i++) {
							const name = player.storage.qinxue_mark[i];
							if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
								list.push([null, null, name, null]);
							}
						}
						return ui.create.dialog("勤学", [list, "vcard"]);
					},
					backup: function (links, player) {
						return {
							filterCard: true,
							popname: true,
							position: "hes",
							viewAs: { 
								name: links[0][2], 
								nature: links[0][3] 
							},
							precontent: function () { 
								player.addTempSkill("qinxue_use_draw");
							},
							check: function (card) {
								return _status.currentPhase == player ? -player.getUseValue(card) : 5 - get.value(card);
							},
						}
					},
					prompt: function (links, player) {
						return "将一张牌当做【" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "】使用";
					},
					check: function (button) {
						if (_status.event.getParent().type != "phase") return 1;
						const player = _status.event.player;
						if (["zhulu_card", "yiyi", "lulitongxin", "lianjunshengyan", "diaohulishan"].includes(button.link[2])) return 0;
						return player.getUseValue({
							name: button.link[2],
							nature: button.link[3],
						});
					},
				},
				ai: {
					order: 10,
					theraten: 2.5,
					fireAttack: true,
					respondSha: true,
					respondShan: true,
					skillTagFilter: function (player, tag, arg) {
						const list = player.storage.qinxue_mark;
						switch (tag) {
							case "fireAttack": 
								if (list.includes("huogong")) return true;
								break;
							case "respondSha": 
								if (list.includes("sha")) return true;
								break;
							case "respondShan": 
								if (list.includes("shan")) return true;
								break;
						}
					},
					result: {
						player: function (player) {
							if (_status.event.dying) {
								return get.attitude(player, _status.event.dying);
							}
							return 1;
						},
					},
				},
			},
			use_draw: {
				trigger: { 
					player: ["useCardAfter", "respondAfter"],
				},
				forced: true,
				locked: true,
				charlotte: true,
				popup: false,
				filter(event, player) {
					return event.skill == "qinxue_use_backup";
				},
				content: function () {
					player.storage.qinxue_mark = player.storage.qinxue_mark.filter(name => name != trigger.card.name);
					player.draw();
				},
			},
		},
	},
	sb_gongmian: {
		trigger: {
			global: "phaseEnd",
		},
		getIndex: function (event, player, triggername) {
			return 2;
		},
		async content (event, trigger, player) {
			const num = game.players.length;
			const cards = get.cards(num, true);
			const resultButton = await player.chooseButton(["你可以使用其中1张牌", [cards, "card"]], 1, false).set("ai", function (button) {
				return player.getUseValue(button.link);
			}).forResult();
			
			if (resultButton.bool) {
				await player.chooseUseTarget(resultButton.links[0], "nodistance", false);
			} else {
				event.finish();
			}
		},
	},
	linyuan: {
		trigger: {
			global: "phaseEnd",
		},
		limited: true,
		skillAnimation: true,
		animationColor: "wood",
		uinque: true,
		locked: true,
		filter: function (event, player) {
			return event.player != player;
		},
		async content (event, trigger, player) {
			player.awakenSkill("linyuan");
			const cards = ["cardPile", "discardPile"].map(pos => Array.from(ui[pos].childNodes)).flat();
			const filter = card => !get.tag(card, "damage");
			const pileCards = cards.filter(filter);
			if (pileCards.length) {
				await game.cardsGotoSpecial(pileCards);
				game.log(pileCards, "被移出了游戏");
			}
			for (const target of game.players) {
				const targetCards = target.getCards("hej", filter);
				if (targetCards.length) {
					target.$throw(targetCards);
					game.log(targetCards, "被移出了游戏");
					await target.lose(targetCards, ui.special);
				}
			}
			ui.clear();
			game.players.forEach(function (current) {
				if (current != player) current.addTempSkill("fengyin", { global: "roundEnd" });
			});
			player.insertPhase();
			player.addTempSkill("linyuan_buff", { player: "phaseAfter" });
		},
		subSkill: {
			buff: {
				trigger: {
					player: "phaseDrawBegin",
				},
				forced: true,
				locked: true,
				charlotte: true,
				content: function () { 
					trigger.num += 2;
				},
				mod: {
					cardUsable: function (card, player, num) {
						if (card.name == "sha") return Infinity;
					},
					targetInRange: function (card, player, target) {
						if (card.name == "sha") return true;
					},
				}
			},
		},
	},
	wangmeng: {
		init: function (player) {
			player.storage.wangmeng_mark = [];
		},
		mark: true,
		marktext: "梦",
		intro: {
			name: "亡梦",
			nocount: true,
			mark: function (dialog, storage, player) {
				dialog.addText("其成为以下牌名的牌的目标时，其摸1张牌");
				if (player.storage.wangmeng_mark.length) {
					var cards = [];
					for (var card of player.storage.wangmeng_mark) {
						cards.push(game.createCard(card));
					}
					dialog.addAuto(cards);
				}
			},
		},
		locked: true,
		group: ["wangmeng_cancel", "wangmeng_draw", "wangmeng_remove"],
		subSkill: { 
			cancel: {
				trigger: {
					player: "damageBegin4",
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					return event.card && event.num > 0 && !player.storage.wangmeng_mark.includes(event.card.name);
				},
				content: function () {
					player.storage.wangmeng_mark.push(trigger.card.name);
					trigger.cancel();
					ui.clear();
				},
			},
			draw: {
				trigger: {
					target: "useCardToTargeted",
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					return event.card && player.storage.wangmeng_mark.includes(event.card.name);
				},
				content: function () {
					player.draw();
				},
			},
			remove: {
				trigger: {
					player: "useCard",
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					return event.card && player.storage.wangmeng_mark.includes(event.card.name);
				},
				content: function () {
					player.storage.wangmeng_mark = player.storage.wangmeng_mark.filter(name => name != trigger.card.name);
					player.draw();
				},
			},
		},
	},
	xinglv: {
		dutySkill: true,
		group: ["xinglv_achieve", "xinglv_fail"],
		subSkill: {
			achieve: {
				trigger: {
					global: "dieAfter",
				},
				forced: true,
				locked: true,
				skillAnimation: true,
				animationColor: "wood",
				filter: function (event, player) {
					return event.player != player && event.source && event.source == player; 
				},
				content: function () { 
					player.awakenSkill("xinglv");
					game.log(player, "成功完成使命");
					game.log(player, "将武将牌替换为", trigger.player);
					player.reinit(player.name, trigger.player.name, false);
				},
			},
			fail: {
				trigger: {
					player: "dying",
				},
				forced: true,
				locked: true,
				lastDo: true,
				content: function () { 
					player.awakenSkill("xinglv");
					game.log(player, "使命失败");

					player.recoverTo(1);

					const target = trigger.source;
					const evt = trigger.getParent("phaseUse", true);
					if (evt && evt.player == target) {
						evt.skipped = true;
						game.log(target, "结束了出牌阶段");
					}

					if (!game.hasPlayer(current => current.name == "lvren")) {
						player.reinit(player.name, "lvren", false);
						game.log(player, "将武将牌替换为", get.translation("lvren"));
					}
				},
			},
		},
	},
	re_haqi: {
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		async content(event, trigger, player) {
			player.skip("phaseDraw");
			player.draw();
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
					player.removeGaintag("haqi");
					var x = event.cards.length;
					if (x > 0) await player.chooseToDiscard("he", x, true).set("ai", function (card) {
						return 5 - get.value(card);
					});
					let damage_num = x;
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
	},
	re_keai: {
		locked: true,
		group: ["re_keai_maxHandCard", "re_keai_damage", "re_keai_draw"],
		subSkill: {
			maxHandcard: {
				locked: true,
				mod: {
					maxHandcard: function (player, num) {
						return num + player.hp;
					},
				},
			},
			damage: {
				trigger: {
					player: "damageBegin2",
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					return event.card && event.source;
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
			},
			draw: {
				trigger: {
					player: "changeHpAfter",
				},
				forced: true,
				locked: true,
				content: function () {
					player.draw();
				},
			},
		},
	},
	shi_KK_o: {
		trigger: {
			global: "phaseEnd",
		},
		forced: true,
		locked: true,
		filter: function (event, player) {
			return player.countCards("h", function (card) {
				return get.number(card) == 13;
			}) >= 2;
		},
		async content (event, trigger, player) {
			const result = await player.chooseToDiscard("h", 2, true, function (card) {
				return get.number(card) == 13;
			}).forResult();
			if (result.bool) player.insertPhase();
		},
	},
	kaimuyanchu: {
		enable: "phaseUse",
		limited: true,
		unique: true,
		skillAnimation: true,
		animationColor: "thunder",
		content: function () {
			player.awakenSkill("kaimuyanchu");
			player.addMark("kaimuyanchu_mark", 3, true);
			const list = [
				"kaimuyanchu_remove", "kaimuyanchu_dying", "kaimuyanchu_mod",
				"kaimuyanchu_viewAs", "kaimuyanchu_addMark"
			];
			player.addSkill(list);
		},
		subSkill: {
			mark: {
				charlotte: true,
				marktext: "幕",
				intro: {
					name: "开幕演出",
					content: "效果持续#个其的回合",
				},
			},
			remove: {
				trigger: {
					player: "phaseEnd",
				},
				forced: true,
				charlotte: true,
				popup: false,
				filter: function (event, player) {
					return player.hasMark("kaimuyanchu_mark");
				},
				content: function () {
					player.removeMark("kaimuyanchu_mark", 1, true);
					const list = [
						"kaimuyanchu_remove", "kaimuyanchu_dying", "kaimuyanchu_mod",
						"kaimuyanchu_viewAs", "kaimuyanchu_addMark"
					];
					if (!player.hasMark("kaimuyanchu_mark")) player.removeSkill(list);
				},
			},
			dying: {
				trigger: {
					player: "dying",
				},
				forced: true,
				charlotte: true,
				filter: function (event, player) {
					return player.hasMark("kaimuyanchu_mark");
				},
				content: function () {
					player.removeMark("kaimuyanchu_mark", 1, true);
					player.recoverTo(1);
				},
			},
			mod: {
				locked: true,
				charlotte: true,
				mod: {
					cardUsable: function (card, player, event) { 
						if (card.name == "sha" && player.hasMark("kaimuyanchu_mark")) return Infinity;
					},
					targetInRange: function (card, player, target) {
						if (card.name == "sha" && player.hasMark("kaimuyanchu_mark")) return true;
					}
				},
			},
			viewAs: {
				enable: ["chooseToUse", "chooseToRespond"],
				usable: 2,
				locked: true,
				charlotte: true,
				filterCard: function (card, player, event) {
					return true;
				},
				position: "hes",
				viewAs: function (cards, player) {
					const color = get.color(cards[0]);
					return { name: "sha", nature: color == "black" ? "thunder" : "fire" };
				},
				prompt2: "你可以将黑色牌视为【雷杀】，红色牌视为【火杀】使用或打出",
				filter: function (event, player) {
					return player.countCards("hes") > 0 && player.hasMark("kaimuyanchu_mark");
				},
			},
			addMark: {
				trigger: {
					global: "dying",
				},
				usable: 2,
				forced: true,
				charlotte: true,
				filter: function (event, player) {
					return event.player != player && player.hasMark("kaimuyanchu_mark") && event.source == player;
				},
				content: function () { 
					player.addMark("kaimuyanchu_mark", 1, true);
				},
			},
		},
	},
	zhongmuzhixuanlv: {
		marktext: "律",
		intro: {
			name: "终幕之旋律",
			content: function (storage, player) {
				const source = player.storage.zhongmuzhixuanlv_source;
				return get.translation(source) + "对其造成的伤害+" + player.countMark("zhongmuzhixuanlv");
			},
		},
		locked: true,
		group: ["zhongmuzhixuanlv_addMark", "zhongmuzhixuanlv_addDamage"],
		subSkill: {
			addMark: {
				trigger: {
					source: "damageEnd",
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					return event.card && event.card.name == "sha" && event.num > 0 && 
						event.player.countMark("zhongmuzhixuanlv") < 3 && event.player != player;
				},
				content: function () {
					const target = trigger.player;
					if (!target.storage.zhongmuzhixuanlv_source) target.storage.zhongmuzhixuanlv_source = player;
					target.addMark("zhongmuzhixuanlv", 1, true);
				},
			},
			addDamage: {
				trigger: {
					source: "damageBegin1",
				},
				forced: true,
				locked: true,
				filter: function (event, player) { 
					return event.num > 0 && event.player.hasMark("zhongmuzhixuanlv");
				},
				content: function () {
					const num = trigger.player.countMark("zhongmuzhixuanlv");
					trigger.num += num;
				},
			},
		},
	},
	jiangsinianjituoyuci: {
		forced: true,
		locked: true,
		mod: {
			targetEnabled: function (card, player, target) {
				if (["lebu", "bingliang", "juedou"].includes(card.name)) return false;
			},
		},
	},
	zhoumidezhunbei: {
		group: ["zhoumidezhunbei_gain", "zhoumidezhunbei_recover"],
		subSkill: { 
			gain: {
				trigger: {
					source: "damageAfter",
				},
				prompt2: function (event, player) {
					return "你可以获得" + get.translation(event.player) + "区域里的1张牌";
				},
				filter: function (event, player) {
					return event.num > 0 && event.player.countCards("hes") > 0;
				},
				async content (event, trigger, player) {
					await player.gainPlayerCard("hej", trigger.player, 1, true).set("ai", lib.card.shunshou.ai.button);
				},
			},
			recover: {
				trigger: {
					global: "dieAfter",
				},
				forced: true,
				filter: function (event, player) {
					return player.getDamagedHp() > 0;
				},
				content: function () {
					player.recover();
				},
			},
		},
	},
	shenlin: {
		marktext: "苏",
		intro: {
			name: "苏",
			nocount: true,
			content: "当其进入濒死状态时，其失去【苏】标记，将体力回复至体力上限，摸3张牌，获得1【触】标记",
		},
		locked: true,
		group: ["shenlin_gameStart", "shenlin_dying"],
		subSkill: {
			gameStart: {
				trigger: {
					global: "gameStart",
				},
				forced: true,
				locked: true,
				content: function () {
					player.addMark("shenlin", 1, true);
				},
			},
			dying: {
				trigger: {
					player: "dying",
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					return player.hasMark("shenlin");
				},
				content: function () {
					player.removeMark("shenlin", 1, true);
					player.recoverTo(player.maxHp);
					player.draw(3);
					player.addMark("shijie", 1, true);
				}
			},
		},
	},
	shijie: {
		marktext: "触",
		intro: {
			name: "触",
			content: "其手牌上限+#",
		},
		enable: "phaseUse",
		usable: 1,
		selectCard: [1, Infinity],
		filterCard: true,
		position: "he",
		filter: function (event, player) {
			return player.countCards("he") > 0;
		},
		content: function () { 
			const num = event.cards.length;
			player.addMark("shijie", num, true);
			if (player.countMark("shijie") >= 6 && !player.hasMark("shenlin")) {
				player.removeMark("shijie", 6, true);
				player.addMark("shenlin", 1, true);
			}
		},
		mod: {
			maxHandcard: function (player, num) {
				return num + player.countMark("shijie");
			},
		},
	},
	guifashi: {
		group: ["guifashi_phaseDraw", "guifashi_cancel", "guifashi_damage"],
		subSkill: {
			phaseDraw: { 
				trigger: {
					player: "phaseDrawBegin",
				},
				forced: true,
				async content (event, trigger, player) {
					trigger.num = 0;

					let flag = false;
					do {
						flag = false;

						const list = ["摸4张牌", "摸1张牌并判定"]
						const chooseControl = await player.chooseControl(list).set("ai", function () {
							return list[0];
						}).forResult();

						if (chooseControl.control == list[0]) {
							player.draw(4);
						} else {
							player.draw();
							const judge = await player.judge(function (card) {
								const number = get.number(card);
								if (number >= 1 && number <= 10) return 1.5;
								return -1.5;
							}).forResult();

							if (judge.bool) {
								const chooseBool = await player.chooseBool("是否继续发动【诡法师】？").forResult();

								if (chooseBool.bool) flag = true;
							}
						}
					} while (flag);
				},
			},
			cancel: {
				trigger: {
					player: "damageBegin2",
				},
				prompt2: function (event, player) { 
					const num = event.num;
					return "是否失去" + 2 * num + "【触】标记以取消此" + num + "伤害？"
				},
				filter: function (event, player) {
					if (event.num <= 0) return false;
					return player.countMark("shijie") >= 2 * event.num;
				},
				content: function () {
					player.removeMark("shijie", 2 * trigger.num, true);
					trigger.cancel();
				},
			},
			damage: {
				trigger: {
					source: "damageBegin1",
				},
				prompt2: function (event, player) {
					return "是否失去1【触】标记以令此对" + get.translation(event.player) + "的伤害+1？"
				},
				filter: function (event, player) {
					return event.num > 0 && player.countMark("shijie") > 0;
				},
				content: function () { 
					player.removeMark("shijie", 1, true);
					trigger.num++;
				},
			},
		},
	},
	wumianren: {
		group: ["wumianren_draw", "wumianren_discard"],
		subSkill: { 
			draw: {
				trigger: {
					player: ["equipEnd", "loseEnd"],
				},
				forced: true,
				filter: function (event, player) {
					if (event.name == "equip") {
						return event.card;
					} else {
						for (let card of event.cards) {
							if (card.original == "e") return true;
						}
					} 
				},
				content: function () {
					player.draw();
				},
			},
			discard: {
				trigger: {
					player: "damageEnd",
				},
				forced: true,
				filter: function (event, player) {
					return event.num > 0 && event.source;
				},
				async content (event, trigger, player) {
					await trigger.source.chooseToDiscard("he", 1, true);
				},
			},
		},
	},
	qys_jiewei: {
		enable: "phaseUse",
		usable: 1,
		selectCard: 1,
		filterCard: true,
		position: "he",
		filter: function (event, player) {
			return player.countCards("he") > 0;
		},
		async content (event, trigger, player) {
			const chooseTarget = await player.chooseTarget([1, Infinity], true, function (card, player, target) {
				if (target.countCards("he") <= 0) return false;
				return target != player;
			}).forResult();

			let num = 0;
			await Promise.all(
				chooseTarget.targets.map(async target => {
					const chooseToGive = await target.chooseToGive("he", 1, player, true).set("ai", function (card) {
						return 5 - get.value(card);
					}).forResult();
					if (get.type(chooseToGive.cards[0]) == "basic") num++;
				})
			);
			player.draw(num);
		},
	},
	menxin: {
		locked: true,
		group: ["menxin_phaseDraw", "menxin_gameStart", "menxin_mod", "menxin_gain", "menxin_loseMark", "menxin_discard"],
		subSkill: {
			phaseDraw: {
				trigger: {
					player: "phaseDrawBegin",
				},
				forced: true,
				locked: true,
				content: function () {
					trigger.num = 2 * player.hp;
				},
			},
			gameStart: { 
				trigger: {
					global: "gameStart",
				},
				forced: true,
				locked: true,
				content: function () {
					player.disableEquip("equip2");
				},
			},
			mod: {
				locked: true,
				mod: {
					maxHandcard: function (player, num) {
						return 9;
					},
				},
			},
			gain: {
				marktext: "<span style=\"color: #8A0303;\">异<\span>",
				intro: {
					name: "异心",
					content: "当前有#个【异心】标记"
				},
				trigger: {
					player: "gainEnd",
				},
				forced: true,
				locked: true,
				content: function () { 
					player.addMark("menxin_gain", trigger.cards.length, true);
				},
			},
			loseMark: {
				trigger: {
					player: "gainAfter",
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					return player.countMark("menxin_gain") >= 100 && player.storage.qys_yizheng;
				},
				content: function () {
					player.removeMark("menxin_gain", player.countMark("menxin_gain"), true);
					player.addMark("menxin_discard", 50, true);
				}
			},
			discard: {
				marktext: "<span style=\"color: #D4AF37;\">镇<\span>",
				intro: {
					name: "镇关",
					content: "当前有#个【镇关】标记"
				},
				trigger: {
					player: "discardEnd",
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					return player.storage.qys_yizheng;
				},
				content: function () { 
					player.addMark("menxin_discard", trigger.cards.length, true);
				},
			},
		},
	},
	lishi: {
		init: function (player) {
			if (!player.identity) player.removeSkill("lishi");
		},
		trigger: {
			global: "gameStart",
		},
		firstDo: true,
		forced: true,
		locked: true,
		filter: function (event, player) {
			return player.identity;
		},
		content: function () {
			player.showIdentity();
			player.say("我的身份是" + get.translation(player.identity));
			game.log(get.translation(player) + "的身份是" + get.translation(player.identity));
			switch (player.identity) {
				case "zhu":
					player.maxHp += 1;
					player.hp += 1;
					break;
				case "zhong":
					player.expandEquip(1);
					break;
				case "fan":
					player.addSkill("lishi_fan");
					break;
				case "nei":
					player.addSkill("lishi_nei");
					break;
			}
		},
		subSkill: {
			fan: {
				trigger: {
					source: "damageBegin1",
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					return event.num > 0 && event.player.identity == "zhu";
				},
				content: function () {
					trigger.num++;
				},
			},
			nei: {
				trigger: {
					source: "damageEnd",
					player: "changeHpAfter",
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					if (event.name == "damage") return event.num > 0;
					else if (event.name == "changeHp") return true;
					return false;
				},
				content: function () { 
					player.draw();
				},
			},
		},
	},
	qys_yizheng: {
		init: function (player) {
			lib.characterSubstitute["shen_mojiexianjun_zuolaobai"] = [
				["shen_mojiexianjun_zuolaobai_shadow", ["img:extension/群友杀/image/character/shen_mojiexianjun_zuolaobai_shadow.jpg"]]
			];
		},
		trigger: {
			player: ["phaseBegin","changeHpEnd"],
		},
		juexingji: true,
		skillAnimation: true,
		animationColor: "fire",
		forced: true,
		locked: true,
		unique: true,
		filter: function (event, player) {
			if (event.name == "phase") return player.countMark("menxin_gain") >= 100;
			else if (event.name == "changeHp") return player.hp <= 1;
			return false;
		},
		async content (event, trigger, player) { 
			player.removeMark("menxin_gain", player.countMark("menxin_gain"), true);
			player.addMark("menxin_discard", 100, true);
			player.awakenSkill("qys_yizheng");
			player.changeSkin({ characterName: "shen_mojiexianjun_zuolaobai" }, "shen_mojiexianjun_zuolaobai_shadow");
			player.$fullscreenpop("<span style=\"color: #8A0303;\">代执朱批<\span>");
			await game.delay(3);
			player.loseMaxHp();
			player.removeSkill("qys_jiewei");
			player.recoverTo(player.maxHp);
			player.addSkill(["danghuang", "dingjiang", "zhuyi"]);
		},
		derivation: ["danghuang", "dingjiang", "zhuyi"],
	},
	danghuang: {
		enable: "phaseUse",
		usable: 1,
		selectTarget: [1, Infinity],
		filterTarget: function (card, player, target) {
			return target != player;
		},
		async content (event, trigger, player) {
			let list = ["受到1伤害并弃置1张牌", "交给" + get.translation(player) +"2张牌"];
			const target = event.target;

			if (target.countCards("he") < 2) list = ["受到1伤害并弃置1张牌"];
			const chooseControl = await target.chooseControl(list, true).set("ai", function () {
				return list[0];
			}).forResult();

			if (chooseControl.control == list[0]) {
				target.damage();
				await target.chooseToDiscard("he", 1, true).set("ai", function (card) {
					return 5 - get.value(card);
				});
			} else {
				await target.chooseToGive("he", 2, player, true).set("ai", function (card) {
					return 5 - get.value(card);
				});
			}
		}
	},
	dingjiang: {
		enable: "phaseUse",
		selectCard: 9,
		filterCard: true,
		position: "h",
		filter: function (event, player) {
			return player.countMark("menxin_discard") >= 100 && player.countCards("h") >= 9;
		},
		async content (event, trigger, player) {
			player.removeMark("menxin_discard", player.countMark("menxin_discard"), true);
			const result = await player.chooseTarget("令任意名角色失去1体力上限", [1, Infinity], true).set("ai", function (target) {
				return -get.attitude(player, target);
			}).forResult();

			for (const target of result.targets) target.loseMaxHp();
		},
	},
	zhuyi: {
		trigger: {
			global: "phaseEnd",
		},
		prompt2: function (event, player) {
			return "是否对" + get.translation(event.player) + "造成1伤害？";
		},
		filter: function (event, player) {
			return event.player.countCards("h") > player.countCards("h");
		},
		content: function () { 
			trigger.player.damage();
		},
	},
	fengjue: {
		marktext: "爵",
		intro: {
			name: "爵位",
			nocount: true,
			content: function (storage, player) {
				return "其无法成为【兵粮寸断】和【乐不思蜀】的目标，其牌即将因使用或打出而进入弃牌堆时，" + get.translation(player.storage.fengjue_source) + "获得之";
			},
		},
		group: ["fengjue_phaseUse", "fengjue_damage", "fengjue_damage_remove"],
		subSkill: {
			phaseUse: {
				enable: "phaseUse",
				usable: 1,
				selectTarget: 1,
				filterTarget: function (card, player, target) {
					return target != player && !target.hasMark("fengjue");
				},
				filter: function (event, player) {
					return game.hasPlayer(function (current) {
						return !current.hasMark("fengjue");
					});
				},
				content: function () {
					target.storage.fengjue_source = player;
					target.addMark("fengjue");
					target.addSkill("fengjue_buff");
				},
				ai : {
					order: 10,
					result: {
						target: function (player, target) {
							return get.attitude(player, target);
						},
					},
				},
			},
			damage: {
				init: function (player) { 
					player.storage.fengjue_damage = [];
				},
				trigger: {
					global: "damageEnd",
				},
				forced: true,
				filter: function (event, player) {
					return event.num > 0 && event.source && !player.storage.fengjue_damage.includes(event.source)
						&& (event.source.hasMark("fengjue") || event.source == player);
				},
				async content (event, trigger, player) { 
					const source = trigger.source;
					player.storage.fengjue_damage.push(source);
					var list = [];
					if (trigger.source.getDamagedHp() > 0) list = ["令" + get.translation(source) + "摸3张牌", "令" + get.translation(source) + "回复1点体力"];
					else list = ["令" + get.translation(source) + "摸3张牌"];
					const result = await player.chooseControl(list).set("ai", function () {
						if (list.length == 2 && source.hp <= 2) return list[1];
						else return list[0];
					}).forResult();

					if (result.control == list[0]) source.draw(3);
					else source.recover();
				},
				ai: {
					threaten: 1.2,
					effect: {
						player: function (card, player, target) {
							if (get.tag(card, "damage")) return [1, 1];
						},
					},
				},
			},
			damage_remove: {
				trigger: {
					global: "phaseBegin",
				},
				forced: true,
				locked: true,
				charlotte: true,
				popup: false,
				content: function () {
					player.storage.fengjue_damage = [];
				},
			},
			buff: {
				trigger: {
					global: "cardsDiscardBefore",
				},
				forced: true,
				locked: true,
				charlotte: true,
				popup: false,
				filter: function (event, player) {
					if (get.type(event.cards[0], "trick") != "trick") return false;
					var evt = event.getParent();
					if (evt.relatedEvent && ["useCard", "respond"].includes(evt.relatedEvent.name) && evt.relatedEvent.player == player) return true;
				},
				content: function () {
					player.storage.fengjue_source.gain(trigger.cards, "gain2");
					trigger.finish();
				},
				mod: {
					targetEnabled: function (card, player, target) {
						if (["lebu", "bingliang"].includes(card.name)) return false;
					},
				},
				ai: {
					threaten: 1.2,
					effect: {
						target: function (card, player, target) {
							if (get.type(card) == "trick") return [1, 0, -1, 0];
						},
					},
				},
			},
		},
	},
	junming: {
		marktext: "律",
		intro: {
			name: "律",
			content: "当前有#个【律】标记",
		},
		group: ["junming_phaseUse", "junming_useCard", "junming_cancel"],
		subSkill: {
			phaseUse: {
				trigger: {
					player: "phaseUseBegin",
				},
				prompt2: "你可以弃置任意张手牌并获得x【律】标记（x为你弃置的手牌数）",
				filter: function (event, player) {
					return player.countCards("h") > 0;
				},
				async content (event, trigger, player) {
					const result = await player.chooseToDiscard("h", [1, Infinity], true).set("ai", function (card) {
						return 7 - player.getUseValue(card);
					}).forResult();

					player.addMark("junming", result.cards.length, true);
				},
			},
			useCard: {
				trigger: {
					global: "useCard",
				},
				usable: 1,
				forced: true,
				popup: false,
				filter: function (event, player) {
					return event.card && get.type(event.card, "trick") == "trick";
				},
				content: function () {
					player.addMark("junming", 1, true);
				},
				ai: {
					threaten: 1.2,
					effect: {
						player: function (card, player, target) {
							if (get.type(card) != "basic") return 1.5;
						},
					},
				},
			},
			cancel: {
				trigger: {
					global: "damageBegin2",
				},
				prompt2: function (event, player) {
					const num = event.num;
					return "是否失去" + num + "【律】标记以取消此对"+ get.translation(event.player) + "的" + event.num + "点伤害？";
				},
				filter: function (event, player) {
					const num = event.num;
					return (event.player == player || event.player.hasMark("fengjue")) && player.countMark("junming") >= num;
				},
				content: function () {
					const num = trigger.num;
					player.removeMark("junming", num, true);
					trigger.cancel();
					ui.clear();
				},
				check: function (event, player) {
					return get.attitude(player, event.player) > 0;
				},
				ai: {
					threaten: 1.5,
					nodamage: true,
					skillTagFilter: function (player, tag, arg) {
						return player.hasMark("junming");
					},
				},
			},
		},
	},
	duankou: {
		marktext: "端",
		intro: {
			name: "端口",
			nocount: true,
		},
		init: function (player) {
			player.addMark("duankou", 1, true);
		},
		enable: "phaseUse",
		usable: 1,
		selectCard: 2,
		filterCard: true,
		position: "h",
		filter: function (event, player) {
			return player.countCards("h") > 0 && game.hasPlayer(current => current != player && !current.hasMark("duankou"));
		},
		async content (event, trigger, player) {
			const chooseTarget = await player.chooseTarget("令一名其他角色获得【端口】标记", 1, true, function (card, player, target) {
				return target != player && !target.hasMark("duankou");
			}).set("ai", function (target) {
				return get.attitude(player, target);
			}).forResult();
			const target = chooseTarget.targets[0];
			target.addMark("duankou");
			target.addSkill(["hulian", "Ping"]);
		},
		ai: {
			order: 10,
			threaten: 1.2,
			result: {
				player: function (player) {
					return game.hasPlayer(function (current) {
						return current != player && !current.hasMark("duankou") && get.attitude(player, current) > 0;
					}) ? 10 : -10;
				},
			},
		},
	},
	hulian: {
		enable: "chooseToUse",
		locked: true,
		filter: function (event, player) {
			return game.hasPlayer(function (current) {
				return current.hasMark("duankou") && current != player && current.countCards("h") > 0;
			}) && _status.currentPhase == player;
		},
		chooseButton: {
			dialog: function (event, player) {
				const players = game.filterPlayer(function (current) {
					return current.hasMark("duankou") && current != player && current.countCards("h") > 0;
				});
				var list = [];
				players.forEach(function (current) {
					const cards = current.getCards("h", function (card) {
						return lib.filter.cardUsable(card, player) && 
							game.hasPlayer(function (current) {
								return player.canUse(card, current, true, true);
							});
					});
					list.push([get.translation(current), cards]);
				});
				var dialog = ui.create.dialog("互联");
				for (const item of list) {
					dialog.add(item[0]);
					dialog.add([item[1], "card"]);
				}
				return dialog;
			},
			backup: function (links, player) {
				return {
					direct: true,
					async content (event, trigger, player) {
						const card = links[0];
						player.logSkill("hulian");
						await player.chooseUseTarget(card, true);
					},
				}
			},
			check: function (button) {
				const player = _status.event.player;
				if (!game.hasPlayer(current => player.canUse(button.link, current, true, true) 
					&& get.effect(current, button.link, player, player) > 0)) return -10;
				return player.getUseValue(button.link);
			},
		},
		ai: {
			order: 10,
			threaten: 1.2,
			result: { 
				player: function (player) {
					if (_status.event.dying) {
						return get.attitude(player, _status.event.dying);
					}
					return 1;
				},
			},
		},
	},
	Ping: {
		trigger: {
			global: "gainAfter",
		},
		forced: true,
		filter: function (event, player) {
			return event.player != player && event.player.hasMark("duankou") && 
				event.getg(event.player).length > 0 && event.getParent(2).name != "Ping";
		},
		content: function () { 
			player.draw(trigger.getg(trigger.player).length);
		},
		ai: {
			threaten: 1.2,
		},
	},
	songmu: {
		init: function (player) {
			player.storage.songmu = 0;
		},
		persevereSkill: true,
		group: ["songmu_loseToSpecial", "songmu_count"],
		subSkill: {
			loseToSpecial: {
				trigger: {
					global: "cardsDiscardAfter",
					player: ["loseAfter", "loseAsyncAfter"],
				},
				forced: true,
				popup: false,
				persevereSkill: true,
				filter: function(event, player) {
					if (player.storage.songmu >= 6) return false;
					if (event.name.indexOf("lose") == 0) {
						if (event.type != "discard" || event.getlx === false) return false;
						var cards = event.getl(player);
						if (cards && cards.cards2 && cards.cards2.length) return cards.cards2.some(card => get.position(card) === "d");
						return false;
					} else {
						var evt = event.getParent();
						if (evt.relatedEvent && ["useCard", "respond"].includes(evt.relatedEvent.name) && evt.relatedEvent.player == player) return true;
					}
					return false;
				},
				content: function () {
					// player.say("我空梦就是个傲娇小杂鱼喵喵喵");

					trigger.finish();
					player.loseToSpecial(trigger.cards, "songmu");
					player.storage.songmu += trigger.cards.length;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
				},
				mod: {
					cardEnabled2: function (card, player) {
						if (card.hasGaintag("songmu") && get.position(card) == "s") return false;
					},
				},
			},
			count: {
				forced: true,
				locked: true,
				charlotte: true,
				popup: false,
				trigger: {
					global: "phaseBegin",
				},
				content: function () {
					player.storage.songmu = 0;
				},
			},
		},
	},
	chuwai: {
		enable: "phaseUse",
		usable: 2,
		selectCard: [4, 6],
		lose: false,
		discard: false,
		filterCard: function (card, player) {
			return card.hasGaintag("songmu");
		},
		position: "s",
		prompt: "弃置4到6张“墓地”牌，执行不同的效果",
		filter: function (event, player) {
			return player.countCards("s", card => card.hasGaintag("songmu")) >= 4;
		},
		async content (event, trigger, player) {
			const cards = event.cards;
			game.log(get.translation(cards) + "被移出游戏");
			player.$throw(cards);
			player.lose(cards, ui.special);
			let types = [];
			for (const card of cards) {
				types.push(get.type(card, "trick"));
			}

			if (types.includes("basic") && types.includes("trick") && types.includes("equip") && cards.length == 6) {
				await player.chooseUseTarget("nanman", true);
				await player.chooseUseTarget("wanjian", true);
				await player.loseToDiscardpile(player.getCards("s", card => card.hasGaintag("songmu")));
			}
			if (types.includes("trick") && types.includes("equip")) {
				const cardsPile = get.cards(1, false);
				player.loseToSpecial(cardsPile, "songmu");

				const zhuge = { name: "zhuge", suit: "diamond", number: 5 };
				const hanbing = { name: "hanbing", suit: "diamond", number: 5 };
				const qinggang = { name: "qinggang", suit: "diamond", number: 5 };
				const list = [zhuge, hanbing, qinggang];

				const chooseButton = await player.chooseButton(["从游戏外获得其中一张", [list, "vcard"]], false).set("ai", function (button) {
					return player.getUseValue(button.link);
				}).forResult();
				if (chooseButton.bool) {
					const equip = game.createCard(chooseButton.links[0]);
					player.gain(equip, "gain2");
				}
			}
			if (types.includes("basic") && types.includes("trick")) {
				const wuzhong = game.createCard("wuzhong", "diamond", 5);
				player.gain(wuzhong, "gain2");
				player.changeHujia(1, "gain");
			}
			if (types.includes("basic") && types.includes("equip")) {
				player.draw();

				const sha = { name: "sha", suit: "diamond", number: 5 };
				const shan = { name: "shan", suit: "diamond", number: 5};
				const tao = { name: "tao", suit: "diamond", number: 5 };
				const jiu = { name: "jiu", suit: "diamond", number: 5 };
				const list = [sha, shan, tao, jiu];

				const chooseButton = await player.chooseButton(["从游戏外获得其中2张，其余加入“墓地”", [list, "vcard"]], 2, false)
					.set("ai", function (button) {
						return get.value(button.link, player);
					}).forResult();
				if (chooseButton.bool) {
					let gain = [];
					let lose = [];
					for (const card of list) {
						if (chooseButton.links.includes(card)) gain.push(game.createCard(card));
						else lose.push(game.createCard(card));
					}
					player.gain(gain, "gain2");
					player.loseToSpecial(lose, "songmu");
				}
			}
		},
		ai: {
			order: 10,
			threaten: 1.5,
			result: {
				player: function (player) {
					return 10;
				},
			},
		},
	},
	xiaoguo: {
		trigger: {
			global: "useCardEnd",
		},
		usable: 1,
		filter: function (event, player) {
			return event.card;
		},
		async content (event, trigger, player) {
			switch (get.type(trigger.card, "trick")) {
				case "basic":
					player.loseToSpecial(get.cards(1, false), "songmu");
					const list = player.getCards("s", card => card.hasGaintag("songmu"));
					if (list.length > 0) {
						const chooseButton = await player.chooseButton(["可以获得其中一张", [list, "card"]], 1, false).set("ai", function (button) {
							return get.value(button.link);
						}).forResult();
						if (chooseButton.bool) player.gain(chooseButton.links[0], "gain2");
					}
					break;
				case "trick":
					const chooseToDiscard = await player.chooseToDiscard("可以弃置x张牌并摸x+1张牌", "he", [1, 3], false).set("ai", function (card) {
						return 5 - get.value(card);
					}).forResult();
					if (chooseToDiscard.bool) player.draw(chooseToDiscard.cards.length + 1);
					break;
				case "equip":
					trigger.finish();
					trigger.player.$give(trigger.cards[0], player)
					trigger.player.loseToSpecial(trigger.cards, "songmu", player);
					const chooseTarget = await player.chooseTarget("选择一名角色令其失去1体力", 1, false).set("ai", function (target) {
						return get.attitude(player, target) < 0;
					}).forResult();
					if (chooseTarget.bool) chooseTarget.targets[0].loseHp(1);
					break;
			}
		},
		ai: {
			threaten: 1.3,
		},
	},
	chongnengqiu: {
		marktext: "球",
		mark: true,
		intro: {
			name: "充能球",
			nocount: true,
			content: function (storage, player) {
				let str = "当前充能球数：" + player.storage.chongnengqiu.length + "/" + player.storage.chongnengqiu_max + "<br>";
				for (const item of player.storage.chongnengqiu) {
					switch (item[0]) {
						case "shandian":
							str += "<span style=\"color: #c4e61cff;\">闪电充能球</span><br>";
							break;
						case "bingshuang":
							str += "<span style=\"color: #6bb3daff;\">冰霜充能球</span><br>";
							break;
						case "heian":
							str += "<span style=\"color: #522976ff;\">黑暗充能球：计数" + item[1] + "</span><br>";
							break;
						case "denglizi":
							str += "<span style=\"color: #d66a1dff;\">等离子充能球</span><br>";
							break;
					}
				}
				return str;
			},
		},
		init: function (player) {
			player.storage.chongnengqiu = [];
			player.storage.chongnengqiu_max = 3;
		},
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter: function (event, player) {
			return true;
		},
		async cost (event, trigger, player) { 
			const list = ["闪电", "冰霜", "黑暗", "等离子", "取消"];
			const result = await player.chooseControl(list).set("ai", function () {
				return list.filter(item => item != "取消").randomGet();
			}).forResult();
			if (result.control != list[4]) event.result = { bool: true, cost_data: result.control};
			else event.result = { bool: false };
		},
		async content (event, trigger, player) {
			const list = ["闪电", "冰霜", "黑暗", "等离子", "取消"];
			switch (event.cost_data) {
				case list[0]:
					player.addMark("chongnengqiu_shandian", 1, true);
					player.storage.chongnengqiu.push(["shandian"]);
					break;
				case list[1]:
					player.addMark("chongnengqiu_bingshuang", 1, true);
					player.storage.chongnengqiu.push(["bingshuang"]);
					break;
				case list[2]:
					player.addMark("chongnengqiu_heian", 1, true);
					player.storage.chongnengqiu.push(["heian", 1]);
					break;
				case list[3]:
					player.addMark("chongnengqiu_denglizi", 1, true);
					player.storage.chongnengqiu.push(["denglizi"]);
					break;
			}

			if (player.storage.chongnengqiu.length > player.storage.chongnengqiu_max) {
				const skill = "chongnengqiu_" + player.storage.chongnengqiu[0][0];
				const triggername = "chongnengqiuJifa";
				player.removeMark(skill, 1, true);
				await game.createTrigger(triggername, skill, player, { player: player }, null);
				player.storage.chongnengqiu.shift();
			}
		},
		ai: {
			threaten: 1.2,
		},
		group: ["chongnengqiu_jizhong", "chongnengqiu_shandian", "chongnengqiu_bingshuang", "chongnengqiu_heian", "chongnengqiu_denglizi"],
		subSkill: {
			jizhong: {
				mark: true,
				markimage: "extension/群友杀/image/mark/jizhong.png",
				intro: {
					name: "集中",
					content: function (storage, player) {
						const num = 1 + player.countMark("chongnengqiu_jizhong");
						let str = "";
						str += "闪电充能球伤害值：" + num + "<br>";
						str += "冰霜充能球护甲值：" + num + "<br>";
						str += "黑暗充能球可自主选择目标<br>";
						str += "等离子充能球摸牌数：" + num + "<br>";
						return str;
					},
				},
				locked: true,
				charlotte: true,
				ai: {
					threaten: function (player, target) {
						return 1 + 0.5 * player.countMark("chongnengqiu_jizhong");
					},
				},
			},
			shandian: {
				init: function (player) {
					lib.translate.chongnengqiu_shandian = "闪电充能球";
				},
				markimage: "extension/群友杀/image/mark/chongnengqiu_shandian.png",
				intro: {
					name: "<span style=\"color: #c4e61cff;\">闪电充能球</span>",
				},
				trigger: {
					player: "phaseEnd",
				},
				locked: true,
				charlotte: true,
				priority: 10,
				filter: function (event, player) {
					return player.hasMark("chongnengqiu_shandian");
				},
				getIndex: function (event, player, triggername) {
					return player.countMark("chongnengqiu_shandian");
				},
				async cost (event, trigger, player) {
					const num = 1 + player.countMark("chongnengqiu_jizhong");
					let select = [1];
					let str = "可以对一名其他角色造成" + num + "雷电伤害";
					if (player.hasSkill("diandonglixue")) {
						select = [1, 2];
						str = "可以对至多2名其他角色造成" + num + "雷电伤害";
					}
					const result = await player.chooseTarget(str, select, false, (card, player, target) => target != player).set("ai", function (target) {
						return get.damageEffect(target, player, player, "thunder");
					}).forResult();
					event.result = result;
				},
				content: function () {
					const num = 1 + player.countMark("chongnengqiu_jizhong");
					event.targets.forEach(target => target.damage(num, "thunder"));
				},
				ai: {
					threaten: function (player, target) {
						return 1 + 0.3 * target.countMark("chongnengqiu_shandian");
					},
				},
			},
			bingshuang: {
				init: function (player) {
					lib.translate.chongnengqiu_bingshuang = "冰霜充能球";
				},
				markimage: "extension/群友杀/image/mark/chongnengqiu_bingshuang.png",
				intro: {
					name: "<span style=\"color: #6bb3daff;\">冰霜充能球</span>",
				},
				trigger: {
					player: "phaseEnd",
				},
				forced: true,
				locked: true,
				charlotte: true,
				priority: 9,
				filter: function (event, player) {
					return player.hasMark("chongnengqiu_bingshuang");
				},
				content: function () { 
					const ballsNum = player.countMark("chongnengqiu_bingshuang");
					const per = 1 + player.countMark("chongnengqiu_jizhong");
					const num = event.triggername == "chongnengqiuJifa" ? per : ballsNum * per;
					player.changeHujia(num, "gain");
				},
				ai: {
					threaten: function (player, target) {
						return 1 + 0.15 * target.countMark("chongnengqiu_bingshuang");
					},
				},
			},
			heian: {
				init: function (player) {
					lib.translate.chongnengqiu_heian = "黑暗充能球";
				},
				markimage: "extension/群友杀/image/mark/chongnengqiu_heian.png",
				intro: {
					name: "<span style=\"color: #522976ff;\">黑暗充能球</span>",
				},
				trigger: {
					player: "phaseEnd",
				},
				locked: true,
				charlotte: true,
				popup: false,
				priority: 8,
				filter: function (event, player) {
					return player.hasMark("chongnengqiu_heian");
				},
				async cost (event, trigger, player) {
					if (event.triggername == "chongnengqiuJifa") {
						const num =player.storage.chongnengqiu[0][1];
						if (player.hasMark("chongnengqiu_jizhong")) {
							event.result = await player.chooseTarget("可以选择一名其他角色令其失去" + num + "体力", 1, false, function (card, player, target) {
								return target != player;
							}).set("ai", function (target) {
								return get.damageEffect(target, player, player);
							}).forResult();
						} else {
							let minHp = Infinity;
							let target = null;
							game.players.forEach(current => {
								if (current != player && current.hp <= minHp) {
									minHp = current.hp;
									target = current;
								}
							});
							event.result = { bool: true, targets: [target] };
						}
					} else {
						event.result = { bool: true };
					}
				},
				content: function () {
					if (event.triggername == "chongnengqiuJifa") {
						const num = player.storage.chongnengqiu[0][1];
						event.targets[0].loseHp(num);
					} else {
						for (let i = 0; i < event.player.storage.chongnengqiu.length; i++) {
							if (event.player.storage.chongnengqiu[i][0] == "heian") {
								event.player.storage.chongnengqiu[i][1]++;
								player.logSkill("chongnengqiu_heian");
							}
						}
					}
				},
				ai: {
					threaten: function (player, target) {
						if (target.storage.chongnengqiu.length > 0) {
							const first = target.storage.chongnengqiu[0];
							if (first[0] == "heian") return 1 + 0.3 * first[1];
						}
						return 1 + 0.1 * target.countMark("chongnengqiu_heian");
					},
				},
			},
			denglizi: {
				init: function (player) {
					lib.translate.chongnengqiu_denglizi = "等离子充能球";
				},
				markimage: "extension/群友杀/image/mark/chongnengqiu_denglizi.png",
				intro: {
					name: "<span style=\"color: #d66a1dff;\">等离子充能球</span>",
				},
				trigger: {
					player: "phaseDrawBegin",
				},
				forced: true,
				locked: true,
				charlotte: true,
				filter: function (event, player) {
					return player.hasMark("chongnengqiu_denglizi");
				},
				content: function () {
					const ballsNum = player.countMark("chongnengqiu_denglizi");
					const per = 1 + player.countMark("chongnengqiu_jizhong");
					if (event.triggername == "chongnengqiuJifa") player.draw(per);
					else player.draw(ballsNum * per);
				},
				ai: {
					threaten: function (player, target) {
						return 1 + 0.15 * target.countMark("chongnengqiu_denglizi");
					},
				},
			},
		},
	},
	suipianzhengli: {
		enable: "phaseUse",
		usable: 1,
		selectCard: -1,
		filterCard: true,
		position: "h",
		filter: function (event, player) {
			const num = 5 * (1 + player.countMark("chongnengqiu_jizhong"));
			return player.countCards("h") >= num;
		},
		content: function () { 
			player.addMark("chongnengqiu_jizhong");
		},
		ai: {
			order: 10,
			result: {
				player: function (player) {
					return 10;
				},
			},
		},
	},
	chuangzaoxing_AI: {
		enable: "phaseUse",
		markimage: "extension/群友杀/image/mark/chuangzaoxing_AI.png",
		limited: true,
		unique: true,
		skillAnimation: true,
		animationColor: "water",
		selectCard: -1,
		filterCard: true,
		position: "h",
		filter: function (event, player) {
			return player.hasSkill("suipianzhengli") && player.countCards("h") >= 15;
		},
		async content (event, trigger, player) { 
			player.awakenSkill("chuangzaoxing_AI");
			const list = ["piancharenzhi", "diandonglixue", "xunhuan", "digui", "kuorong", "huixiangxingtai"];
			const result = await player.chooseButton(["失去【" + get.translation("suipianzhengli") + "】并选择获得至多2个技能", [list, "skill"]], [1, 2], true, function (button) {
				return list.randomGet();
			}).forResult();
			player.removeSkill("suipianzhengli");
			player.addSkill(result.links);
		},
		derivation: ["piancharenzhi", "diandonglixue", "xunhuan", "digui", "kuorong", "huixiangxingtai"],
		ai: {
			order: 9,
			result: {
				player: function (player) {
					return 10;
				},
			},
		},
	},
	piancharenzhi: {
		init: function (player) {
			player.addMark("chongnengqiu_jizhong", 2, true);
		},
		mark: true,
		markimage: "extension/群友杀/image/mark/piancha.png",
		intro: {
			name: "偏差",
			content: "每个其的回合开始时，其失去1【集中】"
		},
		trigger: {
			player: "phaseBegin",
		},
		forced: true,
		locked: true,
		firstDo: true,
		filter: function (event, player) {
			return player.hasMark("chongnengqiu_jizhong");
		},
		content: function () {
			player.removeMark("chongnengqiu_jizhong", 1, true);
			if (!player.hasMark("chongnengqiu_jizhong")) {
				player.unmarkSkill("chongnengqiu_jizhong");
				player.unmarkSkill("piancharenzhi");
			}
		},
	},
	diandonglixue: {
		mark: true,
		markimage: "extension/群友杀/image/mark/diandonglixue.png",
		intro: {
			name: "电动力学",
			content: "其【闪电充能球】可额外选择1个目标",
		},
		locked: true,
		ai: {
			threaten: function (player, target) {
				return 1 + 0.2 * target.countMark("chongnengqiu_shandian");
			}
		},
	},
	xunhuan: {
		mark: true,
		markimage: "extension/群友杀/image/mark/xunhuan.png",
		intro: {
			name: "循环",
			content: "其回合开始时，触发一次其第一个充能球的被动",
		},
		trigger: {
			player: "phaseBegin",
		},
		forced: true,
		locked: true,
		filter: function (event, player) {
			return player.storage.chongnengqiu.length > 0;
		},
		async content (event, trigger, player) {
			const skill = "chongnengqiu_" + player.storage.chongnengqiu[0][0];
			const triggername = "xunhuan";
			await game.createTrigger(triggername, skill, player, { player: player }, null);
		},
		ai: {
			threaten: function (player, target) {
				if (target.storage.chongnengqiu.length > 0) {
					const first = target.storage.chongnengqiu[0];
					switch (first[0]) {
						case "shandian":
							return 1.3;
						case "bingshuang":
							return 1.1;
						case "heian":
							return 1.2;
						case "denglizi":
							return 1.15;
					}
				}
				return 1;
			},
		},
	},
	digui: {
		enable: "phaseUse",
		usable: 1,
		selectCard: 3,
		filterCard: true,
		position: "h",
		filter: function (event, player) {
			return player.storage.chongnengqiu.length > 0 && player.countCards("h") >= 3;
		},
		async content(event, trigger, player) {
			const ball = player.storage.chongnengqiu[0];
			const skill = "chongnengqiu_" + player.storage.chongnengqiu[0][0];
			const triggername = "chongnengqiuJifa";
			player.removeMark(skill, 1, true);
			await game.createTrigger(triggername, skill, player, { player: player }, null);
			player.storage.chongnengqiu.shift();
			player.addMark(skill, 1, true);
			player.storage.chongnengqiu.push(ball);
		},
		ai: {
			order: 9,
			threaten: function (player, target) {
				if (target.storage.chongnengqiu.length > 0) {
					const first = target.storage.chongnengqiu[0];
					switch (first[0]) {
						case "shandian":
							return 1.3;
						case "bingshuang":
							return 1.1;
						case "heian":
							return 1.2;
						case "denglizi":
							return 1.15;
					}
				}
				return 1;
			},
			result: {
				player: function (player) {
					return 10;
				},
			},
		},
	},
	kuorong: {
		init: function (player) { 
			player.storage.chongnengqiu_max += 2;
		},
		locked: true,
	},
	huixiangxingtai: {
		mark: true,
		markimage: "extension/群友杀/image/mark/huixiangxingtai.png",
		intro: {
			name: "回响形态",
			content: "其使用的非装备和延迟锦囊牌结算两次",
		},
		forced: true,
		locked: true,
		trigger: {
			player: "useCard",
		},
		filter: function (event, player) { 
			return event.card && ["equip", "delay"].includes(get.type(event.card));
		},
		content: function () { 
			trigger.effectCount++;
		},
		ai: {
			threaten: 1.3,
		},
	},
	juehaihuitao: {
		marktext: "海",
		intro: {
			name: "海洋",
			content: "当前拥有#个【海洋】标记"
		},
		group: ["juehaihuitao_changeHp", "juehaihuitao_damage", "juehaihuitao_enable"],
		subSkill: {
			changeHp: {
				trigger: {
					global: "damageAfter",
				},
				usable: 2,
				prompt2: "你可以摸1张牌并视为对一名其他角色使用一张无视距离且不计入次数的【杀】",
				filter: function (event, player) {
					return event.num > 0;
				},
				async content (event, trigger, player) {
					player.draw();
					player.chooseUseTarget("视为对一名其他角色使用一张无视距离且不计入次数的【杀】", get.autoViewAs({ name: "sha", isCard: true }), "nodistance", false);
				},
				ai: {
					threaten: 1.2, 
				},
			},
			damage: {
				trigger: {
					source: "damageEnd",
				},
				forced: true,
				popup: false,
				filter: function (event, player) {
					return event.num > 0;
				},
				content: function () {
					player.addMark("juehaihuitao", 2, true);
				},
			},
			enable: {
				enable: "phaseUse",
				filter: function (event, player) {
					return player.countMark("juehaihuitao") >= 13;
				},
				async content (event, trigger, player) {
					player.removeMark("juehaihuitao", player.countMark("juehaihuitao"), true);
					const result = await player.chooseTarget("对一名其他角色造成x/2伤害（x为其体力值上限，向下取整，最低为2）", 1, true, function (card, player, target) {
						return target != player;
					}).set("ai", function (target) {
						return get.damageEffect(target, player, player);
					}).forResult();
					if (result.bool) {
						const target = result.targets[0];
						const num = Math.max(Math.floor(target.maxHp / 2), 2);
						target.damage(num);
					}
				},
				ai: {
					order: 10,
					threaten: function (player, target) {
						return player.countMark("juehaihuitao") >= 13 ? 1.5 : 1.2;
					},
					result: {
						player: function (player) {
							return 10;
						},
					},
				},
			},
		},
	},
	haiyaodeshouwang: {
		init: function (player) {
			player.addCharge(1, false);
		},
		chargeSkill: 2,
		group: ["haiyaodeshouwang_global", "haiyaodeshouwang_player"],
		subSkill: { 
			global: {
				trigger: {
					global: "dying",
				},
				forced: true,
				filter: function (event, player) {
					return event.player != player && event.getParent("juehaihuitao_enable", true);
				},
				content: function () {
					player.addCharge(1, true);
				},
			},
			player: {
				trigger: {
					player: "dieBefore",
				},
				forced: true,
				filter: function (event, player) {
					return player.countCharge() > 0;
				},
				content: function () {
					trigger.finish();
					player.removeCharge(1, true);
					player.discard(player.getCards("h"));
					player.recoverTo(player.maxHp);
					player.addMark("juehaihuitao", 10, true);
				},
			},
		},
	},
	weiqingsude: {
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "ice",
		unique: true,
		selectTarget: [0, 3],
		multitarget: true,
		multiline: true,
		filter: function (event, player) {
			return player.countCards("h") >= 2;
		},
		filterTarget: function (card, player, target) {
			return target != player;
		},
		content: function () {
			player.awakenSkill("weiqingsude");
			player.loseHp(2);
			targets.forEach(function (target) {
				target.addMark("weiqingsude_mark", 1, true);
			});
			player.draw(2);
			targets.forEach(function (target) {
				target.draw(2);
			});
		},
		subSkill: {
			mark: {
				marktext: "听",
				intro: {
					name: "倾听",
					nocount: true,
				},
			},
		},
		ai: {
			order: 10,
			threaten: 1.5,
			result: {
				target: function (player, target) {
					return 5;
				},
				player: function (player, target) {
					return 10;
				},
			},
		},
	},
	heyiwei: {
		trigger: {
			player: "damageBegin2",
		},
		filter: function (event, player) {
			return event.num > 0;
		},
		async content (event, trigger, player) {
			const result = await player.judge(function (card) {
				return get.suit(card) == "heart" ? 1 : -1;
			}).forResult();
			if (result.bool) {
				trigger.num = 0;
				player.changeHujia(1, "gain");
			} else {
				event.finish();
			}
		},
	},
	nanyiwangque: {
		trigger: {
			player: "recoverAfter",
		},
		forced: true,
		locked: true,
		filter: function (event, player) {
			return event.num > 0 && !event.getParent("nanyiwangque", true);
		},
		content: function () {
			player.recoverTo(player.maxHp);
		},
		mod: {
			maxHandcard: function (player, num) {
				return 5;
			},
		},
	},
	womenshipengyouduiba: {
		trigger: {
			player: "damageBegin2",
		},
		forced: true,
		locked: true,
		firstDo: true,
		filter: function (event, player) {
			return event.num > 0 && event.source && event.source.hasMark("weiqingsude_mark");
		},
		content: function () {
			trigger.num--;
		},
	},
	zhongfen: {
		trigger: {
			player: "damageEnd",
		},
		forced: true,
		locked: true,
		filter: function (event, player) {
			return event.num > 0 && game.hasPlayer(current => current.hasMark("weiqingsude_mark")) &&
				event.source && !event.source.hasMark("weiqingsude_mark");
		},
		async content (event, trigger, player) {
			const target = trigger.source;
			const players = game.filterPlayer(current => current.hasMark("weiqingsude_mark"));
			players.forEach(async function (current) {
				if (!target.isAlive()) return;
				await current
					.chooseToUse("是否对" + get.translation(target) + "使用一张杀？", {name: "sha"}, target, false)
					.set("addCount", false)
					.set("ai", function (card) {
						return get.effect(target, card, current, current);
					});
			})
		}
	},
	maoliang: {
		init: function (player) { 
			player.storage.maoliang = 0;
		},
		trigger: {
			player: "damageEnd",
		},
		filter: function (event, player) {
			return event.num > 0 && event.source && event.source != player;
		},
		getIndex: function (event, player, triggername) {
			return event.num;
		},
		async content (event, trigger, player) {
			const num = player.storage.maoliang + 1;
			player.storage.maoliang++;
			player.draw(num);
			const target = trigger.source;
			target.draw(num);
			const result = await target.chooseBool("是否令" + get.translation(player) + "回复1体力？").set("ai", function () {
				return get.recoverEffect(player, target, target) > 0;
			}).forResult();
			if (result.bool) player.recover();
		},
		group: ["maoliang_count"],
		subSkill: {
			count: {
				trigger: {
					global: "roundEnd",
				},
				forced: true,
				locked: true,
				charlotte: true,
				filter: function (event, player) {
					return true;
				},
				content: function () { 
					player.storage.maoliang = 0;
				},
			},
		},
	},
	qianxia: {
		trigger: {
			player: "damageBegin4",
		},
		forced: true,
		locked: true,
		lastDo: true,
		filter: function (event, player) {
			return event.num > 1;
		},
		content: function () {
			trigger.num--;
		},
		mod: {
			targetEnabled: function (card, player, target) {
				const info = get.info(card);
				if (info.selectTarget == 1 && get.type(card, "trick") == "trick" && player.name != "sp_jinbihai") {
					return false;
				}
			},
		},
	},
	guaiqiao: {
		trigger: {
			global: "phaseJieshuBegin",
		},
		round: 1,
		filter: function (event, player) { 
			return player.getHistory("sourceDamage").length > 0 || player.getHistory("damage").length > 0;
		},
		async cost (event, trigger, player) {
			event.result = await player.chooseTarget("你可以令一名角色获得一个额外的回合", 1, false).set("ai", function (target) {
				if (get.attitude(player, target) <= 0) return -1;
				return get.threaten(target);
			}).forResult();
		},
		content: function () { 
			event.targets[0].insertPhase();
		},
	},
	kexue: {
		locked: true,
		group: ["kexue_gameStart", "kexue_cancel"],
		subSkill: {
			gameStart: {
				trigger: {
					global: "gameStart",
				},
				forced: true,
				locked: true,
				filter: function (event, player) {
					return game.filterPlayer(current => current != player).length >= 2;
				},
				async content (event, trigger, player) {
					const long = await player.chooseTarget(
						"令一名其他角色获得【龙】标记", 1, true, 
						(card, player, target) => target != player
					).set("ai", (target) => get.attitude(player, target)).forResult();
					long.targets[0].addSkill("kexue_long");
					const feng = await player.chooseTarget(
						"令另一名其他角色获得【凤】标记", 1, true,
						(card, player, target) => target != player && !target.hasSkill("kexue_long")
					).set("ai", (target) => get.attitude(player, target)).forResult();
					feng.targets[0].addSkill("kexue_feng");
				},
			},
			long: {
				mark: true,
				marktext: "龙",
				intro: {
					name: "龙",
					nocount: true,
					content: "该角色造成伤害时的伤害值+1",
				},
				trigger: {
					source: "damageBegin1",
				},
				forced: true,
				locked: true,
				charlotte: true,
				popup: false,
				filter: function (event, player) {
					return true;
				},
				content: function () {
					trigger.num++;
				},
			},
			feng: {
				mark: true,
				marktext: "凤",
				intro: {
					name: "凤",
					nocount: true,
					content: "该角色以任意方式摸牌时的摸牌数+1",
				},
				trigger: {
					player: "drawBegin",
				},
				forced: true,
				locked: true,
				charlotte: true,
				popup: false,
				filter: function (event, player) {
					return true;
				},
				content: function () {
					trigger.num++;
				},
			},
			cancel: {
				trigger: {
					player: "damageBegin4",
				},
				round: 1,
				forced: true,
				locked: true,
				filter: function (event, player) {
					return event.num > 0 && event.source && 
						(event.source.hasSkill("kexue_long") || event.source.hasSkill("kexue_feng"));
				},
				content: function () {
					const num = 2 * trigger.num;
					trigger.cancel();
					ui.clear();
					player.draw(num);
				},
			},
		},
	},
	mianji: {
		group: ["mianji_phaseUse", "mianji_damage"],
		subSkill: {
			phaseUse: {
				enable: "phaseUse",
				usable: 1,
				selectCard: 2,
				position: "he",
				filterCard: function (card) {
					return true;
				},
				filter: function (event, player) {
					return player.countCards("he") >= 2;
				},
				async content(event, trigger, player) {
					const result = await player.chooseTarget(
						"视为对一名其他角色使用一张无花色和点数的【兵临城下】", 1, true,
						(card, player, target) => {
							return target != player && player.canUse({ name: "binglinchengxiax" }, target);
						}
					).set("ai", (target) => get.effect(target, { name: "binglinchengxiax" }, player, player)).forResult();
					if (result.bool) { 
						result.targets[0].addTempSkill("fengyin");
						player.useCard({ name: "binglinchengxiax" }, result.targets[0], false);
					}
				},
				ai: {
					order: 10,
					threaten: 1.3,
					result: {
						target: function (player, target) {
							return get.damageEffect(target, player, player);
						},
						player: function (player, target) {
							return 10;
						},
					},
				},
			},
			damage: {
				trigger: {
					source: "damageEnd",
				},
				forced: true,
				filter: function (event, player) {
					return event.num > 0 && event.card && event.card.name == "sha" &&
						event.getParent("binglinchengxiax", true) && event.getParent("mianji_phaseUse", true);
				},
				content: function () { 
					player.draw();
					player.recover();
				},
			},
		},
	},
	qys_juesi: {
		enable: ["chooseToUse"],
		usable: 1,
		locked: true,
		filterCard: function (card, player, event) {
			return true;
		},
		position: "hes",
		viewAs: function (cards, player) {
			const card = cards[0];
			const name = "kaikou";
			const suit = get.suit(card);
			const number = get.number(card);
			return {name: name, suit: suit, number: number, isCard: true};
		},
		filter: function (event, player) {
			return player.countCards("hes") > 0;
		},
		mod: {
			cardEnabled: function (card, player) {
				if (card.name == "kaikou") {
					return true;
				}
			},
		},
		ai: {
			threaten: 1.3,
		},
		group: ["qys_juesi_init"],
		subSkill: {
			init: {
				trigger: {
					global: "gameStart",
				},
				forced: true,
				locked: true,
				charlotte: true,
				firstDo: true,
				filter: function (event, player) {
					return true;
				},
				content: function () { 
					const targets = game.filterPlayer(function (current) {
						return current != player;
					});
					targets.forEach(function (current) {
						current.addSkill("qys_juesi_targetEnable");
					});
				},
			},
			targetEnable: {
				locked: true,
				charlotte: true,
				mod: {
					targetEnabled: function (card, player, target) {
						if (card.name == "kaikou") {
							return true;
						}
					},
				},
			},
		},
	},
	yi_huanqi: {
		init: function (player) {
			player.setStorage("yi_huanqi", false);
			player.setStorage("yi_huanqi_lose", false);
			lib.characterSubstitute["shen_dajiejie"] = [
				["shen_dajiejie_2", ["img:extension/群友杀/image/character/shen_dajiejie_2.jpg"]],
				["shen_dajiejie_3", ["img:extension/群友杀/image/character/shen_dajiejie_3.jpg"]]
			];
		},
		trigger: {
			player: "phaseBegin",
		},
		forced: true,
		filter: function (event, player) {
			return player.getStorage("yi_huanqi") == false;
		},
		content: async function (event, trigger, player) {
			player.setStorage("yi_huanqi", true);
			player.changeSkin({ characterName: "shen_dajiejie" }, "shen_dajiejie_2");
			player.gainMaxHp(2);
			await Promise.all(
				game.players.filter(current => current != player).map(async current => {
					await current.chooseToGive(player, "h", 1, true).set("ai", (card) => {
						return 6 - get.value(card);
					});
				})
			);
			const card = game.createCard("jueyizhiren", "heart", 13);
			player.$give(card, player, false);
			await player.equip(card);
			await game.delay(2);
		},
		group: ["yi_huanqi_lose1", "yi_huanqi_lose2"],
		subSkill: {
			lose1: {
				trigger: {
					player: "loseAfter",
				},
				forced: true,
				charlotte: true,
				popup: false,
				filter: function (event, player) {
					return event.es && event.es.some(card => card.name == "jueyizhiren") && player.getStorage("yi_huanqi_lose") == false;
				},
				content: function () {
					const card = trigger.cards.filter(card => card.name == "jueyizhiren")[0];
					player.equip(card);
				},
				mod: {
					canBeReplaced: function (card, player) {
						if (card.name == "jueyizhiren" && get.position(card) == "e" && player.getStorage("yi_huanqi_lose") == false) return false;
					},
				},
			},
			lose2: {
				trigger: {
					player: "loseAfter",
				},
				forced: true,
				charlotte: true,
				popup: false,
				filter: function (event, player) {
					return event.es && event.es.some(card => card.name == "wushenzhiren");
				},
				content: function () {
					const card = trigger.cards.filter(card => card.name == "wushenzhiren")[0];
					player.equip(card);
				},
				mod: {
					canBeReplaced: function (card, player) {
						if (card.name == "wushenzhiren" && get.position(card) == "e") return false;
					},
				},
			},
		},
	},
	mi_wushen: {
		trigger: {
			player: "changeHpAfter",
		},
		juexingji: true,
		skillAnimation: true,
		animationColor: "gray",
		forced: true,
		locked: true,
		unique: true,
		filter: function (event, player) {
			return player.hp < 3 && player.countCards("h", "sha") >= 2;
		},
		content: async function (event, trigger, player) {
			player.awakenSkill("mi_wushen");
			player.setStorage("yi_huanqi_lose", true);
			player.changeSkin({ characterName: "shen_dajiejie" }, "shen_dajiejie_3");

			const destory = player.getCards("hes", "jueyizhiren");
			const card = game.createCard("wushenzhiren", "heart", 13);
			player.$give(card, player, false);
			destory.forEach(async card => { 
				await player.lose(card, ui.special);
				await card.selfDestroy(); 
			});
			await player.equip(card);
			await game.delay(2);

			player.recoverTo(player.maxHp);
			const cards = player.getCards("hj").filter(card => get.position(card) == "j" || get.type(card, "trick") != "basic");
			const num = Math.max(cards.length, 2);
			player.discard(cards);
			for (let i = 0; i < num; i++) {
				const sha = { 
					name: "sha",
					nature: i % 2 == 0 ? "fire" : "thunder",
					isCard: true,
				};
				await player.chooseUseTarget(sha, "nodistance", false).set("ai", target => get.effect(target, sha, player, player));
			}
			
			player.addMark("mi_wushen_mark", 5, true);
			player.disableEquip([3, 4]);
			player.addSkill(["zhuwujingtong", "zhan_yixin", "zhan_borenlongdan"]);
		},
		derivation: ["zhuwujingtong", "zhan_yixin", "zhan_borenlongdan"],
		subSkill: {
			mark: {
				marktext: "武",
				intro: {
					name: "武",
				},
			},
		},
	},
	tianshengdewuzhe: {
		trigger: {
			player: "equipBegin",
		},
		forced: true,
		filter: function (event, player) {
			return event.card && ["equip2", "equip5"].includes(get.subtype(event.card));
		},
		content: function () {
			trigger.cancel();
			ui.clear();	
		},
		group: ["tianshengdewuzhe_equip1"],
		subSkill: {
			equip1: {
				trigger: {
					global: "gameStart",
				},
				forced: true,
				popup: false,
				filter: function (event, player) {
					return true;
				},
				content: function () {
					player.expandEquip(1, 1);
				},
			},
		},
	},
	qys_qianxun: {
		trigger: {
			player: "phaseUseEnd",
		},
		persevereSkill: true,
		forced: true,
		filter: function (event, player) {
			return player.getHistory("sourceDamage").length == 0;
		},
		content: function () {
			player.draw(2);
			player.addTempSkill("qys_qianxun_maxHandCard");
		},
		subSkill: {
			maxHandCard: {
				mod: {
					maxHandcard: function (player, num) {
						return num + Math.max(2, player.hp);
					},
				},
			},
		},
	},
	zhuwujingtong: {
		group: ["zhuwujingtong_viewAs", "zhuwujingtong_addMark"],
		subSkill: {
			viewAs: {
				enable: ["chooseToUse", "chooseToRespond"],
				locked: true,
				filterCard: function (card, player, event) {
					return get.type(card) != "basic" && card.name != "wushenzhiren";
				},
				position: "hes",
				viewAs: function (cards, player) {
					const card = cards[0];
					const name = "sha";
					const suit = get.suit(card);
					const number = get.number(card);
					return { name: name, suit: suit, number: number, isCard: true };
				},
				filter: function (event, player) {
					return player.countCards("hes") > 0;
				},
			},
			addMark: {
				trigger: {
					player: ["useCardBegin", "respondBegin"],
				},
				forced: true,
				popup: false,
				filter: function (event, player) {
					return event.card && event.card.name == "sha" && event.skill == "zhuwujingtong_viewAs";
				},
				content: function () {
					player.addMark("mi_wushen_mark", 2, true);
				},
			},
		},
	},
	zhan_yixin: {
		enable: "phaseUse",
		selectTarget: 1,
		filterTarget: function (card, player, target) {
			return target != player && player.canCompare(target);
		},
		filter: function (event, player) {
			return player.countMark("mi_wushen_mark") >= 5 && player.countCards("h") > 0;
		},
		content: async function (event, trigger, player) {
			player.removeMark("mi_wushen_mark", 5, true);
			const target = event.targets[0];
			const result = await player.chooseToCompare(target).forResult();
			if (result.winner == player) target.damage(2);
			else await target.chooseToDiscard("he", 1, true).set("ai", card => 6 - get.value(card));
		},
	},
	zhan_borenlongdan: {
		enable: "phaseUse",
		filter: function (event, player) {
			return player.countMark("mi_wushen_mark") >= 10;
		},
		content: async function (event, trigger, player) {
			player.removeMark("mi_wushen_mark", 10, true);
			const targets = game.filterPlayer(current => current != player).sortBySeat();
			for (const target of targets) {
				const result = await target.judge().forResult();
				result.color == "red" ? await target.damage(2) : await target.chooseToDiscard("he", 2, true).set("ai", card => 6 - get.value(card));
			}
		},
	},
};

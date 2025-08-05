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
					continueBool = await player.chooseBool("是否再次发动【haqi】？")
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
							game.log(player, "的【haqi】判定失败");
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
	"test1": {

	},
	"test2": {

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
						game.log(lib.translate[target.name] + "获得了【mengwu】标记");
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
						game.log(lib.translate[player.name] + "失去了【mengwu】标记");
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
					game.log("【mengwu】取消了此" + get.translation(trigger.card) + "的伤害")
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
				filter: function (event, player) {
					return event.source == player && event.num > 0 &&
						event.card && event.card.name != "sha" && get.tag(event.card, "damage");
				},
				content: function () {
					trigger.num++;
					game.log("【mengwu】增加了此" + get.translation(trigger.card) + "的伤害")
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
				enable: ["chooseToUse", "chooseToRespond"],
				usable: Infinity,
				locked: false,
				filterCard: {
					name: "sha",
				},
				viewAs: function (cards, player) {
					var name = false;
					switch (get.color(cards[0], player)) {
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
				prompt: "将红色【杀】当做【乐不思蜀】使用或打出，黑色【杀】当做【兵粮寸断】使用或打出",
				check: true,
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
		filter: function (event, player) {
			if (get.characterIsOn("huli") == true) return true;
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
					if (typeof stat["sha"] === "number") {
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
				trigger: {
					global: "gameStart",
				},
				forced: true,
				filter: function (event, player) {
					return get.characterIsOn("lianyu") !== -1;
				},
				content: function () {
					player.gainMaxHp();
					player.recover();
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
			await player.gainPlayerCard(event.targets[0], "he", num, false);
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
					extra = "\n已获得【初试】";
				}
				if (player.hasSkill("jianqi")) {
					title = "<span style=\"color: #257fa7;\">灵感之光正在壮大<\span>";
					extra = "\n已获得【初试】\n已获得【渐起】";
				}
				if (player.hasSkill("zhongcheng")) {
					title = "<span style=\"color: orangered;\">灵感之光完善，伟大之作终成！<\span>";
					extra = "\n已获得【初试】\n已获得【渐起】\n已获得【终成】";
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
					player: "phaseZhunbeiBegin",
				},
				forced: true,
				persevereSkill: true,
				charlotte: true,
				filter: function(event, player) {
					return player.countMark("lingguang") >= 33 && !player.hasSkill("chushi");
				},
				content: function() {
					player.addSkill("chushi");
				},
			},
			add2: {
				trigger: {
					player: "phaseZhunbeiBegin",
				},
				forced: true,
				persevereSkill: true,
				charlotte: true,
				filter: function(event, player) {
					return player.countMark("lingguang") >= 66 && !player.hasSkill("jianqi");
				},
				content: function() {
					player.addSkill("jianqi");
				},
			},
			awaken: {
				trigger: {
					player: "phaseZhunbeiBegin",
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
					player.draw(2);
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
				await player.gainPlayerCard(targets[0], "hej", 1, false);
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
				"视为使用一张无点数和花色的基本牌或非延时锦囊牌",
				"对一名其他角色造成1伤害",
				"令所有角色摸1张牌，然后其需交给你1或2张牌"
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
};

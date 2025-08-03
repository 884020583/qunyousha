import { lib, game, ui, get, ai, _status } from '../../noname.js'
export const skill = {
	"可爱": {
		trigger: {
			player: "damageBegin",
		},
		forced: true,
		filter: function (event, player) {
			return event.card &&
				(event.card.name == "sha" || (get.tag(event.card, "damage") && get.type(event.card) == "trick"));
		},
		async content(event, trigger, player) {
			const result = await trigger.source.chooseBool("h", true)
				.set("prompt", "请弃置1张手牌，否则此伤害对" + get.translation(player.name) + "无效")
				.forResultBool();
				if (!result) {
					trigger.cancel();
				} else {
					await trigger.source.chooseToDiscard("h", true).set("ai", function (card) {
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
	"zako的羁绊": {
		group: ["zako的羁绊_subskill1", "zako的羁绊_subskill2"],
		subSkill: {
			"subskill1": {
				trigger: {
					player: "recoverBegin",
				},
				forced: true,
				filter: function (event, player) {
					return event.source.hasSkill("zako的羁绊") && (event.source !== player);
				},
				content: function () {
					trigger.num++;
				},
				sub: true,
				sourceSkill: "zako的羁绊",
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
				sourceSkill: "zako的羁绊",
				"_priority": 0,
			},
		},
		"_priority": 0,
	},
	"哈气！！！": {
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
							player.gain(card, "gain2").gaintag.add("哈气！！！");
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
					player.removeGaintag("哈气！！！");
					return;
				}
			}
		},
		"_priority": 0,
	},
	"测试用技能": {
		enable: "phaseUse",
		usable: Infinity,
		selectTarget: 1,
		filterTarget: function (card, player, target) {
			return true;
		},
		content: function () {
			target.damage();
		},
		"_priority": 0,
	},
	"萌物": {
		group: ["萌物_subskill1", "萌物_subskill2_sha", "萌物_subskill2_trick"],
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
					target.addTempSkill("萌物_damageAdd", {player: "phaseAfter"});
					if (!target.hasMark("萌物_subskill1")) {
						target.setMark("萌物_subskill1", 1, false);
						game.log(lib.translate[target.name] + "获得了【萌物】标记");
					}
				},
				marktext: "萌",
				intro: {
					name: "萌物",
					content: "该角色在其回合内造成的伤害+1，持续1个其的回合",
					nocount: true,
				},
				sub: true,
				sourceSkill: "萌物",
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
					if (player.hasMark("萌物_subskill1")) {
						player.removeMark("萌物_subskill1", 1, false);
						game.log(lib.translate[player.name] + "失去了【萌物】标记");
					}
				},
				sub: true,
				sourceSkill: "萌物",
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
					game.log("【萌物】取消了此" + get.translation(trigger.card) + "的伤害")
				},
				sub: true,
				sourceSkill: "萌物",
				"_priority": 0,
			},
			"subskill2_trick": {
				trigger: {
					global: "damageBegin",
				},
				locked: true,
				filter: function (event, player) {
					return event.source == player && event.num > 0 &&
						event.card && event.card.name != "sha" && get.tag(event.card, "damage");
				},
				content: function () {
					trigger.num++;
					game.log("【萌物】增加了此" + get.translation(trigger.card) + "的伤害")
				},
				sub: true,
				sourceSkill: "萌物",
				"_priority": 0,
			},
		},
		"_priority": 0,
	},
	"你很棒了": {
		group: ["你很棒了_subskill1", "你很棒了_subskill2", "你很棒了_subskill3", "你很棒了_subskill4", "你很棒了_subskill5_mark", "你很棒了_subskill5_content"],
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
				sourceSkill: "你很棒了",
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
				sourceSkill: "你很棒了",
				"_priority": 0,
			},
			"subskill3": {
				enable: ["chooseToUse", "chooseToRespond"],
				locked: true,
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
				sourceSkill: "你很棒了",
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
				sourceSkill: "你很棒了",
				"_priority": 0,
			},
			"subskill5_mark": {
				trigger: {
					player: "useSkillAfter",
				},
				forced: true,
				filter: function (event, player) {
					return event.skill == "萌物_subskill1";
				},
				content: function () {
					var last = game.filterPlayer(function (current) {
						return current.hasMark("你很棒了_subskill5_mark");
					});
					if (last[0]) last[0].removeMark("你很棒了_subskill5_mark");
					var target = trigger.targets[0];
					if (!target.hasMark("你很棒了_subskill5_mark")) target.setMark("你很棒了_subskill5_mark", 1, false);
					game.log(lib.translate[target.name] + "获得了【你很棒了】标记");
				},
				marktext: "棒",
				intro: {
					name: "你很棒了",
					content: function (storage, player) {
						return "该角色为" + get.translation("怜魚") + "的技能【萌物】的上一个目标";
					},
					nocount: true,
				},
				sub: true,
				sourceSkill: "你很棒了",
				"_priority": 0,
			},
			"subskill5_content": {
				trigger: {
					player: "dieBegin",
				},
				forced: true,
				filter: function (event, player) {
					var last = game.filterPlayer(function (current) {
						return current.hasMark("你很棒了_subskill5_mark");
					});
					return last[0];
				},
				content: function () {
					var last = game.filterPlayer(function (current) {
						return current.hasMark("你很棒了_subskill5_mark");
					});
					last[0].gain(player.getCards("h"), "gain2");
					last[0].recover(player.maxHp);
				},
				sub: true,
				sourceSkill: "你很棒了",
				"_priority": 0,
			},
		},
		"_priority": 0,
	},
	"加油！": {
		trigger: {
			player: "phaseDrawBegin",
		},
		forced: true,
		filter: function (event, player) {
			if (get.characterIsOn("狐黎") == true) return true;
			return false;
		},
		content: function () {
			trigger.num++;
		},
		"_priority": 0,
	},
	"狐封": {
		enable: "phaseUse",
		usable: Infinity,
		selectTarget: 1,
		filterTarget: function (card, player, target) {
			return target != player && !target.hasMark("狐封");
		},
		content: function () {
			player.loseHp(2);
			game.log(lib.translate[target.name] + "获得了【狐封】标记");
			target.setMark("狐封", 1, false);
			target.addTempSkill(["baiban", "狐封_subskill_removeMark"], "phaseAfter");
			// player.addTempSkill("狐封_subskill_sha", "phaseAfter");
		},
		marktext: "封",
		intro: {
			name: "狐封",
			content: function (storage, player) {
				return "该角色在本回合内所有技能失效，且" + get.translation("狐黎") + "对其使用【杀】无次数限制";
			},
			nocount: true,
		},
		group: ["狐封_subskill_sha"],
		subSkill: {
			"subskill_removeMark": {
				charlotte: true,
				onremove: function (player) {
					game.log(lib.translate[player.name] + "失去了【狐封】标记");
					player.removeMark("狐封", 1, false);
				},
			},
			"subskill_sha": {
				trigger: {
					player: "useCard",
				},
				forced: true,
				charlotte: true,
				filter: function (event, player) {
					return event.card.name == "sha" && event.targets[0].hasMark("狐封");
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
	"登仙": {
		group: ["登仙_draw", "登仙_recover"],
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
	"你真的很棒": {
		group: ["你真的很棒_ison", "你真的很棒_die"],
		subSkill: {
			ison: {
				trigger: {
					global: "gameStart",
				},
				forced: true,
				filter: function (event, player) {
					return get.characterIsOn("怜魚") !== -1;
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
					return event.player.name == "怜魚";
				},
				content: function () {
					player.loseMaxHp(2);
					if (player.hp < player.maxHp) player.recover(player.maxHp - player.hp);
					player.draw(3);
					player.addSkill("你真的很棒_sha");
					player.setMark("你真的很棒_sha", 1, false);
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
};

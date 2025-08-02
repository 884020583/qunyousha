game.import("extension", function (lib, game, ui, get, ai, _status) {
	return {name: "群友杀", content:function(config, pack) {
			/**
			 * 查询某个角色当前是否在场上是否存活，Character为角色名，注意是translate之后的而非直接用的name
			 * 返回值：true在场上且存活; false在场上且阵亡; -1不在场上
			 * 例如：get.characterIsOn("狐黎")
			 * @param Character
			 * @returns any
			 */
			get.characterIsOn = function (Character) {
				var player = game.filterPlayer(function (current) {
					return lib.translate[current.name] == lib.translate[Character];
				});
				if (player[0]) return player[0].isAlive();
				else return -1;
			}

			if (config.qunyousha) {
				for (var i in lib.characterPack['qunyousha']) {
					if (lib.character[i][4].indexOf("forbidai") < 0) lib.character[i][4].push("forbidai");
				};
			};
		}, precontent:function(qunyousha) {
			if (qunyousha.enable) {
				game.import('character', function() {
					var qunyousha = {
						name: 'qunyousha',
						connect: true,
						character: {
							"KK酱": ["male","qunyou","4/4/0",["可爱","zako的羁绊","哈气！！！"],[]],
							"测试用角色": ["double","qunyou","5/10/5",["zako的羁绊","测试用技能"],[]],
							"怜魚": ["male","歪经派","3/3/0",["萌物","你很棒了","加油！"],[]],
							"狐黎": ["male", "歪经派", "5/5/0",["狐封","登仙","你真的很棒"],[]],
						},
						characterIntro: {
							"KK酱": "一只可爱的KK猫哦~",
							"测试用角色": "一个测试用角色",
							"怜魚": "可以摸摸尾巴的小教主",
							"狐黎": "护食的狐仙狐黎",
						},
						characterTitle: {},
						skill: {
							"可爱": {
								mod: {
									maxHandcard: function (player, num) {
										return num + 2;
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
									player: "phaseDrawBegin",
								},
								async content(event, trigger, player) {
									trigger.num = 0;
									event.cards = [];

									var continueBool = true;
									while (continueBool) {
										var judgeMent = player.judge(function (card) {
											if (get.number(card) >= 2 && get.number(card) <= 10) return 1.5;
											return -1.5;
										});

										if (!player.hasSkillTag("rejudge")) {
											judgeMent.set("callback", function () {
												if (event.judgeResult.number >= 2 && event.judgeResult.number <= 10 && get.position(card, true) == "o") {
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

											var X = event.cards.length;
											let damage_num = Math.ceil(X / 3);
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
											player: "loseAfter",
										},
										forced: true,
										filter: function (event, player) {
											if (_status.currentPhase == player) return false;
											if (player.hp >= player.maxHp) return false;
											return true;
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
						},
						translate: {
							"qunyou": "群友",
							"歪经派": "歪经派",

							"KK酱": "KK酱",
							"测试用角色": "测试用角色",
							"怜魚": "怜魚",
							"狐黎": "狐黎",

							"可爱": "可爱",
							"可爱_info": "锁定技 你的手牌上限+2",
							"zako的羁绊": "zako的羁绊",
							"zako的羁绊_info": "锁定技 你因其他拥有此技能的角色回复体力时，回复的体力值+1；当你进入濒死状态时，若其救助了你，其摸1张牌",
							"哈气！！！": "哈气！！！",
							"哈气！！！_info": "摸牌阶段前，你可以放弃摸牌，然后进行一次判定：若点数为2~10，则你获得此判定牌，然后你可以继续进行判定直到失败为止；否则将弃置本回合通过此方式获得的所有牌，然后选择1名其他角色，对其造成X/3伤害（其中X为弃置的牌数。最小为1最大为3，向上取整）",
							"测试用技能": "测试用技能",
							"测试用技能_info": "",
							"萌物": "萌物",
							"萌物_info": "① 每回合限一次，出牌阶段，你可以将你的1张手牌交给任意一名其他角色，令其回复1体力，其的下个回合内其造成的伤害+1。② 锁定技 当你使用【杀】造成伤害时，取消之。当你使用伤害类锦囊牌造成伤害时，你可以令此伤害+1",
							"你很棒了": "你很棒了",
							"你很棒了_info": "锁定技 你无法成为【杀】和【兵粮寸断】的目标。当你在你的回合外以任意方式失去手牌或装备区里的牌时，你回复1体力。你的红色【杀】可以当做【乐不思蜀】使用或打出，你的黑色【杀】可以当做【兵粮寸断】使用或打出。当场上有角色阵亡时，你摸1张牌。当你阵亡时，最后一名成为你【萌物】目标的角色获得你的所有手牌，并回复x体力（x为你的体力上限）",
							"加油！": "加油！",
							"加油！_info": "锁定技 当狐黎在场上且存活时，你摸牌阶段的摸牌数+1",
							"狐封": "狐封",
							"狐封_info": "出牌阶段，你可以失去2体力，选择一名其他角色，令其获得【封】标记持续到该回合结束。持有【封】标记的角色所有技能暂时失效，且你对其使用【杀】的不计入次数限制",
							"登仙": "登仙",
							"登仙_info": "每当你受到1伤害，你可以摸1张牌。当你使用【杀】造成伤害时，你可以回复1体力",
							"你真的很棒": "你真的很棒",
							"你真的很棒_info": "锁定技 当怜魚在场上时，你的体力值上限+1。当怜魚阵亡时，你的体力值上限-2，将你的体力回复至体力值上限，你摸3张牌，之后你使用的【杀】需要2张【闪】才能抵消",
						},
						perfectPair: {},
					};
					//由于以此法加入的武将包武将图片是用源文件的，所以要用此法改变路径
					if (lib.device || lib.node) {
						for (var i in qunyousha.character) {
							qunyousha.character[i][4].push('ext:群友杀/' + i + '.jpg');
						}
					} else {
						for (var i in qunyousha.character) {
							qunyousha.character[i][4].push('db:extension-群友杀:' + i + '.jpg');
						}
					}
					return qunyousha;
				});
				lib.config.all.characters.push('qunyousha');
				if (!lib.config.characters.contains('qunyousha')) lib.config.characters.push('qunyousha');
				lib.translate['qunyousha_character_config'] = '群友杀';
				game.import('card', function() {
					var qunyousha = {
						name: 'qunyousha',
						connect: true,
						card: {
							// '卡名': {
							// 	image: 'ext:群友杀/卡名.jpg',  //卡牌图片
							//  //以下与一般卡牌一样
							// }, //卡格式
						},
						skill: {},
						translate: {},
						list: [], // 牌堆添加
					};
					return qunyousha;
				});
				lib.translate['qunyousha_card_config'] = '群友杀';
				lib.config.all.cards.push('qunyousha');
				if (!lib.config.cards.contains('qunyousha')) lib.config.cards.push('qunyousha');
			};
		}, config: {
			"qunyousha": {
				"name": "将群友杀内武将设为禁用",
				"init": false,
			},
		}, help: {

		}, package: {
			character: {
				character: {},
				translate: {},
			},
			card: {
				card: {},
				translate: {},
				list: [],
			},
			skill: {
				skill: {},
				translate: {},
			},
			intro: "灵光一现和超绝行动力的产物",
			author: "云笺",
			diskURL: "无",
			forumURL: "QQ",
			version: "0.1",
		}, files: {
			"character": [],
			"card": [],
			"skill": [],
		}
	}
})

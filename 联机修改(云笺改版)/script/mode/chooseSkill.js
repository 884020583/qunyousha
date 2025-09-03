import { game, ui, _status, ai, lib, get } from "../../../../noname.js";
import { suiSet } from "../../suiSet.js";
export function initBegin() {
	_status.killNum = [0];
	_status.huanhundan = 0;
	game.broadcastAll(() => {
		const skills = {
			sw_getSkill: {
				locked: true,
				forced: true,
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
					player.addMark("sw_getSkill", 6);
					player.storage.sw_getSkillName = [];
					player.storage.sw_getSkillMaxcnt = 3;
					player.updateMarks();
				},
				content: function () {
					"step 0";
					player.addMark("sw_getSkill", trigger.num);
					if (player.countMark("sw_getSkill") >= 4) {
						event.goto(1);
					}
					else event.finish();
					"step 1";
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
							if (j.indexOf("sw_") == 0 || j.indexOf("qd_") == 0) continue;
							var skill = lib.skill[j];
							if (!skill || skill.zhuSkill) continue;
							if (skill.ai && (skill.ai.combo || skill.ai.notemp || skill.ai.neg)) continue;
							var info = get.translation(j + "_info");
							skills.add(j);
						}
					}
					list = skills
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
					var skills = player.storage.sw_getSkillName;
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
				},
				mark: true,
				marktext: "灵",
				intro: {
					name: "灵气",
					content: function (storage, player) {
						return `灵气值：` + player.countMark("sw_getSkill") + `<br><li>每当你造成或受到伤害时，你获得等同于伤害量的灵气值，若此时当灵气值大于等于4，你令系统随机检索五个技能，你选择其一获得之并失去四点灵气。<br><li>你通过此法获得的技能数：` + player.storage.sw_getSkillName.length + "/" + player.storage.sw_getSkillMaxcnt;
					},
				},
			},
			sw_bossGetSkill: {
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
							if (j.indexOf("sw_") == 0 || j.indexOf("qd_") == 0) continue;
							var skill = lib.skill[j];
							if (!skill || skill.zhuSkill) continue;
							if (skill.ai && (skill.ai.combo || skill.ai.notemp || skill.ai.neg)) continue;
							var info = get.translation(j + "_info");
							skills.add(j);
						}
					}
					list = skills
						.filter(function (i) {
							return !player.hasSkill(i, null, null, false);
						})
						.randomGets((_status.killNum[0] + 2) / 2);
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
							if (j.indexOf("sw_") == 0 || j.indexOf("qd_") == 0) continue;
							var skill = lib.skill[j];
							if (!skill || skill.zhuSkill) continue;
							if (skill.ai && (skill.ai.combo || skill.ai.notemp || skill.ai.neg)) continue;
							var info = get.translation(j + "_info");
							skills.add(j);
						}
					}
					list = skills
						.filter(function (i) {
							return !player.hasSkill(i, null, null, false);
						})
						.randomGets(1);
					player.addSkills(list);
				},
			},
			sw_xionge: {
				charlotte: true,
				forced: true,
				silent: true,
				trigger: { player: "phaseDrawBegin2" },
				content: function () {
					trigger.num += Math.floor(_status.killNum[0] / 2);
				},
				mod: {
					cardUsable: function (card, player, num) {
						if (card.name == "sha") return num + Math.floor(_status.killNum[0] / 3);
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
			sw_viewTeamHandcard: {
				charlotte: true,
				forced: true,
				silent: true,
				locked: true,
				ai: {
					viewHandcard: true,
					skillTagFilter(player, tag, arg) {
						if (player == arg || arg == game.zhu) return false;
					},
				},
			}
		}
		const translates = {
			fan: '<span style="color:#faecd1;data-nature="orangemm;">联军</span>',
			fan2: '嗝屁',
			sw_getSkill: '灵韵',
			sw_getHuihe: '额外',
			sw_bossGetSkill: '圣战',
			sw_bossGetSkill2: '狂暴',
			sw_xionge: '凶恶',
			sw_bossGetSkill_info: '锁定技。你的首个回合开始时，你获得等同于BOSS击杀次数/2个随机技能（至少为1），然后失去此技能。',
			sw_bossGetSkill2_info: '锁定技。你的每个回合开始时，你获得1个随机技能。',
		}
		Object.assign(lib.skill, skills);
		Object.assign(lib.translate, translates);

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
		for (const key in mode) {
			if (key in lib) {
				lib[key] = Object.assign(lib[key], mode[key])
			}
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

		//game.addFellow = function(position, character, animation) {
		//	game.addVideo("addFellow", null, [position, character, animation]);
		//	const player = ui.create.player(ui.arena).addTempClass(animation || "start");
		//	player.dataset.position = position || game.players.length + game.dead.length;
		//	player.getId();
		//	if (character) player.init(character);
		//	game.players.push(player);
		//	game.arrangePlayers();
		//	return player;
		//}

	});
	lib.element.player.dieAfter = function (source) {
		if (this === game.zhu) {
			//if (game.zhu !== game.me) {
			//	game.over(true)
			//} else {
			//	game.over(false)
			//}
			//_status.jieduan = _status.jieduan + 1;

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

				_status.killNum[0]++;
				game.broadcastAll((mm) => {
					game.createTip("BOSS 已被击杀！击杀次数：" + mm);
				}, _status.killNum[0])
				event.targets = game.filterPlayer().sortBySeat(game.zhu || player);
				"step 1";
				var target = targets.shift();
				event.target = target;
				var list = ["回复1点体力并摸一张牌", "摸三张牌", "将一张防具牌置入装备区并摸一张牌", "将一张武器牌置入装备区并摸一张牌", "回复2点体力并弃置一张牌", "摸五张牌，然后弃置三张牌", "获得两张锦囊牌", "获得五张基本牌", "失去1点体力，然后摸五张牌", "失去体力至1点，然后摸七张牌", "获得三点“灵气”", "获得五点“灵气”", "获得两点护甲", "可获得的技能上限+1，弃置三张牌", "可获得的技能上限+1，失去1点体力", "获得还魂丹一个"].randomGets(3);
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
				else if (str == "获得两点护甲") {
					target.changeHujia(2);
				}
				else if (str == "可获得的技能上限+1，失去1点体力") {
					target.storage.sw_getSkillMaxcnt++;
					target.loseHp();
				}
				else if (str == "可获得的技能上限+1，弃置三张牌") {
					target.storage.sw_getSkillMaxcnt++;
					target.chooseToDiscard(3, "he", true);
				}
				else if (str == "获得还魂丹一个") {
					_status.huanhundan++;
					game.log(`还魂丹当前剩余量：${_status.huanhundan}`);
				}
				else target.draw(1);
				"step 3";
				if (event.targets.length) event.goto(1);
				"step 4";
				var ll = _status.characterListSelect.randomGets(1);
				game.broadcastAll((list, p) => {
					p.revive(null, false);
					p.uninit();
					p.init(list[0]);
					p.update();
				}, ll, game.zhu)


				game.zhu.addSkill("sw_bossGetSkill");//圣战技能
				game.zhu.addSkill("sw_getHuihe");
				if (_status.killNum[0] > 5) game.zhu.addSkill("sw_bossGetSkill2");//狂暴技能
				game.zhu.addSkill("sw_xionge");

			},);


			game.zhu.lose(game.zhu.getCards("hej"))._triggered = null;
			game.zhu.gain(get.cards(4 + Math.min(_status.killNum[0], 8)))._triggered = null;
			game.zhu.gainMaxHp(Math.min(Math.floor(_status.killNum[0] / 2), 5));
			game.zhu.recover(Math.min(Math.floor(_status.killNum[0] / 2), 5));

			game.triggerEnter(game.zhu);

			game.zhu.insertPhase();

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
				if (_status.huanhundan > 0) {
					for (var i = 0; i < dead.length && _status.huanhundan > 0; i++) {
						if (dead[i] != game.zhu && !dead[i].side && dead[i].maxHp > 0) {
							event.targets.push(dead[i]);
							_status.huanhundan--;
						}
					}
				}
				"step 2";
				if (event.targets.length) {
					var target = event.targets.shift();
					game.createTip(`【${target.nickname || "电脑玩家"}】已被还魂丹复活！`);

					game.broadcastAll((p) => {
						p.revive(Math.min(2, target.maxHp));
						p.update();
					}, target)

					target.draw(2, false);
					target.$draw(2);

					event.redo();
					event.dealy = true;
				}
				"step 3";
				if (event.dealy) {
					game.delay();
				}
			});



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
		}
		return
	}
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
	}
	game.cardsGotoPile(cards, () => {
		return ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)];
	});



    game.broadcast((vcardx) => { ui.create.buttonPresets.vcardx = vcardx }, suiSet.vcardx)
    //这个东西挺重要的，需要它来制作选择的卡牌

    const characterList = Object.keys(suiSet.initList(() => { }));
    //初始化一下武将

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
    game.broadcastAll((list) => {
        //const style = document.createElement('style')
        //style.innerHTML = innerHTML
        //document.head.appendChild(style)
        game.players.forEach((p, i) => {
            //p.node.rightskillList = ui.create.div('.playerskillList', p)
            if (!p.nickname) {//||(p.ws&&!p.isOnline2())
                lib.character[list[i]][3] = []
                lib.character[list[i]][2] = 4
                p.init(list[i])
            }
        })
        game.me.update()
    }, characterList.randomGets(10))
    //发送一个样式，就是技能的显示，这里看一下就好了

    _status.characterlist = characterList.slice()//这样就完成了
}
export function initPlayers() {
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
    //筛选掉人机

    game.broadcastAll((players) => {
        players = players.map(p => [lib.playerOL[p[0]], p[1], p[2]])
        ui.arena.classList.add('choose-character');
        players.forEach(([player, avatar, name]) => {
            name = name.replace('※', '')
            const id = name + player.playerid
            let { 0: sex, 1: group, 2: hp, 3: skills, 4: fromTrash, 5: extraModeData } = lib.character[avatar]
            if (!fromTrash) fromTrash = [`character:${avatar}`]
            else fromTrash.push(`character:${avatar}`)
            lib.character[id] = new lib.element.Character([sex, group, 4, [], fromTrash, extraModeData])
            lib.translate[id] = name
            player.init(id)
            player.update()
        })
    }, initPlayers)
	//然后初始化一下玩家们


	const anothplayers = game.players.filter(p => p != game.zhu)//非主的所有玩家

	for (var i of anothplayers) {
		i.addSkill("sw_getSkill");
		i.addSkill("sw_viewTeamHandcard");
		//i.addSkill("sw_getSkillLimit");//限制技能的获取
	}


    suiSet.setPlayersSeat(game.zhu)
    //设置一下位置
}
function initSkill(num) {
    const skillList = []
    const map = {}
    lib.skillReplace = {}
    _status.skillMap = {}
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
    //通过武将获取技能

    game.broadcast((translates) => {
        lib.skillReplace = translates
    }, lib.skillReplace)
    //一些同名的技能应该是支持切换的才对，把它发送给其他玩家

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
    //这里就是生成技能选择的那种“卡牌”就是武将原画然后旁边写着它的技能

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
    //这边就是给玩家随机分配一些技能供他们选择
    return map
}
export async function chooseSkill() {
    const num = 20//框个数，固定20
    const selectNum = 3//选择个数
    const map = initSkill(num)
    const list = [];
    for (let i = 0; i < game.players.length; i++) {
        const player = game.players[i]
        const skillList = Object.keys(map[player.playerid])
        list.push([player, ['选择技能', [skillList, 'vcardx']], selectNum, true]);
    }
    const { result } = await game.me.chooseButtonOL(list);
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
}
export async function chooseAvatar() {
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
    const { result } = await game.me.chooseButtonOL(avatarList, (player, result) => {
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

            let { 0: sex, 1: group, 2: hp, 4: fromTrash, 5: extraModeData } = lib.character[avatar]
            if (!fromTrash) fromTrash = [`character:${avatar}`]
            else fromTrash.push(`character:${avatar}`)
            lib.character[id] = new lib.element.Character([sex, group, hp, skills, fromTrash, extraModeData])
            lib.translate[id] = nickname
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
}
export async function chooseGroup() {
    const select = lib.group.map(g => ['', '', `group_${g}`])
    const groupList = game.players.map(i => {
        return [i, ['你可以选择一个势力', [select, 'vcard']], 1, false]
    })
    const { result } = await game.me.chooseButtonOL(groupList, (player, result) => {
        if (!result.links) return
        if (player === game.me) {
            player.changeGroup(result.links[0][2].slice(6), false, false);
        }
    }).set('processAI', function () {
        return false
    })
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
}
export function addCharacterUse() {
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
    game.addGlobalSkill('playerchangeSkill')
}
// export const chooseSkills = new Promise(resolve => {
//     const next = game.createEvent('chooseSkills')
//     next.setContent(async event => {
//         initBegin()//先初始化一些必要的东西
//         initPlayers()//然后把玩家初始化一下
//         await chooseSkill()//接着选技能
//         await chooseAvatar()//接着选形象
//         await chooseGroup()//势力
//         addCharacterUse()//这个就是给观战的一些资源吧，可以这么说
//     })
//     next.then(resolve)
// })


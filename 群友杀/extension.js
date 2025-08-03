game.import("extension", function (lib, game, ui, get, ai, _status) {
	// 导入角色数据及其技能
	const importCharacterData = () => import("./character.js");
	const importCharacterSkill = () => import("./characterSkill.js");
	return {
		name: "群友杀",
		content:function(config, pack) {
			if (config.qunyousha) {
				for (var i in lib.characterPack['qunyousha']) {
					if (lib.character[i][4].indexOf("forbidai") < 0) lib.character[i][4].push("forbidai");
				};
			};
		}, precontent: async function(qunyousha) {
			const addImport = function(url) {
				return new Promise((resolve, reject) => {
					const script = document.createElement('script');
					script.type = 'module';
					script.src = lib.assetURL + url;
					script.onload = () => {
						console.log(`已加载: ${url}`);
						resolve();
					};
					script.onerror = (err) => {
						console.error(`加载失败: ${url}`, err);
						reject(err);
					};
					document.head.appendChild(script);
				});
			};
			const useGlobal = [
				"helpFunction",
			];
			const initScript = async () => {
				try {
					await Promise.all(
						useGlobal.map(m =>
							addImport(`extension/群友杀/global/${m}.js`)
						)
					);
					console.log("全局JS加载完成");
					return true;
				} catch (error) {
					console.error("全局JS加载失败:", error);
					return false;
				}
			};
			const globalLoaded = await initScript();
			if (!globalLoaded) {
				console.error("全局JS加载失败，部分功能不可用");
			}

			if (qunyousha.enable) {
				const characterData = await importCharacterData();
				const characterSkill = await importCharacterSkill();
				game.import('character', function() {
					var qunyousha = {
						name: 'qunyousha',
						connect: true,
						character: characterData.character,
						characterIntro: characterData.intro,
						characterTitle: characterData.title,
						skill: characterSkill.skill,
						translate: {
							"qunyou": "群友",
							"zako派": "zako派",
							"歪经派": "歪经派",

							"KK酱": "KK酱",
							"测试用角色": "测试用角色",
							"怜魚": "怜魚",
							"狐黎": "狐黎",

							"可爱": "可爱",
							"可爱_info": "锁定技 你的手牌上限+x（x为你的体力值）。当你受到【杀】或伤害性锦囊牌的伤害时，伤害来源需弃置1张手牌，否则取消之",
							"zako的羁绊": "zako的羁绊",
							"zako的羁绊_info": "锁定技 你因其他拥有此技能的角色回复体力时，回复的体力值+1；当你进入濒死状态时，若其救助了你，其摸1张牌",
							"哈气！！！": "哈气！！！",
							"哈气！！！_info": "准备阶段开始时，你可以跳过摸牌阶段，然后进行一次判定：若颜色为黑色，则你获得此判定牌，然后你可以继续进行判定直到失败为止；否则将弃置本回合通过此方式获得的所有牌，然后选择1名其他角色，对其造成x/2伤害（其中x为弃置的牌数。最小为1最大为3，向上取整），随后摸1张牌",
							"测试用技能": "测试用技能",
							"测试用技能_info": "1点直伤",
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
			intro: "灵光一闪和超绝行动力的产物(云师傅工作量好大啊，来个人救救云师傅吧喵)",
			author: "云笺",
			netdisk: "无",
			forum: "QQ群",
			version: "1.0",
		}, files: {
			"character": [],
			"card": [],
			"skill": [],
		}
	}
})

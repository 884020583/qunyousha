game.import("extension", function (lib, game, ui, get, ai, _status) {
	// 导入外部文件数据
	const importCharacterData = () => import("./characterData.js");
	const importCharacterSkill = () => import("./characterSkill.js");
	const importTranslation = () => import("./translation.js");
	const importCards = () => import("./cards.js");

	return {
		name: "群友杀",
		content:function(config, pack) {
			if (config.qunyousha) {
				for (var i in lib.characterPack['qunyousha']) {
					if (lib.character[i][4].indexOf("forbidai") < 0) lib.character[i][4].push("forbidai");
				}
			}
		}, precontent: async function(qunyousha) {
			// 加载global文件夹内的js文件
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
				const translation = await importTranslation();
				const cards = await importCards();

				// 添加自定义势力
				for (const groupId in characterData.groups) {
					const group = characterData.groups[groupId];
					game.addGroup(groupId, group.short, group.name, { color: group.color, image: group.image });
				}

				game.import('character', function() {
					var qunyousha = {
						name: 'qunyousha',
						connect: true,
						skill: characterSkill.skill,
						character: characterData.character,
						characterIntro: characterData.intro,
						translate: {
							...translation.character,
							...translation.characterSkill,
						},
						perfectPair: {},
					};
					// 添加图片
					for (const id in qunyousha.character) {
						qunyousha.character[id].img = "extension/群友杀/image/character/" + get.translation(id) + ".jpg";
					}
					return qunyousha;
				});
				lib.config.all.characters.push('qunyousha');
				if (!lib.config.characters.includes('qunyousha')) lib.config.characters.push('qunyousha');
				lib.translate['qunyousha_character_config'] = '群友杀';

				game.import('card', function() {
					var qunyousha = {
						name: 'qunyousha',
						connect: true,
						card: cards.card,
						skill: cards.skill,
						translate: {
							...translation.card,
							...translation.cardSkill,
						},
						list: cards.addList, // 牌堆添加
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
			netdisk: "https://github.com/884020583/qunyousha/tree/main",
			forum: "https://qm.qq.com/q/DKBfxgqP4G",
			version: "1.1.2",
		}, files: {
			"character": [],
			"card": [],
			"skill": [],
		}
	}
})
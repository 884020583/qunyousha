if (!localStorage.getItem('tip')) {
	alert('边学边做的，有问题请反馈给咱或者羽秋酱');
	localStorage.setItem('tip', 'true');
};

extension["群友杀"] = {
	date: "2025/09/02",
	intro: "灵光一闪和超绝行动力的产物(云师傅工作量好大啊，来个人救救云师傅吧喵)",
	author: "云笺",
	netdisk: "https://github.com/884020583/qunyousha/tree/main",
	forum: "https://qm.qq.com/q/DKBfxgqP4G",
	version: "1.2.0",
	files: ["extension.js", "characterData.js", "characterSkill.js", "translation.js", "cards.js", "package.js", "info.json", "LICENSE",

		"global/helpFunction.js",

		"image/groups/qunyou.png", "image/groups/zako.png", "image/groups/waijing.png", "image/groups/feisheng.png", "image/groups/shigan.png", "image/groups/aoye.png",

		"image/card/fangbaodun.png", "image/card/woyaokanninvzhuang.png", "image/card/kaikou.png",

		"image/character/testcharacter.jpg", "image/character/KK_jiang.jpg", "image/character/huli.jpg", "image/character/lianyu.jpg", "image/character/Censored.jpg",
		"image/character/yunjian.jpg", "image/character/Hina.jpg", "image/character/ailisi.jpg", "image/character/kaiyi.jpg", "image/character/chengzi.jpg",
		"image/character/shijiu.jpg", "image/character/aili.jpg", "image/character/lvren.jpg", "image/character/zhizimeng.jpg", "image/character/dajiejie.jpg",
		"image/character/manbu.jpg", "image/character/yuchuanluo.jpg", "image/character/kongmeng.jpg", "image/character/xiaoxiao.jpg", "image/character/sb_dajiejie.jpg",
		"image/character/zuolaobai.jpg", "image/character/jinbihai.jpg", "image/character/sb_zuolaobai.jpg", "image/character/yuqiu.jpg", "image/character/sb_yunjian.jpg",
		"image/character/shen_lvren.jpg", "image/character/re_KK_jiang.jpg", "image/character/lifu_Hina.jpg", "image/character/luoming.jpg", "image/character/shen_mojiexianjun_zuolaobai.jpg",

	],
	size: "<30MB"
};

extension["联机修改"] = {
	date: "2025/09/02",
	intro: "版本：1.678",
	author: "岁儿",
	netdisk: "",
	forum: "",
	version: "1.0",
	files: [
		"extension.js", "package.js", "info.json", "LICENSE",

		"image/border.png", "script/mode/doudizhu.js", "script/mode/identity.js", "script/mode/step.js", "script/mode/versus.js",

		"script/mode/chooseSkill.js", "script/bandList.js", "script/bandom.js", "script/cards.js", "script/characters.js", "script/chooseCharacterOL.js",
		"script/connect.js", "script/content.js", "script/function.js", "script/globalSkills.js", "script/hdwj.js", "script/initBandList.js",
		"script/miniandWeChat.js", "script/player.js", "script/precontent.js", "script/private.js", "script/replacePlayer.js", "script/skillSet.js",
		"script/tempSkills.js", "script/video.js",

		"style/ban.css", "style/cards.css",
	],
	size: "<10MB"
};
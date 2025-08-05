if (!localStorage.getItem('tip')) {
	alert('边学边做的，有问题请反馈给咱或者羽秋酱');
	localStorage.setItem('tip', 'true');
};

extension["群友杀"] = {
	date: "2025/08/06",
	intro: "灵光一闪和超绝行动力的产物(云师傅工作量好大啊，来个人救救云师傅吧喵)",
	author: "云笺",
	netdisk: "https://qm.qq.com/q/DKBfxgqP4G",
	forum: "https://qm.qq.com/q/DKBfxgqP4G",
	version: "1.0.1",
	files: ["extension.js", "character.js", "characterSkill.js", "info.json", "LICENSE", "README.md",

		"global/helpFunction.js",

		"KK酱.jpg", "package.js", "测试用角色.jpg", "狐黎.jpg", "怜魚.jpg", "Censored.jpg", "云笺.jpg",
	],
	size: "<10MB"
};

export const groups = {
	qunyou: {
		short: "群友",
		name: "群友",
		color: "#FFD700",
		image: "./extension/群友杀/image/groups/qunyou.jpg"
	},
	zako: {
		short: "zako派",
		name: "zako派",
		color: "#87CEEB"
	},
	waijing: {
		short: "歪经派",
		name: "歪经派",
		color: "#32CD32"
	},
	feisheng: {
		short: "飞升派",
		name: "飞升派",
		color: "#BA55D3"
	},
	shigan: {
		short: "实干派",
		name: "实干派",
		color: "#FF4500"
	},
	aoye: {
		short: "熬夜派",
		trannameslation: "熬夜派",
		color: "#2F4F4F"
	}
};

export const intro = {
	"testcharacter": "一个测试用角色",
	"KK_jiang": "一只可爱的KK猫哦~",
	"lianyu": "可以摸摸尾巴的小教主",
	"huli": "护食的狐仙狐黎",
	"Censored": "哦我的天哪，这[Censored]的可太[Censored]了，这[Censored]绝对是我见过最[Censored]的东西！不！知！所！措！",
	"yunjian": "慕璃的笨猫猫",
	"ailisi": "爱打游戏的爱丽丝酱~",
	"kaiyi": "吾之存在，为践行王女意志而生",
	"chengzi": "为什么是橙子，因为诚子爱吃橙子，三角洲大肘子！",
	"shijiu": "乌鲁鲁人柱力！",
	"aili": "不正经的粉毛爱莉",
	"lvren": "背上了行囊~行之无悔的旅人",
	"zhizimeng": "man~肘击王牢梦是也",
};

export const character = {
	testcharacter: {
		sex: "double",
		group: "qunyou",
		hp: 5,
		maxHp: 10,
		hujia: 5,
		isAiForbidden: true,
		skills: ["test1", "test2"],
	},
	KK_jiang: {
		sex: "male",
		group: "zako",
		hp: 4,
		dualSideCharacter: "testcharacter",
		skills: ["keai", "zako_dejiban", "haqi"],
	},
	lianyu: {
		sex: "male",
		group: "waijing",
		hp: 3,
		skills: ["mengwu", "nihenbangle", "jiayou"],
	},
	huli: {
		sex: "male",
		group: "waijing",
		hp: 5,
		skills: ["hufeng", "dengxian", "nizhendehenbang"],
	},
	Censored: {
		sex: "none",
		group: "feisheng",
		hp: 4,
		skills: ["Restrict", "Permissions", "Root"],
	},
	yunjian: {
		sex: "male",
		group: "shigan",
		hp: 3,
		isZhugong: true,
		skills: ["lingguang", "gousi", "gongmian"],
	},
	Hina: {
		sex: "female",
		group: "aoye",
		hp: 3,
		skills: ["zhongmu", "fancha", "guangzhiyongzhe_lianjie"],
	},
	ailisi: {
		sex: "female",
		group: "aoye",
		hp: 4,
		dualSideCharacter: "kaiyi",
		skills: ["dualside", "zuduishenqing", "guangzhijian_shouhu", "wumingwangnv", "yongzhedezeren"],
	},
	kaiyi: {
		sex: "female",
		group: "aoye",
		hp: 4,
		maxHp: 7,
		isUnseen: true,
		dualSideCharacter: "ailisi",
		skills: ["dualside", "jianglin", "guangzhijian_chongneng", "guangzhijian_zuidaedinggonglv", "guangzhijian_huimie", "huimiedeyaoshi", "wangnvdeyiyuan"]
	},
	chengzi: {
		sex: "male",
		group: "feisheng",
		hp: 6,
		skills: ["feitiandazhou", "lurenwangdefanying", "chudifantan", "jiuchengsanwujin"],
	},
	shijiu: {
		sex: "male",
		group: "feisheng",
		hp: 4,
		skills: ["xunhangdaodan", "niaoshoushourenzhuli", "jiuzhuandacheng"],
	},
	aili: {
		sex: "female",
		group: "waijing",
		hp: 6,
		skills: ["aidechuanbo", "aishen", "fenseyaojing"],
	},
	lvren: {
		sex: "male",
		group: "feisheng",
		hp: 4,
		skills: ["yuanxing", "xurui", "wuhui"],
	},
	zhizimeng: {
		sex: "double",
		group: "feisheng",
		hp: 6,
		maxHp: 20,
		skills: ["huigui", "huizhang", "danchun", "huanzhai"],
	},
};

export const title = {};

/// <reference path="../../../typings/index.d.ts" />
import { lib,game,ui,get,ai,_status } from '../../../noname.js';
lib.config.extensionsCopy = lib.config.extensions.filter(e => {
    return !suiSet.igextension.includes(e) && lib.config[`extension_${e}_enable`]
})

//身份场
suiSet.comboObject(lib.mode.identity.connect,{
    connect_identity_mode:{
        item:{
            kangjin:'<span style="color:red;">抗金</span>',
            Wechat:'<span style="color:red;">自选技能</span>',
            "4v4":'<span style="color:red;">四反三忠一主</span>',
            neimin:'<span style="color:red;">内替换为民（前提是有民）</span>',
            // 'whlw':'<span style="color:red;">文和乱武</span>',
            'clone':'<span style="color:red;">全选一样</span>',
			'skill': '<span style="color:red;">随机技能</span>',
			'ywzq': '<span style="color:red;">勇往直前</span>',
            // 'tafang':'<span style="color:skyblue;">塔防</span>',
        },
        name:'<span style="color:red;">游戏模式</span>',
    },
    // connect_player_number:{
    //     item:Array.from({length:10},(_, i)=>String(i)),
    // },
    // connect_identity_tip:{
    //     name: '<span style="color:skyblue;font-weight:700;">右键点击或手机上长按选项可以有提示</span>',
    //     init: '1',
    //     frequent: true,
    //     restart: true,
    //     item: {
    //         '1': ' '
    //     }
    // },
    connect_identity_Selects:{
        name: '<span style="color:red;">玩家选将框</span>',
        frequent: true,
        init: 'no1',
        item: {
            "no1": '正常',
            "10": '十个',
            "20": '二十个',
            "30": '三十个',
            "40": '四十个',
            "50": '五十个',
            "60": '六十个',
            "70": '七十个',
            "80": '八十个',
            "90": '九十个',
            "100": '一百个',
            "11": '<span style="color:red;">自适应</span>',
            'dianjiang':'自由点将'
        },
        restart: true,
        intro: '开局选将的时候每个人多少个选将框？<br>选一个数，武将开的少不建议选太多！！！！<br>正常：就是原版的样子，好像每个人五个吧<br>自适应：比如开了400个武将，有8个人，那每个人就是400/8=50个'
    },
    connect_identity_AplayerLevel:{
        name: '<span style="color:red;">人机额外加上限</span>',
        frequent: true,
        init: 'no',
        item: {
            "no": '正常',
            "1": '1',
            "2": '2',
            "3": '3',
            "4": '4',
            "5": '5',
            "6": '6',
            "7": '7',
            "8": '8',
            "9": '9',
            "10": '10',
        },
        restart: true,
    },
    connect_identity_playsLevel:{
        name: '<span style="color:red;">普通玩家机额外加上限</span>',
        frequent: true,
        init: 'no',
        item: {
            "no": '正常',
            "1": '1',
            "2": '2',
            "3": '3',
            "4": '4',
            "5": '5',
            "6": '6',
            "7": '7',
            "8": '8',
            "9": '9',
            "10": '10',
        },
        restart: true,
    },
    connect_identity_more_time:{
        name: '<span style="color:red;">选将时间</span>',
        frequent: true,
        item:{
            '10':'10秒',
            '15':'15秒',
            '30':'30秒',
            '60':'60秒',
            '90':'90秒',
        },
        init:lib.configOL.choose_timeout||'30'
    },
    connect_identit_toushi:{
        name:'<span style="color:red;">玩家透视</span>',
        intro:'所有玩家获得金睛，人机没有',
        init:false,
        frequent: true,
    },
    connect_identity_neiReplaceZhong:{
        name:'<span style="color:red;">内奸替换为忠臣</span>',
        intro:'所有玩家获得金睛，人机没有',
        init:false,
        frequent: true,
    },
    connect_identity_tafangRound:{
        name: '<span style="color:red;">防守轮</span>',
        frequent: true,
        item:{
            '5':'5',
            '10':'10',
            '15':'15',
            '20':'20',
        },
        init:"10"
    }
})

//对决
suiSet.comboObject(lib.mode.versus.connect,{
     connect_versus_mode:{
         item:{
			 "2v2": '<span style="color:red;">2v2</span>',
			 "hulaoguan": '<span style="color:red;">虎牢关</span>'
		},
		name: '<span style="color:red;">游戏模式</span>',
     },
    connect_versus_select:{
        name: '<span style="color:red;">玩家选将框</span>',
        frequent: true,
        init: 'no1',
        item: {
            "no1": '正常',
            "10": '十个',
            "20": '二十个',
            "30": '三十个',
            "40": '四十个',
            "50": '五十个',
            "60": '六十个',
            "70": '七十个',
            "80": '八十个',
            "90": '九十个',
			"100": '一百个',
			"11": '<span style="color:red;">自适应</span>',
			'dianjiang': '自由点将'
        },
        restart: true,
        intro: '开局选将的时候每个人多少个选将框？<br>选一个数，武将开的少不建议选太多！！！！<br>正常：就是原版的样子，好像每个人五个吧<br>自适应：比如开了400个武将，有8个人，那每个人就是400/8=50个'
	},
	connect_versus_change_card: {
		name: '<span style="color:red;">开启手气卡</span>',
		init: 'disabled',
		intro: '需要在源文件加一行代码才能使用，有需求的话私聊守望',
	},
	//connect_versus_more_time: {
	//	name: '<span style="color:red;">选将时间</span>',
	//	frequent: true,
	//	item: {
	//		'10': '10秒',
	//		'15': '15秒',
	//		'30': '30秒',
	//		'60': '60秒',
	//		'90': '90秒',
	//	},
	//	init: lib.configOL.choose_timeout || '30'
	//},
	connect_versus_dianfengsai: {
		name: '<span style="color:red;">巅峰赛BP模式</span>',
		init: 'disabled',
	},
	connect_versus_lockCharacter: {
		name: '<span style="color:red;">固定将池(仅BP模式)</span>',
		init: 'disabled',
		intro: '将池固定为以下（禁用的将不会出现）：王基 陆绩 手杀许攸 郝昭 周妃 张绣 神吕蒙 神周瑜 神赵云 神陆逊 神张辽 神甄宓 神荀彧 神孙策 神鲁肃 曹叡 张松 张让 岑昏 秦宓 界张辽 界司马懿 界许褚 界夏侯惇 界吕蒙 界周瑜 界陆逊 界赵云 界关羽 界张飞 界马超 界曹操 界郭嘉 界吕布 界黄盖 界大乔 界甘宁 界华佗 界刘备 界貂蝉 界黄月英 界孙权 界孙尚香 界诸葛亮 界甄宓 界华雄 界张角 界孙策 界卧龙 界袁绍 界刘禅 OL王荣 夏侯玄 戏志才 马良 张华 沙摩柯 OL陆郁生 陆郁生 手杀孙茹 OL孙茹 彭羕 诸葛恪 SP赵云 曹纯 鲍三娘 手杀鲍三娘 OL冯妤 吕岱 唐姬 徐荣 张琪瑛 手杀张昌蒲 冯方 孟达 孙桓 关宁 许劭 星张春华 OL界张春华 晋司马懿 晋司马昭 晋司马师 族吴苋 族荀采 族钟会 刘理 刘永 滕公主 吕玲绮 陈矫 董昭 秦朗 陈珪 刘巴 向朗 郑浑 手杀孙寒华 乐邹氏 手杀留赞 赵直 手杀骆统 丁尚涴 袁姬 阮瑀 潘淑 曹华 SP甄宓 桓范 周不疑 ☆周不疑 新杀赵襄 手杀贾逵 手杀马钧 羊徽瑜 周群 手杀裴秀 手杀界小乔 手杀曹髦 手杀界曹植 手杀界徐盛 手杀界李儒 手杀界沮授 手杀孙鲁育 吴景 桥公 张机 手杀文鸯 谋刘赪 谋黄盖 谋周瑜 谋曹操 谋甘宁 谋马超 谋张飞 谋赵云 谋刘备 谋法正 谋貂蝉 谋庞统 谋孙策 谋大乔 谋小乔 谋诸葛亮 谋黄月英 谋曹丕 谋荀彧 谋夏侯惇 谋陆逊 乐诸葛果 幻诸葛果 诸葛果 无名 梦诸葛亮 美坂栞 神尾观铃 神尾晴子 春原阳平&春原芽衣 古河渚 西园美鸟 西园美鱼 朱鹭户沙耶 此花露西娅 中津静流 游佐 直井文人 岩泽雅美 椎名 鸣濑白羽 露娜Ｑ 樱庭星罗 守望 神奥利奥 鹿天帝朗',
	},
    // connect_versus_kangjin:{
    //     name:'<span style="color:red;">22抗金</span>',
    //     intro:'两个玩家必定一队',
    //     init:false,
    //     frequent:true,
    // }
})


//斗地主
suiSet.comboObject(lib.mode.doudizhu.connect,{
    connect_doudizhu_select:{
        name: '<span style="color:red;">玩家选将框</span>',
        frequent: true,
        init: 'no1',
        item: {
            "no1": '正常',
            "10": '十个',
            "20": '二十个',
            "30": '三十个',
            "40": '四十个',
            "50": '五十个',
            "60": '六十个',
            "70": '七十个',
            "80": '八十个',
            "90": '九十个',
            "100": '一百个',
			"11": '<span style="color:red;">自适应</span>',
			'dianjiang': '自由点将'
        },
        restart: true,
        intro: '开局选将的时候每个人多少个选将框？<br>选一个数，武将开的少不建议选太多！！！！<br>正常：就是原版的样子，好像每个人五个吧<br>自适应：比如开了400个武将，有8个人，那每个人就是400/8=50个'
    },
    // connect_doudizhu_replaceHandCard:{
    //     name: '<span style="color:red;">手气卡次数</span>',
    //     frequent: true,
    //     init: '2',
    //     item:Array.from({length:100},(_, i)=>String(1+(i))),
    //     restart: true,
    // },
    // connect_doudizhu_mode:{
    //     item:{
    //         // Wechat:'<span style="color:red;">微信</span>',
    //         // Super:'<span style="color:red;">超级</span>',
    //     }
    // }
})

//其他方法
const lmsi = lib.message.server.init
suiSet.comboObject(lib.message.server,{
    initAvatar(id,avatar){
        game.broadcastAll((player,avatar,nickname)=>{
            const character = lib.character[avatar]||['male','qun',4,[],[]]
            const id = nickname+player.playerid
            lib.character[id] = character.slice()
            lib.character[id][2] = 4 
            lib.character[id][3] = []
            if(!lib.character[id][4]){
                lib.character[id][4] = []
            }
            lib.character[id][4].remove('hiddenSkill')
            lib.character[id][4].push(`character:${avatar}`)
            lib.translate[id] = nickname.replace('※','')
            player.init(id)
            player.update()
        },lib.playerOL[id],avatar,this.nickname)
    },
    init(version, config, banned_info){
        this.nickname = config.nickname
        this.gameOptions = {}
        if(lib.config['extension_联机修改_play_mima']){
            const {mima,nickname} = config
            const player = lib.config.mimaList.find(c=>c.name == config.nickname && c.mima == lib.config['联机修改mima'])
            if((mima!=lib.config['联机修改mima'])&&!player){
                this.send((mima,tip)=>{
                    //你要这样偷看密码吗？
                    let popupContainer;
                    game.prompt('本房设置了入场密码，请输入密码',str=>{
                        if(str){
                            if(str===mima) game.send('init',lib.versionOL,{
                                id:game.onlineID,
                                avatar:lib.config.connect_avatar,
                                nickname:get.connectNickname(),
                                mima:str
                            },lib.config.banned_info)
                            else {
                                game.prompt('密码错误<br>请点击确定取消重启<br>提示：<br>'+tip,game.reload)
                            }
                        }else {
                            game.reload()
                        }
                        popupContainer.style.zIndex = ''
                    })
                    popupContainer = document.querySelector('.popup-container')
                    popupContainer.style.zIndex = '99999999'
                },lib.config['联机修改mima'],lib.config['联机修改_tip'])
                return false
            }else if(mima==lib.config['联机修改mima']) {
                lib.config.mimaList.push({
                    id:this.id,
                    name:nickname,
                    mima,
                })
                game.saveConfig('mimaList',lib.config.mimaList)
            }
        }
        suiSet.executeConnect({player:this,version, config, banned_info});
        suiSet.modeCharacter({player:this,version, config, banned_info});
        return lmsi.call(this,version, config, banned_info)
    },
    chat(id, str){
        let player;
        if (lib.playerOL[id]) {
            player = lib.playerOL[id];
        }
        else if (game.connectPlayers) {
            player = game.connectPlayers.find(p=>p.playerid===id)
        }
        if (player) {
            if(player===game.me&&this.mainHost!=='mainHost'){
                lib.element.player.chat.call(player,str)
            }else {
                player.chat(str)
            }
        }else if(lib.node.observing.includes(this)||suiSet.observingId.includes(this)) {
            const name = this.nickname||arguments[arguments.length-1]
            if(lib.config['extension_联机修改_main_cdown']){
                const prefix = lib.node.observing.includes(this)?'<span style="color:blue;">（旁观）</span>':'<span style="color:red;">（被控制）</span>'
                game.addVideo('danmu',null,{prefix:'<span style="color:blue;">（旁观）</span>',name,str:str.replace(/##assetURL##/g, lib.assetURL)})
                game.broadcastAll((func,prefix,name,str)=>{
                    str = str.replace(/##assetURL##/g, lib.assetURL);
                    func(prefix,name,str)
                    const info = [prefix+name,str];
                    lib.chatHistory.push(info);
                },ui.create.danmu,prefix,name,str)
            }
        }
    },
    emotion(id, pack, emotion,name) {
        let player;
        if (lib.playerOL[id]) {
            player = lib.playerOL[id];
        }else if (game.connectPlayers) {
            player = game.connectPlayers.find(p=>p.playerid == id)
        }
        if (player) {
            player.emotion(pack, emotion)
        }else if (lib.node.observing.includes(this)||suiSet.observingId.includes(this)) {
            const str  = '<img src="##assetURL##image/emotion/' + pack + '/' + emotion + '.gif" width="50" height="50">';
            lib.message.server.chat.call(this,this.id,str,name)
        }
    },
})

import { lib, game, ui, get, ai, _status } from '../../noname.js'
window.lm_import = function (func) {
    func(lib, game, ui, get, ai, _status);
};
game.import("extension", function (lib, game, ui, get, ai, _status) {
    const xiugai = {
        name: "联机修改(云笺改版)",
        editable: false,
        content() { },
        precontent(configs) {
            window.suiSet = {
                lib, game, ui, get, ai, _status,
                mode: [
                    'identity', 'doudizhu', 'versus', 'DIYmode', 'tiaozhan', 't_jiuzhou',
                ],
                igextension: [
                    '应用配置', '拖拽读取', '在线更新', 'OL设置', '一劳永逸', '联机修改(云笺改版)', 'SJ Settings', '武将修改', 'AI优化', 'OLset'
                ],
                addImport(url) {
                    const script = document.createElement('script')
                    script.type = 'module'
                    script.src = lib.assetURL + url
                    document.head.appendChild(script)
                    script.onload = script.remove
                    return script
                },
            }
            if (!lib.config.suiSetBandList) {
                lib.config.suiSetBandList = {}
            }
            if (!lib.config.suiSetQuickVoice) {
                lib.config.suiSetQuickVoice = lib.quickVoice
            } else {
                lib.quickVoice = lib.config.suiSetQuickVoice
            }
            lib.modeCharacter = {}
            if (!lib.config.mimaList) {
                lib.config.mimaList = []
            }

            if (!lib.config.suiSetBandnow) {
                game.saveConfig('suiSetBandnow', '第一次载入')
            }
            if (!lib.config.firstBandList) {
                let banned = lib.config.banned
                Object.defineProperty(lib.config, 'banned', {
                    configurable: true,
                    get() {
                        return banned
                    },
                    set(v) {//我要找的是那些被禁用的武将和包
                        const characterPack = lib.config.all.characters.filter(c => {
                            return !lib.config.characters.includes(c)
                        })
                        lib.config.suiSetBandList.packAndCharcters = {
                            '第一次载入': {
                                characters: v,
                                characterPack,
                                noremove: false,
                            }
                        }
                        game.saveConfig('firstBandList', { characters: v, characterPack })
                        game.saveConfig('suiSetBandList', lib.config.suiSetBandList)
                        //v是禁用的武将
                        //characters是开启的包，那在所有的包里筛选一遍，得到的就是未开启的
                        banned = v
                    }
                })
            }
            const setdefineProperty = (node, proxy, get) => {
                Object.defineProperty(node, proxy, {
                    get, set() { }
                })
            }
            if (lib.config['extension_联机修改_diyCharacerPack']) {
                Object.keys(suiSet.lib.config).forEach(c => {
                    if (c.includes('_banned') && c.includes('connect_')) {
                        setdefineProperty(lib.config, c, () => suiSet.BandList.getPackAndCharacters().characters)
                    }
                })

                setdefineProperty(lib.config, 'characters', () => {//单机模式里这是要禁的将
                    return suiSet.BandList.getPackAndCharacters().characterPack
                })
                setdefineProperty(lib.config, 'connect_characters', () => {//联机模式里是要打开的将
                    const packs = suiSet.BandList.getPackAndCharacters().characterPack
                    return lib.config.all.characters.filter(c => {
                        return !packs.includes(c)
                    })
                })
            }
            const useJs = [
                // 'hdwj',
                'globalSkills', 'player', 'content',
                'function', 'bandom', 'modeset',
                // 'cards','characters','hdwj'
                'chooseCharacterOL', 'initBandList', 'skillSet', 'video', 'connect'
            ]
            lib.init.js(`${lib.assetURL}extension/联机修改(云笺改版)/script`, 'precontent', () => {
                useJs.forEach(m => suiSet.addImport(`extension/联机修改(云笺改版)/script/${m}.js`))
                lib.init.css(`${lib.assetURL}extension/联机修改(云笺改版)/style`, 'ban')
                lib.init.css(`${lib.assetURL}extension/联机修改(云笺改版)/style`, 'cards')
            })
            suiSet.config = this.config
        },
        config: {
            diyCharacerPack: {
                get name() {
                    if (lib.config['extension_联机修改_diyCharacerPack']) {
                        return '关闭禁用方案'
                    }
                    return '打开禁用方案'
                },
                intro: "设置一个配置，可以快速切换",
                onclick(bool) {
                    if (this.innerHTML.includes('打开')) {
                        this.innerHTML = this.innerHTML.replace('打开', '关闭')
                        this.classList.remove('dakai')
                        this.classList.add('guan')
                    } else {
                        this.innerHTML = this.innerHTML.replace('关闭', '打开')
                        this.classList.remove('guan')
                        this.classList.add('dakai')
                    }
                    game.saveConfig('extension_联机修改_diyCharacerPack', bool)
                }
            },
            get diyCharacerPackClose() {
                if (lib.config['extension_联机修改_diyCharacerPack']) {
                    return {
                        name: '<button>打开禁用方案</button>',
                        intro: "",
                        clear: true,
                        onclick(bool) {
                            if (!suiSet) return;
                            // game.saveConfig('extension_联机修改_diyCharacerPack',bool)
                            suiSet.BandList.create()
                        }
                    }
                }
                return {}
            },
            // play_error:{
            //     name:'<span style="color:red;">※屏蔽弹窗报错（不建议打开）</span>',
            //     onclick(bool){
            //         if(bool){
            //             alert(`
            //             开启后，房主可以开扩展其他玩家也能正常游戏，
            //             比如房主可以开十周年UI和手杀UI其他玩家不开也能玩不会像以前一样卡死
            //             以前的弹窗报错改为输出报错
            //             也可以开一些武将扩展，
            //             但不建议开武将扩展，
            //             更不建议选其他玩家没有的那些扩展里的武将
            //             错误其实也不能全算是坏事，这是告诉人家某个地方有问题
            //             但有些报错并不会影响游戏情况，只是一会儿又弹窗
            //             有些其实是没必要弹窗的
            //             `)
            //         }
            //         game.saveConfig('extension_联机修改_play_error',bool)
            //         // suiSet.BandList.create()
            //     },
            //     init:false,
            // },
            // play_BossMode:{
            //     name:'挑战武将加入联机',
            //     intro:'将挑战模式里的武将加入身份局',
            //     init:false,
            // },
            // play_morechar:{
            //     name:'<span style="color:red;">所有武将加入联机</span>',
            //     intro:'所有武将都加入联机，当然可能有BUG',
            //     innt:false,
            // },
            // play_morecard:{
            //     name:'<span style="color:red;">所有卡牌加入联机</span>',
            //     intro:'所有卡牌都加入联机，当然可能有BUG',
            //     innt:false,
            // },
            main_cdown: {
                name: '聊天发送弹幕',
                intro: '每个玩家发送消息后，都会变成弹幕。',
                init: false,
            },
            play_mima: {
                name: '进入房间要输入密码',
                init: false,
                onclick(bool) {
                    game.saveConfig('extension_联机修改_play_mima', bool)
                    // suiSet.setMima()
                }
            },
            get setMima() {
                if (lib.config['extension_联机修改_play_mima']) {
                    return {
                        name: '<button>设置密码</button>',
                        intro: "",
                        clear: true,
                        onclick() {
                            game.prompt(`请输入要设置的密码<br>当前密码：${lib.config['联机修改mima'] || '无'}`, str => {
                                if (str) game.saveConfig('联机修改mima', str)
                                game.prompt(`给密码输入错误的玩家的提示<br>当前提示：${lib.config['联机修改_tip'] || '无'}`, str2 => {
                                    if (str2) game.saveConfig('联机修改_tip', str2)
                                })
                            })
                        }
                    }
                }
                return {}
            },
            // play_yansheng:{
            //     name:'牌堆加入衍生牌',
            //     intro:'将武将衍生牌加入到牌堆中',
            //     init:false,
            // },
            // play_sliceCards:{
            //     name:'其他模式的卡牌加入牌堆中',
            //     intro:'将其他模式的卡牌加入到牌堆中，甚至还有撒豆成兵之类的。',
            //     init:false,
            // },
            // fun_banThrowEmotion:{
            //     name:'禁止自己房间的所有人扔道具',
            //     init:false,
            // },
            // fun_closeThrowEmotion:{
            //     name:'屏蔽所有人扔道具',
            //     init:false,
            // },
            play_tipPlayerVersion: {
                name: '让所有人检查自己的版本是否和房主的一样',
                init: true,
            },
            play_tipNonamePlayer: {
                name: '提醒无名玩家改名字',
                init: true,
            },
            play_tipExtension: {
                name: '提醒其他角色扩展是否少了房主有的扩展',
                init: false
            },
            fun_beginDraw: {
                name: '起始发牌',
                frequent: true,
                init: '4',
                item: Array.from({ length: 100 }, (_, i) => String(i)),
            },
            fun_replaceHandCards: {
                name: '手气卡次数',
                frequent: true,
                init: "1",
                item: Array.from({ length: 100 }, (_, i) => String(i)),
            },
            edit_allcharacters: {
                name: '神孙权技能池全扩（根据势力定）',
                init: false,
            },
            edit_showUnsee: {
                name: '显示隐藏武将',
                init: false
            },
            edit_cardsInfo: {
                name: '卡牌上显示出牌信息',
                init: true,
            },
            edit_skillInfo: {
                name: '显示技能发动',
                init: true,
            },
            edit_tphaseTip: {
                name: '阶段提示',
                init: true,
            },
            // edit_viewCard:{
            //     name:'显示视为使用牌',
            //     init:true,
            // },
            edit_morecharacter: {
                name: '搬运武将',
                init: true
            },
            // edit_sksr:{
            //     name:'极略武将',
            //     init:false
            // },
            edit_LM: {
                name: '怀旧武将',
                init: false
            },
            edit_DIY: {
                name: '自定义武将',
                init: false
            },
            edit_noAllReplace: {
                name: '置换的手牌可选择',
                init: false,
                intro: "开启后置换手牌时可以选择一些手牌置换"
            },
            edit_selectGameDraw: {
                name: '自选起始手牌',
                init: false,
                intro: "开启后会把初始牌堆平分给玩家每名角色选择X张（X为其起始应摸牌数）"
            },
            edit_floatBall: {
                name: '悬浮球',
                init: false
            },
            edit_diereceive: {
                name: '死亡复活',
                init: false,
                intro: "一名角色死亡前，其将体力值回复至满且将手牌数模至发牌时应发张数"
            },
            // edit_observeInit:{
            //     name:'旁观可加入战局',
            //     init:false,
            //     intro:"开启后旁观玩家可以申请控制局内角色"
            // },
            // edit_colorSelect:{
            //     name:'发言颜色选择',
            //     init:true
            // },
            play_observeChat: {
                name: '允许旁观发言',
                init: true,
            },
            // edit_showSeat:{
            //     name:'座位号显示',
            //     init:true,
            // },
            // play_oberChat:{
            //     name:'允许旁发言',
            //     init:false
            // },
            // play_banGiveUp:{
            //     name:'禁止投降',
            //     init:false,
            // },
            // addquickVoice:{
            //     name:'添加快捷短语',
            //     onclick(){
            //         if(ui.addquickVoice) return;
            //         const menu = ui.create.div('.quickVoiceDiv',ui.window)
            //         ui.addquickVoice = menu
            //         const addList = ui.create.div('.addList',menu)
            //         const ul = document.createElement('ul')
            //         addList.appendChild(ul)
            //         lib.quickVoice.forEach(i=>{
            //             const li = document.createElement('li')
            //             li.innerHTML = i
            //             ul.appendChild(li)
            //             li.addEventListener('click',function(){
            //                 if(this===addList.lastLi) return;
            //                 addList.lastLi.classList.remove('active')
            //                 this.classList.add('active')
            //                 addList.lastLi = this
            //             })
            //         })
            //         addList.lastLi = ul.firstElementChild
            //         addList.lastLi.classList.add('active')
            //         const buttons = [
            //             ['点击添加',()=>{
            //                 const _li = document.createElement('li')
            //                 ul.appendChild(_li)
            //                 _li.contentEditable = true
            //                 _li.focus()
            //                 _li.onblur = function(){
            //                     lib.config.suiSetQuickVoice.push(this.innerHTML)
            //                     game.saveConfig('suiSetQuickVoice',lib.config.suiSetQuickVoice)
            //                     _li.contentEditable = false
            //                 }
            //             }],
            //             ['播放',function(){
            //                 game.me.say(addList.lastLi.innerHTML)
            //             }],
            //             ['删除',function(){
            //                 lib.config.suiSetQuickVoice.remove(addList.lastLi.innerHTML)
            //                 addList.lastLi.remove()
            //                 game.saveConfig('suiSetQuickVoice',lib.config.suiSetQuickVoice)
            //                 addList.lastLi = ul.firstElementChild
            //                 addList.lastLi.classList.add('active')
            //             }],
            //             ['关闭',()=>{
            //                 ui.addquickVoice.remove()
            //                 delete ui.addquickVoice
            //             }]
            //         ]
            //         buttons.forEach((b,i)=>{
            //             const button = document.createElement('button')
            //             button.innerHTML = b[0]
            //             button.classList.add('addQuickVoice','index'+i)
            //             button.style.right = i*100+'px'
            //             button.addEventListener('click',b[1])
            //             addList.appendChild(button)
            //         })
            //     },
            //     init:false,
            //     clear:true,
            // },
            // floatBall:{
            //     name:'悬浮球',
            //     init:true
            // },
        },
        help: {},
        package: {
            intro: "版本：1.678",
            author: "岁儿",
            diskURL: "",
            forumURL: "",
            version: "1.0",
        }
    }
    return xiugai
})

/// <reference path="../../../typings/index.d.ts" />
import { lib, game, ui, get, ai, _status } from '../../../noname.js';
//这个文件是写给主机执行的代码
import {
    updateActive,
    setUpdateActive,
    menux,
    menuxpages,
    createConfig,
    clickMenuItem
} from "../../../noname/ui/create/menu/index.js";

const { HDWJ, jilueSkSr, DIY, LM } = suiSet.moreCharacters.addFcuntion

const functions = {
    cdown() {
        const createSay = () => {
            const leps = lib.element.player.say
            lib.element.player.say = function (str) {
                if (this.nickname) { // 只有当this.nickname存在时才发送弹幕
                    const player = this
                    let nickname = (this.tempNickname ? `<span style="color:green;">（${this.tempNickname}控制的${this.nickname}）</span>` : '') || this.nickname, prefix = '';
                    if (game.Mainobserve) {
                        nickname = lib.config.connect_nickname
                        prefix = '<span style="color:blue;">（旁观）</span>'
                    }
                    game.addVideo('say', player, {
                        nickname,
                        str
                    })
                    Promise.resolve().then(() => {
                        game.broadcast((danmu, prefix, name, str) => {
                            str = str.replace(/##assetURL##/g, lib.assetURL);
                            if (!lib.element.player.say.danmu) {
                                danmu(prefix, name, str)
                            }
                        }, ui.create.danmu, prefix, nickname, str)
                        str = str.replace(/##assetURL##/g, lib.assetURL);
                        ui.create.danmu(prefix, nickname, str)
                    })
                }
                return leps.call(this, ...arguments)
            }
            lib.element.player.say.danmu = true
            ui.create.danmu = function (prefix = '', name = lib.config.connect_nickname, str = '') {
                if (!ui.danmuList) ui.danmuList = []
                if (!ui.bulletScreen) {
                    ui.bulletScreen = ui.create.div('.bulletScreen', document.body)
                    ui.bulletScreen.css({ width: "100%", height: "100%", left: "0", top: "0", pointerEvents: "none", zIndex: "100" })
                }
                let top = document.body.clientHeight / 5
                const danmu = ui.create.div('.danmumode', `${prefix}${name}：${str}`, ui.bulletScreen)
                danmu.css({
                    left: '100%',
                    transition: 'left 10s cubic-bezier(0.45, 0.44, 0.55, 0.52) 0s',
                    fontSize: "18px",
                    textShadow: "1px 1px black",
                    whiteSpace: "nowrap",
                    fontFamily: "宋体",
                    zIndex: "1000",
                    pointerEvents: "none"
                })
                const { height } = danmu.getBoundingClientRect()
                while (ui.danmuList.includes(top)) {
                    if (top === ui.danmuList.lastIndex) {
                        ui.danmuList = []
                    }
                    top += height
                    if (top > document.body.clientHeight) {
                        top = 149 - height
                        ui.danmuList = []
                    }
                }
                ui.danmuList.add(top)
                danmu.style.top = top + "px"
                ui.refresh(danmu)
                danmu.style.left = "-10%"
                danmu.topBound = top
                const removeNode = function () {
                    this.remove()
                    ui.danmuList.remove(this.topBound)
                }
                danmu.addEventListener('transitionend', removeNode)
                danmu.addEventListener('webkittransitionend', removeNode)
            }
        }
        setTimeout(createSay, 1000);
    }
}
const edits = {
    allcharacters() {
        lib.skill.junkyuheng = {
            audio: 'yuheng',
            trigger: { player: 'phaseBegin' },
            forced: true,
            keepSkill: true,
            filter: function (event, player) {
                return player.hasCard(function (card) {
                    return lib.filter.cardDiscardable(card, player, 'junkyuheng');
                }, 'he');
            },
            getSkillList(player) {
                const allCharacter = _status.characterlist//Object.keys(lib.character)//这样太多了吧。
                const character = allCharacter.filter(c => {
                    return lib.character[c][1] == player.group
                })
                // _status.characterlist.forEach(c=>{
                // 	if(lib.character[c][1]==player.group){
                // 		character.push(c)
                // 	}
                // })
                const skills = [];
                character.forEach(c => {
                    lib.character[c][3].forEach(z => {
                        skills.push(z)
                    })
                });
                return skills
            },
            content: function () {
                'step 0'
                player.chooseToDiscard('he', true, [1, 4], function (card, player) {
                    if (!ui.selected.cards.length) return true;
                    var suit = get.suit(card, player);
                    for (var i of ui.selected.cards) {
                        if (get.suit(i, player) == suit) return false;
                    }
                    return true;
                }).set('complexCard', true).set('ai', function (card) {
                    if (!player.hasValueTarget(card)) return 5;
                    return 5 - get.value(card);
                });
                'step 1'
                if (result.bool) {
                    var skills = lib.skill.junkyuheng.getSkillList(player).randomGets(result.cards.length + 1);
                    player.storage.yuhengSkill = skills
                    let yiyou = skills.filter(s => {
                        return player.hasSkill(s)
                    })
                    if (yiyou.length > 0) {
                        game.log('但是：', yiyou, "这几个技能是本就已经拥有了的")
                    }
                    player.addAdditionalSkill('junkyuheng', skills);
                    game.log(player, '获得了以下技能：', '#g' + get.translation(skills));
                }
            },
            group: 'junkyuheng_remove',
            subSkill: {
                remove: {
                    audio: 'yuheng',
                    trigger: { player: 'phaseEnd' },
                    forced: true,
                    filter: function (event, player) {
                        return player.additionalSkills.junkyuheng && player.additionalSkills.junkyuheng.length > 0;
                    },
                    content: function () {
                        player.draw(player.additionalSkills.junkyuheng.length + 1);
                        game.log(player, '失去了以下技能：', '#g' + get.translation(player.additionalSkills.junkyuheng.remove(player.storage.yuhengSkill)));
                        player.removeAdditionalSkill('junkyuheng');
                    },
                },
            },
        }
    },
    cardsInfo() {
        lib.element.player.$throwordered = function (node) {
            const $throwordered2 = this.$throwordered2.apply(this, arguments);
            const player = this
            const { name, targets, judgestr } = _status.event
            let eventInfo;
            const playername = get.translation(player)
            switch (name) {
                case 'useCard': {
                    if (targets.length === 1 && targets[0] === player) {
                        eventInfo = playername + '使用'
                    }
                    else if (targets.length < 3) {
                        eventInfo = playername + "对" + get.translation(targets) + "使用"
                    } else {
                        eventInfo = playername + "使用"
                    }
                    break;
                }
                case 'disCard': {
                    eventInfo = playername + "弃置"
                    break
                }
                case 'lose': {
                    eventInfo = playername + "弃置"
                    break
                }
                case 'useSkill': {
                    if (_status.event.skill == '_chongzhu') {
                        eventInfo = playername + "重铸"
                    } else {
                        eventInfo = playername
                    }
                    break
                }
                case 'respond': {
                    eventInfo = playername + "打出"
                    break
                }
                case 'die': {
                    eventInfo = playername + "弃置"
                    break
                }
                case 'judge': {
                    eventInfo = playername + judgestr || '' + "判定牌"
                    break
                }
                case 'gain': {
                    eventInfo = playername + "交给"
                    break
                }
                default: {
                    eventInfo = playername
                }
            }
            if (node && node.node) {
                const cardInfo = {
                    name: get.name(node),
                    number: get.number(node),
                    suit: get.suit(node)
                }
                game.broadcastAll((node, eventInfo, { name, number, suit }) => {
                    if (!node.node) {
                        node = [...ui.arena.childNodes].find(c => {
                            if (c.classList.contains('thrown') && c.classList.contains('card')) {
                                const n = get.number(c)
                                const na = get.name(c)
                                const s = get.suit(c)
                                if (n === number && na === name && s === suit && !c.selectedt) {
                                    c.selectedt = true
                                    return true
                                }
                            }
                        })
                    }
                    if (!node.node) return
                    const no = ['image', 'info', 'name', 'name2', 'background', 'intro', 'range', 'gaintag']
                    const some = [...node.childNodes].some(n => {
                        if (n.innerText && eventInfo.includes && eventInfo.includes(n.innerText) && !no.includes(n.classList[0])) {
                            n.innerHTML = eventInfo
                            return true
                        }
                    })
                    if (some) return
                    if (!node.node.cardsetion) {
                        node.node.cardsetion = ui.create.div('.cardsetion', eventInfo, node)
                    } else {
                        node.node.cardsetion.innerHTML = eventInfo || playername
                    }
                }, node, eventInfo, cardInfo)

                const addStyle = () => {
                    const style = document.createElement('style')
                    style.innerHTML = /*css*/`
                    .cardsetion {
                        width:100%;
                        color: #fff;
                        text-shadow: 1px 1px black;
                        font-size: 15px;
                        bottom: 0;
                        text-align: center;
                        z-index:100000;
                        pointer-events:none;
                    }
                    .card .tempname.tempimage {
                        opacity:1 !important;
                    }   
                    `
                    document.head.appendChild(style)
                }
                if (!game.throwCardStyle) {
                    addStyle()
                    game.throwCardStyle = true
                }
                if (lib.node && lib.node.clients) {
                    lib.node.clients.forEach(c => {
                        if (!c.gameOptions) {
                            c.gameOptions = {}
                        }
                        if (!c.gameOptions.Cardstyle) {
                            c.send(addStyle)
                            c.gameOptions.Cardstyle = true
                        }
                    })
                }
                game.addVideo('cardInfo', null, {
                    eventInfo,
                    cardInfo
                })
            }
            return $throwordered2
        }
    },
    skillInfo() {
        const gamelog = game.log
        game.log = function () {
            const args = Array.from(arguments)
            const bool = args.some(s => typeof s === 'string' && (s.includes('发动了') || s.includes('将势力')))
            if (bool) {
                const color = new Map([
                    ['r', 'fire'],
                    ['y', 'yellow'],
                    ['g', 'green'],
                    ['b', 'blue']
                ]);
                let info = ''
                args.forEach(c => {
                    const itemtype = get.itemtype(c)
                    const trans = get.translation(c)
                    if (c[0] === '#') {
                        info += `<span class="${color.get(c[1]) || ''}text">${get.translation(c.slice(2))}</span>`;
                    } else if (typeof c === 'string' && c[0] == '【' && c[c.length - 1] == '】') {
                        info += `<span class="greentext">${trans}</span>`;
                    } else if (!itemtype) {
                        info += trans
                    } else if (itemtype.includes('player')) {
                        info += `<span class="bluetext">${trans}</span>`;
                    } else if (itemtype.includes('card')) {
                        info += `<span class="yellowtext">${trans}</span>`;
                    } else {
                        info += trans
                    }
                })
                const sendInfo = info => {
                    if (!ui.skillInfos) {
                        ui.skillInfos = ui.create.div('.skillInofss', ui.window)
                        const style = document.createElement('style')
                        style.innerHTML = /*css*/`
                            .skillInofss {
                                width: 100%;
                                height: 100%;
                                pointer-events: none;
                                z-index: 1;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                flex-direction: column;
                                pointer-events:none;
                            }
                            .skillInofss .skillInfoShwo {
                                font-size: 20px;
                                background-color: rgba(0,0,0,0.2);
                                padding: 10px 30px;
                                border-radius: 10px;
                                text-align: center;
                                text-shadow: 1px 1px black;
                                position: relative;
                                display: block;
                                width: fit-content;
                                margin-top: 4px;
                                top:-10%;
                                pointer-events:none;
                            }
                        `
                        document.head.appendChild(style)
                    }
                    setTimeout(node => node.delete(), 3000, ui.create.div('.skillInfoShwo', info, ui.skillInfos));
                }
                if (lib.node && lib.node.clients) {
                    lib.node.clients.forEach(c => {
                        if (!c.gameOptions) {
                            c.gameOptions = {}
                        }
                        if (!c.gameOptions.infoStyle) {
                            c.send((sendInfo, info) => sendInfo(info), sendInfo, info)
                            c.gameOptions.infoStyle = true
                        }
                    })
                }
                sendInfo(info)
            }
            return gamelog.call(this, ...arguments)
        }
        game.log.skillInfo = true
    },
    tphaseTip() {
        suiSet.globalSkills._tphaseTip = {
            trigger: {
                global: ['phaseBeginStart', 'phaseZhunbeiBefore', 'phaseJudgeBefore', 'phaseDrawBefore', 'phaseUseBefore', 'phaseDiscardBefore', 'phaseJieshuBefore', 'phaseEnd']
            },
            filter() {
                return lib.config['extension_联机修改_edit_tphaseTip']
            },
            async content(event, trigger) {
                game.broadcastAll((phasename, player) => {
                    if (phasename === 'phaseEnd') {
                        if (player.node.tphaseTip) {
                            player.node.tphaseTip.innerHTML = ''
                        }
                    } else {
                        const phase = {
                            phaseBeginStart: '回合开始',
                            phaseZhunbeiBefore: '准备阶段',
                            phaseJudgeBefore: '判定阶段',
                            phaseDrawBefore: '摸牌阶段',
                            phaseUseBefore: '出牌阶段',
                            phaseDiscardBefore: '弃牌阶段',
                            phaseJieshuBefore: '结束阶段'
                        }
                        const name = phase[phasename]
                        if (!player.node.tphaseTip) {
                            const addStyle = () => {
                                const style = document.createElement('style')
                                style.innerHTML = `
                                .tphaseTip {
                                    width: 100%;
                                    text-align: center;
                                    bottom: -9%;
                                    text-shadow: 1px 1px black;
                                    font-family: 'songti',"宋体";
                                    color: rgb(217, 152, 62);
                                    pointer-events:none;
                                }
                                .player[data-position="0"] .tphaseTip {
                                    width: 100px;
                                    top: -20%;
                                    left: 1%;
                                    pointer-events:none;
                                }
                                `
                                document.head.appendChild(style)
                            }
                            if (!game.phaseStyle) {
                                game.phaseStyle = true
                                addStyle()
                            }
                            player.node.tphaseTip = ui.create.div('.tphaseTip', name, player)
                            if (lib.node && lib.node.clients) {
                                lib.node.clients.forEach(c => {
                                    if (!c.gameOptions) {
                                        c.gameOptions = {}
                                    }
                                    if (!c.gameOptions.phaseTip) {
                                        c.send(addStyle)
                                        c.gameOptions.phaseTip = true
                                    }
                                })
                            }
                        } else {
                            player.node.tphaseTip.innerHTML = name
                        }
                    }
                }, event.triggername, trigger.player)
            },
            direct: true,
            popup: false,
            forced: true,
            forceDie: true,
            charlotte: true,
            locked: true,
        }
    },
    showSeat() { },
    morecharacter: HDWJ,
    sksr: jilueSkSr,
    DIY,
    LM,
    viewCard() {
        // suiSet.globalSkills._viewCard = {
        //     trigger:{player:'useCard'},
        //     direct:true,
        //     popup:false,
        //     forced:true,
        //     forceDie:true,
        //     charlotte:true,
        //     locked:true,
        //     filter(event){
        //         return lib.config['extension_联机修改_edit_viewCard']&&!(!event.card||event.card.cards.length===0)
        //     },
        //     async content(event,trigger,player){
        //         const name = get.name(trigger.card)
        //     }
        // }
    },
    showUnsee() {
        //下边这两个东西我是真的不想动，然而还是有必要的。害
        lib.filter.characterDisabled = function (i, libCharacter) {
            if (i === 'shen_diaochan') return false
            // if (!lib.character[i] || lib.character[i][4] && lib.character[i][4].includes('forbidai')) return true;
            // if (lib.character[i][4] && lib.character[i][4].includes('unseen')) return true;
            if (lib.config.forbidai.includes(i)) return true;
            if (lib.characterFilter[i] && !lib.characterFilter[i](get.mode())) return true;
            if (_status.connectMode) {
                if (lib.configOL.banned.includes(i) || lib.connectBanned.includes(i)) return true;
                var double_character = false;
                if (lib.configOL.mode == 'guozhan') {
                    double_character = true;
                }
                else if (lib.configOL.double_character && (lib.configOL.mode == 'identity' || lib.configOL.mode == 'stone')) {
                    double_character = true;
                }
                else if (lib.configOL.double_character_jiange && (lib.configOL.mode == 'versus' && _status.mode == 'jiange')) {
                    double_character = true;
                }
                if (double_character && lib.config.forbiddouble.includes(i)) {
                    return true;
                }
                // if(lib.configOL.ban_weak){
                // 	if(lib.config.replacecharacter[i]&&libCharacter&&libCharacter[lib.config.replacecharacter[i]]) return true;
                // 	if(lib.config.forbidall.includes(i)) return true;
                // 	if(!double_character&&get.rank(i,true)<=2){
                // 		return true;
                // 	}
                // }
                // if(lib.configOL.ban_strong&&get.rank(i,true)>=8){
                // 	return true;
                // }
            }
            else {
                if (lib.config.banned.includes(i)) return true;
                var double_character = false;
                if (get.mode() == 'guozhan') {
                    double_character = true;
                }
                else if (get.config('double_character') && (lib.config.mode == 'identity' || lib.config.mode == 'stone')) {
                    double_character = true;
                }
                else if (get.config('double_character_jiange') && (lib.config.mode == 'versus' && _status.mode == 'jiange')) {
                    double_character = true;
                }
                if (double_character && lib.config.forbiddouble.includes(i)) {
                    return true;
                }
                // if(get.config('ban_weak')){
                // 	if(lib.config.replacecharacter[i]&&lib.character[lib.config.replacecharacter[i]]) return true;
                // 	if(lib.config.forbidall.includes(i)) return true;
                // 	if(!double_character&&get.rank(i,true)<=2){
                // 		return true;
                // 	}
                // }
                // if(get.config('ban_strong')&&get.rank(i,true)>=8){
                // 	return true;
                // }
            }
        }
        ui.create.characterPackMenu = function (connectMenu) {
            /**
             * 由于联机模式会创建第二个菜单，所以需要缓存一下可变的变量
             */
            // const cacheMenuContainer = menuContainer;
            // const cachePopupContainer = popupContainer;
            const cacheMenux = menux;
            const cacheMenuxpages = menuxpages;
            /** @type { HTMLDivElement } */
            // @ts-ignore
            var start = cacheMenuxpages.shift();
            // 用于切换显示对应武将包所有武将的界面
            var rightPane = start.lastChild;

            var clickMode = function () {
                var active = this.parentNode.querySelector('.active');
                if (active) {
                    if (active === this) {
                        return;
                    }
                    active.classList.remove('active');
                    active.link.remove();
                }
                this.classList.add('active');
                updateActive(this);
                if (this.link) rightPane.appendChild(this.link);
                else {
                    this._initLink();
                    rightPane.appendChild(this.link);
                }
            };
            setUpdateActive(function (node) {
                if (!node) {
                    node = start.firstChild.querySelector('.active');
                    if (!node) {
                        return;
                    }
                }
                if (!node.link) {
                    node._initLink();
                }
                for (var i = 0; i < node.link.childElementCount; i++) {
                    if (node.link.childNodes[i].updateBanned) {
                        node.link.childNodes[i].updateBanned();
                    }
                }
            });
            var updateNodes = function () {
                for (var i = 0; i < start.firstChild.childNodes.length; i++) {
                    var node = start.firstChild.childNodes[i];
                    if (node.mode) {
                        if (node.mode.startsWith('mode_')) {
                            // 扩展武将包开启逻辑
                            if (node.mode.startsWith('mode_extension')) {
                                const extName = node.mode.slice(15);
                                if (!game.hasExtension(extName) || !game.hasExtensionLoaded(extName)) continue;
                                if (lib.config[`extension_${extName}_characters_enable`] == true) {
                                    node.classList.remove('off');
                                    if (node.link) node.link.firstChild.classList.add('on');
                                }
                                else {
                                    node.classList.add('off');
                                    if (node.link) node.link.firstChild.classList.remove('on');
                                }
                            }
                            continue;
                        }
                        if (node.mode == 'custom') continue;
                        if (connectMenu) {
                            if (!lib.config.connect_characters.includes(node.mode)) {
                                node.classList.remove('off');
                                if (node.link) node.link.firstChild.classList.add('on');
                            }
                            else {
                                node.classList.add('off');
                                if (node.link) node.link.firstChild.classList.remove('on');
                            }
                        }
                        else {
                            if (lib.config.characters.includes(node.mode)) {
                                node.classList.remove('off');
                                if (node.link) node.link.firstChild.classList.add('on');
                            }
                            else {
                                node.classList.add('off');
                                if (node.link) node.link.firstChild.classList.remove('on');
                            }
                        }
                    }
                }
            };
            var togglePack = function (bool) {
                var name = this._link.config._name;
                // 扩展武将包开启逻辑
                if (name.startsWith('mode_extension')) {
                    const extName = name.slice(15);
                    if (!game.hasExtension(extName) || !game.hasExtensionLoaded(extName)) return false;
                    game.saveExtensionConfig(extName, 'characters_enable', bool);
                }
                // 原逻辑
                else {
                    if (connectMenu) {
                        if (!bool) {
                            lib.config.connect_characters.add(name);
                        }
                        else {
                            lib.config.connect_characters.remove(name);
                        }
                        game.saveConfig('connect_characters', lib.config.connect_characters);
                    }
                    else {
                        if (bool) {
                            lib.config.characters.add(name);
                        }
                        else {
                            lib.config.characters.remove(name);
                        }
                        game.saveConfig('characters', lib.config.characters);
                    }
                }
                updateNodes();
            };

            var createModeConfig = function (mode, position, position2) {
                var _info = lib.characterPack[mode];
                var page = ui.create.div('');
                var node = ui.create.div('.menubutton.large', lib.translate[mode + '_character_config'], position, clickMode);
                if (node.innerHTML.length >= 5) {
                    node.classList.add('smallfont');
                }
                if (position2) {
                    position.insertBefore(node, position2);
                }
                node.mode = mode;
                node._initLink = function () {
                    node.link = page;
                    page.node = node;
                    var list = [];
                    var boolAI = true;
                    var alterableSkills = [];
                    var alterableCharacters = [];
                    var charactersToAlter = [];
                    for (var i in _info) {
                        // if (_info[i][4] && _info[i][4].includes('unseen')) continue;
                        if (connectMenu && lib.connectBanned.includes(i) && i !== 'shen_diaochan') continue;
                        list.push(i);
                        if (boolAI && !lib.config.forbidai_user.includes(i)) boolAI = false;
                        for (var j = 0; j < _info[i][3].length; j++) {
                            if (!lib.skill[_info[i][3][j]]) {
                                continue;
                            }
                            if (lib.skill[_info[i][3][j]].alter) {
                                alterableSkills.add(_info[i][3][j]);
                                alterableCharacters.add(i);
                                if (lib.config.vintageSkills.includes(_info[i][3][j])) {
                                    charactersToAlter.add(i);
                                }
                            }
                        }
                    }
                    alterableCharacters.sort();
                    list.sort(lib.sort.character);
                    var list2 = list.slice(0);
                    var cfgnode = createConfig({
                        name: '开启',
                        _name: mode,
                        init: (() => {
                            // 扩展武将包开启逻辑
                            if (mode.startsWith('mode_extension')) {
                                const extName = mode.slice(15);
                                if (!game.hasExtension(extName) || !game.hasExtensionLoaded(extName)) return false;
                                // 这块或许应该在加载扩展时候写
                                if (lib.config[`extension_${extName}_characters_enable`] === undefined) {
                                    game.saveExtensionConfig(extName, 'characters_enable', true);
                                }
                                return lib.config[`extension_${extName}_characters_enable`] === true;
                            }
                            // 原逻辑
                            else {
                                return connectMenu ? (!lib.config.connect_characters.includes(mode)) : (lib.config.characters.includes(mode));
                            }

                        })(),
                        onclick: togglePack
                    });
                    var cfgnodeAI = createConfig({
                        name: '仅点将可用',
                        _name: mode,
                        init: boolAI,
                        intro: '将该武将包内的武将全部设置为仅点将可用',
                        onclick(bool) {
                            if (bool) {
                                for (var i = 0; i < list.length; i++) {
                                    lib.config.forbidai_user.add(list[i]);
                                }
                            }
                            else {
                                for (var i = 0; i < list.length; i++) {
                                    lib.config.forbidai_user.remove(list[i]);
                                }
                            }
                            game.saveConfig('forbidai_user', lib.config.forbidai_user);
                        },
                    });
                    if (!mode.startsWith('mode_')) {
                        cfgnodeAI.style.marginTop = '0px';
                        page.appendChild(cfgnode);
                        page.appendChild(cfgnodeAI);
                        if (alterableCharacters.length) {
                            var cfgnode2 = createConfig({
                                name: '新版替换',
                                _name: mode,
                                init: charactersToAlter.length == 0,
                                intro: '以下武将将被修改：' + get.translation(alterableCharacters),
                                onclick(bool) {
                                    if (bool) {
                                        for (var i = 0; i < alterableSkills.length; i++) {
                                            lib.config.vintageSkills.remove(alterableSkills[i]);
                                            lib.translate[alterableSkills[i] + '_info'] = lib.translate[alterableSkills[i] + '_info_alter'];
                                        }
                                    }
                                    else {
                                        for (var i = 0; i < alterableSkills.length; i++) {
                                            lib.config.vintageSkills.add(alterableSkills[i]);
                                            lib.translate[alterableSkills[i] + '_info'] = lib.translate[alterableSkills[i] + '_info_origin'];
                                        }
                                    }
                                    game.saveConfig('vintageSkills', lib.config.vintageSkills);
                                }
                            });
                            cfgnode2.style.marginTop = '0px';
                            page.appendChild(cfgnode2);
                        }
                    }
                    else if (mode.startsWith('mode_extension')) {
                        // 排除4个基本扩展
                        // 再排除那个boss扩展的间隔包
                        // 给扩展的武将包加一个开启关闭的功能
                        if (!lib.config.all.stockextension.includes(mode.slice(15)) && mode != 'mode_extension_jiange') {
                            page.appendChild(cfgnode);
                        }
                        page.appendChild(cfgnodeAI);
                    }
                    else {
                        page.style.paddingTop = '8px';
                    }
                    var banCharacter = function (e) {
                        if (_status.clicked) {
                            _status.clicked = false;
                            return;
                        }
                        if (mode.startsWith('mode_') && !mode.startsWith('mode_extension_') &&
                            mode != 'mode_favourite' && mode != 'mode_banned') {
                            if (!connectMenu && lib.config.show_charactercard) {
                                ui.click.charactercard(this.link, this, mode == 'mode_guozhan' ? 'guozhan' : true);
                            }
                            return;
                        }
                        ui.click.touchpop();
                        this._banning = connectMenu ? 'online' : 'offline';
                        if (!connectMenu && lib.config.show_charactercard) {
                            ui.click.charactercard(this.link, this);
                        }
                        else {
                            ui.click.intro.call(this, e);
                        }
                        _status.clicked = false;
                        delete this._banning;
                    };
                    var updateBanned = function () {
                        var _list;
                        if (connectMenu) {
                            var mode = cacheMenux.pages[0].firstChild.querySelector('.active');
                            if (mode && mode.mode) {
                                _list = lib.config['connect_' + mode.mode + '_banned'];
                            }
                        }
                        else {
                            _list = lib.config[get.mode() + '_banned'];
                        }
                        if (_list && _list.includes(this.link)) {
                            this.classList.add('banned');
                        }
                        else {
                            this.classList.remove('banned');
                        }
                    };
                    if (lib.characterSort[mode]) {
                        var listb = [];
                        if (!connectMenu) {
                            listb = lib.config[get.mode() + '_banned'] || [];
                        }
                        else {
                            var modex = cacheMenux.pages[0].firstChild.querySelector('.active');
                            if (modex && modex.mode) {
                                listb = lib.config['connect_' + modex.mode + '_banned'];
                            }
                        }
                        for (var pak in lib.characterSort[mode]) {
                            var info = lib.characterSort[mode][pak];
                            var listx = [];
                            var boolx = false;
                            for (var ii = 0; ii < list2.length; ii++) {
                                if (info.includes(list2[ii])) {
                                    listx.add(list2[ii]);
                                    if (!listb.includes(list2[ii])) boolx = true;
                                    list2.splice(ii--, 1);
                                }
                            }
                            if (listx.length) {
                                var cfgnodeY = {
                                    name: lib.translate[pak],
                                    _name: pak,
                                    init: boolx,
                                    onclick(bool) {
                                        var banned = [];
                                        if (connectMenu) {
                                            var modex = cacheMenux.pages[0].firstChild.querySelector('.active');
                                            if (modex && modex.mode) {
                                                banned = lib.config['connect_' + modex.mode + '_banned'];
                                            }
                                        }
                                        else if (_status.connectMode) return;
                                        else banned = lib.config[get.mode() + '_banned'] || [];
                                        var listx = lib.characterSort[mode][this._link.config._name];
                                        if (bool) {
                                            for (var i = 0; i < listx.length; i++) {
                                                banned.remove(listx[i]);
                                            }
                                        }
                                        else {
                                            for (var i = 0; i < listx.length; i++) {
                                                banned.add(listx[i]);
                                            }
                                        }
                                        game.saveConfig(connectMenu ? ('connect_' + modex.mode + '_banned') : (get.mode() + '_banned'), banned);
                                        updateActive();
                                    },
                                };
                                if (mode.startsWith('mode_') && !mode.startsWith('mode_extension_') && !mode.startsWith('mode_guozhan')) {
                                    cfgnodeY.clear = true;
                                    delete cfgnodeY.onclick;
                                }
                                var cfgnodeX = createConfig(cfgnodeY);
                                page.appendChild(cfgnodeX);
                                var buttons = ui.create.buttons(listx, 'character', page);
                                for (var i = 0; i < buttons.length; i++) {
                                    buttons[i].classList.add('noclick');
                                    buttons[i].listen(banCharacter);
                                    ui.create.rarity(buttons[i]);
                                    buttons[i].node.hp.style.transition = 'all 0s';
                                    buttons[i].node.hp._innerHTML = buttons[i].node.hp.innerHTML;
                                    if (mode != 'mode_banned') {
                                        buttons[i].updateBanned = updateBanned;
                                    }
                                }
                            }
                        }
                        if (list2.length) {
                            var cfgnodeX = createConfig({
                                name: '其他',
                                _name: 'others',
                                clear: true,
                            });
                            page.appendChild(cfgnodeX);
                            var buttons = ui.create.buttons(list2, 'character', page);
                            for (var i = 0; i < buttons.length; i++) {
                                buttons[i].classList.add('noclick');
                                buttons[i].listen(banCharacter);
                                ui.create.rarity(buttons[i]);
                                buttons[i].node.hp.style.transition = 'all 0s';
                                buttons[i].node.hp._innerHTML = buttons[i].node.hp.innerHTML;
                                if (mode != 'mode_banned') {
                                    buttons[i].updateBanned = updateBanned;
                                }
                            }
                        }
                    }
                    else {
                        var buttons = ui.create.buttons(list, 'character', page);
                        for (var i = 0; i < buttons.length; i++) {
                            buttons[i].classList.add('noclick');
                            ui.create.rarity(buttons[i]);
                            buttons[i].listen(banCharacter);
                            buttons[i].node.hp.style.transition = 'all 0s';
                            buttons[i].node.hp._innerHTML = buttons[i].node.hp.innerHTML;
                            if (mode != 'mode_banned') {
                                buttons[i].updateBanned = updateBanned;
                            }
                        }
                    }
                    page.classList.add('menu-buttons');
                    page.classList.add('leftbutton');
                    if (!connectMenu) {
                        if (lib.config.all.sgscharacters.includes(mode)) {
                            ui.create.div('.config.pointerspan', '<span style="opacity:0.5">该武将包不可被隐藏</span>', page);
                        }
                        else if (!mode.startsWith('mode_')) {
                            ui.create.div('.config.pointerspan', '<span>隐藏武将包</span>', page, function () {
                                if (this.firstChild.innerHTML == '隐藏武将包') {
                                    if (confirm('真的要隐藏“' + get.translation(mode + '_character_config') + '”武将包吗？\n建议使用“关闭”而不是“隐藏”功能，否则将会影响其他相关武将包的正常运行！')) {
                                        this.firstChild.innerHTML = '武将包将在重启后隐藏';
                                        lib.config.hiddenCharacterPack.add(mode);
                                        if (!lib.config.prompt_hidepack) {
                                            alert('隐藏的扩展包可通过选项-其它-重置隐藏内容恢复');
                                            game.saveConfig('prompt_hidepack', true);
                                        }
                                    }
                                }
                                else {
                                    this.firstChild.innerHTML = '隐藏武将包';
                                    lib.config.hiddenCharacterPack.remove(mode);
                                }
                                game.saveConfig('hiddenCharacterPack', lib.config.hiddenCharacterPack);
                            });
                        }
                    }
                };
                if (!get.config('menu_loadondemand')) node._initLink();
                return node;
            };
            if (lib.config.show_favourite_menu && !connectMenu && Array.isArray(lib.config.favouriteCharacter)) {
                lib.characterPack.mode_favourite = {};
                for (var i = 0; i < lib.config.favouriteCharacter.length; i++) {
                    var favname = lib.config.favouriteCharacter[i];
                    if (lib.character[favname]) {
                        lib.characterPack.mode_favourite[favname] = lib.character[favname];
                    }
                }
                var favouriteCharacterNode = createModeConfig('mode_favourite', start.firstChild);
                if (!favouriteCharacterNode.link) favouriteCharacterNode._initLink();
                ui.favouriteCharacter = favouriteCharacterNode.link;
                if (get.is.empty(lib.characterPack.mode_favourite)) {
                    ui.favouriteCharacter.node.style.display = 'none';
                }
                delete lib.characterPack.mode_favourite;
            }
            if (!connectMenu && lib.config.show_ban_menu) {
                lib.characterPack.mode_banned = {};
                for (var i = 0; i < lib.config.all.mode.length; i++) {
                    var banned = lib.config[lib.config.all.mode[i] + '_banned'];
                    if (banned) {
                        for (var j = 0; j < banned.length; j++) {
                            if (lib.character[banned[j]]) {
                                lib.characterPack.mode_banned[banned[j]] = lib.character[banned[j]];
                            }
                        }
                    }
                }
                var bannednode = createModeConfig('mode_banned', start.firstChild);
                if (get.is.empty(lib.characterPack.mode_banned)) {
                    bannednode.style.display = 'none';
                }
                delete lib.characterPack.mode_banned;
            }
            var characterlist = connectMenu ? lib.connectCharacterPack : lib.config.all.characters;
            for (var i = 0; i < characterlist.length; i++) {
                createModeConfig(characterlist[i], start.firstChild);
            }
            if (!connectMenu) Object.keys(lib.characterPack).forEach(key => {
                // 单机模式下显示不在lib.config.all.characters里的武将包
                if (!characterlist.includes(key)) createModeConfig(key, start.firstChild);
                if (connectMenu) lib.connectCharacterPack.add(key);
            });
            var active = start.firstChild.querySelector('.active');
            if (!active) {
                active = start.firstChild.firstChild;
                if (active.style.display == 'none') {
                    active = active.nextSibling;
                    if (active.style.display == 'none') {
                        active = active.nextSibling;
                    }
                }
                active.classList.add('active');
                updateActive(active);
            }
            if (!active.link) active._initLink();
            rightPane.appendChild(active.link);

            if (!connectMenu) {
                // 下面使用了var的特性，请不要在这里直接改为let
                var node1 = ui.create.div('.lefttext', '全部开启', start.firstChild, function () {
                    game.saveConfig('characters', lib.config.all.characters);
                    updateNodes();
                });
                var node2 = ui.create.div('.lefttext', '恢复默认', start.firstChild, function () {
                    game.saveConfig('characters', lib.config.defaultcharacters);
                    updateNodes();
                });
                node1.style.marginTop = '12px';
                node2.style.marginTop = '7px';
            }

            updateNodes();

            /**
             * 在菜单栏初始化完成后，如果又加载了武将包，进行刷新
             * 
             * @param { string } packName
             */
            return function (packName) {
                // 判断菜单栏有没有加载过这个武将包
                if ([...start.firstChild.children].map(node => node.mode).includes(packName)) return;
                // 显示不是无名杀自带的武将包
                if (!lib.connectCharacterPack.includes(packName) && !lib.config.all.characters.includes(packName)) {
                    createModeConfig(packName, start.firstChild, node1);
                    if (connectMenu) lib.connectCharacterPack.add(packName);
                }
            }
        }
    },
    colorSelect() {
        const usys = ui.create.system//我就偷偷拦截你一下
        ui.create.system = function (str, func, right, before) {
            const sys = usys('<input type="color" style="width:40px;height:20px;" value="#ffffff">')
            ui.colorSelect = sys.querySelector('input')
            ui.create.system = usys
            return usys.call(this, str, func, right, before)
        }
        const leps = lib.element.player.say
        lib.element.player.say = function (str) {
            str = `<span style="color:${ui.colorSelect.value};">${str}</span>`
            return leps.call(this, str)
        }
    },
    noAllReplace() { },
    selectGameDraw() {
        lib.element.content.gameSelect = suiSet.gameSelect
    },
    floatBall() {
        suiSet.createFloatBall()
    },
    diereceive() {
        lib.skill._diereceive = {
            trigger: { player: "dieBegin" },
            async content(event, trigger, player) {
                trigger.cancel()
                const hp = lib.character[player.name1].hp
                await player.recoverTo(hp)
                await player.discard(player.getCards('hej'))
                await player.drawTo(parseInt(lib.config['extension_联机修改_fun_beginDraw']) || 4)
                if (!player.dienum) player.dienum = 0
                player.dienum++
                if (!ui.endGame) {
                    const dienums = game.players.map(p => p.dienum || 0)
                    ui.endGame = ui.create.system('结束游戏', () => {
                        if (Math.max(...dienums) === game.me.dienum) {
                            game.over(false)
                        } else if (Math.min(...dienums) === game.me.dienum) {
                            game.over(true)
                        } else {
                            game.over("游戏平局")
                        }
                    }, true)
                }
            }
        }
    },
}
suiSet.mainConfig.forEach(f => {
    if (lib.config['extension_联机修改_' + f]) {
        functions[f.slice(5)]()
    }
})
suiSet.editConfig.forEach(e => {
    if (lib.config['extension_联机修改_' + e]) {
        edits[e.slice(5)]()
    }
})

for (const s in suiSet.globalSkills) lib.skill[s] = suiSet.globalSkills[s]

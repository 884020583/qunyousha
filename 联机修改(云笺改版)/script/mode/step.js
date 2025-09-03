const initPlayers = game.players.map(p => { if (p.ws) return [p, p.ws.avatar] }).filter(Boolean)
game.broadcastAll((players, { me, name, avatar }) => {
    players.forEach(([player, avatar]) => {
        const character = lib.character[avatar] || ['male', 'qun', 4, [], []]
        const nickname = player.nickname
        const id = nickname + player.playerid
        lib.character[id] = character.slice()
        lib.character[id][2] = 4
        lib.character[id][3] = []
        if (!lib.character[id][4]) {
            lib.character[id][4] = []
        }
        lib.character[id][4].remove('hiddenSkill')
        lib.character[id][4].push(`character:${avatar}`)
        lib.translate[id] = nickname.replace('※', '')
        player.init(id)
        player.update()
    })
    name = name.replace('※', '')
    const id = name + me.playerid
    lib.character[id] = (lib.character[avatar] || ['male', 'qun', 4, [], []]).slice()
    lib.character[id][2] = 4
    lib.character[id][3] = []
    lib.character[id][4].remove('hiddenSkill')
    lib.translate[id] = name
    lib.character[id][4].push(`character:${avatar}`)
    me.init(id)
    me.update()
}, initPlayers, { me: game.me, name: lib.config.connect_nickname, avatar: lib.config.connect_avatar })
const next = game.createEvent('chooseCharacter')
_status.characterListSelect = Object.keys(suiSet.initList());
next.setContent(() => {
    'step 0'
    const characterList = _status.characterListSelect
    _status.playerCharacters = {}
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
    let identityList = get.identityList(game.players.length);
    identityList = identityList.randomSort()

    game.zhu = game.players.randomGet()
    identityList = identityList.remove('zhu')
    const anothplayers = game.players.filter(p => p != game.zhu)
    anothplayers.forEach((p, i) => {
        game.broadcastAll((p, id) => {
            if (p !== game.me) {
                p.setIdentity('cai')
                p.node.identity.classList.add('guessing');
            } else {
                game.me.setIdentity(id)
                game.me.node.identity.classList.add(id)
                game.me.identity = id
            }
            p.identity = id
        }, p, identityList[i])
    })
    game.broadcastAll((list, innerHTML) => {
        ui.arena.classList.add('choose-character');
        const style = document.createElement('style')
        style.innerHTML = innerHTML
        document.head.appendChild(style)
        game.players.forEach((p, i) => {
            p.node.rightskillList = ui.create.div('.playerskillList', p)
            if (!p.nickname) {//||(p.ws&&!p.isOnline2())
                lib.character[list[i]][3] = []
                lib.character[list[i]][2] = 4
                p.init(list[i])
            }
        })
        game.me.update()
    }, characterList.randomGets(10), _status.style.innerHTML)
    let num = suiSet.getSelect(characterList)
    event.list = characterList
    _status.characterlist = characterList.slice()
    const map = {}
    let skillList = []
    const skillList2 = []

    // const some = characterList.randomRemove(num)
    characterList.forEach(s => {
        const theSkills = lib.character[s][3]
        theSkills.forEach(t => {
            const info = lib.skill[t]
            if (!info) return
            if (info.equipSkill) return;
            const derivation = (Array.isArray(info.derivation) ? [...theSkills, ...info.derivation] : [...theSkills, info.derivation]).filter(Boolean)
            derivation.forEach(is => {
                const groupSkill = lib.skill[is]
                if (!groupSkill) return;
                const { subSkill, global, viewAs, chooseButton, mod, charlotte, equipSkill, content, nopop, dutySkill, hiddenSkill, juexingji, zhuSkill } = groupSkill
                if (!skillList2.includes(is) && !charlotte && !equipSkill && (subSkill || global || content || viewAs || chooseButton || mod) && !nopop && !dutySkill && !hiddenSkill && !juexingji && !zhuSkill) {
                    skillList.push({ skill: is, name: s })
                    skillList2.push(is)
                }
            })
        })
    })
    game.players.forEach(p => {
        const skills = skillList.randomRemove(num)
        if (!map[p.playerid]) map[p.playerid] = {}
        skills.forEach(({ skill, name }) => {
            map[p.playerid][skill] = name
        })
    })
    game.broadcastAll((target) => {
        target.setIdentity('zhu')
        target.identity = 'zhu'
        target.showIdentity();
        target.isZhu = true;
        target.seatNum = 1
        target.identityShown = true;
        game.zhu = target
        // target.maxHp++
        // target.hp++
    }, game.zhu)
    event.map = map;
    ui.arena.classList.add('choose-character');
    event.videoId = lib.status.videoId++;
    event.chooseTime = lib.configOL.choose_timeout
    game.broadcastAll((map, id, time) => {
        lib.configOL.choose_timeout = time
        for (const s in map) {
            const player = map[s]
            const skill_name = Object.entries(player);
            skill_name.forEach(i => {
                lib.card[i[0]] = {
                    fullimage: true,
                    image: 'character:' + i[1]
                }
            })
        }
        let str = ''
        if (game.me !== game.zhu) {
            str = '请等待主公选将<br>'
        } else {
            str = '本局你是主公，请先选择两个技能<br>'
        }
        const list = Object.keys(map[game.me.playerid])
        const dialog = ui.create.dialog(`${str}你的技能框↓<br>注意看武将旁边的技能而不是武将原画`, [list, 'vcard'])
        dialog.videoId = id;
        dialog.classList.add('chooseSkills')
    }, map, event.videoId, lib.configOL.identity_more_time);
    if (event.target != game.me || !event.target.isOnline()) game.delay(2);
    'step 1'
    const next = game.zhu.chooseButton(true).set('ai', Math.random)
    next.set('selectButton', 2);
    'step 2'
    const skills = result.links.map(p => p[2])
    const players = game.players.filter(p => p !== game.zhu)
    game.broadcastAll((target, players, skills) => {
        game.zhu.addSkill(skills)
        lib.character[game.zhu.name1][3] = skills
        let str = ''
        skills.forEach(s => str += get.translation(s) + ' ')
        target.node.rightskillList.innerHTML = str

        game.players.forEach(p => {
            const { x } = p.getBoundingClientRect()
            if (ui.window.clientWidth - x < 200) {
                p.classList.add('rightPlayer')
            } else if (x > 0 && x < 400) {
                p.classList.add('leftPlayer')
            }
        })
    }, game.zhu, players, skills)
    'step 3'
    game.broadcastAll('closeDialog', event.videoId)
    game.broadcastAll(() => {
        const dialog = ui.arena.querySelector('.dialog.scroll1.scroll2')
        if (dialog) dialog.remove()
    })
    const list = [];
    const anothPlayer = game.players.filter(p => p !== game.zhu)
    for (let i = 0; i < anothPlayer.length; i++) {
        const player = anothPlayer[i]
        const skillList = Object.keys(event.map[player.playerid])
        list.push([player, ['选择技能', [skillList, 'vcard']], 2, true]);
    }
    game.me.chooseButtonOL(list);
    'step 4'
    for (const r in result) {
        const player = lib.playerOL[r]
        const skills = result[r].links.map(s => s[2])
        game.broadcastAll((player, skills) => {
            let str = ''
            skills.forEach(s => str += get.translation(s) + ' ')
            player.node.rightskillList.innerHTML = str
            if (player.nickname) {
                lib.translate[player.name1] = player.nickname.replace('※', '')
            }
        }, player, skills)
        player.addSkill(skills)
        lib.character[player.name1][3] = skills
        game.log(`${player.node.name.innerHTML}选择了`, skills)
    }

    //选形象
    const avatarMap = _status.characterListSelect.slice()
    const playerAvatarMap = {}
    game.players.forEach(p => playerAvatarMap[p.playerid] = avatarMap.randomRemove(20))

    const avatarList = [];
    game.players.forEach(player => {
        const list = playerAvatarMap[player.playerid]
        avatarList.push([player, ['<span style="color:red;font-weight:700;">你可以选择一个武将作为你本局的形象</span>', [list, 'characterx']], 1, false])
    })
    game.me.chooseButtonOL(avatarList).set('switchToAuto', function () {
        _status.event.result = 'ai';
    }).set('processAI', function () {
        return false
    })
    'step 5'
    for (const i in result) {
        const bool = result[i]
        if (!bool.bool) continue
        game.broadcastAll((player, avatar) => {
            const nickname = player.nickname || player.node.name1.innerText
            const character = lib.character[avatar] || ['male', 'qun', 4, [], []]
            const id = nickname + player.playerid
            lib.character[id] = character.slice()
            lib.character[id][2] = 4
            lib.character[id][3] = []
            if (!lib.character[id][4]) {
                lib.character[id][4] = []
            }
            lib.character[id][4].remove('hiddenSkill')
            lib.character[id][4].push(`character:${avatar}`)
            lib.translate[id] = nickname.replace('※', '')
            player.node.avatar.setBackground(id, 'character')
            // player.init(id)
            player.update()
        }, lib.playerOL[i], result[i].links[0])
    }

    //选势力
    const select = lib.group.map(g => ['', '', `group_${g}`])
    const groupList = game.players.map(i => {
        return [i, ['你可以选择一个势力', [select, 'vcard']], 1, false]
    })
    game.me.chooseButtonOL(groupList, (player, result) => {
        if (player == game.me) player.changeGroup(result.links[0][2].slice(6), false, false);
    })
    'step 6'
    for (const g in result) {
        const player = lib.playerOL[g]
        const group = result[g].links[0][2].slice(6)
        game.broadcast((player, group) => {
            lib.character[player.name1][1] = group
            player.changeGroup(group)
        }, player, group)
    }

    game.players.forEach(p => {
        _status.playerCharacters[p.playerid] = {
            player: p,
            skills: lib.character[p.name1][3],
            name: (p.nickname && p.nickname.replace('※', '')) || '',
            character: p.name1,
            info: lib.character[p.name1],
            group: p.group
        }
    })
    _status.playerCharactersUse = (characters, innnerHtml) => {
        lib.skill.playerchangeSkill = {
            trigger: { player: 'changeSkillsAfter' },
            forced: true,
            charlotte: true,
            popup: false,
            filter() { return true },
            async content(event, trigger, player) {
                let str = ''
                const skills = player.getSkills(null, false, false);
                skills.forEach(i => {
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
        const style = document.createElement('style')
        style.innerHTML = innnerHtml
        document.head.appendChild(style)
        for (const s in characters) {
            const { skills, name, character, info, group } = characters[s]
            skills.push('playerchangeSkill')
            lib.character[character] = info
            const thecharacter = lib.character[character]
            if (!thecharacter) continue
            thecharacter[1] = group
            thecharacter[4].remove('hiddenSkill')
            thecharacter[3] = skills
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
                skills.forEach(s => str += get.translation(s) + ' ')
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
            //game.addGlobalSkill('playerchangeSkill')
            ui.create.me = oldme
            return me
        }
    }
    game.broadcastAll(time => {
        game.zhu.maxHp++
        game.zhu.hp++
        game.zhu.update()
        lib.configOL.choose_timeout = time
        ui.arena.classList.remove('choose-character');
        lib.skill.playerchangeSkill = {
            trigger: { player: 'changeSkillsAfter' },
            forced: true,
            charlotte: true,
            popup: false,
            filter() { return true },
            async content(event, trigger, player) {
                let str = ''
                const skills = player.getSkills(null, false, false);
                skills.forEach(i => {
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
    }, event.chooseTime)
    game.players.forEach(p => p.addSkill('playerchangeSkill'))
})
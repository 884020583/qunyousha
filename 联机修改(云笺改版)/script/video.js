const { lib, game, ui, get, ai, _status } = suiSet
game.videoContent.addStyle = function({style,globalSkills}){
    const system = ui.create.system('<span style="color:skyblue;">录像暂停</span>',()=>{
        if(system.innerText==='录像暂停'){
            game.pause2()
            system.innerHTML = '<span style="color:red;">录像播放</span>'
        }else {
            system.innerHTML='<span style="color:skyblue;">录像暂停</span>'
            game.resume2()
        }
    })
    game.players.forEach(p=>{
        p.node.count.innerHTML = '0'
        p.addEventListener(lib.config.touchscreen ? "touchstart" : "mousedown",function(){
            if(this!==game.me){
                game.swapPlayer(this,game.me)
            }
        })
    })
    game.delay(3)
    game.videoContent.init = ()=>{}
    const styleElement = document.createElement('style')
    styleElement.innerHTML = style.innerHTML
    document.head.appendChild(styleElement)
    for(const skill in globalSkills){
        lib.skill[skill]=globalSkills[skill]
    }
}
game.videoContent.characterMap = function({playerMap,map,replace,ids,id,nicknames}){
    _status.videoId = id
    game.players.forEach((p,i)=>{
        p.node.rightskillList = ui.create.div('.playerskillList', p)
        p.playerid = ids[i]
        p.nickname = nicknames[i]
        p.setNickname(nicknames[i])
    })
    _status.skillMap = map
    for(const m in map){
        if(m.includes('_skill')){
            lib.card[m] = {
                fullimage: true,
                cardimage: m.slice(0,-6)
            }
            lib.translate[m+"_info"] = lib.translate[m.slice(0,-6)+"_info"]
        }else {
            lib.card[m] = {
                fullimage: true,
                image: 'character:' + map[m]
            }
        }
    }

    lib.skillReplace=replace
    let str = ''
    if (game.me !== game.zhu) {
        str = '请等待主公选将<br>'
    } else {
        str = '本局你是主公，请先选择两个技能<br>'
    }
    const list = Object.keys(playerMap[game.me.playerid])
    const dialog = ui.create.dialog(`${str}你的技能框↓<br>注意看武将旁边的技能而不是武将原画`, [list, 'vcardx'])
    dialog.classList.add('chooseSkills')
    dialog.videoId = id;
    game.delay(5)
}
game.videoContent.initSkill = function(player,{skills,zhu,me,str}){
    lib.character[player.name1].skills = skills
    player.skills = skills
    if(zhu){
        game.zhu = player
        game.zhu.setIdentity('zhu')
    }
    if(me&&game.me.identity){
        game.me.setIdentity(game.me.identity)
    }
    if(!str) {
        str = ''
        skills.forEach(s => str += get.translation(s) + ' ')
    }
    if(!player.node.rightskillList){
        player.node.rightskillList = ui.create.div('.playerskillList',str, player)
    }
    player.node.rightskillList.innerHTML = str
}
game.videoContent.say = function(player,{nickname,str}){
    if(!player) return
    if(!player.nickname){
        player.nickname = nickname
    }
    if(player.say){
        player.say(str)
    }
}
game.videoContent.danmu = function({prefix,name,str}){
    if(ui.create.danmu){
        ui.create.danmu(prefix,name,str)
    }
}
game.videoContent.initAvatar = function({avatar,nickname,playerid}){
    nickname = nickname.replace('※', '')
    suiSet.copyCharacter({
        character:avatar,
        hp:4,
        skills:[],
        name:nickname + playerid,
        translate:nickname
    })
}
game.videoContent.flashAvatar = function(player,{avatar,skills}){
    const nickname = player.nickname.replace('※', '')
    const id = nickname + player.playerid
    suiSet.copyCharacter({
        character:avatar,
        hp:4,
        skills:[],
        name:id,
        translate:nickname
    })
    lib.character[id].skills = skills
    player.init(id)
}
game.videoContent.flashName = function(player,{avatar,tempName}){
    player.tempName = tempName
    lib.translate[avatar] = tempName
    player.node.name.innerHTML = tempName
}
game.videoContent.flashGroup = function(player,{group}){
    lib.character[player.name1].group = group
    player.changeGroup(group)
}
game.videoContent.replaceHandCards = function(player,{bool,num}){
    let pro
    if (bool) {
        pro = player.chooseCard('h', `你可以选择一些手牌置换<br>（还剩${num}次置换的机会）`, false, [1, Infinity])
    } else {
        pro = player.chooseBool(`是否置换手牌？（还剩${num}次）`);
    }
    pro.waitIng = true
    setTimeout(()=>{
        if(_status.event.waitIng){
            ui.click.cancel()
        }
    },3000);
}
game.videoContent.resume = function(){
    game.resume()
}
game.videoContent.closeDialog = function(){
    game.broadcastAll('closeDialog', _status.videoId)
}
game.videoContent.cardInfo = function({eventInfo,cardInfo}){
    const node = ui.thrown.find(c=>c.name === cardInfo.name && c.number === cardInfo.number && c.suit === cardInfo.suit)
    if(node&&node.node){
        if(!node.node.cardsetion){
            node.node.cardsetion = ui.create.div('.cardsetion',eventInfo,node)
        }else {
            node.node.cardsetion.innerHTML = eventInfo||playername
        }
    }
}
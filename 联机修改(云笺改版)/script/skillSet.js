import { lib,game,ui,get,ai,_status } from '../../../noname.js';
lib.skill.rehuashen = {
    unique:true,
    audio:2,
    trigger:{
        global:'phaseBefore',
        player:['enterGame','phaseBegin','phaseEnd','rehuashen'],
    },
    filter:function(event,player,name){
        if(event.name!='phase') return true;
        if(name=='phaseBefore') return game.phaseNumber==0;
        return player.storage.rehuashen&&player.storage.rehuashen.character.length>0;
    },
    direct:true,
    content:function(){
        "step 0"
        var name=event.triggername;
        if(trigger.name!='phase'||(name=='phaseBefore'&&game.phaseNumber==0)){
            player.logSkill('rehuashen');
            lib.skill.rehuashen.addHuashens(player,3);
            event.logged=true;
        }
        _status.noclearcountdown=true;
        event.videoId=lib.status.videoId++;
        var cards=player.storage.rehuashen.character.slice(0);
        var skills=[];
        var sto=player.storage.rehuashen;
        for(var i in player.storage.rehuashen.map){
            skills.addArray(player.storage.rehuashen.map[i]);
        }
        var cond='out';
        if(event.triggername=='phaseBegin'){
            cond='in';
        }
        skills.randomSort();
        skills.sort(function(a,b){
            return get.skillRank(b,cond)-get.skillRank(a,cond);
        });
        event.aiChoice=skills[0];
        var choice='更换技能';
        if(event.aiChoice==player.storage.rehuashen.current2||get.skillRank(event.aiChoice,cond)<1) choice='弃置化身';
        if(player.isOnline2()){
            player.send(function(cards,id){
                var dialog=ui.create.dialog('是否发动【化身】？',[cards,(item,type,position,noclick,node)=>lib.skill.rehuashen.$createButton(item,type,position,noclick,node)]);
                dialog.videoId=id;
            },cards,event.videoId);
        }
        event.dialog=ui.create.dialog(get.prompt('rehuashen'),[cards,(item,type,position,noclick,node)=>lib.skill.rehuashen.$createButton(item,type,position,noclick,node)]);
        event.dialog.videoId=event.videoId;
        if(!event.isMine()){
            event.dialog.style.display='none';
        }
        if(event.logged) event._result={control:'更换技能'};
        else player.chooseControl('弃置化身','更换技能','cancel2').set('ai',function(){
            return _status.event.choice;
        }).set('choice',choice);
        "step 1"
        event.control=result.control;
        if(event.control=='cancel2'){
            if(player.isOnline2()){
                player.send('closeDialog',event.videoId);
            }
            delete _status.noclearcountdown;
            if(!_status.noclearcountdown){
                game.stopCountChoose();
            }
            event.dialog.close();
            event.finish();return;
        }
        if(!event.logged){player.logSkill('rehuashen');event.logged=true}
        var next=player.chooseButton(true).set('dialog',event.videoId);
        if(event.control=='弃置化身'){
            next.set('selectButton',[1,2]);
            next.set('filterButton',function(button){
                return button.link!=_status.event.current;
            });
            next.set('current',player.storage.rehuashen.current);
        }
        else{
            next.set('ai',function(button){
                return player.storage.rehuashen.map[button.link].includes(_status.event.choice)?2.5:1+Math.random();
            });
            next.set('choice',event.aiChoice);
        }
        var prompt=event.control=='弃置化身'?'选择制衡至多两张化身':'选择要切换的化身';
        var func=function(id,prompt){
            var dialog=get.idDialog(id);
            if(dialog){
                dialog.content.childNodes[0].innerHTML=prompt;
            }
        }
        if(player.isOnline2()){
            player.send(func,event.videoId,prompt);
        }
        else if(event.isMine()){
            func(event.videoId,prompt);
        }
        "step 2"
        if(result.bool&&event.control!='弃置化身'){
            event.card=result.links[0];
            var func=function(card,id){
                var dialog=get.idDialog(id);
                if(dialog){
                    for(var i=0;i<dialog.buttons.length;i++){
                        if(dialog.buttons[i].link==card){
                            dialog.buttons[i].classList.add('selectedx');
                        }
                        else{
                            dialog.buttons[i].classList.add('unselectable');
                        }
                    }
                }
            }
            if(player.isOnline2()){
                player.send(func,event.card,event.videoId);
            }
            else if(event.isMine()){
                func(event.card,event.videoId);
            }
            var list=player.storage.rehuashen.map[event.card].slice(0);
            list.push('返回');
            player.chooseControl(list).set('choice',event.aiChoice).set('ai',function(){
                return _status.event.choice;
            });
        }
        else{
            lib.skill.rehuashen.removeHuashen(player,result.links.slice(0));
            lib.skill.rehuashen.addHuashens(player,result.links.length);
        }
        "step 3"
        if(result.control=='返回'){
            var func=function(id){
                var dialog=get.idDialog(id);
                if(dialog){
                    for(var i=0;i<dialog.buttons.length;i++){
                        dialog.buttons[i].classList.remove('selectedx');
                        dialog.buttons[i].classList.remove('unselectable');
                    }
                }
            }
            if(player.isOnline2()){
                player.send(func,event.videoId);
            }
            else if(event.isMine()){
                func(event.videoId);
            }
            event._result={control:'更换技能'};
            event.goto(1);
            return;
        }
        if(player.isOnline2()){
            player.send('closeDialog',event.videoId);
        }
        event.dialog.close();
        delete _status.noclearcountdown;
        if(!_status.noclearcountdown){
            game.stopCountChoose();
        }
        if(event.control=='弃置化身') return;
        if(player.storage.rehuashen.current!=event.card){
            const old=player.storage.rehuashen.current;
            player.storage.rehuashen.current=event.card;
            game.broadcastAll(function(player,character,old){
                player.tempname.remove(old);
                player.tempname.add(character);
                player.sex=lib.character[character][0];
            },player,event.card,old);
            game.log(player,'将性别变为了','#y'+get.translation(lib.character[event.card][0])+'性');
            player.changeGroup(lib.character[event.card][1]);
        }
        var link=result.control;
        player.storage.rehuashen.current2=link;
        if(!player.additionalSkills.rehuashen||!player.additionalSkills.rehuashen.includes(link)){
            player.addAdditionalSkills('rehuashen',link);
            player.flashAvatar('rehuashen',event.card);
            player.syncStorage('rehuashen');
            player.updateMarks('rehuashen');
            // lib.skill.rehuashen.createAudio(event.card,link,'re_zuoci');
        }
    },
    init:function(player,skill){
        if(!player.storage[skill]) player.storage[skill]={
            character:[],
            map:{},
        }
        player.when('dieBegin').then(()=>{
            const name=player.name?player.name:player.name1;
            if(name){
                const sex=get.character(name,0);
                const group=get.character(name,1);
                if(player.sex!=sex){
                    game.broadcastAll((player,sex)=>{
                        player.sex=sex;
                    },player,sex);
                    game.log(player,'将性别变为了','#y'+get.translation(sex)+'性');
                }
                if(player.group!=group) player.changeGroup(group);
            }
        });
    },
    banned:['lisu','sp_xiahoudun','xushao','jsrg_xushao','zhoutai','old_zhoutai','shixie','xin_zhoutai','dc_shixie','old_shixie'],
    bannedType:['Charlotte','主公技','觉醒技','限定技','隐匿技','使命技'],
    addHuashen:function(player){
        if(!player.storage.rehuashen) return;
        if(!_status.characterlist){
            lib.skill.pingjian.initList();
        }
        _status.characterlist.randomSort();
        for(let i=0;i<_status.characterlist.length;i++){
            let name=_status.characterlist[i];
            if(name.indexOf('zuoci')!=-1||name.indexOf('key_')==0||name.indexOf('sp_key_')==0||get.is.double(name)||lib.skill.rehuashen.banned.includes(name)||player.storage.rehuashen.character.includes(name)) continue;
            let skills=lib.character[name][3].filter(skill=>{
                const categories=get.skillCategoriesOf(skill);
                return !categories.some(type=>lib.skill.rehuashen.bannedType.includes(type));
            })
            if(skills.length){
                player.storage.rehuashen.character.push(name);
                player.storage.rehuashen.map[name]=skills;
                _status.characterlist.remove(name);
                return name;
            }
        }
    },
    addHuashens:function(player,num){
        var list=[];
        for(var i=0;i<num;i++){
            var name=lib.skill.rehuashen.addHuashen(player);
            if(name) list.push(name);
        }
        if(list.length){
            player.syncStorage('rehuashen');
            player.updateMarks('rehuashen');
            game.log(player,'获得了',get.cnNumber(list.length)+'张','#g化身');
            lib.skill.rehuashen.drawCharacter(player,list);
        }
    },
    removeHuashen:function(player,links){
        player.storage.rehuashen.character.removeArray(links);
        _status.characterlist.addArray(links);
        game.log(player,'移去了',get.cnNumber(links.length)+'张','#g化身')
    },
    drawCharacter:function(player,list){
        game.broadcastAll(function(player,list){
            if(player.isUnderControl(true)){
                var cards=[];
                for(var i=0;i<list.length;i++){
                    var cardname='huashen_card_'+list[i];
                    lib.card[cardname]={
                        fullimage:true,
                        image:'character:'+list[i]
                    }
                    lib.translate[cardname]=get.rawName2(list[i]);
                    cards.push(game.createCard(cardname,'',''));
                }
                player.$draw(cards,'nobroadcast');
            }
        },player,list);
    },
    $createButton:function(item,type,position,noclick,node){
        node=ui.create.buttonPresets.character(item,'character',position,noclick);
        const info=lib.character[item];
        const skills=info[3].filter(function(skill){
            const categories=get.skillCategoriesOf(skill);
            return !categories.some(type=>lib.skill.rehuashen.bannedType.includes(type));
        });
        if(skills.length){
            const skillstr=skills.map(i=>`[${get.translation(i)}]`).join('<br>');
            const skillnode=ui.create.caption(
                `<div class="text" data-nature=${get.groupnature(info[1],'raw')
                    }m style="font-family: ${(lib.config.name_font||'xinwei')
                    },xinwei">${skillstr}</div>`,node);
            skillnode.style.left='2px';
            skillnode.style.bottom='2px';
        }
        node._customintro=function(uiintro,evt){
            const character=node.link,characterInfo=get.character(node.link);
            let capt=get.translation(character);
            if(characterInfo){
                capt+=`&nbsp;&nbsp;${get.translation(characterInfo[0])}`;
                let charactergroup;
                const charactergroups=get.is.double(character,true);
                if(charactergroups) charactergroup=charactergroups.map(i=>get.translation(i)).join('/');
                else charactergroup=get.translation(characterInfo[1]);
                capt+=`&nbsp;&nbsp;${charactergroup}`;
            }
            uiintro.add(capt);

            if(lib.characterTitle[node.link]){
                uiintro.addText(get.colorspan(lib.characterTitle[node.link]));
            }
            for(let i=0;i<skills.length;i++){
                if(lib.translate[skills[i]+'_info']){
                    let translation=lib.translate[skills[i]+'_ab']||get.translation(skills[i]).slice(0,2);
                    if(lib.skill[skills[i]]&&lib.skill[skills[i]].nobracket){
                        uiintro.add('<div><div class="skilln">'+get.translation(skills[i])+'</div><div>'+get.skillInfoTranslation(skills[i])+'</div></div>');
                    }
                    else{
                        uiintro.add('<div><div class="skill">【'+translation+'】</div><div>'+get.skillInfoTranslation(skills[i])+'</div></div>');
                    }
                    if(lib.translate[skills[i]+'_append']){
                        uiintro._place_text=uiintro.add('<div class="text">'+lib.translate[skills[i]+'_append']+'</div>')
                    }
                }
            }
        }
        return node;
    },
    // createAudio:(character,skillx,name)=>{
    // 	var skills=game.expandSkills([skillx]);
    // 	skills=skills.filter(skill=>get.info(skill));
    // 	if(!skills.length) return;
    // 	var skillss=skills.filter(skill=>get.info(skill).derivation);
    // 	if(skillss.length){
    // 		skillss.forEach(skill=>{
    // 			var derivationSkill=get.info(skill).derivation;
    // 			skills[Array.isArray(derivationSkill)?'addArray':'add'](derivationSkill);
    // 		});
    // 	}
    // 	skills.forEach(skill=>{
    // 		var info=lib.skill[skill];
    // 		if(info){
    // 			if(!info.audioname2) info.audioname2={};
    // 			if(info.audioname&&info.audioname.includes(character)){
    // 				if(info.audio){
    // 					if(typeof info.audio=='string') skill=info.audio;
    // 					if(Array.isArray(info.audio)) skill=info.audio[0];
    // 				}
    // 				if(!lib.skill[skill+'_'+character]) lib.skill[skill+'_'+character]={audio:2};
    // 				info.audioname2[name]=(skill+'_'+character);
    // 			}
    // 			else if(info.audioname2[character]){
    // 				info.audioname2[name]=info.audioname2[character];
    // 			}
    // 			else{
    // 				if(info.audio){
    // 					if(typeof info.audio=='string') skill=info.audio;
    // 					if(Array.isArray(info.audio)) skill=info.audio[0];
    // 				}
    // 				info.audioname2[name]=skill;
    // 			}
    // 		}
    // 	});
    // },
    mark:true,
    intro:{
        onunmark:function(storage,player){
            _status.characterlist.addArray(storage.character);
            storage.character=[];
        },
        mark:function(dialog,storage,player){
            if(storage&&storage.current) dialog.addSmall([[storage.current],(item,type,position,noclick,node)=>lib.skill.rehuashen.$createButton(item,type,position,noclick,node)]);
            if(storage&&storage.current2) dialog.add('<div><div class="skill">【'+get.translation(lib.translate[storage.current2+'_ab']||get.translation(storage.current2).slice(0,2))+'】</div><div>'+get.skillInfoTranslation(storage.current2,player)+'</div></div>');
            if(storage&&storage.character.length){
                if(player.isUnderControl(true)){
                    dialog.addSmall([storage.character,(item,type,position,noclick,node)=>lib.skill.rehuashen.$createButton(item,type,position,noclick,node)]);
                }
                else{
                    dialog.addText('共有'+get.cnNumber(storage.character.length)+'张“化身”');
                }
            }
            else{
                return '没有化身';
            }
        },
        content:function(storage,player){
                return '共有'+get.cnNumber(storage.character.length)+'张“化身”'
        },
        markcount:function(storage,player){
            if(storage&&storage.character) return storage.character.length;
            return 0;
        },
    },
}
lib.skill.autoswap = {
    firstDo: true,
    trigger: {
        player: [
            "playercontrol", "chooseToUseBegin", "chooseToRespondBegin", 
            "chooseToDiscardBegin", "chooseToCompareBegin", "chooseButtonBegin", 
            "chooseCardBegin", "chooseTargetBegin", "chooseCardTargetBegin", 
            "chooseControlBegin", "chooseBoolBegin", "choosePlayerCardBegin", 
            "discardPlayerCardBegin", "gainPlayerCardBegin", "chooseToMoveBegin", 
            "chooseToPlayBeatmapBegin", "chooseToGiveBegin",'chooseSkillBegin',
        ],
    },
    forced: true,
    priority: 100,
    forceDie: true,
    popup: false,
    charlotte:true,
    filter(event, player) {
        if(!player._controlNow&&!player._trueMe) return false
        if (lib.filter.wuxieSwap(event)) return false;
        const huoxinNow = "惑心："+get.translation(player)
        if(player._trueMe) {//如果要操作的角色不是自己且有真正的操作者那就符合
            return player._trueMe.playerControlNow!== huoxinNow
        } 
        if(player.playerControlNow!==huoxinNow) {//如果现在要操作的是自己
            return  true
        }
        return true;
    },
    async content(event,trigger,player) {//当时机触发时，拥有这个切换的玩家会切换到自己身上
        const huoxinNow = "惑心："+get.translation(player)
        let source,target;
        if(player._trueMe&&player._trueMe.playerControlNow!==huoxinNow){
            player._trueMe.playerControlNow = huoxinNow
            source = player._trueMe
            target = player
        }else if(player._controlNow&&player.playerControlNow!==huoxinNow){
            player.playerControlNow = huoxinNow
            source = player
            target = player._controlNow
        }
        if(_status.connectMode&&source&&target){
            suiSet.swapPlayer({
                player:source,
                player2:target,
                unidirectional:true
            })
        }else {
            game.swapPlayerAuto(player);
        }
        
    },
}
lib.skill.huoxin_control = {
    audio: "huoxin",
    forced: true,
    trigger: { global: "phaseBeginStart" },
    filter(event, player) {
        return player != event.player && !event.player._trueMe && event.player.countMark("huoxin") > 1;
    },
    logTarget: "player",
    skillAnimation: true,
    animationColor: "metal",
    async content(event,trigger,player) {
        trigger.player.removeMark("huoxin", trigger.player.countMark("huoxin"));
        trigger.player._trueMe = player;
        if(trigger.player===game.me){
            game.me.mainHost = {mainHost:'mainHost',nickname:game.me.nickname}
            suiSet.observingId.push(game.me.mainHost)
            game.notMe = true
            _status.auto = true
            game.me.chat = function(str){
                lib.message.server.chat.call(game.me.mainHost,null,str)
            }
        }else {
            suiSet.observingId.push(trigger.player.ws)
        }
        
        if(_status.connectMode){
            trigger.player.tempNickname = player.nickname
        }

        game.addGlobalSkill('autoswap')//给自己加切换
        trigger.player.addTempSkill("huoxin2", 'phaseAfter');

        const source = player, target = trigger.player
        game.log('#r',get.translation(source)+"已经控制了"+get.translation(target))
    },
},
lib.skill.huoxin2 = {
    trigger: {
        player: ["phaseAfter", "dieAfter"],
        global: "phaseBeforeStart",
    },
    lastDo: true,
    charlotte: true,
    forceDie: true,
    forced: true,
    silent: true,
    async content(e,t,player) {
        player.removeSkill("huoxin2");
    },
    onremove(player) {
        if (player == game.me) {
            delete game.notMe
            delete _status.auto
            suiSet.observingId.remove(game.me.mainHost)
            player.chat = lib.element.player.chat.bind(player)
        }else {
            suiSet.observingId.remove(player.ws)
        }
        const huoxinNow = "惑心："+get.translation(player)
        if(player._trueMe.playerControlNow===huoxinNow){
            suiSet.swapPlayer({
                player:player._trueMe,
                player2:player,
                unidirectional:true
            })   
            player._trueMe.playerControlNow = huoxinNow
        }
        delete player.tempNickname
        delete player._trueMe;
        game.removeGlobalSkill('autoswap')
    },
}
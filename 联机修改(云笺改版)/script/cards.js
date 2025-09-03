const { lib, game, ui, get, ai, _status } = suiSet
suiSet.loadMoreCards = function(){
    if(suiSet.loadCarded) return;
    const {lib,game,ui,get,ai,_status} = suiSet
    suiSet.card = {
        gubuzifeng:{
            type:'trick',
            fullskin:true,
            modeimage:'boss',
            enable:true,
            filterTarget:function(card,player,target){
                return target!=player;
            },
            content:function(){
                target.addTempSkill('gubuzifeng_disable',{player:'phaseAfter'});
                var skills=target.getSkills(null,false);
                for(var i=0;i<skills.length;i++){
                    if(get.info(skills[i]).charlotte) skills.splice(i--,1);
                }
                if(skills.length){
                    target.storage.gubuzifeng_disable.push(skills.randomGet());
                    target.disableSkill('gubuzifeng_disable',target.storage.gubuzifeng_disable);
                }
            },
            ai:{
                order:12,
                result:{
                    target:function(player,target){
                        return -2;
                    }
                }
            }
        },
        lingsheji:{
            type:'equip',
            subtype:'equip5',
            skills:['lingsheji'],
            modeimage:'boss',
            ai:{
                basic:{
                    equipValue:7.5,
                },
            },
            fullskin:true,
        },
        shanrangzhaoshu:{
            type:'equip',
            subtype:'equip5',
            skills:['shanrangzhaoshu'],
            modeimage:'boss',
            ai:{
                basic:{
                    equipValue:7.5,
                },
            },
            fullskin:true,
        },
        xingtianpojunfu:{
            type:'equip',
            subtype:'equip1',
            distance:{attackFrom:-3},
            skills:['noda_axe'],
            modeimage:'boss',
            ai:{
                basic:{
                    equipValue:7.5,
                },
            },
            fullskin:true,
        },
        jinwuluorigong:{
            type:'equip',
            subtype:'equip1',
            skills:['iwasawa_crowbow'],
            modeimage:'boss',
            distance:{attackFrom:-8},
            ai:{
                basic:{
                    equipValue:7.5,
                },
            },
            fullskin:true,
        },
        "boss_mengpohuihun":{
            mode:['boss'],
            type:"trick",
            modeimage:"boss",
            fullskin:true,
            selectTarget:-1,
            enable:true,
            toself:true,
            multitarget:true,
            global:['boss_mengpohuihun1'],
            modTarget:true,
            filterTarget:function(card,player,target){
                return player==target;
            },
            content:function(){
                game.countPlayer2(function(current){
                    current.enableSkill('boss_wanghun');
                });
            },
            ai:{
                basic:{
                    order:function(){
                        return 11;
                    },
                    useful:[3,1],
                    value:10
                },
                result:{
                    player:function(player,target){
                        if(player==game.boss){
                            return -2;
                        }
                        else{
                            return 5;
                        }
                    },
                },
            },
        },
        sadouchengbing:{
            fullskin:true,
            type:'trick',
            enable:true,
            selectTarget:-1,
            cardcolor:'red',
            toself:true,
            modeimage:'boss',
            filterTarget:function(card,player,target){
                return target==player;
            },
            modTarget:true,
            content:function(){
                var num=Math.min(5,target.maxHp);
                if(target.group=='shen'){
                    target.draw(num);
                }
                else{
                    var nh=target.countCards('h');
                    if(nh<num){
                        target.draw(num-nh);
                    }
                }
            },
            ai:{
                basic:{
                    order:7.2,
                    useful:4.5,
                    value:9.2
                },
                result:{
                    target:function(player,target){
                        var num=Math.min(5,target.maxHp);
                        if(target.group=='shen'){
                            return Math.sqrt(num);
                        }
                        else{
                            var nh=target.countCards('h');
                            if(target==player&&player.countCards('h','sadouchengbing')){
                                nh--;
                            }
                            if(nh<num){
                                return Math.sqrt(num-nh);
                            }
                        }
                        return 0;
                    },
                },
                tag:{
                    draw:2
                }
            }
        },
        yihuajiemu:{
            type:'trick',
            fullskin:true,
            modeimage:'boss',
            enable:true,
            filterTarget:function(card,player,target){
                return target!=player&&target.countCards('he');
            },
            content:function(){
                'step 0'
                if(target.hasSha()){
                    target.chooseToUse(function(card,player,event){
                        return get.name(card)=='sha'&&lib.filter.filterCard.apply(this,arguments);
                    },'使用一张杀，或交给'+get.translation(player)+'两张牌');
                }
                else{
                    event.directfalse=true;
                }
                'step 1'
                var nh=target.countCards('he');
                if((event.directfalse||!result.bool)&&nh){
                    if(nh<=2){
                        event.directcards=true;
                    }
                    else{
                        target.chooseCard('he',2,true,'将两张牌交给'+get.translation(player));
                    }
                }
                else{
                    event.finish();
                }
                'step 2'
                if(event.directcards){
                    target.give(target.getCards('he'),player);
                }
                else if(result.bool&&result.cards&&result.cards.length){
                    target.give(result.cards,player);
                }
            },
            ai:{
                order:7,
                result:{
                    target:function(player,target){
                        if(target.hasSha()&&_status.event.getRand()<0.5) return 1;
                        return -2;
                    }
                }
            }
        },
        chiyanzhenhunqin:{
            type:'equip',
            fullskin:true,
            subtype:'equip1',
            modeimage:'boss',
            distance:{attackFrom:-3},
            skills:['chiyanzhenhunqin'],
            nomod:true,
            nopower:true,
            unique:true,
            ai:{
                equipValue:5
            }
        },
        juechenjinge:{
            type:'equip',
            fullskin:true,
            modeimage:'boss',
            subtype:'equip3',
            skills:['juechenjinge'],
            nomod:true,
            nopower:true,
            unique:true,
            ai:{
                equipValue:9
            }
        },
        xiuluolianyuji:{
            type:'equip',
            fullskin:true,
            subtype:'equip1',
            modeimage:'boss',
            distance:{attackFrom:-3},
            skills:['xiuluolianyuji'],
            nomod:true,
            nopower:true,
            unique:true,
            ai:{
                equipValue:9
            }
        },
        longfenghemingjian:{
            type:'equip',
            fullskin:true,
            modeimage:'boss',
            subtype:'equip1',
            distance:{attackFrom:-2},
            skills:['longfenghemingjian'],
            nomod:true,
            nopower:true,
            unique:true,
            ai:{
                equipValue:9
            }
        },
        qicaishenlu:{
            fullskin:true,
            modeimage:'boss',
            type:'equip',
            subtype:'equip4',
            distance:{globalFrom:-1},
            skills:['qicaishenlu'],
            nomod:true,
            nopower:true,
            unique:true,
            ai:{
                equipValue:9
            }
        },
        honghuangzhili:{
            type:'trick',
            enable:true,
            fullskin:true,
            filterTarget:true,
            modeimage:'boss',
            content:function(){
                if(target.group=='shen'){
                    target.addSkill('honghuangzhili');
                    if(target.countCards('he')){
                        player.gainPlayerCard(target,'he',true);
                    }
                }
                else{
                    target.turnOver();
                }
            },
            ai:{
                order:4,
                value:10,
                result:{
                    target:function(player,target){
                        if(target.group=='shen'){
                            if(target.countCards('he')) return -2;
                            return 0;
                        }
                        else{
                            if(target.isTurnedOver()) return 4;
                            return -3;
                        }
                    }
                }
            }
        },
        shuiyanqijuny:{
            fullskin:true,
            cardimage:'shuiyanqijunx',
            enable:true,
            filterTarget:true,
            type:'trick',
            selectTarget:[1,2],
            targetprompt:['受伤弃牌','受伤摸牌'],
            contentBefore:function(){
                var evt=event.getParent(),target=evt.stocktargets[0];
                evt.shuiyanqijun_target=target;
            },
            content:function(){
                target.damage('thunder');
                if(target!=event.getParent().shuiyanqijun_target) target.draw();
                else target.chooseToDiscard('he',true);
            },
            ai:{
                order:6,
                value:4,
                useful:2,
                tag:{
                    damage:1,
                    thunderDamage:1,
                    natureDamage:1,
                    loseCard:1,
                },
                result:{
                    target:function(player,target){
                        if(!ui.selected.targets.length) return -1.5;
                        return -0.5
                    }
                }
            }
        },
        luojingxiashi:{
            fullskin:true,
            enable:true,
            type:'trick',
            selectTarget:-1,
            filterTarget:function(card,player,target){
                return target!=player&&target.isDamaged();
            },
            content:function(){
                target.damage();
            },
            ai:{
                order:3,
                value:4,
                useful:2,
                tag:{
                    loseCard:1,
                },
                result:{
                    target:-1.5,
                }
            }
        },
        binglinchengxia:{
            fullskin:true,
            type:'delay',
            filterTarget:function(card,player,target){
                return (lib.filter.judge(card,player,target)&&player!=target);
            },
            judge:function(card){
                if(get.suit(card)=='diamond') return 0;
                return -3;
            },
            effect:function(){
                'step 0'
                if(result.bool==false){
                    if(!player.countCards('e',function(card){
                        return lib.filter.cardDiscardable(card,player,'shuiyanqijuny');
                    })){
                        player.damage('nosource');
                        event.finish();
                        return;
                    }
                    else player.chooseControl('discard_card','take_damage',function(event,player){
                        if(get.damageEffect(player,event.player,player)>=0){
                            return 'take_damage';
                        }
                        if(player.hp>=3&&player.countCards('e')>=2){
                            return 'take_damage';
                        }
                        return 'discard_card';
                    });
                }
                else event.finish();
                'step 1'
                if(result.control=='discard_card'){
                    player.discard(player.getCards('e',function(card){
                        return lib.filter.cardDiscardable(card,player,'shuiyanqijuny');
                    }));
                }
                else player.damage('nosource');
            },
            ai:{
                order:1,
                value:3,
                useful:2,
                tag:{
                    damage:1,
                    loseCard:1,
                },
                result:{
                    target:function(player,target,card,isLink){
                        var es=target.getCards('e');
                        if(!es.length) return -1.5;
                        var val=0;
                        for(var i of es) val+=get.value(i,target);
                        return -Math.min(1.5,val/5);
                    }
                }
            }
        },
        toushiche:{
            fullskin:true,
            type:'equip',
            subtype:'equip1',
            distance:{attackFrom:-3},
            ai:{
                basic:{
                    equipValue:2.5
                }
            },
            skills:['toushiche_skill']
        },
        gongshoujianbei:{
            fullskin:true,
            type:'trick',
        },
        jintuiziru:{
            fullskin:true,
            type:'trick',
        },
        diqi:{
            fullskin:true,
            type:"equip",
            subtype:"equip2",
            skills:['diqi_skill'],
            ai:{
                basic:{
                    equipValue:6
                },
            },
        },
        zhadan:{
            audio:true,
            fullskin:true,
            type:'trick',
            ai:{
                basic:{
                    useful:[6,4],
                    value:[6,4],
                },
                result:{player:1},
            },
            notarget:true,
            content:function(){
                var evt=event.getParent(2)._trigger;
                evt.targets.length=0;
                evt.all_excluded=true;
                game.log(evt.card,'的效果被炸弹抵消了');
            },
        },
        jiwangkailai:{
            audio:true,
            fullskin:true,
            type:'trick',
            enable:function(card,player){
                var hs=player.getCards('h',function(cardx){
                    return cardx!=card&&(!card.cards||!card.cards.contains(cardx));
                });
                if(!hs.length) return false;
                var use=true,discard=true;
                for(var i of hs){
                    if(use&&!game.checkMod(i,player,'unchanged','cardEnabled2',player)) use=false;
                    if(discard&&!lib.filter.cardDiscardable(i,player,'jiwangkailai')) discard=false;
                    if(!use&&!discard) return false;
                }
                return true;
            },
            selectTarget:-1,
            toself:true,
            filterTarget:function(card,player,target){
                return target==player;
            },
            modTarget:true,
            content:function(){
                'step 0'
                var hs=player.getCards('h');
                if(hs.length){
                    var use=true,discard=true;
                    for(var i of hs){
                        if(use&&!game.checkMod(i,player,'unchanged','cardEnabled2',player)) use=false;
                        if(discard&&!lib.filter.cardDiscardable(i,player,'jiwangkailai')) discard=false;
                        if(!use&&!discard) break;
                    }
                    if(use&&discard) player.chooseControl().set('prompt','继往开来：请选择一项').set('choiceList',[
                        '弃置所有手牌，然后摸等量的牌',
                        '将所有手牌当做一张普通锦囊牌使用',
                    ]).set('ai',function(){
                        if(_status.event.player.countCards('h')>2) return 0;
                        return 1;
                    });
                    else if(use) event._result={index:1};
                    else if(discard) event._result={index:0};
                    else event.finish();
                }
                else event.finish();
                'step 1'
                var cards=player.getCards('h');
                if(result.index==0){
                    player.discard(cards);
                    player.draw(cards.length);
                    event.finish();
                }
                else{
                    var list=[];
                    for(var i of lib.inpile){
                        if(i!='jiwangkailai'&&get.type(i)=='trick'&&lib.filter.filterCard({name:i,cards:cards},player)) list.push(['锦囊','',i]);
                    }
                    if(list.length){
                        player.chooseButton(['继往开来：选择要使用的牌',[list,'vcard']],true).set('ai',function(button){
                            var player=_status.event.player;
                            return player.getUseValue({name:button.link[2],cards:player.getCards('h')});
                        });
                    }
                    else event.finish();
                }
                'step 2'
                if(result.bool) player.chooseUseTarget({name:result.links[0][2]},player.getCards('h'),true);
            },
            ai:{
                basic:{
                    order:0.5,
                    useful:3,
                    value:5
                },
                result:{
                    target:function(player,target){
                        if(target.needsToDiscard(1)||!target.countCards('h',function(card){
                            return get.value(card,player)>=5.5;
                        })) return 1;
                        return 0;
                    },
                },
                tag:{
                    draw:2
                }
            }
        },
        tunliang:{
            audio:true,
            fullskin:true,
            type:'trick',
            enable:true,
            selectTarget:[1,3],
            filterTarget:true,
            content:function(){
                target.draw();
            },
            ai:{
                basic:{
                    order:7.2,
                    useful:4.5,
                    value:9.2
                },
                result:{
                    target:1,
                },
                tag:{
                    draw:1
                }
            }
        },
        yuanjun:{
            fullskin:true,
            type:'trick',
            selectTarget:[1,2],
            enable:true,
            filterTarget:function(card,player,target){
                return target!=player&&target.hp<target.maxHp;
            },
            content:function(){
                target.recover();
            },
            ai:{
                basic:{
                    order:function(card,player){
                        if(player.hasSkillTag('pretao')) return 5;
                        return 2;
                    },
                    useful:[6,4],
                    value:[6,4],
                },
                result:{
                    target:function(player,target){
                        return 2;
                    },
                },
                tag:{
                    recover:1,
                }
            }
        },
        zong:{
            fullskin:true,
            type:'basic',
            cardcolor:'red',
            enable:function(card,player){
                return player.hp<player.maxHp;
            },
            savable:function(card,player,dying){
                return dying.side==player.side;
            },
            selectTarget:1,
            filterTarget:function(card,player,target){
                return target==player||(target.hp<target.maxHp);
            },
            modTarget:function(card,player,target){
                return target.hp<target.maxHp;
            },
            content:function(){
                target.recover();
            },
            ai:{
                basic:{
                    order:function(card,player){
                        if(player.hasSkillTag('pretao')) return 5;
                        return 2;
                    },
                    useful:[8,6.5,5,4],
                    value:[8,6.5,5,4],
                },
                result:{
                    target:function(player,target){
                        if(target.hp<=0) return 2;
                        var nd=player.needsToDiscard();
                        var keep=false;
                        if(nd<=0){
                            keep=true;
                        }
                        else if(nd==1&&target.hp>=2&&target.countCards('h','tao')<=1){
                            keep=true;
                        }
                        var mode=get.mode();
                        if(target.hp>=2&&keep&&target.hasFriend()){
                            if(target.hp>2||nd==0) return 0;
                            if(target.hp==2){
                                if(game.hasPlayer(function(current){
                                    if(target!=current&&get.attitude(target,current)>=3){
                                        if(current.hp<=1) return true;
                                    }
                                })){
                                    return 0;
                                }
                            }
                        }
                        return 2;
                    },
                },
                tag:{
                    recover:1,
                    save:1,
                }
            }
        },
        xionghuangjiu:{
            fullskin:true,
            type:"basic",
            enable:function(event,player){
                return !player.hasSkill('xionghuangjiu');
            },
            lianheng:true,
            logv:false,
            savable:function(card,player,dying){
                return dying==player;
            },
            usable:1,
            selectTarget:-1,
            modTarget:true,
            filterTarget:function(card,player,target){
                return target==player;
            },
            content:function(){
                if(target.isDying()){
                    target.recover();
                    if(_status.currentPhase==target){
                        target.getStat().card.jiu--;
                    }
                }
                else{
                    if(cards&&cards.length){
                        card=cards[0];
                    }
                    game.broadcastAll(function(target,card,gain2){
                        if(target.hp<target.maxHp-target.hp){
                            target.addSkill('xionghuangjiu');
                        }
                        else{
                            if(!target.storage.jiu) target.storage.jiu=0;
                            target.storage.jiu++;
                            target.addSkill('jiu');
                        }
                        game.addVideo('jiuNode',target,true);
                        if(!target.node.jiu&&lib.config.jiu_effect){
                            target.node.jiu=ui.create.div('.playerjiu',target.node.avatar);
                            target.node.jiu2=ui.create.div('.playerjiu',target.node.avatar2);
                        }
                        if(gain2&&card.clone&&(card.clone.parentNode==target.parentNode||card.clone.parentNode==ui.arena)){
                            card.clone.moveDelete(target);
                        }
                    },target,card,target==targets[0]);
                    if(target==targets[0]){
                        if(card.clone&&(card.clone.parentNode==target.parentNode||card.clone.parentNode==ui.arena)){
                            game.addVideo('gain2',target,get.cardsInfo([card]));
                        }
                    }
                }
            },
            ai:{
                basic:{
                    useful:function(card,i){
                        if(_status.event.player.hp>1){
                            if(i==0) return 5;
                            return 1;
                        }
                        if(i==0) return 7.3;
                        return 3;
                    },
                    value:function(card,player,i){
                        if(player.hp>1){
                            if(i==0) return 5;
                            return 1;
                        }
                        if(i==0) return 7.3;
                        return 3;
                    },
                },
                order:function(){
                    return get.order({name:'sha'})+0.2;
                },
                result:{
                    target:function(player,target){
                        if(target&&target.isDying()) return 2;
                        if(lib.config.mode=='stone'&&!player.isMin()){
                            if(player.getActCount()+1>=player.actcount) return 0;
                        }
                        var shas=player.getCards('h','sha');
                        if(shas.length>1&&player.getCardUsable('sha')>1){
                            return 0;
                        }
                        var card;
                        if(shas.length){
                            for(var i=0;i<shas.length;i++){
                                if(lib.filter.filterCard(shas[i],target)){
                                    card=shas[i];break;
                                }
                            }
                        }
                        else if(player.hasSha()&&player.needsToDiscard()){
                            if(player.countCards('h','hufu')!=1){
                                card={name:'sha'};
                            }
                        }
                        if(card){
                            if(game.hasPlayer(function(current){
                                return (get.attitude(target,current)<0&&
                                    target.canUse(card,current,true,true)&&
                                    !current.getEquip('baiyin')&&
                                    get.effect(current,card,target)>0);
                            })){
                                return 1;
                            }
                        }
                        return 0;
                    },
                },
                tag:{
                    save:1
                }
            }
        },
        tongzhougongji:{
            fullskin:true,
            cardimage:'lulitongxin',
            selectTarget:1,
            enable:true,
            type:'trick',
            filterTarget:function(card,player,target){
                return target!==player
            },
            content:function(){
                player.draw()
                target.draw()
            },
            ai:{
                basic:{
                    order:7.2,
                    useful:4,
                    value:9.2
                },
                result:{
                    target:2,
                },
                tag:{
                    draw:1
                }
            }
        },
        lizhengshangyou:{
            fullskin:true,
            cardimage:'lianjunshengyan',
            type:'trick',
            enable:true,
            selectTarget:-1,
            reverseOrder:true,
            filterTarget:function(card,player,target){
                for(var i=0;i<game.players.length;i++){
                    if(game.players[i].side==target.side&&game.players[i].storage.longchuanzhibao){
                        return target.isDamaged();
                    }
                }
                return target.countCards('he');
            },
            content:function(){
                const num = game.countGroup()
                if(target.group===player.group) {
                    target.draw(num)
                }else {
                    target.draw()
                }
            },
            ai:{
                basic:{
                    order:9,
                    useful:[3,1],
                    value:0
                },
                result:{
                    target:function(player,target){
                        for(var i=0;i<game.players.length;i++){
                            if(game.players[i].side==target.side&&game.players[i].storage.longchuanzhibao){
                                return 1.5;
                            }
                        }
                        return -1;
                    }
                },
                tag:{
                    recover:0.5,
                    multitarget:1
                }
            }
        }
    }
    suiSet.skill = {
        gubuzifeng_disable:{
            init:function(player,skill){
                if(!player.storage[skill]) player.storage[skill]=[];
            },
            onremove:function(player,skill){
                player.enableSkill(skill);
                delete player.storage[skill];
            },
            charlotte:true,
            locked:true,
            mark:true,
            intro:{
                content:function(storage,player,skill){
                    var list=[];
                    for(var i in player.disabledSkills){
                        if(player.disabledSkills[i].contains(skill)){
                            list.push(i)
                        }
                    }
                    if(list.length){
                        var str='失效技能：';
                        for(var i=0;i<list.length;i++){
                            if(lib.translate[list[i]+'_info']){
                                str+=get.translation(list[i])+'、';
                            }
                        }
                        return str.slice(0,str.length-1);
                    }
                }
            }
        },
        shanrangzhaoshu:{
            trigger:{
                global:['gainEnd','loseAsyncAfter'],
            },
            direct:true,
            filter:function(event,player){
                let min=0;
                if(!player.hasSkill('shanrangzhaoshu',null,false)) min+=get.sgn(player.getEquips('shanrangzhaoshu').length)
                const bool=player.countCards('he')>min;
                return game.hasPlayer(current=>{
                    if(current==player||current==_status.currentPhase) return false;
                    if(!bool&&current.countCards('h')==0) return false;
                    const history=current.getHistory('gain')[0];
                    if(!history) return false;
                    if(event.name=='gain'){
                        return history==event&&event.getlx!==false;
                    }
                    return history.getParent()==event;
                })
            },
            content:function(){
                'step 0'
                event.targets=game.filterPlayer(function(current){
                    if(current==player||current==_status.currentPhase) return false;
                    const history=current.getHistory('gain')[0];
                    if(!history) return false;
                    if(trigger.name=='gain'){
                        return history==trigger&&trigger.getlx!==false;
                    }
                    return history.getParent()==trigger;
                }).sortBySeat(_status.currentPhase);
                'step 1'
                var target=event.targets.shift();
                event.target=target;
                if(target.isIn()){
                    var list=[];
                    var min=0;
                    if(!player.hasSkill('shanrangzhaoshu',null,false)) min+=get.sgn(player.getEquips('shanrangzhaoshu').length);
                    if(player.countCards('he')>min) list.push(`交给${get.translation(target)}一张牌`);
                    if(target.countCards('he')>0) list.push(`令${get.translation(target)}交给你一张牌`);
                    event.list=list;
                    if(list.length==0) event.goto(4);
                    else if(list.length==1) event._result={index:0};
                    else player.chooseControl('cancel2').set('choiceList',list).set('prompt',get.prompt('shanrangzhaoshu',target)).set('ai',function(){
                        if(get.attitude(_status.event.player,_status.event.getParent().target)<0) return 1;
                        return 'cancel2';
                    });
                }
                else event.goto(4);
                'step 2'
                if(result.control=='cancel2'){
                    event.goto(4);
                    return;
                }
                player.logSkill('shanrangzhaoshu',target);
                if(event.list[result.index][0]=='令'){
                    event.gainner=player;
                    event.giver=target;
                    target.chooseCard('he',true,`交给${get.translation(player)}一张牌`);
                }
                else{
                    event.giver=player;
                    event.gainner=target;
                    player.chooseCard('he',true,`交给${get.translation(target)}一张牌`).set('filterCard',function(card,player){
                        if(_status.event.ignoreCard) return true;
                        var cards=player.getEquips('shanrangzhaoshu');
                        if(!cards.contains(card)) return true;
                        return cards.some(cardx=>(cardx!=card&&!ui.selected.cards.contains(cardx)));
                    }).set('ignoreCard',player.hasSkill('shanrangzhaoshu',null,false));
                }
                'step 3'
                if(result.cards&&result.cards.length) event.giver.give(result.cards,event.gainner);
                'step 4'
                if(targets.length>0) event.goto(1);
            },
        },
        lingsheji:{
            trigger:{player:'phaseUseEnd'},
            equipSkill:true,
            direct:true,
            content:function(){
                'step 0'
                var list=['摸一张牌'];
                if(player.countCards('he')>1) list.push('将一张牌置于武将牌上，于回合结束后获得之');
                player.chooseControl('cancel2').set('prompt',get.prompt('lingsheji')).set('choiceList',list).set('ai',function(){
                    var player=_status.event.player;
                    if(player.countCards('e',function(card){
                        return card.name!='tengjia'&&get.value(card)<=0;
                    })) return 1;
                    if(!player.needsToDiscard()) return 0;
                    return 1;
                });
                'step 1'
                if(result.control=='cancel2'){
                    event.finish();return;
                }
                player.logSkill('lingsheji');
                if(result.index==0){
                    player.draw();
                    event.finish();
                }
                else{
                    player.chooseCard('he',true,function(card,player){
                        return card!=player.getEquip(5);
                    }).set('ai',function(card){
                        if(get.position(card)=='e'&&get.value(card)<=0) return 10;
                        return (get.position(card)=='h'?2:1)*-get.value(card);
                    });
                }
                'step 2'
                player.addSkill('lingsheji2');
                player.lose(result.cards,ui.special,'toStorage');
                player.markAuto('lingsheji2',result.cards);
            },
        },
        lingsheji2:{
            trigger:{player:'phaseEnd'},
            equipSkill:true,
            forced:true,
            popup:false,
            content:function(){
                player.gain(player.getStorage('lingsheji2'),'gain2','log');
                player.storage.lingsheji2.length=0;
                player.removeSkill('lingsheji2');
            },
            intro:{content:'cards'},
        },
        noda_axe:{
            trigger:{player:'useCardToPlayered'},
            equipSkill:true,
            direct:true,
            filter:function(event,player){
                return player.isPhaseUsing()&&player!=event.target&&event.targets.length==1&&player.countCards('he')>2;
            },
            content:function(){
                'step 0'
                player.chooseToDiscard('he',get.prompt('noda_axe',trigger.target),2,'弃置两张牌，令'+get.translation(trigger.target)+'本回合内不能使用或打出牌且防具技能无效。',function(card,player){
                    return card!=player.getEquip(1);
                }).set('logSkill',['noda_axe',trigger.target]).set('goon',function(event,player){
                 if(player.hasSkill('noda_axe2')) return false;
                 if(event.getParent().excluded.contains(player)) return false;
                 if(get.attitude(event.player,player)>0){
                     return false;
                 }
                 if(get.type(event.card)=='trick'&&event.player.hasWuxie()) return true;
                 if(get.tag(event.card,'respondSha')){
                     if(!player.hasSha()) return false;
                     return true;
                 }
                 else if(get.tag(event.card,'respondShan')){
                     if(!player.hasShan()) return false;
                     return true;
                 }
                 return false;
                }(trigger,trigger.target)).set('ai',function(card){
                    if(_status.event.goon) return 7.5-get.value(card);
                    return 0;
                });
                'step 1'
                if(result.bool) trigger.target.addTempSkill('noda_axe2');
            },
        },
        noda_axe2:{
            equipSkill:true,
            mod:{
                cardEnabled:function(){return false},
                cardSavable:function(){return false},
                cardRespondable:function(){return false},
            },
            mark:true,
            intro:{
                content:'不能使用或打出牌且防具技能无效直到回合结束',
            },
            ai:{unequip2:true},
        },
        iwasawa_crowbow:{
            equipSkill:true,
            trigger:{
                player:'loseAfter',
                global:['equipAfter','addJudgeAfter','gainAfter','loseAsyncAfter','addToExpansionAfter'],
            },
            direct:true,
            filter:function(event,player){
                var evt=event.getl(player);
                return evt&&evt.hs&&evt.hs.length>1&&player.isPhaseUsing();
            },
            content:function(){
                'step 0'
                var evt=trigger.getl(player);
                event.num=evt.hs.length;
                player.chooseTarget(get.prompt('iwasawa_crowbow'),'弃置一名其他角色的'+get.cnNumber(event.num)+'张牌',function(card,player,target){
                    return player!=target&&target.countDiscardableCards(player,'he')>0;
                }).set('ai',function(target){
                    var att=get.attitude(_status.event.player,target);
                    if(target.countDiscardableCards(_status.event.player,'he')>=_status.event.getParent().num) att=att*2;
                    return -att;
                });
                'step 1'
                if(result.bool){
                    var target=result.targets[0];
                    player.logSkill('iwasawa_crowbow',target);
                    player.discardPlayerCard(target,'he',true,num);
                }
            },
        },
        xiuluolianyuji2:{
            equipSkill:true,
            vanish:true,
            trigger:{player:'damageEnd'},
            forced:true,
            popup:false,
            content:function(){
                if(trigger.xiuluolianyuji) player.recover();
                player.removeSkill('xiuluolianyuji2');
            }
        },
        xiuluolianyuji:{
            mod:{
                selectTarget:function(card,player,range){
                    if(card.name!='sha') return;
                    if(range[1]==-1) return;
                    range[1]=Infinity;
                }
            },
            trigger:{source:'damageBegin1'},
            forced:true,
            filter:function(event){
                return event.card&&event.card.name=='sha';
            },
            content:function(){
                trigger.num++;
                trigger.xiuluolianyuji=true;
                trigger.player.addSkill('xiuluolianyuji2');
            }
        },
        juechenjinge:{
            equipSkill:true,
            global:'juechenjinge2'
        },
        juechenjinge2:{
            equipSkill:true,
            mod:{
                globalTo:function(from,to,distance){
                    return distance+game.countPlayer(function(current){
                        if(current==to) return;
                        if(current.side!=to.side) return;
                        if(current.hasSkill('juechenjinge')) return 1;
                    });
                }
            }
        },
        chiyanzhenhunqin:{
            equipSkill:true,
            trigger:{source:'damageBegin1'},
            forced:true,
            content:function(){
                game.setNature(trigger,'fire');
            }
        },
        longfenghemingjian:{
            equipSkill:true,
            inherit:'cixiong_skill',
            filter:function(event,player){
                return game.hasNature(event.card,'linked');
            },
        },
        qicaishenlu:{
            trigger:{source:'damageBegin1'},
            forced:true,
            filter:function(event,player){
                return 'nature' in event
            },
            content:function(){
                trigger.num++;
            },
        },
        _online_gongshoujintui:{
            enable:'chooseToUse',
            filter:function(event,player){
                var cards=player.getCards('hs');
                for(var i of cards){
                    var name=get.name(i,player);
                    if(name=='gongshoujianbei'){
                        if(event.filterCard({
                            name:'wanjian',
                            isCard:true,
                            cards:[i],
                        },player,event)||event.filterCard({
                            name:'taoyuan',
                            isCard:true,
                            cards:[i],
                        },player,event)) return true;
                    }
                    if(name=='jintuiziru'){
                        if(event.filterCard({
                            name:'nanman',
                            isCard:true,
                            cards:[i],
                        },player,event)||event.filterCard({
                            name:'wugu',
                            isCard:true,
                            cards:[i],
                        },player,event)) return true;
                    }
                }
                return false;
            },
            chooseButton:{
                dialog:function(event,player){
                    var list=[];
                    if(player.countCards('hs','gongshoujianbei')){
                        list.push(['锦囊','','wanjian']);
                        list.push(['锦囊','','taoyuan']);
                    }
                    if(player.countCards('hs','jintuiziru')){
                        list.push(['锦囊','','nanman']);
                        list.push(['锦囊','','wugu']);
                    }
                    return ui.create.dialog('攻守兼备/进退自如',[list,'vcard'],'hidden');
                },
                filter:function(button,player){
                    var name=button.link[2];
                    var rawname=((name=='wanjian'||name=='taoyuan')?'gongshoujianbei':'jintuiziru');
                    var cards=player.getCards('hs');
                    var evt=_status.event.getParent();
                    for(var i of cards){
                        if(get.name(i,player)==rawname&&evt.filterCard({
                            name:name,
                            isCard:true,
                            cards:[i],
                        },player,evt)) return true;
                    }
                    return false;
                },
                check:function(button){
                    return _status.event.player.getUseValue({name:button.link[2],isCard:true});
                },
                backup:function(links){
                    var name=links[0][2];
                    var rawname=((name=='wanjian'||name=='taoyuan')?'gongshoujianbei':'jintuiziru');
                    return {
                        popname:true,
                        viewAs:{name:name,isCard:true},
                        filterCard:{name:rawname},
                        ai1:()=>1,
                    }
                },
                prompt:function(links){
                    var name=links[0][2];
                    var rawname=((name=='wanjian'||name=='taoyuan')?'gongshoujianbei':'jintuiziru');
                    return '将一张'+get.translation(rawname)+'当做'+get.translation(name)+'使用';
                }
            },
            ai:{
                order:10,
                result:{
                    player:1,
                },
            },
        },
        diqi_skill:{
            trigger:{player:'damageBegin2'},
            filter:function(event,player){
                var card=player.getEquip('diqi');
                return get.itemtype(card)=='card'&&lib.filter.cardDiscardable(card,player,'diqi_skill');
            },
            check:function(event,player){
                return event.num>=Math.min(player.hp,2);
            },
            prompt2:function(event,player){
                return '弃置'+get.translation(player.getEquip('diqi'))+'并防止即将受到的'+get.cnNumber(event.num)+'点伤害';
            },
            content:function(){
                player.discard(player.getEquip('diqi'));
                trigger.cancel();
            },
            ai:{
                filterDamage:true,
                skillTagFilter:function(player,tag,arg){
                    if(arg&&arg.player){
                        if(arg.player.hasSkillTag('jueqing',false,player)) return false;
                    }
                },
            },
        },
        toushiche_skill:{
            trigger:{player:'phaseJieshuBegin'},
            forced:true,
            equipSkill:true,
            filter:function(event,player){
             return lib.skill.toushiche_skill.logTarget(null,player).length>0;
            },
            logTarget:function(event,player){
                var hs=player.countCards('h');
                return game.filterPlayer(function(current){
                    return current!=player&&current.countCards('h')>hs;
                });
            },
            content:function(){
                'step 0'
                event.targets=lib.skill.toushiche_skill.logTarget(null,player).sortBySeat();
                'step 1'
                var target=targets.shift();
                if(target.countCards('h')>0) target.chooseToDiscard('h',true);
                if(targets.length) event.redo();
            },
        },
        binglin_bingjin:{
            trigger:{player:'phaseEnd'},
            forced:true,
            ruleSkill:true,
            filter:function(event,player){
                return _status.mode=='binglin'&&game.roundNumber>14;
            },
            content:function(){
                player.loseHp();
            },
        },
        _online_zhadan_button:{
            trigger:{
                global:'gameDrawAfter',
                player:['gainEnd','loseEnd'],
            },
            firstDo:true,
            forced:true,
            charlotte:true,
            popup:false,
            silent:true,
            filter:function(event,player){
                // if(_status.mode!='online'||(player!=game.me&&!player.isOnline())) return;
                if(event.name!='lose') return !player.hasZhadan&&player.countCards('hs','zhadan')>0;
                return player.hasZhadan&&!player.countCards('hs','zhadan');
            },
            content:function(){
                if(!player.hasZhadan){
                    player.hasZhadan=true;
                    if(player==game.me) lib.skill._online_zhadan_button.initZhadan();
                    else player.send(function(){lib.skill._online_zhadan_button.initZhadan()});
                }
                else{
                    delete player.hasZhadan;
                    if(player==game.me) lib.skill._online_zhadan_button.removeZhadan();
                    else player.send(function(){lib.skill._online_zhadan_button.removeZhadan()});
                }
            },
            initZhadan:function(){
                ui.zhadan_button=ui.create.control('激活炸弹','stayleft',function(){
                    if(this.classList.contains('hidden')) return;
                    this.classList.toggle('glow');
                    if(this.classList.contains('glow')&&_status.event.type=='zhadan'&&
                    _status.event.isMine()&&ui.confirm&&_status.imchoosing){
                        ui.click.cancel(ui.confirm.lastChild);
                    }
                });
            },
            removeZhadan:function(){
                if(ui.zhadan_button){
                    ui.zhadan_button.remove();
                    delete ui.zhadan_button;
                }
            },
        },
        _online_zhadan:{
            trigger:{player:'useCard'},
            priority:5,
            popup:false,
            forced:true,
            filter:function(event,player){
                return game.hasPlayer(function(current){
                    return current.hasCard(function(card){
                        if(get.name(card)!='zhadan') return false;
                        return lib.filter.cardEnabled(card,player,'forceEnable');
                    },'hs');
                });
            },
            forceLoad:true,
            content:function(){
                'step 0'
                event.source=trigger.player;
                event.card=trigger.card;
                event.targets=trigger.targets;
                event._global_waiting=true;
                event.filterCard=function(card,player){
                    if(get.name(card)!='zhadan'||get.itemtype(card)!='card') return false;
                    return lib.filter.cardEnabled(card,player,'forceEnable');
                };
                event.send=function(player,card,source,targets,id,id2,skillState){
                    if(skillState){
                        player.applySkills(skillState);
                    }
                    if(player==game.me&&ui.zhadan_button&&!ui.zhadan_button.classList.contains('glow')){
                        _status.event._result={bool:false};
                        if(game.online){
                            _status.event._resultid=id;
                            game.resume();
                        }
                        return;
                    }
                    var str=get.translation(source);
                    if(targets&&targets.length){
                        str+='对'+get.translation(targets);
                    }
                    str+='使用了';
                    str+=get.translation(card);
                    str+='，是否对其使用【炸弹】？';

                    var next=player.chooseToUse({
                        filterCard:function(card,player){
                            if(get.name(card)!='zhadan'||get.itemtype(card)!='card') return false;
                            return lib.filter.cardEnabled(card,player,'forceEnable');
                        },
                        prompt:str,
                        _global_waiting:true,
                        ai1:function(card){
                            var evt=_status.event.getParent('_zhadan')._trigger,player=_status.event.player;
                            if(!evt) return 0;
                            if(get.attitude(player,evt.player)>0) return 0;
                            var eff=0;
                            if(!targets.length) return Math.random()-0.5;
                            for(var i of targets) eff-=get.effect(i,evt.card,evt.player,player);
                            return eff-8;
                        },
                        source:source,
                        source2:targets,
                        id:id,
                        id2:id2,
                        type:'zhadan',
                    });
                    next.set('respondTo',[source,card]);

                    if(game.online){
                        _status.event._resultid=id;
                        game.resume();
                    }
                    else{
                        next.nouse=true;
                    }
                };
                'step 1'
                var list=game.filterPlayer(function(current){
                    return current.hasCard(function(card){
                        if(get.name(card)!='zhadan') return false;
                        return lib.filter.cardEnabled(card,player,'forceEnable');
                    },'hs');
                });
                event.list=list;
                event.id=get.id();
                list.sort(function(a,b){
                    return get.distance(event.source,a,'absolute')-get.distance(event.source,b,'absolute');
                });
                'step 2'
                if(event.list.length==0){
                    event.finish();
                }
                else if(_status.connectMode&&(event.list[0].isOnline()||event.list[0]==game.me)){
                    event.goto(4);
                }
                else{
                    event.current=event.list.shift();
                    event.send(event.current,event.card,event.source,event.targets,event.id,trigger.parent.id);
                }
                'step 3'
                if(result.bool){
                    event.zhadanresult=event.current;
                    event.zhadanresult2=result;
                    if(event.current!=game.me&&!event.current.isOnline()) game.delayx();
                    event.goto(8);
                }
                else{
                    event.goto(2);
                }
                'step 4'
                var id=event.id;
                var sendback=function(result,player){
                    if(result&&result.id==id&&!event.zhadanresult&&result.bool){
                        event.zhadanresult=player;
                        event.zhadanresult2=result;
                        game.broadcast('cancel',id);
                        if(_status.event.id==id&&_status.event.name=='chooseToUse'&&_status.paused){
                            return (function(){
                                event.resultOL=_status.event.resultOL;
                                ui.click.cancel();
                                if(ui.confirm) ui.confirm.close();
                            });
                        }
                    }
                    else{
                        if(_status.event.id==id&&_status.event.name=='chooseToUse'&&_status.paused){
                            return (function(){
                                event.resultOL=_status.event.resultOL;
                            });
                        }
                    }
                };

                var withme=false;
                var withol=false;
                var list=event.list;
                for(var i=0;i<list.length;i++){
                    if(list[i].isOnline()){
                        withol=true;
                        list[i].wait(sendback);
                        list[i].send(event.send,list[i],event.card,event.source,event.targets,event.id,trigger.parent.id,get.skillState(list[i]));
                        list.splice(i--,1);
                    }
                    else if(list[i]==game.me){
                        withme=true;
                        event.send(list[i],event.card,event.source,event.targets,event.id,trigger.parent.id);
                        list.splice(i--,1);
                    }
                }
                if(!withme){
                    event.goto(6);
                }
                if(_status.connectMode){
                    if(withme||withol){
                        for(var i=0;i<game.players.length;i++){
                            game.players[i].showTimer();
                        }
                    }
                }
                event.withol=withol;
                'step 5'
                if(result&&result.bool&&!event.zhadanresult){
                    game.broadcast('cancel',event.id);
                    event.zhadanresult=game.me;
                    event.zhadanresult2=result;
                }
                'step 6'
                if(event.withol&&!event.resultOL){
                    game.pause();
                }
                'step 7'
                for(var i=0;i<game.players.length;i++){
                    game.players[i].hideTimer();
                }
                'step 8'
                if(event.zhadanresult){
                    event.zhadanresult.$fullscreenpop('炸弹',get.groupnature(event.zhadanresult));
                    var next=event.zhadanresult.useResult(event.zhadanresult2);
                    next.respondTo=[trigger.player,trigger.card];
                    game.bonusNum*=2;
                    game.updateRoundNumber();
                }
            }
        },
    }
    suiSet.translate = {
        binglinchengxia:'兵临城下',
        binglinchengxia_info:'出牌阶段，对一名其他角色使用。将此牌横置于目标角色的判定区内。目标角色于判定阶段进行判定，若判定结果不为♦，则其弃置装备区内的所有牌或受到1点伤害。',        
        shuiyanqijuny:'水淹七军',
        shuiyanqijuny_info:'出牌阶段，对至多两名角色使用。目标角色受到1点雷属性伤害，然后若其：是此牌的使用者选择的第一个目标，其弃置一张牌；不是第一个目标，其摸一张牌。',
        zong:'粽',
        zong_info:'出牌阶段或一名角色濒死时可以对其使用，令其回复一点体力',
        xionghuangjiu:'雄黄酒',
        xionghuangjiu_info:'1. 出牌阶段对自己使用，本回合使用的下一张【杀】伤害+1；若当前体力小于以损失的体力值，改为使本回合使用的下一张牌伤害+1；2. 自己濒死时使用，回复1点体力。',
        tongzhougongji:'同舟共济',
        tongzhougongji_info:'出牌阶段使用，和一名其他角色各摸一张牌。',
        lizhengshangyou:'力争上游',
        lizhengshangyou_info:'出牌阶段对所有角色使用，和你同势力的角色摸X张牌，其他角色摸1张牌（X为场上势力数）',
        tunliang:'屯粮',
        tunliang_info:'出牌阶段，对至多三名角色使用。目标角色各摸一张牌。',
        yuanjun:'援军',
        yuanjun_info:'出牌阶段，对至多两名已受伤的角色使用。目标角色回复1点体力。',
        _online_gongshoujintui:'攻守进退',
        gongshoujianbei:'攻守兼备',
        gongshoujianbei_info:'出牌阶段，你可选择：①将此牌当做【万箭齐发】使用。②将此牌当做【桃园结义】使用。',
        jintuiziru:'进退自如',
        jintuiziru_info:'出牌阶段，你可选择：①将此牌当做【南蛮入侵】使用。②将此牌当做【五谷丰登】使用。',
        diqi:'地契',
        diqi_skill:'地契',
        diqi_info:'当你受到伤害时，你可以弃置此牌，防止此伤害。当此牌离开你的装备区后，销毁之。',
        _juzhong:'聚众',
        juzhong_jiu:'聚众',
        zhadan:'炸弹',
        // _online_zhadan_button:'激活炸弹',
        zhadan_info:'当一张牌被使用时，对此牌使用。取消此牌的所有目标，且本局游戏的底价翻倍。',
        jiwangkailai:'继往开来',
        jiwangkailai_info:'出牌阶段，对包含你自己在内的一名角色使用。目标角色选择一项：①弃置所有手牌，然后摸等量的牌。②将所有手牌当做一张不为【继往开来】的普通锦囊牌使用。',
        sadouchengbing:'撒豆成兵',
        sadouchengbing_info:'出牌阶段对自己使用，若你的势力为“神”，摸X张牌；否则将你手牌补至X；（X为你的体力上限且至多为5）。',
        yihuajiemu:'移花接木',
        yihuajiemu_info:'出牌阶段对一名有牌的其他角色使用，令其使用一张【杀】，或交给你两张牌。',
        chiyanzhenhunqin:'赤焰镇魂琴',
        chiyanzhenhunqin_info:'锁定技，你造成的伤害均视为具有火属性。',
        lingsheji:'灵蛇髻',
        lingsheji2:'灵蛇髻',
        shanrangzhaoshu:'禅让诏书',
        xingtianpojunfu:'刑天破军斧',
        noda_axe:'刑天破军斧',
        noda_axe2:'刑天破军斧',
        jinwuluorigong:'金乌落日弓',
        iwasawa_crowbow:'金乌落日弓',
        lingsheji_info:'出牌阶段结束时，你可选择：1.摸一张牌。2.将一张武将牌置于武将牌上，并于回合结束后获得此牌。',
        shanrangzhaoshu_info:'其他角色于回合外得到牌后，若是其本回合内第一次得到牌，则你可以选择一项：交给其一张牌，或令其交给你一张牌。',
        xingtianpojunfu_info:'当你于出牌阶段内使用牌指定唯一目标后，你可弃置两张牌。若如此做，其本回合内不能使用或打出牌且其防具技能无效。',
        jinwuluorigong_info:'当你于出牌阶段内一次性失去了两张以上的手牌后，你可以弃置一名其他角色等量的牌。',
        thedayibecomeagod_info:'选择一名其他己方角色。若其势力非神，则改为神势力；若其势力为神，则将武将牌翻至正面，回复体力至体力上限，并将手牌摸至5。',
        gubuzifeng:'故步自封',
        gubuzifeng_disable:'故步自封',
        gubuzifeng_info:'出牌阶段，对一名其他角色使用。其的一个随机技能失效直到其下个回合结束。',
        juechenjinge:'绝尘金戈',
        juechenjinge_info:'锁定技，敌方角色计算与己方其他角色距离+1。',
        xiuluolianyuji:'修罗炼狱戟',
        xiuluolianyuji_info:'你使用【杀】可以额外指定任意名攻击范围内的其他角色为目标；锁定技，你使用【杀】造成的伤害+1，然后令受到伤害的角色回复1点体力。',
        longfenghemingjian:'鸾凤和鸣剑',
        longfenghemingjian_info:'你使用的雷【杀】或火【杀】指定目标后，可令对方选择弃置一张牌或令你摸一张牌。',
        qicaishenlu:'七彩神鹿',
        qicaishenlu_info:'锁定技，你计算与其他角色的距离时-1，当你造成属性伤害时，你令此伤害+1。',
        boss_mengpohuihun:'回魂',
        boss_mengpohuihun_info:'若场上有角色在本局游戏中因孟婆的〖忘魂〗失去过技能，则令其恢复该技能；此牌进入弃牌堆后，会被销毁。',
        honghuangzhili:'洪荒之力',
        honghuangzhili_cbg:'洪',
        honghuangzhili_info:'若该角色的势力是神，你获得其一张牌，其〖神裔〗无效直到其下家的回合（这个下家是动态变化的，会随着一个人的死或者复活而变化）开始；若该角色的势力不是神，其翻面。',
        luojingxiashi:'落井下石',
        luojingxiashi_info:'出牌阶段对所有已受伤的其他角色造成一点伤害',
        toushiche:'投石车',
        toushiche_skill:'投石车',
        toushiche_info:'锁定技，结束阶段开始时，你令所有手牌数大于你的角色依次弃置一张手牌。',
        binglin_bingjin:'兵尽',
    }
    const cards = Object.keys(suiSet.card)
    const trans = Object.keys(suiSet.translate)
    const skills = Object.keys(suiSet.skill)
    suiSet.cardList = cards
    skills.forEach(s=>{
        lib.skill[s] = suiSet.skill[s]
    })
    trans.forEach(t=>{
        lib.translate[t] = suiSet.translate[t]
    })
    cards.forEach(c=>{
        lib.card[c] = suiSet.card[c]
    })
    suiSet.anoth = {
        card:suiSet.card,
        skill:suiSet.skill,
        translate:suiSet.translate
    }
    suiSet.loadCarded = true
}
if(suiSet.lib.config.extension_联机修改_play_sliceCards) {
    suiSet.loadMoreCards()
}
const { lib, game, ui, get, ai, _status } = suiSet
suiSet.loadMoreCharacters = function (bool) {
    if(suiSet.loadCharacters) return;
    const {lib, game, ui, get, ai, _status} = suiSet
    const character = {
        boss_hundun:['male','qun',25,['boss_xiongshou','boss_wuzang','boss_xiangde','boss_yinzei','boss_yinzei_switch'],['qun','mode:boss'],'qun'],
        boss_qiongqi:['male','qun','20/25',['boss_xiongshou','boss_zhue','boss_futai','boss_yandu','boss_yandu_switch'],['qun','mode:boss'],'qun'],
        boss_taotie:['male','qun',20,['boss_xiongshou','boss_tanyu','boss_cangmu','boss_jicai','boss_jicai_switch'],['qun','mode:boss'],'qun'],
        boss_taowu:['male','qun',25,['boss_xiongshou','boss_minwan','boss_nitai','boss_luanchang','boss_luanchang_switch'],['qun','mode:boss'],'qun'],
        boss_zhuyin:['male','qun',4,['boss_xiongshou'],['qun','mode:boss'],'qun'],
        
        boss_xiangliu:['male','qun',25,['boss_yaoshou','boss_duqu','boss_jiushou','boss_echou','boss_echou_switch'],['qun','mode:boss'],'qun'],
        boss_zhuyan:['male','qun','25/30',['boss_yaoshou','boss_bingxian','boss_juyuan','boss_xushi','boss_xushi_switch'],['qun','mode:boss'],'qun'],
        boss_bifang:['male','qun',25,['boss_yaoshou','boss_zhaohuo','boss_honglianx','boss_yanyu','boss_yanyu_switch'],['qun','mode:boss'],'qun'],
        boss_yingzhao:['male','qun',25,['boss_yaoshou','boss_fengdong','boss_xunyou','boss_sipu','boss_sipu_switch'],['qun','mode:boss'],'qun'],

        boss_qingmushilian:['male','',0,['boss_qingmu','boss_qingmu_intro1','boss_qingmu_intro2','boss_qingmu_intro3'],['boss'],'wu'],
        boss_qinglong:['male','qun',4,['boss_shenyi','releiji','boss_qingmu2'],['wu','mode:boss']],
        boss_mushengoumang:['male','shen',5,['boss_shenyi','boss_buchun','boss_qingmu3'],['wu','mode:boss']],
        boss_shujing:['female','shen',2,['boss_cuidu'],['wu','mode:boss']],
        boss_taihao:['male','shen',6,['boss_shenyi','boss_shenen','boss_qingyi'],['wu','mode:boss']],

        boss_zhuque:['female','shen',4,['boss_shenyi','boss_fentian','boss_chiyan2'],['shu','mode:boss']],
        boss_huoshenzhurong:['male','shen',5,['boss_shenyi','boss_xingxia','boss_chiyan3'],['shu','mode:boss']],
        boss_yanling:['male','shen',4,['boss_huihuo','boss_furan'],['shu','mode:boss']],
        boss_yandi:['male','shen',6,['boss_shenyi','boss_shenen','boss_chiyi'],['shu','mode:boss']],

        boss_baihu:['male','shen',4,['boss_shenyi','boss_kuangxiao','boss_baimang2'],['qun','mode:boss']],
        boss_jinshenrushou:['male','shen',5,['boss_shenyi','boss_xingqiu','boss_baimang3'],['qun','mode:boss']],
        boss_mingxingzhu:['female','shen',3,['boss_qingzhu','boss_jiazu','boss_jiding'],['qun','mode:boss']],
        boss_shaohao:['male','shen',6,['boss_shenyi','boss_shenen','boss_baiyi'],['qun','mode:boss']],

        boss_xuanwu:['male','shen',4,['boss_shenyi','boss_lingqu','boss_xuanlin2'],['wei','mode:boss']],
        boss_shuishengonggong:['male','shen',5,['boss_shenyi','boss_juehong','boss_xuanlin3'],['wei','mode:boss']],
        boss_shuishenxuanming:['female','shen',5,['boss_shenyi','boss_zirun','boss_xuanlin3'],['wei','mode:boss']],
        boss_zhuanxu:['male','shen',6,['boss_shenyi','boss_shenen','boss_zaoyi'],['wei','mode:boss']],

        boss_nianshou_heti:['male','shen',12,['boss_nianrui','boss_mengtai','boss_nbianshen','boss_nbianshenx'],['shu','mode:boss'],'shu'],
        boss_nianshou_jingjue:['male','shen',12,['boss_nianrui','boss_mengtai','boss_jingjue','boss_nbianshen'],['shu','mode:boss'],'shu'],
        boss_nianshou_renxing:['male','shen',12,['boss_nianrui','boss_mengtai','boss_renxing','boss_nbianshen'],['shu','mode:boss'],'shu'],
        boss_nianshou_ruizhi:['male','shen',12,['boss_nianrui','boss_mengtai','boss_ruizhi','boss_nbianshen'],['shu','mode:boss'],'shu'],
        boss_nianshou_baonu:['male','shen',12,['boss_nianrui','boss_mengtai','boss_nbaonu','boss_shouyi','boss_nbianshen'],['shu','mode:boss'],'shu'],

        boss_baiwuchang:['male','shen',9,['boss_baolian','boss_qiangzheng','boss_zuijiu','juece','boss_bianshen4'],['shu','mode:boss']],
        boss_heiwuchang:['male','shen',9,['boss_guiji','boss_taiping','boss_suoming','boss_xixing','boss_bianshen4'],['shu','mode:boss']],
        boss_luocha:['female','shen',12,['boss_modao','boss_yushou','yizhong','boss_moyany'],['shu','mode:boss']],
        boss_yecha:['male','shen',11,['boss_modao','boss_mojian','bazhen','boss_danshu'],['shu','mode:boss']],
        boss_niutou:['male','shen',7,['boss_baolian','niepan','boss_manjia','boss_xiaoshou','boss_bianshen3'],['shu','mode:boss']],
        boss_mamian:['male','shen',6,['boss_guiji','fankui','boss_lianyu','juece','boss_bianshen3'],['shu','mode:boss']],
        boss_chi:['male','shen',5,['boss_guimei','boss_didong','boss_shanbeng','boss_bianshen2'],['shu','mode:boss']],
        boss_mo:['female','shen',5,['boss_guimei','enyuan','boss_beiming','boss_bianshen2'],['shu','mode:boss']],
        boss_wang:['male','shen',5,['boss_guimei','boss_luolei','huilei','boss_bianshen2'],['shu','mode:boss']],
        boss_liang:['female','shen',5,['boss_guimei','boss_guihuo','boss_minbao','boss_bianshen2'],['shu','mode:boss']],
        
        boss_qinguangwang:['male','qun',3,['boss_panguan','boss_juhun','boss_wangxiang','boss_newhuanren'],['shu','mode:boss'],'shu'],
        boss_chujiangwang:['male','qun',4,['weimu','refankui','boss_bingfeng'],['shu','mode:boss']],
        boss_songdiwang:['male','qun',4,['boss_heisheng','boss_shengfu','enyuan'],['shu','mode:boss']],
        boss_wuguanwang:['male','qun',4,['boss_zhiwang','boss_gongzheng','boss_xuechi'],['shu','mode:boss']],
        boss_yanluowang:['male','qun',4,['boss_tiemian','boss_zhadao','boss_zhuxin'],['shu','mode:boss']],
        boss_bianchengwang:['male','qun',4,['boss_leizhou','boss_leifu','boss_leizhu'],['shu','mode:boss']],
        boss_taishanwang:['male','qun',4,['boss_fudu','boss_kujiu','boss_renao'],['shu','mode:boss']],
        boss_dushiwang:['male','qun',4,['boss_remen','boss_zhifen','boss_huoxing'],['shu','mode:boss']],
        boss_pingdengwang:['male','qun',4,['boss_suozu','boss_abi','boss_pingdeng'],['shu','mode:boss']],
        boss_zhuanlunwang:['male','qun',6,['boss_modao','boss_lunhui','boss_wangsheng','boss_zlfanshi'],['shu','mode:boss']],
        boss_mengpo:['female','qun',3,['boss_shiyou','boss_wanghun','boss_wangshi'],['shu','mode:boss']],
        boss_dizangwang:['male','qun',8,['boss_bufo','boss_wuliang','boss_dayuan','boss_diting'],['shu','mode:boss']],
        //boss_shikieiki:['female','qun',8,['boss_yingzhong'],['qun','mode:boss']],

        boss_lvbu1:['male','shen',8,['mashu','wushuang','boss_baonu','boss_jingjia','boss_aozhan'],['qun','mode:boss'],'wei'],
        boss_lvbu2:['male','shen',6,['mashu','wushuang','xiuluo','shenwei','shenji'],['qun','mode:boss'],'qun'],
        boss_lvbu3:['male','shen',6,['wushuang','shenqu','jiwu'],['qun','mode:boss'],'qun'],

        boss_caocao:['male','shen',12,['boss_guixin','xiongcai'],['wei','mode:boss'],'wei'],
        boss_guojia:['male','shen',4,['tiandu','boss_guimou','boss_yuance','boss_qizuo'],['wei','mode:boss'],'zhu'],
        boss_zhangchunhua:['female','shen',4,['jueqing','boss_wuxin','shangshix'],['wei','mode:boss'],'wei'],
        boss_zhenji:['female','shen',4,['tashui','lingbo','jiaoxia','fanghua'],['wei','mode:boss'],'wei'],

        boss_liubei:['male','shen',8,['xiaoxiong','boss_zhangwu'],['shu','mode:boss'],'qun'],
        boss_zhugeliang:['male','shen',Infinity,['xiangxing','yueyin','fengqi','gaiming'],['shu','mode:boss'],'qun'],
        boss_huangyueying:['female','shen',4,['boss_gongshen','boss_jizhi','qicai','boss_guiyin'],['shu','mode:boss'],'wei'],
        boss_pangtong:['male','shen',4,['boss_tianyu','qiwu','niepan','boss_yuhuo'],['shu','mode:boss'],'zhu'],

        boss_zhouyu:['male','shen',6,['huoshen','boss_honglian','boss_xianyin'],['wu','mode:boss'],'zhu'],

        boss_caiwenji:['female','shen',4,['beige','boss_hujia','boss_guihan'],['qun','mode:boss'],'wei'],
        boss_zhangjiao:['male','shen',8,['boss_leiji','tiandao','jidian'],['qun','mode:boss'],'shu'],
        boss_zuoci:['male','shen',0,['huanhua'],['qun','mode:boss'],'shu'],

        boss_diaochan:['female','shen',4,['fengwu','yunshen','lianji','boss_wange','yuehun'],['qun','mode:boss'],'qun'],
        boss_huatuo:['male','shen',6,['chulao','mazui','boss_shengshou','guizhen','wuqin'],['qun','mode:boss'],'wu'],
        boss_dongzhuo:['male','shen',20,['jiuchi','boss_qiangzheng','boss_baolin'],['qun','mode:boss'],'shu'],
        
        "boss_sunce":["male","shen","1/8",["boss_jiang","boss_hunzi","boss_hunyou","boss_taoni"],['qun','mode:boss'],'wu'],

        // boss_nianshou:['male','shen',Infinity,['boss_nianrui','boss_qixiang','boss_damagecount'],['boss'],'shu'],
        // boss_yuji:['male','qun',8,[],['boss','mode:boss'],'nei'],
        // boss_shuijing:['male','qun',8,[],['boss','mode:boss'],'wei'],
        // boss_sunshangxiang:['male','qun',8,[],['boss','mode:boss'],'wei'],
    }
    const skill = {
        boss_yingzhong:{
            //Unfinished
        },
        thedayibecomeagod:{
            trigger:{player:'die'},
            direct:true,
            filter:function(event,player){return player.group=='shen'},
            forceDie:true,
            skillAnimation:true,
            animationColor:'kami',
            content:function(){
                'step 0'
                player.chooseTarget(get.prompt2('thedayibecomeagod'),function(card,player,target){
                    return target.isFriendOf(player);
                }).set('forceDie',true).ai=function(target){
                    return get.attitude(_status.event.player,target);
                };
                'step 1'
                if(result.bool){
                    var target=result.targets[0];
                    event.target=target;
                    player.logSkill('thedayibecomeagod',target);
                    if(target.group!='shen'){
                        target.changeGroup('shen');
                        game.log('此刻，便是',target,'成为神明之日！');
                        event.finish();
                    }
                    else target.turnOver(false);
                }
                else event.finish();
                'step 2'
                if(target.isDamaged()) target.recover(target.maxHp-target.hp);
                'step 3'
                target.drawTo(5);
            },
        },
        TheDayIBecomeAGod:{
            trigger:{player:'useCard1'},
            ruleSkill:true,
            popup:false,
            forced:true,
            prompt:'是否将此【杀】改为神属性？',
            filter:function(event,player){
                return player.group=='shen'&&event.card.name=='sha';
            },
            content:function(){
                game.log(trigger.card,'被改为神属性');
                game.setNature(trigger.card,'kami');
            }
        },
        boss_panguan:{
            mod:{
                targetEnabled:function(card){
                    if(get.type(card)=='delay') return false;
                },
            },
        },
        boss_juhun:{
            trigger:{player:'phaseJieshuBegin'},
            forced:true,
            content:function(){
                var list=game.filterPlayer(function(current){
                    return current!=player;
                });
                if(list.length){
                    var target=list.randomGet();
                    player.line(target);
                    target[['turnOver','link'].randomGet()]();
                }
            },
        },
        boss_wangxiang:{
            trigger:{player:'die'},
            forced:true,
            forceDie:true,
            content:function(){
                game.countPlayer(function(current){
                    if(current!=player&&current.countCards('e')){
                        player.line(current);
                        current.discard(current.getCards('e'));
                    };
                });
            },
        },
        boss_xhuanren:{
            nobracket:true,
            global:'boss_xhuanren2'
        },
        boss_xhuanren2:{
            trigger:{player:'dieBegin'},
            forced:true,
            priority:-10,
            fixed:true,
            globalFixed:true,
            charlotte:true,
            silent:true,
            popup:false,
            filter:function(event,player){
                if(lib.config.mode!='boss') return false;
                if(_status.shidianyanluo_level==undefined) return false;
                return player==game.boss;
            },
            content:function(){
                var next=game.createEvent('shidianyanluo_huanren',false,trigger.getParent());
                next.player=player;
                next.forceDie=true;
                next.setContent(lib.skill.boss_xhuanren2.contentx);
            },
            contentx:function(){
                'step 0'
                game.delay();
                'step 1'
                var list=[
                    ['boss_chujiangwang','boss_songdiwang','boss_wuguanwang','boss_yanluowang'],
                    ['boss_bianchengwang','boss_taishanwang','boss_dushiwang','boss_pingdengwang'],
                    ['boss_zhuanlunwang'],
                ][_status.shidianyanluo_level];
                if(list.length==1) event._result={control:list[0]};
                else player.chooseControl(list).set('prompt','请选择下一个出战的角色').set('forceDie',true).ai=function(){
                    return list.randomGet();
                };
                'step 2'
                _status.shidianyanluo_level++;
                game.changeBoss(result.control);
            }
        },
        boss_newhuanren:{
            nobracket:true,
            global:'boss_newhuanren2',
            trigger:{global:'gameStart'},
            popup:false,
            forced:true,
            superCharlotte:true,
            charlotte:true,
            fixed:true,
            content:function(){
                if(get.mode()!='boss') return;
                //孟婆
                if(!_status.shidianyanluo_mengpo&&Math.random()<=0.4){
                    if(game.me!=game.boss){
                        game.boss.changeSeat(6);
                    }
                    else{
                        game.boss.nextSeat.changeSeat(3);
                        game.boss.previousSeat.changeSeat(5);
                    }
                    //	game.addBossFellow(game.me==game.boss?1:7,'boss_mengpo');
                    var fellow=game.addFellow(game.me==game.boss?1:7,'boss_mengpo','zoominanim');
                    if(_status.shidianyanluo_level!=0){
                        fellow.directgain(get.cards(4));
                    }
                    fellow.side=true;
                    fellow.identity='zhong';
                    fellow.setIdentity('zhong');
                    game.addVideo('setIdentity',fellow,'zhong');			
                    _status.shidianyanluo_mengpo=true;
                }
                var list=['luxun','re_luxun','zhangchunhua','zuoci','re_zuoci','re_yuji','xin_yuji','jiangfei','kongrong'];//禁将
                game.countPlayer(function(current){
                    if(current!=game.boss){
                        for(var i=0;i<list.length;i++){
                            if(current.name==list[i]||current.name2==list[i]){current.init(['sunce','re_sunce','shen_sunce','sb_sunce'].randomGet());}
                        }
                    }
                });
            },
        },
        boss_newhuanren2:{			
            trigger:{global:['die']},
            forced:true,
            priority:-10,
            fixed:true,
            globalFixed:true,
            charlotte:true,
            silent:true,
            popup:false,
            forceDie:true,
            filter:function(event,player){
                if(lib.config.mode!='boss') return false;
                if(_status.shidianyanluo_level==undefined) return false;
                return player==game.boss&&event.player==player;
            },
            content:function(){
                var next=game.createEvent('shidianyanluo_huanren',false,trigger.getParent());
                next.player=player;
                next.forceDie=true;
                next.setContent(lib.skill.boss_newhuanren2.contentx);
            },
            contentx:function(){
                'step 0'
                game.delay();
                var list=game.filterPlayer();
                for(var x=0;x<list.length;x++){
                    list[x].removeSkill('diaohulishan');
                    list[x].removeSkill('guogong2');
                }
                var list=game.boss.getEnemies();
                for(var x=0;x<list.length;x++){
                    list[x].removeSkill('boss_wangshi2');
                }
                'step 1'
                var list=[
                    ['boss_chujiangwang','boss_songdiwang','boss_wuguanwang','boss_yanluowang'],
                    ['boss_bianchengwang','boss_taishanwang','boss_dushiwang','boss_pingdengwang'],
                    ['boss_zhuanlunwang'],
                ][_status.shidianyanluo_level];
                //如果mengpo死亡且50回合内通过第三关，list[2]变成地藏王
                if(game.phaseNumber<=50&&_status.shidianyanluo_level==2&&_status.shidianyanluo_mengpodie==true){
                    list=['boss_dizangwang'];
                }
                if(list.length==1) event._result={control:list[0]};					
                else{
                    player.chooseControl(list).set('forceDie',true).set('choice',list.randomGet()).set('ai',function(){return _status.event.choice}).prompt='选择下一个登场的武将';
                }
                'step 2'
                _status.shidianyanluo_level++;
                game.changeBoss(result.control);
                //地藏王登场摸3
                if(result.control=='boss_dizangwang'){game.boss.draw(3);}
                //计回合数
                var level=_status.shidianyanluo_level;
                //孟婆
                if(!_status.shidianyanluo_mengpo){
                    if(Math.random()<=0.5||level==2){
                        if(game.me!=game.boss){
                            game.boss.changeSeat(6);
                        }
                        else{
                            game.boss.nextSeat.changeSeat(3);
                            game.boss.previousSeat.changeSeat(5);
                        }
                        //game.addBossFellow();
                        var fellow=game.addFellow(game.me==game.boss?1:7,'boss_mengpo','zoominanim');
                        if(_status.shidianyanluo_level!=0){
                            fellow.directgain(get.cards(4));
                        }
                        fellow.side=true;
                        fellow.identity='zhong';
                        fellow.setIdentity('zhong');
                        game.addVideo('setIdentity',fellow,'zhong');			
                        _status.shidianyanluo_mengpo=true;
                    }
                }
                else{
                    //移除孟婆
                    game.countPlayer2(function(current){
                        if(current.name=='boss_mengpo'){			
                            current.removed=true;
                            current.classList.add('dead');
                            current.remove();
                            game.players.remove(current);
                        }
                    });
                }
                //然后是boss进行回合
                game.phaseLoop(game.boss);
            }
        },
        boss_bingfeng:{
            trigger:{player:'die'},
            forceDie:true,
            forced:true,
            filter:function(event){
                return event.source&&!event.source.isTurnedOver();
            },
            logTarget:'source',
            content:function(){
                trigger.source.turnOver();
            }
        },
        boss_heisheng:{
            trigger:{player:'die'},
            forceDie:true,
            forced:true,
            content:function(){
                player.line(game.players.slice(0));
                game.countPlayer(function(current){
                    if(current!=player) current.link();
                });
            },
        },
        boss_shengfu:{
            trigger:{player:'phaseJieshuBegin'},
            forced:true,
            popup:false,
            content:function(){
                var list=[];
                game.countPlayer(function(current){
                    if(current==player) return;
                    var es=current.getCards('e',{subtype:['equip3','equip4','equip6']})
                    if(es.length) list.push([current,es]);
                });
                if(list.length){
                    player.logSkill('boss_heisheng');
                    var current=list.randomGet();
                    player.line(current[0]);
                    current[0].discard(current[1].randomGet());
                }
            },
        },
        boss_zhiwang:{
            derivation:'boss_zhiwang_planetarian',
            trigger:{global:'gainEnd'},
            filter:function(event,player){
                return event.player!=player&&!(event.getParent().name=='draw'&&event.getParent(2).name=='phaseDraw')&&event.player.countCards('h');
            },
            forced:true,
            logTarget:'player',
            content:function(){
                var evt=trigger.getParent('boss_zhiwang');
                if(evt&&evt.name=='boss_zhiwang'){
                    trigger.player.uninit();
                    trigger.player.init('sunce');
                }
                var hs=trigger.player.getCards('h');
                if(hs.length){
                    trigger.player.discard(hs.randomGet());
                }
            },
            subSkill:{planetarian:{}},
        },
        boss_gongzheng:{
            trigger:{player:'phaseZhunbeiBegin'},
            forced:true,
            filter:function(event,player){
                return player.countCards('j')>0;
            },
            content:function(){
                player.discard(player.getCards('j').randomGet())
            },
        },
        boss_xuechi:{
            trigger:{player:'phaseJieshuBegin'},
            forced:true,
            content:function(){
                var list=game.players.slice(0);
                list.remove(player);
                var target=list.randomGet();
                player.line(target);
                target.loseHp(2);
            },
        },
        boss_tiemian:{
            inherit:'renwang_skill',
            priority:-0.3,
            equipSkill:false,
            filter:function(event,player){
                if(!player.hasEmptySlot(2)) return false;
                return lib.skill.renwang_skill.filter.apply(this,arguments);
            },
        },
        boss_zhadao:{
            inherit:'qinggang_skill',
            equipSkill:false,
        },
        boss_zhuxin:{
            trigger:{player:'die'},
            forceDie:true,
            forced:true,
            content:function(){
                'step 0'
                player.chooseTarget('【诛心】：请选择一名角色，令其受到2点伤害。',function(card,player,target){
                    return target!=player&&!game.hasPlayer(function(current){
                        return current!=player&&current!=target&&current.hp<target.hp;
                    })
                }).set('forceDie',true).ai=function(target){
                    return -get.attitude(_status.event.player,target);
                };
                'step 1'
                if(result.bool){
                    var target=result.targets[0];
                    player.line(target);
                    target.damage(2);
                }
            },
        },
        boss_leizhou:{
            trigger:{player:'phaseZhunbeiBegin'},
            forced:true,
            content:function(){
                var list=game.players.slice(0);
                list.remove(player);
                if(list.length){
                    var target=list.randomGet();
                    player.line(target);
                    target.damage('thunder');
                }
            }
        },
        boss_leifu:{
            trigger:{player:'phaseJieshuBegin'},
            forced:true,
            content:function(){
                var list=game.players.slice(0);
                list.remove(player);
                if(list.length){
                    var target=list.randomGet();
                    player.line(target);
                    target.link();
                }
            }
        },
        boss_leizhu:{
            trigger:{player:'die'},
            forceDie:true,
            forced:true,
            content:function(){
                var list=game.players.slice(0);
                list.remove(player);
                if(list.length){
                    list.sort(lib.sort.seat);
                    player.line(list);
                    for(var i=0;i<list.length;i++){
                        list[i].damage('thunder');
                    }
                }
            }
        },
        boss_fudu:{
            trigger:{global:'useCard'},
            forced:true,
            filter:function(event,player){
                return event.card.name=='tao'&&event.player!=player&&game.players.length>2;
            },
            content:function(){
                var list=game.players.slice(0);
                list.remove(player);
                list.remove(trigger.player);
                var target=list.randomGet();
                player.line(target);
                target.loseHp();
            },
        },
        boss_kujiu:{
            trigger:{global:'phaseZhunbeiBegin'},
            forced:true,
            filter:function(event,player){
                return event.player!=player;
            },
            logTarget:'player',
            content:function(){
                'step 0'
                trigger.player.loseHp();
                'step 1'
                trigger.player.useCard({name:'jiu'},trigger.player);
            },
        },
        boss_renao:{
            trigger:{player:'die'},
            forceDie:true,
            forced:true,
            content:function(){
                var list=game.players.slice(0);
                list.remove(player);
                if(list.length){
                    var target=list.randomGet();
                    player.line(target);
                    target.damage(3,'fire');
                }
            }
        },
        boss_remen:{
            equipSkill:true,
            trigger:{target:['useCardToBefore']},
            forced:true,
            priority:6,
            audio:true,
            filter:function(event,player){
                if(!player.hasEmptySlot('equip2')) return false;
                if(event.card.name=='nanman') return true;
                if(event.card.name=='wanjian') return true;
                return event.card.name=='sha'&&!game.hasNature(event.card);
            },
            content:function(){
                trigger.cancel();
            },
            ai:{
                effect:{
                    target:function(card,player,target,current){
                        if(!target.hasEmptySlot('equip2')) return;
                        if(card.name=='nanman'||card.name=='wanjian') return 'zerotarget';
                        if(card.name=='sha'){
                            var equip1=player.getEquip(1);
                            if(equip1&&equip1.name=='zhuque') return 1.9;
                            if(!game.hasNature(card)) return 'zerotarget';
                        }
                    }
                }
            }
        },
        boss_zhifen:{
            trigger:{player:'phaseZhunbeiBegin'},
            forced:true,
            content:function(){
                'step 0'
                var list=game.filterPlayer();
                list.remove(player);
                if(list.length){
                    var target=list.randomGet();
                    player.line(target);
                    event.target=target;
                    if(target.countGainableCards(player,'h')) player.gainPlayerCard(target,'h',true);
                }
                else event.finish();
                'step 1'
                target.damage('fire');
            }
        },
        
        boss_huoxing:{
            trigger:{player:'die'},
            forceDie:true,
            forced:true,
            content:function(){
                var list=game.players.slice(0);
                list.remove(player);
                if(list.length){
                    list.sort(lib.sort.seat);
                    player.line(list);
                    for(var i=0;i<list.length;i++){
                        list[i].damage('fire');
                    }
                }
            }
        },
        boss_suozu:{
            trigger:{player:'phaseZhunbeiBegin'},
            forced:true,
            content:function(){
                var list=game.players.slice(0);
                list.remove(player);
                if(list.length){
                    list.sort(lib.sort.seat);
                    player.line(list);
                    for(var i=0;i<list.length;i++){
                        list[i].link();
                    }
                }
            }
        },
        boss_abi:{
            trigger:{player:'damageEnd'},
            forced:true,
            filter:function(event){
                return event.source!=undefined;
            },
            logTarget:'source',
            content:function(){
                trigger.source.damage().nature=['fire','thunder'].randomGet();
            },
        },
        boss_pingdeng:{
            trigger:{player:'die'},
            forceDie:true,
            forced:true,
            content:function(){
                'step 0'
                var list=game.filterPlayer(function(current){
                    return current!=player&&!game.hasPlayer(function(current2){
                        return current2.hp>current.hp;
                    });
                });
                if(list.length){
                    var target=list.randomGet()
                    player.line(target);
                    target.damage(2).nature=lib.linked.randomGet();
                }
                else event.finish();
                'step 1'
                var list=game.filterPlayer(function(current){
                    return current!=player&&!game.hasPlayer(function(current2){
                        return current2.hp>current.hp;
                    });
                });
                if(list.length){
                    var target=list.randomGet();
                    player.line(target);
                    target.damage().nature=lib.linked.randomGet();
                }
            },
        },
        boss_lunhui:{
            trigger:{player:'phaseZhunbeiBegin'},
            forced:true,
            filter:function(event,player){
                return player.hp<=2&&game.hasPlayer(function(current){
                    return current!=player&&current.hp>2;
                });
            },
            content:function(){
                var list=game.filterPlayer(function(current){
                    return current!=player&&current.hp>2;
                });
                if(list.length){
                    var target=list.randomGet();
                    player.line(target);
                    var hp1=player.hp;
                    var hp2=target.hp;
                    player.hp=Math.min(player.maxHp,hp2);
                    target.hp=Math.min(target.maxHp,hp1);
                    player.update();
                    target.update();
                    game.log(player,'和',target,'交换了体力值')
                }
            },
        },
        boss_wangsheng:{
            trigger:{player:'phaseUseBegin'},
            forced:true,
            content:function(){
                var name=['nanman','wanjian'].randomGet();
                player.useCard({name:name},game.filterPlayer(function(current){
                    return player.canUse({name:name},current)
                }),'noai');
            },
        },
        boss_zlfanshi:{
            trigger:{player:'damageEnd'},
            forced:true,
            content:function(){
                if(player.hasSkill('boss_zlfanshi_terra')){
                    var list=game.players.slice(0);
                    list.remove(player);
                    if(list.length){
                        var target=list.randomGet();
                        player.line(target);
                        target.damage();
                    }
                }
                else player.addTempSkill('boss_zlfanshi_terra');
            },
        },
        boss_zlfanshi_terra:{charlotte:true},
        //孟婆:
        "boss_shiyou":{
            audio:true,
            trigger:{global:'loseAfter'},
            filter:function(event,player){
                var evt=event.getParent(3);
                return event.type=='discard'&&evt.name=='phaseDiscard'&&evt.player==event.player&&evt.player!=player&&event.cards2&&event.cards2.filterInD('d').length>0;
            },
            content:function(){
                "step 0"
                event.cards=trigger.cards2.filterInD('d');
                "step 1"
                var next=player.chooseCardButton(get.prompt('boss_shiyou'),event.cards,[1,event.cards.length]).set('ai',function(button){
                    return get.value(button.link,player);
                }).set('filterButton',function(button){
                    for(var i=0;i<ui.selected.buttons.length;i++){
                        if(get.suit(ui.selected.buttons[i].link)==get.suit(button.link)) return false;
                    }
                    return true;
                });
                "step 2"
                if(result.bool){
                    player.gain(result.links,'gain2','log');
                }
            },
        },
        "boss_wangshi":{
            trigger:{global:'phaseZhunbeiBegin'},
            forced:true,
            audio:true,
            filter:function(event,player){
                if(player.getEnemies().contains(event.player)){return true;}
                return false;
            },
            logTarget:'player',
            content:function(){
                var list=['basic','trick','equip'].randomGet();
                trigger.player.addTempSkill('boss_wangshi2');
                trigger.player.storage.boss_wangshi2=[list];
                game.log(trigger.player,'本回合不能使用或打出',list,'牌');
                trigger.player.markSkill('boss_wangshi2');
            },
        },
        "boss_wangshi2":{
            unique:true,
            charlotte:true,
            intro:{
                content:function(storage){
                    return '不能使用或打出'+get.translation(storage)+'牌';
                }
            },
            init:function(player,skill){
                if(!player.storage[skill]) player.storage[skill]=[];
            },
            //mark:true,
            onremove:true,
            mod:{
                cardEnabled2:function(card,player){
                    if(player.storage.boss_wangshi2.contains(get.type(card,'trick'))) return false;
                },
            },
        },
        "boss_mengpohuihun1":{
            mode:['boss'],
            trigger:{
                player:'loseEnd',
                global:'cardsDiscardEnd',
            },
            filter:function(event,player){
                for(var i=0;i<event.cards.length;i++){
                    if(event.cards[i].name=='boss_mengpohuihun'&&get.position(event.cards[i],true)=='d'){
                        return true;
                    }
                }
                return false;
            },
            forced:true,
            popup:false,
            content:function(){
                var cards=[];
                for(var i=0;i<trigger.cards.length;i++){
                    if(trigger.cards[i].name=='boss_mengpohuihun'&&get.position(trigger.cards[i])=='d'){
                        cards.push(trigger.cards[i]);
                    }
                }
                if(cards.length){
                    game.cardsGotoSpecial(cards);
                    game.log(cards,'已被移出游戏');
                    player.popup('回魂');
                }
            },
        },
        "boss_wanghun":{
            audio:true,
            forced:true,
            trigger:{player:'die'},
            forceDie:true,
            content:function(){
                _status.shidianyanluo_mengpodie=true;
                var list=player.getEnemies();
                if(list.length>0){
                    for(var x=0;x<list.length;x++){
                        list[x].removeSkill('boss_wangshi2');
                    }
                    var ran1=list.randomGet();//第一个角色
                    list.remove(ran1);//移除
                    var skills1=ran1.getSkills(true,false);
                    if(skills1.length){
                        for(var i=0;i<skills1.length;i++){//排除技能，然后随机失去一个可以失去的技能
                            if(get.skills[i]||lib.skill[skills1[i]].charlotte||!lib.translate[skills1[i]+'_info']||lib.skill[skills1[i]].zhuSkill==true){
                                skills1.splice(i--,1);
                            }
                        }
                        if(skills1.length>0){
                            skills1=skills1.randomGet();			
                            ran1.disableSkill('boss_wanghun',skills1);
                            game.log(ran1,'失去了',skills1);
                        }
                        else{
                            game.log(ran1,'没有技能可失去');
                        }
                    }
                    if(list.length>0){
                        var ran2=list.randomGet();//第二个角色
                        list.remove(ran2);//移除
                        var skills2=ran2.getSkills(true,false);
                        if(skills2.length){
                            for(var i=0;i<skills2.length;i++){//排除技能，然后随机失去一个可以失去的技能
                                if(get.skills[i]||lib.skill[skills2[i]].charlotte||!lib.translate[skills2[i]+'_info']||lib.skill[skills2[i]].zhuSkill==true){
                                    skills2.splice(i--,1);
                                }
                            }
                            if(skills2.length>0){
                                skills2=skills2.randomGet();			
                                ran2.disableSkill('boss_wanghun',skills2);
                                game.log(ran2,'失去了',skills2);
                            }
                            else{
                                game.log(ran2,'没有技能可失去');
                            }
                        }
                    }
                    //添加两张回魂			
                    if(get.mode()=='boss'){
                        var card1=game.createCard('boss_mengpohuihun','heart',3,null);
                        var card2=game.createCard('boss_mengpohuihun','club',4,null);
                        var a=[];
                        if(ui.cardPile.childElementCount<3){
                            game.boss.getCards(4);
                        }
                        for(var i=0;i<ui.cardPile.childElementCount;i++){
                            a.push(i);
                        }
                        ui.cardPile.insertBefore(card1,ui.cardPile.childNodes[a.randomGet()]);
                        a.push(a.length);
                        ui.cardPile.insertBefore(card2,ui.cardPile.childNodes[a.randomGet()]);
                        game.log('牌堆中添加了',card1,card2);
                        game.updateRoundNumber();
                    }
                }
            },
        },
        //地藏王:
        "boss_bufo":{
            audio:true,
            forced:true,
            trigger:{
                player:['damageBegin4','phaseZhunbeiBegin'],
            },
            filter:function(event,player,name){
                if(name=='damageBegin4'){return event.num&&event.num>1;}
                return game.hasPlayer(function(target){
                    return player!=target&&get.distance(player,target)<=1;
                });
            },
            content:function(){
                var name=event.triggername;
                if(name=='damageBegin4'){
                    trigger.num--;
                }
                else{
                    game.countPlayer(function(target){
                        if(player!=target&&get.distance(player,target)<=1){
                            target.damage(1,player,'fire');
                        }
                    });
                }
            },
        },
        "boss_wuliang":{
            forced:true,
            audio:true,
            trigger:{
                global:"gameDrawAfter",
                player:['phaseZhunbeiBegin','phaseJieshuBegin','enterGame'],
            },
            filter:function(event,player,name){
                if(name=='gameDrawAfter'||name=='enterGame'){
                    return true;
                }
                else if(name=='phaseZhunbeiBegin'){
                    return player.hp<3;
                }
                return true;
            },
            content:function(){
                var name=event.triggername;
                if(name=='phaseZhunbeiBegin'){
                    player.recover(3-player.hp);
                }
                else{
                    player.draw((name=='gameDrawAfter'||name=='enterGame')?3:2);
                }
            },
        },
        "boss_dayuan":{
            trigger:{
                global:"judge",
            },
            audio:true,
            direct:true,
            lastDo:true,
            content:function (){
            'step 0'
            var card=trigger.player.judging[0];
            var judge0=trigger.judge(card);
            var judge1=0;
            var choice='cancel2';
            event.suitchoice='cancel2';
            var attitude=get.attitude(player,trigger.player);
            var list=[];
            event.suitx=['heart','diamond','club','spade'];
            for(var x=0;x<4;x++){
                for(var i=1;i<14;i++){
                    list.add(i);
                    var judge2=(trigger.judge({
                        name:get.name(card),
                        suit:event.suitx[x],
                        number:i,
                        nature:get.nature(card),
                    })-judge0)*attitude;
                    if(judge2>judge1){
                        choice=i;
                        event.suitchoice=event.suitx[x];
                        judge1=judge2;
                    }
                }
            }
            list.push('cancel2');
            event.suitx.push('cancel2');
            player.chooseControl(list).set('ai',function(){
                return _status.event.choice;
            }).set('choice',choice).prompt=get.prompt2(event.name);
            'step 1'		
            if(result.control!='cancel2'){
                if(!event.logged){
                    event.logged=true;
                    player.logSkill(event.name,trigger.player);
                }
                game.log(trigger.player,'判定结果点数为','#g'+result.control);
                player.popup(result.control,'fire');
                if(!trigger.fixedResult) trigger.fixedResult={};
                trigger.fixedResult.number=result.control;
            }		
            player.chooseControl(event.suitx).set('ai',function(){
                return _status.event.choice;
            }).set('choice',event.suitchoice).prompt=get.prompt2(event.name);
            'step 2'
            if(result.control!='cancel2'){
                if(!event.logged){
                    event.logged=true;
                    player.logSkill(event.name,trigger.player);
                }
                game.log(trigger.player,'判定结果花色为','#g'+result.control);
                player.popup(result.control,'fire');
                if(!trigger.fixedResult) trigger.fixedResult={};
                trigger.fixedResult.suit=result.control;
                if(result.control=='club'||result.control=='spade'){
                    trigger.fixedResult.color='black';
                }
                else if(result.control=='heart'||result.control=='diamond'){
                    trigger.fixedResult.color='red';
                }
            }
            },
        },
        "boss_diting":{
            audio:true,
            mod:{
                globalFrom:function (from,to,distance){		
                    return distance-1;		
                },
                globalTo:function (from,to,distance){
                    return distance+1;
                },
            },
            enable:"phaseUse",
            position:'h',
            filter:function (event,player){
                return player.countCards('he',{subtype:['equip3','equip4','equip6']})>0;
            },
            filterCard:function (card){
                return get.subtype(card)=='equip3'||get.subtype(card)=='equip4'||get.subtype(card)=='equip6';
            },
            check:function (card){
                if(_status.event.player.isDisabled(get.subtype(card))) return 5;
                return 3-get.value(card);
            },
            content:function(){
                player.draw();
            },
            discard:false,
            visible:true,
            loseTo:'discardPile',
            prompt:"将一张坐骑牌置入弃牌堆并摸一张牌",
            delay:0.5,
            prepare:function (cards,player){
                player.$throw(cards,1000);
                game.log(player,'将',cards,'置入了弃牌堆');
            },
            ai:{
                order:10,
                result:{
                    player:1,
                },
            },
            group:'boss_diting_init',
            subSkill:{
                init:{
                    trigger:{
                        global:'gameStart',
                        player:'enterGame',
                    },
                    forced:true,
                    filter:function(event,player){
                        return player.hasEnabledSlot(3)||player.hasEnabledSlot(4);
                    },
                    content:function(){
                        var disables=[];
                        for(var i=3;i<=4;i++){
                            for(var j=0;j<player.countEnabledSlot(i);j++){
                                disables.push(i);
                            }
                        }
                        if(disables.length>0) player.disableEquip(disables);
                    },
                }
            },
        },
        /*
        "boss_sdyl_level":{
            trigger:{global:'gameStart'},
            forced:true,
            superCharlotte:true,
            charlotte:true,
            fixed:true,
            content:function(){},
            contentplayer:function(player){			
                var list=[1,2,3,4,5];
                var list2=["boss_sdyl_playerlevel1","boss_sdyl_playerlevel2","boss_sdyl_playerlevel3","boss_sdyl_playerlevel4","boss_sdyl_playerlevel5"];
                player.removeAdditionalSkill('boss_sdyl_level');
                var num=list.randomGet();
                player.storage.boss_sdyl_level=num;
                var list3=list2.concat();
                list3.length=num;
                player.addAdditionalSkill('boss_sdyl_level',list3);
                game.log(player,'的等阶为',num);
                if(num>1){
                    var a=function(card){
                        return get.type(card)=='equip';
                    };
                    for(var i=0;i<ui.cardPile.childNodes.length;i++){
                        if(a(ui.cardPile.childNodes[i])){
                            player.chooseUseTarget(ui.cardPile.childNodes[i],'noanimate','nopopup',true);
                            ui.cardPile.removeChild(ui.cardPile.childNodes[i]);
                            player.update();
                            game.delay(2);
                            break;
                        }
                    }
                }
            },
            contentboss:function(boss){			
                var list=[1,2,3,4,5];
                var list2=["boss_sdyl_bosslevel1","boss_sdyl_bosslevel2","boss_sdyl_bosslevel3","boss_sdyl_bosslevel4","boss_sdyl_bosslevel5"];
                boss.removeAdditionalSkill('boss_sdyl_level');
                var num=list.randomGet();
                boss.storage.boss_sdyl_level=num;
                var list3=list2.concat();
                list3.length=num;
                boss.addAdditionalSkill('boss_sdyl_level',list3);
                game.log(boss,'的等阶为',num);
                if(num>1){
                    var a=function(card){
                        return get.type(card)=='equip';
                    };
                    for(var i=0;i<ui.cardPile.childNodes.length;i++){
                        if(a(ui.cardPile.childNodes[i])){
                            boss.chooseUseTarget(ui.cardPile.childNodes[i],'noanimate','nopopup',true);
                            ui.cardPile.removeChild(ui.cardPile.childNodes[i]);
                            boss.update();
                            game.delay(2);
                            break;
                        }
                    }
                }
            },
        },
        "boss_sdyl_playerlevel1":{
            fixed:true,
            globalFixed:true,
            charlotte:true,
            silent:true,
            popup:false,
            forced:true,
        },
        "boss_sdyl_playerlevel3":{
            fixed:true,
            globalFixed:true,
            charlotte:true,
            silent:true,
            popup:false,
            forced:true,
            init:function(player){					
                player.maxHp++;
                player.hp++;
                player.update();
            },
            mod:{
                cardUsable:function (card,player,num){
                    if(card.name=='sha') return num+=1;
                },
            },
        },
        "boss_sdyl_playerlevel2":{
            fixed:true,
            globalFixed:true,
            charlotte:true,
            silent:true,
            popup:false,
            forced:true,
        },
        "boss_sdyl_playerlevel4":{
            fixed:true,
            globalFixed:true,
            charlotte:true,
            silent:true,
            popup:false,
            forced:true,
            trigger:{player:'phaseDrawBegin2'},
            forced:true,
            filter:function (event,player){
                return !event.numFixed;
            },
            content:function(){
                trigger.num++;
            },
        },
        "boss_sdyl_playerlevel5":{
            init:function(player){
                player.storage.boss_sdyl_playerlevel5=false;	
                player.maxHp++;
                player.hp++;
                player.update();
            },
            audio:'niepan',
            unique:true,
            enable:'chooseToUse',
            mark:true,
            skillAnimation:true,
            animationStr:'重生',
            limited:true,
            animationColor:'orange',
            filter:function(event,player){
                if(player.storage.boss_sdyl_playerlevel5) return false;
                if(event.type=='dying'){
                    if(player!=event.dying) return false;
                    return true;
                }
                return false;
            },
            content:function(){
                'step 0'
                player.awakenSkill('boss_sdyl_playerlevel5');
                player.storage.boss_sdyl_playerlevel5=true;
                player.discard(player.getCards('j'));
                'step 1'
                player.link(false);
                'step 2'
                player.turnOver(false);
                'step 3'
                player.drawTo(Math.min(5,player.maxHp));
                'step 4'
                player.recover(player.maxHp-player.hp);					
            },
            ai:{
                order:1,
                skillTagFilter:function(player){
                    if(player.storage.boss_sdyl_playerlevel5) return false;
                    if(player.hp>0) return false;
                },
                save:true,
                result:{
                    player:function(player){
                        if(player.hp<=0) return 10;
                        if(player.hp<=2&&player.countCards('he')<=1) return 10;
                        return 0;
                    }
                },
                threaten:function(player,target){
                    if(!target.storage.boss_sdyl_playerlevel5) return 0.6;
                }
            },
            intro:{
                content:'limited'
            }		
        },
        "boss_sdyl_bosslevel1":{
            fixed:true,
            globalFixed:true,
            charlotte:true,
            silent:true,
            popup:false,
            forced:true,
        },
        "boss_sdyl_bosslevel3":{
            fixed:true,
            globalFixed:true,
            charlotte:true,
            silent:true,
            popup:false,
            forced:true,
            init:function(player){
                player.maxHp++;
                player.hp++;
                player.update();
            },
            trigger:{player:'phaseZhunbeiBegin'},
            forced:true,
            content:function(){
                var card=get.cardPile('sha');
                if(card){
                    player.gain(card);
                }
            },
            mod:{
                cardUsable:function (card,player,num){
                    if(card.name=='sha') return num+=1;
                },
            },
        },
        "boss_sdyl_bosslevel2":{
            fixed:true,
            globalFixed:true,
            charlotte:true,
            silent:true,
            popup:false,
            forced:true,
        },
        "boss_sdyl_bosslevel4":{
            fixed:true,
            globalFixed:true,
            charlotte:true,
            silent:true,
            popup:false,
            forced:true,
            trigger:{player:'phaseDrawBegin2'},
            forced:true,
            filter:function (event,player){
                return !event.numFixed;
            },
            content:function(){
                trigger.num++;
            },
            mod:{
                maxHandcard:function (player,num){
                    return num+=1;
                },
            },
        },
        "boss_sdyl_bosslevel5":{
            fixed:true,
            globalFixed:true,
            charlotte:true,
            silent:true,
            popup:false,
            forced:true,
            init:function(player){
                player.maxHp++;
                player.hp++;
                player.update();
                if(_status.shidianyanluo_level&&_status.shidianyanluo_level>0){
                    var players=game.filterPlayer(function(current){return current!=player;});
                    player.useCard({name:'nanman'},false,players);
                }
            },
            trigger:{
                source:"damageBegin4",
                player:"useCardAfter",
                global:'gameDrawAfter',
            },
            filter:function (event,player,name){
                if(name=='gameDrawAfter'){
                    if(!_status.shidianyanluo_level||_status.shidianyanluo_level==0){
                        var players=game.filterPlayer(function(current){return current!=player;});
                        player.useCard({name:'nanman'},false,players);
                    }
                    return false;
                }
                if(player.storage.boss_sdyl_bosslevel5) return false;
                if(name=='damageBegin4'){
                    if(!event.card||event.card.name!='nanman') return false;
                    return true;
                }else if(name=='useCardAfter'){
                    if(!event.card||event.card.name!='nanman') return false;
                    player.storage.boss_sdyl_bosslevel5=true;
                    return false;
                }				
            },
            content:function (){
                trigger.num++;
            },
        },
*/
        "boss_jingjia":{},
        "boss_aozhan":{
            forced:true,
            locked:true,
            charlotte:true,
            group:["boss_aozhan_wuqi","boss_aozhan_fangju","boss_aozhan_zuoji","boss_aozhan_baowu"],
            subSkill:{
                wuqi:{
                    mod:{
                        cardUsable:function(card,player,num){
                            if(player.getEquip(1)&&card.name=='sha') return num+1;
                        },
                    },
                    sub:true,
                },
                fangju:{
                    trigger:{
                        player:"damageBegin4",
                    },
                    forced:true,
                    filter:function (event,player){
                        return player.getEquip(2)&&event.num>1; 
                    },
                    content:function (){
                        trigger.num=1; 
                    },
                    sub:true,
                },
                zuoji:{
                    trigger:{
                        player:"phaseDrawBegin",
                    },
                    forced:true,
                    filter:function (event,player){
                        return (player.getEquip(3)||player.getEquip(4)); 
                    },
                    content:function(){
                        trigger.num++;
                    },
                    sub:true,
                },
                baowu:{
                    trigger:{
                        player:"phaseJudgeBefore",
                    },
                    forced:true,
                    filter:function (event,player){
                        return player.getEquip(5);
                    },
                    content:function (){
                        trigger.cancel();
                        game.log(player,'跳过了判定阶段');
                    },
                    sub:true,
                },
            },
        },
        
        boss_yaoshou:{
            mod:{
                globalFrom:function(from,to,distance){
                    return distance-2;
                },
            },
        },
        boss_duqu:{
            trigger:{player:'damageEnd'},
            filter:function(event,player){
                return event.source&&!event.source.hasSkill('boss_duqu');
            },
            content:function(){
                var target=trigger.source;
                if(!target.storage.boss_shedu) target.storage.boss_shedu=0;
                target.storage.boss_shedu++;
                target.markSkill('boss_shedu');
            },
            forced:true,
            global:'boss_shedu',
            mod:{
                cardname:function (card,player){
                    if(card.name=='tao') return 'sha';
                },
            },
        },
        boss_shedu:{
            trigger:{player:"phaseBegin"},
            mark:true,
            intro:{content:'mark'},
            forced:true,
            filter:function(event,player){
                return player.storage.boss_shedu&&player.storage.boss_shedu>0;
            },
            content:function(){
                'step 0'
                var num=player.storage.boss_shedu;
                event.num=num;
                var chs=get.cnNumber(num);
                player.chooseToDiscard('he',num,'弃置'+chs+'张牌，或失去'+chs+'点体力').ai=function(card){
                    return 12-get.value(card);
                };
                'step 1'
                if(!result.bool) player.loseHp(num);
                player.storage.boss_shedu--;
                if(num>1) player.markSkill('boss_shedu');
                else player.unmarkSkill('boss_shedu');
            },
        },
        boss_jiushou:{
            mod:{
                maxHandcard:function(player,num){
                    return num-player.hp+9;
                },
            },
            trigger:{player:['phaseUseBegin','phaseJieshuBegin','phaseDrawBegin']},
            forced:true,
            filter:function(event,player){
                return event.name=='phaseDraw'||player.countCards('h')<9;
            },
            content:function(){
                if(trigger.name=='phaseDraw') trigger.cancel();
                else player.draw(9-player.countCards('h'));
            },
        },
        boss_echou_switch:{
            unique:true,
            charlotte:true,
            group:['boss_echou_switch_on','boss_echou_switch_off'],
            subSkill:{
                off:{
                    trigger:{global:'gameStart'},
                    content:function(){
                        player.disableSkill('boss_echou_awake','boss_echou');
                    },
                    silent:true
                },
                on:{
                    trigger:{player:'changeHp'},
                    filter:function(event,player){
                        return player.hp<=player.maxHp/2;
                    },
                    forced:true,
                    skillAnimation:true,
                    animationColor:'thunder',
                    content:function(){
                        player.enableSkill('boss_echou_awake');
                        player.removeSkill('boss_echou_switch');
                    }
                }
            }
        },
        boss_echou:{
            trigger:{global:'useCard'},
            filter:function(event,player){
                return !event.player.hasSkill('boss_duqu')&&['tao','jiu'].contains(event.card.name);
            },
            content:function(){
                var target=trigger.player;
                player.line(target);
                if(!target.storage.boss_shedu) target.storage.boss_shedu=0;
                target.storage.boss_shedu++;
                target.markSkill('boss_shedu');
            },
        },
        boss_bingxian:{
            trigger:{global:'phaseJieshuBegin'},
            filter:function(event,player){
                return event.player!=player&&event.player.countUsed('sha',true)==0;
            },
            forced:true,
            content:function(){
                player.useCard({name:'sha'},trigger.player);
            },
        },
        boss_juyuan:{
            init:function(player,skill){
                player.storage[skill]=0;
            },
            trigger:{player:'phaseAfter'},
            forced:true,
            silent:true,
            popup:false,
            content:function(){
                player.storage.boss_juyuan=player.hp;
            },
            mod:{
                selectTarget:function (card,player,range){
                    if(card.name!='sha') return;
                    if(range[1]==-1) return;
                    if(player.hp>=player.storage.boss_juyuan) return;
                    range[1]+=2;
                },
            },
        },
        boss_xushi_switch:{
            unique:true,
            charlotte:true,
            group:['boss_xushi_switch_on','boss_xushi_switch_off'],
            subSkill:{
                off:{
                    trigger:{global:'gameStart'},
                    content:function(){
                        player.disableSkill('boss_xushi_awake','boss_xushi');
                    },
                    silent:true
                },
                on:{
                    trigger:{player:'changeHp'},
                    filter:function(event,player){
                        return player.hp<=player.maxHp/2;
                    },
                    forced:true,
                    skillAnimation:true,
                    animationColor:'thunder',
                    content:function(){
                        player.enableSkill('boss_xushi_awake');
                        player.removeSkill('boss_xushi_switch');
                    }
                }
            }
        },
        boss_xushi:{
            trigger:{player:['phaseUseEnd','turnOverEnd']},
            filter:function(event,player){
                return event.name=='phaseUse'||!player.isTurnedOver();
            },
            forced:true,
            content:function(){
                'step 0'
                if(trigger.name=='phaseUse'){
                    player.turnOver();
                    event.finish();
                }
                else{
                    event.list=game.filterPlayer(function(current){
                        return current!=player;
                    });
                    event.list.sort(lib.sort.seat);
                    player.line(event.list,'green');
                }
                'step 1'
                var target=event.list.shift();
                target.damage([1,2].randomGet());
                if(event.list.length) event.redo();
            },
        },
        boss_zhaohuo:{
            trigger:{
                player:'damageBegin4',
                source:'damageBegin1',
            },
            forced:true,
            filter:function(event,player){
                if(player==event.player) return event.hasNature('fire')||player==event.source;
                return true;
            },
            content:function(){
                if(player==trigger.player) trigger.cancel();
                else game.setNature(trigger,'fire');
            },
            ai:{
                unequip:true,
                skillTagFilter:function(player){
                    if(player!=_status.currentPhase) return false;
                },
            },
        },
        boss_honglianx:{
            mod:{
                ignoredHandcard:function (card,player){
                    if(get.color(card)=='red'){
                        return true;
                    }
                },
                cardDiscardable:function (card,player,name){
                    if(name=='phaseDiscard'&&get.color(card)=='red') return false;
                },
            },
            forced:true,
            trigger:{player:'phaseZhunbeiBegin'},
            content:function(){
                'step 0'
                event.num1=3;
                event.num2=[0,1,2,3].randomGet();
                event.togain=[];
                while(event.togain.length<event.num2){
                    var card=get.cardPile(function(card){
                        return !event.togain.contains(card)&&get.color(card)=='red';
                    });
                    if(card) event.togain.push(card);
                    else break;
                }
                event.num1-=event.togain.length;
                if(event.togain.length) player.gain(event.togain,'draw');
                if(event.num1==0) event.finish();
                else{
                    event.list=game.filterPlayer(function(current){
                        return current!=player;
                    }).randomGets(event.num1).sortBySeat();
                    player.line(event.list,'fire');
                }
                'step 1'
                var target=event.list.shift();
                target.damage('fire');
                if(event.list.length) event.redo();
            },
        },
        boss_yanyu_switch:{
            unique:true,
            charlotte:true,
            group:['boss_yanyu_switch_on','boss_yanyu_switch_off'],
            subSkill:{
                off:{
                    trigger:{global:'gameStart'},
                    content:function(){
                        player.disableSkill('boss_yanyu_awake','boss_yanyu');
                    },
                    silent:true
                },
                on:{
                    trigger:{player:'changeHp'},
                    filter:function(event,player){
                        return player.hp<=player.maxHp/2;
                    },
                    forced:true,
                    skillAnimation:true,
                    animationColor:'thunder',
                    content:function(){
                        player.enableSkill('boss_yanyu_awake');
                        player.removeSkill('boss_yanyu_switch');
                    }
                }
            }
        },
        boss_yanyu:{
            forced:true,
            trigger:{global:'phaseBegin'},
            filter:function(event,player){
                return player!=event.player;
            },
            content:function(){
                'step 0'
                event.count=3;
                player.line(trigger.player,'fire');
                'step 1'
                event.count--;
                trigger.player.judge(function(card){
                    if(get.color(card)=='red') return -5;
                    return 5;
                });
                'step 2'
                if(!result.bool){
                    trigger.player.damage('fire');
                    if(event.count) event.goto(1);
                }
            },
        },
        boss_fengdong:{
            trigger:{player:"phaseBegin"},
            forced:true,
            content:function(){
                game.countPlayer(function(current){
                    if(current!=player) current.addTempSkill('fengyin');
                });
            },
        },
        boss_xunyou:{
            trigger:{global:'phaseBegin'},
            forced:true,
            filter:function(event,player){
                return player!=event.player
            },
            content:function(){
                'step 0'
                var list=game.filterPlayer(function(current){
                    return current!=player&&current.countCards('hej');
                });
                if(list.length){
                    var target=list.randomGet();
                    player.line(target,'green');
                    var card=target.getCards('hej').randomGet();
                    event.card=card;
                    player.gain(card,target);
                    target.$giveAuto(card,player);
                }
                else event.finish();
                'step 1'
                if(player.getCards('h').contains(card)&&get.type(card)=='equip') player.chooseUseTarget(card,true,'nopopup','noanimate');
            },
        },
        boss_sipu_switch:{
            unique:true,
            charlotte:true,
            group:['boss_sipu_switch_on','boss_sipu_switch_off'],
            subSkill:{
                off:{
                    trigger:{global:'gameStart'},
                    content:function(){
                        player.disableSkill('boss_sipu_awake','boss_sipu');
                    },
                    silent:true
                },
                on:{
                    trigger:{player:'changeHp'},
                    filter:function(event,player){
                        return player.hp<=player.maxHp/2;
                    },
                    forced:true,
                    skillAnimation:true,
                    animationColor:'thunder',
                    content:function(){
                        player.enableSkill('boss_sipu_awake');
                        player.removeSkill('boss_sipu_switch');
                    }
                }
            }
        },
        boss_sipu:{
            global:'boss_sipu2',
        },
        boss_sipu2:{
            mod:{
                cardEnabled:function(card,player){
                    var sc=_status.currentPhase;
                    if(sc&&sc!=player&&sc.isPhaseUsing()&&sc.hasSkill('boss_sipu')&&!sc.hasSkill('boss_sipu_switch')&&sc.countUsed()<3){
                        return false;
                    }
                },
                cardUsable:function (card,player){
                    var sc=_status.currentPhase;
                    if(sc&&sc!=player&&sc.isPhaseUsing()&&sc.hasSkill('boss_sipu')&&!sc.hasSkill('boss_sipu_switch')&&sc.countUsed()<3){
                        return false;
                    }
                },
                cardRespondable:function (card,player){
                    var sc=_status.currentPhase;
                    if(sc&&sc!=player&&sc.isPhaseUsing()&&sc.hasSkill('boss_sipu')&&!sc.hasSkill('boss_sipu_switch')&&sc.countUsed()<3){
                        return false;
                    }
                },
                cardSavable:function (card,player){
                    var sc=_status.currentPhase;
                    if(sc&&sc!=player&&sc.isPhaseUsing()&&sc.hasSkill('boss_sipu')&&!sc.hasSkill('boss_sipu_switch')&&sc.countUsed()<3){
                        return false;
                    }
                },
            },
        },
        /*----分界线----*/
        boss_zirun:{
            trigger:{player:'phaseZhunbeiBegin'},
            forced:true,
            logTarget:function(){
                return game.filterPlayer();
            },
            content:function(){
                var list=game.filterPlayer().sortBySeat();
                game.asyncDraw(list,function(current){
                    if(current.countCards('e')) return 2;
                    return 1;
                });
            }
        },
        boss_juehong:{
            trigger:{player:'phaseZhunbeiBegin'},
            forced:true,
            logTarget:function(event,player){
                return player.getEnemies();
            },
            content:function(){
                'step 0'
                event.list=player.getEnemies().sortBySeat();
                'step 1'
                if(event.list.length){
                    var target=event.list.shift();
                    if(target.countCards('he')){
                        var es=target.getCards('e');
                        if(es.length){
                            target.discard(es);
                        }
                        else{
                            player.discardPlayerCard(target,'h',true);
                        }
                    }
                    event.redo();
                }
            }
        },
        boss_zaoyi:{
            trigger:{global:'dieAfter'},
            forced:true,
            filter:function(event,player){
                if(lib.config.mode!='boss') return false;
                var list=['boss_shuishenxuanming','boss_shuishengonggong'];
                if(list.contains(event.player.name)){
                    return !game.hasPlayer(function(current){
                        return list.contains(current.name);
                    });
                }
                return false;
            },
            content:function(){
                player.draw(4);
                player.addSkill('boss_zaoyi_hp');
            },
            subSkill:{
                hp:{
                    trigger:{player:'phaseZhunbeiBegin'},
                    forced:true,
                    mark:true,
                    intro:{
                        content:'每个回合开始时使体力值最少的敌方角色失去所有体力'
                    },
                    content:function(){
                        var list=player.getEnemies();
                        var min=list[0].hp;
                        for(var i=0;i<list.length;i++){
                            if(list[i].hp<min){
                                min=list[i].hp;
                            }
                        }
                        for(var i=0;i<list.length;i++){
                            if(list[i].hp>min){
                                list.splice(i--,1);
                            }
                        }
                        player.line(list,'green');
                        list.sortBySeat();
                        for(var i=0;i<list.length;i++){
                            list[i].loseHp(min);
                        }
                    }
                }
            },
            mod:{
                targetEnabled:function(card,player,target,now){
                    if(target.isEnemyOf(player)){
                        var type=get.type(card,'trick');
                        if(type=='trick'){
                            if(game.hasPlayer(function(current){
                                return current.name=='boss_shuishenxuanming';
                            })){
                                return false;
                            }
                        }
                        if(type=='basic'){
                            if(game.hasPlayer(function(current){
                                return current.name=='boss_shuishengonggong';
                            })){
                                return false;
                            }
                        }
                    }
                }
            }
        },
        boss_lingqu:{
            init:function(player){
                player.storage.boss_lingqu=0;
            },
            trigger:{player:'damageEnd'},
            forced:true,
            content:function(){
                player.draw();
                player.storage.boss_lingqu++;
                player.markSkill('boss_lingqu');
            },
            intro:{
                content:'手牌上限+#'
            },
            mod:{
                maxHandcard:function(player,num){
                    return num+player.storage.boss_lingqu;
                }
            },
            group:'boss_lingqu_cancel',
            subSkill:{
                cancel:{
                    trigger:{player:'damageBegin4'},
                    priority:-11,
                    forced:true,
                    filter:function(event){
                        return event.num>1;
                    },
                    content:function(){
                        trigger.num=0;
                    }
                }
            }
        },
        boss_baiyi:{
            group:['boss_baiyi_draw','boss_baiyi_thunder','boss_baiyi_discard'],
            subSkill:{
                discard:{
                    trigger:{global:'roundStart'},
                    forced:true,
                    filter:function(){
                        return game.roundNumber==5;
                    },
                    logTarget:function(event,player){
                        return player.getEnemies();
                    },
                    content:function(){
                        'step 0'
                        event.list=player.getEnemies();
                        'step 1'
                        if(event.list.length){
                            event.list.shift().chooseToDiscard('he',true,2);
                            event.redo();
                        }
                    }
                },
                draw:{
                    trigger:{global:'phaseDrawBegin'},
                    forced:true,
                    filter:function(event,player){
                        return game.roundNumber<3&&event.player.isEnemyOf(player);
                    },
                    content:function(){
                        trigger.num--
                    }
                },
                thunder:{
                    trigger:{player:'damageBegin4'},
                    filter:function(event){
                        return event.hasNature('thunder')&&game.roundNumber<7;
                    },
                    forced:true,
                    content:function(){
                        trigger.cancel();
                    },
                    ai:{
                        nothunder:true,
                        skillTagFilter:function(){
                            return game.roundNumber<7;
                        },
                        effect:{
                            target:function(card,player,target,current){
                                if(get.tag(card,'thunderDamage')&&game.roundNumber<7) return 0;
                            }
                        }
                    }
                }
            }
        },
        boss_qingzhu:{
            trigger:{player:'phaseDiscardBefore'},
            forced:true,
            content:function(){
                trigger.cancel();
            },
            mod:{
                cardEnabled:function(card,player){
                    if(card.name=='sha'&&_status.currentPhase==player&&
                        _status.event.getParent('phaseUse')&&!player.hasSkill('boss_jiding')){
                        return false;
                    }
                }
            }
        },
        boss_jiazu:{
            trigger:{player:'phaseZhunbeiBegin'},
            forced:true,
            getTargets:function(player){
                var targets=[];
                targets.add(player.getNext());
                targets.add(player.getPrevious());
                var enemies=player.getEnemies();
                for(var i=0;i<targets.length;i++){
                    if(!enemies.contains(targets[i])||
                        (!targets[i].getEquip(3)&&!targets[i].getEquip(4))){
                        targets.splice(i--,1);
                    }
                }
                return targets;
            },
            filter:function(event,player){
                return lib.skill.boss_jiazu.getTargets(player).length>0;
            },
            logTarget:function(event,player){
                return lib.skill.boss_jiazu.getTargets(player);
            },
            content:function(){
                'step 0'
                event.list=lib.skill.boss_jiazu.getTargets(player).sortBySeat();
                'step 1'
                if(event.list.length){
                    var target=event.list.shift();
                    var cards=target.getCards('e',function(card){
                        var subtype=get.subtype(card);
                        return subtype=='equip3'||subtype=='equip4';
                    });
                    if(cards.length){
                        target.discard(cards);
                    }
                    event.redo();
                }
            }
        },
        boss_jiding:{
            trigger:{global:'damageEnd'},
            forced:true,
            mark:true,
            intro:{
                content:'info'
            },
            filter:function(event,player){
                return event.player!=player&&event.player.isFriendOf(player)&&
                    event.source&&event.source.isIn()&&event.source.isEnemyOf(player);
            },
            logTarget:'source',
            content:function(){
                'step 0'
                player.useCard({name:'sha',nature:'thunder'},trigger.source);
                'step 1'
                player.removeSkill('boss_jiding');
            },
            group:'boss_jiding_recover',
            subSkill:{
                recover:{
                    trigger:{source:'damageEnd'},
                    silent:true,
                    filter:function(event,player){
                        return event.getParent(3).name=='boss_jiding';
                    },
                    content:function(){
                        for(var i=0;i<game.players.length;i++){
                            if(game.players[i].name=='boss_jinshenrushou'){
                                game.players[i].recover();
                                player.line(game.players[i],'green');
                            }
                        }
                    }
                }
            }
        },
        boss_xingqiu:{
            init:function(player){
                player.storage.boss_xingqiu=false;
            },
            trigger:{player:'phaseDrawBegin'},
            direct:true,
            locked:true,
            content:function(){
                'step 0'
                if(player.storage.boss_xingqiu){
                    player.logSkill('boss_xingqiu');
                    event.list=player.getEnemies().sortBySeat();
                }
                else{
                    event.finish();
                }
                player.storage.boss_xingqiu=!player.storage.boss_xingqiu;
                'step 1'
                if(event.list.length){
                    var target=event.list.shift();
                    if(!target.isLinked()){
                        target.link();
                        player.line(target,'green');
                    }
                    event.redo();
                }
                'step 2'
                game.delay();
                for(var i=0;i<game.players.length;i++){
                    if(game.players[i].name=='boss_mingxingzhu'){
                        game.players[i].addSkill('boss_jiding');
                    }
                }
            }
        },
        boss_kuangxiao:{
            mod:{
                targetInRange:function(card,player,target){
                    return true;
                },
                selectTarget:function(card,player,range){
                    if(card.name=='sha'){
                        range[1]=-1;
                        range[0]=-1;
                    }
                },
                playerEnabled:function(card,player,target){
                    if(card.name=='sha'&&target.isFriendOf(player)){
                        return false;
                    }
                }
            }
        },
        boss_yinzei_switch:{
            unique:true,
            charlotte:true,
            group:['boss_yinzei_switch_on','boss_yinzei_switch_off'],
            subSkill:{
                off:{
                    trigger:{global:'gameStart'},
                    content:function(){
                        player.disableSkill('boss_yinzei_awake','boss_yinzei');
                    },
                    silent:true
                },
                on:{
                    trigger:{player:'changeHp'},
                    filter:function(event,player){
                        return player.hp<=player.maxHp/2;
                    },
                    forced:true,
                    skillAnimation:true,
                    animationColor:'thunder',
                    content:function(){
                        player.enableSkill('boss_yinzei_awake');
                        player.removeSkill('boss_yinzei_switch');
                    }
                }
            }
        },
        boss_jicai_switch:{
            unique:true,
            charlotte:true,
            group:['boss_jicai_switch_on','boss_jicai_switch_off'],
            subSkill:{
                off:{
                    trigger:{global:'gameStart'},
                    content:function(){
                        player.disableSkill('boss_jicai_awake','boss_jicai');
                    },
                    silent:true
                },
                on:{
                    trigger:{player:'changeHp'},
                    filter:function(event,player){
                        return player.hp<=player.maxHp/2;
                    },
                    forced:true,
                    skillAnimation:true,
                    animationColor:'thunder',
                    content:function(){
                        player.enableSkill('boss_jicai_awake');
                        player.removeSkill('boss_jicai_switch');
                    }
                }
            }
        },
        boss_luanchang_switch:{
            unique:true,
            charlotte:true,
            group:['boss_luanchang_switch_on','boss_luanchang_switch_off'],
            subSkill:{
                off:{
                    trigger:{global:'gameStart'},
                    content:function(){
                        player.disableSkill('boss_luanchang_awake','boss_luanchang');
                    },
                    silent:true
                },
                on:{
                    trigger:{player:'changeHp'},
                    filter:function(event,player){
                        return player.hp<=player.maxHp/2;
                    },
                    forced:true,
                    skillAnimation:true,
                    animationColor:'thunder',
                    content:function(){
                        player.enableSkill('boss_luanchang_awake');
                        player.removeSkill('boss_luanchang_switch');
                    }
                }
            }
        },
        boss_yandu_switch:{
            unique:true,
            charlotte:true,
            group:['boss_yandu_switch_on','boss_yandu_switch_off'],
            subSkill:{
                off:{
                    trigger:{global:'gameStart'},
                    content:function(){
                        player.disableSkill('boss_yandu_awake','boss_yandu');
                    },
                    silent:true
                },
                on:{
                    trigger:{player:'changeHp'},
                    filter:function(event,player){
                        return player.hp<=player.maxHp/2;
                    },
                    forced:true,
                    skillAnimation:true,
                    animationColor:'thunder',
                    content:function(){
                        player.enableSkill('boss_yandu_awake');
                        player.removeSkill('boss_yandu_switch');
                    }
                }
            }
        },
        boss_shenwuzaishi:{
            trigger:{global:'dieAfter'},
            silent:true,
            filter:function(event,player){
                return player.side!=game.boss.side;
            },
            content:function(){
                if(player==trigger.source&&trigger.player.name=='boss_zhuyin'){
                    player.draw(3);
                    player.recover();
                }
                else if(trigger.player.side==player.side){
                    player.draw(player.group=='shen'?3:1);
                    player.recover();
                }
            }
        },
        boss_wuzang:{
            trigger:{player:'phaseDrawBegin'},
            forced:true,
            content:function(){
                trigger.num+=Math.max(5,Math.floor(player.hp/2))-2;
            },
            mod:{
                maxHandcard:function(player,num){
                    return num-player.hp;
                }
            }
        },
        boss_xiangde:{
            trigger:{player:'damageBegin3'},
            forced:true,
            filter:function(event,player){
                return event.source&&event.source.isIn()&&event.source!=player&&event.source.getEquip(1);
            },
            content:function(){
                trigger.num++;
            }
        },
        boss_yinzei:{
            trigger:{player:'damageEnd'},
            forced:true,
            logTarget:'source',
            filter:function(event,player){
                return event.source&&event.source.isIn()&&event.source!=player&&event.source.countCards('he')&&!player.countCards('h');
            },
            content:function(){
                trigger.source.randomDiscard();
            }
        },
        boss_zhue:{
            trigger:{global:'damageEnd'},
            forced:true,
            filter:function(event,player){
                return event.source&&event.source.isIn()&&event.source!=player;
            },
            logTarget:'source',
            content:function(){
                game.asyncDraw([player,trigger.source]);
            }
        },
        boss_yandu:{
            trigger:{global:'phaseJieshuBegin'},
            filter:function(event,player){
                return event.player!=player&&!event.player.getStat('damage')&&event.player.countCards('he');
            },
            logTarget:'player',
            forced:true,
            content:function(){
                player.gainPlayerCard(trigger.player,true);
            }
        },
        boss_futai:{
            global:'boss_futai2',
            trigger:{player:'phaseZhunbeiBegin'},
            logTarget:function(event,player){
                return game.filterPlayer(function(current){
                    return current.isDamaged();
                });
            },
            forced:true,
            content:function(){
                'step 0'
                var list=game.filterPlayer(function(current){
                    return current.isDamaged();
                }).sortBySeat();
                event.list=list;
                'step 1'
                if(event.list.length){
                    event.list.shift().recover();
                    event.redo();
                }
            }
        },
        boss_futai2:{
            mod:{
                cardSavable:function(card,player){
                    if(card.name=='tao'&&!_status.event.skill&&game.hasPlayer(function(current){
                        return current!=player&&current.hasSkill('boss_futai')&&_status.currentPhase!=current;
                    })){
                        return false;
                    }
                },
                cardEnabled:function(card,player){
                    if(card.name=='tao'&&!_status.event.skill&&game.hasPlayer(function(current){
                        return current!=player&&current.hasSkill('boss_futai')&&_status.currentPhase!=current;
                    })){
                        return false;
                    }
                },
            }
        },
        boss_luanchang:{
            group:['boss_luanchang_begin','boss_luanchang_end'],
            subSkill:{
                begin:{
                    trigger:{player:'phaseZhunbeiBegin'},
                    forced:true,
                    content:function(){
                        var list=game.filterPlayer(function(current){
                            return player.canUse('nanman',current);
                        }).sortBySeat();
                        if(list.length){
                            player.useCard({name:'nanman'},list);
                        }
                    }
                },
                end:{
                    trigger:{player:'phaseJieshuBegin'},
                    forced:true,
                    content:function(){
                        var list=game.filterPlayer(function(current){
                            return player.canUse('wanjian',current);
                        }).sortBySeat();
                        if(list.length){
                            player.useCard({name:'wanjian'},list);
                        }
                    }
                }
            }
        },
        boss_nitai:{
            group:['boss_nitai_in','boss_nitai_out'],
            subSkill:{
                in:{
                    trigger:{player:'damageBegin4'},
                    forced:true,
                    filter:function(event,player){
                        return _status.currentPhase==player;
                    },
                    content:function(){
                        trigger.cancel();
                    }
                },
                out:{
                    trigger:{player:'damageBegin1'},
                    forced:true,
                    filter:function(event,player){
                        return _status.currentPhase!=player&&event.hasNature('fire');
                    },
                    content:function(){
                        trigger.num++;
                    }
                }
            }
        },
        boss_minwan:{
            group:['boss_minwan_clear','boss_minwan_draw','boss_minwan_add'],
            subSkill:{
                clear:{
                    trigger:{player:'phaseAfter'},
                    silent:true,
                    content:function(){
                        delete player.storage.boss_minwan;
                    }
                },
                draw:{
                    trigger:{player:'useCard'},
                    forced:true,
                    filter:function(event,player){
                        return _status.currentPhase==player&&Array.isArray(player.storage.boss_minwan);
                    },
                    content:function(){
                        player.draw();
                    }
                },
                add:{
                    trigger:{source:'damageAfter'},
                    filter:function(event,player){
                        return _status.currentPhase==player;
                    },
                    forced:true,
                    content:function(){
                        if(!player.storage.boss_minwan){
                            player.storage.boss_minwan=[player];
                        }
                        player.storage.boss_minwan.add(trigger.player);
                    }
                }
            },
            mod:{
                playerEnabled:function(card,player,target){
                    if(_status.currentPhase==player&&Array.isArray(player.storage.boss_minwan)&&!player.storage.boss_minwan.contains(target)){
                        return false;
                    }
                }
            }
        },
        boss_tanyu:{
            trigger:{player:'phaseDiscardBefore'},
            forced:true,
            content:function(){
                trigger.cancel();
            },
            group:'boss_tanyu_hp',
            subSkill:{
                hp:{
                    trigger:{player:'phaseJieshuBegin'},
                    forced:true,
                    popup:false,
                    filter:function(event,player){
                        return player.isMaxHandcard();
                    },
                    content:function(){
                        player.loseHp();
                    }
                }
            }
        },
        boss_cangmu:{
            trigger:{player:'phaseDrawBegin'},
            forced:true,
            content:function(){
                trigger.num+=game.countPlayer()-2;
            }
        },
        boss_jicai:{
            trigger:{global:'recoverAfter'},
            forced:true,
            logTarget:'player',
            content:function(){
                if(trigger.player==player){
                    player.draw(2);
                }
                else{
                    game.asyncDraw([player,trigger.player]);
                }
            }
        },
        boss_xiongshou:{
            group:['boss_xiongshou_turn','boss_xiongshou_damage'],
            subSkill:{
                damage:{
                    trigger:{source:'damageBegin1'},
                    forced:true,
                    filter:function(event,player){
                        return event.notLink()&&event.card&&event.card.name=='sha'&&event.player.hp<player.hp;
                    },
                    content:function(){
                        trigger.num++;
                    }
                },
                turn:{
                    trigger:{player:'turnOverBefore'},
                    priority:20,
                    forced:true,
                    filter:function(event,player){
                        return !player.isTurnedOver();
                    },
                    content:function(){
                        trigger.cancel();
                        game.log(player,'取消了翻面');
                    },
                }
            },
            mod:{
                globalFrom:function(from,to,distance){
                    return distance-1;
                }
            },
            ai:{
                noturn:true,
            }
        },
        boss_chiyan:{
            trigger:{global:'gameStart'},
            forced:true,
            popup:false,
            unique:true,
            fixed:true,
            content:function(){
                player.smoothAvatar();
                player.init('boss_zhuque');
                _status.noswap=true;
                game.addVideo('reinit2',player,player.name);
            }
        },
        boss_chiyan2:{
            mode:['boss'],
            global:'boss_chiyan2x',
            trigger:{player:'dieBegin'},
            silent:true,
            unique:true,
            fixed:true,
            filter:function(event,player){
                return player==game.boss;
            },
            content:function(){
                player.hide();
                game.addVideo('hidePlayer',player);
            }
        },
        boss_chiyan2x:{
            trigger:{global:'dieAfter'},
            forced:true,
            priority:-10,
            fixed:true,
            globalFixed:true,
            unique:true,
            filter:function(event){
                if(lib.config.mode!='boss') return false;
                return event.player==game.boss&&event.player.hasSkill('boss_chiyan2');
            },
            content:function(){
                'step 0'
                game.delay();
                'step 1'
                if(game.me!=game.boss){
                    game.boss.changeSeat(6);
                }
                else{
                    game.boss.nextSeat.changeSeat(3);
                    game.boss.previousSeat.changeSeat(5);
                }
                game.changeBoss('boss_huoshenzhurong');
                for(var i=0;i<game.players.length;i++){
                    game.players[i].hp=game.players[i].maxHp;
                    game.players[i].update();
                }
                game.delay(0.5);
                'step 2'
                game.addBossFellow(game.me==game.boss?1:5,'boss_yanling');
                game.addBossFellow(7,'boss_yanling');
                'step 3'
                var dnum=0;
                var dead=game.dead.slice(0);
                for(var i=0;i<dead.length;i++){
                    if(!dead[i].side&&dead[i].maxHp>0&&dead[i].parentNode==player.parentNode){
                        dead[i].revive(dead[i].maxHp);
                        dnum++;
                    }
                }
                for(var i=0;i<game.players.length;i++){
                    if(game.players[i].side) continue;
                    game.players[i].removeEquipTrigger();
                    var hej=game.players[i].getCards('hej');
                    for(var j=0;j<hej.length;j++){
                        hej[j].discard(false);
                    }
                    game.players[i].hp=game.players[i].maxHp;
                    game.players[i].hujia=0;
                    game.players[i].classList.remove('turnedover');
                    game.players[i].removeLink();
                    game.players[i].directgain(get.cards(4-dnum));
                }
                'step 4'
                while(_status.event.name!='phaseLoop'){
                    _status.event=_status.event.parent;
                }
                game.resetSkills();
                _status.paused=false;
                _status.event.player=game.boss;
                _status.event.step=0;
                _status.roundStart=game.boss;
                game.phaseNumber=0;
                game.roundNumber=0;
                if(game.bossinfo){
                    game.bossinfo.loopType=1;
                }
            }
        },
        boss_chiyan3:{
            mode:['boss'],
            global:'boss_chiyan3x',
            trigger:{player:'dieBegin'},
            silent:true,
            fixed:true,
            unique:true,
            filter:function(event,player){
                return player==game.boss;
            },
            content:function(){
                player.hide();
                player.nextSeat.hide();
                player.previousSeat.hide();
                game.addVideo('hidePlayer',player);
                game.addVideo('hidePlayer',player.nextSeat);
                game.addVideo('hidePlayer',player.previousSeat);
            }
        },
        boss_chiyan3x:{
            trigger:{global:'dieAfter'},
            forced:true,
            priority:-10,
            globalFixed:true,
            unique:true,
            fixed:true,
            filter:function(event){
                if(lib.config.mode!='boss') return false;
                return event.player==game.boss&&event.player.hasSkill('boss_chiyan3');
            },
            content:function(){
                'step 0'
                game.delay();
                'step 1'
                game.changeBoss('boss_yandi');
                game.delay(0.5);
                'step 2'
                game.changeBoss('boss_huoshenzhurong',game.boss.previousSeat);
                game.changeBoss('boss_yanling',game.boss.nextSeat);
                'step 3'
                var dnum=0;
                var dead=game.dead.slice(0);
                for(var i=0;i<dead.length;i++){
                    if(!dead[i].side&&dead[i].maxHp>0&&dead[i].parentNode==player.parentNode){
                        dead[i].revive(dead[i].maxHp);
                        dnum++;
                    }
                }
                for(var i=0;i<game.players.length;i++){
                    if(game.players[i].side) continue;
                    game.players[i].removeEquipTrigger();
                    var hej=game.players[i].getCards('hej');
                    for(var j=0;j<hej.length;j++){
                        hej[j].discard(false);
                    }
                    game.players[i].hp=game.players[i].maxHp;
                    game.players[i].hujia=0;
                    game.players[i].classList.remove('turnedover');
                    game.players[i].removeLink();
                    game.players[i].directgain(get.cards(4-dnum));
                }
                'step 4'
                while(_status.event.name!='phaseLoop'){
                    _status.event=_status.event.parent;
                }
                game.resetSkills();
                _status.paused=false;
                _status.event.player=game.boss;
                _status.event.step=0;
                _status.roundStart=game.boss;
                game.phaseNumber=0;
                game.roundNumber=0;
            }
        },
        boss_qingmu:{
            trigger:{global:'gameStart'},
            forced:true,
            popup:false,
            fixed:true,
            unique:true,
            content:function(){
                player.smoothAvatar();
                player.init('boss_qinglong');
                _status.noswap=true;
                game.addVideo('reinit2',player,player.name);
            }
        },
        boss_qingmu2:{
            mode:['boss'],
            global:'boss_qingmu2x',
            trigger:{player:'dieBegin'},
            silent:true,
            unique:true,
            fixed:true,
            filter:function(event,player){
                return player==game.boss;
            },
            content:function(){
                player.hide();
                game.addVideo('hidePlayer',player);
            }
        },
        boss_qingmu2x:{
            trigger:{global:'dieAfter'},
            forced:true,
            priority:-10,
            globalFixed:true,
            unique:true,
            fixed:true,
            filter:function(event){
                if(lib.config.mode!='boss') return false;
                return event.player==game.boss&&event.player.hasSkill('boss_qingmu2');
            },
            content:function(){
                'step 0'
                game.delay();
                'step 1'
                if(game.me!=game.boss){
                    game.boss.changeSeat(6);
                }
                else{
                    game.boss.nextSeat.changeSeat(3);
                    game.boss.previousSeat.changeSeat(5);
                }
                game.changeBoss('boss_mushengoumang');
                for(var i=0;i<game.players.length;i++){
                    game.players[i].hp=game.players[i].maxHp;
                    game.players[i].update();
                }
                game.delay(0.5);
                'step 2'
                game.addBossFellow(game.me==game.boss?1:5,'boss_shujing');
                game.addBossFellow(7,'boss_shujing');
                'step 3'
                var dnum=0;
                var dead=game.dead.slice(0);
                for(var i=0;i<dead.length;i++){
                    if(!dead[i].side&&dead[i].maxHp>0&&dead[i].parentNode==player.parentNode){
                        dead[i].revive(dead[i].maxHp);
                        dnum++;
                    }
                }
                for(var i=0;i<game.players.length;i++){
                    if(game.players[i].side) continue;
                    game.players[i].removeEquipTrigger();
                    var hej=game.players[i].getCards('hej');
                    for(var j=0;j<hej.length;j++){
                        hej[j].discard(false);
                    }
                    game.players[i].hp=game.players[i].maxHp;
                    game.players[i].hujia=0;
                    game.players[i].classList.remove('turnedover');
                    game.players[i].removeLink();
                    game.players[i].directgain(get.cards(4-dnum));
                }
                'step 4'
                while(_status.event.name!='phaseLoop'){
                    _status.event=_status.event.parent;
                }
                game.resetSkills();
                _status.paused=false;
                _status.event.player=game.boss;
                _status.event.step=0;
                _status.roundStart=game.boss;
                game.phaseNumber=0;
                game.roundNumber=0;
                if(game.bossinfo){
                    game.bossinfo.loopType=1;
                }
            }
        },
        boss_qingmu3:{
            mode:['boss'],
            global:'boss_qingmu3x',
            trigger:{player:'dieBegin'},
            silent:true,
            fixed:true,
            unique:true,
            filter:function(event,player){
                return player==game.boss;
            },
            content:function(){
                player.hide();
                player.nextSeat.hide();
                player.previousSeat.hide();
                game.addVideo('hidePlayer',player);
                game.addVideo('hidePlayer',player.nextSeat);
                game.addVideo('hidePlayer',player.previousSeat);
            }
        },
        boss_qingmu3x:{
            trigger:{global:'dieAfter'},
            forced:true,
            priority:-10,
            fixed:true,
            globalFixed:true,
            unique:true,
            filter:function(event){
                if(lib.config.mode!='boss') return false;
                return event.player==game.boss&&event.player.hasSkill('boss_qingmu3');
            },
            content:function(){
                'step 0'
                game.delay();
                'step 1'
                game.changeBoss('boss_taihao');
                game.delay(0.5);
                'step 2'
                game.changeBoss('boss_mushengoumang',game.boss.previousSeat);
                game.changeBoss('boss_shujing',game.boss.nextSeat);
                'step 3'
                var dnum=0;
                var dead=game.dead.slice(0);
                for(var i=0;i<dead.length;i++){
                    if(!dead[i].side&&dead[i].maxHp>0&&dead[i].parentNode==player.parentNode){
                        dead[i].revive(dead[i].maxHp);
                        dnum++;
                    }
                }
                for(var i=0;i<game.players.length;i++){
                    if(game.players[i].side) continue;
                    game.players[i].removeEquipTrigger();
                    var hej=game.players[i].getCards('hej');
                    for(var j=0;j<hej.length;j++){
                        hej[j].discard(false);
                    }
                    game.players[i].hp=game.players[i].maxHp;
                    game.players[i].hujia=0;
                    game.players[i].classList.remove('turnedover');
                    game.players[i].removeLink();
                    game.players[i].directgain(get.cards(4-dnum));
                }
                'step 4'
                while(_status.event.name!='phaseLoop'){
                    _status.event=_status.event.parent;
                }
                game.resetSkills();
                _status.paused=false;
                _status.event.player=game.boss;
                _status.event.step=0;
                _status.roundStart=game.boss;
                game.phaseNumber=0;
                game.roundNumber=0;
            }
        },
        boss_xuanlin:{
            trigger:{global:'gameStart'},
            forced:true,
            popup:false,
            fixed:true,
            unique:true,
            content:function(){
                player.smoothAvatar();
                player.init('boss_xuanwu');
                _status.noswap=true;
                game.addVideo('reinit2',player,player.name);
            }
        },
        boss_xuanlin2:{
            mode:['boss'],
            global:'boss_xuanlin2x',
            trigger:{player:'dieBegin'},
            silent:true,
            unique:true,
            fixed:true,
            filter:function(event,player){
                return player==game.boss;
            },
            content:function(){
                player.hide();
                game.addVideo('hidePlayer',player);
            }
        },
        boss_xuanlin2x:{
            trigger:{global:'dieAfter'},
            forced:true,
            priority:-10,
            globalFixed:true,
            unique:true,
            fixed:true,
            filter:function(event){
                if(lib.config.mode!='boss') return false;
                return event.player==game.boss&&event.player.hasSkill('boss_xuanlin2');
            },
            content:function(){
                'step 0'
                game.delay();
                'step 1'
                if(game.me!=game.boss){
                    game.boss.changeSeat(6);
                }
                else{
                    game.boss.nextSeat.changeSeat(3);
                    game.boss.previousSeat.changeSeat(5);
                }
                game.changeBoss('boss_shuishengonggong');
                for(var i=0;i<game.players.length;i++){
                    game.players[i].hp=game.players[i].maxHp;
                    game.players[i].update();
                }
                game.delay(0.5);
                'step 2'
                game.addBossFellow(game.me==game.boss?1:7,'boss_shuishenxuanming');
                'step 3'
                var dnum=0;
                var dead=game.dead.slice(0);
                for(var i=0;i<dead.length;i++){
                    if(!dead[i].side&&dead[i].maxHp>0&&dead[i].parentNode==player.parentNode){
                        dead[i].revive(dead[i].maxHp);
                        dnum++;
                    }
                }
                for(var i=0;i<game.players.length;i++){
                    if(game.players[i].side) continue;
                    game.players[i].removeEquipTrigger();
                    var hej=game.players[i].getCards('hej');
                    for(var j=0;j<hej.length;j++){
                        hej[j].discard(false);
                    }
                    game.players[i].hp=game.players[i].maxHp;
                    game.players[i].hujia=0;
                    game.players[i].classList.remove('turnedover');
                    game.players[i].removeLink();
                    game.players[i].directgain(get.cards(4-dnum));
                }
                'step 4'
                while(_status.event.name!='phaseLoop'){
                    _status.event=_status.event.parent;
                }
                game.resetSkills();
                _status.paused=false;
                _status.event.player=game.boss;
                _status.event.step=0;
                _status.roundStart=game.boss;
                game.phaseNumber=0;
                game.roundNumber=0;
                if(game.bossinfo){
                    game.bossinfo.loopType=1;
                }
            }
        },
        boss_xuanlin3:{
            mode:['boss'],
            global:'boss_xuanlin3x',
            trigger:{player:'dieBegin'},
            silent:true,
            fixed:true,
            unique:true,
            filter:function(event,player){
                if(game.boss&&game.boss.name=='boss_zhuanxu') return false;
                return true;
            },
            content:function(){
                player.hide();
                game.addVideo('hidePlayer',player);
                if(player.nextSeat.side==player.side){
                    player.nextSeat.hide();
                    game.addVideo('hidePlayer',player.nextSeat);
                }
                if(player.previousSeat.side==player.side){
                    player.previousSeat.hide();
                    player.previousSeat.node.handcards1.hide();
                    player.previousSeat.node.handcards2.hide();
                    game.addVideo('hidePlayer',player.previousSeat);
                    game.addVideo('deleteHandcards',player.previousSeat);
                }
            }
        },
        boss_xuanlin3x:{
            trigger:{global:'dieAfter'},
            forced:true,
            priority:-10,
            fixed:true,
            globalFixed:true,
            unique:true,
            filter:function(event){
                if(lib.config.mode!='boss') return false;
                if(game.boss&&game.boss.name=='boss_zhuanxu') return false;
                return event.player.hasSkill('boss_xuanlin3');
            },
            content:function(){
                'step 0'
                game.delay();
                'step 1'
                game.changeBoss('boss_zhuanxu');
                game.delay(0.5);
                'step 2'
                game.addBossFellow(game.me==game.boss?7:5,'boss_shuishengonggong');
                game.changeBoss('boss_shuishenxuanming',game.boss.nextSeat);
                game.boss.previousSeat.maxHp--;
                game.boss.previousSeat.update();
                game.boss.nextSeat.maxHp--;
                game.boss.nextSeat.update();
                'step 3'
                var dnum=0;
                var dead=game.dead.slice(0);
                for(var i=0;i<dead.length;i++){
                    if(!dead[i].side&&dead[i].maxHp>0&&dead[i].parentNode==player.parentNode){
                        dead[i].revive(dead[i].maxHp);
                        dnum++;
                    }
                }
                for(var i=0;i<game.players.length;i++){
                    if(game.players[i].side) continue;
                    game.players[i].removeEquipTrigger();
                    var hej=game.players[i].getCards('hej');
                    for(var j=0;j<hej.length;j++){
                        hej[j].discard(false);
                    }
                    game.players[i].hp=game.players[i].maxHp;
                    game.players[i].hujia=0;
                    game.players[i].classList.remove('turnedover');
                    game.players[i].removeLink();
                    game.players[i].directgain(get.cards(4-dnum));
                }
                'step 4'
                while(_status.event.name!='phaseLoop'){
                    _status.event=_status.event.parent;
                }
                game.resetSkills();
                _status.paused=false;
                _status.event.player=game.boss;
                _status.event.step=0;
                _status.roundStart=game.boss;
                game.phaseNumber=0;
                game.roundNumber=0;
            }
        },
        boss_baimang:{
            trigger:{global:'gameStart'},
            forced:true,
            popup:false,
            fixed:true,
            unique:true,
            content:function(){
                player.smoothAvatar();
                player.init('boss_baihu');
                _status.noswap=true;
                game.addVideo('reinit2',player,player.name);
            }
        },
        boss_baimang2:{
            mode:['boss'],
            global:'boss_baimang2x',
            trigger:{player:'dieBegin'},
            silent:true,
            unique:true,
            fixed:true,
            filter:function(event,player){
                return player==game.boss;
            },
            content:function(){
                player.hide();
                game.addVideo('hidePlayer',player);
            }
        },
        boss_baimang2x:{
            trigger:{global:'dieAfter'},
            forced:true,
            priority:-10,
            globalFixed:true,
            unique:true,
            fixed:true,
            filter:function(event){
                if(lib.config.mode!='boss') return false;
                return event.player==game.boss&&event.player.hasSkill('boss_baimang2');
            },
            content:function(){
                'step 0'
                game.delay();
                'step 1'
                if(game.me!=game.boss){
                    game.boss.changeSeat(6);
                }
                else{
                    game.boss.nextSeat.changeSeat(3);
                    game.boss.previousSeat.changeSeat(5);
                }
                game.changeBoss('boss_jinshenrushou');
                for(var i=0;i<game.players.length;i++){
                    game.players[i].hp=game.players[i].maxHp;
                    game.players[i].update();
                }
                game.delay(0.5);
                'step 2'
                game.addBossFellow(game.me==game.boss?1:5,'boss_mingxingzhu');
                game.addBossFellow(7,'boss_mingxingzhu');
                'step 3'
                var dnum=0;
                var dead=game.dead.slice(0);
                for(var i=0;i<dead.length;i++){
                    if(!dead[i].side&&dead[i].maxHp>0&&dead[i].parentNode==player.parentNode){
                        dead[i].revive(dead[i].maxHp);
                        dnum++;
                    }
                }
                for(var i=0;i<game.players.length;i++){
                    if(game.players[i].side) continue;
                    game.players[i].removeEquipTrigger();
                    var hej=game.players[i].getCards('hej');
                    for(var j=0;j<hej.length;j++){
                        hej[j].discard(false);
                    }
                    game.players[i].hp=game.players[i].maxHp;
                    game.players[i].hujia=0;
                    game.players[i].classList.remove('turnedover');
                    game.players[i].removeLink();
                    game.players[i].directgain(get.cards(4-dnum));
                }
                'step 4'
                while(_status.event.name!='phaseLoop'){
                    _status.event=_status.event.parent;
                }
                game.resetSkills();
                _status.paused=false;
                _status.event.player=game.boss;
                _status.event.step=0;
                _status.roundStart=game.boss;
                game.phaseNumber=0;
                game.roundNumber=0;
                if(game.bossinfo){
                    game.bossinfo.loopType=1;
                }
            }
        },
        boss_baimang3:{
            mode:['boss'],
            global:'boss_baimang3x',
            trigger:{player:'dieBegin'},
            silent:true,
            fixed:true,
            unique:true,
            filter:function(event,player){
                return player==game.boss;
            },
            content:function(){
                player.hide();
                player.nextSeat.hide();
                player.previousSeat.hide();
                game.addVideo('hidePlayer',player);
                game.addVideo('hidePlayer',player.nextSeat);
                game.addVideo('hidePlayer',player.previousSeat);
            }
        },
        boss_baimang3x:{
            trigger:{global:'dieAfter'},
            forced:true,
            priority:-10,
            fixed:true,
            globalFixed:true,
            unique:true,
            filter:function(event){
                if(lib.config.mode!='boss') return false;
                return event.player==game.boss&&event.player.hasSkill('boss_baimang3');
            },
            content:function(){
                'step 0'
                game.delay();
                'step 1'
                game.changeBoss('boss_shaohao');
                game.delay(0.5);
                'step 2'
                game.changeBoss('boss_jinshenrushou',game.boss.previousSeat);
                game.changeBoss('boss_mingxingzhu',game.boss.nextSeat);
                game.boss.previousSeat.maxHp--;
                game.boss.previousSeat.update();
                if(game.me!=game.boss){
                    game.addBossFellow(4,'boss_mingxingzhu');
                }
                else{
                    // ui.arena.dataset.number='7';
                    // game.addVideo('arenaNumber',null,7);
                    // game.boss.previousSeat.changeSeat(6);
                    // game.boss.nextSeat.nextSeat.changeSeat(2);
                    // game.boss.nextSeat.nextSeat.nextSeat.changeSeat(3);
                    // game.boss.nextSeat.nextSeat.nextSeat.nextSeat.changeSeat(4);
                    game.addBossFellow(6,'boss_mingxingzhu');
                }
                'step 3'
                var dnum=0;
                var dead=game.dead.slice(0);
                for(var i=0;i<dead.length;i++){
                    if(!dead[i].side&&dead[i].maxHp>0&&dead[i].parentNode==player.parentNode){
                        dead[i].revive(dead[i].maxHp);
                        dnum++;
                    }
                }
                for(var i=0;i<game.players.length;i++){
                    if(game.players[i].side) continue;
                    game.players[i].removeEquipTrigger();
                    var hej=game.players[i].getCards('hej');
                    for(var j=0;j<hej.length;j++){
                        hej[j].discard(false);
                    }
                    game.players[i].hp=game.players[i].maxHp;
                    game.players[i].hujia=0;
                    game.players[i].classList.remove('turnedover');
                    game.players[i].removeLink();
                    game.players[i].directgain(get.cards(4-dnum));
                }
                'step 4'
                while(_status.event.name!='phaseLoop'){
                    _status.event=_status.event.parent;
                }
                game.resetSkills();
                _status.paused=false;
                _status.event.player=game.boss;
                _status.event.step=0;
                _status.roundStart=game.boss;
                game.phaseNumber=0;
                game.roundNumber=0;
            }
        },
        boss_shenyi:{
            unique:true,
            mod:{
                judge:function(player,result){
                    if(_status.event.type=='phase'){
                        if(result.bool==false){
                            result.bool=null;
                        }
                        else{
                            result.bool=false;
                        }
                    }
                }
            },
            trigger:{player:'turnOverBefore'},
            priority:20,
            forced:true,
            filter:function(event,player){
                return !player.isTurnedOver();
            },
            content:function(){
                trigger.cancel();
                game.log(player,'取消了翻面');
            },
            ai:{
                noturn:true,
                effect:{
                    target:function(card,player,target){
                        if(get.type(card)=='delay') return 0.5;
                    }
                }
            }
        },
        honghuangzhili:{
            init:function(player){
                player.disableSkill('honghuangzhili','boss_shenyi');
            },
            mark:true,
            nopop:true,
            intro:{
                content:'【神裔】无效直到下家的回合开始'
            },
            marktext:'荒',
            onremove:function(player){
                player.enableSkill('honghuangzhili','boss_shenyi');
            },
            trigger:{global:'phaseZhunbeiBegin'},
            forced:true,
            popup:false,
            filter:function(event,player){
                return event.player==player.next;
            },
            content:function(){
                player.removeSkill('honghuangzhili');
            }
        },
        boss_shenen:{
            mode:['boss'],
            unique:true,
            global:'boss_shenen2'
        },
        boss_shenen2:{
            mod:{
                targetInRange:function(card,player){
                    if(player.side) return true;
                },
                maxHandcard:function(player,num){
                    if(!player.side) return num+1;
                }
            },
            trigger:{player:'phaseDrawBegin'},
            forced:true,
            filter:function(event,player){
                return !player.side;
            },
            content:function(){
                trigger.num++;
            }
        },
        boss_fentian:{
            trigger:{source:'damageBegin1'},
            forced:true,
            filter:function(event){
                return !event.hasNature('fire');
            },
            content:function(){
                trigger.hasNature('fire');
            },
            mod:{
                cardUsable:function(card){
                    if(get.color(card)=='red') return Infinity;
                },
                targetInRange:function(card){
                    if(get.color(card)=='red') return true;
                },
                wuxieRespondable:function(card,player,target){
                    if(get.color(card)=='red'&&player!=target) return false;
                }
            },
            group:'boss_fentian2',
        },
        boss_fentian2:{
            trigger:{player:'useCard'},
            forced:true,
            filter:function(event,player){
                return get.color(event.card)=='red';
            },
            content:function(){
                trigger.directHit.addArray(game.players);
                trigger.directHit.remove(player);
            },
        },
        boss_xingxia:{
            enable:'phaseUse',
            mode:['boss'],
            filter:function(event,player){
                if(!game.hasPlayer(function(current){
                    return current.name=='boss_yanling';
                })){
                    return false;
                }
                return !player.storage.boss_xingxia||game.roundNumber-player.storage.boss_xingxia>=2;
            },
            unique:true,
            filterTarget:function(card,player,target){
                return target.name=='boss_yanling';
            },
            selectTarget:-1,
            line:'fire',
            content:function(){
                target.damage(2,'fire');
            },
            contentAfter:function(){
                'step 0'
                player.storage.boss_xingxia=game.roundNumber;
                player.chooseTarget(function(card,player,target){
                    return target.side!=player.side;
                }).ai=function(target){
                    return get.damageEffect(target,player,player,'fire');
                }
                'step 1'
                if(result.bool){
                    event.target=result.targets[0];
                    player.line(event.target,'fire');
                    event.target.chooseToDiscard('he',{color:'red'},'弃置一张红色牌或受到1点火焰伤害').ai=function(card){
                        var player=_status.event.player;
                        var source=_status.event.parent.player;
                        if(get.damageEffect(player,source,player,'fire')>=0) return 0;
                        return 8-get.value(card);
                    }
                }
                else{
                    event.finish();
                }
                'step 2'
                if(!result.bool){
                    event.target.damage('fire');
                }
            },
            ai:{
                order:6,
                result:{
                    target:function(player,target){
                        if(target.isLinked()&&player.isLinked()&&get.damageEffect(player,player,player,'fire')<0) return -1;
                        return 1;
                    }
                }
            }
        },
        boss_huihuo:{
            global:'boss_huihuo2',
            unique:true,
            mod:{
                cardUsable:function(card,player,num){
                    if(card.name=='sha') return num+1;
                }
            },
            ai:{
                revertsave:true,
                effect:{
                    target:function(card,player,target){
                        if(!game.boss) return;
                        if(card.name=='tiesuo'){
                            if(_status.event.player==game.boss) return 'zeroplayertarget';
                            return 0.5;
                        }
                        if(get.tag(card,'damage')||get.tag(card,'recover')){
                            if(game.boss.isLinked()&&get.damageEffect(game.boss,player,game.boss,'fire')<0){
                                if(game.hasPlayer(function(current){
                                    return current.isEnemyOf(game.boss)&&current.isLinked();
                                })){
                                    return;
                                }
                                if(get.tag(card,'natureDamage')&&target.isLinked()){
                                    return;
                                }
                            }
                            if(target.isDying()){
                                if(player.isEnemyOf(target)&&player.hp>=-1) return [0,0,0,1];
                                return 'zeroplayertarget';
                            }
                            return -0.5;
                        }
                    }
                }
            }
        },
        boss_huihuo2:{
            trigger:{global:'dieAfter'},
            forced:true,
            globalFixed:true,
            unique:true,
            filter:function(event,player){
                return event.player.hasSkill('boss_huihuo')&&event.player.isDead()&&player.isEnemyOf(event.player);
            },
            content:function(){
                trigger.player.line(player,'fire');
                player.damage('nosource','fire',3).animate=false;
                player.$damage(trigger.player);
                player.$damagepop(-3,'fire');
                if(lib.config.animation&&!lib.config.low_performance){
                    player.$fire();
                }
                if(!event.parent.parent.boss_huihuo_logv){
                    event.parent.parent.boss_huihuo_logv=true;
                    game.logv(trigger.player,'boss_huihuo',game.filterPlayer(),event.parent.parent);
                }
            }
        },
        boss_furan:{
            unique:true,
            global:'boss_furan2'
        },
        boss_furan2:{
            enable:'chooseToUse',
            filter:function(event,player){
                return event.type=='dying'&&event.dying.hasSkill('boss_furan')&&player.isEnemyOf(event.dying);
            },
            filterCard:function(card){
                return get.color(card)=='red';
            },
            position:'he',
            viewAs:{name:'tao'},
            prompt:'将一张红色牌当桃使用',
            check:function(card){return 8-get.value(card)},
            ai:{
                order:5,
                skillTagFilter:function(player){
                    var event=_status.event;
                    if(event.dying&&event.dying.hasSkill('boss_furan')&&player.isEnemyOf(event.dying)){
                        return player.countCards('he',{color:'red'})>0&&_status.currentPhase!=player;
                    }
                    else{
                        return false;
                    }
                },
                save:true,
            }
        },
        boss_chiyi:{
            trigger:{player:'phaseZhunbeiBegin'},
            forced:true,
            unique:true,
            filter:function(event,player){
                return [3,5,7].contains(game.roundNumber);
            },
            content:function(){
                'step 0'
                if(game.roundNumber==3){
                    var enemies=game.filterPlayer(function(current){
                        return current.isEnemyOf(player);
                    });
                    player.line(enemies,'green');
                    for(var i=0;i<enemies.length;i++){
                        enemies[i].addSkill('boss_chiyi2');
                    }
                    event.finish();
                }
                else if(game.roundNumber==5){
                    event.targets=game.filterPlayer().sortBySeat();
                    event.num=1;
                }
                else{
                    event.targets=game.filterPlayer(function(current){
                        return current.name=='boss_yanling';
                    }).sortBySeat();
                    event.num=5;
                }
                'step 1'
                if(event.targets.length){
                    var target=event.targets.shift();
                    player.line(target,'fire');
                    target.damage(event.num,'fire');
                    event.redo();
                }
            }
        },
        boss_chiyi2:{
            mark:true,
            marktext:'赤',
            intro:{
                content:'受到的伤害+1'
            },
            trigger:{player:'damageBegin3'},
            forced:true,
            popup:false,
            content:function(){
                trigger.num++;
            }
        },
        boss_buchun:{
            mode:['boss'],
            unique:true,
            group:['boss_buchun_recover','boss_buchun_revive'],
            subSkill:{
                revive:{
                    enable:'phaseUse',
                    filter:function(event,player){
                        if(!player.storage.boss_buchun||game.roundNumber-player.storage.boss_buchun>=2){
                            for(var i=0;i<game.dead.length;i++){
                                if(game.dead[i].parentNode==player.parentNode&&game.dead[i].name=='boss_shujing'){
                                    return true;
                                }
                            }
                        }
                        return false;
                    },
                    content:function(){
                        'step 0'
                        player.loseHp();
                        player.storage.boss_buchun=game.roundNumber;
                        'step 1'
                        event.targets=[];
                        var dead=game.dead.slice(0);
                        for(var i=0;i<dead.length;i++){
                            if(dead[i].parentNode==player.parentNode&&dead[i].name=='boss_shujing'){
                                event.targets.push(dead[i]);
                            }
                        }
                        if(event.targets[0]==player.previousSeat){
                            event.targets.push(event.targets.shift());
                        }
                        'step 2'
                        if(event.targets.length){
                            var target=event.targets.shift();
                            player.line(target,'green');
                            target.revive(1);
                            target.draw(2,false);
                            target.$draw(2);
                            event.redo();
                        }
                        'step 3'
                        game.delay();
                    },
                    ai:{
                        order:6,
                        result:{
                            player:function(player,target){
                                if(player.hp<=1) return 0;
                                if(player.hp<=3&&game.hasPlayer(function(current){
                                    return current.name=='boss_shujing'&&current.hp==1;
                                })){
                                    if(_status.event.getRand()<0.4){
                                        return 0;
                                    }
                                }
                                if(player.hp>=3) return 1;
                                if(player.hp>=2&&player!=game.boss) return 1;
                                if(game.hasPlayer(function(current){
                                    return current.name=='boss_shujing';
                                })){
                                    return 0;
                                }
                                return 1;
                            }
                        }
                    }
                },
                recover:{
                    enable:'phaseUse',
                    filter:function(event,player){
                        if(!player.storage.boss_buchun||game.roundNumber-player.storage.boss_buchun>=2){
                            for(var i=0;i<game.dead.length;i++){
                                if(game.dead[i].parentNode==player.parentNode&&game.dead[i].name=='boss_shujing'){
                                    return false;
                                }
                            }
                            return true;
                        }
                        return false;
                    },
                    prompt:'令一名己方角色回复2点体力',
                    filterTarget:function(card,player,target){
                        return target.isFriendOf(player)&&target.isDamaged();
                    },
                    content:function(){
                        target.recover(2);
                        player.storage.boss_buchun=game.roundNumber;
                    },
                    ai:{
                        order:6,
                        result:{
                            target:function(player,target){
                                var num=1;
                                if(target.maxHp-target.hp>=2){
                                    num=1.5;
                                }
                                return 1.5*get.recoverEffect(target,player,target);
                            }
                        }
                    }
                }
            }
        },
        boss_cuidu:{
            trigger:{source:'damageEnd'},
            forced:true,
            unique:true,
            filter:function(event,player){
                if(event._notrigger.contains(event.player)) return false;
                return event.player.isIn()&&event.player.isEnemyOf(player)&&!event.player.hasSkill('boss_zhongdu');
            },
            logTarget:'player',
            content:function(){
                trigger.player.addSkill('boss_zhongdu');
                var boss=game.findPlayer(function(current){
                    return current.name=='boss_mushengoumang';
                });
                if(boss){
                    boss.draw();
                }
            }
        },
        boss_zhongdu:{
            trigger:{player:'phaseZhunbeiBegin'},
            forced:true,
            mark:true,
            nopop:true,
            temp:true,
            intro:{
                content:'锁定技，回合开始时，你进行判定，若结果不为红桃，你受到1点无来源的伤害，若结果不为黑桃，你失去此技能'
            },
            content:function(){
                'step 0'
                player.judge(function(card){
                    var suit=get.suit(card);
                    if(suit=='spade') return -1;
                    if(suit=='heart') return 1;
                    return 0;
                });
                'step 1'
                if(result.suit!='heart'){
                    player.damage('nosource');
                }
                if(result.suit!='spade'){
                    player.removeSkill('boss_zhongdu');
                }
            }
        },
        boss_qingyi:{
            trigger:{player:'phaseZhunbeiBegin'},
            forced:true,
            unique:true,
            filter:function(event,player){
                return [3,5,7].contains(game.roundNumber);
            },
            content:function(){
                'step 0'
                if(game.roundNumber==7){
                    var goumang,shujing;
                    for(var i=0;i<game.players.length;i++){
                        if(game.players[i].name=='boss_mushengoumang'){
                            goumang=game.players[i];
                        }
                        if(game.players[i].name=='boss_shujing'){
                            shujing=game.players[i];
                        }
                    }
                    if(!goumang||!shujing){
                        for(var i=0;i<game.dead.length;i++){
                            if(game.dead[i].parentNode!=player.parentNode) continue;
                            if(game.dead[i].name=='boss_mushengoumang'){
                                goumang=game.dead[i];
                            }
                            if(game.dead[i].name=='boss_shujing'){
                                shujing=game.dead[i];
                            }
                        }
                    }
                    event.targets=[];
                    if(goumang){
                        event.targets.push(goumang);
                    }
                    if(shujing){
                        event.targets.push(shujing);
                    }
                    event.command='revive';
                }
                else if(game.roundNumber==5){
                    event.targets=game.filterPlayer(function(current){
                        return current.isEnemyOf(player);
                    }).sortBySeat();
                    event.command='loseHp';
                }
                else{
                    event.targets=game.filterPlayer(function(current){
                        return current.isFriendOf(player);
                    }).sortBySeat();
                    event.command='recover';
                }
                'step 1'
                if(event.targets.length){
                    var target=event.targets.shift();
                    player.line(target,'green');
                    if(event.command=='revive'){
                        player.line(target,'green');
                        if(target.isDead()){
                            target.maxHp++;
                            target.revive(3);
                        }
                        else{
                            target.gainMaxHp();
                            target.recover(3);
                        }
                        target.draw(3,false);
                        target.$draw(3);
                        event.delay=true;
                    }
                    else{
                        target[event.command]();
                    }
                    event.redo();
                }
                'step 2'
                if(event.delay){
                    game.delay();
                }
            }
        },
        boss_qizuo:{
            trigger:{player:'useCardAfter'},
            filter:function(event,player){
                if(event.parent.name=='boss_qizuo') return false;
                if(!event.targets||!event.card) return false;
                if(event.card&&event.card.name=='wuxie') return false;
                var type=get.type(event.card);
                if(type!='trick') return false;
                var card=game.createCard(event.card.name,event.card.suit,event.card.number,event.card.nature);
                var targets=event._targets||event.targets;
                for(var i=0;i<targets.length;i++){
                    if(!targets[i].isIn()) return false;
                    if(!player.canUse({name:event.card.name},targets[i],false,false)){
                        return false;
                    }
                }
                return true;
            },
            check:function(event,player){
                if(event.card.name=='tiesuo') return false;
                return true;
            },
            content:function(){
                var card=game.createCard(trigger.card.name,trigger.card.suit,trigger.card.number,trigger.card.nature);
                player.useCard(card,(trigger._targets||trigger.targets).slice(0));
            },
            ai:{
                threaten:1.3
            },
        },
        boss_guimou:{
            trigger:{player:'phaseJieshuBegin'},
            frequent:true,
            content:function(){
                var list=game.filterPlayer(function(target){
                    return target!=player&&!target.isMad();
                });
                if(list.length){
                    var target=list.randomGet();
                    player.line(target,'green');
                    target.goMad({player:'phaseAfter'});
                }
            }
        },
        boss_yuance:{
            trigger:{global:'damageEnd'},
            filter:function(event){
                return event.source&&event.source!=event.player&&event.source.isAlive()&&event.player.isAlive();
            },
            direct:true,
            content:function(){
                'step 0'
                var att1=get.attitude(player,trigger.player);
                var att2=get.attitude(player,trigger.source);
                var targets=player.getEnemies();
                var stop=false;
                for(var i=0;i<targets.length;i++){
                    var skills=targets[i].getSkills();
                    for(var j=0;j<skills.length;j++){
                        if(get.tag(skills[j],'rejudge',targets[i])){
                            stop=true;break;
                        }
                    }
                }
                var rand=Math.random()<0.5?'选项一':'选项二';
                var sourcename=get.translation(trigger.source);
                var playername=get.translation(trigger.player);
                player.chooseControl('选项一','选项二','cancel2',function(){
                    if(att1==0&&att2==0) return rand;
                    if(att1*att2>=0){
                        if(att1+att2>0){
                            return '选项二';
                        }
                        else{
                            return '选项一';
                        }
                    }
                    else{
                        if(trigger.player.isHealthy()&&trigger.source.isHealthy()) return rand;
                        if(trigger.player.isHealthy()){
                            if(att1<0) return '选项二';
                            if(att1>0&&!stop) return '选项一';
                        }
                        if(trigger.source.isHealthy()){
                            if(att2<0) return '选项二';
                            if(att2>0&&!stop) return '选项一';
                        }
                        if(stop) return 'cancel2';
                        return rand;
                    }
                }).set('prompt',get.prompt('boss_yuance')).set('choiceList',[
                    '若判定结果为黑色，'+playername+'失去1点体力，否则'+sourcename+'失去1点体力',
                    '若判定结果为红色，'+playername+'回复1点体力，否则'+sourcename+'回复1点体力'
                ]);
                'step 1'
                var att1=get.attitude(player,trigger.player);
                var att2=get.attitude(player,trigger.source);
                if(result.control=='选项一'){
                    event.type=1;
                    player.judge(function(card){
                        if(get.color(card)=='black'){
                            if(att1>0) return -1;
                            if(att1<0) return 1;
                        }
                        else{
                            if(att2>0) return -1;
                            if(att2<0) return 1;
                        }
                        return 0;
                    });
                }
                else if(result.control=='选项二'){
                    event.type=2;
                    player.judge(function(card){
                        if(get.color(card)=='red'){
                            if(trigger.player.isDamaged()){
                                if(att1>0) return 1;
                                if(att1<0) return -1;
                            }
                        }
                        else{
                            if(trigger.source.isDamaged()){
                                if(att2>0) return 1;
                                if(att2<0) return -1;
                            }
                        }
                        return 0;
                    });
                }
                else{
                    event.finish();
                }
                'step 2'
                if(event.type==1){
                    if(result.color=='black'){
                        trigger.player.loseHp();
                    }
                    else{
                        trigger.source.loseHp();
                    }
                }
                else{
                    if(result.color=='red'){
                        trigger.player.recover();
                    }
                    else{
                        trigger.source.recover();
                    }
                }
            }
        },
        boss_guixin:{
            trigger:{global:'drawAfter'},
            forced:true,
            logTarget:'player',
            filter:function(event,player){
                return event.result&&event.result.length>=2&&event.player!=player;
            },
            content:function(){
                'step 0'
                trigger.player.chooseCard('h','归心：交给'+get.translation(player)+'一张牌',true);
                'step 1'
                if(result.bool){
                    player.gain(result.cards,trigger.player);
                    trigger.player.$give(1,player);
                }
            }
        },
        xiongcai:{
            unique:true,
            trigger:{player:'phaseAfter'},
            direct:true,
            init:function(player){
                player.storage.xiongcai=[];
                // player.storage.xiongcai2=0;
            },
            intro:{
                content:'characters'
            },
            content:function(){
                'step 0'
                // if(player.storage.xiongcai2<1){
                //		player.storage.xiongcai2++;
                //		event.finish();
                // }
                // else{
                //		player.storage.xiongcai2=0;
                // }
                'step 1'
                player.logSkill('xiongcai');
                var list=[];
                var list2=[];
                var players=game.players.concat(game.dead);
                for(var i=0;i<players.length;i++){
                    list2.add(players[i].name);
                    list2.add(players[i].name1);
                    list2.add(players[i].name2);
                }
                for(var i in lib.character){
                    if(lib.character[i][1]!='wei') continue;
                    if(lib.character[i][4].contains('boss')) continue;
                    if(lib.character[i][4].contains('minskin')) continue;
                    if(player.storage.xiongcai.contains(i)) continue;
                    if(list2.contains(i)) continue;
                    list.push(i);
                }
                var name=list.randomGet();
                player.storage.xiongcai.push(name);
                player.markSkill('xiongcai');
                var skills=lib.character[name][3];
                for(var i=0;i<skills.length;i++){
                    player.addSkill(skills[i]);
                }
                event.dialog=ui.create.dialog('<div class="text center">'+get.translation(player)+'发动了【雄才】',[[name],'character']);
                game.delay(2);
                'step 2'
                event.dialog.close();
            }
        },
        xiaoxiong:{
            trigger:{global:'useCardAfter'},
            forced:true,
            unique:true,
            forceunique:true,
            filter:function(event,player){
                var type=get.type(event.card,'trick');
                return event.player!=player&&(type=='basic'||type=='trick');
            },
            content:function(){
                player.gain(game.createCard(trigger.card),'gain2');
            },
            group:'xiaoxiong_damage',
            subSkill:{
                damage:{
                    trigger:{global:'phaseJieshuBegin'},
                    forced:true,
                    filter:function(event,player){
                        return event.player!=player&&event.player.countUsed()==0;
                    },
                    logTarget:'player',
                    content:function(){
                        trigger.player.damage();
                    }
                }
            }
        },
        boss_zhangwu:{
            global:'boss_zhangwu_ai',
            trigger:{player:'damageEnd'},
            check:function(event,player){
                return event.source&&event.source.isIn()&&get.damageEffect(event.source,player,player)>0;
            },
            filter:function(event){
                return event.source&&event.source.isAlive();
            },
            direct:true,
            logTarget:'source',
            content:function(){
                'step 0'
                player.chooseToDiscard(get.prompt('boss_zhangwu',trigger.source),'he',[1,Infinity]).set('ai',function(card){
                    if(get.attitude(player,target)<0) return 8-get.value(card);
                    return 0;
                }).set('logSkill',['boss_zhangwu',trigger.source]);
                'step 1'
                if(result.bool){
                    var num=result.cards.length;
                    var cnum=get.cnNumber(num);
                    event.num=num;
                    trigger.source.chooseToDiscard('he','章武：弃置'+cnum+'张牌，或取消并受到'+cnum+'点伤害',num).set('ai',function(card){
                        if(!trigger.source.hasSkillTag('nodamage')) return 10-get.value(card);
                        return 0;
                    });
                }
                else{
                    event.finish();
                }
                'step 2'
                if(!result.bool){
                    trigger.source.damage(event.num);
                }
            },
            ai:{
                maixie:true,
                maixie_hp:true,
                effect:{
                    target:function(card,player,target){
                        if(get.tag(card,'damage')&&get.attitude(target,player)<0&&player.countCards('he')<target.countCards('he')){
                            return [0,2];
                        }
                    }
                }
            }
        },
        boss_zhangwu_ai:{
            ai:{
                effect:{
                    target:function(card,player,target){
                        if(get.tag(card,'recover')&&card.name!='recover'){
                            for(var i=0;i<game.players.length;i++){
                                if(game.players[i].hasSkill('xiaoxiong')&&get.attitude(target,game.players[i])<0){
                                    return 'zeroplayertarget';
                                }
                            }
                        }
                    }
                }
            }
        },
        yueyin:{
            unique:true,
            mark:true,
            intro:{
                content:function(storage,player){
                    var str='扣减'+(7-player.storage.xiangxing_count)+'点体力后失去下一枚星；';
                    str+='防上禳星伤害条件：'+lib.translate['xiangxing'+player.storage.xiangxing+'_info'];
                    return str;
                },
                markcount:function(storage,player){
                    return Math.max(0,7-player.storage.xiangxing_count);
                }
            },
            skipDamage:{
                x7:function(player){
                    return player.countCards('h')==0;
                },
                x6:function(player,event){
                    return event.hasNature('fire');
                },
                x5:function(player,event){
                    return event.hasNature('thunder');
                },
                x4:function(player,event){
                    return event.name=='loseHp';
                },
                x3:function(player,event){
                    return game.hasPlayer(function(current){
                        return current!=player&&current.countCards('e')>=4;
                    });
                },
                x2:function(player){
                    return player.countCards('j')>=2;
                },
                x1:function(){
                    return game.players.length==2;
                }
            },
        },
        xiangxing:{
            unique:true,
            init:function(player){
                player.storage.xiangxing=7;
                player.storage.xiangxing_count=0;
                player.addSkill('xiangxing7');
            },
            mark:true,
            intro:{
                content:'当前有#枚星'
            },
            trigger:{player:['damageEnd','loseHpEnd']},
            forced:true,
            popup:false,
            content:function(){
                'step 0'
                var num=trigger.num;
                if(num){
                    player.storage.xiangxing_count+=num;
                }
                if(player.storage.xiangxing_count>=7){
                    if(player.hasSkill('yueyin')&&lib.skill.yueyin.skipDamage['x'+player.storage.xiangxing](player,trigger)){
                        event.goto(3);
                    }
                    player.removeSkill('xiangxing'+player.storage.xiangxing);
                    player.storage.xiangxing--;
                    player.storage.xiangxing_count=0;
                    player.updateMarks();
                    if(player.storage.xiangxing){
                        player.addSkill('xiangxing'+player.storage.xiangxing);
                    }
                    else{
                        player.awakenSkill('xiangxing');
                    }
                    player.popup('xiangxing');
                    game.log(player,'失去了一枚星');
                }
                else{
                    player.updateMarks();
                    event.finish();
                }
                'step 1'
                var list=game.filterPlayer();
                list.remove(player);
                list.sort(lib.sort.seat);
                var list2=[];
                for(var i=0;i<list.length;i++){
                    list2.push(0);
                }
                for(var i=0;i<7;i++){
                    list2[Math.floor(Math.random()*list2.length)]++;
                }
                event.list=list;
                event.list2=list2;
                'step 2'
                if(event.list.length){
                    var target=event.list.shift();
                    target.damage(event.list2.shift(),'thunder');
                    player.line(target,'thunder');
                    event.redo();
                }
                'step 3'
                if(player.storage.xiangxing==0){
                    player.maxHp=3;
                    player.update();
                }
            },
        },
        fengqi:{
            trigger:{player:['phaseZhunbeiBegin','phaseJieshuBegin']},
            direct:true,
            content:function(){
                'step 0'
                const func = (player)=>{
                    var list={basic:[],equip:[],trick:[],delay:[]};
                    for(var i=0;i<lib.inpile.length;i++){
                        var name=lib.inpile[i];
                        var info=lib.card[name];
                        if(info.autoViewAs||name=='yuansuhuimie') continue;
                        if(lib.filter.cardEnabled({name:name},player)){
                            if(!list[info.type]){
                                list[info.type]=[];
                            }
                            list[info.type].push([get.translation(lib.card[name].type),'',name]);
                        }
                    }
                    list.trick.sort(lib.sort.name);
                    var dialog=ui.create.dialog('风起',[list.trick,'vcard']);
                    // for(var i in list){
                    //         dialog.addText(get.translation(i)+'牌');
                    //         dialog.add([list[i],'vcard']);
                    // }
                    var rand1=Math.random()<1/3;
                    var rand2=Math.random()<0.5;
                    var rand3=Math.random()<1/3;
                    var rand4=Math.random()<1/3;
                    return dialog
                }
                const dialog = func()
                event.dialog = dialog
                if(player.isOnline2()){
                    player.send(function(fn,p){
                        const dialog = fn(p)
                        _status.event.dialog = dialog
                    },func,player);
                }
                player.chooseButton(dialog).ai=function(button){
                    var name=button.link[2];
                    if(player.hp<=1){
                        switch(name){
                            case 'zhiliaobo':return 1;
                            case 'dunpaigedang':return 0.8;
                            case 'nanman':return 0.5;
                            default:return 0;
                        }
                    }
                    if(rand4&&player.countCards('h')<=1){
                        switch(name){
                            case 'zengbin':return 1;
                            case 'wuzhong':return 0.8;
                            default:return 0;
                        }
                    }
                    if(player.hasSkill('qinglonglingzhu')){
                        if(rand2) return name=='chiyuxi'?0.8:0;
                        return name=='jingleishan'?0.8:0;
                    }
                    if(rand2) return name=='wanjian'?0.8:0;
                    return name=='nanman'?0.8:0;
                }
                'step 1'
                player.send('closeDialog');
                event.dialog.close()
                if(result.bool){
                    player.chooseUseTarget(result.links[0][2],true,false);
                }
            },
            ai:{
                threaten:1.5,
            }
        },
        fengqi2:{
            mod:{
                wuxieRespondable:function(){
                    return false;
                }
            }
        },
        gaiming:{
            trigger:{player:'judgeBefore'},
            direct:true,
            priority:1,
            unique:true,
            content:function(){
                "step 0"
                event.cards=get.cards(7);
                player.chooseCardButton(true,event.cards,'改命：选择一张牌作为你的'+trigger.judgestr+'判定结果').ai=function(button){
                    if(get.attitude(player,trigger.player)>0){
                        return 1+trigger.judge(button.link);
                    }
                    if(get.attitude(player,trigger.player)<0){
                        return 1-trigger.judge(button.link);
                    }
                    return 0;
                };
                "step 1"
                if(!result.bool){
                    event.finish();
                    return;
                }
                player.logSkill('gaiming',trigger.player);
                var card=result.links[0];
                event.cards.remove(card);
                var judgestr=get.translation(trigger.player)+'的'+trigger.judgestr+'判定';
                event.videoId=lib.status.videoId++;
                event.dialog=ui.create.dialog(judgestr);
                event.dialog.classList.add('center');
                event.dialog.videoId=event.videoId;

                game.addVideo('judge1',player,[get.cardInfo(card),judgestr,event.videoId]);
                for(var i=0;i<event.cards.length;i++) event.cards[i].discard();
                // var node=card.copy('thrown','center',ui.arena).animate('start');
                var node;
                if(game.chess){
                    node=card.copy('thrown','center',ui.arena).animate('start');
                }
                else{
                    node=player.$throwordered(card.copy(),true);
                }
                node.classList.add('thrownhighlight');
                ui.arena.classList.add('thrownhighlight');
                if(card){
                    trigger.cancel();
                    trigger.result={
                        card:card,
                        judge:trigger.judge(card),
                        node:node,
                        number:get.number(card),
                        suit:get.suit(card),
                        color:get.color(card),
                    };
                    if(trigger.result.judge>0){
                        trigger.result.bool=true;
                        trigger.player.popup('洗具');
                    }
                    if(trigger.result.judge<0){
                        trigger.result.bool=false;
                        trigger.player.popup('杯具');
                    }
                    game.log(trigger.player,'的判定结果为',card);
                    trigger.direct=true;
                    trigger.position.appendChild(card);
                    game.delay(2);
                }
                else{
                    event.finish();
                }
                "step 2"
                ui.arena.classList.remove('thrownhighlight');
                event.dialog.close();
                game.addVideo('judge2',null,event.videoId);
                ui.clear();
                var card=trigger.result.card;
                trigger.position.appendChild(card);
                trigger.result.node.delete();
                game.delay();
            },
        },
        tiandao:{
            audio:true,
            trigger:{global:'judge'},
            direct:true,
            filter:function(event,player){
                return player.countCards('he')>0;
            },
            content:function(){
                "step 0"
                player.chooseCard(get.translation(trigger.player)+'的'+(trigger.judgestr||'')+'判定为'+
                get.translation(trigger.player.judging[0])+'，'+get.prompt('tiandao'),'he').ai=function(card){
                    var trigger=_status.event.parent._trigger;
                    var player=_status.event.player;
                    var result=trigger.judge(card)-trigger.judge(trigger.player.judging[0]);
                    var attitude=get.attitude(player,trigger.player);
                    if(attitude==0||result==0) return 0;
                    if(attitude>0){
                        return result;
                    }
                    else{
                        return -result;
                    }
                };
                "step 1"
                if(result.bool){
                    player.respond(result.cards,'highlight');
                }
                else{
                    event.finish();
                }
                "step 2"
                if(result.bool){
                    player.logSkill('tiandao');
                    player.$gain2(trigger.player.judging[0]);
                    player.gain(trigger.player.judging[0]);
                    trigger.player.judging[0]=result.cards[0];
                    trigger.position.appendChild(result.cards[0]);
                    game.log(trigger.player,'的判定牌改为',result.cards[0]);
                }
                "step 3"
                game.delay(2);
            },
            ai:{
                tag:{
                    rejudge:1
                },
                threaten:1.5
            }
        },
        lianji:{
            audio:true,
            enable:'phaseUse',
            usable:1,
            filterTarget:function(card,player,target){
                if(player==target) return false;
                return target.countCards('h')>0;
            },
            selectTarget:2,
            multitarget:true,
            multiline:true,
            filter:function(event,player){
                return player.countCards('h')>0;
            },
            prepare:'throw',
            discard:false,
            filterCard:true,
            check:function(card){
                return 6-get.value(card);
            },
            content:function(){
                "step 0"
                if(targets[0].countCards('h')&&targets[1].countCards('h')){
                    targets[0].chooseToCompare(targets[1]);
                }
                else{
                    event.finish();
                }
                "step 1"
                if(result.bool){
                    targets[0].gain(cards);
                    targets[0].$gain2(cards);
                    targets[1].damage(targets[0]);
                }
                else{
                    targets[1].gain(cards);
                    targets[1].$gain2(cards);
                    targets[0].damage(targets[1]);
                }
            },
            ai:{
                expose:0.3,
                threaten:2,
                order:9,
                result:{
                    target:-1
                }
            },
        },
        mazui:{
            audio:true,
            enable:'phaseUse',
            usable:1,
            filterCard:{color:'black'},
            filterTarget:function(card,player,target){
                return !target.hasSkill('mazui2');
            },
            check:function(card){
                return 6-get.value(card);
            },
            discard:false,
            prepare:'give',
            content:function(){
                target.storage.mazui2=cards[0];
                target.addSkill('mazui2');
                game.addVideo('storage',target,['mazui2',get.cardInfo(target.storage.mazui2),'card']);
            },
            ai:{
                expose:0.2,
                result:{
                    target:function(player,target){
                        return -target.hp;
                    }
                },
                order:4,
                threaten:1.2
            }
        },
        mazui2:{
            trigger:{source:'damageBegin1'},
            forced:true,
            mark:'card',
            filter:function(event){
                return event.num>0;
            },
            content:function(){
                trigger.num--;
                player.addSkill('mazui3');
                player.removeSkill('mazui2');
            },
            intro:{
                content:'card'
            }
        },
        mazui3:{
            trigger:{source:['damageEnd','damageZero']},
            forced:true,
            popup:false,
            content:function(){
                player.gain(player.storage.mazui2,'gain2');
                game.log(player,'获得了',player.storage.mazui2);
                player.removeSkill('mazui3');
                delete player.storage.mazui2;
            }
        },
        yunshen:{
            trigger:{player:['respond','useCard']},
            filter:function(event,player){
                return event.card.name=='shan';
            },
            frequent:true,
            init:function(player){
                player.storage.yunshen=0;
            },
            content:function(){
                player.storage.yunshen++;
                player.markSkill('yunshen');
            },
            ai:{
                effect:{
                    target:function(card,player,target){
                        if(get.tag(card,'respondShan')){
                            var shans=target.countCards('h','shan');
                            var hs=target.countCards('h');
                            if(shans>1) return [1,1];
                            if(shans&&hs>2) return [1,1];
                            if(shans) return [1,0.5];
                            if(hs>2) return [1,0.3];
                            if(hs>1) return [1,0.2];
                            return [1.2,0];
                        }
                    }
                },
                threaten:0.8
            },
            intro:{
                content:'mark'
            },
            group:'yunshen2'
        },
        yunshen2:{
            trigger:{player:'phaseZhunbeiBegin'},
            forced:true,
            filter:function(event,player){
                return player.storage.yunshen>0;
            },
            content:function(){
                player.draw(player.storage.yunshen);
                player.storage.yunshen=0;
                player.unmarkSkill('yunshen');
            },
            mod:{
                globalTo:function(from,to,distance){
                    if(typeof to.storage.yunshen=='number') return distance+to.storage.yunshen;
                }
            }
        },
        lingbo:{
            audio:2,
            trigger:{player:['respond','useCard']},
            filter:function(event,player){
                return event.card.name=='shan';
            },
            frequent:true,
            content:function(){
                player.draw(2);
            },
            ai:{
                mingzhi:false,
                effect:{
                    target:function(card,player,target){
                        if(get.tag(card,'respondShan')){
                            var shans=target.countCards('h','shan');
                            var hs=target.countCards('h');
                            if(shans>1) return [0,1];
                            if(shans&&hs>2) return [0,1];
                            if(shans) return [0,0];
                            if(hs>2) return [0,0];
                            if(hs>1) return [1,0.5];
                            return [1.5,0];
                        }
                    }
                },
                threaten:0.8
            }
        },
        jiaoxia:{
            audio:2,
            trigger:{target:'useCardToTargeted'},
            filter:function(event,player){
                return event.card&&get.color(event.card)=='red';
            },
            frequent:true,
            content:function(){
                player.draw();
            },
            ai:{
                effect:function(card,player,target){
                    if(get.color(card)=='red') return [1,1];
                },
            }
        },
        boss_nbianshenx:{},
        boss_jingjue:{
            inherit:'boss_danshu'
        },
        boss_renxing:{
            trigger:{global:['damageEnd','recoverEnd']},
            forced:true,
            filter:function(event,player){
                return _status.currentPhase!=player;
            },
            content:function(){
                player.draw();
            }
        },
        boss_ruizhi:{
            trigger:{global:'phaseZhunbeiBegin'},
            forced:true,
            filter:function(event,player){
                return event.player!=player&&(event.player.countCards('h')>1||event.player.countCards('e')>1);
            },
            content:function(){
                'step 0'
                player.line(trigger.player,'green');
                game.broadcastAll(function(tr){
                    _status.trigger = tr
                },trigger)
                var next=trigger.player.chooseCard(true,'选择保留一张手牌和一张装备区内的牌，然后弃置其它牌','he',function(card){
                    switch(get.position(card)){
                        case 'h':{
                            if(ui.selected.cards.length){
                                return get.position(ui.selected.cards[0])=='e';
                            }
                            else{
                                return _status.trigger.player.countCards('h')>1;
                            }
                        }
                        case 'e':{
                            if(ui.selected.cards.length){
                                return get.position(ui.selected.cards[0])=='h';
                            }
                            else{
                                return _status.trigger.player.countCards('e')>1;
                            }
                        }
                    }
                });
                var num=0;
                if(trigger.player.countCards('h')>1){
                    num++;
                }
                if(trigger.player.countCards('e')>1){
                    num++;
                }
                next.selectCard=[num,num];
                next.ai=function(card){
                    return get.value(card);
                };
                'step 1'
                if(result.bool){
                    var he=[];
                    var hs=trigger.player.getCards('h');
                    var es=trigger.player.getCards('e');
                    if(hs.length>1){
                        he=he.concat(hs);
                    }
                    if(es.length>1){
                        he=he.concat(es);
                    }
                    for(var i=0;i<result.cards.length;i++){
                        he.remove(result.cards[i]);
                    }
                    trigger.player.discard(he);
                }
            }
        },
        boss_nbaonu:{
            group:['boss_nbaonu_sha'],
            trigger:{player:'phaseDrawBegin'},
            forced:true,
            priority:-1,
            content:function(){
                if(player.hp>4){
                    trigger.num=4+Math.floor(Math.random()*(player.hp-3));
                }
                else{
                    trigger.num=4;
                }
            },
            subSkill:{
                sha:{
                    mod:{
                        cardUsable:function(card,player,num){
                            if(card.name=='sha'&&player.hp<5) return Infinity;
                        }
                    },
                    trigger:{source:'damageBegin1'},
                    filter:function(event,player){
                        return event.card&&event.card.name=='sha'&&event.notLink()&&player.hp<5;
                    },
                    forced:true,
                    content:function(){
                        trigger.num++;
                    }
                }
            }
        },
        boss_shouyi:{
            mod:{
                targetInRange:function(){
                    return true;
                }
            },
        },
        boss_mengtai:{
            group:['boss_mengtai_begin','boss_mengtai_draw','boss_mengtai_use',
            'boss_mengtai_discard','boss_mengtai_end'],
            subSkill:{
                begin:{
                    trigger:{player:'phaseZhunbeiBegin'},
                    forced:true,
                    popup:false,
                    content:function(){
                        player.storage.boss_mengtai_draw=true;
                        player.storage.boss_mengtai_use=true;
                    }
                },
                draw:{
                    trigger:{player:'phaseDrawBegin'},
                    forced:true,
                    popup:false,
                    content:function(){
                        player.storage.boss_mengtai_draw=false;
                    }
                },
                use:{
                    trigger:{player:'phaseUseBegin'},
                    forced:true,
                    popup:false,
                    content:function(){
                        player.storage.boss_mengtai_use=false;
                    }
                },
                discard:{
                    trigger:{player:'phaseDiscardBefore'},
                    forced:true,
                    filter:function(event,player){
                        if(player.storage.boss_mengtai_use) return true;
                        return false;
                    },
                    content:function(){
                        trigger.cancel();
                    }
                },
                end:{
                    trigger:{player:'phaseJieshuBegin'},
                    forced:true,
                    filter:function(event,player){
                        if(player.storage.boss_mengtai_draw) return true;
                        return false;
                    },
                    content:function(){
                        player.draw(3);
                    }
                }
            }
        },
        boss_nbianshen:{
            trigger:{player:'phaseBefore'},
            forced:true,
            popup:false,
            priority:25,
            fixed:true,
            filter:function(event,player){
                if(player.name=='boss_nianshou_heti'||player.storage.boss_nbianshen) return true;
                return false;
            },
            content:function(){
                if(player.storage.boss_nbianshen){
                    var hp=player.hp,
                        maxHp=player.maxHp,
                        hujia=player.hujia;
                    player.init('boss_nianshou_'+player.storage.boss_nbianshen_next);
                    player.storage.boss_nbianshen.remove(player.storage.boss_nbianshen_next);
                    if(!player.storage.boss_nbianshen.length){
                        player.storage.boss_nbianshen=['jingjue','renxing','ruizhi','baonu'];
                    }
                    player.storage.boss_nbianshen_next=player.storage.boss_nbianshen.randomGet(player.storage.boss_nbianshen_next);
                    player.hp=hp;
                    player.maxHp=maxHp;
                    player.hujia=hujia;
                    player.update();
                }
                else{
                    player.storage.boss_nbianshen=['jingjue','renxing','ruizhi','baonu'];
                    player.storage.boss_nbianshen_next=player.storage.boss_nbianshen.randomGet();
                    player.markSkill('boss_nbianshen');
                }
            },
            intro:{
                content:function(storage,player){
                    var map={
                        jingjue:'警觉',
                        renxing:'任性',
                        ruizhi:'睿智',
                        baonu:'暴怒'
                    };
                    return '下一个状态：'+map[player.storage.boss_nbianshen_next];
                }
            }
        },
        boss_damagecount:{
            mode:['boss'],
            global:'boss_damagecount2'
        },
        boss_damagecount2:{
            trigger:{source:'damageEnd'},
            silent:true,
            filter:function(event,player){
                if(!ui.damageCount) return false;
                return event.num>0&&player.isFriendOf(game.me)&&event.player.isEnemyOf(game.me);
            },
            content:function(){
                _status.damageCount+=trigger.num;
                ui.damageCount.innerHTML='伤害: '+_status.damageCount;
            }
        },
        boss_nianrui:{
            trigger:{player:'phaseDrawBegin'},
            forced:true,
            content:function(){
                trigger.num+=2;
            },
            ai:{
                threaten:1.6
            }
        },
        boss_qixiang:{
            group:['boss_qixiang1','boss_qixiang2'],
            ai:{
                effect:{
                    target:function(card,player,target,current){
                        if(card.name=='lebu'&&card.name=='bingliang') return 0.8;
                    }
                }
            }
        },
        boss_qixiang1:{
            trigger:{player:'judge'},
            forced:true,
            filter:function(event,player){
                if(event.card){
                    if(event.card.viewAs){
                        return event.card.viewAs=='lebu';
                    }
                    else{
                        return event.card.name=='lebu';
                    }
                }
            },
            content:function(){
                player.addTempSkill('boss_qixiang3','judgeAfter');
            }
        },
        boss_qixiang2:{
            trigger:{player:'judge'},
            forced:true,
            filter:function(event,player){
                if(event.card){
                    if(event.card.viewAs){
                        return event.card.viewAs=='bingliang';
                    }
                    else{
                        return event.card.name=='bingliang';
                    }
                }
            },
            content:function(){
                player.addTempSkill('boss_qixiang4','judgeAfter');
            }
        },
        boss_qixiang3:{
            mod:{
                suit:function(card,suit){
                    if(suit=='diamond') return 'heart';
                }
            }
        },
        boss_qixiang4:{
            mod:{
                suit:function(card,suit){
                    if(suit=='spade') return 'club';
                }
            }
        },
        boss_bianshen2:{
            mode:['boss'],
            fixed:true,
            global:'boss_bianshen2x',
            trigger:{player:'dieBegin'},
            silent:true,
            content:function(){
                player.hide();
                game.addVideo('hidePlayer',player);
            }
        },
        boss_bianshen2x:{
            trigger:{global:'dieAfter'},
            forced:true,
            priority:-10,
            fixed:true,
            globalFixed:true,
            filter:function(event){
                if(lib.config.mode!='boss') return false;
                return event.player==game.boss&&event.player.hasSkill('boss_bianshen2');
            },
            content:function(){
                'step 0'
                game.delay();
                'step 1'
                game.changeBoss(['boss_niutou','boss_mamian'].randomGet());
            }
        },
        boss_bianshen3:{
            mode:['boss'],
            global:'boss_bianshen3x',
            trigger:{player:'dieBegin'},
            silent:true,
            fixed:true,
            content:function(){
                player.hide();
                game.addVideo('hidePlayer',player);
            }
        },
        boss_bianshen3x:{
            trigger:{global:'dieAfter'},
            forced:true,
            priority:-10,
            fixed:true,
            globalFixed:true,
            filter:function(event){
                if(lib.config.mode!='boss') return false;
                return event.player==game.boss&&event.player.hasSkill('boss_bianshen3');
            },
            content:function(){
                'step 0'
                game.delay();
                'step 1'
                game.changeBoss(['boss_baiwuchang','boss_heiwuchang'].randomGet());
            }
        },
        boss_bianshen4:{
            mode:['boss'],
            global:'boss_bianshen4x',
            trigger:{player:'dieBegin'},
            silent:true,
            fixed:true,
            content:function(){
                player.hide();
                game.addVideo('hidePlayer',player);
            }
        },
        boss_bianshen4x:{
            trigger:{global:'dieAfter'},
            forced:true,
            priority:-10,
            fixed:true,
            globalFixed:true,
            filter:function(event){
                if(lib.config.mode!='boss') return false;
                return event.player==game.boss&&event.player.hasSkill('boss_bianshen4');
            },
            content:function(){
                'step 0'
                game.delay();
                'step 1'
                game.changeBoss(['boss_yecha','boss_luocha'].randomGet());
            }
        },
        boss_moyany:{
            trigger:{player:'loseEnd'},
            frequent:true,
            unique:true,
            filter:function(event,player){
                return _status.currentPhase!=player;
            },
            content:function(){
                "step 0"
                player.judge(function(card){
                    return get.color(card)=='red'?1:0;
                });
                "step 1"
                if(result.bool){
                    player.chooseTarget(true,'选择一个目标对其造成两点火焰伤害',function(card,player,target){
                        return player!=target;
                    }).ai=function(target){
                        return get.damageEffect(target,player,player,'fire');
                    }
                }
                else{
                    event.finish();
                }
                "step 2"
                if(result.targets.length){
                    player.line(result.targets,'fire');
                    result.targets[0].damage(2,'fire');
                }
            },
            ai:{
                effect:{
                    target:function(card){
                        if(get.tag(card,'loseCard')){
                            return [0.5,1];
                        }
                    }
                }
            }
        },
        boss_danshu:{
            trigger:{player:'loseEnd'},
            frequent:true,
            unique:true,
            filter:function(event,player){
                return _status.currentPhase!=player&&player.hp<player.maxHp;
            },
            content:function(){
                "step 0"
                player.judge(function(card){
                    return get.color(card)=='red'?1:0;
                });
                "step 1"
                if(result.color=='red'){
                    player.recover();
                }
            },
            ai:{
                effect:{
                    target:function(card){
                        if(get.tag(card,'loseCard')){
                            return [0.5,1];
                        }
                    }
                }
            }
        },
        boss_modao:{
            trigger:{player:'phaseZhunbeiBegin'},
            forced:true,
            content:function(){
                player.draw(2);
            }
        },
        boss_mojian:{
            trigger:{player:'phaseUseBegin'},
            content:function(){
                var list=game.filterPlayer(function(current){
                    return player.canUse('wanjian',current)&&current.isEnemyOf(player);
                });
                list.sort(lib.sort.seat);
                player.useCard({name:'wanjian'},list);
            },
            ai:{
                threaten:1.8
            }
        },
        boss_yushou:{
            trigger:{player:'phaseUseBegin'},
            content:function(){
                var list=game.filterPlayer(function(current){
                    return player.canUse('nanman',current)&&current.isEnemyOf(player);
                });
                list.sort(lib.sort.seat);
                player.useCard({name:'nanman'},list);
            }
        },
        boss_zuijiu:{
            trigger:{source:'damageBegin1'},
            filter:function(event){
                return event.card&&event.card.name=='sha'&&event.getParent().name=='sha';
            },
            forced:true,
            content:function(){
                trigger.num++;
            }
        },
        boss_xixing:{
            trigger:{player:'phaseZhunbeiBegin'},
            direct:true,
            content:function(){
                "step 0"
                player.chooseTarget(get.prompt('boss_xixing'),function(card,player,target){
                    return player!=target&&target.isLinked();
                }).ai=function(target){
                    return get.damageEffect(target,player,player,'thunder');
                }
                "step 1"
                if(result.bool){
                    player.logSkill('boss_xixing',result.targets);
                    result.targets[0].damage('thunder');
                    player.recover();
                }
            },
        },
        boss_suoming:{
            trigger:{player:'phaseJieshuBegin'},
            direct:true,
            filter:function(event,player){
                return game.hasPlayer(function(current){
                    return current!=player&&!current.isLinked();
                });
            },
            content:function(){
                "step 0"
                var num=game.countPlayer(function(current){
                    return current!=player&&!current.isLinked();
                });
                player.chooseTarget(get.prompt('boss_suoming'),[1,num],function(card,player,target){
                    return !target.isLinked()&&player!=target;
                }).ai=function(target){
                    return -get.attitude(player,target);
                }
                "step 1"
                if(result.bool){
                    player.logSkill('boss_suoming',result.targets);
                    event.targets=result.targets;
                    event.num=0;
                }
                else{
                    event.finish();
                }
                "step 2"
                if(event.num<event.targets.length){
                    event.targets[event.num].link();
                    event.num++;
                    event.redo();
                }
            },
        },
        boss_taiping:{
            trigger:{player:'phaseDrawBegin'},
            forced:true,
            content:function(){
                trigger.num+=2;
            }
        },
        boss_baolian:{
            trigger:{player:'phaseJieshuBegin'},
            forced:true,
            content:function(){
                player.draw(2);
            }
        },
        boss_xiaoshou:{
            trigger:{player:'phaseJieshuBegin'},
            direct:true,
            content:function(){
                "step 0"
                player.chooseTarget(get.prompt('boss_xiaoshou'),function(card,player,target){
                    return player!=target&&target.hp>=player.hp;
                }).ai=function(target){
                    return get.damageEffect(target,player,player,'fire');
                }
                "step 1"
                if(result.bool){
                    player.logSkill('boss_xiaoshou',result.targets);
                    result.targets[0].damage('fire',3);
                }
            },
        },
        boss_manjia:{
            group:['boss_manjia1','boss_manjia2']
        },
        boss_manjia1:{
            trigger:{target:['useCardToBefore','shaBegin']},
            forced:true,
            priority:6,
            filter:function(event,player,name){
                if(player.getEquip(2)) return false;
                if(name=='shaBegin') return lib.skill.tengjia3.filter(event,player);
                return lib.skill.tengjia1.filter(event,player);
            },
            content:function(){
                trigger.cancel();
            },
            ai:{
                effect:{
                    target:function(card,player,target,current){
                        if(target.getEquip(2)) return;
                        return lib.skill.tengjia1.ai.effect.target.apply(this,arguments);
                    }
                }
            }
        },
        boss_manjia2:{
            trigger:{player:'damageBegin3'},
            filter:function(event,player){
                if(player.getEquip(2)) return false;
                if(event.hasNature('fire')) return true;
            },
            forced:true,
            check:function(){
                return false;
            },
            content:function(){
                trigger.num++;
            },
            ai:{
                effect:{
                    target:function(card,player,target,current){
                        if(target.getEquip(2)) return;
                        return lib.skill.tengjia2.ai.effect.target.apply(this,arguments);
                    }
                }
            }
        },
        boss_lianyu:{
            trigger:{player:'phaseJieshuBegin'},
            unique:true,
            content:function(){
                "step 0"
                event.players=get.players(player);
                "step 1"
                if(event.players.length){
                    var current=event.players.shift();
                    if(current.isEnemyOf(player)){
                        player.line(current,'fire');
                        current.damage('fire');
                    }
                    event.redo();
                }
            },
            ai:{
                threaten:2
            }
        },
        boss_guiji:{
            trigger:{player:'phaseJudgeBegin'},
            forced:true,
            content:function(){
                player.discard(player.getCards('j').randomGet());
            },
            filter:function(event ,player){
                return player.countCards('j')>0;
            },
            ai:{
                effect:{
                    target:function(card,player,target,current){
                        if(get.type(card)=='delay'&&target.countCards('j')==0) return 0.1;
                    }
                }
            }
        },
        boss_minbao:{
            global:'boss_minbao2'
        },
        boss_minbao2:{
            trigger:{global:'dieAfter'},
            forced:true,
            globalFixed:true,
            filter:function(event,player){
                return event.player.hasSkill('boss_minbao')&&event.player.isDead();
            },
            content:function(){
                trigger.player.line(player,'fire');
                player.damage('nosource','fire').animate=false;
                player.$damage(trigger.player);
                player.$damagepop(-1,'fire');
                if(lib.config.animation&&!lib.config.low_performance){
                    player.$fire();
                }
                if(!event.parent.parent.boss_minbao_logv){
                    event.parent.parent.boss_minbao_logv=true;
                    game.logv(trigger.player,'boss_minbao',game.filterPlayer(),event.parent.parent);
                }
            }
        },
        boss_guihuo:{
            trigger:{player:'phaseJieshuBegin'},
            direct:true,
            content:function(){
                "step 0"
                player.chooseTarget(get.prompt('boss_guihuo'),function(card,player,target){
                    return player!=target;
                }).ai=function(target){
                    return get.damageEffect(target,player,player,'fire');
                }
                "step 1"
                if(result.bool){
                    player.logSkill('boss_guihuo',result.targets);
                    result.targets[0].damage('fire');
                }
            },
        },
        boss_luolei:{
            trigger:{player:'phaseZhunbeiBegin'},
            direct:true,
            content:function(){
                "step 0"
                player.chooseTarget(get.prompt('boss_luolei'),function(card,player,target){
                    return player!=target;
                }).ai=function(target){
                    return get.damageEffect(target,player,player,'thunder');
                }
                "step 1"
                if(result.bool){
                    player.logSkill('boss_luolei',result.targets);
                    result.targets[0].damage('thunder');
                }
            },
        },
        boss_beiming:{
            trigger:{player:'dieBegin'},
            forced:true,
            filter:function(event){
                return event.source!=undefined;
            },
            content:function(){
                trigger.source.discard(trigger.source.getCards('h'));
            },
            ai:{
                threaten:0.7
            }
        },
        boss_shanbeng:{
            global:'boss_shanbeng2',
            trigger:{player:'dieBegin'},
            forced:true,
            logv:false,
            content:function(){
                var targets=game.filterPlayer(function(current){
                    return current.countCards('e');
                });
                player.line(targets,'green');
                game.delay();
                game.logv(player,'boss_shanbeng',targets,null,true);
            }
        },
        boss_shanbeng2:{
            trigger:{global:'dieAfter'},
            forced:true,
            globalFixed:true,
            filter:function(event,player){
                return player.countCards('e')>0&&event.player.hasSkill('boss_shanbeng')&&event.player.isDead();
            },
            content:function(){
                player.discard(player.getCards('e'));
            }
        },
        boss_didong:{
            trigger:{player:'phaseJieshuBegin'},
            direct:true,
            content:function(){
                "step 0"
                player.chooseTarget(get.prompt('boss_didong'),function(card,player,target){
                    return target.isEnemyOf(player);
                }).ai=function(target){
                    var att=get.attitude(player,target);
                    if(target.isTurnedOver()){
                        if(att>0){
                            return att+5;
                        }
                        return -1;
                    }
                    if(player.isTurnedOver()){
                        return 5-att;
                    }
                    return -att;
                };
                "step 1"
                if(result.bool){
                    player.logSkill('boss_didong',result.targets);
                    result.targets[0].turnOver();
                }
            },
            ai:{
                threaten:1.7
            }
        },
        boss_guimei:{
            mod:{
                targetEnabled:function(card,player,target){
                    if(get.type(card)=='delay'){
                        return false;
                    }
                }
            }
        },
        boss_bianshen:{
            trigger:{global:'gameStart'},
            forced:true,
            popup:false,
            content:function(){
                player.smoothAvatar();
                player.init(['boss_chi','boss_mo','boss_wang','boss_liang'].randomGet());
                game.addVideo('reinit2',player,player.name);
            }
        },
        boss_bianshen_intro1:{nobracket:true},
        boss_bianshen_intro2:{nobracket:true},
        boss_bianshen_intro3:{nobracket:true},
        boss_bianshen_intro4:{nobracket:true},
        boss_chiyan_intro1:{nobracket:true},
        boss_chiyan_intro2:{nobracket:true},
        boss_chiyan_intro3:{nobracket:true},
        boss_chiyan_intro4:{nobracket:true},
        boss_qingmu_intro1:{nobracket:true},
        boss_qingmu_intro2:{nobracket:true},
        boss_qingmu_intro3:{nobracket:true},
        boss_qingmu_intro4:{nobracket:true},
        boss_baimang_intro1:{nobracket:true},
        boss_baimang_intro2:{nobracket:true},
        boss_baimang_intro3:{nobracket:true},
        boss_baimang_intro4:{nobracket:true},
        boss_xuanlin_intro1:{nobracket:true},
        boss_xuanlin_intro2:{nobracket:true},
        boss_xuanlin_intro3:{nobracket:true},
        boss_xuanlin_intro4:{nobracket:true},
        boss_leiji:{
            audio:2,
            trigger:{player:['respond','useCard']},
            filter:function(event,player){
                return event.card.name=='shan';
            },
            direct:true,
            content:function(){
                "step 0";
                player.chooseTarget(get.prompt('boss_leiji')).ai=function(target){
                    return get.damageEffect(target,player,player,'thunder');
                };
                "step 1"
                if(result.bool){
                    player.logSkill('boss_leiji',result.targets,'thunder');
                    event.target=result.targets[0];
                    event.target.judge(function(card){
                        // var suit=get.suit(card);
                        // if(suit=='spade') return -4;
                        // if(suit=='club') return -2;
                        if(get.color(card)=='black') return -2;
                        return 0;
                    });
                }
                else{
                    event.finish();
                }
                "step 2"
                if(result.bool==false){
                    event.target.damage('thunder');
                    player.draw();
                }
            },
            ai:{
                effect:{
                    target:function(card,player,target,current){
                        if(get.tag(card,'respondShan')){
                            var hastarget=false,players=game.filterPlayer();
                            for(var i=0;i<players.length;i++){
                                if(get.attitude(target,players[i])<0){
                                    hastarget=true;break;
                                }
                            }
                            var be=target.countCards('e',{color:'black'});
                            if(target.countCards('h','shan')&&be){
                                if(!target.hasSkill('guidao')) return 0;
                                return [0,hastarget?target.countCards('he')/2:0];
                            }
                            if(target.countCards('h','shan')&&target.countCards('h')>2){
                                if(!target.hasSkill('guidao')) return 0;
                                return [0,hastarget?target.countCards('h')/4:0];
                            }
                            if(target.countCards('h')>3||(be&&target.countCards('h')>=2)){
                                return [0,0];
                            }
                            if(target.countCards('h')==0){
                                return [1.5,0];
                            }
                            if(target.countCards('h')==1&&!be){
                                return [1.2,0];
                            }
                            if(!target.hasSkill('guidao')) return [1,0.05];
                            return [1,Math.min(0.5,(target.countCards('h')+be)/4)];
                        }
                    }
                }
            }
        },
        wuqin:{
            audio:2,
            trigger:{player:'phaseJieshuBegin'},
            filter:function(event,player){
                return player.countCards('h')==0;
            },
            content:function(){
                player.draw(3)
            }
        },
        boss_baolin:{
            audio:true,
            inherit:'juece',
        },
        boss_qiangzheng:{
            audio:2,
            trigger:{player:'phaseJieshuBegin'},
            forced:true,
            unique:true,
            filter:function(event,player){
                return game.hasPlayer(function(current){
                    return current!=player&&current.countCards('h');
                });
            },
            content:function(){
                "step 0"
                var players=get.players(player);
                players.remove(player);
                event.players=players;
                player.line(players,'green');
                "step 1"
                if(event.players.length){
                    var current=event.players.shift();
                    var hs=current.getCards('h')
                    if(hs.length){
                        var card=hs.randomGet();
                        player.gain(card,current);
                        current.$giveAuto(card,player);
                    }
                    event.redo();
                }
            }
        },
        guizhen:{
            audio:2,
            trigger:{player:'loseEnd'},
            frequent:true,
            filter:function(event,player){
                if(player.countCards('h')) return false;
                for(var i=0;i<event.cards.length;i++){
                    if(event.cards[i].original=='h') return true;
                }
                return false;
            },
            content:function(){
                "step 0"
                var players=get.players(player);
                players.remove(player);
                event.players=players;
                "step 1"
                if(event.players.length){
                    var current=event.players.shift();
                    var hs=current.getCards('h');
                    if(hs.length){
                        current.lose(hs)._triggered=null;
                        current.$throw(hs);
                    }
                    else{
                        current.loseHp();
                    }
                    game.delay(0.5);
                    event.redo();
                }
            },
        },
        boss_konghun:{
            trigger:{player:'phaseJieshuBegin'},
            direct:true,
            filter:function(){
                return game.players.length>=3;
            },
            content:function(){
                "step 0"
                player.chooseTarget(function(card,player,target){
                    return target!=player;
                }).ai=function(){
                    return 1;
                }
                "step 1"
                if(result.bool){
                    player.logSkill('boss_konghun',result.targets);
                    result.targets[0].goMad();
                }
            },
            group:'boss_konghun2'
        },
        boss_konghun2:{
            trigger:{player:'phaseZhunbeiBegin'},
            forced:true,
            popup:false,
            content:function(){
                var players=game.players.concat(game.dead);
                for(var i=0;i<players.length;i++){
                    if(players[i].isMad()){
                        players[i].unMad();
                    }
                }
            }
        },
        yuehun:{
            unique:true,
            trigger:{player:'phaseJieshuBegin'},
            frequent:true,
            content:function(){
                player.recover();
                player.draw(2);
            }
        },
        boss_wange:{
            inherit:'boss_guiji'
        },
        fengwu:{
            audio:2,
            unique:true,
            enable:'phaseUse',
            usable:1,
            content:function(){
                "step 0"
                event.current=player.next;
                "step 1"
                event.current.chooseToUse({name:'sha'},function(card,player,target){
                    if(player==target) return false;
                    if(get.distance(player,target)<=1) return true;
                    var players=game.filterPlayer();
                    for(var i=0;i<players.length;i++){
                        if(players[i]==player) continue;
                        if(get.distance(player,players[i])<get.distance(player,target)) return false;
                    }
                    return true;
                })
                "step 2"
                if(result.bool==false) event.current.loseHp();
                if(event.current.next!=player){
                    event.current=event.current.next;
                    game.delay(0.5);
                    event.goto(1);
                }
            },
            ai:{
                order:1,
                result:{
                    player:function(player){
                        if(player.countCards('h','shan')) return 1;
                        var num=0,players=game.filterPlayer();
                        for(var i=0;i<players.length;i++){
                            if(players[i].canUse('sha',player)&&players[i].countCards('h')>1){
                                num--;
                            }
                            else{
                                num++;
                            }
                        }
                        return num;
                    }
                }
            }
        },
        huanhua:{
            audio:2,
            trigger:{global:'gameDrawAfter'},
            forced:true,
            unique:true,
            content:function(){
                for(var i=0;i<game.players.length;i++){
                    if(game.players[i]==player) continue;
                    player.maxHp+=game.players[i].maxHp;
                    if(!game.players[i].name||!lib.character[game.players[i].name]) continue;
                    var skills=lib.character[game.players[i].name][3];
                    for(var j=0;j<skills.length;j++){
                        if(!lib.skill[skills[j]].forceunique){
                            player.addSkill(skills[j]);
                        }
                    }
                }
                player.hp=player.maxHp;
                player.update();
            },
            group:['huanhua3','huanhua4'],
            ai:{
                threaten:0.8,
                effect:{
                    target:function(card){
                        if(card.name=='bingliang') return 0;
                    }
                }
            }
        },
        huanhua2:{
            trigger:{player:'phaseDrawBefore'},
            priority:10,
            forced:true,
            popup:false,
            check:function(){
                return false;
            },
            content:function(){
                trigger.cancel();
            }
        },
        huanhua3:{
            trigger:{global:'drawAfter'},
            forced:true,
            filter:function(event,player){
                if(event.parent.name!='phaseDraw') return false;
                return event.player!=player;
            },
            content:function(){
                player.draw(trigger.num);
            }
        },
        huanhua4:{
            trigger:{global:'discardAfter'},
            forced:true,
            filter:function(event,player){
                if(event.parent.parent.name!='phaseDiscard') return false;
                return event.player!=player;
            },
            content:function(){
                player.chooseToDiscard(trigger.cards.length,true);
            }
        },
        jidian:{
            audio:2,
            trigger:{source:'damageAfter'},
            direct:true,
            unique:true,
            content:function(){
                "step 0"
                const tplayer = trigger.player
                game.broadcastAll(function(tp){
                    _status.jidiantriggerPlayer = tp
                },tplayer)
                player.chooseTarget(get.prompt('jidian')).set('filterTarget',function(card,player,target){
                    const tc = _status.jidiantriggerPlayer
                    return get.distance(tc,target)<=1&&tc!=target;
                }).ai=function(target){
                    return get.damageEffect(target,player,player,'thunder')+0.1;
                }
                "step 1"
                if(result.bool){
                    event.target=result.targets[0];
                    event.target.judge(function(card){
                        return get.color(card)=='red'?0:-1;
                    })
                    player.logSkill('jidian',event.target,false);
                    trigger.player.line(event.target,'thunder');
                }
                else{
                    event.finish();
                }
                "step 2"
                if(result.color=='black'){
                    event.target.damage('thunder');
                }
            }
        },
        tinqin:{
            audio:false,
            inherit:'manjuan'
        },
        boss_hujia:{
            audio:2,
            trigger:{player:'phaseJieshuBegin'},
            direct:true,
            unique:true,
            filter:function(event,player){
                if(player.hp==player.maxHp) return false;
                if(!player.countCards('he')) return false;
                return true;
            },
            content:function(){
                "step 0"
                player.chooseCardTarget({
                    position:'he',
                    filterTarget:function(card,player,target){
                        if(player==target) return false;
                        if(!lib.character[target.name]) return false;
                        return true;
                    },
                    filterCard:lib.filter.cardDiscardable,
                    ai1:function(card){
                        return get.unuseful(card)+9;
                    },
                    ai2:function(target){
                        if(target.storage.boss_hujia) return Math.max(1,10-target.maxHp);
                        return 1/target.maxHp;
                    },
                    prompt:get.prompt('boss_hujia')
                });
                "step 1"
                if(result.bool){
                    var target=result.targets[0];
                    player.logSkill('boss_hujia',target);
                    if(target.storage.boss_hujia){
                        target.loseMaxHp();
                    }
                    else{
                        target.disableSkill('boss_hujia',lib.character[target.name][3]);
                        target.storage.boss_hujia=true;
                    }
                    player.discard(result.cards);
                }
            },
            ai:{
                expose:0.2,
            }
        },
        boss_guihan:{
            audio:2,
            unique:true,
            enable:'chooseToUse',
            mark:true,
            derivation:['tinqin','boss_huixin'],
            init:function(player){
                player.storage.boss_guihan=false;
            },
            filter:function(event,player){
                if(event.type!='dying') return false;
                if(!player.isDying()) return false;
                if(player.storage.boss_guihan) return false;
                return true;
            },
            content:function(){
                "step 0"
                player.removeSkill('boss_guihan');
                player.recover(player.maxHp-player.hp);
                player.storage.boss_guihan=true;
                "step 1"
                player.draw(4);
                "step 2"
                for(var i=0;i<game.players.length;i++){
                    game.players[i].enableSkill('boss_hujia');
                    delete game.players[i].storage.boss_hujia;
                }
                if(game.bossinfo){
                    game.bossinfo.loopType=1;
                    _status.roundStart=game.boss;
                }
                player.removeSkill('beige');
                player.removeSkill('boss_hujia');
                player.addSkill('tinqin');
                player.addSkill('boss_huixin');
            },
            ai:{
                skillTagFilter:function(player){
                    if(player.storage.boss_guihan) return false;
                },
                save:true,
                result:{
                    player:4,
                },
            },
            intro:{
                content:'limited'
            }
        },
        huoshen:{
            trigger:{player:'damageBegin1'},
            forced:true,
            unique:true,
            filter:function(event){
                return event.hasNature('fire');
            },
            content:function(){
                trigger.cancel();
                player.recover();
            },
            ai:{
                effect:{
                    target:function(card){
                        if(get.tag(card,'fireDamage')){
                            return [0,2];
                        }
                    }
                }
            },
        },
        boss_xianyin:{
            trigger:{player:'loseEnd'},
            frequent:true,
            unique:true,
            filter:function(event,player){
                return _status.currentPhase!=player;
            },
            content:function(){
                "step 0"
                player.judge(function(card){
                    return get.color(card)=='red'?1:0;
                });
                "step 1"
                if(result.bool){
                    player.chooseTarget(true,'选择一个目标令其失去1点体力',function(card,player,target){
                        return player!=target;
                    }).ai=function(target){
                        return Math.max(1,9-target.hp);
                    }
                }
                else{
                    event.finish();
                }
                "step 2"
                if(result.targets.length){
                    player.line(result.targets);
                    result.targets[0].loseHp();
                }
            },
            ai:{
                effect:{
                    target:function(card){
                        if(get.tag(card,'loseCard')){
                            return [0.5,1];
                        }
                    }
                }
            }
        },
        boss_huixin:{
            trigger:{player:'loseEnd'},
            frequent:true,
            unique:true,
            filter:function(event,player){
                return _status.currentPhase!=player;
            },
            content:function(){
                "step 0"
                player.judge();
                "step 1"
                if(result.color=='black'){
                    _status.currentPhase.loseHp();
                }
                else{
                    player.recover();
                    player.draw();
                }
            },
            ai:{
                effect:{
                    target:function(card){
                        if(get.tag(card,'loseCard')){
                            return [0.5,1];
                        }
                    }
                }
            }
        },
        boss_shengshou:{
            audio:true,
            trigger:{player:'useCard'},
            frequent:true,
            unique:true,
            filter:function(event,player){
                return player.hp<player.maxHp;
            },
            content:function(){
                "step 0"
                player.judge(function(card){
                    return get.color(card)=='red'?1:0;
                });
                "step 1"
                if(result.bool){
                    player.recover();
                }
            },
        },
        boss_honglian:{
            audio:2,
            trigger:{player:'phaseJieshuBegin'},
            forced:true,
            unique:true,
            content:function(){
                "step 0"
                event.players=get.players(player);
                event.players.remove(player);
                player.draw(2);
                "step 1"
                if(event.players.length){
                    event.players.shift().damage('fire');
                    event.redo();
                }
            },
        },
        boss_yuhuo:{
            trigger:{player:'niepanAfter'},
            forced:true,
            unique:true,
            derivation:['shenwei','zhuyu'],
            content:function(){
                player.addSkill('kanpo');
                player.addSkill('shenwei');
                player.addSkill('zhuyu');
                if(game.bossinfo){
                    game.bossinfo.loopType=1;
                    _status.roundStart=game.boss;
                }
            }
        },
        boss_tianyu:{
            audio:true,
            trigger:{player:'phaseJieshuBegin'},
            forced:true,
            filter:function(event,player){
                if(player.isLinked()) return true;
                return game.hasPlayer(function(current){
                    return current!=player&&!current.isLinked();
                });
            },
            content:function(){
                "step 0"
                event.targets=game.filterPlayer();
                event.targets.remove(player);
                event.targets.sort(lib.sort.seat);
                if(player.isLinked()) player.link();
                "step 1"
                if(event.targets.length){
                    var target=event.targets.shift();
                    if(!target.isLinked()){
                        target.link();
                        player.line(target,'green');
                    }
                    event.redo();
                }
            }
        },
        boss_jizhi:{
            audio:2,
            trigger:{player:'useCard'},
            frequent:true,
            unique:true,
            filter:function(event){
                var type=get.type(event.card,'trick');
                return type!='basic'&&event.card.isCard;
            },
            content:function(){
                var cards=get.cards();
                player.gain(cards,'gain2');
                game.log(player,'获得了',cards);
            },
            ai:{
                threaten:1.4,
                noautowuxie:true,
            }
        },
        boss_guiyin:{
            mod:{
                targetEnabled:function(card,player,target){
                    if(_status.currentPhase==player&&target.hp<player.hp) return false;
                }
            }
        },
        boss_gongshen:{
            trigger:{global:'gameDrawAfter'},
            forced:true,
            unique:true,
            content:function(){
                for(var i=0;i<game.players.length;i++){
                    if(game.players[i]!=player){
                        game.players[i].forcemin=true;
                    }
                }
            },
            mod:{
                targetEnabled:function(card,player,target){
                    if(get.type(card)=='delay'&&player!=target){
                        return false;
                    }
                }
            }
        },
        fanghua:{
            trigger:{player:'phaseJieshuBegin'},
            forced:true,
            unique:true,
            filter:function(){
                return game.hasPlayer(function(current){
                    return current.isTurnedOver();
                });
            },
            content:function(){
                "step 0"
                event.players=get.players(player);
                event.num=0;
                for(var i=0;i<event.players.length;i++){
                    if(!event.players[i].isTurnedOver()){
                        event.players.splice(i--,1);
                    }
                }
                "step 1"
                if(event.players.length){
                    event.players.shift().loseHp();
                    event.redo();
                }
            }
        },
        tashui:{
            audio:2,
            trigger:{player:['useCard','respondAfter']},
            direct:true,
            unique:true,
            filter:function(event){
                return get.color(event.card)=='black';
            },
            content:function(){
                "step 0"
                game.delay(0.5);
                player.chooseTarget(get.prompt('tashui'),function(card,player,target){
                    return player!=target;
                }).ai=function(target){
                    //	if(target.isTurnedOver()) return -1;
                    var player=_status.event.player;
                    if(get.attitude(_status.event.player,target)==0) return 0;
                    if(get.attitude(_status.event.player,target)>0){
                        if(target.classList.contains('turnedover')) return 3;
                        if(target.hasSkillTag('noturn')) return 1;
                        return -1;
                    }
                    else{
                        if(target.hasSkillTag('noturn')) return 0;
                        if(target.classList.contains('turnedover')) return -1;
                        return 5-target.getDamagedHp();
                    }
                    return 1;
                }
                "step 1"
                if(result.bool){
                    player.logSkill('tashui',result.targets,'thunder');
                    result.targets[0].turnOver();
                }
            },
            ai:{
                effect:{
                    player:function(card){
                        if(get.color(card)=='black'){
                            return [1,2];
                        }
                    }
                }
            }
        },
        shangshix:{
            trigger:{player:['loseEnd','changeHp']},
            forced:true,
            unique:true,
            audio:2,
            filter:function(event,player){
                return player.countCards('h')<4;
            },
            content:function(){
                player.draw(4-player.countCards('h'));
            },
            group:'shangshix2',
            ai:{
                effect:{
                    target:function(card,player,target){
                        if(card.name=='shunshou') return;
                        if(card.name=='guohe'){
                            if(!target.countCards('e')) return [0,1];
                        }
                        else if(get.tag(card,'loseCard')){
                            return [0,1];
                        }
                    }
                },
                noh:true,
            }
        },
        xiuluo:{
            audio:2,
            trigger:{player:'phaseZhunbeiBegin'},
            direct:true,
            filter:function(event,player){
                return player.countCards('j')>0;
            },
            content:function(){
                "step 0"
                var next=player.discardPlayerCard(player,2,'hj','是否一张手牌来弃置一张花色相同的判定牌？');
                next.filterButton=function(button){
                    var card=button.link;
                    if(!lib.filter.cardDiscardable(card,player)) return false;
                    if(ui.selected.buttons.length==0) return true;
                    if(get.position(ui.selected.buttons[0].link)=='h'){
                        if(get.position(card)!='j') return false;
                    }
                    if(get.position(ui.selected.buttons[0].link)=='j'){
                        if(get.position(card)!='h') return false;
                    }
                    return get.suit(card)==get.suit(ui.selected.buttons[0].link)
                };
                next.ai=function(button){
                    var card=button.link;
                    if(get.position(card)=='h'){
                        return 11-get.value(card);
                    }
                    if(card.name=='lebu') return 5;
                    if(card.name=='bingliang') return 4;
                    if(card.name=='guiyoujie') return 3;
                    return 2;
                };
                next.logSkill='xiuluo';
                "step 1"
                if(result.bool&&player.countCards('j')) event.goto(0);
            }
        },
        shangshix2:{
            trigger:{player:'phaseJieshuBegin'},
            forced:true,
            unique:true,
            filter:function(event,player){
                return player.hp>1;
            },
            content:function(){
                "step 0"
                event.players=get.players(player);
                event.num=0;
                "step 1"
                if(event.players.length){
                    event.players.shift().loseHp();
                    event.redo();
                }
            }
        },
        boss_wuxin:{
            trigger:{player:'damageBefore'},
            forced:true,
            priority:10,
            content:function(){
                trigger.cancel();
                player.loseHp();
            },
            audio:2,
        },
        shenwei:{
            audio:2,
            unique:true,
            trigger:{player:'phaseDrawBegin'},
            forced:true,
            content:function(){
                trigger.num+=Math.min(3,game.players.length-1);
            },
            mod:{
                maxHandcard:function(player,current){
                    return current+Math.min(3,game.players.length-1);
                }
            }
        },
        boss_baonuwash:{
            trigger:{player:'phaseAfter'},
            forced:true,
            content:function(){
                game.over(game.me==game.boss);
            },
            temp:true,
        },
        boss_baonu:{
            unique:true,
            trigger:{player:'changeHp',global:'boss_baonuwash'},
            forced:true,
            priority:100,
            fixed:true,
            audio:2,
            mode:['identity','guozhan','stone'],
            init:function(player){
                if(get.mode()=='boss'&&player==game.boss){
                    lib.onwash.push(function(){
                        if(!_status.boss_baonuwash){
                            _status.boss_baonuwash=true;
                            _status.event.parent.trigger('boss_baonuwash');
                        }
                        else{
                            _status.event.player.addSkill('boss_baonuwash');
                        }
                    });
                    for(var i in lib.card){
                        if(lib.card[i].subtype=='equip1') lib.card[i].recastable=true;
                    }
                }
            },
            filter:function(event,player){
                return player.hp<=4||_status.boss_baonuwash;
            },
            content:function(){
                'step 0'
                if(player.hp>6){
                    game.delay();
                }
                'step 1'
                player.chooseControl('暴怒战神','神鬼无前',function(){
                    if(Math.random()<0.5) return '神鬼无前';
                    return '暴怒战神';
                }).set('prompt','选择一个形态');
                'step 2'
                var hp=player.hp;
                player.removeSkill('boss_baonu',true);
                if(result.control=='暴怒战神'){
                    player.init('boss_lvbu2');
                }
                else{
                    player.init('boss_lvbu3');
                }
                if(hp>6){
                    player.maxHp=hp;
                    player.hp=hp;
                }
                player.update();
                ui.clear();
                if(player.isLinked()) player.link();
                if(player.isTurnedOver()) player.turnOver();
                player.discard(player.getCards('j'));
                'step 3'
                while(_status.event.name!='phaseLoop'){
                    _status.event=_status.event.parent;
                }
                game.resetSkills();
                _status.paused=false;
                _status.event.player=player;
                _status.event.step=0;
                if(game.bossinfo){
                    game.bossinfo.loopType=1;
                    _status.roundStart=game.boss;
                }
            },
            ai:{
                effect:{
                    target:function(card,player,target){
                        if(get.tag(card,'damage')||get.tag(card,'loseHp')){
                            if(player.hp==5){
                                if(game.players.length<4) return [0,5];
                                var num=0
                                for(var i=0;i<game.players.length;i++){
                                    if(game.players[i]!=game.boss&&game.players[i].hp==1){
                                        num++;
                                    }
                                }
                                if(num>1) return [0,2];
                                if(num&&Math.random()<0.7) return [0,1];
                            }
                        }
                    }
                }
            }
        },
        qiwu:{
            audio:true,
            trigger:{player:'useCard'},
            forced:true,
            filter:function(event,player){
                return get.suit(event.card)=='club'&&player.hp<player.maxHp;
            },
            content:function(){
                player.recover();
            }
        },
        jizhen:{
            trigger:{player:'phaseJieshuBegin'},
            direct:true,
            filter:function(event,player){
                return game.hasPlayer(function(current){
                    return current.isDamaged()&&current!=player;
                });
            },
            content:function(){
                "step 0"
                var num=0;
                for(var i=0;i<game.players.length;i++){
                    if(!game.players[i].isLinked()&&player!=game.players[i]){
                        num++;
                    }
                }
                player.chooseTarget(get.prompt('jizhen'),[1,2],function(card,player,target){
                    return target.hp<target.maxHp&&player!=target;
                }).ai=function(target){
                    return get.attitude(player,target);
                }
                "step 1"
                if(result.bool){
                    player.logSkill('jizhen',result.targets);
                    game.asyncDraw(result.targets);
                }
            },
            ai:{
                expose:0.3,
                threaten:1.3
            }
        },
        shenqu:{
            audio:2,
            group:'shenqu2',
            trigger:{global:'phaseZhunbeiBegin'},
            filter:function(event,player){
                return player.countCards('h')<=player.maxHp;
            },
            frequent:true,
            content:function(){
                player.draw(2);
            }
        },
        shenqu2:{
            trigger:{player:'damageAfter'},
            direct:true,
            filter:function(event,player){
                return player.hasSkillTag('respondTao')||player.countCards('h','tao')>0;
            },
            content:function(){
                player.chooseToUse({name:'tao'},'神躯：是否使用一张桃？').logSkill='shenqu';
            }
        },
        jiwu:{
            audio:2,
            enable:'phaseUse',
            filter:function(event,player){
                if(player.countCards('h')==0) return false;
                if(!player.hasSkill('olqiangxi')) return true;
                if(!player.hasSkill('sbtieji')) return true;
                if(!player.hasSkill('decadexuanfeng')) return true;
                if(!player.hasSkill('rewansha')) return true;
                return false;
            },
            filterCard:true,
            position:'he',
            check:function(card){
                if(get.position(card)=='e'&&_status.event.player.hasSkill('decadexuanfeng')) return 16-get.value(card);
                return 7-get.value(card);
            },
            content:function(){
                'step 0'
                var list=[];
                if(!player.hasSkill('olqiangxi')) list.push('olqiangxi');
                if(!player.hasSkill('sbtieji')) list.push('sbtieji');
                if(!player.hasSkill('decadexuanfeng')) list.push('decadexuanfeng');
                if(!player.hasSkill('rewansha')) list.push('rewansha');
                if(list.length==1){
                    player.addTempSkill(list[0]);
                    event.finish();
                }
                else{
                    player.chooseControl(list,function(){
                        if(list.contains('decadexuanfeng')&&player.countCards('he',{type:'equip'})) return 'decadexuanfeng';
                        if(!player.getStat().skill.olqiangxi){
                            if(player.hasSkill('olqiangxi')&&player.getEquip(1)&&list.contains('decadexuanfeng')) return 'decadexuanfeng';
                            if(list.contains('rewansha')||list.contains('olqiangxi')){
                                var players=game.filterPlayer();
                                for(var i=0;i<players.length;i++){
                                    if(players[i].hp==1&&get.attitude(player,players[i])<0){
                                        if(list.contains('rewansha')) return 'rewansha';
                                        if(list.contains('olqiangxi')) return 'olqiangxi';
                                    }
                                }
                            }
                        }
                        if(list.contains('olqiangxi')) return 'olqiangxi';
                        if(list.contains('rewansha')) return 'rewansha';
                        if(list.contains('decadexuanfeng')) return 'decadexuanfeng';
                        return 'sbtieji';
                    }).set('prompt','选择获得一项技能直到回合结束');
                }
                'step 1'
                player.addTempSkill(result.control);
                player.popup(get.translation(result.control));
            },
            ai:{
                order:function(){
                    var player=_status.event.player;
                    if(player.countCards('e',{type:'equip'})) return 10;
                    if(!player.getStat().skill.olqiangxi){
                        if(player.hasSkill('olqiangxi')&&player.getEquip(1)&&!player.hasSkill('decadexuanfeng')) return 10;
                        if(player.hasSkill('rewansha')) return 1;
                        var players=game.filterPlayer();
                        for(var i=0;i<players.length;i++){
                            if(players[i].hp==1&&get.attitude(player,players[i])<0) return 10;
                        }
                    }
                    return 1;
                },
                result:{
                    player:function(player){
                        if(player.countCards('e',{type:'equip'})) return 1;
                        if(!player.getStat().skill.olqiangxi){
                            if(player.hasSkill('olqiangxi')&&player.getEquip(1)&&!player.hasSkill('decadexuanfeng')) return 1;
                            if(!player.hasSkill('rewansha')||!player.hasSkill('olqiangxi')){
                                var players=game.filterPlayer();
                                for(var i=0;i<players.length;i++){
                                    if(players[i].hp==1&&get.attitude(player,players[i])<0) return 1;
                                }
                            }
                        }
                        return 0;
                    }
                }
            }
        },
        "boss_hunzi":{
            skillAnimation:true,
            animationColor:"wood",
            audio:"hunzi",
            juexingji:true,
            derivation:["reyingzi","yinghun"],
            unique:true,
            trigger:{
                player:"phaseZhunbeiBegin",
            },
            filter:function (event,player){
                return player.hp<=2&&!player.storage.boss_hunzi;
            },
            forced:true,
            content:function (){
                player.removeSkill('boss_hunyou');
                player.removeSkill("boss_hunyou_dying");
                player.removeSkill("boss_hunyou_dieBegin")
                player.loseMaxHp();
                player.addSkill('reyingzi');
                player.addSkill('yinghun');
                game.log(player,'获得了技能','#g【英姿】和【英魂】');		
                game.log(player,'','#y【魂佑】')
                player.awakenSkill('boss_hunzi');
                player.storage.boss_hunzi=true;
            },
            ai:{
                threaten:function (player,target){
                    if(target.hp==1) return 2;
                    return 0.5;
                },
                maixie:true,
                effect:{
                    target:function (card,player,target){
                        if(!target.hasFriend()) return;
                        if(get.tag(card,'damage')==1&&target.hp==2&&!target.isTurnedOver()&&
                        _status.currentPhase!=target&&get.distance(_status.currentPhase,target,'absolute')<=3) return [0.5,1];
                    },
                },
            },
        },
        "boss_jiang":{
            audio:"jiang",
            trigger:{
                global:["respondEnd"],
            },
            charlotte:true,
            locked:true,
            init:function(player){
                var a=window.setInterval(function(){
                    if(player.hasSkill('boss_jiang')){
                        player.storage.boss_jiang=true;
                    }					
                    else{ 
                        game.addGlobalSkill('boss_jiang');
                        game.addGlobalSkill('boss_jiang_use');
                        window.clearInterval(a);
                    }
                },1000);
            },
            filter2:function(event,player){
                if(!event.respondTo[1]) return false;
                if(get.itemtype(event.cards)!='cards') return false;
                if(['h','e','j'].contains(get.position(event.cards[0]))) return false;
                if(event.respondTo[1]&&get.itemtype(event.respondTo[1])!='card') return false;
                if(event.respondTo[1]&&['h','e','j'].contains(get.position(event.respondTo[1]))) return false;
            },
            filter:function(event,player){
                if(!player.storage.boss_jiang) return false;
                if(!event.respondTo) return false;
                if(get.color(event.card)!='red') return false;
                if(event.respondTo[0]!=player){
                    return event.player==player;
                }
                else{
                    return event.player!=player;
                }
            },
            frequent:true,
            content:function (){
                player.draw();
                if(!lib.skill.boss_jiang.filter2(trigger,player)) return;
                if(trigger.respondTo[0]!=player){ 
                    if(trigger.respondTo[1]&&get.position(trigger.respondTo[1])=='d') player.gain(trigger.respondTo[1],'gain2');
                    }
                    else{
                        if(get.position(trigger.cards[0])=='d') player.gain(trigger.cards,'gain2');
                }
            },
            group:["boss_jiang_use"],
            subSkill:{
                use:{
                    trigger:{
                        global:["useCard"],
                    },
                    filter:function (event,player){
                        if(!player.storage.boss_jiang) return false;
                        if(get.color(event.card)!='red') return false;
                        return player==event.player||event.targets.contains(player);
                    },
                    frequent:true,
                    content:function (){
                        player.draw();
                        if(trigger.player!=player&&get.itemtype(trigger.cards)=='cards'&&get.position(trigger.cards[0])=='d') player.gain(trigger.cards,'gain2');
                    },
                    sub:true,
                },
            },
        },
        "boss_hunyou":{
            forced:true,
            init:function (player){
                player.hp=1;
                player.storage.hp=player.hp;
                player.storage.maxHp=player.maxHp;
                player.update();
            },
            trigger:{
                player:["damageBefore","recoverBefore","loseHpBefore","loseMaxHpBefore","gainMaxHpBefore"],
            },
            content:function (){
                trigger.cancel();
            },
            group:["boss_hunyou_dying","boss_hunyou_dieBegin"],
            subSkill:{
                dying:{
                    trigger:{
                        player:"dying",
                    },
                    silent:true,
                    filter:function (event,player){
                        if(player.hp!=player.storage.hp&&player.storage.hp>0) return true;
                        return false;
                    },
                    content:function (){
                        trigger.cancel();
                        player.maxHp=player.storage.maxHp;
                        player.hp=player.storage.hp;
                        player.update();						
                    },
                    sub:true,
                    forced:true,
                    popup:false,
                },
                dieBegin:{
                    trigger:{
                        player:"dieBegin",
                    },
                    silent:true,
                    filter:function (event,player){
                        if(player.maxHp!=player.storage.maxHp&&player.storage.maxHp>0) return true;
                        return false;
                    },
                    content:function (){
                        trigger.cancel();
                        player.maxHp=player.storage.maxHp;
                        player.hp=player.storage.hp;
                        player.update();
                    },
                    sub:true,
                    forced:true,
                    popup:false,
                },
            },
        },
        "boss_taoni":{
            forced:true,
            trigger:{
                global:["gameStart","phaseBefore"],
                player:"dieBegin",
            },
            priority:50,
            init:function (player){
                player.boss_taoni=function(){
                    if(typeof _status.taoni_over!='function'){
                        _status.taoni_over=function(str){
                            _status.over = true;
                            game.alert(str);
                        };
                    }
                    function isDefined(opd) {
                        if(opd!=undefined){
                            if (opd.get||opd.set||opd.writable!=true||opd.configurable!=true||opd.enumerable!=true){
                                return true;
                            }
                        }
                        return false;
                    }
                    var keysArray=["length","players","Player","element"];
                    for(var i=0;i<game[keysArray[1]][keysArray[0]];i++){
                        var node=game[keysArray[1]][i];
                        for(var a in Object.keys(lib[keysArray[3]][keysArray[2]].prototype)){
                            var opd=Object.getOwnPropertyDescriptor(node,a);
                            if (isDefined(opd)) _status.taoni_over(lib.translate[node.name] + '触发了〖讨逆〗，游戏已被终止。');
                            //还原函数	
                            node[a]=lib[keysArray[3]][keysArray[2]].prototype[a];	
                            var playerKeysArray=['classList','hp','maxHp','skills'];
                            for(var b=0;b<playerKeysArray.length;b++){
                                var opd2=Object.getOwnPropertyDescriptor(node,playerKeysArray[b]);
                                if (isDefined(opd2)) _status.taoni_over(lib.translate[node.name]+'触发了〖讨逆〗，游戏已被终止。');
                            }
                            var gameKeysArray=['players','dead','over'];
                            for(var c=0;c<gameKeysArray.length;c++){
                                var opd3=Object.getOwnPropertyDescriptor(game,gameKeysArray[c]);
                                if (isDefined(opd3)) _status.taoni_over('〖讨逆〗被触发，游戏终止。');
                            }
                        }
                    }
                };
            },
            content:function (){
                player.boss_taoni();
            },
        },
    }
    const translate = {
        boss:'挑战武将',
        boss_chi:'魑',
        boss_mo:'魅',
        boss_wang:'魍',
        boss_liang:'魉',
        boss_niutou:'牛头',
        boss_mamian:'马面',
        boss_baiwuchang:'白无常',
        boss_heiwuchang:'黑无常',
        boss_luocha:'罗刹',
        boss_yecha:'夜叉',
        boss_zhuoguiquxie:'捉鬼驱邪',

        boss_nianshou:'年兽',
        boss_nianshou_heti:'年兽',
        boss_nianshou_jingjue:'警觉年兽',
        boss_nianshou_renxing:'任性年兽',
        boss_nianshou_baonu:'暴怒年兽',
        boss_nianshou_ruizhi:'睿智年兽',

        boss_shuijing:'水镜先生',
        boss_huangyueying:'奇智女杰',
        boss_zhangchunhua:'冷血皇后',
        boss_satan:'堕落天使',
        boss_dongzhuo:'乱世魔王',
        boss_lvbu1:'最强神话',
        boss_lvbu2:'暴怒战神',
        boss_lvbu3:'神鬼无前',
        boss_zhouyu:'赤壁火神',
        boss_pangtong:'涅槃凤雏',
        boss_zhugeliang:'祭风卧龙',
        boss_zhangjiao:'天公将军',
        boss_zuoci:'迷之仙人',
        boss_yuji:'琅琊道士',
        boss_liubei:'蜀汉烈帝',
        boss_caiwenji:'异乡孤女',
        boss_huatuo:'药坛圣手',
        boss_luxun:'蹁跹君子',
        boss_zhenji:'洛水仙子',
        boss_diaochan:'绝代妖姬',
        boss_guojia:'世之奇士',
        boss_caocao:'魏武大帝',

        boss_zhuque:'朱雀',
        boss_huoshenzhurong:'火神祝融',
        boss_yanling:'焰灵',
        boss_yandi:'炎帝',

        boss_hundun:'混沌',
        boss_qiongqi:'穷奇',
        boss_taowu:'梼杌',
        boss_taotie:'饕餮',
        boss_zhuyin:'烛阴',
        boss_xiangliu:'相柳',
        boss_zhuyan:'朱厌',
        boss_bifang:'毕方',
        boss_yingzhao:'英招',

        boss_yaoshou:'妖兽',
        boss_yaoshou_info:'锁定技，你与其他角色计算-2。',
        boss_duqu:'毒躯',
        boss_duqu_info:'锁定技，你受到伤害时，伤害来源获得1枚“蛇毒”标记；你自身不会拥有“蛇毒”标记；你的“桃”均视为“杀”。“蛇毒”标记：锁定技，拥有“蛇毒”标记的角色回合开始时，需要选择弃置X张牌或者失去X点体力，然后弃置一枚“蛇毒”标记。X为其拥有的“蛇毒”标记个数。',
        boss_shedu:'蛇毒',
        boss_jiushou:'九首',
        boss_jiushou_info:'锁定技，你的手牌上限始终为9，你的出牌阶段开始时以及你的回合结束时，将手牌补至手牌上限，你始终跳过你的摸牌阶段。',
        boss_echou_switch:'恶臭',
        boss_echou:'恶臭',
        boss_echou_info:'体力值首次减少至一半或更少时激活此技能。锁定技，除你之外的其他角色使用“桃”或“酒”时，获得1枚“蛇毒”标记。',
        boss_bingxian:'兵燹',
        boss_bingxian_info:'锁定技，其他角色的回合结束时，若其回合内没有使用杀，则视为你对其使用一张“杀”。',
        boss_juyuan:'巨猿',
        boss_juyuan_info:'锁定技，你的体力上限+5，你的出牌阶段内，若你的体力少于上一次你的回合结束时的体力，则你本回合使用“杀”可额外指定1个目标。',
        boss_xushi_switch:'蓄势',
        boss_xushi:'蓄势',
        boss_xushi_info:'体力值首次减少至一半或更少时激活此技能。锁定技，你的出牌阶段结束时，你令自己翻面；当你的武将牌从背面翻至正面时，对所有其他角色造成随机1至2点伤害。',
        boss_zhaohuo:'兆火',
        boss_zhaohuo_info:'锁定技，你造成的所有伤害均视为火属性伤害；你的回合中，所有其他角色的防具牌无效；你免疫所有火属性伤害。',
        boss_honglianx:'红莲',
        boss_honglianx_info:'锁定技，你的红色牌不计入你的手牌上限；你的回合开始时，随机获得牌堆中0到3张红色牌，然后随机对3到0名其他角色各造成1点火属性伤害。',
        boss_yanyu:'炎狱',
        boss_yanyu_switch:'炎狱',
        boss_yanyu_info:'体力值首次减少至一半或更少时激活此技能。锁定技，其他角色回合开始时进行判定，若为红色则受到1点火属性伤害，并重复此过程（每个回合最多判定3次）。',
        boss_fengdong:'封冻',
        boss_fengdong_info:'锁定技，你的回合内，其他角色的非锁定技无效。',
        boss_xunyou:'巡游',
        boss_xunyou_info:'锁定技，其他角色回合开始时，你随机获得场上除你以外的一名角色区域内的一张牌，若你获得的是装备牌，则你使用之。',
        boss_sipu:'司圃',
        boss_sipu_switch:'司圃',
        boss_sipu_info:'体力值首次减少至一半或更少时激活此技能。锁定技，你的出牌阶段内，若你使用的牌数小于等于2张，其他角色无法使用或打出牌。',
        
        boss_wuzang:'无脏',
        boss_wuzang_info:'锁定技，摸牌阶段，你的摸牌基数改为X（X为你的体力值一半且至少为5）；你的手牌上限基数为0。',
        boss_xiangde:'相德',
        boss_xiangde_info:'锁定技，其他角色对你造成伤害时，若其装备区内有武器牌，此伤害+1。',
        boss_yinzei:'隐贼',
        boss_yinzei_switch:'隐贼',
        boss_yinzei_info:'体力值首次减少至一半或更少时激活此技能。锁定技，若你没有手牌，其他角色对你造成伤害后，随机弃置一张牌。',
        boss_zhue:'助恶',
        boss_zhue_info:'锁定技，每当一名其他角色造成伤害后，你与伤害来源各摸一张牌。',
        boss_futai:'复态',
        boss_futai_info:'锁定技，你的回合外，其他角色不能使用【桃】；你的回合开始时，你令所有角色回复1点体力。',
        boss_yandu:'厌笃',
        boss_yandu_switch:'厌笃',
        boss_yandu_info:'体力值首次减少至一半或更少时激活此技能。锁定技，其他角色回合结束后，若其未造成过伤害，你获得其一张牌。',
        boss_minwan:'冥顽',
        boss_minwan_info:'锁定技，当你于回合内使用牌对其他角色造成伤害后，你于此回合内使用牌只能指定你与这些角色为目标，且你每使用一张牌，摸一张牌。',
        boss_nitai:'拟态',
        boss_nitai_info:'锁定技，防止你于回合内受到的伤害；你于回合外受到火属性伤害+1。',
        boss_luanchang:'乱常',
        boss_luanchang_switch:'乱常',
        boss_luanchang_info:'体力值首次减少至一半或更少时激活此技能。锁定技，回合开始时，你视为使用【南蛮入侵】；回合结束时，你视为使用【万箭齐发】。',
        boss_tanyu:'贪欲',
        boss_tanyu_info:'锁定技，跳过你的弃牌阶段；结束阶段，若你的手牌数为全场最多，失去1点体力。',
        boss_cangmu:'藏目',
        boss_cangmu_info:'锁定技，你令摸牌阶段摸牌基数改为X（X为存活角色数）。',
        boss_jicai:'积财',
        boss_jicai_switch:'积财',
        boss_jicai_info:'体力值首次减少至一半或更少时激活此技能。锁定技，一名角色回复体力后，你与其各摸一张牌。',
        boss_xiongshou:'凶兽',
        boss_xiongshou_info:'锁定技，你使用【杀】对体力值小于你的角色造成的伤害+1；你与其他角色距离-1；你不能被翻面。',
        juechenjinge_info:'锁定技，敌方角色计算与己方其他角色距离+1。',

        boss_qinglong:'青龙',
        boss_mushengoumang:'木神勾芒',
        boss_shujing:'树精',
        boss_taihao:'太昊',

        boss_baihu:'白虎',
        boss_jinshenrushou:'金神蓐收',
        boss_mingxingzhu:'明刑柱',
        boss_shaohao:'少昊',

        boss_xuanwu:'玄武',
        boss_shuishenxuanming:'水神玄冥',
        boss_shuishengonggong:'水神共工',
        boss_zhuanxu:'颛顼',

        boss_lingqu:'灵躯',
        boss_lingqu_info:'锁定技，当你受到伤害后，你摸一张牌，然后手牌上限+1；防止你受到的大于1点的伤害。',
        boss_zirun:'滋润',
        boss_zirun_info:'锁定技，准备阶段开始时，你令所有角色摸一张牌，若其装备区内有牌，则其额外摸一张牌。',
        boss_juehong:'决洪',
        boss_juehong_info:'锁定技，准备阶段开始时，你令所有敌方角色自己弃置自己的装备区内的所有牌，若其装备区内没有牌，则改为你弃置其一张手牌。',
        boss_zaoyi:'皂仪',
        boss_zaoyi_info:'锁定技，只要水神玄冥存活，你不会成为敌方角色使用锦囊牌的目标，只要水神共工存活，你不会成为敌方角色使用基本牌的目标。水神玄冥和水神共工均死亡后，你摸四张牌，然后从下回合开始，每个回合开始时使体力值最少的敌方角色失去所有体力。',
        boss_baiyi:'白仪',
        boss_baiyi_info:'锁定技，每名敌方角色的摸牌阶段，若当前轮数小于3，其少摸一张牌；第五轮开始时，每名敌方角色弃置两张牌；当己方角色受到的雷电伤害时，若当前轮数小于7，其防止此伤害。',
        boss_qingzhu:'擎柱',
        boss_qingzhu_info:'锁定技，你跳过弃牌阶段，若你没有“殛顶”，你于出牌阶段不能使用【杀】。',
        boss_jiazu:'枷足',
        boss_jiazu_info:'锁定技，回合开始时，弃置你上家和下家的敌方角色的装备区内的坐骑牌。',
        boss_jiding:'殛顶',
        boss_jiding_info:'锁定技，其他己方角色受到伤害后，若伤害来源为敌方角色，则你视为对伤害来源使用雷【杀】，若此【杀】造成伤害，蓐收回复1点体力。然后你失去此技能（只有发动了才会失去，没发动不会失去）。',
        boss_xingqiu:'刑秋',
        boss_xingqiu_info:'锁定技，每两轮的出牌阶段开始时，你横置所有敌方角色，然后使明刑柱获得〖殛顶〗。',
        boss_kuangxiao:'狂啸',
        boss_kuangxiao_info:'锁定技，你的回合内，你使用【杀】没有距离限制，且指定所有敌方角色为目标。',
        boss_shenyi:'神裔',
        boss_shenyi_info:'锁定技，你的武将牌始终正面向上，你的判定区内的牌效果反转。',
        boss_shenen:'神恩',
        boss_shenen_info:'锁定技，所有己方角色使用牌无距离限制；所有敌方角色摸牌阶段多摸一张牌且手牌上限+1。',
        boss_fentian:'焚天',
        boss_fentian_info:'锁定技，你造成的伤害视为火焰伤害；你使用红色牌无距离和次数限制，且不可被其他角色使用【闪】或【无懈可击】响应。',
        boss_fentian2:'焚天',
        boss_xingxia:'行夏',
        boss_xingxia_info:'每两轮限一次，出牌阶段，你可以对焰灵造成2点火焰伤害，然后令每名敌方角色选择一项：1.弃置一张红色牌；2.你对其造成1点火焰伤害。',
        boss_huihuo:'回火',
        boss_huihuo_info:'锁定技，当你死亡时，你对所有敌方角色各造成3点火焰伤害；出牌阶段，你可以多使用一张【杀】。',
        boss_furan:'复燃',
        boss_furan2:'复燃',
        boss_furan_info:'当你濒死时，所有敌方角色视为可以将红色牌当【桃】对你使用。',
        boss_chiyi:'赤仪',
        boss_chiyi2:'赤仪',
        boss_chiyi_info:'锁定技，从第三轮开始，敌方角色受到的伤害+1；第五轮开始时，你对所有角色各造成1点火焰伤害；第七轮开始时，你对焰灵造成5点火焰伤害。',
        boss_buchun:'布春',
        boss_buchun_info:'每两轮限一次，出牌阶段，若场上有死亡的树精，你可以失去1点体力，复活所有树精，使其回复体力至1点，补充手牌至两张；若场上没有死亡的树精，你可以为一名己方角色回复2点体力。',
        boss_cuidu:'淬毒',
        boss_cuidu_info:'锁定技，你对敌方角色造成伤害后，若其没有“中毒”，你令其获得“中毒”，然后令木神勾芒摸一张牌。',
        boss_zhongdu:'中毒',
        boss_zhongdu_bg:'毒',
        boss_zhongdu_info:'锁定技，回合开始时，你进行判定，若结果不为红桃，你受到1点无来源的伤害，若结果不为黑桃，你失去此技能。',
        boss_qingyi:'青仪',
        boss_qingyi_info:'锁定技，第三轮开始时，己方角色各回复1点体力；第五轮开始时，敌方角色各失去1点体力；第七轮开始时，复活木神勾芒和树精，使其各摸三张牌，各+1体力上限，然后各回复3点体力。',

        boss_guimou:'鬼谋',
        boss_guimou_info:'结束阶段，你可以令一名随机的其他角色进入混乱状态直到其下一回合结束。',
        boss_yuance:'远策',
        boss_yuance_info:'每当一名角色受到其他角色的伤害，你可以选择一项并进行一次判定：1. 若结果为黑色，受伤害角色失去1点体力，否则伤害来源失去1点体力；2. 若结果为红色，受伤害角色回复1点体力，否则伤害来源回复1点体力。',
        boss_qizuo:'奇佐',
        boss_qizuo_info:'你可以令你的普通锦囊牌额外结算一次。',
        boss_guixin:'归心',
        boss_guixin_info:'锁定技，其他角色摸牌时，若摸牌数不少于2，须将交给你一张牌。',
        xiongcai:'雄才',
        xiongcai_info:'锁定技，你在回合结束后随机获得一个魏势力角色的所有技能。',
        xiaoxiong:'枭雄',
        xiaoxiong_info:'锁定技，每当一名其他角色使用一张基本牌或锦囊牌，你获得一张与之同名的牌；在一名其他角色的结束阶段，若其本回合没有使用牌，你对其造成1点伤害。',
        boss_zhangwu:'章武',
        boss_zhangwu_info:'每当你受到一次伤害，你可以弃置任意张牌并令伤害来源选择一项：弃置等量的牌，或受到等量的伤害。',
        xiangxing:'禳星',
        xiangxing_info:'锁定技，游戏开始时，你获得7枚星；每当你累计扣减7点体力，你失去一枚星，并造成7点雷属性伤害，随机分配给其他角色；当你失去全部星后，你的体力上限变为3。',
        yueyin:'月隐',
        yueyin_info:'锁定技，你的每一枚星对应的一个特定条件，当你失去星时，若满足此条件，则不造成伤害。',
        xiangxing7_info:'你没有手牌',
        xiangxing6_info:'此次受到的是火属性伤害',
        xiangxing5_info:'此次受到的是雷属性伤害',
        xiangxing4_info:'此次为失去体力',
        xiangxing3_info:'一名其他角色有至少4件装备',
        xiangxing2_info:'你的判定区内至少有两张牌',
        xiangxing1_info:'场上只有2名存活角色',
        gaiming:'改命',
        gaiming_info:'锁定技，在你的判定牌生效前，你观看牌堆顶的七张牌并选择一张作为判定结果，此结果不可更改。',
        fengqi:'风起',
        fengqi_info:'准备阶段和结束阶段，你可以视为使用任意一张普通锦囊牌。',

        jiaoxia:'皎霞',
        jiaoxia_info:'每当你成为红色牌的目标，你可以摸一张牌。',
        lingbo:'凌波',
        lingbo_info:'每当你使用或打出一张闪，你可以摸两张牌。',
        tiandao:'天道',
        tiandao_info:'任意一名角色的判定生效前，你可以打出一张牌替换之。',
        yunshen:'云身',
        yunshen2:'云身',
        yunshen_info:'每当你使用或打出一张闪时，你可以令你的防御距离+1；准备阶段，你将累计的防御距离清零，然后摸等量的牌。',
        lianji:'连计',
        lianji_info:'出牌阶段限一次，你可以选择一张手牌并指定两名角色进行拼点，拼点赢的角色获得此牌，并对没赢的角色造成1点伤害。',
        mazui:'麻醉',
        mazui2:'麻醉',
        mazui_info:'出牌阶段限一次，你可以将一张黑色手牌置于一名角色的武将牌上，该角色造成的下一次伤害-1，然后获得此牌。',

        boss_nbianshen:'变形',
        boss_nbianshenx:'变形',
        boss_nbianshenx_info:'你从第二轮开始，每一轮幻化为警觉、任性、睿智、暴怒四种随机状态中的一种。',
        boss_mengtai:'萌态',
        boss_mengtai_info:'锁定技，若你的出牌阶段被跳过，你跳过本回合的弃牌阶段；若你的摸牌阶段被跳过，结束阶段开始时，你摸三张牌。',
        boss_ruizhi:'睿智',
        boss_ruizhi_info:'锁定技，其他角色的准备阶段开始时，其选择一张手牌和一张装备区里的牌，然后弃置其余的牌。',
        boss_jingjue:'警觉',
        boss_jingjue_info:'每当你于回合外失去牌时，你可以进行一次判定，若结果为红色，你回复1点体力。',
        boss_renxing:'任性',
        boss_renxing_info:'锁定技，你的回合外，一名角色受到1点伤害后或回复1点体力时，你摸一张牌。',
        boss_nbaonu:'暴怒',
        boss_nbaonu_info:'锁定技，摸牌阶段，你改为摸X张牌（X为4到你体力值间的随机数）；若你的体力值小于5，则你使用【杀】造成的伤害+1且无次数限制。',
        boss_shouyi:'兽裔',
        boss_shouyi_info:'锁定技，你使用牌无距离限制。',

        boss_nianrui:'年瑞',
        boss_nianrui_info:'锁定技，摸牌阶段，你额外摸两张牌。',
        boss_qixiang:'祺祥',
        boss_qixiang1:'祺祥',
        boss_qixiang2:'祺祥',
        boss_qixiang_info:'乐不思蜀判定时，你的方块判定牌视为红桃；兵粮寸断判定时，你的黑桃判定牌视为草花。',

        qiwu:'栖梧',
        qiwu_info:'锁定技。每当你使用一张梅花牌，你回复1点体力。',
        jizhen:'激阵',
        jizhen_info:'结束阶段，你可以令所至多两名已受伤角色摸一张牌。',

        boss_yushou:'驭兽',
        boss_yushou_info:'出牌阶段开始时，你可以对所有敌方角色使用一张【南蛮入侵】。',
        boss_moyany:'魔炎',
        boss_moyany_info:'每当你于回合外失去牌时，你可以进行一次判定，若结果为红色，你对一名其他角色造成2点火焰伤害。',
        boss_modao:'魔道',
        boss_modao_info:'锁定技，准备阶段，你摸两张牌。',
        boss_mojian:'魔箭',
        boss_mojian_info:'出牌阶段开始时，你可以对所有敌方角色使用一张【万箭齐发】。',
        boss_danshu:'丹术',
        boss_danshu_info:'每当你于回合外失去牌时，你可以进行一次判定，若结果为红色，你回复1点体力。',

        boss_zuijiu:'醉酒',
        boss_zuijiu_info:'锁定技，你因【杀】造成伤害时，此伤害+1。',
        boss_taiping:'太平',
        boss_taiping_info:'锁定技，摸牌阶段摸牌时，你的摸牌数量+2。',
        boss_suoming:'索命',
        boss_suoming_info:'结束阶段，将任意名未被横置的其他角色的武将牌横置。',
        boss_xixing:'吸星',
        boss_xixing_info:'准备阶段，对任意一名横置的其他角色造成1点雷电伤害，然后回复1点体力。',

        boss_baolian:'暴敛',
        boss_baolian_info:'锁定技，结束阶段，你摸两张牌。',
        boss_manjia:'蛮甲',
        boss_manjia_info:'锁定技，若你的装备区内没有防具牌，则你视为装备了【藤甲】。',
        boss_xiaoshou:'枭首',
        boss_xiaoshou_info:'结束阶段，对体力不小于你的一名其他角色造成3点伤害。',
        boss_guiji:'诡计',
        boss_guiji_info:'锁定技，准备阶段结束时，若你的判定区内有牌，你随机弃置其中一张牌。',
        boss_lianyu:'炼狱',
        boss_lianyu_info:'结束阶段，你可以对所有敌方角色造成1点火焰伤害。',

        boss_guihuo:'鬼火',
        boss_guihuo_info:'结束阶段，你可以对一名其他角色造成1点火焰伤害。',
        boss_minbao:'冥爆',
        boss_minbao_info:'锁定技，当你死亡时，对场上所有其他角色造成1点火焰伤害。',
        boss_luolei:'落雷',
        boss_luolei_info:'准备阶段，你可以对一名其他角色造成1点雷电伤害。',
        boss_beiming:'悲鸣',
        boss_beiming_info:'锁定技，当你死亡时，你令杀死你的角色弃置所有手牌。',
        boss_guimei:'鬼魅',
        boss_guimei_info:'锁定技，你不能成为延时类锦囊的目标。',
        boss_didong:'地动',
        boss_didong_info:'结束阶段，你可以选择一名敌方角色将其武将牌翻面。',
        boss_shanbeng:'山崩',
        boss_shanbeng_info:'锁定技，当你死亡时，你令所有其他角色弃置其装备区内的所有牌。',

        boss_chiyan_intro1:'&nbsp;第一关',
        boss_chiyan_intro1_info:'挑战朱雀',
        boss_chiyan_intro2:'&nbsp;第二关',
        boss_chiyan_intro2_info:'挑战火神祝融、焰灵',
        boss_chiyan_intro3:'&nbsp;第三关',
        boss_chiyan_intro3_info:'挑战炎帝、火神祝融、焰灵',
        boss_chiyan_intro3_append:'每通过一关，游戏轮数清零，阵亡角色复活，所有角色重置武将和区域内的牌，并获得4-X张起始手牌，X为阵亡角色数。',

        boss_qingmu_intro1:'&nbsp;第一关',
        boss_qingmu_intro1_info:'挑战青龙',
        boss_qingmu_intro2:'&nbsp;第二关',
        boss_qingmu_intro2_info:'挑战木神勾芒、树精',
        boss_qingmu_intro3:'&nbsp;第三关',
        boss_qingmu_intro3_info:'挑战太昊、木神勾芒、树精',
        boss_qingmu_intro3_append:'每通过一关，游戏轮数清零，阵亡角色复活，所有角色重置武将和区域内的牌，并获得4-X张起始手牌，X为阵亡角色数。',

        boss_xuanlin_intro1:'&nbsp;第一关',
        boss_xuanlin_intro1_info:'挑战玄武',
        boss_xuanlin_intro2:'&nbsp;第二关',
        boss_xuanlin_intro2_info:'挑战水神玄冥、水神共工',
        boss_xuanlin_intro3:'&nbsp;第三关',
        boss_xuanlin_intro3_info:'挑战颛顼、水神玄冥、水神共工',
        boss_xuanlin_intro3_append:'每通过一关，游戏轮数清零，阵亡角色复活，所有角色重置武将和区域内的牌，并获得4-X张起始手牌，X为阵亡角色数。',

        boss_baimang_intro1:'&nbsp;第一关',
        boss_baimang_intro1_info:'挑战白虎',
        boss_baimang_intro2:'&nbsp;第二关',
        boss_baimang_intro2_info:'挑战金神蓐收、明刑柱',
        boss_baimang_intro3:'&nbsp;第三关',
        boss_baimang_intro3_info:'挑战少昊、金神蓐收、明刑柱',
        boss_baimang_intro3_append:'每通过一关，游戏轮数清零，阵亡角色复活，所有角色重置武将和区域内的牌，并获得4-X张起始手牌，X为阵亡角色数。',

        boss_bianshen_intro1:'&nbsp;第一关',
        boss_bianshen_intro1_info:'挑战魑、魅、魍、魉中的随机一个',
        boss_bianshen_intro2:'&nbsp;第二关',
        boss_bianshen_intro2_info:'挑战牛头、马面中的随机一个',
        boss_bianshen_intro3:'&nbsp;第三关',
        boss_bianshen_intro3_info:'挑战白无常、黑无常中的随机一个',
        boss_bianshen_intro4:'&nbsp;第四关',
        boss_bianshen_intro4_info:'挑战罗刹、夜叉中的随机一个',
        // boss_bianshen2:'后援',
        // boss_bianshen2_info:'你死亡后，随机召唤牛头、马面中的一个。',
        // boss_bianshen3:'后援',
        // boss_bianshen3_info:'你死亡后，随机召唤白无常、黑无常中的一个。',
        // boss_bianshen4:'后援',
        // boss_bianshen4_info:'你死亡后，随机召唤罗刹、夜叉中的一个。',

        boss_qiangzheng:'强征',
        boss_qiangzheng_info:'锁定技，结束阶段，你获得每个敌方角色的一张手牌。',
        boss_baolin:'暴凌',
        guizhen:'归真',
        guizhen_info:'每当你失去最后一张手牌，你可以所有敌人失去全部手牌，没有手牌的角色失去1点体力（不触发技能）。',
        boss_shengshou:'圣手',
        boss_shengshou_info:'每当你使用一张牌，你可以进行一次判定，若为红色，你回复1点体力。',
        wuqin:'五禽戏',
        wuqin_info:'结束阶段，若你没有手牌，可以摸三张牌。',

        boss_konghun:'控心',
        boss_konghun_info:'结束阶段，你可以指定一名敌人令其进入混乱状态（不受对方控制，并将队友视为敌人）直到下一回合开始。',
        yuehun:'月魂',
        yuehun_info:'结束阶段，你可以回复1点体力并摸两张牌。',
        fengwu:'风舞',
        fengwu_info:'出牌阶段限一次，可令除你外的所有角色依次对与其距离最近的另一名角色使用一张【杀】，无法如此做者失去1点体力。',
        boss_wange:'笙歌',

        huanhua:'幻化',
        huanhua_info:'锁定技，游戏开始时，你获得其他角色的所有技能，体力上限变为其他角色之和；其他角色于摸牌阶段摸牌时，你摸等量的牌；其他角色于弃牌阶段弃牌时，你弃置等量的手牌。',

        boss_leiji:'雷击',
        boss_leiji_info:'每当你使用或打出一张【闪】，可令任意一名角色进行一次判定，若结果为黑色，其受到1点雷电伤害，然后你摸一张牌。',
        jidian:'亟电',
        jidian_info:'每当你造成一次伤害，可以指定距离受伤害角色1以内的一名其他角色进行判定，若结果为黑色，该角色受到1点雷电伤害。',

        tinqin:'听琴',
        boss_guihan:'归汉',
        boss_guihan_info:'限定技，濒死阶段，你可以将体力回复至体力上限，摸四张牌，令所有敌人的技能恢复，失去技能〖悲歌〗和〖胡笳〗，并获得技能〖听琴〗、〖蕙质〗。',
        boss_huixin:'蕙质',
        boss_huixin_info:'每当你于回合外失去牌，可以进行一次判定，若为黑色，当前回合角色失去1点体力，否则你回复1点体力并摸一张牌。',
        boss_hujia:'胡笳',
        boss_hujia_info:'结束阶段，若你已受伤，可以弃置一张牌令一名其他角色的所有技能失效，若其所有技能已失效，改为令其失去1点体力上限。',
        boss_honglian:'红莲',
        boss_honglian_info:'锁定技，结束阶段，你摸两张牌，并对所有敌人造成1点火焰伤害。',
        huoshen:'火神',
        huoshen_info:'锁定技，你防止即将受到的火焰伤害，改为回复1点体力。',
        boss_xianyin:'仙音',
        boss_xianyin_info:'每当你于回合外失去牌，你可以进行一次判定，若为红色，你令一名敌人失去1点体力。',

        boss_yuhuo:'浴火',
        boss_yuhuo_info:'觉醒技，在你涅槃后，你获得技能〖神威〗、〖朱羽〗。',
        boss_tianyu:'天狱',
        boss_tianyu_info:'锁定技，结束阶段，你解除横置状态，除你之外的所有角色进入横置状态。',

        boss_jizhi:'集智',
        boss_jizhi_info:'每当你使用一张非转化的非基本牌，你可以摸一张牌并展示之。',
        boss_guiyin:'归隐',
        boss_guiyin_info:'锁定技，体力值比你多的角色无法在回合内对你使用卡牌。',
        boss_gongshen:'工神',
        boss_gongshen_info:'锁定技，除你之外的角色没有装备区；你不能成为其他角色的延时锦囊牌的目标。',

        fanghua:'芳华',
        fanghua_info:'结束阶段，你可以令所有已翻面角色失去1点体力。',
        tashui:'踏水',
        tashui_info:'每当你使用或打出一张黑色牌，你可以令一名其他角色翻面。',

        boss_wuxin:'无心',
        boss_wuxin_info:'锁定技，你防止即将受到的伤害，改为失去1点体力；你不能成为其他角色的延时锦囊的目标。',
        shangshix:'伤逝',
        shangshix2:'伤逝',
        shangshix_info:'锁定技，你的手牌数至少为4，结束阶段，若你的体力值大于1，你令场上所有角色失去1点体力。',

        boss_baonu:'暴怒',
        boss_baonu_info:'锁定技，当你的体力值降至4或更低时，你变身为暴怒战神或神鬼无前，并立即开始你的回合。',
        shenwei:'神威',
        shenwei_info:'锁定技，摸牌阶段，你额外摸X张牌，你的手牌上限+X（X为场上其他角色的数目且至多为3）。',
        xiuluo:'修罗',
        xiuluo_info:'准备阶段，你可以弃置一张牌，然后弃置你判定区内一张同花色的牌。你可以重复此流程。',
        shenqu:'神躯',
        shenqu_info:'每名角色的准备阶段，若你的手牌数少于或等于你的体力上限数，你可以摸两张牌；当你受到伤害后，你可以使用一张【桃】。',
        jiwu:'极武',
        jiwu_info:'出牌阶段，你可以弃置一张牌，然后获得一项：“强袭”、“铁骑”(界)、“旋风”、“完杀”，直到回合结束。',
        
        "boss_jingjia":"精甲",
        "boss_jingjia_info":"锁定技，游戏开始时，将本局游戏中加入的装备随机置入你的装备区。",
        "boss_aozhan":"鏖战",
        "boss_aozhan_info":"锁定技，若你装备区内有：武器牌，你可以多使用一张【杀】；防具牌，防止你受到的超过1点的伤害；坐骑牌，摸牌阶段多摸一张牌；宝物牌，跳过你的判定阶段。",
        
        boss_qinguangwang_ab:'秦广王',
        boss_qinguangwang:'秦广王·蒋子文',
        boss_panguan:'判官',
        boss_panguan_info:'	锁定技，你不能成为延时类锦囊的目标。',
        boss_juhun:'拘魂',
        boss_juhun_info:'锁定技，结束阶段，你令随机一名其他角色的武将牌翻面或横置。',
        boss_wangxiang:'望乡',
        boss_wangxiang_info:'锁定技，当你死亡时，你令所有其他角色弃置其装备区内的所有牌。',
        boss_chujiangwang_ab:'楚江王',
        boss_chujiangwang:'楚江王·厉温',
        boss_bingfeng:'冰封',
        boss_bingfeng_info:'锁定技，你死亡时，若杀死你的角色武将牌是正面朝上， 你令其翻面。',
        boss_songdiwang:'宋帝王·余懃',
        boss_heisheng:'黑绳',
        boss_heisheng_info:'锁定技，你死亡时，横置所有场上角色。',
        boss_shengfu:'绳缚',
        boss_shengfu_info:'锁定技，你的回合结束时，随机弃置一张场上其他角色的坐骑牌。',
        boss_wuguanwang_ab:'五官王',
        boss_wuguanwang:'五官王·吕岱',
        boss_zhiwang:'治妄',
        boss_zhiwang_info:'锁定技，当其他角色于摸牌阶段外得到牌时，你随机弃置其一张手牌。',
        boss_zhiwang_planetarian:'注意事项',
        boss_zhiwang_planetarian_info:'若触发〖治妄〗的角色因〖治妄〗触发的其他的技能（如〖伤逝〗〖连营〗等）继续得到了牌，则该角色将其武将牌变更为孙策。',
        boss_gongzheng:'公正',
        boss_gongzheng_info:'锁定技，准备阶段，若你判定区有牌，你随机弃置一张你判定区的牌。',
        boss_xuechi:'血池',
        boss_xuechi_info:'锁定技，你的回合结束时，令随机一名其他角色失去2点体力。',
        boss_yanluowang_ab:'阎罗王',
        boss_yanluowang:'阎罗王·包拯',
        boss_tiemian:'铁面',
        boss_tiemian_info:'锁定技，你的防具区没有牌时，视为你装备【仁王盾】。',
        boss_zhadao:'铡刀',
        boss_zhadao_info:'锁定技，你使用【杀】指定目标后，你令目标角色防具无效。',
        boss_zhuxin:'诛心',
        boss_zhuxin_info:'锁定技，你死亡时，你令场上血量最少的一名其他角色受到2点伤害。',
        boss_bianchengwang_ab:'卞城王',
        boss_bianchengwang:'卞城王·毕元宾',
        boss_leizhou:'雷咒',
        boss_leizhou_info:'锁定技，准备阶段，你对随机一名其他角色造成1点雷属性伤害。',
        boss_leifu:'雷缚',
        boss_leifu_info:'锁定技，你的回合结束时，随机横置一名其他角色。',
        boss_leizhu:'雷诛',
        boss_leizhu_info:'锁定技，你死亡时，对所有其他角色造成依次造成1点雷属性伤害。',
        boss_taishanwang_ab:'泰山王',
        boss_taishanwang:'泰山王·董和',
        boss_fudu:'服毒',
        boss_fudu_info:'锁定技，其他角色使用【桃】时，你令随机另一名其他角色失去1点体力。',
        boss_kujiu:'苦酒',
        boss_kujiu_info:'锁定技，其他角色准备阶段，你令其失去1点体力，然后该角色视为使用一张【酒】。',
        boss_renao:'热恼',
        boss_renao_info:'锁定技，你死亡时，你令随机一名其他角色受到3点火属性伤害。',
        boss_dushiwang_ab:'都市王',
        boss_dushiwang:'都市王·黄中庸',
        boss_remen:'热闷',
        boss_remen_info:'锁定技，若你的装备区内没有防具牌，则【南蛮入侵】、【万箭齐发】和普通【杀】对你无效。',
        boss_zhifen:'炙焚',
        boss_zhifen_info:'锁定技，准备阶段，你随机选择一名其他角色，获得其1张手牌（没有则不获得），并对其造成1点火属性伤害。',
        boss_huoxing:'火刑',
        boss_huoxing_info:'锁定技，你死亡时，你对所有其他角色造成1点火属性伤害。',
        boss_pingdengwang_ab:'平等王',
        boss_pingdengwang:'平等王·陆游',
        boss_suozu:'锁足',
        boss_suozu_info:'锁定技，准备阶段，你令所有其他角色横置。',
        boss_abi:'阿鼻',
        boss_abi_info:'锁定技，锁定技，你受到伤害时，你对伤害来源造成伤害的角色造成1点随机属性伤害（雷或火随机）。',
        boss_pingdeng:'平等',
        boss_pingdeng_info:'锁定技，你死亡时，你对体力最多的一名其他角色造成2点随机属性伤害（属性随机），然后再对一名体力最多的其他角色造成1点随机属性伤害（属性随机）。',
        boss_zhuanlunwang_ab:'转轮王',
        boss_zhuanlunwang:'转轮王·薛礼',
        boss_lunhui:'轮回',
        boss_lunhui_info:'锁定技，准备阶段，若你的体力小于等于2，则你与场上除你以外体力最高且大于2的角色交换体力值。',
        boss_wangsheng:'往生',
        boss_wangsheng_info:'锁定技，你的出牌阶段开始时，视为你随机使用一张【南蛮入侵】或【万箭齐发】。',
        boss_zlfanshi:'反噬',
        boss_zlfanshi_info:'锁定技，每个回合你受到第一次伤害后，若再次受到伤害，则对随机一名其他角色造成1点伤害。',
        boss_shikieiki_ab:'四季映姫',
        boss_shikieiki:'四季映姬·夜魔仙那度',
        boss_yingzhong:'映冢',
        boss_yingzhong_info:'锁定技。你登场后的第一个回合开始时，你随机获得两个“阴间武将”的全部技能。',
        boss_yingzhong_append:'<span style="font-family:yuanli">四季映姬到阴曹地府<br>——阴(映)到家了！</span>',
        //孟婆:
        "boss_mengpo":"孟婆",
        "boss_shiyou":"拾忧",
        "boss_shiyou_info":"其他角色于弃牌阶段弃置的牌进入弃牌堆前，你可以选择其中任意张花色各不相同的牌获得之。",
        "boss_wanghun":"忘魂",
        "boss_wanghun_info":"锁定技，你死亡时，令随机两名敌方角色各随机失去一个技能（主公技除外），并在牌堆中加入2张回魂。(回魂只能在挑战模式出现)",
        "boss_wangshi":"往事",
        "boss_wangshi_info":"锁定技，你存活时，敌方角色的回合开始时，令其于本回合不能使用或打出随机一种类型的牌（基本、锦囊、装备）。",
        "boss_wangshi2":"往事",
        "boss_wangshi2_info":"",
        //地藏王:
        "boss_dizangwang":"地藏王",
        "boss_bufo":"不佛",
        "boss_bufo_info":"锁定技，你的回合开始时，你对所有距离为1的其他角色造成1点火焰伤害；你受到大于等于2的伤害时，令此伤害-1。",
        "boss_wuliang":"无量",
        "boss_wuliang_info":"锁定技，你登场时额外摸三张牌；结束阶段开始时，你摸两张牌；你的回合开始时，若你当前体力小于3，则回复至3。",
        "boss_dayuan":"大愿",
        "boss_dayuan_info":" 当一名角色判定牌最终生效前，你可以指定该判定牌的点数和花色。",
        "boss_diting":"谛听",
        "boss_diting_info":"锁定技，你的坐骑区被废除，你与别人计算距离时-1，别人与你计算距离时+1；你的坐骑牌均用于重铸。",
        /*
        //等阶
        "boss_sdyl_playerlevel1":"一阶",
        "boss_sdyl_playerlevel1_info":"",
        "boss_sdyl_playerlevel2":"二阶",
        "boss_sdyl_playerlevel2_info":"开局随机使用一张装备牌，起始手牌+1。",
        "boss_sdyl_playerlevel3":"三阶",
        "boss_sdyl_playerlevel3_info":"出杀次数+1，体力上限+1。",
        "boss_sdyl_playerlevel4":"四阶",
        "boss_sdyl_playerlevel4_info":"摸牌阶段多摸一张牌，起始手牌+1。",
        "boss_sdyl_playerlevel5":"重生",
        "boss_sdyl_playerlevel5_info":"限定技，当你处于濒死状态时，你可以弃置所有判定区牌，然后复原你的武将牌，将手牌补充至手牌体力上限（至多为5），将体力回复至体力上限。",
        
        "boss_sdyl_bosslevel1":"一阶",
        "boss_sdyl_bosslevel1_info":"",
        "boss_sdyl_bosslevel2":"二阶",
        "boss_sdyl_bosslevel2_info":"登场时随机使用一张装备牌。",
        "boss_sdyl_bosslevel3":"三阶",
        "boss_sdyl_bosslevel3_info":"出杀次数+1，回合开始获得一张【杀】，体力上限+1，起始手牌+1。",
        "boss_sdyl_bosslevel4":"四阶",
        "boss_sdyl_bosslevel4_info":"摸牌阶段多摸一张牌，手牌上限+1。",
        "boss_sdyl_bosslevel5":"五阶",
        "boss_sdyl_bosslevel5_info":"登场时视为使用一张【南蛮入侵】且此【南蛮入侵】伤害+1。体力上限+1，起始手牌+1。",
        */
        "boss_sunce":"那个男人",
        "boss_hunzi":"魂姿",
        "boss_hunzi_info":"觉醒技，准备阶段，若你的体力值为1，你减1点体力上限，失去技能〖魂佑〗并获得技能〖英姿〗和〖英魂〗。",
        "boss_jiang":"激昂",
        "boss_jiang_info":"①锁定技，〖激昂〗不会无效。<br>②每当你使用或打出红色牌时，你可以摸一张牌。若你是因响应其他角色使用或打出的牌，则你获得对方使用或打出的牌。<br>③当有其他角色使用或打出红色牌指定你为目标或响应你后，你可以摸一张牌并获得这些牌。",
        "boss_hunyou":"魂佑",
        "boss_hunyou_info":"锁定技，你的体力值变化和体力上限变化无效。",
        "boss_taoni":"讨逆",
        "boss_taoni_info":"锁定技，游戏开始时，每名角色回合开始时或你死亡时，你检查存活角色的合法性。若有角色存在非法行为，则你终止本局游戏。",
        
        boss_xhuanren:'关卡说明',
        boss_xhuanren_info:'',
        boss_xhuanren_info_boss:'第一关：挑战秦广王<br>第二关：挑战楚江王，宋帝王，五官王，阎罗王中的一个<br>第三关：挑战卞城王，泰山王，都市王，平等王中的一个<br>第四关：挑战转轮王',

        boss_newhuanren:'关卡说明',
        boss_newhuanren_info:'',
        boss_newhuanren_info_boss:'第一关：挑战秦广王<br>第二关：挑战楚江王，宋帝王，五官王，阎罗王中的一个<br>第三关：挑战卞城王，泰山王，都市王，平等王中的一个<br>第四关：挑战转轮王<br>注：孟婆将在每局前三个阶段随机一个阶段登场<br>地藏王登场规则为，50回合内通过第三关，并且在前三关中成功击杀孟婆。<li>选陆逊左慈张春华于吉蒋费孔融自动变孙笨',

        mode_boss_card_config:'挑战卡牌',
        mode_boss_character_config:'挑战武将',
    }


    const characterJiange = {
        boss_liedixuande:['male','shu',5,['boss_lingfeng','boss_jizhen'],['jiangeboss','mode:versus'],'shu'],
        boss_gongshenyueying:['female','shu',4,['boss_gongshenjg','boss_jingmiao','boss_zhinang'],['jiangeboss','mode:versus'],'shu'],
        boss_tianhoukongming:['male','shu',4,['boss_biantian','bazhen'],['jiangeboss','mode:versus'],'shu'],
        boss_yuhuoshiyuan:['male','shu',4,['boss_yuhuojg','boss_qiwu','boss_tianyujg'],['jiangeboss','mode:versus'],'shu'],
        boss_qiaokuijunyi:['male','wei',4,['boss_huodi','boss_jueji'],['jiangeboss','mode:versus'],'wei'],
        boss_jiarenzidan:['male','wei',5,['boss_chiying','boss_jingfan'],['jiangeboss','mode:versus'],'wei'],
        boss_duanyuzhongda:['male','wei',5,['boss_fanshi','boss_xuanlei','boss_skonghun'],['jiangeboss','mode:versus'],'wei'],
        boss_juechenmiaocai:['male','wei',5,['boss_chuanyun','boss_leili','boss_fengxing'],['jiangeboss','mode:versus'],'wei'],

        boss_jileibaihu:['male','shu',5,['boss_jiguan','boss_zhenwei','boss_benlei'],['jiangemech','mode:versus'],'shu'],
        boss_yunpingqinglong:['male','shu',5,['boss_jiguan','boss_mojianjg'],['jiangemech','mode:versus'],'shu'],
        boss_lingjiaxuanwu:['male','shu',5,['boss_jiguan','yizhong','boss_lingyu'],['jiangemech','mode:versus'],'shu'],
        boss_chiyuzhuque:['male','shu',5,['boss_jiguan','boss_yuhuojg','boss_tianyun'],['jiangemech','mode:versus'],'shu'],
        boss_fudibian:['male','wei',5,['boss_jiguan','boss_didongjg'],['jiangemech','mode:versus'],'wei'],
        boss_tuntianchiwen:['male','wei',5,['boss_jiguan','boss_tanshi','boss_tunshi'],['jiangemech','mode:versus'],'wei'],
        boss_shihuosuanni:['male','wei',5,['boss_jiguan','boss_lianyujg'],['jiangemech','mode:versus'],'wei'],
        boss_lieshiyazi:['male','wei',5,['boss_jiguan','boss_nailuo'],['jiangemech','mode:versus'],'wei'],
        
        boss_kumuyuanrang:['male','wei',5,['boss_bashi','boss_danjing'],['jiangeboss','mode:versus'],'wei'],
        boss_baijiwenyuan:['male','wei',5,['boss_jiaoxie'],['jiangeboss','mode:versus'],'wei'],
        boss_yihanyunchang:['male','shu',5,['boss_xiaorui','boss_huchen'],['jiangeboss','mode:versus'],'shu'],
        boss_fuweizilong:['male','shu',5,['boss_fengjian','boss_keding'],['jiangeboss','mode:versus'],'shu'],
    }
    const skillJiange = {
        //剑阁技能
        boss_xiaorui:{
            trigger:{global:'damageSource'},
            forced:true,
            logTarget:'source',
            filter:function(event,player){
                var target=event.source;
                return target&&target==_status.currentPhase&&target.isAlive()&&target.isFriendOf(player)&&event.card&&event.card.name=='sha'&&event.getParent().type=='card';
            },
            content:function(){
                var source=trigger.source;
                source.addTempSkill('boss_xiaorui2');
                source.addMark('boss_xiaorui2',1,false);
            }
        },
        boss_xiaorui2:{
            onremove:true,
            charlotte:true,
            mod:{
                cardUsable:function(card,player,num){
                    if(card.name=='sha') return num+player.countMark('boss_xiaorui2');
                },
            },
        },
        boss_huchen:{
            trigger:{
                player:'phaseDrawBegin2',
                source:'dieAfter',
            },
            forced:true,
            filter:function(event,player){
                if(event.name=='die') return event.player.isEnemyOf(player);
                return !event.numFixed&&player.countMark('boss_huchen')>0;
            },
            content:function(){
                if(trigger.name=='die') player.addMark('boss_huchen',1);
                else trigger.num+=player.countMark('boss_huchen');
            },
            intro:{
                content:'已斩杀过$名敌将',
            },
        },
        boss_fengjian:{
            trigger:{source:'damageSource'},
            forced:true,
            filter:function(event,player){
                return event.player.isAlive();
            },
            logTarget:'player',
            content:function(){
                trigger.player.addTempSkill('boss_fengjian2',{player:'phaseAfter'});
                trigger.player.markAuto('boss_fengjian2',[player]);
            },
        },
        boss_fengjian2:{
            onremove:true,
            intro:{
                content:'不能对$使用牌',
            },
            mod:{
                playerEnabled:function(card,player,target){
                    if(player.getStorage('boss_fengjian2').contains(target)) return false;
                },
            },
        },
        boss_keding:{
            trigger:{player:'useCard2'},
            direct:true,
            filter:function(event,player){
                if(!event.targets||event.targets.length!=1) return false;
                var card=event.card;
                if(card.name!='sha'&&get.type(card)!='trick')return false;
                var info=get.info(card);
                if(info.allowMultiple==false) return false;
                if(!player.countCards('h')) return false;
                if(!info.multitarget){
                    if(game.hasPlayer(function(current){
                        return !event.targets.contains(current)&&lib.filter.targetEnabled2(card,player,current)&&lib.filter.targetInRange(card,player,current);
                    })){
                        return true;
                    }
                }
                return false;
            },
            content:function(){
                'step 0'
                var card=trigger.card;
                var prompt2='弃置任意张手牌，并为'+get.translation(card)+'增加等量的目标';
                var targets=game.filterPlayer(function(current){
                    return !trigger.targets.contains(current)&&lib.filter.targetEnabled2(card,player,current)&&lib.filter.targetInRange(card,player,current);
                });
                var max=0;
                if(!trigger.targets[0].hasSkill('heiguangkai_skill')) max=targets.filter(function(target){
                    return get.effect(target,card,player,player)>0;
                }).length;
                player.chooseCardTarget({
                    prompt:get.prompt('boss_keding'),
                    prompt2:prompt2,
                    selectCard:function(){
                        var player=_status.event.player;
                        var targets=_status.event.targets;
                        return [Math.max(1,ui.selected.targets.length),Math.min(targets.length,player.countCards('h'))];
                    },
                    selectTarget:function(){
                        return ui.selected.cards.length;
                    },
                    position:'h',
                    filterCard:lib.filter.cardDiscardable,
                    filterTarget:function(card,player,target){
                        return _status.event.targets.contains(target);
                    },
                    targets:targets,
                    ai1:function(card){
                        if(ui.selected.cards.length>=_status.event.max) return 0;
                        return 5-get.value(card);
                    },
                    ai2:function(target){
                        if(target.hasSkill('heiguangkai_skill')) return 0;
                        var trigger=_status.event.getTrigger();
                        var player=_status.event.player;
                        return get.effect(target,trigger.card,player,player);
                    },
                    max:max,
                });
                'step 1'
                if(result.bool){
                    player.logSkill('boss_keding',result.targets);
                    player.discard(result.cards);
                    trigger.targets.addArray(result.targets);
                }
            },
        },
        boss_bashi:{
            filter:function(event,player){
                return event.player!=player&&event.card&&(event.card.name=='sha'||get.type(event.card)=='trick')&&!player.isTurnedOver();
            },
            logTarget:'player',
            check:function(event,player){
                if(event.getParent().excluded.contains(player)) return false;
                if(get.attitude(player,event.player)>0){
                    return false;
                }
                if(get.tag(event.card,'respondSha')){
                    if(player.countCards('h',{name:'sha'})==0){
                        return true;
                    }
                }
                else if(get.tag(event.card,'respondShan')){
                    if(player.countCards('h',{name:'shan'})==0){
                        return true;
                    }
                }
                else if(get.tag(event.card,'damage')){
                    if(event.card.name=='shuiyanqijunx') return player.countCards('e')<2;
                    return true;
                    //if(player.countCards('h')<2) return true;
                }
                return false;
            },
            trigger:{target:'useCardToTargeted'},
            content:function(){
                player.turnOver();
                trigger.getParent().excluded.add(player);
            },
        },
        boss_danjing:{
            trigger:{global:'dying'},
            filter:function(event,player){
                return player.hp>1&&event.player.hp<1&&event.player.isFriendOf(player);
            },
            check:function(event,player){
                var target=event.player;
                return get.attitude(player,target)>0&&lib.filter.cardSavable({name:'tao',isCard:true},player,target);
            },
            logTarget:'player',
            content:function(){
                'step 0'
                player.loseHp();
                'step 1'
                var card={name:'tao',isCard:true};
                if(lib.filter.cardSavable(card,player,trigger.player)) player.useCard(card,trigger.player);
            },
        },
        boss_jiaoxie:{
            enable:'phaseUse',
            usable:1,
            filter:function(event,player){
                return game.hasPlayer(function(current){
                    return lib.skill.boss_jiaoxie.filterTarget(null,player,current);
                });
            },
            filterTarget:function(card,player,target){
                return target.isEnemyOf(player)&&target.type=='mech'&&target.countCards('he')>0;
            },
            content:function(){
                'step 0'
                if(!target.countCards('he')) event.finish();
                else target.chooseCard('he',true,'将一张牌交给'+get.translation(player));
                'step 1'
                if(result.bool){
                    player.gain(result.cards,target,'give');
                }
            },
            ai:{
                order:9,
                result:{
                    target:function(player,target){
                        if(target.countCards('e',function(card){
                            return get.value(card,target)<=0;
                        })>0) return 1;
                        return -1;
                    },
                },
            },
        },
        boss_didongjg:{
            trigger:{player:'phaseEnd'},
            direct:true,
            content:function(){
                "step 0"
                player.chooseTarget(get.prompt('boss_didongjg'),function(card,player,target){
                    return target.isEnemyOf(player);
                }).ai=function(target){
                    var att=get.attitude(player,target);
                    if(target.isTurnedOver()){
                        if(att>0){
                            return att+5;
                        }
                        return -1;
                    }
                    if(player.isTurnedOver()){
                        return 5-att;
                    }
                    return -att;
                };
                "step 1"
                if(result.bool){
                    player.logSkill('boss_didongjg',result.targets);
                    result.targets[0].turnOver();
                }
            },
            ai:{
                threaten:1.7
            }
        },
        boss_lianyujg:{
            trigger:{player:'phaseEnd'},
            unique:true,
            content:function(){
                "step 0"
                event.players=game.filterPlayer(function(current){
                    return current.isEnemyOf(player);
                });
                "step 1"
                if(event.players.length){
                    var current=event.players.shift();
                    player.line(current,'fire');
                    current.damage('fire');
                    event.redo();
                }
            },
            ai:{
                threaten:2
            }
        },
        boss_mojianjg:{
            trigger:{player:'phaseUseBegin'},
            content:function(){
                var list=game.filterPlayer(function(current){
                    return player.canUse('wanjian',current)&&current.isEnemyOf(player);
                });
                list.sort(lib.sort.seat);
                player.useCard({name:'wanjian'},list);
            },
            ai:{
                threaten:1.8
            }
        },
        boss_qiwu:{
            audio:true,
            trigger:{player:'useCard'},
            direct:true,
            filter:function(event,player){
                if(get.suit(event.card)=='club'){
                    return game.hasPlayer(function(current){
                        return current.isFriendOf(player)&&current.isDamaged();
                    });
                }
                return false;
            },
            content:function(){
                "step 0"
                var noneed=(trigger.card.name=='tao'&&trigger.targets[0]==player&&player.hp==player.maxHp-1);
                player.chooseTarget(get.prompt('boss_qiwu'),function(card,player,target){
                    return target.hp<target.maxHp&&target.isFriendOf(player);
                }).ai=function(target){
                    var num=get.attitude(player,target);
                    if(num>0){
                        if(noneed&&player==target){
                            num=0.5;
                        }
                        else if(target.hp==1){
                            num+=3;
                        }
                        else if(target.hp==2){
                            num+=1;
                        }
                    }
                    return num;
                }
                "step 1"
                if(result.bool){
                    player.logSkill('qiwu',result.targets);
                    result.targets[0].recover();
                }
            },
            ai:{
                expose:0.3,
                threaten:1.5
            }
        },
        boss_tianyujg:{
            audio:true,
            trigger:{player:'phaseEnd'},
            forced:true,
            filter:function(event,player){
                return game.hasPlayer(function(current){
                    return current.isEnemyOf(player)&&!current.isLinked();
                });
            },
            content:function(){
                "step 0"
                event.targets=game.filterPlayer();
                event.targets.sort(lib.sort.seat);
                "step 1"
                if(event.targets.length){
                    var target=event.targets.shift();
                    if(!target.isLinked()&&target.isEnemyOf(player)){
                        player.line(target,'green');
                        target.link();
                    }
                    event.redo();
                }
            }
        },
        boss_jueji:{
            audio:2,
            trigger:{global:'phaseDrawBegin'},
            filter:function(event,player){
                if(event.player.isFriendOf(player)){
                    return false;
                }
                return event.num>0&&event.player!=player&&event.player.hp<event.player.maxHp;
            },
            logTarget:'player',
            content:function(){
                player.line(trigger.player,'green');
                trigger.num--;
            },
            ai:{
                expose:0.2,
                threaten:1.4
            }
        },
        boss_huodi:{
            audio:2,
            trigger:{player:'phaseEnd'},
            direct:true,
            filter:function(event,player){
                return game.hasPlayer(function(current){
                    return current.isFriendOf(player)&&current.isTurnedOver();
                });
            },
            content:function(){
                "step 0"
                player.chooseTarget(get.prompt('boss_huodi'),function(card,player,target){
                    return !target.isFriendOf(player);
                }).ai=function(target){
                    if(target.isTurnedOver()) return 0;
                    return -get.attitude(player,target);
                };
                "step 1"
                if(result.bool){
                    player.logSkill('boss_huodi',result.targets);
                    result.targets[0].turnOver();
                }
            },
            ai:{
                expose:0.2
            }
        },
        boss_chuanyun:{
            audio:true,
            trigger:{player:'phaseEnd'},
            direct:true,
            content:function(){
                "step 0"
                player.chooseTarget(get.prompt('boss_chuanyun'),function(card,player,target){
                    return player.hp<target.hp;
                }).ai=function(target){
                    return get.damageEffect(target,player,player);
                }
                "step 1"
                if(result.bool){
                    player.logSkill('boss_chuanyun',result.targets);
                    result.targets[0].damage();
                }
            },
        },
        boss_leili:{
            audio:2,
            trigger:{source:'damageEnd'},
            direct:true,
            filter:function(event){
                return event.card&&event.card.name=='sha';
            },
            content:function(){
                "step 0"
                player.chooseTarget(get.prompt('boss_leili'),function(card,player,target){
                    if(target==trigger.player) return false;
                    return target.isEnemyOf(player);
                }).ai=function(target){
                    return get.damageEffect(target,player,player,'thunder');
                }
                "step 1"
                if(result.bool){
                    player.logSkill('boss_leili',result.targets);
                    result.targets[0].damage('thunder');
                }
            },
            ai:{
                expose:0.2,
                threaten:1.3
            }
        },
        boss_fengxing:{
            audio:true,
            trigger:{player:'phaseBegin'},
            direct:true,
            content:function(){
                "step 0"
                player.chooseTarget(get.prompt('boss_fengxing'),function(card,player,target){
                    if(target.isFriendOf(player)) return false;
                    return lib.filter.targetEnabled({name:'sha'},player,target);
                }).ai=function(target){
                    return get.effect(target,{name:'sha'},player);
                }
                "step 1"
                if(result.bool){
                    player.logSkill('boss_fengxing');
                    player.useCard({name:'sha'},result.targets,false);
                }
            },
            ai:{
                expose:0.2,
                threaten:1.3
            }
        },
        boss_xuanlei:{
            audio:true,
            trigger:{player:'phaseBegin'},
            forced:true,
            filter:function(event,player){
                return game.hasPlayer(function(current){
                    return current.isEnemyOf(player)&&current.countCards('j');
                });
            },
            content:function(){
                "step 0"
                event.targets=game.filterPlayer(function(current){
                    return current.isEnemyOf(player)&&current.countCards('j');
                });
                event.targets.sort(lib.sort.seat);
                player.line(event.targets,'thunder');
                "step 1"
                if(event.targets.length){
                    event.targets.shift().damage('thunder');
                    event.redo();
                }
            }
        },
        boss_fanshi:{
            audio:true,
            trigger:{player:'phaseEnd'},
            forced:true,
            check:function(){
                return false;
            },
            content:function(){
                player.loseHp();
            }
        },
        boss_skonghun:{
            audio:true,
            trigger:{player:'phaseUseBegin'},
            filter:function(event,player){
                var num=player.maxHp-player.hp;
                if(num==0) return false;
                for(var i=0;i<game.players.length;i++){
                    if(game.players[i].side!=player.side){
                        num--;
                    }
                }
                return num>=0;
            },
            forced:true,
            content:function(){
                'step 0'
                var targets=game.filterPlayer(function(current){
                    return current.isEnemyOf(player);
                });
                targets.sort(lib.sort.seat);
                event.targets=targets;
                player.line(targets,'thunder');
                event.num=targets.length;
                'step 1'
                if(event.targets.length){
                    event.targets.shift().damage('thunder');
                    event.redo();
                }
                'step 2'
                player.recover(event.num);
            },
            ai:{
                threaten:function(player,target){
                    if(target.hp==1) return 2;
                    if(target.hp==2&&game.players.length<8) return 1.5;
                    return 0.5;
                },
            }
        },
        boss_chiying:{
            audio:2,
            trigger:{global:'damageBegin4'},
            forced:true,
            filter:function(event,player){
                if(event.num<=1) return false;
                return event.player.isFriendOf(player);
            },
            content:function(){
                trigger.num=1;
            }
        },
        boss_jingfan:{
            global:'boss_jingfan2',
        },
        boss_jingfan2:{
            mod:{
                globalFrom:function(from,to,distance){
                    if(to.isEnemyOf(from)) return;
                    var players=game.filterPlayer();
                    for(var i=0;i<players.length;i++){
                        if(players[i].hasSkill('boss_jingfan')&&
                            players[i].isFriendOf(from)&&players[i]!=from){
                            return distance-1;
                        }
                    }
                }
            }
        },
        boss_lingyu:{
            trigger:{player:'phaseEnd'},
            check:function(event,player){
                if(player.isTurnedOver()) return true;
                var num=0,players=game.filterPlayer();
                for(var i=0;i<players.length;i++){
                    if(players[i].hp<players[i].maxHp&&
                        players[i].isFriendOf(player)&&get.recoverEffect(players[i])>0){
                        if(players[i].hp==1){
                            return true;
                        }
                        num++;
                        if(num>=2) return true;
                    }
                }
                return false;
            },
            content:function(){
                'step 0'
                player.turnOver();
                'step 1'
                var list=game.filterPlayer(function(current){
                    return current.isDamaged()&&current.isFriendOf(player);
                });
                player.line(list,'green');
                event.targets=list;
                'step 2'
                if(event.targets.length){
                    event.targets.shift().recover();
                    event.redo();
                }
            },
            ai:{
                threaten:1.5,
                effect:{
                    target:function(card,player,target){
                        if(card.name=='guiyoujie') return [0,1];
                    }
                }
            },
        },
        boss_zhenwei:{
            global:'boss_zhenwei2',
            ai:{
                threaten:1.5
            }
        },
        boss_zhenwei2:{
            mod:{
                globalTo:function(from,to,distance){
                    if(to.isFriendOf(from)) return;
                    var players=game.filterPlayer();
                    for(var i=0;i<players.length;i++){
                        if(players[i].hasSkill('boss_zhenwei')&&
                            players[i].isFriendOf(to)&&players[i]!=to){
                            return distance+1;
                        }
                    }
                }
            }
        },
        boss_benlei:{
            mode:['versus'],
            trigger:{player:'phaseBegin'},
            forced:true,
            filter:function(event,player){
                if(_status.mode!='jiange') return false;
                var players=game.filterPlayer();
                for(var i=0;i<players.length;i++){
                    if(players[i].type=='mech'&&players[i].isEnemyOf(player)){
                        return true;
                    }
                }
            },
            content:function(){
                var target=game.findPlayer(function(current){
                    return current.type=='mech'&&current.isEnemyOf(player);
                });
                if(target){
                    player.line(target,'thunder');
                    target.damage(Math.random()>0.4?2:3,'thunder');
                }
            },
            ai:{
                threaten:function(player,target){
                    if(_status.mode=='jiange'){
                        for(var i=0;i<game.players.length;i++){
                            if(game.players[i].type=='mech'&&game.players[i].isEnemyOf(target)){
                                return 2;
                            }
                        }
                    }
                    return 1;
                }
            }
        },
        boss_nailuo:{
            trigger:{player:'phaseEnd'},
            check:function(event,player){
                if(player.isTurnedOver()) return true;
                var num=0,players=game.filterPlayer();
                for(var i=0;i<players.length;i++){
                    if(players[i].isEnemyOf(player)){
                        var es=players[i].getCards('e');
                        for(var j=0;j<es.length;j++){
                            switch(get.subtype(es[j])){
                                case 'equip1':num+=1;break;
                                case 'equip2':num+=2;break;
                                case 'equip3':num+=2;break;
                                case 'equip4':num+=1;break;
                                case 'equip5':num+=1.5;break;
                            }
                        }
                    }
                }
                if(_status.mode=='jiange'){
                    for(var i=0;i<players.length;i++){
                        if(players[i].isFriendOf(player)&&players[i].hasSkill('huodi')){
                            return num>0;
                        }
                    }
                }
                return num>=4;
            },
            filter:function(event,player){
                var players=game.filterPlayer();
                for(var i=0;i<players.length;i++){
                    if(players[i].isEnemyOf(player)&&players[i].countCards('e')){
                        return true;
                    }
                }
                return false;
            },
            content:function(){
                'step 0'
                player.turnOver();
                'step 1'
                event.targets=get.players();
                'step 2'
                if(event.targets.length){
                    var current=event.targets.shift();
                    if(current.isEnemyOf(player)){
                        var es=current.getCards('e');
                        if(es.length){
                            current.discard(es);
                            player.line(current,'green');
                        }
                    }
                    event.redo();
                }
            },
            ai:{
                effect:{
                    target:function(card,player,target){
                        if(card.name=='guiyoujie') return [0,1];
                    }
                }
            },
        },
        boss_tanshi:{
            trigger:{player:'phaseEnd'},
            forced:true,
            check:function(){
                return false;
            },
            filter:function(event,player){
                return player.countCards('h')>0;
            },
            content:function(){
                player.chooseToDiscard('h',true);
            }
        },
        boss_tunshi:{
            trigger:{player:'phaseBegin'},
            forced:true,
            filter:function(event,player){
                var nh=player.countCards('h');
                return game.hasPlayer(function(current){
                    return current.isEnemyOf(player)&&current.countCards('h')>nh;
                });
            },
            content:function(){
                'step 0'
                var nh=player.countCards('h');
                var targets=game.filterPlayer(function(current){
                    return current.isEnemyOf(player)&&current.countCards('h')>nh;
                });
                targets.sort(lib.sort.seat);
                event.targets=targets;
                'step 1'
                if(event.targets.length){
                    var current=event.targets.shift();
                    current.damage();
                    player.line(current,'thunder');
                    event.redo();
                }
            }
        },
        boss_jiguan:{
            mod:{
                targetEnabled:function(card,player,target){
                    if(card.name=='lebu'){
                        return false;
                    }
                }
            }
        },
        boss_gongshenjg:{
            audio:2,
            trigger:{player:'phaseEnd'},
            // mode:['versus'],
            filter:function(event,player){
                return true
            },
            content:function(){
                'step 0'
                const r = game.players.some(p=>{
                    return p.maxHp-p.hp>0
                })
                if(r){
                    player.chooseTarget(1,'令一名角色回复一点体力值',(card,player,target)=>{
                        return target.maxHp-target.hp>0
                    }).set('ai',target=>{
                        const att=get.attitude(_status.event.player,target);
                        return att>=0
                    })
                }else {
                    player.chooseTarget(1,'对一名角色造成一点火焰伤害',(card,player,target)=>{
                        return target.maxHp==target.hp
                    }).set('ai',target=>{
                        const att=get.attitude(_status.event.player,target);
                        return att<=0
                    })
                }
                'step 1'
                if(result.bool) {
                    const [target] = result.targets
                    if(target.maxHp>target.hp) {
                        player.line(target,'green');
                        target.recover()
                    }else {
                        player.line(target,'fire');
                        target.damage('fire')
                    }
                }
            },
        },
        boss_jingmiao:{
            trigger:{global:'useCardAfter'},
            filter:function(event,player){
                return event.player.isEnemyOf(player)&&event.card.name=='wuxie';
            },
            logTarget:'player',
            check:function(event,player){
                return get.attitude(player,event.player)<0;
            },
            content:function(){
                player.line(trigger.player,'green');
                trigger.player.loseHp();
            },
            ai:{
                expose:0.2,
                threaten:1.3
            }
        },
        boss_zhinang:{
            trigger:{player:'phaseBegin'},
            frequent:true,
            content:function(){
                "step 0"
                event.cards=get.cards(5);
                event.cards2=[];
                for(var i=0;i<event.cards.length;i++){
                    var type=get.type(event.cards[i],'trick');
                    if(type=='trick'||type=='equip'){
                        event.cards2.push(event.cards[i]);
                    }
                }
                if(!event.isMine()||event.cards2.length==0){
                    player.showCards(event.cards);
                }
                "step 1"
                if(event.cards2.length==0){
                    event.finish();
                }
                else{
                    const func = (cards,cards2)=>{
                        const dialog=ui.create.dialog('将这些牌中的锦囊牌或装备牌交给一名角色','hidden');
                        dialog.add(cards);
                        for(var i=0;i<dialog.buttons.length;i++){
                            if(cards2.contains(dialog.buttons[i].link)){
                                dialog.buttons[i].style.opacity=1;
                            }
                            else{
                                dialog.buttons[i].style.opacity=0.5;
                            }
                        }
                        _status.event.dialog = dialog
                    }
                    if(player.isOnline2()) {
                        player.send(function(fn,cards,cards2){
                            fn(cards,cards2)
                        },func,event.cards,event.cards2)
                    }else func(event.cards,event.cards2)
                    const next=player.chooseTarget(true,_status.event.dialog,function(card,player,target){
                        return true
                    });
                    next.ai=function(target){
                        var att=get.attitude(player,target);
                        if(att>0&&target.hasJudge('lebu')){
                            return 0.1;
                        }
                        if(player.countCards('h')>player.hp){
                            if(target==player) return Math.max(1,att-2);
                        }
                        if(target==player) return att+5;
                        return att;
                    }
                }
                "step 2"
                if(result&&result.targets&&result.targets.length){
                    event.target=result.targets[0];
                }
                if(event.cards2.length){
                    player.line(event.target,'green');
                    event.target.gain(event.cards2,'gain2','log');
                }
            },
            ai:{
                threaten:1.3
            }
        },
        boss_biantian4:{
            trigger:{player:'dieBegin'},
            forced:true,
            popup:false,
            content:function(){
                for(var i=0;i<game.players.length;i++){
                    if(game.players[i].hasSkill('boss_biantian3')){
                        game.players[i].removeSkill('boss_biantian3');
                        game.players[i].popup('boss_biantian3');
                    }
                    if(game.players[i].hasSkill('boss_biantian2')){
                        game.players[i].removeSkill('boss_biantian2');
                        game.players[i].popup('boss_biantian2');
                    }
                }
            }
        },
        boss_biantian:{
            trigger:{player:'phaseBegin'},
            forced:true,
            unique:true,
            audio:false,
            group:'boss_biantian4',
            content:function(){
                "step 0"
                for(var i=0;i<game.players.length;i++){
                    if(game.players[i].hasSkill('boss_biantian3')){
                        game.players[i].removeSkill('boss_biantian3');
                        game.players[i].popup('boss_biantian3');
                    }
                    if(game.players[i].hasSkill('boss_biantian2')){
                        game.players[i].removeSkill('boss_biantian2');
                        game.players[i].popup('boss_biantian2');
                    }
                }
                player.judge(function(card){
                    var color=get.color(card);
                    if(color=='black') return 1;
                    if(color=='red') return 0;
                    return -1;
                });
                "step 1"
                var targets=[],players=game.filterPlayer();
                if(result.color=='red'){
                    game.trySkillAudio('boss_biantianx2');
                    for(var i=0;i<players.length;i++){
                        if(!players[i].isFriendOf(player)){
                            players[i].addSkill('boss_biantian3');
                            players[i].popup('kuangfeng');
                            targets.push(players[i]);
                        }
                    }
                    player.logSkill('kuangfeng',targets,'fire');
                }
                else if(result.color=='black'){
                    game.trySkillAudio('boss_biantianx1');
                    for(var i=0;i<players.length;i++){
                        if(players[i].isFriendOf(player)){
                            players[i].addSkill('boss_biantian2');
                            players[i].popup('dawu');
                            targets.push(players[i]);
                        }
                    }
                    player.logSkill('dawu',targets,'thunder');
                }
            },
            ai:{
                threaten:1.6
            }
        },
        boss_biantian2:{
            audio:false,
            trigger:{player:'damageBefore'},
            filter:function(event){
                if(!event.hasNature('thunder')) return true;
                return false;
            },
            forced:true,
            mark:true,
            marktext:'雾',
            intro:{
                content:'已获得大雾标记'
            },
            content:function(){
                trigger.cancel();
            },
            ai:{
                nofire:true,
                nodamage:true,
                effect:{
                    target:function(card,player,target,current){
                        if(get.tag(card,'damage')&&!get.tag(card,'thunderDamage')) return [0,0];
                    }
                }
            }
        },
        boss_biantian3:{
            trigger:{player:'damageBegin3'},
            filter:function(event){
                if(event.hasNature('fire')) return true;
                return false;
            },
            mark:true,
            marktext:'风',
            intro:{
                content:'已获得狂风标记'
            },
            forced:true,
            content:function(){
                trigger.num++;
            },
            ai:{
                effect:{
                    target:function(card,player,target,current){
                        if(get.tag(card,'fireDamage')) return 1.5;
                    }
                }
            }
        },
        boss_jizhen:{
            audio:2,
            trigger:{player:'phaseEnd'},
            forced:true,
            filter:function(event,player){
                return game.hasPlayer(function(current){
                    return current.isFriendOf(player)&&current.isDamaged();
                });
            },
            content:function(){
                var list=game.filterPlayer(function(current){
                    return current.isFriendOf(player)&&current.isDamaged();
                });
                if(list.length){
                    player.line(list,'green');
                    game.asyncDraw(list);
                }
            },
            ai:{
                threaten:1.4
            }
        },
        boss_lingfeng:{
            audio:2,
            trigger:{player:'phaseDrawBefore'},
            content:function(){
                "step 0"
                trigger.cancel();
                event.cards=get.cards(2);
                player.showCards(event.cards);
                "step 1"
                if(get.color(event.cards[0])!=get.color(event.cards[1])){
                    player.chooseTarget('是否令一名敌方角色失去1点体力？',function(card,player,target){
                        return !target.isFriendOf(player);
                    }).ai=function(target){
                        return -get.attitude(player,target);
                    }
                }
                "step 2"
                if(result.bool&&result.targets&&result.targets.length){
                    player.line(result.targets,'green');
                    result.targets[0].loseHp();
                }
                "step 3"
                player.gain(event.cards);
                player.$draw(event.cards);
                game.delay();
            },
            ai:{
                threaten:1.4
            }
        },
        boss_yuhuojg:{
            audio:true,
            trigger:{player:'damageBegin2'},
            filter:function(event){
                return event.hasNature('fire');
            },
            forced:true,
            content:function(){
                trigger.cancel();
            },
            ai:{
                nofire:true,
                effect:{
                    target:function(card,player,target,current){
                        if(get.tag(card,'fireDamage')) return 0;
                    }
                }
            }
        },
        boss_tianyun:{
            trigger:{player:'phaseEnd'},
            direct:true,
            content:function(){
                "step 0"
                event.forceDie=true;
                player.chooseTarget(get.prompt('boss_tianyun'),function(card,player,target){
                    return target.isEnemyOf(player);
                }).ai=function(target){
                    if(player.hp<=1) return 0;
                    if(get.attitude(player,target)>-3) return 0;
                    var eff=get.damageEffect(target,player,player,'fire');
                    if(eff>0){
                        return eff+target.countCards('e')/2;
                    }
                    return 0;
                }
                "step 1"
                if(result.bool){
                    player.logSkill('boss_tianyun',result.targets,'fire');
                    player.loseHp();
                    event.target=result.targets[0];
                }
                else{
                    event.finish();
                }
                "step 2"
                if(event.target){
                    event.target.damage(Math.random()>0.4?2:3,'fire');
                }
                "step 3"
                if(event.target){
                    var es=event.target.getCards('e');
                    if(es.length){
                        event.target.discard(es);
                    }
                }
            },
            ai:{
                threaten:2
            }
        },
        versus_ladder:{
            trigger:{global:['damageEnd','recoverEnd','dieEnd','gainEnd','phaseDiscardEnd']},
            silent:true,
            filter:function(event,player){
                if(!_status.ladder) return false;
                if(event._ladder_mmr_counted) return false;
                if(!event.source) return false;
                return event.source==game.me||event.player==game.me;
            },
            content:function(){
                switch(event.triggername){
                    case 'damageEnd':{
                        if(trigger.source.side!=trigger.player.side){
                            if(trigger.source==game.me){
                                _status.ladder_mmr+=0.5*Math.max(1,trigger.num);
                            }
                            else{
                                _status.ladder_mmr+=0.2*Math.max(1,trigger.num);
                            }
                        }
                        break;
                    }
                    case 'recoverEnd':{
                        if(trigger.source!=trigger.player){
                            if(trigger.source==game.me){
                                if(trigger.player.side==game.me.side){
                                    _status.ladder_mmr+=0.5*trigger.num;
                                }
                                else{
                                    _status.ladder_mmr-=0.3*trigger.num;
                                }
                            }
                        }
                        else{
                            _status.ladder_mmr+=0.3*trigger.num;
                        }
                        break;
                    }
                    case 'dieEnd':{
                        if(trigger.source==game.me&&trigger.player.side!=game.me.side){
                            _status.ladder_mmr+=2;
                        }
                        break;
                    }
                    case 'gainEnd':{
                        if(trigger.cards&&trigger.cards.length){
                            if(trigger.source==game.me&&trigger.player!=game.me){
                                if(trigger.player.side==game.me.side){
                                    _status.ladder_mmr+=0.3*trigger.cards.length;
                                }
                                else{
                                    _status.ladder_mmr-=0.1*trigger.cards.length;
                                }
                            }
                            else{
                                if(trigger.source){
                                    if(trigger.source.side!=game.me.side){
                                        _status.ladder_mmr+=0.3*trigger.cards.length;
                                    }
                                }
                                else{
                                    _status.ladder_mmr+=0.1*trigger.cards.length;
                                }
                            }
                        }
                        break;
                    }
                    case 'phaseDiscardEnd':{
                        if(trigger.player==player){
                            if(trigger.cards&&trigger.cards.length){
                                _status.ladder_mmr-=0.2*trigger.cards.length;
                            }
                        }
                        break;
                    }
                }
                trigger._ladder_mmr_counted=true;
            }
        }
    }

    const translateJiange = {
        jiange:'剑阁武将',
        boss_liedixuande:'烈帝玄德',
        boss_gongshenyueying:'工神月英',
        boss_tianhoukongming:'天侯孔明',
        boss_yuhuoshiyuan:'浴火士元',
        boss_qiaokuijunyi:'巧魁儁乂',
        boss_jiarenzidan:'佳人子丹',
        boss_duanyuzhongda:'断狱仲达',
        boss_juechenmiaocai:'绝尘妙才',

        boss_jileibaihu:'机雷白虎',
        boss_yunpingqinglong:'云屏青龙',
        boss_lingjiaxuanwu:'灵甲玄武',
        boss_chiyuzhuque:'炽羽朱雀',
        boss_fudibian:'缚地狴犴',
        boss_tuntianchiwen:'吞天螭吻',
        boss_shihuosuanni:'食火狻猊',
        boss_lieshiyazi:'裂石睚眦',
        
        boss_kumuyuanrang:'枯目元让',
        boss_baijiwenyuan:'百计文远',
        boss_yihanyunchang:'翊汉云长',
        boss_fuweizilong:'扶危子龙',

        boss_xiaorui:'骁锐',
        boss_xiaorui2:'骁锐',
        boss_xiaorui_info:'友方角色于其回合内使用【杀】造成伤害后，其使用【杀】的次数+1。',
        boss_huchen:'虎臣',
        boss_huchen_info:'锁定技，你摸牌阶段摸牌数+X（X为你击杀的敌方角色数）。',
        boss_fengjian:'封缄',
        boss_fengjian2:'封缄',
        boss_fengjian_info:'受到你伤害的角色于其下个回合结束前，无法使用牌指定你为目标。',
        boss_keding:'克定',
        boss_keding_info:'当你使用【杀】或普通锦囊牌仅指定唯一目标时，你可以弃置任意张手牌，为其指定等量的额外目标。',
        boss_bashi:'拔矢',
        boss_bashi_info:'每当你成为其他角色使用的杀或普通锦囊牌的目标时，你可以从正面翻至背面，若如此做，此牌对你无效。',
        boss_danjing:'啖睛',
        boss_danjing_info:'友方角色进入濒死状态时，若你的体力值大于1，你可以失去1点体力，视为对其使用一张【桃】。',
        boss_jiaoxie:'缴械',
        boss_jiaoxie_info:'出牌阶段限一次，你可令敌方守城器械交给你一张牌。',
        boss_lianyujg:'炼狱',
        boss_lianyujg_info:'结束阶段，你可以对所有敌方角色造成1点火焰伤害。',
        boss_didongjg:'地动',
        boss_didongjg_info:'结束阶段，你可以选择一名敌方角色将其武将牌翻面。',
        boss_mojianjg:'魔箭',
        boss_mojianjg_info:'出牌阶段开始时，你可以对所有敌方角色使用一张【万箭齐发】。',
        boss_jiguan:'机关',
        boss_jiguan_info:'锁定技，你不能成为【乐不思蜀】的目标。',
        boss_lingyu:'灵愈',
        boss_lingyu_info:'结束阶段，你可以将自己的武将牌翻面，然后令所有已受伤的己方其他角色回复1点体力。',
        boss_tianyun:'天陨',
        boss_tianyun_info:'结束阶段，你可以失去1点体力，然后令一名敌方角色随机受到2~3点火焰伤害并弃置其装备区里的所有牌。',
        boss_zhenwei:'镇卫',
        boss_zhenwei_info:'锁定技，其他己方角色的防御距离+1。',
        boss_benlei:'奔雷',
        boss_benlei_info:'锁定技，准备阶段，你对敌方攻城器械随机造成2~3点雷电伤害。',
        boss_nailuo:'奈落',
        boss_nailuo_info:'结束阶段，你可以将你的武将牌翻面，令所有敌方角色弃置装备区内的所有牌。',
        boss_tanshi:'贪食',
        boss_tanshi_info:'锁定技，结束阶段开始时，你须弃置一张手牌。',
        boss_tunshi:'吞噬',
        boss_tunshi_info:'锁定技，准备阶段，你对所有手牌数量大于你的敌方角色造成1点伤害。',
        boss_yuhuojg:'浴火',
        boss_yuhuojg_info:'锁定技，每当你受到火焰伤害时，防止此伤害。',
        boss_qiwu:'栖梧',
        boss_qiwu_info:'每当你使用一张梅花牌，你可以令一名友方角色回复1点体力。',
        boss_tianyujg:'天狱',
        boss_tianyujg_info:'锁定技，结束阶段，你令所有未横置的敌方角色横置。',
        boss_gongshenjg:'工神',
        boss_gongshenjg_info:'结束阶段，若场上有已受伤的角色，你可令其中一名角色回复一点体力，若没有已受伤的角色，你可以对一名角色造成一点火焰伤害',
        boss_zhinang:'智囊',
        boss_zhinang_info:'准备阶段，你可以亮出牌堆顶的五张牌，你可以将其中锦囊或装备牌交给一名角色。',
        boss_jingmiao:'精妙',
        boss_jingmiao_info:'锁定技，每当敌方角色使用的无懈可击生效后，你令其失去1点体力。',
        boss_biantian:'变天',
        boss_biantian_info:'锁定技，准备阶段，你进行一次判定，若为红色，直到下个回合开始前，令敌方所有角色处于“狂风”状态，若为黑色，直到下个回合开始前，令己方所有角色处于“大雾”状态。',
        boss_biantian2:'大雾',
        boss_biantian3:'狂风',
        boss_lingfeng:'灵锋',
        boss_lingfeng_info:'摸牌阶段，你可以改为亮出牌堆顶的两张牌，然后获得之，若这些牌的颜色不同，你令一名敌方角色失去1点体力。',
        boss_jizhen:'激阵',
        boss_jizhen_info:'锁定技，结束阶段，你令所有已受伤的己方角色摸一张牌。',
        boss_huodi:'惑敌',
        boss_huodi_info:'结束阶段，若有武将牌背面朝上的己方角色，你可以令一名敌方角色将其武将牌翻面。',
        boss_jueji:'绝汲',
        boss_jueji_info:'敌方角色摸牌阶段，若其已受伤，你可以令其少摸一张牌。',
        boss_chuanyun:'穿云',
        boss_chuanyun_info:'结束阶段，你可以对体力比你多的一名其他角色造成1点伤害。',
        boss_leili:'雷厉',
        boss_leili_info:'每当你的[杀]造成伤害后，你可以对另一名敌方角色造成1点雷电伤害。',
        boss_fengxing:'风行',
        boss_fengxing_info:'准备阶段，你可以选择一名敌方角色，若如此做，视为对其使用了一张【杀】。',
        boss_skonghun:'控魂',
        boss_skonghun_info:'出牌阶段开始时，若你已损失体力值不小于敌方角色数，你可以对所有敌方角色各造成1点雷电伤害，然后你恢复X点体力（X为受到伤害的角色数）。',
        boss_fanshi:'反噬',
        boss_fanshi_info:'锁定技，结束阶段，你失去1点体力。',
        boss_xuanlei:'玄雷',
        boss_xuanlei_info:'锁定技，准备阶段，令所有判定区内有牌的敌方角色受到1点雷电伤害。',
        boss_chiying:'持盈',
        boss_chiying_info:'锁定技，每当己方角色受到多于1伤害时，你防止其余伤害。',
        boss_jingfan:'惊帆',
        boss_jingfan_info:'锁定技，己方其他角色的进攻距离+1。',
    }
    suiSet.moreCharacters = {
        character,skill,
        translate,
        characterJiange,skillJiange,translateJiange
    }
    lib.config.all.characters.push('boss','jiange')
    game.import('character',(lib,game,ui,get,ai,_status)=>{
        const boss = {
            name:'boss',
            connect:true,
            character,
            skill,
            translate,
        }
        return boss
    })
    game.import('character',(lib,game,ui,get,ai,_status)=>{
        const jiange = {
            name:'jiange',
            connect:true,
            character:characterJiange,
            skill:skillJiange,
            translate:translateJiange
        }
        return jiange
    })

    suiSet.loadCharacters = true
}
if(suiSet.lib.config.extension_联机修改_play_BossMode) {
    suiSet.loadMoreCharacters(true)
}
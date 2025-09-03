const a = {
    qd_wusheng: {
        group: ['qd_wusheng_mark', 'qd_wusheng_give', 'qd_wusheng_zhunbei'],
        mark: true,
        marktext: "武",
        intro: {
            name: "武圣",
            content: "mark",
        },
        subSkill: {
            mark: {
                audio: 'sbwusheng',
                trigger: {
                    global: "phaseBefore",
                    player: "enterGame",
                },
                filter(event, player) {
                    return event.name != "phase" || game.phaseNumber == 0;
                },
                forced: true,
                locked: false,
                async content(event, trigger, player) {
                    player.addMark("qd_wusheng", 3);
                    // lib.skill.qd_wusheng_give.addSkill(player,player.countMark('qd_wusheng'))
                    lib.skill.qd_wusheng_give.addSkill(player, 1)
                },
            },
            give: {
                trigger: { player: 'phaseBegin' },
                filter(trigger, player) {
                    return player.countMark('qd_wusheng') > 0
                },
                moveMark(add, remove, number) {
                    add.addMark('qd_wusheng', number)
                    remove.removeMark('qd_wusheng', number)
                    const addMark = add.countMark('qd_wusheng')
                    const removeMark = remove.countMark('qd_wusheng')
                    if (removeMark === 0) {
                        remove.marks.qd_wusheng.remove()
                        delete remove.marks.qd_wusheng
                    }
                    const skills = [1, 2, 3]
                    if (skills.includes(addMark)) {
                        lib.skill.qd_wusheng_give.addSkill(add, addMark)
                    }
                    if (skills.includes(removeMark)) {
                        lib.skill.qd_wusheng_give.addSkill(remove, removeMark)
                    }
                },
                async addSkill(player, marknum) {
                    const skills = ['qd_wusheng_sha1', 'qd_wusheng_unuse2', 'qd_wusheng_phase3']
                    const skill = skills[marknum - 1]
                    if (player.storage.qd_wushengSkill === skill) return
                    player.storage.qd_wushengSkill = skill
                    const index = skills.indexOf(skill) + 1
                    const after = skills.slice(index)
                    await player.addSkills(skill)
                    after.forEach(async s => await player.removeSkills(s))
                },
                async cost(event, trigger, player) {
                    event.result = await player.chooseTarget('选择一名其他角色交给其“武”标记', lib.filter.notMe)
                        .set('ai', target => {
                            const player = _status.event.player
                            return get.attitude(player, target) > 2
                        }).forResult()
                },
                async content(event, trigger, player) {
                    const [target] = event.targets
                    const marks = Array.from({ length: player.countMark('qd_wusheng') }, (_, i) => String(i + 1))
                    const { result } = await player.chooseControl(...marks).set('prompt', `请选择要交给${get.translation(target)}的“武”标记数量`)
                    if (result.control) {
                        lib.skill.qd_wusheng_give.moveMark(target, player, Number(result.control))
                    }
                    while (player.countMark('qd_wusheng') > 0) {
                        const { result } = await player.chooseTarget('选择一名其他角色交给其“武”标记', lib.filter.notMe)
                            .set('ai', target => {
                                const player = _status.event.player
                                return get.attitude(player, target) > 2
                            })
                        if (result.bool) {
                            const [target] = result.targets
                            const marks = Array.from({ length: player.countMark('qd_wusheng') }, (_, i) => String(i + 1))
                            const controlResult = await player.chooseControl(...marks).set('prompt', `请选择要交给${get.translation(target)}的“武”标记数量`)
                            if (controlResult.result.control) {
                                lib.skill.qd_wusheng_give.moveMark(target, player, Number(controlResult.result.control))
                            }
                        } else break
                    }
                },
            },
            zhunbei: {
                trigger: { player: 'phaseZhunbeiBegin' },
                filter(trigger) {
                    return game.players.filter(player => player.countMark('qd_wusheng') > 0).length > 0 && game.players.length > 1
                },
                async cost(event, trigger, player) {
                    event.result = await player.chooseTarget(2, '移动一名角色的“武”标记', (card, player, target) => {
                        if (ui.selected.targets.length === 0) {
                            return target.countMark('qd_wusheng') > 0
                        }
                        return target !== ui.selected.targets[0]
                    })
                        .set('multitarget', true)
                        .set('targetprompt', ['失去标记', '获得标记'])
                        .set('ai', target => {
                            const player = _status.event.player
                            return get.attitude(player, target) < 2
                        }).forResult()
                },
                async content(event, trigger, player) {
                    const [source, target] = event.targets
                    trigger.moveTargets = [source]
                    const marks = Array.from({ length: source.countMark('qd_wusheng') }, (_, i) => String(i + 1))
                    const { result } = await player.chooseControl(...marks).set('prompt', `选择要移动${get.translation(source)}的“武”标记数量`)
                    lib.skill.qd_wusheng_give.moveMark(target, source, Number(result.control))
                    while (game.players.some(p => p.countMark('qd_wusheng') > 0 && !trigger.moveTargets.includes(p))) {
                        const { result: targetResult } = await player.chooseTarget(2, '移动一名角色的“武”标记', (card, player, target) => {
                            if (ui.selected.targets.length === 0) {
                                return target.countMark('qd_wusheng') > 0 && !trigger.moveTargets.includes(target)
                            }
                            return target !== ui.selected.targets[0]
                        })
                            .set('multitarget', true)
                            .set('targetprompt', ['失去标记', '获得标记'])
                            .set('ai', target => {
                                const player = _status.event.player
                                return get.attitude(player, target) < 2
                            })
                        const [source, target] = targetResult.targets
                        trigger.moveTargets.push(source)
                        const marks = Array.from({ length: source.countMark('qd_wusheng') }, (_, i) => String(i + 1))
                        const { result: controlResult } = await player.chooseControl(...marks).set('prompt', `选择要移动${get.translation(source)}的“武”标记数量`)
                        lib.skill.qd_wusheng_give.moveMark(target, source, Number(targetResult.control))
                    }
                }
            },
            sha1: {
                ai: {
                    unequip: true,
                    unequip_ai: true,
                    skillTagFilter(player, tag, arg) {
                        if (tag == "unequip") {
                            if (arg && get.name(arg.card, player) === 'sha') return true;
                            return false;
                        }
                    },
                },
                trigger: { player: 'useCardToPlayered' },
                filter(trigger, player) {
                    return get.name(trigger.card, player) == "sha";
                },
                foeced: true,
                async content(event, trigger, player) {
                    const thisplayer = player
                    const translate = get.translation(player)
                    for await (const target of trigger.targets) {
                        const half = Math.ceil(target.countCards('h') / 2)
                        const { result } = await target.chooseToDiscard(half, "h", `弃置${half}张手牌，否则交给` + translate + "两张牌", lib.filter.cardDiscardable).set('ai', card => 8 - get.value(card));
                        if (!result.bool) {
                            let cards;
                            if (target.countCards('he') < 2) {
                                cards = target.getCards('he')
                            } else {
                                const { result: giveResult } = await target.chooseCard(`交给${translate}两张牌`, 'he', 2)
                                cards = giveResult.cards
                            }
                            if (cards && cards.length) {
                                await target.give(cards, player, "giveAuto")
                            }
                        }
                    }
                },
                mod: {
                    cardUsable(card, player, num) {
                        if (card.name == "sha") {
                            const discardnum = game.players.reduce((now, p) => {
                                const his = p.getHistory('lose', evt => evt.type === 'discard')
                                now += his.length
                                return now
                            }, 0)
                            return num + Math.min(discardnum, 3)
                        }
                    },
                }
            },
            unuse2: {
                trigger: { player: 'useCardToPlayered' },
                filter(trigger, player) {
                    return get.name(trigger.card, player) == "sha" && !player.hasSkill('qd_wusheng_used');
                },
                async content(event, trigger, player) {
                    player.addTempSkill('qd_wusheng_used')
                    game.players.forEach(p => {
                        if (p.countMark('qd_wusheng') < 1 && !trigger.targets.includes(p)) {
                            p.addTempSkill('qd_wusheng_ban')
                        }
                    })
                }
            },
            phase3: {
                round: 1,
                trigger: { player: 'phaseEnd' },
                forced: true,
                async content(event, trigger, player) {
                    await player.insertPhase();
                },
                group: 'qd_wusheng_phase4'
            },
            ban: {
                charlotte: true,
                mod: {
                    cardEnabled(card, player) {
                        return false
                    },
                    cardRespondable(card, player) {
                        return false
                    },
                    cardSavable: function (card, player) {
                        return false
                    },
                },
            },
            used: { charlotte: true },
            phase4: {
                trigger: { global: 'dieAfter' },
                forced: true,
                round: 1,
                filter(event, player) {
                    return _status.currentPhase === player
                },
                async content(event, trigger, player) {
                    delete player.getStat('skill')['qd_wusheng_phase3']
                }
            }
        }
    },
    qd_wushen: {
        dutySkill: true,
        audio: 'wushen',
        group: ['qd_wushen_achieve', 'qd_wushen_fail','qd_wushen_dying'],
        subSkill: {
            dying:{
                trigger:{global:'dying'},
                filter(trigger,player){
                    return trigger.source.countMark('qd_wusheng')>0
                },
                init(player){
                    player.storage.qd_wushenDying = 0
                },
                async content(e,t,player){
                    player.storage.qd_wushenDying++
                },
                forced:true,
                charlotte:true,
            },
            achieve: {
                audio: 'wushen',
                forced: true,
                skillAnimation: true,
                animationColor: "metal",
                filter(event, player) {
                    return player.storage.qd_wushenDying>2
                },
                async content(event, trigger, player) {
                    game.log(player, "成功完成使命");
                    player.awakenSkill("qd_wushen");
                    player.addMark('qd_wusheng', 3)
                },
                trigger: { player: "phaseBegin" },
            },
            fail: {
                audio: "wushen",
                trigger: { player: "dying" },
                forced: true,
                async content(event, trigger, player) {
                    game.log(player, "使命失败");
                    player.awakenSkill("qd_wushen");
                    if (player.hp < 1) player.recover(1 - player.hp);
                    player.addSkill('qd_wushen_remove')
                },
            },
            remove: {
                forced: true,
                trigger: { player: 'phaseBegin' },
                filter() {
                    return game.players.some(p => p.countMark('qd_wushen') > 0)
                },
                async content(event, trigger, player) {
                    const { result } = await player.chooseTarget(true, '移去一名角色的一个“武”标记', (card, player, target) => {
                        return target.countMark('qd_wushen') > 0
                    })
                    if (result.bool) {
                        result.targets[0].removeMark('qd_wushen', 1)
                    }
                }
            }
        }
    }
}

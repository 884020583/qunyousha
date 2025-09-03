import { lib, game, ui, get, ai, _status } from '../../noname.js'
export const addList = [
    ["heart", "13", "fangbaodun"], ["spade", "9", "woyaokanninvzhuang"], ["heart", "6", "kaikou"]
];

export const card = {
    fangbaodun: {
        type: "equip",
        subtype: "equip2",
        ai: {
            basic: {
                equipValue: 8,
            },
            result: {
                target: (player, target, card) => get.equipResult(player, target, card),
            },
        },
        skills: ["fangbaodun_skill"],
        fullskin: false,
        image: "ext:群友杀/image/card/fangbaodun.png",
        enable: true,
        selectTarget: -1,
        filterTarget: (card, player, target) => player == target && target.canEquip(card, true),
        modTarget: true,
        allowMultiple: false,
        content: function () {
            if (
                !card?.cards.some(card => {
                    return get.position(card, true) !== "o";
                })
            ) {
                target.equip(card);
            }
            //if (cards.length && get.position(cards[0], true) == "o") target.equip(cards[0]);
        },
        toself: true,
    },
    woyaokanninvzhuang: {
        type: "trick",
        fullskin: false,
        image: "ext:群友杀/image/card/woyaokanninvzhuang.png",
        enable: true,
        recastable: true,
        selectTarget: 1,
        filterTarget: (card, player, target) => target != player && target.canEquip({ name: "nvzhuang", suit: "club", number: 3 }, true),
        allowMultiple: false,
        content: function () {
            const card = game.createCard("nvzhuang", "club", 3);
            event.target.useCard(card, event.target);
        },
    },
    kaikou: {
        type: "trick",
        fullskin: false,
        image: "ext:群友杀/image/card/kaikou.png",
        enable: function (card, player) {
            return ["female", "double"].includes(player.sex);
        },
        recastable: true,
        selectTarget: 1,
        filterTarget: (card, player, target) => target != player && ["female", "double"].includes(target.sex),
        allowMultiple: false,
        async content(event, trigger, player) {
            const target = event.target;
            if (event.turn === undefined) {
                event.turn = target;
            }
            event.source = player;
            if (!event.shaReq) {
                event.shaReq = {};
            }
            if (typeof event.shaReq[player.playerid] !== "number") {
                event.shaReq[player.playerid] = 1;
            }
            if (typeof event.shaReq[target.playerid] !== "number") {
                event.shaReq[target.playerid] = 1;
            }
            event.playerCards = [];
            event.targetCards = [];
            while (true) {
                await event.trigger("juedou");
                event.shaRequired = event.shaReq[event.turn.playerid];
                let maxHpChanged = false;
                while (event.shaRequired > 0) {
                    let result = { bool: false };
                    if (!event.directHit) {
                        const next = event.turn.chooseToRespond();
                        next.set("filterCard", function (card, player) {
                            if (get.name(card) !== "sha") {
                                return false;
                            }
                            return lib.filter.cardRespondable(card, player);
                        });
                        if (event.shaRequired > 1) {
                            next.set("prompt2", "共需打出" + event.shaRequired + "张杀");
                        }
                        next.set("ai", function (card) {
                            if (get.event().toRespond) {
                                return get.order(card);
                            }
                            return -1;
                        });
                        next.set("shaRequired", event.shaRequired);
                        next.set(
                            "toRespond",
                            (() => {
                                const responder = event.turn;
                                const opposite = event.source;
                                if (responder.hasSkillTag("noSha", null, "respond")) {
                                    return false;
                                }
                                if (responder.hasSkillTag("useSha", null, "respond")) {
                                    return true;
                                }
                                if (event.baseDamage + event.extraDamage <= 0 || player.hasSkillTag("notricksource", null, event) || responder.hasSkillTag("notrick", null, event)) {
                                    return false;
                                }
                                if (event.baseDamage + event.extraDamage >= responder.hp + (opposite.hasSkillTag("jueqing", false, target) || target.hasSkill("gangzhi") ? 0 : target.hujia)) {
                                    return true;
                                }
                                const damage = get.damageEffect(responder, opposite, responder);
                                if (damage >= 0) {
                                    return false;
                                }
                                if (event.shaRequired > 1 && !target.hasSkillTag("freeSha", null, {
                                    player: player,
                                    card: event.card,
                                    type: "respond",
                                }) && event.shaRequired > responder.mayHaveSha(responder, "respond", null, "count")) {
                                    return false;
                                }
                                if (get.attitude(responder, opposite._trueMe || opposite) > 0 && damage >= get.damageEffect(opposite, responder, responder)) {
                                    return false;
                                }
                                // if (responder.hasSkill("naman")) {
                                // 	return true;
                                // }
                                return true;
                            })()
                        );
                        next.set("respondTo", [player, event.card]);
                        next.autochoose = lib.filter.autoRespondSha;
                        if (event.turn === target) {
                            next.source = player;
                        } else {
                            next.source = target;
                        }
                        result = await next.forResult();
                    }
                    if (result.bool) {
                        event.shaRequired--;
                        if (result.cards) {
                            if (event.turn === target) {
                                event.targetCards.addArray(result.cards);
                            } else {
                                event.playerCards.addArray(result.cards);
                            }
                        }
                    } else {
                        await event.turn.loseMaxHp();
                        await event.source.gainMaxHp();
                        maxHpChanged = true;
                        break;
                    }
                }
                if (maxHpChanged) {
                    break;
                }
                [event.source, event.turn] = [event.turn, event.source];
            }
        },
    },
};

export const skill = {
    fangbaodun_skill: {
        equipSkill: true,
        group: ["fangbaodun_skill_damage", "fangbaodun_skill_overflow"],
        subSkill: {
            damage: {
                equipSkill: true,
                trigger: {
                    player: "damageBegin4",
                },
                lastDo: true,
                forced: true,
                locked: false,
                filter: function (event, player) {
                    return event.card && ((event.card.name == "sha" && !event.card.nature && event.card.color == "red") 
                        || (get.type(event.card) == "trick" && get.tag(event.card, "damage" && event.card.color == "black")));
                },
                content: function () {
                    trigger.num = 0;
                },
            },
            overflow: {
                equipSkill: true,
                trigger: {
                    player: "damageBegin",
                },
                lastDo: true,
                forced: true,
                locked: false,
                filter: function (event, player) {
                    return event.num > 2;
                },
                content: function () {
                    trigger.num = 2;
                },
            },
        },
    },
};
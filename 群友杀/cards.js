import { lib, game, ui, get, ai, _status } from '../../noname.js'
export const addList = [
    ["heart", "13", "fangbaodun"],
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
};

export const skill = {
    zhediedun_skill: {
        equipSkill: true,
        group: ["fangbaodun_skill_damage", "fangbaodun_skill_overflow", "fangbaodun_skill_draw"],
        subSkill: {
            damage: {
                equipSkill: true,
                trigger: {
                    player: "damageBegin",
                },
                lastDo: true,
                forced: true,
                locked: false,
                filter: function (event, player) {
                    return event.card && ((event.card.name == "sha" && !event.card.nature) || event.card.name == "wanjian");
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
                    return event.num > 1;
                },
                content: function () {
                    trigger.num = 1;
                },
            },
            draw: {
                equipSkill: true,
                trigger: {
                    player: "damage",
                },
                forced: true,
                locked: false,
                filter: function (event, player) {
                    return event.num > 0 && player.countCards("h") < player.hp && player.maxHp - player.hp > 0;
                },
                content: function () {
                    player.draw(player.maxHp - player.hp);
                },
            },
        },
    },
};
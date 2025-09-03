"use strict";

window.lm_import(function (lib, game, ui, get, ai, _status) {
    //聊天
    lib.quickVoice = [
        "我从未见过如此厚颜无耻之人！",
        "这波不亏",
        "请收下我的膝盖",
        "你咋不上天呢",
        "放开我的队友，冲我来",
        "你随便杀，闪不了算我输",
        "见证奇迹的时刻到了",
        "能不能快一点啊，兵贵神速啊",
        "主公，别开枪，自己人",
        "小内再不跳，后面还怎么玩儿啊",
        "你们忍心，就这么让我酱油了？",
        "我，我惹你们了吗",
        "姑娘，你真是条汉子",
        "三十六计，走为上，容我去去便回",
        "人心散了，队伍不好带啊",
        "昏君，昏君啊！",
        "风吹鸡蛋壳，牌去人安乐",
        "小内啊，您老悠着点儿",
        "不好意思，刚才卡了",
        "你可以打得再烂一点吗",
        "哥们，给力点儿行嘛",
        "哥哥，交个朋友吧",
        "妹子，交个朋友吧",
        "老夫宁纵死不降！",
        "将军走此小道，追兵交我应付！",
        "别担心，我有办法救你",
        "主公！我来救你！",
        "生死存亡之际，在此一举！",
        "吾必胜也！",
        "无用之人，死！",
        "汝心术不正，吾故弃汝！",
        "没用的东西",
        "就这就这？你们真是太虚了！",
        "你吼那么大声干嘛？",
        "你……你……呜啊……！",
        "我为主上出过力，啊……",
        "你我兄弟齐上，焉有一合之将！哥哥说的在理！",
        "犯大吴疆土者，盛必击而破之",
        "若敢来犯，必叫你大败而归",
        "区区数百魏军,看我一击灭之!",
        "世子之争素来如此，朕予改封已是仁慈",
        "待追上那司马懿，定叫他没好果子吃！",
        "鬼龙斩月刀！",
        "发兵器啦！",
        "来来，一人一口！",
        "此美味也",
        "真是美味啊",
        "我喜欢！",
        "大丈夫生于天地之间，岂能郁郁久居人下！",
        "吕布飘零半生，只恨未逢明主，公若不弃，布愿拜为义父。",
        "大象很厉害吧！",
        "三姓家奴休走！",
        "此人决不可留！吾决意斩之！",
        "竖子不足与谋！",
        "群竖不吾从，而从吾家奴乎！",
        "黄口小儿，也敢来班门弄斧？",
        "公尚不如蜀地小儿乎",
        "喊什么喊？我敢杀你！",
        "笑什么笑？叫你得意！",
        "为汝这孺子，几损我一员大将！",
        "聪慧有何用？他有相父吗，朕有相父就够了",
        "大王，可敢接我一剑？！",
        "天下事在我！我今为之，谁敢不从！汝视我之剑不利否？",
        "汝剑利，吾剑未尝不利！",
        "对面的女孩看过来，额嘿嘿嘿……",
        "漂亮的姑娘都是我的",
        "嘿嘿嘿嘿，更衣好啊……",
        "都被你榨干了",
        "帮帮人家嘛",
        "伯符，我去了",
        "你来嘛",
        "好舒服啊",
        "别走了，再玩一会儿嘛",
        "我终于 等到你了",
        "主公，戒色！",
        "我们俩真是太强啦！",
        "骗兄弟可以，别把自己也骗了",
        "我就骂你，我就骂你！",
        "在下要给诸位来刀狠的！",
        "不是，真动手啊？",
        "哎，没打着",
        "哈哈哈哈，我会图谋不轨？",
        "主公，古锭刀现在是我的了！",
        "我来助你！",
        "你干嘛？哎呦！",
    ];
    //联机单人开房
    ui.create.connectPlayers = function (ip) {
        ui.updateConnectPlayerPositions();
        game.connectPlayers = [];
        const configOL = lib.configOL;
        const numberOfPlayers =
            parseInt(configOL.player_number) || configOL.number;
        for (let position = 0; position < numberOfPlayers; position++) {
            const player = ui.create.player(ui.window);
            player.dataset.position = position;
            player.classList.add("connect");
            game.connectPlayers.push(player);
        }

        var bar = ui.create.div(ui.window);
        bar.style.height = "20px";
        bar.style.width = "80%";
        bar.style.left = "10%";
        bar.style.top = "calc(200% / 7 - 120px + 5px)";
        bar.style.textAlign = "center";
        var ipbar = ui.create.div(".shadowed", ip, bar);
        ipbar.style.padding = "4px";
        ipbar.style.borderRadius = "2px";
        ipbar.style.position = "relative";

        var button = ui.create.div(
            ".menubutton.large.highlight.connectbutton.connectbutton1.pointerdiv",
            game.online ? "退出联机" : "开始游戏",
            ui.window,
            function () {
                if (button.clicked) return;
                if (game.online) {
                    if (game.onlinezhu) {
                        game.send("startGame");
                    } else {
                        game.saveConfig("tmp_owner_roomId");
                        game.saveConfig("tmp_user_roomId");
                        game.saveConfig("reconnect_info");
                        game.reload();
                    }
                } else {
                    // var num = 0;
                    // for (var i of game.connectPlayers) {
                    //     if (
                    //         !i.nickname &&
                    //         !i.classList.contains("unselectable2")
                    //     )
                    //         num++;
                    // }
                    // if (num >= lib.configOL.number - 1) {
                    //     alert("至少要有两名玩家才能开始游戏！");
                    //     return;
                    // }
                    game.resume();
                }
                button.delete();
                bar.delete();
                shareButton.delete();
                delete ui.connectStartButton;
                delete ui.connectStartBar;
                delete ui.connectShareButton;
                button.clicked = true;
            }
        );

        var shareButton = ui.create.div(
            ".menubutton.large.highlight.connectbutton.connectbutton2.pointerdiv",
            "分享房间",
            ui.window,
            function () {
                var text = `无名杀-联机-${lib.translate[get.mode()]}-${game.connectPlayers.filter((p) => p.avatar).length
                    }/${game.connectPlayers.filter(
                        (p) => !p.classList.contains("unselectable2")
                    ).length
                    }\n${get.connectNickname()}邀请你加入${game.roomId
                    }房间\n联机地址:${game.ip
                    }\n请先通过游戏内菜单-开始-联机中启用“读取邀请链接”选项`;
                window.focus();
                if (navigator.clipboard && lib.node) {
                    navigator.clipboard
                        .writeText(text)
                        .then(() => {
                            game.alert(`分享内容复制成功`);
                        })
                        .catch((e) => {
                            game.alert(`分享内容复制失败${e || ""}`);
                        });
                } else {
                    var input = ui.create.node("textarea", ui.window, {
                        opacity: "0",
                    });
                    input.value = text;
                    input.focus();
                    input.select();
                    var result = document.execCommand("copy");
                    input.blur();
                    ui.window.removeChild(input);
                    game.alert(`分享内容复制${result ? "成功" : "失败"}`);
                }
            }
        );

        ui.connectStartButton = button;
        ui.connectStartBar = bar;
        ui.connectShareButton = shareButton;
    }

});

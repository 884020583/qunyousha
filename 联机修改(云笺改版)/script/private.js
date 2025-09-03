const { lib, game, ui, get, ai, _status } = suiSet
const privates = {
    skill:{
        prhuanyi:{
            trigger:{player:'drawAfter'},
            filter(){
                debugger
            },
            async content(event,trigger,player){

            }
        }
    },
    translate:{
        prhuanyi:"唤忆",
        prhuanyi_info:`
        锁定技，你摸牌得到牌后观看此牌然后你将此牌翻至背面；<br>
        你使用或打出一张背面朝上的牌时你将其翻至正面且摸一张牌;<br>
        若你使用或打出的牌目标或行为不合法，你令此牌失效。`,
        prhuanyi_append:"----需要记好自己要做的事",
        prfenxin:"分心",
        prfenxin_info:"每个回合开始时，你可以摸一张牌然后调整你的手牌顺序。",
        prfenxin_append:"专心很有用，但分心也只是把有用用在了其他地方",
    }
}

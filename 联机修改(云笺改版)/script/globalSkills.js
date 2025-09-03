const { lib, game, ui, get, ai, _status } = suiSet
suiSet.globalSkills = {
    // _showSeat:{
    //     trigger:{player:'chooseButtonBegin'},
    //     filter(){
    //         return lib.config['extension_联机修改_edit_showSeat']
    //     },
    //     content(event,trigger,player){
    //         game.broadcastAll(player=>{
    //             const seat = lib.skill._showSeat.getSeat(player,_status.firstAct2||game.zhong||game.zhu||_status.firstAct||game.me)
    //             const {x,y,height,width} = player.getBoundingClientRect();
    //             if(!player.node.tshowSeat){
    //                 player.node.tshowSeat = ui.create.div(`.tshowSeat.se${seat}`,get.cnNumber(seat,true),ui.window)
    //             }else {
    //                 player.node.tshowSeat.innerHTML = get.cnNumber(seat,true)
    //             }
    //             player.node.tshowSeat.css({
    //                 left:x+width/2+-2+'px',
    //                 top:y+height+10+'px'
    //             })
    //         },player)
    //     },
    //     initSeat(first){
    //         const players = []
    //         let num = 1
    //         while(!first.seatNum){
    //             first.seatNum = num
    //             num++
    //             players.push(first)
    //             first = first.next
    //         }
    //         return players
    //     },
    //     getSeat(player,first){
    //         let players;
    //         if(!player.seatNum){
    //             players = lib.skill._showSeat.initSeat(first)
    //             return players.find(p=>p===player).seatNum
    //         }
    //         return player.seatNum
    //     },
    //     direct:true,
    //     popup:false,
    //     forced:true,
    //     forceDie:true,
    //     charlotte:true,
    //     locked:true,
    // },
}
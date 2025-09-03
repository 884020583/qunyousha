function replacePlayer(ws, player) {
    //首先先给要上场的角色视角换到要下场的目标去
    ws.send(player => {
        game.swapPlayer(game.me, player)
        ui.arena.classList.remove("observe")
        delete game.observe
    }, player)

    //然后再把要上场的角色移除旁观
    if (lib.node.observing.includes(ws)) {
        lib.node.observing.remove(ws)
    }

    const { ws: playerws, playerid } = player
    //保存一下要下场的角色ws和id，待会准备换到旁观去

    if (playerws) {
        lib.node.observing.push(playerws)
        //把下场角色放到旁观去
    }
    player.ws = ws
    // 把下场角色的ws换成要上场角色的ws

    delete lib.playerOL[playerid]
    lib.playerOL[playerid] = player
    player.nickname = ws.nickname
    player.setNickname(ws.nickname)
    //删掉旧的迎接新的

    //应该不会那么简单，我去看看源代码
}
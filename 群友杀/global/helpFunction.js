import { lib, game, ui, get, ai, _status } from '../../../noname.js'
(function() {
	/**
	 * 查询某个角色当前是否在场上是否存活，Character为角色名，注意是translate之后的而非直接用的name
	 * 返回值：true在场上且存活; false在场上且阵亡; -1不在场上
	 * 例如：get.characterIsOn("狐黎")
	 * @param character
	 * @returns any
	 */
	get.characterIsOn =  function(character) {
		const player = game.filterPlayer(function (current) {
			return lib.translate[current.name] === lib.translate[character];
		});
		if (player[0]) return player[0].isAlive();
		else return -1;
	}
})();

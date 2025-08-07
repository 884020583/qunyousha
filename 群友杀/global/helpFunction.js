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
	
	/**
	 * switchSide方法，允许双面角色在不翻面的情况下切换武将牌
	 * 使用方法：player.switchSide()
	 */
	lib.element.player.switchSide = function() {
		// 检查玩家是否是双面角色
		if (!(this.storage && this.storage.dualside && Array.isArray(this.storage.dualside))) {
			return;
		}
		
		// 获取双面角色配置
		var cfg = this.storage.dualside;
		
		// 判断当前是哪一面 - 通过比较当前角色名与配置中的角色名
		var isCurrentSide = (this.name == cfg[0]);
		
		// 保存当前状态
		if (isCurrentSide) {
			// 当前是正面，保存正面状态并切换到背面
			cfg[1] = this.hp;
			cfg[2] = this.maxHp;
			this.reinit(cfg[0], cfg[3], [cfg[4], cfg[5]]);
			this.unmarkSkill("dualside");
			this.markSkillCharacter("dualside", { name: cfg[0] }, "背面", "当前体力：" + cfg[1] + "/" + cfg[2]);
		} else {
			// 当前是背面，保存背面状态并切换到正面
			cfg[4] = this.hp;
			cfg[5] = this.maxHp;
			this.reinit(cfg[3], cfg[0], [cfg[1], cfg[2]]);
			this.unmarkSkill("dualside");
			this.markSkillCharacter("dualside", { name: cfg[3] }, "正面", "当前体力：" + cfg[4] + "/" + cfg[5]);
		}
		
		// 更新storage中的dualside配置
		this.storage.dualside = cfg;
	};
})();
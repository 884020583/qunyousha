import { lib, game, ui, get, ai, _status } from '../../../noname.js'
(function() {
	/**
	 * 允许双面角色在不翻面的情况下切换武将牌
	 * 使用方法：player.turnCharacter()
	 */
	lib.element.player.turnCharacter = function() {
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
	/**
	 * 打印当前事件链上的事件对象的名称
	 * @param {number} deep - 获取的层数
	 * 使用方法：event.getParent(deep)
	 */
	lib.element.event.printEventName = function(deep = 1) {
		game.log("event.name: " + this.name);
		for (let i = 1; i <= deep; i++) {
			game.log("event.getParent(" + i + ").name: " + this.getParent(i).name);
		}
	}
})();
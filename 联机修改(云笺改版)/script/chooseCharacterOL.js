const {game,get,lib,_status} = suiSet
export let chooseCharacterOL=function(){
	const mode = get.mode()
	const switchMode = {
		identity:suiSet.modeConfig.identity.chooseMode,
		doudizhu:suiSet.modeConfig.doudizhu.chooseMode,
		versus:suiSet.modeConfig.versus.chooseMode,
	}
	if(typeof switchMode[mode] === 'function'){
		switchMode[mode].call(this,arguments)
	}
}
Object.defineProperty(game,'chooseCharacterOL',{
	configurable:false,
	get(){
		return chooseCharacterOL
	},
	set(v){
		const m = get.mode()||lib.config.mode;
		loadModeConfig(m)
		if(m&&!suiSet.mode.includes(m)){
			chooseCharacterOL = v
		}
	}
})

function loadModeConfig(mode){
	const switchMode = {
		versus:suiSet.modeConfig.versus.modeConfig,
		doudizhu:suiSet.modeConfig.doudizhu.modeConfig,
		identity:suiSet.modeConfig.identity.modeConfig
	}
	if(typeof switchMode[mode] === 'function'){
		switchMode[mode]()
	}
}



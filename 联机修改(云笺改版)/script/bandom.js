// +function(){

// }()

// createc(){
//     if(suiSet.bandMenu) return 
//     const bandMenu = document.createElement('div')
//     ui.window.appendChild(bandMenu)
//     bandMenu.classList.add('bandMenu')
//     suiSet.bandMenu = bandMenu
//     bandMenu.innerHTML = /*html*/`
//         <div class="headis">
//             <div class="iselect general active">武将</div>
//             <div class="iselect extensn">扩展</div>
//             <div class="iselect cards">卡牌</div>
//         </div>
//         <div class="close">X</div>
//         <div class="centeris"></div>
//         <div class="aloowmenu big"></div>
//         <div class="rihtcenze"></div>
//         <div class="select hide"></div>
//     `
//     suiSet.bandMenu.items = {
//         first:suiSet.bandMenu.querySelector('.active'),
//         left:suiSet.bandMenu.querySelector('.centeris'),
//         close:suiSet.bandMenu.querySelector('.close'),
//         now:suiSet.bandMenu.querySelector('.active').classList[1],
//         center:suiSet.bandMenu.querySelector('.aloowmenu'),
//         right:suiSet.bandMenu.querySelector('.rihtcenze'),
//         select:suiSet.bandMenu.querySelector('.select'),
//         nowUse:suiSet.bandMenu.querySelector('.nowUse')
//     }
//     const {now,left,close} = suiSet.bandMenu.items;debugger
//     if(typeof suiSet.selectIpt[now]==='function'){
//         suiSet.selectIpt[now](left)
//     }
//     close.addEventListener('click',function(){
//         suiSet.bandMenu.classList.add('removing')
//         setTimeout(() => {
//             suiSet.bandMenu.remove()
//             delete suiSet.bandMenu
//         }, 2500);
//     })
// },
// selectIpt:{
//     general(target){
//         const {left,center,right,select} = suiSet.bandMenu.items

//         //left
//         //-------------------------------------------------------------------
//         lib.config.all.characters.forEach(c=>{
//             const select = suiSet.node('div',{
//                 className:`leftsc ${c}`,
//                 innerHTML:lib.translate[c+"_character_config"],
//                 link:c
//             },target,'click','showCharacter');
//             if(!lib.config.suiSetBandList.now){
//                 lib.config.suiSetBandList.now = 'first'
//             }
//             const nowUse = lib.config.suiSetBandList.now
//             let type = '关'
//             if(lib.config.suiSetBandList.avatar[nowUse].pack.includes(c)){
//                 select.classList.add('close')
//                 type = '开'
//             }
//             suiSet.node('div',{
//                 className:'after',innerHTML:type,
//                 type:false
//             },select,'click','closePack')
//         })
//         suiSet.bandMenu.items.left.now = target.firstElementChild
//         const {now} = suiSet.bandMenu.items.left
//         now.classList.add('active')
//         suiSet.selectFun.showCharacter.call(now,'init')
//         //-------------------------------------------------------------------

//         //隐藏的选项
//         //-------------------------------------------------------------------
//         for(const a in lib.config.suiSetBandList.avatar){
//             suiSet.node('div',{
//                 className:'opt '+a,
//                 innerHTML:lib.translate[a]||a
//             },select,'click','qiehuan')
//         };
//         suiSet.bandMenu.items.select.now = Array.prototype.find.call(select.childNodes,c=>{
//             return c.classList[1]===lib.config.suiSetBandList.now
//         })
//         suiSet.bandMenu.items.select.now.classList.add('active')
//         //-------------------------------------------------------------------

//         //right
//         //-------------------------------------------------------------------
//         const nowuse = lib.config.suiSetBandList.now
//         const rightSelect = {
//             now:'当前使用方案↓',
//             nowUse:lib.translate[nowuse],
//             opt:'切换',
//             all:'反选',
//             create:'创建新方案',
//             delete:'删除当前方案',
//             "hide useNow":'使用选中方案',
//         }
//         for(const r in rightSelect){
//             suiSet.node('div',{
//                 className:"rigtsc "+r,
//                 innerHTML:rightSelect[r]
//             },right,'click',r)
//         }
//         //-------------------------------------------------------------------

//     },
//     extensn(target){

//     },
//     cards(target){

//     },
// },
// selectFun:{
//     showCharacter(times){
//         if(this===suiSet.bandMenu.items.left.now&&times!=='init') return;
//         if(!lib.config.suiSetBandList.now){
//             lib.config.suiSetBandList.now = 'first'
//             game.saveConfig('suiSetBandList',lib.config.suiSetBandList)
//         }
//         //--------------------------------------------------------
//         const {center} = suiSet.bandMenu.items
//         center.innerHTML = ''
//         const pack = this.link
//         suiSet.bandMenu.items.left.now.classList.remove('active')
//         suiSet.bandMenu.items.left.now = this;
//         if(this.classList.contains('close')){
//             const btn = this.querySelector('.after')
//             btn.innerHTML = '开'
//             btn.type = false
//         }
//         this.classList.add('active')
//         //--------------------------------------------------------

//         let thisPack = lib.characterSort[pack]
//         if(!thisPack){
//             thisPack = lib.characterPack[pack]
//             const thisBlock = suiSet.node('div',{
//                 className:'packCharacter '+pack
//             },center);
//             suiSet.node('div',{innerHTML:lib.translate[pack+"_character_config"],className:'packname'},thisBlock,'click','closeSort')
//             for(const i in thisPack){
//                 if(lib.character[i]){
//                     suiSet.create.closeButton(i,'character',thisBlock)
//                 }
//             }
//         }else {
//             for(const t in thisPack){
//                 const thisBlock = suiSet.node('div',{
//                     className:'packCharacter '+t
//                 },center);
//                 suiSet.node('div',{innerHTML:lib.translate[t],className:'packname'},thisBlock,'click','closeSort')
//                 thisPack[t].forEach(ch=>{
//                     if(lib.character[ch]){
//                         suiSet.create.closeButton(ch,'character',thisBlock)
//                     }
//                 })
//             }
//         }
//     },
//     opt(){
//         const {now,left,center,right,select} = suiSet.bandMenu.items
//         const f = select.classList.contains('hide')?"remove":"add"
//         select.classList[f]('hide')
//         center.classList[f]('big')
//         right.lastElementChild.classList[f]('hide')
//     },
//     all(){

//     },
//     create(){

//     },
//     delete(){

//     },
//     qiehuan(){
//         if(this===suiSet.bandMenu.items.select.now){
//             return;
//         };
//         const {now,left,center,right,select} = suiSet.bandMenu.items
//         suiSet.bandMenu.items.select.now.classList.remove('active')
//         suiSet.bandMenu.items.select.now = this
//         suiSet.bandMenu.items.select.nowUse = this.classList[1]
//         this.classList.add('active')
//         suiSet.init(center,'avatar')
//     },
//     "hide useNow"(){
//         if(this.classList.contains('hide')) return;
//         const now = lib.config.suiSetBandList
//         game.saveConfig("suiSetBandList",now)
//         const nowUse = suiSet.bandMenu.querySelector('.nowUse')
//         nowUse.innerHTML = lib.translate[now.now]
//     },
//     closePack(){
//         const now = suiSet.bandMenu.items.select.now.classList[1]
//         const pack = this.parentElement.link
//         const packges = lib.config.suiSetBandList.avatar[now].pack;
//         if(packges.includes(pack)){
//             packges.remove(pack)
//             this.innerHTML = '关'
//             this.type = false
//             this.parentElement.classList.remove('close')
//         }else  {
//             packges.push(pack)
//             this.innerHTML = '开'
//             this.type = true
//             this.parentElement.classList.add('close')
//         }
//         game.saveConfig("suiSetBandList",lib.config.suiSetBandList)
//     },
//     closeSort(){
//         const link = Array.prototype.slice.call(this.parentElement.childNodes,1)
//         link.forEach(i=>{
//             i.onclick()
//         })
//     }
// },
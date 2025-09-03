const { lib, game, ui, get, ai, _status } = suiSet
suiSet.BandList={
    getPackAndCharacters() {
        const { characters, characterPack } = lib.config.suiSetBandList.packAndCharcters[lib.config.suiSetBandnow]
        const filterCharacPack = lib.config.all.characters.filter(c => {
            return !characterPack.includes(c)
        });
        return { characters, characterPack: filterCharacPack }
    },
    create() {
        suiSet.bandMenu = suiSet.node('div', {
            className: 'bandMenu',
            innerHTML:/*html*/`
                <div class="headis">
                    <div class="iselect general active">武将</div>
                    <div class="iselect extensn">扩展</div>
                    <div class="iselect cards">卡牌</div>
                </div>
                <div class="close" onclick="suiSet.BandList.close()">X</div>
                <div class="centeris"></div>
                <div class="aloowmenu big"></div>
                <div class="rihtcenze"></div>
                <div class="select hide"></div>
            `
        }, ui.window)
        suiSet.bandMenu.items = {
            first: suiSet.bandMenu.querySelector('.active'),
            left: suiSet.bandMenu.querySelector('.centeris'),
            close: suiSet.bandMenu.querySelector('.close'),
            now: suiSet.bandMenu.querySelector('.active').classList[1],
            center: suiSet.bandMenu.querySelector('.aloowmenu'),
            right: suiSet.bandMenu.querySelector('.rihtcenze'),
            select: suiSet.bandMenu.querySelector('.select'),
            nowUse: suiSet.bandMenu.querySelector('.nowUse')
        }
        const { now, left, right, center, select } = suiSet.bandMenu.items;
        if (typeof suiSet.BandList.function[now].init === 'function') {
            suiSet.BandList.function[now].init(left, right, center, select)
            //会执行下边的函数
        }
    },
    close() {
        suiSet.bandMenu.classList.add('removing')
        setTimeout(() => {
            suiSet.bandMenu.remove()
            delete suiSet.bandMenu
        }, 2500);
    },
    function: {
        general: {//真难受啊，写一大堆，错一点就是全错
            saveNow() {
                game.saveConfig('suiSetBandnow', lib.config.suiSetBandnow)
                const thisnode = suiSet.bandMenu.items.right.querySelector('.rigtsc.nowUse')
                thisnode.innerHTML = lib.config.suiSetBandnow
            },
            saveConfig() {
                game.saveConfig('suiSetBandList', lib.config.suiSetBandList)
            },
            init(left, right, center, select) {
                const nowuse = lib.config.suiSetBandnow
                const { modeFunction } = suiSet.BandList.function.general;
                const { characterPack, characters } = lib.config.suiSetBandList.packAndCharcters[nowuse]
                left.onclick = modeFunction.showCharacter
                center.onclick = modeFunction.closeButton
                select.onclick = modeFunction.select
                // right.onclick = modeFunction.right

                //left
                lib.config.all.characters.forEach(c => {
                    const select = suiSet.node('div', {
                        className: `leftsc ${c}`,
                        innerHTML: lib.translate[c + "_character_config"],
                        link: c
                    }, left);
                    suiSet.node('div', {
                        className: 'closePack',
                        innerHTML: 'X',
                    }, select)
                    if (characterPack.includes(c)) {
                        select.classList.add('close')
                    }
                })

                const first = left.firstElementChild
                suiSet.bandMenu.items.left.now = first
                first.classList.add('active')

                //hide
                for (const a in lib.config.suiSetBandList.packAndCharcters) {
                    const double = suiSet.node('div', {
                        className: 'opt ' + a,
                        innerHTML: lib.translate[a] || a,
                        link: a
                    }, select, 'click', modeFunction['qiehuan'])
                    double.ondblclick = modeFunction.ondblclick
                    double.onblur = modeFunction.onblur
                    if (lib.config.suiSetBandList.packAndCharcters[a].noremove) {
                        double.classList.add('noremove')
                    }
                };
                suiSet.bandMenu.items.select.now = Array.prototype.find.call(select.childNodes, c => {
                    if (c.classList[1] === nowuse) {
                        c.classList.add('active')
                        return true
                    }
                })
                //right 
                const dele = lib.config.suiSetBandList.packAndCharcters[nowuse].noremove ? '默认方案不能删除' : '删除当前方案'
                const rightSelect = {
                    now: '当前使用方案↓',
                    nowUse: nowuse,
                    opt: '切换方案',
                    all: '反选禁用',
                    create: '创建新方案',
                    delete: dele,
                    "hide useNow": '使用选中方案',
                }
                for (const r in rightSelect) {
                    suiSet.node('div', {
                        className: "rigtsc " + r,
                        innerHTML: rightSelect[r]
                    }, right, 'click', modeFunction[r])
                }
                //init
                left.onclick.call(first, characters)
            },
            modeFunction: {
                ondblclick() {
                    if (lib.config.suiSetBandList.packAndCharcters[this.link].noremove) {
                        return;
                    }
                    this.contentEditable = "true"
                    this.focus()
                },
                onblur() {
                    this.contentEditable = "false"
                    const link = this.innerText.replaceAll('\n', '').replaceAll('\r', '')
                    if (!link) {
                        return
                    }
                    if (lib.config.suiSetBandnow === this.link) {
                        lib.config.suiSetBandnow = link
                        game.saveConfig('suiSetBandnow', link)
                    }
                    const nowUse = suiSet.bandMenu.items.right.querySelector('.nowUse');
                    if (nowUse.innerText === this.link) {
                        nowUse.innerHTML = link
                    }
                    lib.config.suiSetBandList.packAndCharcters[link] = lib.config.suiSetBandList.packAndCharcters[this.link]
                    delete lib.config.suiSetBandList.packAndCharcters[this.link]
                    this.link = link
                    suiSet.BandList.function.general.saveConfig()
                },
                getNow() {
                    const nowuse = lib.config.suiSetBandnow
                    if (!lib.config.suiSetBandList.packAndCharcters[nowuse]) {
                        if (!lib.config.suiSetBandList.packAndCharcters['第一次载入']) {
                            return { characterPack: [], characters: [] }
                        }
                        return lib.config.suiSetBandList.packAndCharcters['第一次载入']
                    }
                    return lib.config.suiSetBandList.packAndCharcters[nowuse]
                },
                showCharacter(characters) {
                    if (characters.target && characters.target.innerHTML === 'X') {
                        suiSet.BandList.function.general.modeFunction.closePack.call(characters.target)
                        return;
                    }
                    if (characters.target && characters.target.link) {
                        const { characters: trueCharacter } = suiSet.BandList.function.general.modeFunction.getNow()
                        suiSet.BandList.function.general.modeFunction.showCharacter.call(characters.target, trueCharacter)
                        return;
                    }
                    if (!this.link) return;
                    const { center } = suiSet.bandMenu.items
                    suiSet.bandMenu.items.left.now.classList.remove('active')
                    suiSet.bandMenu.items.left.now = this
                    this.classList.add('active')
                    center.innerHTML = ''
                    const pack = this.link
                    let thisPack = lib.characterSort[this.link];
                    if (!thisPack) {
                        thisPack = {}
                        thisPack[pack + "_character_config"] = Object.keys(lib.characterPack[this.link])
                    }
                    for (const t in thisPack) {
                        const thisBlock = suiSet.node('div', { className: 'packCharacter ' + t }, center);
                        suiSet.node('div', { innerHTML: lib.translate[t] || '', className: 'packname', sort: [true, t], }, thisBlock)
                        thisPack[t].forEach(ch => {
                            if (ch) {
                                const button = ui.create.button(ch, 'character', thisBlock)
                                if (characters.includes(ch)) button.classList.add('closes')
                            }
                        })
                    }
                },
                closeSort(link) {
                    const list = Array.prototype.slice.call(suiSet.bandMenu.items.center.querySelector('.' + link).childNodes, 1);
                    const { characters } = suiSet.BandList.function.general.modeFunction.getNow()
                    list.forEach(i => {
                        const fun = i.classList.contains('closes') ? 'remove' : 'add'
                        i.classList[fun]('closes')
                        characters[fun](i.link)
                    })
                    suiSet.BandList.function.general.saveConfig()
                },
                closeButton(e) {
                    if (e.target.sort) {
                        suiSet.BandList.function.general.modeFunction.closeSort(e.target.sort[1])
                        return;
                    }
                    if (e.target.link) {
                        const { characters } = suiSet.BandList.function.general.modeFunction.getNow()
                        const fun = e.target.classList.contains('closes') ? 'remove' : 'add'
                        e.target.classList[fun]('closes')
                        characters[fun](e.target.link)
                        suiSet.BandList.function.general.saveConfig()
                    }
                },
                closePack() {
                    if (!this.parentElement) return;
                    const parent = this.parentElement
                    const { characterPack } = suiSet.BandList.function.general.modeFunction.getNow()
                    const fun = parent.classList.contains('close') ? 'remove' : 'add'
                    characterPack[fun](parent.link)
                    parent.classList[fun]('close')
                    suiSet.BandList.function.general.saveConfig()
                },
                select(e) {
                    if (e.target && e.target.classList[1]) {
                        if (suiSet.bandMenu.items.select.now === e.target) return;
                        suiSet.bandMenu.items.select.now.classList.remove('active')
                        suiSet.bandMenu.items.select.now = e.target
                        e.target.classList.add('active')
                        lib.config.suiSetBandnow = e.target.classList[1]
                        const nowUse = lib.config.suiSetBandnow
                        const dele = lib.config.suiSetBandList.packAndCharcters[nowUse].noremove ? '默认方案不能删除' : '删除当前方案'
                        const ide = suiSet.bandMenu.items.right.querySelector('.delete')
                        ide.innerHTML = dele
                        const { characters, characterPack } = suiSet.BandList.function.general.modeFunction.getNow()
                        suiSet.BandList.function.general.modeFunction.showCharacter.call(suiSet.bandMenu.items.left.now, characters)
                        suiSet.bandMenu.items.left.childNodes.forEach(c => {
                            const fun = characterPack.includes(c.link) ? 'add' : 'remove'
                            c.classList[fun]('close')
                        })
                    }
                },
                right() {
                    // const link = e.target.classList[1]
                    // if(typeof(suiSet.BandList.function.general.modeFunction[link])==='function'){
                    //     suiSet.BandList.function.general.modeFunction[link]()
                    // }
                },
                now() { },
                nowUse() { },
                opt() {
                    const { center, right, select } = suiSet.bandMenu.items
                    const f = select.classList.contains('hide') ? "remove" : "add"
                    select.classList[f]('hide')
                    center.classList[f]('big')
                    right.lastElementChild.classList[f]('hide')
                },
                all() {
                    const { characters } = suiSet.BandList.function.general.modeFunction.getNow()
                    suiSet.bandMenu.items.center.childNodes.forEach(ever => {
                        ever.classList.add('sunsine')
                        setTimeout(() => {
                            ever.classList.remove('sunsine')
                        }, 3000);
                        ever.childNodes.forEach(c => {
                            if (c.link) {
                                const func = c.classList.contains('closes') ? 'remove' : 'add'
                                characters[func](c.link)
                                c.classList[func]('closes')
                            }
                        })
                    })
                    suiSet.BandList.function.general.saveConfig()
                },
                create() {
                    const { modeFunction } = suiSet.BandList.function.general
                    modeFunction.opt()
                    const { select } = suiSet.bandMenu.items
                    const newSelect = suiSet.node('div', {
                        className: 'opt ',
                    }, select, 'click', modeFunction['qiehuan'])
                    newSelect.contentEditable = "true"
                    newSelect.ondblclick = modeFunction.ondblclick
                    newSelect.focus()
                    newSelect.onblur = function () {
                        const link = this.innerText.replaceAll('\\n', '')
                        if (!link) {
                            this.remove()
                            return;
                        }
                        lib.config.suiSetBandList.packAndCharcters[link] = {
                            characters: [], characterPack: []
                        }
                        if (this.classList) {
                            this.classList.add(link)
                        } else {
                            newSelect.classList.add(link)
                        }
                        debugger
                        suiSet.BandList.function.general.saveConfig()
                        this.contentEditable = "false"
                        this.onblur = modeFunction.onblur
                    }
                },
                delete() {
                    const now = suiSet.bandMenu.items.select.querySelector('.active')
                    const removeTarget = lib.config.suiSetBandList.packAndCharcters[now.link]
                    if (removeTarget.noremove) {
                        return;
                    }
                    const result = confirm(`是否删除？${now.link}`)
                    if (result) {
                        delete lib.config.suiSetBandList.packAndCharcters[now.link]
                        suiSet.BandList.function.general.saveConfig()
                    }
                },
                "hide useNow"() {
                    suiSet.BandList.function.general.saveNow(lib.config.suiSetBandnow)
                },
            }
        },
    }
}
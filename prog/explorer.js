class ExplorerProgram extends Program {

    createIcon({img, title, launch, shortcut}) {
        let icon = document.createElement('div')

        if (shortcut === true) {
            shortcut = `
                <div class="desktop-icon__shortcut">
                    <img src="img/ShortcutIcon.png"/>
                </div>
            `
        } else {
            shortcut = ''
        }
        icon.innerHTML = `
            <img src="${img}" alt="${title}">
            ${shortcut}
            <span>${title}</span>
        `
        icon.classList.add('desktop-icon')
        icon.dataset.launch = launch

        // selection event
        icon.addEventListener('click', () => {
            icon.parentElement
                .querySelectorAll('.desktop-icon[data-active="true"]')
                .forEach(el => el.dataset.active = false)

            icon.dataset.active = true
        })


        icon.addEventListener('dblclick', () => this.openProgram(launch))

        if (isMobileBrowser()) {
            icon.addEventListener('click', () => this.openProgram(launch))
        }

        return icon
    }

    // abstract
    iconsToCreate() {
        if (this.folder === null) {
            return []
        }

        let subfolders = []
        for (let key of Object.keys(this.folder.children)) {
            subfolders.push({
                img: this.folder.children[key].getIcon(),
                title: this.folder.children[key].getName(),
                launch: `explorer:${this.folder.children[key].calculatePath().join('/')}`,
                shortcut: false
            })
        }
        return [
            ...subfolders,
            ...this.folder.getContents()
        ]
    }

    getWindowTitle() {
        if (this.folder === null) {
            return 'Explorer'
        }

        return this.folder.getName()
    }
    getWindowIcon() {
        if (this.folder === null) {
            return 'img/desktop/Folder.png'
        }

        return this.folder.getIcon()
    }

    openProgram(launch) {
        if (launch.indexOf('explorer:') === 0) {
            this.openPath(launch.split(':').slice(1).join(':'))
        } else {
            window.pm.createInstance(launch)
        }
    }

    async createWindow(argument) {
        this.folder = null
        if (argument !== null) {
            this.folder = await fs.get(argument)
        } else {
            this.folder = window.fs.root
        }

        let path = [this.getWindowTitle()]
        if (this.folder !== null) {
            path = this.folder.calculatePath()
        }

        path = path
            .reverse()
            .map((name, i) => `<option value="${path.slice(i).reverse().join('/')}" ${i === 0 ? 'selected' : ''}>${name}</option>`)
            .join('\n')

        let wminfo = {
            name: this.getWindowTitle(),
            title: `${this.getWindowTitle()} - Explorer`,
            icon: this.getWindowIcon(),
            resizable: true,
            margin: false,
            app: true
        }

        let body = `
            <div class="menu-bar__container">
                <div class="menu-bar__menu">
                    <div class="menu-bar__handle"></div>
                    <span class="menu-bar__item">
                        File
                    </span>
                    <span class="menu-bar__item">
                        Edit
                    </span>
                    <span class="menu-bar__item">
                        View
                    </span>
                    <span class="menu-bar__item">
                        Go
                    </span>
                    <span class="menu-bar__item">
                        Favorites
                    </span>
                    <span class="menu-bar__item">
                        Help
                    </span>
                </div>

                <div class="menu-bar__hr"></div>
                
                <div class="menu-bar__menu">
                    <div class="menu-bar__handle"></div>
                    <div class="menu-bar__btn menu-bar__btn--disabled">
                        <img src="img/explorer/Back.png"/>
                        <span>Back</span>
                    </div>
                    <div class="menu-bar__btn menu-bar__btn--disabled">
                        <img src="img/explorer/Forward.png"/>
                        <span>Forward</span>
                    </div>
                    <div class="menu-bar__btn" data-role="up">
                        <img src="img/explorer/Up.png"/>
                        <span>Up</span>
                    </div>
                    <div class="menu-bar__divider"></div>
                    <div class="menu-bar__btn">
                        <img src="img/explorer/Cut.png"/>
                        <span>Cut</span>
                    </div>
                    <div class="menu-bar__btn">
                        <img src="img/explorer/Copy.png"/>
                        <span>Copy</span>
                    </div>
                    <div class="menu-bar__btn">
                        <img src="img/explorer/Paste.png"/>
                        <span>Paste</span>
                    </div>
                    <div class="menu-bar__divider"></div>
                </div>

                <div class="menu-bar__hr"></div>

                <div class="menu-bar__menu">
                    <div class="menu-bar__handle"></div>
                    <span class="menu-bar__label"> Address </span>
                    <select class="menu-bar__dropdown">
                        ${path}
                    </select>
                </div>
            </div>
            <div class="explorer__body">
                <div class="explorer__bodysidebar">
                </div>
                <div class="explorer__desktop">
                </div>
            </div>
        `

        return [wminfo, body]
    }

    onAttach() {
        const parent = this.getBodyHandle().parentElement
        if (parent.style.width === '') {
            parent.style.width = '306px'
            parent.style.height = '324px'
        }
        // this.getBodyHandle().parentElement.style.width = '306px'
        // this.getBodyHandle().parentElement.style.height = '324px'
        this.desktop = this.getBodyHandle()
            .querySelector('.explorer__desktop')

        this.desktop
            .addEventListener('click', e => {
                let assertNotIcon = target => {
                    if (target === document.body) return true
                    if (target.classList.contains('desktop-icon')) return false
                    return assertNotIcon(target.parentNode)
                }

                if (!assertNotIcon(e.target)) return

                this.desktop
                    .querySelectorAll('.desktop-icon[data-active="true"]')
                    .forEach(el => el.dataset.active = false)
            })


        this.getBodyHandle()
            .querySelector('[data-role="up"]')
            .addEventListener('click', () => {
                if (this.folder === null) return
                this.openPath(this.folder.calculatePath().slice(0, -1).join('/'))
            })

        this.getBodyHandle()
            .querySelector('.menu-bar__dropdown')
            .addEventListener('change', e => this.openPath(e.target.value))

        for (let icon of this.iconsToCreate()) {
            this.desktop
                .appendChild(this.createIcon(icon))
        }
    }

    async openPath(pathstr) {
        const [winfo, body] = await this.createWindow(pathstr)
        this.getBodyHandle().innerHTML = body
        this.setWindowIcon(winfo.icon)
        this.setWindowTitle(winfo.title)
        this.onAttach()
    }
}

window.pm.registerPrototype('explorer', ExplorerProgram)

class ProgramManager {
    constructor() {
        this.prototypes = {}
        this.instances = {}
    }

    registerPrototype(name, class_prototype) {
        this.prototypes[name] = class_prototype
    }

    hasPrototype(name) {
        return (name in this.prototypes)
    }

    createID() {
        // honestly this probably won't collide (16 ^ 10 = ~ 1 trilion)
        // if you get a collision you should probably buy a lottery ticket
        const alphabet = 'abcdef0123456789'
        let str = ''
        for (let i = 0; i < 10; i++) {
            str += alphabet[Math.floor(Math.random() * alphabet.length)]
        }
        return str
    }

    hasInstance(id) {
        return (id in this.instances)
    }

    async createInstance(name) {
        // slight hack, but allow web: links to be opened in new tabs
        if (name.length > 4 && name.slice(0,4) === 'web:') {
            console.log('opening web link')
            document.querySelector('#dummy')
                .setAttribute('href', name.slice(4))

            document.querySelector('#dummy').click()

            return
        }

        if (name === 'nop') {
            return
        }

        // argument handling for general programs
        let arg = null;
        if (name.indexOf(':') !== -1) {
            [name, arg] = name.split(/:(.+)/)
        }
        console.log('launching ', name, ' with arg ', arg)

        if (!this.hasPrototype(name)) {
            console.warn(`attempted to open unregistered program ${name}, ignoring...`)
            return
        }
        const id = this.createID()

        // this feels real hacky
        const handle = this.instances[id] = new (this.prototypes[name])(id)

        const [wminfo, body] = await handle.createWindow(arg)

        window.wm.openWindow(wminfo, body, win => {
            win.dataset._pm_id = id

            // make sure the thing knows about the window
            handle.setWindowHandle(win)

            // dispatch handler
            handle.onAttach(win)
        })
    }

    getInstance(id) {
        if (!this.hasInstance(id)) {
            console.warn(`attempted to get unknown instance ${id}, ignoring...`)
            return
        }

        return this.instances[id]
    }

    closeInstance(id) {
        if (!this.hasInstance(id)) {
            console.warn(`attempted to close unknown instance ${id}, ignoring...`)
            return
        }

        this.instances[id].onClose()

        delete this.instances[id]
    }

}

// base class for further programs
class Program {
    constructor(id) {
        this._pm_id = id
    }

    async createWindow(arg) {
        let body = `
            <p> Default window </p>
        `

        let wminfo = {
            title: 'Hello!',
            name:  'Default Program',
            icon:  'img/desktop/EXE.png'
        }

        return [wminfo, body]
    }

    initializeMenuHandler() {
        const menus = this
            .getBodyHandle()
            .querySelectorAll('.menu-bar__item')

        // add function for closing stuff
        const closeMenu = () => {
            document.querySelectorAll('.menu-bar__submenu-bg')
                .forEach(el => {
                    el.classList.remove('menu-bar__submenu-bg--active')
                })
            document.querySelectorAll('.menu-bar__submenu')
                .forEach(el => {
                    el.classList.remove('menu-bar__submenu--active')
                })
            document.querySelectorAll('.menu-bar__item')
                .forEach(el => el.classList.remove('menu-bar__item--active'))
        }

        let bg = this.getBodyHandle()
            .parentElement
            .querySelector('.menu-bar__submenu-bg')

        if (bg === null) {
            // create the click catcher bg
            bg = document.createElement('div')
            bg.classList.add('menu-bar__submenu-bg')

            bg.addEventListener('click', () => {
                closeMenu()
            })

            // put the background down
            this
                .getBodyHandle()
                .parentElement
                .appendChild(bg)
        }


        for (let menu of menus) {
            let submenu = menu.querySelector('.menu-bar__submenu')
            if (submenu !== null) {
                menu.addEventListener('click', e => {

                    if (e.target !== menu) {return}

                    bg.classList.add('menu-bar__submenu-bg--active')
                    menu.classList.add('menu-bar__item--active')
                    submenu.classList.add('menu-bar__submenu--active')
                })

                // add event listeners for item clicking
                submenu
                    .querySelectorAll('[data-name]')
                    .forEach(el => {
                        el.addEventListener('click', e => {
                            this.handleMenuClick(e.target.dataset.name)

                            closeMenu()
                        })
                    })
            }
        }
    }

    handleMenuClick(name) {}

    setWindowHandle(win) {
        this.handle = win
    }

    getBodyHandle() {
        if (this.handle === null) {
            return null
        }
        return this.handle.querySelector('.window-body')
    }

    setWindowTitle(title) {
        this.handle
            .querySelector('.title-bar-text')
            .innerText = title
    }

    setWindowIcon(icon) {
        this.handle.dataset.icon = icon
        window.wm.redrawTaskbarMain()
    }
    setWindowName(name) {
        this.handle.dataset.name = name
        window.wm.redrawTaskbarMain()
    }

    onAttach() {}
    onClose() {}

    onResize() {}
    onResizeEnd() {}

    closeWindow() {
        // this is a hack...
        this.handle.querySelector('button[aria-label="Close"]').click()
    }
}

window.pm = new ProgramManager()

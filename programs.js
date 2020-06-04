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

    createInstance(name) {
        // slight hack, but allow web: links to be opened in new tabs
        if (name.length > 4 && name.slice(0,4) === 'web:') {
            console.log('opening web link')
            document.querySelector('#dummy')
                .setAttribute('href', name.slice(4))

            document.querySelector('#dummy').click()

            return
        }

        if (!this.hasPrototype(name)) {
            console.warn(`attempted to open unregistered program ${name}, ignoring...`)
            return
        }
        const id = this.createID()

        // this feels real hacky
        const handle = this.instances[id] = new (this.prototypes[name])(id)

        const [wminfo, body] = handle.createWindow()

        window.wm.openWindow(wminfo, body, win => {
            win.dataset._pm_id = id

            // make sure the thing knows about the window
            handle.setWindowHandle(win)

            // dispatch handler
            handle.onAttach(win)
        })
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

    createWindow() {
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
            .querySelector('.title-text')
            .innerText = title
    }

    onAttach() {}
    onClose() {}

    closeWindow() {
        // this is a hack...
        this.handle.querySelector('button[aria-label="Close"]').click()
    }
}

window.pm = new ProgramManager()

/* --- HELPERS --- */

const assertParent = (el, target) => {
    if (el === target) {
        return true
    }

    if (el === document.body) {
        return false
    }

    return assertParent(el.parentNode, target)
}

class WindowManager {
    constructor() {
        document.querySelectorAll('[data-window]')
            .forEach(win => {
                this.attachWindowMovement(win, win.querySelector('.title-bar'))
                this.attachWindowResizing(win, win.querySelector('.window-resize-handle'))
                this.attachWindowOrdering(win)
                this.attachWindowButtons( win)
            })
        this.redrawTaskbarMain()
    }



    /* --- WINDOW MOVEMENT --- */

    // attach window movement controls
    attachWindowMovement(win, title) {
        win.dataset.isdragging = false

        title.addEventListener('mouseup', () => {
            // make sure that the drag ended
            win.dataset.isdragging = false
        })
        title.addEventListener('mousedown', e => {
            // ensure this is aimed at us
            if (!assertParent(e.target, title)) return
            
            // start a drag
            win.dataset.isdragging = true

            // calculate offsets
            const offsetX = e.layerX
            const offsetY = e.layerY
            const winRect = win.getBoundingClientRect()
            updateMousePos(e)

            // read the mouse position
            const updatePosition = () => {
                // get the mouse position, if it hasn't updated yet, use the client position
                let winX = window.mouse.x - offsetX
                let winY = window.mouse.y - offsetY

                // clamping
                winX = Math.max(0, winX)
                winY = Math.max(0, winY)
                winX = Math.min(window.innerWidth - winRect.width, winX)
                winY = Math.min(window.innerHeight - winRect.height, winY)

                // positioning
                win.style.left = `${winX}px`
                win.style.top  = `${winY}px`

                // continue tracking unless we've finished the drag
                if (win.dataset.isdragging === "true") {
                    requestAnimationFrame(updatePosition)
                }
            }
            updatePosition()
        })
    }

    /* --- WINDOW RESIZING --- */

    attachWindowResizing(win, handle) {
        if (handle === null) return
        win.dataset.isresizing = false

        let rect = win.getBoundingClientRect()
        win.style.minWidth  = `${rect.width - 4}px`
        win.style.minHeight = `${rect.height - 4}px`

        handle.addEventListener('mouseup', () => {
            // resize ended
            win.dataset.isresizing = false
        })
        handle.addEventListener('mousedown', e => {
            // assert this is aimed at us
            if (!assertParent(e.target, handle)) return
            win.dataset.isresizing = true

            // get the current info about the window
            const winRect = win.getBoundingClientRect()


            // first, stamp the size of the window into the styles
            win.style.width  = `${winRect.width - 4}px`
            win.style.height = `${winRect.height - 4}px`

            updateMousePos(e)

            const updateSize = () => {
                let winW = window.mouse.x - winRect.x
                let winH = window.mouse.y - winRect.y

                // apply
                win.style.width  = `${winW}px`
                win.style.height = `${winH}px`

                if (win.dataset.isresizing === 'true') {
                    requestAnimationFrame(updateSize)
                }
            }
            updateSize()
        })

    }

    /* --- WINDOW ORDERING / TASKBAR --- */

    // Helper - moves a window to the top
    windowFocus(win) {
            let order = Array.prototype.indexOf.call(win.parentNode.childNodes, win)
            let parentLen = win.parentNode.childNodes.length

            if (order + 1 === parentLen) return

            win.parentNode.appendChild(win)

            this.redrawTaskbarMain()
    }

    attachWindowOrdering(win) {
        win.addEventListener('mousedown', e => {
            // assert this is aimed at us
            if (!assertParent(e.target, win)) return
            this.windowFocus(win)
        })
    }

    redrawTaskbarMain () {
        let winhost = document.querySelector('.window-host')

        if (winhost.children.length === 0) return

        // clear the main area
        let main_area = document.querySelector('#task-bar__main')
        main_area.innerHTML = ''

        // create the button
        const createBtn = winfo => {
            let btn = document.createElement('button')

            // add icon if available
            if (winfo.icon) {
                let icon = document.createElement('img')
                icon.setAttribute('src', winfo.icon)
                btn.appendChild(icon)
            }

            // add button text
            let span = document.createElement('span')
            span.innerText = winfo.name
            btn.appendChild(span)

            // wire up classes
            btn.classList.add('task-bar__launch')
            if (winfo.active) {
                btn.classList.add('task-bar__launch--active')
            }
            btn.addEventListener('click', () => {
                this.windowFocus(document.querySelector(`.window[data-name="${winfo.name}"]`))
            })
            return btn
        }

        // find all named windows
        let wins = []
        winhost.querySelectorAll('.window[data-name]')
            .forEach(w => wins.push({name: w.dataset.name, icon: w.dataset.icon}))

        if (wins.length === 0) return

        // pick the last one as the active one
        wins[wins.length - 1].active = true

        // sort them alphabetically
        wins.sort((w1, w2) => w1.name > w2.name)
        
        // append
        wins.forEach(w =>
            main_area.appendChild(createBtn(w)))
    }

    /* --- WINDOW BUTTONS --- */

    attachWindowButtons(win) {
        const closeBtn = win.querySelector('button[aria-label="Close"]')
        if (closeBtn) {
            closeBtn
                .addEventListener('click', () => {
                    win.remove()
                    this.redrawTaskbarMain()
                })
        }
    }

/* --- OPEN WINDOW --- */

    openWindow({name, icon, title, resizable, x, y}, body, cb) {
        const winhost = document.querySelector('.window-host')
        const win = document.createElement('div')
        if (name) win.dataset.name = name
        if (icon) win.dataset.icon = icon
        win.dataset.window = true

        let resize_handle = !resizable ? '' : '<div class="window-resize-handle"></div>'
        title = title || name

        if (!x || !y) {
            x = 100 + (winhost.children.length * 20)
            y = 100 + (winhost.children.length * 20)
        }
        win.style.left = `${x}px`
        win.style.top  = `${y}px`

        win.classList.add('window')
        win.innerHTML = `
            <div class="title-bar">
                <div class="title-bar-text">${title}</div>
                <div class="title-bar-controls">
                    <button aria-label="Close"></button>
                </div>
            </div>
            <div class="window-body">${body}</div>
            ${resize_handle}
        `

        // attach to DOM
        document.querySelector('.window-host')
            .appendChild(win)

        // attach event listeners
        this.attachWindowMovement(win, win.querySelector('.title-bar'))
        this.attachWindowResizing(win, win.querySelector('.window-resize-handle'))
        this.attachWindowOrdering(win)
        this.attachWindowButtons( win)

        // update the taskbar
        this.redrawTaskbarMain()

        // add a callback if necessary
        if (cb) {
            cb(win)
        }
    }
}

/* --- MOUSE POSITIONING --- */

window.mouse = {}
const updateMousePos = e => {
    // this is required because you can drag faster than a dom event can fire,
    // and when your mouse exits a window title bar you can no longer drag it
    window.mouse = {x: e.clientX, y: e.clientY}
}
document.body.addEventListener('mousedown', () =>
    document.body.addEventListener('mousemove', updateMousePos))
document.body.addEventListener('mouseup', () => {
    document.body.removeEventListener('mousemove', updateMousePos)
    document.querySelectorAll('[data-isdragging]')
        .forEach(el => el.dataset.isdragging = false)
    document.querySelectorAll('[data-isresizing]')
        .forEach(el => el.dataset.isresizing = false)
    window.mouse = {}
})



window.wm = new WindowManager()

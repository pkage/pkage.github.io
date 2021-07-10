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

const convertIfTouch = e => ('targetTouches' in e) ? e.touches[0] : e

/* --- WM MAIN --- */

class WindowManager {
    constructor() {
        this.WM_BASE_ZINDEX = 3
        window.mm.addMouseupListener(() => this.cleanupAfterMoveEnd())

        // initialize all windows already present in DOM
        document.querySelectorAll('[data-window]')
            .forEach(win => {
                this.attachWindowMovement(win, win.querySelector('.title-bar'))
                this.attachWindowResizing(win, win.querySelector('.window-resize-handle'))
                this.attachWindowOrdering(win)
                this.attachWindowButtons( win)
            })

        // show desktop
        document.querySelector('.task-bar__quick[alt="Show Desktop"]')
            .addEventListener('click', this.minimizeAll.bind(this))

        this.redrawTaskbarMain()
    }

    /* --- HELPERS --- */

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

    /* --- WINDOW MOVEMENT --- */

    // attach window movement controls
    attachWindowMovement(win, title) {
        win.dataset.isdragging = false

        const dragEnd = () => {
            // make sure that the drag ended
            win.dataset.isdragging = false
        }
        const dragStart = e => {
            // ensure this is aimed at us
            if (!assertParent(e.target, title)) return

            // start a drag
            win.dataset.isdragging = true

            // touch support
            e = convertIfTouch(e)

            // calculate offsets
            const winRect = win.getBoundingClientRect()
            const offsetX = e.clientX - winRect.x
            const offsetY = e.clientY - winRect.y

            window.mm.updateMousePos(e)
            this.windowFocus(win)

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
        }

        title.addEventListener('mouseup', dragEnd)
        title.addEventListener('mousedown', dragStart)
        title.addEventListener('touchend', dragEnd)
        title.addEventListener('touchstart', dragStart)
    }

    /* --- WINDOW RESIZING --- */

    attachWindowResizing(win, handle) {
        if (handle === null) return
        win.dataset.isresizing = false


        let rect = win.getBoundingClientRect()
        win.style.minWidth  = `${rect.width - 4}px`
        win.style.minHeight = `${rect.height - 4}px`

        const resizeEnd = () => {
            // resize ended
            win.dataset.isresizing = false
        }
        const resizeStart = e => {
            // assert this is aimed at us
            if (!assertParent(e.target, handle)) return
            win.dataset.isresizing = true
            this.windowFocus(win)

            // find the PM instance
            const pm_instance = window.pm.hasInstance(win.dataset._pm_id) ? window.pm.getInstance(win.dataset._pm_id) : undefined
            console.log('attaching window resizing to window')

            // get the current info about the window
            const winRect = win.getBoundingClientRect()

            // first, stamp the size of the window into the styles
            win.style.width  = `${winRect.width}px`
            win.style.height = `${winRect.height}px`

            window.mm.updateMousePos(e)

            const updateSize = () => {
                let winW = window.mouse.x - winRect.x
                let winH = window.mouse.y - winRect.y

                // apply
                win.style.width  = `${winW}px`
                win.style.height = `${winH}px`

                pm_instance?.onResize?.()

                if (win.dataset.isresizing === 'true') {
                    requestAnimationFrame(updateSize)
                } else {
                    pm_instance?.onResizeEnd()
                }
            }
            updateSize()
        }

        handle.addEventListener('mouseup', resizeEnd)
        handle.addEventListener('mousedown', resizeStart)
        handle.addEventListener('touchend', resizeEnd)
        handle.addEventListener('touchstart', resizeStart)
    }

    /* --- WINDOW ORDERING / TASKBAR --- */

    // Helper - moves a window to the top
    windowFocus(win) {
        // lower order = renders in front
        let order = Number(win.dataset.wm_order)

        // first, re-order all the windows from 0 -> this window (in other words,
        // all windows in front of this one) to shift one up
        for (let otherwin of document.querySelectorAll('[data-window][data-wm_order]')) {
            let otherorder = Number(otherwin.dataset.wm_order)
            if (otherorder > order) {
                // ignore, we don't need to reorder higher orders
                continue
            }
            
            // shift up
            otherwin.dataset.wm_order = otherorder + 1
        }

        // set this one to be the front
        win.dataset.wm_order = 0
        win.dataset.wm_minimized = false
        
        // now repaint all windows
        this.redrawZOrders()
        this.redrawTaskbarMain()
    }

    redrawZOrders() {
        let parentLen = document.querySelector('.window-host').children.length

        // paint all windows' z-indices back to front (to minimize flashing)
        for (let i = parentLen - 1; i >= 0; i--) {
            document.querySelector(`[data-window][data-wm_order="${i}"]`)
                .style.zIndex = this.WM_BASE_ZINDEX + (parentLen - i)
        }
    }

    removeWindow(win) {
        let order = Number(win.dataset.wm_order)
        let parentLen = win.parentNode.children.length

        // re-order all the windows from this window to the back, and shift them down
        for (let otherwin of document.querySelectorAll('[data-window][data-wm_order]')) {
            let otherorder = Number(otherwin.dataset.wm_order)
            if (otherorder < order) {
                // ignore, we don't need to reorder lower orders
                continue
            }
            
            // shift down
            otherwin.dataset.wm_order = otherorder - 1
        }

        win.remove()

        this.redrawZOrders()
        this.redrawTaskbarMain()
    }

    attachWindowOrdering(win) {
        if (!('wm_order' in win.dataset)) {
            let parentLen = win.parentNode.children.length
            win.dataset.wm_order = parentLen
        }

        win.addEventListener('mousedown', e => {
            // assert this is aimed at us
            if (!assertParent(e.target, win)) return
            this.windowFocus(win)
        })

        // initally, set the focus here
        this.windowFocus(win)
    }

    redrawTaskbarMain () {
        let winhost = document.querySelector('.window-host')


        // clear the main area
        let main_area = document.querySelector('#task-bar__main')
        main_area.innerHTML = ''

        if (winhost.children.length === 0) return

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

            let ev_target = isMobileBrowser() ? 'touchend' : 'click' // apparently mobile safari has problems with this.
            let target = document.querySelector(`.window[data-_wm_id="${winfo._wm_id}"]`)
            if (winfo.active) {
                btn.classList.add('task-bar__launch--active')
                btn.addEventListener(ev_target, 
                    () => this.minimizeWindow(target))
            } else {
                btn.addEventListener(ev_target, 
                    () => this.windowFocus(target))

            }
            return btn
        }

        // find all named windows
        let wins = []
        winhost.querySelectorAll('.window[data-name]')
            .forEach(w => wins.push({
                name: w.dataset.name,
                icon: w.dataset.icon,
                _wm_id: w.dataset._wm_id,
                active: (w.dataset.wm_order === '0' && w.dataset.wm_minimized !== 'true') // picks active
            }))

        if (wins.length === 0) return

        // sort them alphabetically
        wins.sort((w1, w2) => w1.name > w2.name)

        // append
        wins.forEach(w =>
            main_area.appendChild(createBtn(w)))
    }

    /* --- WINDOW BUTTONS --- */

    attachWindowButtons(win) {
        const closeBtn = win.querySelector('button[aria-label="Close"]')
        const maximizeBtn = win.querySelector('button[aria-label="Maximize"]')
        const minimizeBtn = win.querySelector('button[aria-label="Minimize"]')

        const closeWindow = () => {
            if ('_pm_id' in win.dataset) {
                window.pm.closeInstance(win.dataset._pm_id)
            }
            this.removeWindow(win)
        }

        const maximizeWindow = () => {
            if (win.dataset.wm_maximized === 'true') {
                let prevpos = win.dataset.wm_prev_pos.split(',')
                win.dataset.wm_maximized = false
                win.style.top  = prevpos[0]
                win.style.left = prevpos[1]
                maximizeBtn.setAttribute('aria-label', 'Maximize')
            } else {
                win.dataset.wm_prev_pos = `${win.style.top},${win.style.left}`
                win.dataset.wm_maximized = true
                maximizeBtn.setAttribute('aria-label', 'Restore')
            }
            if ('_pm_id' in win.dataset) {
                window.pm.instances[win.dataset._pm_id].onResize()
                window.pm.instances[win.dataset._pm_id].onResizeEnd()
            }
        }

        if (closeBtn) {
            closeBtn
                .addEventListener('click', closeWindow)
            closeBtn
                .addEventListener('touchend', closeWindow)
        }
        if (maximizeBtn) {
            maximizeBtn
                .addEventListener('click', maximizeWindow)
            maximizeBtn
                .addEventListener('touchend', maximizeWindow)
        }
        if (minimizeBtn) {
            minimizeBtn
                .addEventListener('click', () => {
                    this.minimizeWindow(win)
                })
            minimizeBtn
                .addEventListener('touchend', () => {
                    this.minimizeWindow(win)
                })
                
        }
    }

    minimizeWindow(win) {
        win.dataset.wm_minimized = true
        // if this window was the active one we need to figure out
        // which one should be the next active window
        if (win.dataset.wm_order === '0') {
            let parentLen = document.querySelector('.window-host').children.length

            // this could've been recursive but wasn't
            for (let i = 1; i < parentLen; i++) {
                // look for the next not minimized window
                let nextwin = document.querySelector(`[data-wm_order="${i}"]`)
                if (nextwin && nextwin.dataset.wm_minimized !== 'true') {
                    this.windowFocus(nextwin)
                    return
                }
            }
            this.redrawTaskbarMain()
        }

        if ('_pm_id' in win.dataset) {
            window.pm.instances[win.dataset._pm_id].onResize()
            window.pm.instances[win.dataset._pm_id].onResizeEnd()
        }
    }

    /* --- OPEN WINDOW --- */

    openWindow({name, icon, title, resizable, x, y, width, height, margin, app}, body, cb) {
        const winhost = document.querySelector('.window-host')
        const win = document.createElement('div')

        // create ID and attach it
        const wm_id = this.createID()
        win.dataset._wm_id = wm_id

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

        // compute what controls are necessary
        let controls = []
        if (name) {
            controls.push('<button aria-label="Minimize"></button>')
        }
        if (resizable) {
            controls.push('<button aria-label="Maximize"></button>')
        }

        controls = controls.join('\n')

        // misc styling
        if (margin === false) {
            margin = 'window-body--nomargin'
        } else {
            margin = ''
        }
        if (app === true) {
            app = 'window-body--app'
        } else {
            app = ''
        }


        win.classList.add('window')
        win.innerHTML = `
            <div class="title-bar">
                <div class="title-bar-text">${title}</div>
                <div class="title-bar-controls">
                    ${controls}
                    <button aria-label="Close"></button>
                </div>
            </div>
            <div class="window-body ${margin} ${app}">
                ${body}
            </div>
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

        // apply sizing afterwards to stamp minimum resize
        if (width !== undefined) {
            win.style.width = `${width}px`
        }
        if (height !== undefined) {
            win.style.height = `${height}px`
        }

        // add a callback if necessary
        if (cb) {
            cb(win)
        }
    }

    cleanupAfterMoveEnd() {
        document.querySelectorAll('[data-isdragging="true"]')
            .forEach(el => el.dataset.isdragging = false)
        document.querySelectorAll('[data-isresizing="true"]')
            .forEach(el => el.dataset.isresizing = false)
    }

    minimizeAll() {
        for (let win of document.querySelectorAll('.window[data-window]')) {
            win.dataset.wm_minimized = true
        }
        this.redrawTaskbarMain()
    }
}


/* --- MOUSE POSITIONING --- */

class MouseManager {
    constructor() {
        window.mouse = {}

        // attach and detach event listeners on mouseup/mousedown for performance
        document.body.addEventListener('mousedown', () =>
            document.body.addEventListener('mousemove', this.updateMousePos))
        document.body.addEventListener('mouseup', () => {
            document.body.removeEventListener('mousemove', this.updateMousePos)
            this.cleanup()
        })

        this.cleanup_events = []

        // this can stay permanently attached -- we care about all touches
        document.body.addEventListener('touchmove', this.updateMousePos.bind(this))
        document.body.addEventListener('touchend', this.cleanup.bind(this))
    }

    addMouseupListener(fn) {
        this.cleanup_events.push(fn)
    }

    updateMousePos(e) {
        // this is required because you can drag faster than a dom event
        // can fire, and when your mouse exits a window title bar you can
        // no longer drag it.
        e = convertIfTouch(e)
        window.mouse = {x: e.clientX, y: e.clientY}
    }

    cleanup() {
        for (let fn of this.cleanup_events) {
            fn()
        }
        window.mouse = {}
    }
}


// TOUCH SUPPORT


window.mm = new MouseManager()
window.wm = new WindowManager()

/* ICON MANAGEMENT */

class DesktopManager {

    constructor() {
        window.addEventListener('load', this.resizeSelectionCanvas.bind(this))
        window.addEventListener('resize', this.resizeSelectionCanvas.bind(this))
        window.addEventListener('orientationchange', this.resizeSelectionCanvas.bind(this))

        this.desktop = document.querySelector('.desktop')
        this.desktop_container = document.querySelector('.desktop-container')

        // attach icon behaviors
        this.desktop
            .querySelectorAll('.desktop-icon')
            .forEach(icon => {
                this.attachIconSelection(icon)
            })

        document.querySelector('.desktop')
            .addEventListener('click', this.handleClick.bind(this))

        this.canvas = document.querySelector('canvas#selections')
        this.sel_ctx = this.canvas.getContext('2d')
        this.drawing_selection = false
        this.skip_click        = false

        this.resizeSelectionCanvas()

        // attach selection events
        window.mm.addMouseupListener(() => this.handleSelectionEnd())
        if (isMobileBrowser()) {
            this.desktop_container
                .addEventListener('touchstart', this.handleSelectionStart.bind(this))
            this.desktop_container
                .addEventListener('touchend', this.handleSelectionEnd.bind(this))
        } else {
            this.desktop_container
                .addEventListener('pointerdown',  this.handleSelectionStart.bind(this))
            this.desktop_container
                .addEventListener('pointerup', this.handleSelectionEnd.bind(this))
        }

        // taskbar quick
        document.querySelectorAll('.task-bar__quick[data-launch]')
            .forEach(el => {
                el.addEventListener('click', () => window.pm.createInstance(el.dataset.launch))
            })
        
    }

    attachIconSelection(icon) {
        icon.addEventListener('click', () => {
            document.querySelector('.desktop')
                .querySelectorAll('.desktop-icon[data-active="true"]')
                .forEach(el => el.dataset.active = false)

            icon.dataset.active = true
        })
        


        const openProgram = e => {
            e.preventDefault()
            if ('launch' in icon.dataset) {
                window.pm.createInstance(icon.dataset.launch)
            } else {
                window.wm.openWindow({title: 'Sorry!'}, `
                    <p>It doesn't work.</p>
                `)
            }
        }

        icon.addEventListener('dblclick', openProgram)

        if (isMobileBrowser()) {
            // on mobile, fire this on a single click
            icon.addEventListener('click', openProgram)
        }
    }

    clearIconSelections() {
        document.querySelector('.desktop')
            .querySelectorAll('.desktop-icon[data-active="true"]')
            .forEach(el => el.dataset.active = false)
    }

    handleClick(e) {
        // ensure that we're not firing a click after a selection event
        if (this.skip_click === true) {
            this.skip_click = false
            return
        }

        let assertNotIcon = target => {
            if (target === document.body) return true
            if (target.classList.contains('desktop-icon')) return false
            return assertNotIcon(target.parentNode)
        }

        if (!assertNotIcon(e.target)) return

        this.clearIconSelections()
    }

    checkIconOverlap(icon, x1, y1, x2, y2) {
        let rect = icon.getBoundingClientRect()

        /*
         * Conditions for missing an overlap:
         *      - top edge of sel box is below bottom edge of icon
         *      - left edge of sel box is past right edge of icon
         *      - right edge of sel box is past left edge of icon
         *      - bottom edge of sel box is above top edge of icon
         */

        let i_x1 = rect.x * window.devicePixelRatio
        let i_y1 = rect.y * window.devicePixelRatio

        let i_x2 = (rect.x + rect.width ) * window.devicePixelRatio
        let i_y2 = (rect.y + rect.height) * window.devicePixelRatio


        if (!(Math.min(y1,y2) > i_y2  ||
              Math.max(y1,y2) < i_y1) &&
            !(Math.min(x1,x2) > i_x2  ||
              Math.max(x1,x2) < i_x1)
        ) {
            return true
        }
        return false
    }

    resizeSelectionCanvas() {
        const canvas = document.querySelector('canvas#selections')
        const taskbarHeight = document
            .querySelector('.task-bar')
            .getBoundingClientRect()
            .height

        // get the naive sizing
        let canvas_width = window.innerWidth
        let canvas_height = window.innerHeight - taskbarHeight
        
        // first set the canvas dom element size
        canvas.style.height = `${canvas_height}px`
        canvas.style.width  = `${canvas_width}px`


        // fix the dpi scaling
        let dpi = window.devicePixelRatio


        canvas.setAttribute('width',  canvas_width  * dpi)
        canvas.setAttribute('height', canvas_height * dpi)

        this.canvas_size = {
            width:  canvas_width  * dpi,
            height: canvas_height * dpi
        }

    }

    clearSelectionRect() {
        // clear a rectangle the size of the canvas
        this.sel_ctx.clearRect(0,0,this.canvas_size.width,this.canvas_size.height)
    }

    drawSelectionRect(x1, y1, x2, y2) {

        // scale dpi to match screen pixels to canvas pixels
        let dpi = window.devicePixelRatio
        x1 *= dpi
        y1 *= dpi
        x2 *= dpi
        y2 *= dpi

        // clear the previous one (if any)
        this.clearSelectionRect()

        // begin draw

        this.sel_ctx.beginPath()

        this.sel_ctx.lineWidth = '1px'
        this.sel_ctx.strokeStyle = 'red'
        this.sel_ctx.setLineDash([1])

        // x, y, width, height
        this.sel_ctx.rect(x1, y1, x2 - x1, y2 - y1)

        this.sel_ctx.stroke()

        for (let icon of this.desktop.querySelectorAll('.desktop-icon')) {
            if (this.checkIconOverlap(icon, x1, y1, x2, y2)) {
                icon.dataset.active = true
            } else {
                icon.dataset.active = false
            }
        }
    }


    handleSelectionStart(e) {
        window.mm.updateMousePos(e)

        this.drawing_selection = true
        this.initial_selection_start = {
            x: window.mouse.x,
            y: window.mouse.y
        }

        const updateSelection = () => {
            // conditional hoisted to not break clicking/dblclicking
            if (this.drawing_selection) {

                this.skip_click = true

                this.drawSelectionRect(
                    this.initial_selection_start.x,
                    this.initial_selection_start.y,
                    window.mouse.x,
                    window.mouse.y
                )

                window.requestAnimationFrame(updateSelection)
            }
        }
        setTimeout(updateSelection, 250)
    }

    handleSelectionEnd(e) {
        this.drawing_selection = false
        this.clearSelectionRect()
        // hacky, but this keeps the selections from instantly disappearing
        setTimeout(() => this.skip_click = false, 100) 
    }


}

window.dm = new DesktopManager()

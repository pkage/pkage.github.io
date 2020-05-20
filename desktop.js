/* ICON MANAGEMENT */

class DesktopManager {

    constructor() {
        window.addEventListener('load', this.resizeSelectionCanvas)
        window.addEventListener('resize', this.resizeSelectionCanvas)
        window.addEventListener('orientationchange', this.resizeSelectionCanvas)

        this.desktop = document.querySelector('.desktop')

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
        this.desktop
            .addEventListener('touchstart', this.handleSelectionStart.bind(this))
        this.desktop
            .addEventListener('mousedown',  this.handleSelectionStart.bind(this))

        this.desktop
            .addEventListener('mouseup', this.handleSelectionEnd.bind(this))
        this.desktop
            .addEventListener('touchend', this.handleSelectionEnd.bind(this))
        
    }

    attachIconSelection(icon) {
        icon.addEventListener('click', () => {
            document.querySelector('.desktop')
                .querySelectorAll('.desktop-icon[data-active="true"]')
                .forEach(el => el.dataset.active = false)

            icon.dataset.active = true
        })
        icon.addEventListener('dblclick', () => {
            window.wm.openWindow({title: 'Sorry!'}, `
                <p>It doesn't work.</p>
            `)
        })
    }

    clearIconSelections() {
        console.trace()
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
        // for simplicity we'll call it a hit if the centroid is in the
        // selection box

        let center_x = (rect.x + (rect.width  / 2)) * window.devicePixelRatio
        let center_y = (rect.y + (rect.height / 2)) * window.devicePixelRatio

        if (Math.min(x1,x2) <= center_x && center_x <= Math.max(x1,x2)) {
            if (Math.min(y1,y2) <= center_y && center_y <= Math.max(y1,y2)) {
                return true
            }
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

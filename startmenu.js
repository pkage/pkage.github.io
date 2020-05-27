class StartMenuManager {
    constructor() {
        this.bg   = document.querySelector('.start-menu__container')
        this.menu = document.querySelector('.start-menu')
        this.btn  = document.querySelector('#start-btn')

        this.btn.addEventListener('click', this.openStartMenu.bind(this))
        this.bg.addEventListener('click', this.startMenuBackgroundClick.bind(this))

        this.menu.querySelectorAll('[data-launch]')
            .forEach(el => this.attachLaunchClickHandler(el))

        this.menu.querySelectorAll('a')
            .forEach(el => this.attachLinkClickHandler(el))
    }

    openStartMenu() {
        this.bg.style.display = 'block'
        this.btn.classList.add('start-btn--active')
    }

    startMenuBackgroundClick(e) {
        if (e.target !== this.bg) {
            return
        }
        this.closeStartMenu()
    }

    closeStartMenu() {
        this.bg.style.display = 'none'
        this.btn.classList.remove('start-btn--active')
        
    }
    
    attachLaunchClickHandler(el) {
        if (!el.dataset.launch) {return;}
        el.addEventListener('click', () => {
            this.closeStartMenu()
            window.pm.createInstance(el.dataset.launch)
        })
    }

    attachLinkClickHandler(el) {
        el.addEventListener('click', () => this.closeStartMenu())
    }
}

window.sm = new StartMenuManager()

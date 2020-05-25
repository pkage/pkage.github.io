class StartMenuManager {
    constructor() {
        this.bg   = document.querySelector('.start-menu__container')
        this.menu = document.querySelector('.start-menu')
        this.btn  = document.querySelector('#start-btn')

        this.btn.addEventListener('click', this.openStartMenu.bind(this))
        this.bg.addEventListener('click', this.closeStartMenu.bind(this))
    }

    openStartMenu() {
        this.bg.style.display = 'block'
        this.btn.classList.add('start-btn--active')
    }

    closeStartMenu(e) {
        if (e.target !== this.bg) {
            return
        }
        this.bg.style.display = 'none'
        this.btn.classList.remove('start-btn--active')
        
    }

}

window.sm = new StartMenuManager()

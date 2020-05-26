class WelcomeProgram extends Program {
    createWindow() {
        let body   = window.__welcomepage
        let wminfo = {
            title: 'Welcome!',
            name:  'Welcome!',
            icon:  'img/taskbar/WindowsFlagSmall.png',
        }

        return [wminfo, body]
    }

    onAttach() {
        this.getBodyHandle().classList.add('typography')

        this.getBodyHandle()
            .querySelector('[data-upgrade="intro-launchresume"]')
            .addEventListener('click', e => {
                e.preventDefault()
                window.pm.createInstance('resume')
            })
    }
}

window.pm.registerPrototype('welcome', WelcomeProgram)

class DoomProgram extends Program {
    isMobileBrowser() {
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    }

    createWindow() {
        let body   = ''
        let wminfo = {
            title: 'DOOM.EXE',
            name:  'Doom',
            icon:  'img/desktop/MSDOS.png',
            resizable: true,
            width: 480,
            height: 360,
            x: 75,
            y: 75
        }

        if (this.isMobileBrowser()) {
            wminfo = {
                ...wminfo,
                width: 360,
                height: 240,
            }
        }

        const bundle_url = `dos/doom.jsdos`
        const src = `//em.ka.ge/player?img=${encodeURIComponent(bundle_url)}`;
        body = `
            <iframe
                style="width: calc(100% - 4px); height: 100%"
                src="${src}">
            </iframe>
        `

        return [wminfo, body]
    }

    onAttach() {
        if (!this.isMobileBrowser()) {
            this.getBodyHandle().style.margin = 0
        } else {
            this.getBodyHandle()
                .querySelector('button.doom__close')
                .addEventListener('click', this.closeWindow.bind(this))
        }
        this.getBodyHandle()
            .querySelector('iframe')
            .focus()
    }
}

window.pm.registerPrototype('doom', DoomProgram)

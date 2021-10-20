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
            resizable: true
        }
        if (this.isMobileBrowser() && false) {
            body = `
                <div class="window__dialog">
                    <div class="window__dialog-info">
                        <img src="img/dialog/Error.png"/>
                        <p>
                            There's literally no way this will work on your phone. Try on a laptop?
                        </p>
                    </div>
                    <div class="window__dialog-action">
                        <button class="doom__close">Makes sense.</button>
                    </div>
                </div>
            `
            wminfo = {
                ...wminfo,
                resizable: false
            }
        } else {
            const bundle_url = `https://doszone-uploads.s3.dualstack.eu-central-1.amazonaws.com/original/2X/8/80ba33210cab4177158dde6f2ec9704de56c7dfc.jsdos`
            const src = `//dos.zone/en/player/${encodeURIComponent(bundle_url)}`;
            body = `
                <iframe
                    style="width: calc(100% - 4px); height: 100%"
                    src="${src}">
                </iframe>
            `
            wminfo = {
                ...wminfo,
                width: 480,
                height: 360,
                x: 75,
                y: 75
            }

        }

        console.log(wminfo)

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
    }
}

window.pm.registerPrototype('doom', DoomProgram)

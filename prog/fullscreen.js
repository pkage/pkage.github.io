class FullscreenProgram extends Program {
    createWindow(argument) {

        let winfo = {
            name: 'Fullscreen',
            title: 'Fullscreen Toggle',
            icon: 'img/desktop/ProgMan.png',
        }

        let body = `
            <div class="window__dialog">
                <div class="window__dialog-info">
                    <img src="/img/desktop/BatchFile.png" style="width:32px;height:32px;"/>
                    <p>
                       Run website in fullscreen?
                    </p>
                </div>
                <div class="window__dialog-action">
                    <button autofocus>Request fullscreen</button>
                </div>
            </div>
        `

        return [winfo, body]
    }

    onAttach() {
        this.getBodyHandle()
            .querySelector('button')
            .addEventListener('click', () => {
                document.body.parentElement.requestFullscreen()
                    .then(() => this.closeWindow())
                    .catch(() => {})
            })
    }

}

window.pm.registerPrototype('fullscreen', FullscreenProgram)

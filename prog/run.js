class RunProgram extends Program {
    createWindow() {
        let winfo = {
            title: 'Run',
            name: 'Run',
            y: window.innerHeight - 180,
            x: 10,
            app: true
        }

        let body = `
                <div class="window__dialog">
                    <div class="window__dialog-info">
                        <img src="img/startmenu/Run.png"/>
                        <p>
                            Type the name of a program, folder, document, or Internet <br/>
                            resource and Windows will open it for you.
                        </p>
                    </div>
                    <div class="menu-bar__menu run__runbar">
                        <span class="menu-bar__label">Open:</span>
                        <input class="menu-bar__input" autofocus type="text" name="prog">
                    </div>
                    <div class="window__dialog-action">
                        <button class="run__open">OK</button>
                        <button class="run__close">Cancel</button>
                    </div>
                </div>
        `

        return [winfo, body]
    }

    launchProgram() {
        let prog = this.getBodyHandle()
            .querySelector('input[name="prog"]')
            .value

        window.pm.createInstance(prog)
        this.closeWindow()
    }

    handleKeyUp(e) {
        if (e.keyCode === 13) {
            this.launchProgram()
        }
    }

    onAttach() {
        this.getBodyHandle()
            .querySelector('button.run__close')
            .addEventListener('click', this.closeWindow.bind(this))

        this.getBodyHandle()
            .querySelector('button.run__open')
            .addEventListener('click', this.launchProgram.bind(this))


        this.getBodyHandle()
            .querySelector('input[name="prog"]')
            .addEventListener('keyup', this.handleKeyUp.bind(this))
    }
}

window.pm.registerPrototype('run', RunProgram)

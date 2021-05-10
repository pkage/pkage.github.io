class TerminalProgram extends Program {
    createWindow() {
        let wminfo = {
            name: 'Terminal',
            title: 'Linux Terminal',
            icon: 'img/desktop/Linux.png',
            resizable: true
        }

        let body = `
            <div class="prompt__terminal"></div>
        `

        return [wminfo, body]
    }

    onResize() {
        this.term.fit()
        this.setWindowTitle(`Linux Terminal - ${this.term.rows}x${this.term.cols}`)
    }

    onResizeEnd() {
        if (this.upstream !== null) {
            this.upstream.resize(this.term.rows, this.term.cols)
        }
    }

    async onAttach() {
        this.getBodyHandle().parentElement.style.backgroundColor = 'black'
        Terminal.applyAddon(fit)
        Terminal.applyAddon(attach)
        this.term = new Terminal({
            cols: (isMobileBrowser()) ? 30 : 60,
            height: 24,
            cursorStyle: 'underline'
        })
        this.term.open(this.getBodyHandle())

        this.upstream = await window.vm.createTerminal()
        if (this.upstream === null) {
            this.term.write('No vm connected!')
            return
        }
        this.term.write('[Attempting to connect...]\r')
        this.term.attach(this.upstream.socket, false, false)
        this.upstream.socket.onopen = () => {
            this.term.write('[Connected to VM agent]     ')
            this.onResize()
            this.onResizeEnd()
        }
        this.upstream.socket.onclose = this.upstream.socket.onerror = () => {
            this.term.write('\r\n[Connection lost]')
        }

        this.term.on('data', data => this.upstream.send_input(data.toString()))

        //this.getBodyHandle().addEventListener('keyup', this.onKey.bind(this))
    }

    onClose() {
        console.log('window closing...')
        this.upstream.terminate()
    }
}

window.pm.registerPrototype('terminal', TerminalProgram)

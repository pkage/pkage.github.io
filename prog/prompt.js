class PromptProgram extends Program {
    createWindow() {
        let wminfo = {
            name: 'Prompt',
            title: 'MS-DOS Prompt',
            icon: 'img/desktop/MSDOS.png'
        }

        let body = `
            <div class="prompt__terminal"></div>
        `

        return [wminfo, body]
    }

    onAttach() {
        Terminal.applyAddon(fit)
        this.term = new Terminal({
            cols: 60,
            height: 24,
            cursorStyle: 'underline'
        })
        this.term.open(this.getBodyHandle())
        this.term.write('\nMicrosoft Windows 98\r\n    squeezed into a web page\r\n')
        this.writePrompt()

        this.getBodyHandle().addEventListener('keyup', this.onKey.bind(this))

    }

    writePrompt() {
        this.term.write('\r\nC:\\>')
        this.currentInput = ''
    }

    exec() {
        if (window.pm.hasPrototype(this.currentInput)) {
            window.pm.createInstance(this.currentInput)
        } else if (this.currentInput === 'exit') {
            this.close()
        } else {
            this.term.writeln(`\r\n'${this.currentInput}' is not recognized as an internal or external command, operable program, or batch file.`)
        }
    }

    onKey(e) {
        const printable = e.key.length === 1

        if (e.keyCode === 13) {
            this.exec()
            this.writePrompt()
        } else if (e.keyCode === 8) {
            // Do not delete the prompt
            if (this.term._core.buffer.x > 4) {
                this.term.write('\b \b');
                this.currentInput = this.currentInput.slice(0, this.currentInput.length - 1)
            }
        } else if (e.key === 'c' && e.ctrlKey) {
            this.term.write('^C')
            this.writePrompt()
        } else if (e.key === 'd' && e.ctrlKey) {
            this.close()
        } else if (printable) {
            this.term.write(e.key);
            this.currentInput += e.key
        }
    }

    close() {
        wm.removeWindow(this.handle)
    }
}

window.pm.registerPrototype('prompt', PromptProgram)

class PromptProgram extends Program {
    createWindow() {
        let wminfo = {
            name: 'Prompt',
            title: 'MS-DOS Prompt',
            icon: 'img/desktop/MSDOS.png',
            resizable: true
        }

        let body = `
            <div class="prompt__terminal"></div>
        `

        return [wminfo, body]
    }

    onResize() {
        this.term.fit()
    }

    onAttach() {
        this.getBodyHandle().parentElement.style.backgroundColor = 'black'
        Terminal.applyAddon(fit)
        this.term = new Terminal({
            cols: (isMobileBrowser()) ? 30 : 60,
            height: 24,
            cursorStyle: 'underline'
        })
        this.term.open(this.getBodyHandle())
        this.term.write('\nMicrosoft Windows 98\r\n    squeezed into a web page\r\n')
        this.currentInput = ''
        this.writePrompt()

        this.getBodyHandle().addEventListener('keyup', this.onKey.bind(this))

    }

    writePrompt() {
        this.term.write('\r\nC:\\>')
    }

    printAllCommands() {
        this.term.write('\r\nAvaliable commands:\r\n    ')
        let cmds = Object.keys(window.pm.prototypes).join(', ')
        cmds += ', cls, exit, help, ?'
        this.term.writeln(cmds)
    }

    printDir() {
        let cmds = Object.keys(window.pm.prototypes).join('.exe\r\n')
        cmds = '\r\n' + cmds + '.exe\r\nhelp.exe'

        this.term.writeln(cmds)
        
    }

    exec() {
        let cmd = this.currentInput.replace(/^\s+|\s+$/g, '') // remove trailing whitespace

        if (cmd.slice(-4) === '.exe') {
            cmd = cmd.slice(0, -4)
        }

        if (window.pm.hasPrototype(cmd)) {
            window.pm.createInstance(cmd)
        } else if (cmd === '') {
            // no-op
        } else if (cmd === 'exit') {
            this.close()
        } else if (cmd === 'cls') {
            this.clearTerminal()
        } else if (cmd === 'help' || cmd === '?') {
            this.printAllCommands()
        } else if (cmd === 'dir') {
            this.printDir()
        } else {
            this.term.writeln(`\r\n'${cmd}' is not recognized as an internal or external command, operable program, or batch file.`)
        }
        this.currentInput = ''
    }

    clearTerminal() {
        this.term.clear()
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
        } else if (e.key === 'l' && e.ctrlKey) {
            this.clearTerminal()
        } else if (printable) {
            this.term.write(e.key);
            this.currentInput += e.key
        }
    }

    close() {
        wm.removeWindow(this.handle)
    }
}

window.pm.registerPrototype('cmd', PromptProgram)

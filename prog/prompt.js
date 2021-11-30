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
        this.term.writeln(`\r
 Volume in drive C is KAGE-DOS\r
 Volume Serial Number is 8BAD-F00D\r
 Directory of C:\\\r
`)
        // .\t<DIR>\t\t08-25-1998\t11:17p\r\n
        // ..\t<DIR>\t\t08-25-1998\t11:17p\r\n
        let get_byte_size = () => 100 + Math.floor(Math.random() * 156)
        let cmds = Object.keys(window.pm.prototypes)
        cmds.push('help')
        cmds.push('exit')

        const maxlen = Math.max(...cmds.map(c => c.length))
        const rpad = (s, len) => {
            return s + (new Array(len - s.length).fill(' ').join(''))
        }
        const lpad = (s, len) => {
            return (new Array(len - s.length).fill(' ').join('')) + s
        }
        

        let cmds_txt = cmds
            .map(c => `${rpad(c, maxlen)}  EXE          ${get_byte_size()}  08-25-1998  11:17p\r\n`)
            .join('')

        this.term.writeln(`${rpad('.', maxlen)}        <DIR>       08-25-1998  11:17p`)
        this.term.writeln(`${rpad('..', maxlen)}        <DIR>       08-25-1998  11:17p`)
        this.term.write(cmds_txt)
        
        this.term.writeln(`          ${cmds.length} file(s)      ?? bytes`)
        this.term.writeln(`                         ??? bytes free`)
    }

    exec() {
        let cmd = this.currentInput.replace( /^\s+|\s+$/g, '') // remove trailing whitespace

        if (cmd.slice(-4) === '.exe') {
            cmd = cmd.slice(0, -4)
        }

        let prog_name = cmd.split(':')[0]

        if (window.pm.hasPrototype(prog_name)) {
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

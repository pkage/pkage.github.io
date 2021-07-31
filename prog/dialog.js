class DialogProgram extends Program {

    createWindow(argument) {
        console.log(`launched dialog with ${argument}`)

        // interpret argument
        let icon   = 'img/dialog/Error.png'
        let title  = 'Dialog error'
        let text   = `Dialog program initialized incorrectly<br>called with <code>${argument}</code><br>Correct: dialog:icon|title|text|action`
        let action = 'OK'

        if (argument !== null) {
            argument = argument.split('|')
            if (argument.length === 4) {
                if (argument[0].indexOf('/') !== -1) {
                    icon = argument[0]
                } else {
                    icon = `img/dialog/${argument[0]}.png`
                }

                title  = argument[1]
                text   = argument[2]
                action = argument[3]
            }
        }


        let winfo = {
            title,
            width: 300
        }

        let buttongroup;

        if (action === 'ARI') {
            buttongroup = `
                <button autofocus>Abort</button>
                <button>Retry</button>
                <button>Ignore</button>
            `
        } else {
            buttongroup = `<button autofocus>${action}</button>`
        }

        let body = `
            <div class="window__dialog">
                <div class="window__dialog-info">
                    <img src="${icon}" style="width:32px;height:32px;"/>
                    <p>
                       ${text}
                    </p>
                </div>
                <div class="window__dialog-action">
                    ${buttongroup}
                </div>
            </div>
        `

        return [winfo, body]
    }

    onAttach() {
        this.getBodyHandle()
            .querySelectorAll('button')
            .forEach(el => el
                .addEventListener('click', this.closeWindow.bind(this))
            )

        this.getBodyHandle()
            .querySelectorAll('button')[0].focus()
    }
}

window.pm.registerPrototype('dialog', DialogProgram)

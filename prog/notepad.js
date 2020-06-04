class NotepadProgram extends Program {
    createWindow() {
        let winfo = {
            name: 'Notepad',
            title: 'Notepad',
            icon: 'img/desktop/Notepad.png',
            resizable: true,
            margin: false,
            app: true
        }

        let body = `
            <div class="menu-bar__container">
                <div class="menu-bar__menu">
                    <div class="menu-bar__handle"></div>
                    <span class="menu-bar__item">
                        File
                    </span>
                    <span class="menu-bar__item">
                        Edit
                    </span>
                    <span class="menu-bar__item">
                        Search
                    </span>
                    <span class="menu-bar__item">
                        Help
                    </span>
                </div>
            </div>
            <textarea class="notepad__textarea"></textarea>
        `

        return [winfo, body]
    }
}

window.pm.registerPrototype('notepad', NotepadProgram)

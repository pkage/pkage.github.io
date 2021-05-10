class RemoteFolder extends Folder {
    static async fetchFolder(root_url, path) {
        const path_q = encodeURIComponent(path)

        let req = await fetch(`${root_url}/fs?path=${path_q}`)
        req = await req.json()

        const contents = req.files
            .map(f => ({
                img: 'img/desktop/TextFile.png',
                title: f,
                launch: 'cmd'
            }))

        const data = {
            name: path,
            icon: 'img/desktop/Folder',
            title: path,
            contents
        }
        
        const target_folder = new RemoteFolder(data)

        for (let child in req.folders) {
            
        }
    }
}

class VMTerminal {
    constructor(host) {
        this.socket = new WebSocket(`ws://${host}/terminal`)
    }

    _send(type, data) {
        this.socket.send(JSON.stringify({type,data}))
    }

    resize(rows, cols) {
        this._send(
            'resize',
            {rows, cols}
        )
    }

    terminate() {
        this._send('terminate')
        this.socket.close()
    }

    send_input(data) {
        this._send(
            'keys',
            data
        )
    }
}

class VMManager {
    constructor() {
        this.remote = 'localhost:8080'
    }

    async createTerminal() {
        return new VMTerminal(this.remote)
    }

    async getRootFolder() {
        
    }
}

window.vm = new VMManager()

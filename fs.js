class Folder {
    constructor(data) {
        this.parent = null
        this.children = {}

        this.data = {
            name: 'folder',
            icon: 'img/desktop/Folder.png',
            title: 'Folder',
            contents: [],
        }
        
        if (data !== undefined) {
            this.data = {
                ...this.data,
                ...data
            }
        }
    }

    calculatePath() {
        if (this.parent === null) {
            return ['C:']
        }

        return [
            ...this.parent.calculatePath(),
            this.getName()
        ]
    }

    getName() {
        return this.data.name
    }

    getIcon() {
        return this.data.icon
    }

    getContents() {
        return this.data.contents
    }

    getChildren() {
        return this.children
    }

    addChild(child) {
        child.parent = this
        this.children[child.getName()] = child
    }

    async getChild(name) {
        if (!(name in this.children)) {
            return null
        }
        return this.children[name]
    }
}

class Filesystem {
    constructor() {
        this.root = new Folder({name: 'C:', title: 'C:'})
    }

    async get(path) {
        const segs = path.split('/')

        if (segs.length === 1) {
            return this.root
        }

        const searcher = async (segs, folder) => {
            if (folder === null) return null

            if (segs.length === 0) {
                return folder
            }

            const next = await folder.getChild(segs[0])

            return await searcher(segs.slice(1), next)
        }

        return await searcher(segs.slice(1), this.root)
    }

    addChild(folder) {
        this.root.addChild(folder)
    }
}

window.fs = new Filesystem()

/* --- DEFAULT FILESYSTEM --- */
window.fs.addChild(new Folder({
    icon: 'img/desktop/MyDocuments.png',
    name: 'My Documents',
    contents: [
        {
            img: 'img/desktop/WordPad.png',
            title: 'Resume.pdf',
            launch: 'resume'
        },
        {
            img: 'img/desktop/InternetExplorer.png',
            title: 'GitHub',
            shortcut: true,
            launch: 'web:https://github.com/pkage'
        },
        {
            img: 'img/desktop/InternetExplorer.png',
            title: 'LinkedIn',
            shortcut: true,
            launch: 'web:https://www.linkedin.com/in/patrick-kage-652ba8122/'
        },
        {
            img: 'img/desktop/InternetExplorer.png',
            title: 'Keybase',
            shortcut: true,
            launch: 'web:https://keybase.io/pkage'
        },
        {
            img: 'img/desktop/InternetExplorer.png',
            title: 'My Blog',
            shortcut: true,
            launch: 'web:https://ka.ge/blog/'
        },
        {
            img: 'img/desktop/Email.png',
            title: 'Email',
            shortcut: true,
            launch: 'web:mailto:patrick@ka.ge'
        },
        {
            img: 'img/desktop/MyBriefcase.png',
            title: 'My Portfolio',
            shortcut: true,
            launch: 'portfolio'
        },
        {
            img: 'img/desktop/SystemFile.png',
            title: 'Welcome',
            shortcut: true,
            launch: 'welcome'
        }
    ]
}))

window.fs.addChild(new Folder({
    name: 'Recycling Bin',
    icon: 'img/desktop/RecyclingBin.png',
    contents: [
        {
            img: 'img/desktop/InternetExplorer.png',
            title: 'Twitter',
            shortcut: true,
            launch: 'web:https://twitter.com/patrick_kage'
        },
        {
            img: 'img/desktop/WavFile.png',
            title: 'roll.wav',
            shortcut: true,
            launch: 'web:https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
    ]
}))

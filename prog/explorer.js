class ExplorerProgram extends Program {

    createIcon({img, title, launch, shortcut}) {
        let icon = document.createElement('div')

        if (shortcut === true) {
            shortcut = `
                <div class="desktop-icon__shortcut">
                    <img src="img/ShortcutIcon.png"/>
                </div>
            `
        } else {
            shortcut = ''
        }
        icon.innerHTML = `
            <img src="${img}" alt="${title}">
            ${shortcut}
            <span>${title}</span>
        `
        icon.classList.add('desktop-icon')
        icon.dataset.launch = launch

        // selection event
        icon.addEventListener('click', () => {
            icon.parentElement
                .querySelectorAll('.desktop-icon[data-active="true"]')
                .forEach(el => el.dataset.active = false)

            icon.dataset.active = true
        })


        icon.addEventListener('dblclick', () => this.openProgram(launch))

        if (isMobileBrowser()) {
            icon.addEventListener('click', () => this.openProgram(launch))
        }

        return icon
    }

    // abstract
    iconsToCreate() {
        return []
    }
    getWindowTitle() {
        return 'Explorer'
    }
    getWindowIcon() {
        return 'img/desktop/Folder.png'
    }

    openProgram(launch) {
        window.pm.createInstance(launch)
    }

    createWindow() {
        let wminfo = {
            name: this.getWindowTitle(),
            title: this.getWindowTitle(),
            icon: this.getWindowIcon(),
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
                        View
                    </span>
                    <span class="menu-bar__item">
                        Go
                    </span>
                    <span class="menu-bar__item">
                        Favorites
                    </span>
                    <span class="menu-bar__item">
                        Help
                    </span>
                </div>

                <div class="menu-bar__hr"></div>
                
                <div class="menu-bar__menu">
                    <div class="menu-bar__handle"></div>
                    <div class="menu-bar__btn menu-bar__btn--disabled">
                        <img src="img/explorer/Back.png"/>
                        <span>Back</span>
                    </div>
                    <div class="menu-bar__btn menu-bar__btn--disabled">
                        <img src="img/explorer/Forward.png"/>
                        <span>Forward</span>
                    </div>
                    <div class="menu-bar__btn">
                        <img src="img/explorer/Up.png"/>
                        <span>Up</span>
                    </div>
                    <div class="menu-bar__divider"></div>
                    <div class="menu-bar__btn">
                        <img src="img/explorer/Cut.png"/>
                        <span>Cut</span>
                    </div>
                    <div class="menu-bar__btn">
                        <img src="img/explorer/Copy.png"/>
                        <span>Copy</span>
                    </div>
                    <div class="menu-bar__btn">
                        <img src="img/explorer/Paste.png"/>
                        <span>Paste</span>
                    </div>
                    <div class="menu-bar__divider"></div>
                </div>

                <div class="menu-bar__hr"></div>

                <div class="menu-bar__menu">
                    <div class="menu-bar__handle"></div>
                    <span class="menu-bar__label"> Address </span>
                    <select class="menu-bar__dropdown">
                        <option selected>
                            ${this.getWindowTitle()}
                        </option>
                    </select>
                </div>
            </div>
            <div class="explorer__body">
                <div class="explorer__bodysidebar">
                </div>
                <div class="explorer__desktop">
                </div>
            </div>
        `

        return [wminfo, body]
    }

    onAttach() {
        this.desktop = this.getBodyHandle()
            .querySelector('.explorer__desktop')

        this.desktop
            .addEventListener('click', e => {
                let assertNotIcon = target => {
                    if (target === document.body) return true
                    if (target.classList.contains('desktop-icon')) return false
                    return assertNotIcon(target.parentNode)
                }

                if (!assertNotIcon(e.target)) return

                this.desktop
                    .querySelectorAll('.desktop-icon[data-active="true"]')
                    .forEach(el => el.dataset.active = false)
            })

        
        for (let icon of this.iconsToCreate()) {
            this.desktop
                .appendChild(this.createIcon(icon))
        }
    }
}


/* --- SUBCLASSES --- */

class MyDocumentsProgram extends ExplorerProgram {
    getWindowIcon() {
        return 'img/desktop/MyDocuments.png'
    }
    getWindowTitle() {
        return 'My Documents'
    }

    iconsToCreate() {
        return [
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
    }
}

class RecyclingBinProgram extends ExplorerProgram {
    getWindowIcon() {
        return 'img/desktop/RecyclingBin.png'
    }
    getWindowTitle() {
        return 'Recycling Bin'
    }

    iconsToCreate() {
        return [
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
    }
}


window.pm.registerPrototype('explorer', ExplorerProgram)
window.pm.registerPrototype('mydocuments', MyDocumentsProgram)
window.pm.registerPrototype('recyclingbin', RecyclingBinProgram)


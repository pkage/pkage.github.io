class EmailProgram extends Program {
    createWindow() {
        let winfo = {
            title: 'Compose New Email',
            name: 'Email',
            icon: 'img/desktop/Email.png',
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
                <div class="menu-bar__hr"></div>
                <div class="menu-bar__menu">
                    <div class="menu-bar__handle"></div>
                    <span class="menu-bar__label">
                        To:
                    </span>
                    <input class="menu-bar__input" type="text" value="patrick@ka.ge" disabled>
                </div>
                <div class="menu-bar__hr"></div>
                <div class="menu-bar__menu">
                    <div class="menu-bar__handle"></div>
                    <span class="menu-bar__label" class="menu-bar__label">
                        CC:
                    </span>
                    <input class="menu-bar__input" type="email" name="cc"/>
                </div>
                <div class="menu-bar__hr"></div>
                <div class="menu-bar__menu">
                    <div class="menu-bar__handle"></div>
                    <span class="menu-bar__label">
                        Subject:
                    </span>
                    <input class="menu-bar__input" type="text" name="subject" autocomplete="off"/>
                </div>
            </div>
            <textarea class="email__body"></textarea>
            <div class="menu-bar__menu">
                <div class="menu-bar__spacer"></div>
                <a href="#" target="_blank" class="email__send">
                    <button type="button">
                        Send
                    </button>
                </a>
            </div>
        `

        return [winfo, body]
    }

    generateMailto() {
        let subject = this.getBodyHandle()
            .querySelector('input[name="subject"]')
            .value

        let cc = this.getBodyHandle()
            .querySelector('input[name="cc"]')
            .value

        let body = this.getBodyHandle()
            .querySelector('textarea.email__body')
            .value

        // need to replace %0A with %0D%0A
        body = window.encodeURIComponent(body)
        body = body.replace(/%0A/g, '%0D%0A')

        // subject & cc are less important
        subject = encodeURIComponent(subject)
        cc      = encodeURIComponent(cc)

        let href = `mailto:patrick@ka.ge?subject=${subject}&cc=${cc}&body=${body}`

        this.getBodyHandle()
            .querySelector('.email__send')
            .setAttribute('href', href)
    }

    onAttach() {
        this.generateMailto()

        this.getBodyHandle()
            .querySelectorAll('textarea,input')
            .forEach(el => {
                console.log('attaching to ', el)
                el.addEventListener('keyup', this.generateMailto.bind(this))
            })
    }
}

window.pm.registerPrototype('email', EmailProgram)

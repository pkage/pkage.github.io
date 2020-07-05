class ResumeProgram extends Program {
    isMobileBrowser() {
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    }

    createWindow() {
        let body   = ''
        let wminfo = {
            title: 'Resume Viewer',
            name:  'Resume Viewer',
            icon:  'img/desktop/WordPad.png',
            resizable: true
        }
        if (this.isMobileBrowser()) {
            body = `
                <iframe
                    src="//kage.dev/resume.pdf"
                    class="resume__iframe--mobile"
                    width="0"
                    height="0"> </iframe>
                <div class="window__dialog">
                    <div class="window__dialog-info">
                        <img src="img/desktop/TextFile.png"/>
                        <p>
                            Open resume in new tab?
                        </p>
                    </div>
                    <div class="window__dialog-action">
                        <button class="resume__close">No</button>
                        <a href="//kage.dev/resume.pdf" target="_blank">
                            <button autofocus>Yes</button>
                        </a>
                    </div>
                </div>
            `
            wminfo = {
                ...wminfo,
                resizable: false
            }
        } else {
            body = `
                <iframe src="//kage.dev/resume.pdf"> </iframe>
                <div class="resume__toolbar">
                    <a href="//kage.dev/resume.pdf" rel="noopener" target="_blank"> Open in New Tab </a>
                    <a href="//kage.dev/resume.pdf" download> Download </a>
                </div>
            `
            wminfo = {
                ...wminfo,
                width: Math.floor(window.innerWidth * 0.8 - 100),
                height: Math.floor(window.innerHeight * 0.8),
                x: 75,
                y: 75
            }

        }

        console.log(wminfo)

        return [wminfo, body]
    }

    onAttach() {
        if (!this.isMobileBrowser()) {
            this.getBodyHandle().style.margin = 0
        } else {
            this.getBodyHandle()
                .querySelector('button.resume__close')
                .addEventListener('click', this.closeWindow.bind(this))
        }
    }
}

window.pm.registerPrototype('resume', ResumeProgram)

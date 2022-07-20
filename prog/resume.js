class ResumeProgram extends Program {
    isMobileBrowser() {
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    }

    getDocumentURL() {
        return '//kage.dev/resume.pdf'
    }

    getDocumentTitle() {
        return 'Resume'
    }

    createWindow() {
        let body   = ''
        let wminfo = {
            title: `Document Viewer - ${this.getDocumentTitle()}`,
            name:  `Document Viewer (${this.getDocumentTitle()})`,
            icon:  'img/desktop/WordPad.png',
            resizable: true
        }
        if (this.isMobileBrowser()) {
            body = `
                <iframe
                    src="${this.getDocumentURL()}"
                    class="resume__iframe--mobile"
                    width="0"
                    height="0"> </iframe>
                <div class="window__dialog">
                    <div class="window__dialog-info">
                        <img src="img/desktop/TextFile.png"/>
                        <p>
                            Open ${this.getDocumentTitle().toLowerCase()} in new tab?
                        </p>
                    </div>
                    <div class="window__dialog-action">
                        <button class="resume__close">No</button>
                        <a href="${this.getDocumentURL()}" target="_blank">
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
                <iframe src="${this.getDocumentURL()}"> </iframe>
                <div class="resume__toolbar">
                    <a href="${this.getDocumentURL()}" rel="noopener" target="_blank"> Open in New Tab </a>
                    <a href="${this.getDocumentURL()}" download> Download </a>
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

class CVProgram extends ResumeProgram {
    getDocumentURL() {
        return '//kage.dev/cv.pdf'
    }

    getDocumentTitle() {
        return 'CV'
    }

}

window.pm.registerPrototype('resume', ResumeProgram)
window.pm.registerPrototype('cv', CVProgram)

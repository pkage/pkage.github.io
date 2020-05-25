class ResumeProgram extends Program {
    createWindow() {
        let body = `
            <iframe src="//kage.dev/resume.pdf"> </iframe>
            <div class="resume__toolbar">
                <a href="//kage.dev/resume.pdf" rel="noopener" target="_blank"> Open in New Tab </a>
                <a href="//kage.dev/resume.pdf" download> Download </a>
            </div>
        `

        let wminfo = {
            title: 'Resume Viewer',
            name:  'Resume Viewer',
            icon:  'img/desktop/TextFile.png',
            resizable: true,
            width: Math.floor(window.innerWidth * 0.8 - 100),
            height: Math.floor(window.innerHeight * 0.8),
            x: 50,
            y: 50
        }

        console.log(wminfo)

        return [wminfo, body]
    }
}

window.pm.registerPrototype('resume', ResumeProgram)

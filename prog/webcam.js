class WebcamProgram extends Program {
    createWindow() {
        let title = 'Webcam'

        let winfo = {
            name: 'Webcam',
            title,
            icon: 'img/desktop/Notepad.png',
            resizable: true,
            margin: false,
            app: true
        }

        let body = `
            <video autoplay="true" id="videoElement"></video>
        `

        return [winfo, body]
    }

    onAttach() {
        const video = this.getBodyHandle()
            .querySelector('video')


        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                if ('srcObject' in video) {
                    video.srcObject = stream
                } else {
                    video.src = window.URL.createObjectURL(stream)
                }
                video.onloadedmetadata = () => {
                    video.play()
                }
            })
            .catch(err => {
                console.log(`${err.name}: ${err.message}`)
            })
    }
}

window.pm.registerPrototype('webcam', WebcamProgram)

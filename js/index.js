const TRANSLATED_TEXT = ''
const TEXT_AREA = document.querySelector("#text")
const INFO = document.querySelector("#info")
const RECORD_BTN = document.querySelector("#record_btn")
const MODAL = document.querySelector("#modal")
const SpeechRecognition = webkitSpeechRecognition || window.webkitSpeechRecognition
const AUDIO = document.querySelector("audio")

const SET_INFO = (newText) => {
	INFO.innerHTML = newText
}

const SET_STATUS = (icon, stat) => {
	MODAL.parentElement.style.display = 'block'
	MODAL.innerHTML = `
		<p class='${icon}' id='status_icon'></p>
		<p id='status_text'>${stat}</p>
	`
}

const CHECK_PERMISSION = () => {
	navigator.permissions.query({name: 'microphone'})
	.then(permissionStatus => {
	switch (permissionStatus.state) {
		case 'granted':
			return permissionStatus.state;
			break;
		case 'prompt':
			return permissionStatus.state;
			break;
		case 'denied':
			SET_STATUS('fa-solid fa-info', `You have to allow access for the following feature to use this service: <strong>Microphone</strong>. <br> Please allow it in your browser settings for this site
			`)
			break;
		default:
			return permissionStatus.state;
		}
	})
}


const START_RECORDING = async (rec_bool) => {
	if (SpeechRecognition !== undefined && CHECK_PERMISSION() !== 'denied') {
		rec_bool.disabled = true
		let record = new SpeechRecognition()
		record.lang = 'en-US'
		record.continuous = true
		let stream = await navigator.mediaDevices.getUserMedia({audio: true, video: false})
		let mediaRecorder = new MediaRecorder(stream)
		mediaRecorder.start()
		let chunks = []
		record.onstart = () => {
			SET_INFO('Recording in progress...')
			SET_STATUS('fa-solid fa-ear-listen','Listening...<br> Start Speaking...')
			window.onclick = () => {
				if (event.target === MODAL.parentElement) {
					return
				}
			}
		}
		
		record.onsoundend = () => {
			SET_INFO('Click on the <span class="fa-solid fa-microphone" style="color: #1CB40C"></span> button to start your recording.')
			rec_bool.disabled = false
			mediaRecorder.stop()
		}
		
		record.onnomatch = () => {
			document.querySelector("#actions").style.display = 'none'
			document.querySelector("#audio_actions").style.display = 'none'
			rec_bool.disabled = false
			SET_INFO('Click on the <span class="fa-solid fa-microphone" style="color: #1CB40C"></span> button to start your recording.')
			SET_STATUS('fa-solid fa-circle-exclamation', 'Oops! I did not catch that. Please try again')
			window.onclick = () => {
				if (event.target === MODAL.parentElement) {
					MODAL.parentElement.style.display = 'none'
				}
			}
		}

		record.onresult = (res) => {
			if (TEXT_AREA.value.length !== 0) {
				TEXT_AREA.value += ` ${res.results[0][0].transcript}`
			}else{
				TEXT_AREA.value += res.results[0][0].transcript
			}
			MODAL.parentElement.style.display = 'none'
        }
        
        mediaRecorder.ondataavailable = (e) => {
			chunks.push(e.data)
		}
		
		mediaRecorder.onstop = () => {
			if (TEXT_AREA.value.length !== 0) {
				let blob = new Blob(chunks)
				let url = URL.createObjectURL(blob)
				AUDIO.src = url
				AUDIO.onloadedmetadata = () => {
					document.querySelector("#actions").style.display = 'flex'
					document.querySelector("#audio_actions").style.display = 'flex'
				}
			}else{
				document.querySelector("#actions").style.display = 'none'
				document.querySelector("#audio_actions").style.display = 'none'
			}
		}
         
        record.start()
	} else {
		
	}
}

const PLAY_AUDIO = async (btn) => {
	if (btn.getAttribute('class') === 'fa-solid fa-play') {
		btn.setAttribute('class', 'fa-solid fa-pause')
		await AUDIO.play()
	}else{
		btn.setAttribute('class', 'fa-solid fa-play')
		await AUDIO.pause()
	}
	AUDIO.onended = () => {
		btn.setAttribute('class', 'fa-solid fa-play')
	}
}

const EDIT = (x, btn) => {
	x.disabled = false
}

const CLEAR = (x, btn) => {
	x.disabled = false
	x.value = ''
	AUDIO.src = undefined
	TEXT_AREA.disabled = true
}

const COPY = (x, btn) => {
	navigator.clipboard.writeText(x.value)
	TEXT_AREA.disabled = true
}
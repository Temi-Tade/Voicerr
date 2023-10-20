const TRANSLATED_TEXT = ''
const TEXT_AREA = document.querySelector("#text")
const INFO = document.querySelector("#info")
const RECORD_BTN = document.querySelector("#record_btn")
const STOP_REC_BTN = document.querySelector("#stop_btn")
const MODAL = document.querySelector("#modal")
const SpeechRecognition = webkitSpeechRecognition || window.webkitSpeechRecognition

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

const START_RECORDING = (rec_bool, stop_bool) => {
	if (SpeechRecognition !== undefined) {
		rec_bool.disabled = true
		stop_bool.disabled = false
		let record = new SpeechRecognition()
		record.lang = 'en-US'
		record.continuous = true
		record.onstart = () => {
			SET_INFO('Recording in progress...')
			SET_STATUS('fa-solid fa-ear-listen fa-beat', 'I am listening... Start Speaking...')
			window.onclick = () => {
				if (event.target === MODAL.parentElement) {
					return
				}
			}
		}
		
		record.onsoundend = () => {
			SET_INFO('Click on the <span class="fa-solid fa-microphone" style="color: #1CB40C"></span> button to start your recording.')
			rec_bool.disabled = false
			stop_bool.disabled = true
		}
		
		record.onnomatch = () => {
			rec_bool.disabled = false
			stop_bool.disabled = true
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
        }
         
        record.start()

		STOP_REC_BTN.onclick = () => {
			rec_bool.disabled = false
			stop_bool.disabled = true
			record.stop()
		}
	} else {
		//error msg
	}
}


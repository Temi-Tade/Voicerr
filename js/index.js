const TRANSLATED_TEXT = ''
const TEXT_AREA = document.querySelector("#text")
const INFO = document.querySelector("#info")
const RECORD_BTN = document.querySelector("#record_btn")
const STOP_REC_BTN = document.querySelector("#stop_btn")
const SpeechRecognition = webkitSpeechRecognition || window.webkitSpeechRecognition

const SET_INFO = (newText) => {
	INFO.innerHTML = newText
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
		}
		
		record.onsoundend = () => {
			SET_INFO('Click on the <span class="fa-solid fa-microphone" style="color: #1CB40C"></span> button to start your recording.')
			rec_bool.disabled = false
			stop_bool.disabled = true
		}

		record.onresult = (res) => {
			TEXT_AREA.value = res.results[0][0].transcript
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
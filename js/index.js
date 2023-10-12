const TRANSLATED_TEXT = ''
const TEXT_AREA = document.querySelector("#text")
const INFO = document.querySelector("#info")
const SpeechRecognition = webkitSpeechRecognition || window.webkitSpeechRecognition

const SET_INFO = (newText) => {
	INFO.innerHTML = newText
}

const checkButtonState = (x, y) => {
	if (x === 'fa-solid fa-microphone') {
		y.setAttribute('class', 'fa-solid fa-stop')
		START_RECORDING()
	} else {
		y.setAttribute('class', 'fa-solid fa-microphone')
	}
}

const START_RECORDING = () => {
	if (SpeechRecognition !== undefined) {
		let record = new SpeechRecognition()
		record.onstart = () => {
			SET_INFO('Recording in progress...')
			TEXT_AREA.value += record.results[0][0].transcript
		}
		
		record.onspeechend = () => {
			SET_INFO('Click on the <span class="fa-solid fa-microphone"></span> button to start your recording.')
			record.stop()
		}
		
		record.onresult = (res) => {
			alert(res)
		}
		
		record.start()
	} else {
		
	}
}
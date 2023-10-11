const checkButtonState = (x, y) => {
	if (x === 'fa-solid fa-microphone') {
		y.setAttribute('class', 'fa-solid fa-stop')
	} else {
		y.setAttribute('class', 'fa-solid fa-microphone')
	}
}
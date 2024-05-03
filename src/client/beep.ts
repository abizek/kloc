const beep = new Audio('/beep.mp3')

beep.loop = true

export const playBeep = () => {
  beep.play()
}

export const stopBeep = () => {
  beep.pause()
}

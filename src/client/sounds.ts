const beepSfx = new Audio('/sounds/beep.mp3')
beepSfx.loop = true

export const playBeepSfx = () => beepSfx.play()
export const stopBeepSfx = () => beepSfx.pause()

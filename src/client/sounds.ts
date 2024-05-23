const beepSfx = new Audio('/sounds/beep.mp3')
beepSfx.loop = true

export const playBeepSfx = () => beepSfx.play()
export const stopBeepSfx = () => beepSfx.pause()

const switchOnSfx = new Audio('/sounds/switch-on.mp3')
const switchOffSfx = new Audio('/sounds/switch-off.mp3')

export const playSwitchOnSfx = () => switchOnSfx.play()
export const playSwitchOffSfx = () => switchOffSfx.play()

import { useLocalStorage } from '@uidotdev/usehooks'
import { useContext } from 'react'
import { MachinePartyContext } from '../../providers/MachinePartyProvider'
import { Footer } from './Footer'
import { Input } from './Input'
import { TimeView } from './TimeView'

export function Timer() {
  const [hours] = useLocalStorage('timer-input-hours', '00')
  const [minutes] = useLocalStorage('timer-input-minutes', '00')
  const [seconds] = useLocalStorage('timer-input-seconds', '00')
  const { timer } = useContext(MachinePartyContext)

  return (
    <div className="relative z-10 grid size-full grid-rows-[auto_80px] place-items-center">
      {timer.matches('stopped') ? <Input /> : <TimeView />}
      <Footer
        timeInput={(+seconds + +minutes * 60 + +hours * 60 * 60) * 1000}
      />
    </div>
  )
}

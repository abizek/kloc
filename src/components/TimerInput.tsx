import { useMotionValueEvent, useScroll } from 'framer-motion'
import { useRef } from 'react'

type TimerInputProps = {
  label: string
  values: string[]
  onChange: (value: string) => void
}

type ValueItemProps = {
  value: string
  containerRef: React.RefObject<HTMLDivElement>
  onChange: (value: string) => void
}

export function TimerInput({ label, values, onChange }: TimerInputProps) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div>
      {label}
      <div
        ref={ref}
        className="relative h-72 snap-y snap-mandatory overflow-y-scroll text-3xl no-scrollbar"
      >
        {values.map((value) => (
          <ValueItem
            key={value}
            value={value}
            containerRef={ref}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  )
}

function ValueItem({ value, containerRef, onChange }: ValueItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: ref,
  })

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest === 0.5) {
      onChange(value)
    }
  })

  return (
    <div
      ref={ref}
      className="flex h-24 snap-center items-center justify-center"
    >
      {value}
    </div>
  )
}

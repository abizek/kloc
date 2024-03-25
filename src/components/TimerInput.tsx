import { useMotionValueEvent, useScroll } from 'framer-motion'
import { useEffect, useRef } from 'react'

type TimerInputProps = {
  label: string
  values: string[]
  onChange: (value: string) => void
  persistedValue: string
  hideSeparator?: boolean
}

type ValueItemProps = {
  value: string
  containerRef: React.RefObject<HTMLDivElement>
  onChange: (value: string) => void
  persistedValue: string
}

export function TimerInput({
  label,
  values,
  onChange,
  persistedValue,
  hideSeparator = false,
}: TimerInputProps) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div className="dark:text-white">
      <div className="mb-4">{label}</div>
      <div className="flex items-center gap-4 text-2xl">
        <div
          ref={ref}
          className="relative h-64 snap-y snap-mandatory overflow-y-scroll text-3xl no-scrollbar"
        >
          {values.map((value) => (
            <ValueItem
              key={value}
              value={value}
              containerRef={ref}
              onChange={onChange}
              persistedValue={persistedValue}
            />
          ))}
        </div>
        {!hideSeparator && ':'}
      </div>
    </div>
  )
}

function ValueItem({
  value,
  containerRef,
  onChange,
  persistedValue,
}: ValueItemProps) {
  const ref = useRef<HTMLDivElement>(null!)
  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: ref,
    layoutEffect: false,
  })

  useEffect(() => {
    if (value === persistedValue) {
      // initial scroll to the persisted value
      ref.current.scrollIntoView({ behavior: 'instant', block: 'center' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

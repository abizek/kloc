import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ ...props }, ref) => (
  <SwitchPrimitives.Root
    className="inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/70 focus-visible:ring-offset-gray-200 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-green-400 data-[state=unchecked]:bg-gray-200 dark:focus-visible:ring-gray-200 dark:data-[state=checked]:bg-green-600 dark:data-[state=unchecked]:bg-gray-800"
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb className="pointer-events-none block size-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 dark:bg-gray-300" />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }

import * as SeparatorPrimitive from '@radix-ui/react-separator'

const Separator = ({ ...props }: SeparatorPrimitive.SeparatorProps) => (
  <SeparatorPrimitive.Root
    orientation="vertical"
    className="h-4 w-0.5 shrink-0 rounded bg-gray-400 dark:bg-gray-600"
    {...props}
  />
)

export { Separator }

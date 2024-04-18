import * as TabsPrimitive from '@radix-ui/react-tabs'
import { AnimatePresence, motion } from 'framer-motion'

const Tabs = ({ ...props }: TabsPrimitive.TabsProps) => (
  <TabsPrimitive.Root
    className="grid h-svh w-full grid-rows-[76px_auto_80px] place-items-center overflow-hidden bg-gray-50 dark:bg-black"
    {...props}
  />
)
Tabs.displayName = TabsPrimitive.Root.displayName

const TabsList = ({ ...props }: TabsPrimitive.TabsListProps) => (
  <div className="absolute grid h-svh w-full grid-rows-[auto_80px] place-items-center">
    <div />
    <TabsPrimitive.List className="z-10 flex h-10 gap-1 p-1" {...props} />
  </div>
)
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = ({ ...props }: TabsPrimitive.TabsTriggerProps) => (
  <TabsPrimitive.Trigger
    className="relative inline-flex items-center justify-center rounded-full px-3 py-1.5 font-semibold text-gray-800 transition-all data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:bg-gray-200 dark:text-gray-200 data-[state=inactive]:dark:text-gray-500 data-[state=inactive]:dark:hover:bg-gray-900"
    {...props}
  />
)
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

type Direction = 'left' | 'right'

const variants = {
  enter: (direction: Direction) => ({
    x: direction === 'left' ? 50 : -50,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: Direction) => ({
    x: direction === 'left' ? -50 : 50,
    opacity: 0,
  }),
}

const TabsContent = ({
  children,
  previousValue,
  value,
  ...props
}: TabsPrimitive.TabsContentProps & {
  previousValue: Tab | null
  value: Tab
}) => {
  let direction: Direction
  if (previousValue === 'kloc' || value === 'timer') {
    direction = 'left'
  } else {
    direction = 'right'
  }

  return (
    <TabsPrimitive.Content className="z-10 size-full" value={value} {...props}>
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={value}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.2 }}
          className="size-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </TabsPrimitive.Content>
  )
}
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }

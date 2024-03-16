import * as TabsPrimitive from '@radix-ui/react-tabs'

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
    className="inline-flex items-center justify-center rounded-full px-3 py-1.5 font-semibold text-gray-800 decoration-2 underline-offset-8 transition-all data-[state=inactive]:text-gray-400 data-[state=active]:underline data-[state=inactive]:hover:bg-gray-200 dark:text-gray-200 data-[state=inactive]:dark:text-gray-500 data-[state=inactive]:dark:hover:bg-gray-900"
    {...props}
  />
)
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = ({ ...props }: TabsPrimitive.TabsContentProps) => (
  <TabsPrimitive.Content className="size-full" {...props} />
)
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }

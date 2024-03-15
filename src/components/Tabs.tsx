import * as TabsPrimitive from '@radix-ui/react-tabs'

const Tabs = ({ ...props }: TabsPrimitive.TabsProps) => (
  <TabsPrimitive.Root
    className="grid h-svh w-full grid-rows-[auto_80px] place-items-center overflow-hidden bg-gray-50 dark:bg-black"
    {...props}
  />
)
Tabs.displayName = TabsPrimitive.Root.displayName

const TabsList = ({ ...props }: TabsPrimitive.TabsListProps) => (
  <div className="absolute grid h-svh w-full grid-rows-[auto_80px] place-items-center">
    <div />
    <TabsPrimitive.List
      className="z-10 flex h-10 rounded-md bg-slate-50 p-1 text-black"
      {...props}
    />
  </div>
)
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = ({ ...props }: TabsPrimitive.TabsTriggerProps) => (
  <TabsPrimitive.Trigger
    className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm"
    {...props}
  />
)
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = ({ ...props }: TabsPrimitive.TabsContentProps) => (
  <TabsPrimitive.Content className="size-full" {...props} />
)
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }

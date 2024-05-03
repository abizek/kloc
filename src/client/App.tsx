import { usePrevious } from '@uidotdev/usehooks'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Header } from './components/Header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/Tabs'
import { usePathname } from './hooks/usePathname'
import { StopwatchMachineProvider } from './providers/StopwatchMachineProvider'
import { TimerMachineProvider } from './providers/TimerMachineProvider'
import type { Tab } from './utils'
import { handleTabChange, tabList, tabRecord } from './utils'

export default function App() {
  const { route } = usePathname()
  const [selectedTab, setSelectedTab] = useState<Tab | null>(null)
  const previousTab = usePrevious(selectedTab)

  if (route !== selectedTab) {
    setSelectedTab(route)
  }

  if (selectedTab === null) return null

  const { Content } = tabRecord[selectedTab]

  return (
    <Tabs value={selectedTab} onValueChange={handleTabChange}>
      <Header />
      <TabsContent
        value={selectedTab}
        previousValue={previousTab}
        data-cy={`${selectedTab}-content`}
      >
        <StopwatchMachineProvider>
          <TimerMachineProvider>
            <Content />
          </TimerMachineProvider>
        </StopwatchMachineProvider>
      </TabsContent>
      <TabsList>
        {tabList.map(({ tab, label }) => (
          <TabsTrigger key={label} value={tab} data-cy={`${tab}-trigger`}>
            {label}
            {tab === selectedTab ? (
              <motion.div
                layoutId="underline"
                className="absolute inset-x-0 bottom-0 mx-3 h-0.5 bg-gray-800 dark:bg-gray-200"
              />
            ) : null}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

import { usePrevious } from '@uidotdev/usehooks'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Header } from './components/Header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/Tabs'
import { usePathname } from './hooks/usePathname'
import { TimerMachineProvider } from './providers/TimerMachineProvider'
import {
  handleTabChange,
  isRoute,
  redirectToHome,
  routeTabRecord,
  tabs,
  tabsRecord,
} from './utils'

export default function App() {
  const path = usePathname()
  const [selectedTab, setSelectedTab] = useState<Tab | null>(null)
  const previousTab = usePrevious(selectedTab)

  if (!isRoute(path)) {
    redirectToHome()
    return null
  }

  if (routeTabRecord[path] !== selectedTab) {
    setSelectedTab(routeTabRecord[path])
  }

  if (selectedTab === null) return null

  const { Content } = tabsRecord[selectedTab]

  return (
    <Tabs value={selectedTab} onValueChange={handleTabChange}>
      <Header />
      <TabsContent
        value={selectedTab}
        previousValue={previousTab}
        data-cy={`${selectedTab}-content`}
      >
        <TimerMachineProvider>
          <Content />
        </TimerMachineProvider>
      </TabsContent>
      <TabsList>
        {tabs.map(({ tab, label }) => (
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

import { useState } from 'react'
import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { usePrevious } from '@uidotdev/usehooks'
import { motion } from 'framer-motion'
import { Header } from './components/Header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/Tabs'
import { Kloc } from './pages/Kloc'
import { Stopwatch } from './pages/Stopwatch'
import { Timer } from './pages/Timer'

type TabData = {
  tab: Tab
  label: string
  content: ReactNode
}

const tabsRecord: Record<Tab, TabData> = {
  kloc: {
    tab: 'kloc',
    label: 'Kloc',
    content: <Kloc />,
  },
  stopwatch: {
    tab: 'stopwatch',
    label: 'Stopwatch',
    content: <Stopwatch />,
  },
  timer: {
    tab: 'timer',
    label: 'Timer',
    content: <Timer />,
  },
}

const tabs = Object.values(tabsRecord)

export default function App() {
  const [selectedTab, setSelectedTab] = useState(tabs[0].tab)
  const previousTab = usePrevious(selectedTab)
  const selectedTabData = tabsRecord[selectedTab]

  return (
    <Tabs
      value={selectedTab}
      onValueChange={setSelectedTab as Dispatch<SetStateAction<string>>}
    >
      <Header />
      <TabsContent
        value={selectedTab}
        previousValue={previousTab}
        data-cy={`${selectedTabData.tab}-content`}
      >
        {selectedTabData.content}
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

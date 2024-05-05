import { usePrevious } from '@uidotdev/usehooks'
import { motion } from 'framer-motion'
import { Header } from './components/Header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/Tabs'
import { useRouter } from './hooks/useRouter'
import { StopwatchMachineProvider } from './providers/StopwatchMachineProvider'
import { TimerMachineProvider } from './providers/TimerMachineProvider'
import { tabList, tabRecord } from './utils'

export default function App() {
  const { tab: selectedTab, handleTabChange } = useRouter()
  const previousTab = usePrevious(selectedTab)
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

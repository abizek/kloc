import { TooltipProvider } from '@radix-ui/react-tooltip'
import { usePrevious } from '@uidotdev/usehooks'
import { motion } from 'framer-motion'
import { Suspense, lazy } from 'react'
import { HeaderSkeleton } from './components/Header/Skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/Tabs'
import { useRouter } from './hooks/useRouter'
import { MachinePartyProvider } from './providers/MachinePartyProvider'
import { tabList, tabRecord } from './utils'

const Header = lazy(() => import('./components/Header'))

export default function App() {
  const { tab: selectedTab, handleTabChange } = useRouter()
  const previousTab = usePrevious(selectedTab)
  const { Content } = tabRecord[selectedTab]

  return (
    <MachinePartyProvider>
      <Tabs value={selectedTab} onValueChange={handleTabChange}>
        <Suspense fallback={<HeaderSkeleton />}>
          <TooltipProvider>
            <Header />
          </TooltipProvider>
        </Suspense>
        <TabsContent
          value={selectedTab}
          previousValue={previousTab}
          data-cy={`${selectedTab}-content`}
        >
          <Content />
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
    </MachinePartyProvider>
  )
}

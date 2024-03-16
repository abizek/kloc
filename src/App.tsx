import { Header } from './components/Header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/Tabs'
import { Kloc } from './pages/Kloc'
import { Stopwatch } from './pages/Stopwatch'

export default function App() {
  return (
    <Tabs defaultValue="kloc">
      <Header />
      <TabsContent value="kloc" data-cy="kloc-content">
        <Kloc />
      </TabsContent>
      <TabsContent value="stopwatch" data-cy="stopwatch-content">
        <Stopwatch />
      </TabsContent>
      <TabsContent value="timer" data-cy="timer-content">
        Coming soon
      </TabsContent>
      <TabsList>
        <TabsTrigger value="kloc" data-cy="kloc-trigger">
          Kloc
        </TabsTrigger>
        <TabsTrigger value="stopwatch" data-cy="stopwatch-trigger">
          Stopwatch
        </TabsTrigger>
        <TabsTrigger value="timer" data-cy="timer-trigger">
          Timer
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

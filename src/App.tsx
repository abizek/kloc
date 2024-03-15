import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/Tabs'
import { Kloc } from './pages/Kloc'
import { Stopwatch } from './pages/Stopwatch'

export default function App() {
  return (
    <Tabs defaultValue="stopwatch">
      <TabsContent value="kloc" data-cy="kloc">
        <Kloc />
      </TabsContent>
      <TabsContent value="stopwatch" data-cy="stopwatch">
        <Stopwatch />
      </TabsContent>
      <TabsContent value="timer" data-cy="timer">
        Coming soon
      </TabsContent>
      <TabsList>
        <TabsTrigger value="kloc">Kloc</TabsTrigger>
        <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
        <TabsTrigger value="timer">Timer</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

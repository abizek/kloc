import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/Tabs'
import { Kloc } from './pages/Kloc'
import { Stopwatch } from './pages/Stopwatch'

export default function App() {
  return (
    <Tabs defaultValue="stopwatch">
      <TabsList>
        <TabsTrigger value="kloc">Kloc</TabsTrigger>
        <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
      </TabsList>
      <TabsContent value="kloc">
        <Kloc />
      </TabsContent>
      <TabsContent value="stopwatch">
        <Stopwatch />
      </TabsContent>
    </Tabs>
  )
}

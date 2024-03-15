import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/Tabs'
import { Kloc } from './pages/Kloc'
import { Stopwatch } from './pages/Stopwatch'

export default function App() {
  return (
    <Tabs defaultValue="stopwatch">
      <TabsContent value="kloc">
        <Kloc />
      </TabsContent>
      <TabsContent value="stopwatch">
        <Stopwatch />
      </TabsContent>
      <TabsList>
        <TabsTrigger value="kloc">Kloc</TabsTrigger>
        <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

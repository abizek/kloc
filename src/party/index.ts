import type * as Party from 'partykit/server'

const categories = ['stopwatch', 'timer'] as const
type Category = (typeof categories)[number]

type State = {
  context: object
  status: string
  value: string | object
}

type CreateMessage = { type: 'create' } & { [index in Category]: State }
type JoinMessage = { type: 'join' }
type UpdateMessage = { type: 'update' } & { [index in Category]?: State }
type DeleteMessage = { type: 'delete' }
type NotFoundMessage = { type: 404 }
type ConflictMessage = { type: 409 }

type Message = CreateMessage | JoinMessage | UpdateMessage | DeleteMessage

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}
  options: Party.ServerOptions = {
    hibernate: true,
  }

  onConnect(conn: Party.Connection) {
    console.log(`Connected: ${this.room.id}: ${conn.id}`)
  }

  async onMessage(message: string, sender: Party.Connection) {
    console.log(`connection ${sender.id} sent message: ${message}`)

    try {
      const parsedMessage: Message = JSON.parse(message)
      switch (parsedMessage.type) {
        case 'create': {
          // handle room collision
          const keys = [...(await this.room.storage.list()).keys()]
          if (keys.length > 0) {
            sender.send(JSON.stringify({ type: 409 } satisfies ConflictMessage))
            return
          }

          const { type, ...messageData } = parsedMessage
          await this.room.storage.put<State>({ ...messageData })
          break
        }
        case 'join': {
          const stopwatch = await this.room.storage.get<State>(categories[0])
          const timer = await this.room.storage.get<State>(categories[1])
          if (!stopwatch && !timer) {
            sender.send(JSON.stringify({ type: 404 } satisfies NotFoundMessage))
            return
          }

          sender.send(
            JSON.stringify({
              type: 'update',
              stopwatch,
              timer,
            } satisfies UpdateMessage),
          )
          break
        }
        case 'update': {
          const { type, ...messageData } = parsedMessage
          this.room.broadcast(
            JSON.stringify({ type, ...messageData } satisfies UpdateMessage),
            [sender.id],
          )
          await this.room.storage.put({ ...messageData })
          break
        }
        case 'delete': {
          this.room.storage.deleteAll()
          this.room.broadcast(
            JSON.stringify({ type: 'delete' } satisfies DeleteMessage),
            [sender.id],
          )
        }
      }
    } catch (error) {
      console.error('Error in onMessage', error)
    }
  }

  onClose(connection: Party.Connection<unknown>): void | Promise<void> {
    console.log(`Closed: ${connection.id}`)
  }
}

Server satisfies Party.Worker

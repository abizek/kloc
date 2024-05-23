import type * as Party from 'partykit/server'
import type {
  ConflictMessage,
  DeleteMessage,
  MessageFromClient,
  NotFoundMessage,
  State,
  UpdateMessage,
} from '../types'
import { categories } from '../types'

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
      const parsedMessage: MessageFromClient = JSON.parse(message)
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
          const [stopwatch, timer] = await Promise.all(
            categories.map((category) =>
              this.room.storage.get<State>(category),
            ),
          )
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
          break
        }
        default:
          console.error('Unknown message type', parsedMessage)
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

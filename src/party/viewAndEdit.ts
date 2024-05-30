import {
  adjectives,
  animals,
  uniqueNamesGenerator,
} from '@joaomoreno/unique-names-generator'
import type * as Party from 'partykit/server'
import type {
  ConflictMessage,
  CreateMessage,
  CreateResponse,
  DeleteMessage,
  MessageFromClient,
  NotFoundMessage,
  State,
  UpdateMessage,
} from '../types'
import { categories } from '../types'

const VIEW_ONLY_ROOM_ID = 'view_only-room-id' as const

export default class ViewAndEditServer implements Party.Server {
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
          await this.room.blockConcurrencyWhile(async () => {
            // handle room collision
            const keys = [...(await this.room.storage.list()).keys()]
            if (keys.length > 0) {
              sender.send(
                JSON.stringify({ type: 409 } satisfies ConflictMessage),
              )
              sender.close()
              return
            }

            const { type, ...messageData } = parsedMessage
            await this.room.storage.put<State>(messageData)

            let res: Response
            let viewOnlyRoomId: string
            do {
              viewOnlyRoomId = uniqueNamesGenerator({
                dictionaries: [adjectives, animals],
                separator: '-',
              })
              res = await this.room.context.parties['view_only']
                .get(viewOnlyRoomId)
                .fetch({
                  method: 'POST',
                  body: JSON.stringify(
                    messageData satisfies Omit<CreateMessage, 'type'>,
                  ),
                })
            } while (res.status === 409)

            await this.room.storage.put<string>(
              VIEW_ONLY_ROOM_ID,
              viewOnlyRoomId,
            )

            sender.send(
              JSON.stringify({
                type: 'create-response',
                viewOnlyRoomId,
              } satisfies CreateResponse),
            )
          })

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
            sender.close()
            return
          }

          const viewOnlyRoomId =
            await this.room.storage.get<string>(VIEW_ONLY_ROOM_ID)
          sender.send(
            JSON.stringify({
              type: 'update',
              stopwatch,
              timer,
              viewOnlyRoomId,
            } satisfies UpdateMessage),
          )

          break
        }
        case 'update': {
          await this.room.blockConcurrencyWhile(async () => {
            this.room.broadcast(
              JSON.stringify(parsedMessage satisfies UpdateMessage),
              [sender.id],
            )
            const { type, ...messageData } = parsedMessage
            await this.room.storage.put(messageData)
            const viewOnlyRoomId =
              await this.room.storage.get<string>(VIEW_ONLY_ROOM_ID)
            if (viewOnlyRoomId) {
              await this.room.context.parties['view_only']
                .get(viewOnlyRoomId)
                .fetch({
                  method: 'PATCH',
                  body: JSON.stringify(
                    messageData satisfies Omit<UpdateMessage, 'type'>,
                  ),
                })
            }
          })

          break
        }
        case 'delete': {
          this.room.broadcast(
            JSON.stringify({ type: 'delete' } satisfies DeleteMessage),
            [sender.id],
          )
          for (const connection of this.room.getConnections()) {
            connection.close()
          }

          const viewOnlyRoomId =
            await this.room.storage.get<string>(VIEW_ONLY_ROOM_ID)
          if (viewOnlyRoomId) {
            await this.room.context.parties['view_only']
              .get(viewOnlyRoomId)
              .fetch({ method: 'DELETE' })
          }

          await this.room.storage.deleteAll()

          break
        }
        default:
          console.error('Unknown message type', parsedMessage satisfies never)
          throw new Error('Unknown message type')
      }
    } catch (error) {
      console.error('Error in onMessage', error)
    }
  }

  onClose(connection: Party.Connection<unknown>): void | Promise<void> {
    console.log(`Closed: ${connection.id}`)
  }
}

ViewAndEditServer satisfies Party.Worker

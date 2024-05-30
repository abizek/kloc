import type * as Party from 'partykit/server'
import type {
  CreateMessage,
  DeleteMessage,
  JoinMessage,
  NotFoundMessage,
  State,
  UpdateMessage,
} from '../types'
import { categories } from '../types'
import { conflict, notFound, ok } from './utils'

export default class ViewOnlyServer implements Party.Server {
  constructor(readonly room: Party.Room) {}
  options: Party.ServerOptions = {
    hibernate: true,
  }

  onConnect(conn: Party.Connection) {
    console.log(`Connected: ${this.room.id}: ${conn.id}`)
  }

  async onRequest(req: Party.Request) {
    // create
    if (req.method === 'POST') {
      const keys = [...(await this.room.storage.list()).keys()]
      if (keys.length > 0) {
        return conflict()
      }

      const messageData = (await req.json()) as Omit<CreateMessage, 'type'>
      await this.room.storage.put<State>(messageData)
      return ok()
    }

    // update
    if (req.method === 'PATCH') {
      const messageData = (await req.json()) as Omit<UpdateMessage, 'type'>
      this.room.broadcast(
        JSON.stringify({
          type: 'update',
          ...messageData,
        } satisfies UpdateMessage),
      )
      await this.room.storage.put<State>(messageData)
      return ok()
    }

    // delete
    if (req.method === 'DELETE') {
      this.room.broadcast(
        JSON.stringify({ type: 'delete' } satisfies DeleteMessage),
      )
      for (const connection of this.room.getConnections()) {
        connection.close()
      }
      await this.room.storage.deleteAll()

      return ok()
    }

    return notFound()
  }

  async onMessage(message: string, sender: Party.Connection) {
    console.log(`connection ${sender.id} sent message: ${message}`)

    try {
      const parsedMessage: JoinMessage = JSON.parse(message)
      if (parsedMessage.type !== 'join') {
        console.error('Unknown message type', parsedMessage)
        throw new Error('Unknown message type')
      }

      const [stopwatch, timer] = await Promise.all(
        categories.map((category) => this.room.storage.get<State>(category)),
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
    } catch (error) {
      console.error('Error in onMessage', error)
    }
  }

  onClose(connection: Party.Connection<unknown>): void | Promise<void> {
    console.log(`Closed: ${connection.id}`)
  }
}

ViewOnlyServer satisfies Party.Worker

export const categories = ['stopwatch', 'timer'] as const
export type Category = (typeof categories)[number]

export type State = {
  context: object
  status: string
  value: string | object
}

export type CreateMessage = { type: 'create' } & { [index in Category]: State }
export type CreateResponse = {
  type: 'create-response'
  viewOnlyRoomId: string | null
}
export type JoinMessage = { type: 'join' }
export type UpdateMessage = { type: 'update' } & { [index in Category]?: State }
export type DeleteMessage = { type: 'delete' }
export type NotFoundMessage = { type: 404 }
export type ConflictMessage = { type: 409 }

export type MessageFromClient =
  | CreateMessage
  | JoinMessage
  | UpdateMessage
  | DeleteMessage

export type MessageFromServer =
  | CreateResponse
  | UpdateMessage
  | DeleteMessage
  | NotFoundMessage
  | ConflictMessage

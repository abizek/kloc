const categories = ['stopwatch', 'timer'] as const
export type Category = (typeof categories)[number]

export type State = {
  context: object
  status: string
  value: string | object
}

export type CreateMessage = { type: 'create' } & { [index in Category]: State }
export type JoinMessage = { type: 'join' }
export type UpdateMessage = { type: 'update' } & { [index in Category]?: State }
export type DeleteMessage = { type: 'delete' }
export type NotFoundMessage = { type: 404 }
export type ConflictMessage = { type: 409 }

export type Message =
  | CreateMessage
  | JoinMessage
  | UpdateMessage
  | DeleteMessage

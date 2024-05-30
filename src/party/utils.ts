const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS, DELETE',
}

export const json = <T>(data: T, status = 200) =>
  Response.json(data, { status, headers: CORS })

export const ok = () => json({ ok: true })

export const error = (error: string, status = 500) => {
  console.error('Error response', error)
  return json(
    {
      ok: false,
      error,
    },
    status,
  )
}

export const notFound = () => error('Not found', 404)
export const conflict = () => error('Conflict', 409)

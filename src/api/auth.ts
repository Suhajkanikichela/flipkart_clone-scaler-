import { getApiBaseUrl } from '@/lib/api'

export type AuthUser = {
  id: number
  email: string
  firstname: string
  lastname: string
  username: string
  phone: string | null
}

export class AuthApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'AuthApiError'
    this.status = status
  }
}

async function parseError(res: Response): Promise<string> {
  const ct = res.headers.get('content-type') ?? ''
  if (ct.includes('application/json')) {
    const data = (await res.json().catch(() => ({}))) as { error?: string }
    return data.error ?? `Request failed (${res.status})`
  }
  const text = await res.text().catch(() => '')
  const trimmed = text.trim().slice(0, 200)
  return trimmed || `Request failed (${res.status})`
}

const base = () => `${getApiBaseUrl()}/auth`

export async function signup(payload: {
  firstname: string
  lastname: string
  email: string
  password: string
  phone?: string
}): Promise<{ token: string; user: AuthUser }> {
  let res: Response
  try {
    res = await fetch(`${base()}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error(
      'Cannot reach the API. Start the backend (port 3000) or set VITE_API_URL.',
    )
  }
  if (!res.ok) {
    throw new AuthApiError(await parseError(res), res.status)
  }
  return res.json() as Promise<{ token: string; user: AuthUser }>
}

export async function login(payload: {
  email: string
  password: string
}): Promise<{ token: string; user: AuthUser }> {
  let res: Response
  try {
    res = await fetch(`${base()}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error(
      'Cannot reach the API. Start the backend (port 3000) or set VITE_API_URL.',
    )
  }
  if (!res.ok) {
    throw new AuthApiError(await parseError(res), res.status)
  }
  return res.json() as Promise<{ token: string; user: AuthUser }>
}

export async function fetchMe(token: string): Promise<{ user: AuthUser }> {
  const res = await fetch(`${base()}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    throw new AuthApiError(await parseError(res), res.status)
  }
  return res.json() as Promise<{ user: AuthUser }>
}

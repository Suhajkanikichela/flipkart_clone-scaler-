import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { fetchMe, login as loginApi, signup as signupApi } from '@/api/auth'
import type { AuthUser } from '@/api/auth'
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from '@/lib/authStorage'

type AuthContextValue = {
  user: AuthUser | null
  ready: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (payload: {
    firstname: string
    lastname: string
    email: string
    password: string
    phone?: string
  }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = getStoredToken()
    if (!token) {
      setReady(true)
      return
    }
    let cancelled = false
    fetchMe(token)
      .then((data) => {
        if (!cancelled) setUser(data.user)
      })
      .catch(() => {
        if (!cancelled) clearStoredToken()
      })
      .finally(() => {
        if (!cancelled) setReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { token, user: u } = await loginApi({ email, password })
    setStoredToken(token)
    setUser(u)
  }, [])

  const signup = useCallback(
    async (payload: {
      firstname: string
      lastname: string
      email: string
      password: string
      phone?: string
    }) => {
      const { token, user: u } = await signupApi(payload)
      setStoredToken(token)
      setUser(u)
    },
    [],
  )

  const logout = useCallback(() => {
    clearStoredToken()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      ready,
      login,
      signup,
      logout,
    }),
    [user, ready, login, signup, logout],
  )

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}

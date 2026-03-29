import { type FormEvent, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AuthApiError } from '@/api/auth'
import { StoreLayout } from '@/components/layout/StoreLayout'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { user, ready, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (ready && user) {
    return <Navigate to="/" replace />
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(email.trim(), password)
      navigate('/', { replace: true })
    } catch (err: unknown) {
      if (err instanceof AuthApiError) {
        setError(err.message)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Login failed')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <StoreLayout>
      <div className="mx-auto max-w-[1248px] px-4 py-10">
        <nav className="mb-6 text-sm text-zinc-600">
          <Link to="/" className="hover:text-fk-blue">
            Home
          </Link>
          <span className="mx-1 text-zinc-400">/</span>
          <span className="font-medium text-zinc-800">Login</span>
        </nav>

        <div className="mx-auto max-w-md rounded-sm border border-[var(--color-fk-card-border)] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
          <h1 className="text-xl font-semibold text-zinc-900">Login</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Get access to your orders, wishlist and recommendations.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            {error ? (
              <div className="rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                {error}
              </div>
            ) : null}
            <label className="block">
              <span className="text-xs font-medium text-zinc-600">Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-sm border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-fk-blue"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-zinc-600">Password</span>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-sm border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-fk-blue"
              />
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-sm bg-fk-orange py-3 text-sm font-bold uppercase text-white shadow-sm hover:bg-orange-600 disabled:opacity-50"
            >
              {submitting ? 'Please wait…' : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-600">
            New to Flipkart?{' '}
            <Link to="/signup" className="font-semibold text-fk-blue hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </StoreLayout>
  )
}

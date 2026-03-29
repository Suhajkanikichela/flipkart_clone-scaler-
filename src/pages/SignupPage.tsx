import { type FormEvent, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AuthApiError } from '@/api/auth'
import { StoreLayout } from '@/components/layout/StoreLayout'
import { useAuth } from '@/context/AuthContext'

export default function SignupPage() {
  const navigate = useNavigate()
  const { user, ready, signup } = useAuth()
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
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
      await signup({
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
      })
      navigate('/', { replace: true })
    } catch (err: unknown) {
      if (err instanceof AuthApiError) {
        setError(err.message)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Could not create account')
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
          <span className="font-medium text-zinc-800">Sign up</span>
        </nav>

        <div className="mx-auto max-w-md rounded-sm border border-[var(--color-fk-card-border)] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
          <h1 className="text-xl font-semibold text-zinc-900">Create account</h1>
          <p className="mt-1 text-sm text-zinc-500">
            We will send a welcome email after you sign up.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            {error ? (
              <div className="rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                {error}
              </div>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-medium text-zinc-600">
                  First name
                </span>
                <input
                  required
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  className="mt-1 w-full rounded-sm border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-fk-blue"
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-zinc-600">
                  Last name
                </span>
                <input
                  required
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="mt-1 w-full rounded-sm border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-fk-blue"
                />
              </label>
            </div>
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
              <span className="text-xs font-medium text-zinc-600">
                Mobile (optional)
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-sm border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-fk-blue"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-zinc-600">Password</span>
              <input
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-sm border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-fk-blue"
              />
              <span className="mt-1 block text-xs text-zinc-500">
                At least 6 characters
              </span>
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-sm bg-fk-orange py-3 text-sm font-bold uppercase text-white shadow-sm hover:bg-orange-600 disabled:opacity-50"
            >
              {submitting ? 'Please wait…' : 'Sign up'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-fk-blue hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </StoreLayout>
  )
}

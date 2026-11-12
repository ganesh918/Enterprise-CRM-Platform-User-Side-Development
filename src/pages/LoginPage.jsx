import { Lock } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { AuthLayout } from '../components/auth/AuthLayout'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { InputField } from '../components/ui/FormField'
import { PasswordInput } from '../components/ui/PasswordInput'
import {
  loginSuccess,
  selectAuthError,
  selectAuthLoading,
  selectIsAuthenticated,
  setAuthError,
  setAuthLoading,
} from '../features/auth/authSlice'
import { buildSessionUser, isValidEmailFormat } from '../lib/authUsers'

export function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const loading = useAppSelector(selectAuthLoading)
  const error = useAppSelector(selectAuthError)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [fieldErrors, setFieldErrors] = useState({})

  const from = location.state?.from?.toString() || '/'

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!email.trim()) nextErrors.email = 'Email is required'
    else if (!isValidEmailFormat(email)) nextErrors.email = 'Enter a valid email address'
    if (!password) nextErrors.password = 'Password is required'
    setFieldErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    dispatch(setAuthLoading(true))
    dispatch(setAuthError(null))
    await new Promise((r) => setTimeout(r, 400))

    const normalizedEmail = email.trim().toLowerCase()
    const session = buildSessionUser(normalizedEmail)

    dispatch(
      loginSuccess({
        remember,
        user: session,
      }),
    )
    navigate(from, { replace: true })
  }

  return (
    <AuthLayout
      title="User panel sign in"
      subtitle="Sign in with your work email to open your CRM workspace."
      footer={
        <>
          New here?{' '}
          <Link to="/signup" className="font-medium text-emerald-300 hover:text-emerald-200">
            Create an account
          </Link>
        </>
      }
    >
      {error && (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      )}

      <form className="space-y-4" onSubmit={onSubmit}>
        <InputField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          autoComplete="username"
          error={fieldErrors.email}
        />
        <PasswordInput
          label="Password"
          value={password}
          onChange={setPassword}
          error={fieldErrors.password}
        />

        <div className="flex items-center justify-between gap-2 text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-slate-400">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-white/5 accent-emerald-500"
            />
            Remember me
          </label>
          <Link
            to="/forgot-password"
            className="font-medium text-emerald-300 hover:text-emerald-200"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          loading={loading}
          className="w-full"
          icon={<Lock className="h-4 w-4" />}
        >
          Sign in
        </Button>
      </form>
    </AuthLayout>
  )
}

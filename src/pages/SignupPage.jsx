import { UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { AuthLayout } from '../components/auth/AuthLayout'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { InputField } from '../components/ui/FormField'
import { PasswordInput } from '../components/ui/PasswordInput'
import {
  loginSuccess,
  selectAuthLoading,
  selectIsAuthenticated,
  setAuthError,
  setAuthLoading,
} from '../features/auth/authSlice'
import { buildSessionUser, isValidEmailFormat, registerUser } from '../lib/authUsers'

export function SignupPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const loading = useAppSelector(selectAuthLoading)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formError, setFormError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!name.trim()) nextErrors.name = 'Full name is required'
    if (!email.trim()) nextErrors.email = 'Email is required'
    else if (!isValidEmailFormat(email)) nextErrors.email = 'Enter a valid email address'
    if (!password) nextErrors.password = 'Password is required'
    else if (password.length < 4) nextErrors.password = 'Password must be at least 4 characters'
    if (password !== confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match'
    }
    setFieldErrors(nextErrors)
    setFormError(null)
    if (Object.keys(nextErrors).length) return

    dispatch(setAuthLoading(true))
    dispatch(setAuthError(null))
    await new Promise((r) => setTimeout(r, 450))

    const normalizedEmail = email.trim().toLowerCase()
    const result = registerUser({
      name: name.trim(),
      email: normalizedEmail,
      password,
    })

    if (!result.ok) {
      dispatch(setAuthLoading(false))
      setFormError(result.message)
      return
    }

    const session = buildSessionUser(normalizedEmail)
    dispatch(
      loginSuccess({
        remember: true,
        user: {
          ...session,
          name: name.trim(),
        },
      }),
    )
    navigate('/', { replace: true })
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Sign up once, then sign in anytime from this deployment."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-emerald-300 hover:text-emerald-200">
            Sign in
          </Link>
        </>
      }
    >
      {formError && (
        <Alert variant="error" className="mb-4">
          {formError}
        </Alert>
      )}

      <form className="space-y-4" onSubmit={onSubmit}>
        <InputField
          label="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Alex Morgan"
          autoComplete="name"
          error={fieldErrors.name}
        />
        <InputField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          autoComplete="email"
          error={fieldErrors.email}
        />
        <PasswordInput
          label="Password"
          value={password}
          onChange={setPassword}
          error={fieldErrors.password}
          id="signup-password"
          autoComplete="new-password"
        />
        <PasswordInput
          label="Confirm password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          error={fieldErrors.confirmPassword}
          id="signup-confirm-password"
          autoComplete="new-password"
          placeholder="Re-enter password"
        />

        <Button
          type="submit"
          loading={loading}
          className="w-full"
          icon={<UserPlus className="h-4 w-4" />}
        >
          Create account
        </Button>
      </form>
    </AuthLayout>
  )
}

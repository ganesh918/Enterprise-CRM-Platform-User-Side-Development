import { Mail } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { AuthLayout } from '../components/auth/AuthLayout'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { InputField } from '../components/ui/FormField'
import { selectIsAuthenticated } from '../features/auth/authSlice'
import { isValidEmailFormat } from '../lib/authUsers'
import { startOtpSession } from '../lib/passwordReset'

export function ForgotPasswordPage() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to="/" replace />

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!email.trim()) {
      setError('Email is required')
      return
    }
    if (!isValidEmailFormat(email)) {
      setError('Enter a valid email address')
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 350))
    startOtpSession(email)
    setLoading(false)
    navigate('/verify-otp', { state: { email: email.trim().toLowerCase() } })
  }

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="We'll send a one-time verification code to your email."
      footer={
        <Link to="/login" className="font-medium text-emerald-300 hover:text-emerald-200">
          Back to sign in
        </Link>
      }
    >
      {error && (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      )}
      <form className="space-y-4" onSubmit={onSubmit}>
        <InputField
          label="Work email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          autoComplete="email"
        />
        <Button type="submit" loading={loading} className="w-full" icon={<Mail className="h-4 w-4" />}>
          Send verification code
        </Button>
      </form>
    </AuthLayout>
  )
}

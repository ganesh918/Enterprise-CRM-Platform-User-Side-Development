import { Save, Shield } from 'lucide-react'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { InputField, SelectField } from '../components/ui/FormField'
import { PasswordInput } from '../components/ui/PasswordInput'
import { Alert } from '../components/ui/Alert'
import {
  selectAuthUser,
  updateAuthAccess,
  updateAuthProfile,
} from '../features/auth/authSlice'
import {
  selectProfileSettings,
  updateProfileSettings,
} from '../features/profile/profileSlice'
import {
  isValidEmailFormat,
  updateRegisteredUserProfile,
  updateUserPassword,
} from '../lib/authUsers'

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
]

export function ProfileSettingsPage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectAuthUser)
  const settings = useAppSelector(selectProfileSettings)

  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [accessLevel, setAccessLevel] = useState(user?.userRole ?? 'crm_user')
  const [phone, setPhone] = useState(settings.phone)
  const [timezone, setTimezone] = useState(settings.timezone)
  const [emailDigest, setEmailDigest] = useState(settings.emailDigest)
  const [taskReminders, setTaskReminders] = useState(settings.taskReminders)
  const [meetingAlerts, setMeetingAlerts] = useState(settings.meetingAlerts)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const saveProfile = (e) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    if (!name.trim()) {
      setError('Name is required')
      return
    }
    if (!isValidEmailFormat(email)) {
      setError('Enter a valid email')
      return
    }

    dispatch(updateAuthProfile({ name: name.trim(), email: email.trim().toLowerCase() }))
    dispatch(updateAuthAccess({ userRole: accessLevel }))
    updateRegisteredUserProfile(user?.email ?? email, {
      name: name.trim(),
      userRole: accessLevel,
    })

    dispatch(
      updateProfileSettings({
        phone,
        timezone,
        emailDigest,
        taskReminders,
        meetingAlerts,
      }),
    )
    setMessage('Profile, access level, and notification preferences saved.')
  }

  const changePassword = (e) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    if (!user?.email) return
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (!currentPassword) {
      setError('Enter your current password')
      return
    }
    updateUserPassword(user.email, newPassword)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setMessage('Password updated successfully.')
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        title="Profile & settings"
        description="Manage personal information, workspace access, notifications, and security."
      />

      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="error">{error}</Alert>}

      <form onSubmit={saveProfile} className="glass-panel space-y-4 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-white">Personal information</h2>
        <InputField label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <InputField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          label="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+1 (555) 000-0000"
        />
        <SelectField
          label="Timezone"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </SelectField>

        <h3 className="pt-2 text-sm font-semibold text-white">Workspace access</h3>
        <p className="text-xs text-slate-500">
          Controls navigation and data scope. Managers see the full team; other roles see assigned
          records.
        </p>
        <SelectField
          label="Access level"
          value={accessLevel}
          onChange={(e) => setAccessLevel(e.target.value)}
        >
          <option value="crm_user">CRM User (default)</option>
          <option value="employee">Employee</option>
          <option value="sales_rep">Sales representative</option>
          <option value="manager">Manager (team overview)</option>
        </SelectField>

        <h3 className="pt-2 text-sm font-semibold text-white">Notifications</h3>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={emailDigest}
            onChange={(e) => setEmailDigest(e.target.checked)}
            className="h-4 w-4 accent-emerald-500"
          />
          Daily email digest
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={taskReminders}
            onChange={(e) => setTaskReminders(e.target.checked)}
            className="h-4 w-4 accent-emerald-500"
          />
          Task due date reminders
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={meetingAlerts}
            onChange={(e) => setMeetingAlerts(e.target.checked)}
            className="h-4 w-4 accent-emerald-500"
          />
          Meeting alerts
        </label>

        <Button type="submit" icon={<Save className="h-4 w-4" />}>
          Save changes
        </Button>
      </form>

      <form onSubmit={changePassword} className="glass-panel space-y-4 rounded-2xl p-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
          <Shield className="h-4 w-4 text-emerald-300" />
          Change password
        </h2>
        <PasswordInput
          label="Current password"
          value={currentPassword}
          onChange={setCurrentPassword}
        />
        <PasswordInput label="New password" value={newPassword} onChange={setNewPassword} />
        <PasswordInput
          label="Confirm new password"
          value={confirmPassword}
          onChange={setConfirmPassword}
        />
        <Button type="submit" variant="secondary">
          Update password
        </Button>
      </form>
    </div>
  )
}

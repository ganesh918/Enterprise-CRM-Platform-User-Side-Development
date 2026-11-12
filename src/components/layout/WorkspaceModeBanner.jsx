import { useAppSelector } from '../../app/hooks'
import { selectAuthUser } from '../../features/auth/authSlice'
import { isManagerRole } from '../../lib/userScope'

export function WorkspaceModeBanner() {
  const user = useAppSelector(selectAuthUser)
  const manager = isManagerRole(user?.userRole)

  return (
    <div
      className={`mb-4 rounded-xl border px-4 py-2.5 text-xs ${
        manager
          ? 'border-sky-400/25 bg-sky-500/10 text-sky-100'
          : 'border-emerald-400/25 bg-emerald-500/10 text-emerald-100'
      }`}
    >
      {manager ? (
        <span>
          <strong>Team overview</strong> — manager access to all leads, deals, and tasks.
        </span>
      ) : (
        <span>
          <strong>Personal workspace</strong> — assigned leads, customers, deals, and tasks for
          your queue.
        </span>
      )}
    </div>
  )
}

import { Bell, CheckCheck, Calendar, Megaphone, Target, ListTodo } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { selectAuthUser, selectCurrentTeamMemberId } from '../features/auth/authSlice'
import {
  markAllRead,
  markRead,
  notificationsForUser,
  selectAllNotifications,
} from '../features/notifications/notificationsSlice'
import { hasFullTeamDataView } from '../lib/userScope'
import { formatRelativeDate, cn } from '../lib/utils'

const kindConfig = {
  lead_assignment: { label: 'Lead assignment', icon: Target, tone: 'text-emerald-300' },
  task_reminder: { label: 'Task reminder', icon: ListTodo, tone: 'text-amber-300' },
  meeting: { label: 'Meeting', icon: Calendar, tone: 'text-sky-300' },
  update: { label: 'Important update', icon: Megaphone, tone: 'text-violet-300' },
}

export function NotificationsPage() {
  const dispatch = useAppDispatch()
  const teamMemberId = useAppSelector(selectCurrentTeamMemberId)
  const user = useAppSelector(selectAuthUser)
  const fullTeamView = hasFullTeamDataView(user?.userRole ?? user?.role)
  const all = useAppSelector(selectAllNotifications)
  const items = notificationsForUser(all, teamMemberId, fullTeamView)

  const summary = useMemo(() => {
    return {
      lead_assignment: items.filter((n) => n.kind === 'lead_assignment').length,
      task_reminder: items.filter((n) => n.kind === 'task_reminder').length,
      meeting: items.filter((n) => n.kind === 'meeting').length,
      update: items.filter((n) => n.kind === 'update').length,
      unread: items.filter((n) => !n.read).length,
    }
  }, [items])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Lead assignments, task reminders, upcoming meetings, and important updates."
        actions={
          <Button
            variant="secondary"
            icon={<CheckCheck className="h-4 w-4" />}
            onClick={() => dispatch(markAllRead(fullTeamView ? undefined : teamMemberId))}
          >
            Mark all read
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="glass-panel rounded-2xl border border-white/10 p-4">
          <p className="text-xs text-slate-500">Unread</p>
          <p className="mt-1 text-2xl font-semibold text-white">{summary.unread}</p>
        </div>
        {Object.entries(kindConfig).map(([kind, meta]) => (
          <div key={kind} className="glass-panel rounded-2xl border border-white/10 p-4">
            <p className="text-xs text-slate-500">{meta.label}</p>
            <p className={cn('mt-1 text-2xl font-semibold', meta.tone)}>
              {summary[kind]}
            </p>
          </div>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="glass-panel flex flex-col items-center rounded-2xl py-16 text-center">
          <Bell className="h-10 w-10 text-slate-500" />
          <p className="mt-4 text-sm text-slate-400">You&apos;re all caught up.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((n) => {
            const meta = kindConfig[n.kind] ?? kindConfig.update
            const Icon = meta.icon
            return (
              <li
                key={n.id}
                className={cn(
                  'glass-panel rounded-2xl border p-4 transition',
                  n.read ? 'border-white/5 opacity-80' : 'border-emerald-400/20',
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5',
                        meta.tone,
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-white/10 text-slate-200">{meta.label}</Badge>
                        {!n.read && (
                          <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
                        )}
                      </div>
                      <p className="mt-2 text-sm font-medium text-white">{n.title}</p>
                      <p className="mt-1 text-sm text-slate-400">{n.message}</p>
                      <p className="mt-2 text-xs text-slate-500">
                        {formatRelativeDate(n.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {n.link && (
                      <Link
                        to={n.link}
                        className="text-xs font-medium text-emerald-300 hover:text-emerald-200"
                        onClick={() => dispatch(markRead(n.id))}
                      >
                        Open
                      </Link>
                    )}
                    {!n.read && (
                      <button
                        type="button"
                        className="text-xs text-slate-400 hover:text-white"
                        onClick={() => dispatch(markRead(n.id))}
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

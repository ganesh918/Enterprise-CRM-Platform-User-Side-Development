import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { APP_NAME, APP_VARIANT_LABEL } from '../../config/app'
import { UserPanelBadge } from '../layout/UserPanelBadge'

export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-950 px-4 py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="hero-orb absolute -left-24 top-16 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="hero-orb absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-sky-600/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(52,211,153,0.12),transparent_50%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <UserPanelBadge className="mb-4 inline-block" />
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-600 shadow-lg shadow-emerald-500/25">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300/90">
            {APP_NAME} · {APP_VARIANT_LABEL}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">{title}</h1>
          <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
        </div>

        <div className="glass-panel glow-ring rounded-3xl p-6 md:p-8">{children}</div>

        {footer && <div className="mt-6 text-center text-sm text-slate-400">{footer}</div>}
      </motion.div>
    </div>
  )
}

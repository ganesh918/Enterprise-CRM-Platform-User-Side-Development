import { APP_VARIANT_LABEL } from '../../config/app'

export function UserPanelBadge({ className = '' }) {
  return (
    <span
      className={`shrink-0 rounded-lg border border-emerald-400/35 bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-100 shadow-sm shadow-emerald-900/30 ${className}`}
      title="CRM User Side (not Admin)"
    >
      {APP_VARIANT_LABEL}
    </span>
  )
}

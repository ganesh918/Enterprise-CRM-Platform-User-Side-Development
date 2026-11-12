import { Component } from 'react'

export class RootErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-surface-950 p-6 text-center text-slate-200">
          <div className="max-w-md rounded-2xl border border-rose-400/30 bg-rose-500/10 p-6">
            <h1 className="text-lg font-semibold text-white">Something went wrong</h1>
            <p className="mt-2 text-sm text-slate-300">
              The app failed to load. Try a hard refresh or open <strong>/login</strong>.
            </p>
            <p className="mt-4 font-mono text-xs text-rose-200">
              {String(this.state.error?.message ?? this.state.error)}
            </p>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

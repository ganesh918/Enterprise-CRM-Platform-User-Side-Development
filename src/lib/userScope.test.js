import { describe, expect, it } from 'vitest'
import {
  DEFAULT_WORKSPACE_MEMBER_ID,
  hasFullTeamDataView,
  resolveWorkspaceTeamMemberId,
  scopeByOwner,
} from './userScope'

describe('userScope', () => {
  const items = [
    { id: 1, ownerId: 'tm_2' },
    { id: 2, ownerId: 'tm_1' },
  ]

  it('assigns default workspace member for unknown emails', () => {
    expect(resolveWorkspaceTeamMemberId('random@test.com')).toBe(
      DEFAULT_WORKSPACE_MEMBER_ID,
    )
  })

  it('scopes items for non-manager users', () => {
    const scoped = scopeByOwner(items, 'tm_2', false)
    expect(scoped).toHaveLength(1)
    expect(scoped[0].id).toBe(1)
  })

  it('returns all items for managers', () => {
    expect(scopeByOwner(items, 'tm_2', true)).toHaveLength(2)
  })

  it('uses full team data for crm_user and employee-only queue scope', () => {
    expect(hasFullTeamDataView('crm_user')).toBe(true)
    expect(hasFullTeamDataView('manager')).toBe(true)
    expect(hasFullTeamDataView('employee')).toBe(false)
  })
})

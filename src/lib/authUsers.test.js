import { describe, expect, it } from 'vitest'
import { buildSessionUser, isValidEmailFormat } from './authUsers'
import { DEFAULT_WORKSPACE_MEMBER_ID } from './userScope'

describe('authUsers', () => {
  it('validates email format', () => {
    expect(isValidEmailFormat('a@b.co')).toBe(true)
    expect(isValidEmailFormat('not-an-email')).toBe(false)
  })

  it('builds a session as CRM User', () => {
    const user = buildSessionUser('anyone@company.com')
    expect(user.email).toBe('anyone@company.com')
    expect(user.name).toBe('Anyone')
    expect(user.userRole).toBe('crm_user')
    expect(user.role).toBe('CRM User')
    expect(user.teamMemberId).toBe(DEFAULT_WORKSPACE_MEMBER_ID)
  })
})

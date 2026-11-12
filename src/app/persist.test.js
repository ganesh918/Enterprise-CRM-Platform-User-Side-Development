import { describe, expect, it } from 'vitest'
import { persistedMatchesWorkspace } from './persist'

describe('persistedMatchesWorkspace', () => {
  const seedLike = {
    leads: {
      items: [{ id: 'l1', ownerId: 'tm_2' }],
    },
    pipeline: { deals: [{ id: 'd1', ownerId: 'tm_2' }] },
    customers: { items: [] },
    tasks: { items: [] },
    activities: { items: [] },
  }

  it('accepts persist that matches tm_2 workspace', () => {
    expect(
      persistedMatchesWorkspace(seedLike, {
        teamMemberId: 'tm_2',
        managerView: false,
      }),
    ).toBe(true)
  })

  it('rejects persist with no rows for the signed-in rep', () => {
    expect(
      persistedMatchesWorkspace(seedLike, {
        teamMemberId: 'tm_4',
        managerView: false,
      }),
    ).toBe(false)
  })

  it('accepts any non-empty persist for managers', () => {
    expect(
      persistedMatchesWorkspace(seedLike, {
        teamMemberId: 'tm_1',
        managerView: true,
      }),
    ).toBe(true)
  })
})

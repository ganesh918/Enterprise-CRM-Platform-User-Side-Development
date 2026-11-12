import { describe, expect, it } from 'vitest'
import leadsReducer, {
  addLead,
  selectAllLeads,
  selectFilteredLeads,
} from './leadsSlice'

describe('leadsSlice', () => {
  it('adds a lead to state', () => {
    const state = leadsReducer(undefined, { type: 'init' })
    const next = leadsReducer(
      state,
      addLead({
        name: 'Test Lead',
        company: 'Acme',
        email: 't@acme.com',
        phone: '1',
        status: 'new',
        source: 'Web',
        value: 1000,
        ownerId: 'tm_2',
        notes: '',
      }),
    )
    expect(next.items[0].name).toBe('Test Lead')
  })

  it('selects leads with filters', () => {
    const base = leadsReducer(undefined, { type: 'init' })
    const mockState = {
      leads: { ...base, filter: 'all', search: '' },
      ui: { globalSearch: '' },
    }
    expect(selectAllLeads(mockState).length).toBeGreaterThan(0)
    expect(selectFilteredLeads(mockState).length).toBeGreaterThan(0)
  })
})

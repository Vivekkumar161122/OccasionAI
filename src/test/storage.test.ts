import { beforeEach, describe, expect, it } from 'vitest'
import {
  exportAppStateAsJSON,
  getInitialAppState,
  loadAppState,
  saveAppState,
} from '../services/storage'

describe('Storage & State Management', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('provides comprehensive initial demo events for weddings, birthdays, and community festivals', () => {
    const state = getInitialAppState()
    expect(state.events.length).toBe(3)

    const types = state.events.map((e) => e.type)
    expect(types).toContain('wedding')
    expect(types).toContain('birthday')
    expect(types).toContain('community')

    expect(state.budgetItems.length).toBeGreaterThan(10)
    expect(state.timelineItems.length).toBeGreaterThan(10)
    expect(state.vendors.length).toBeGreaterThan(4)
  })

  it('saves and reloads state from localStorage with validation', () => {
    const state = getInitialAppState()
    saveAppState(state)

    const reloaded = loadAppState()
    expect(reloaded.events.length).toBe(state.events.length)
    expect(reloaded.activeEventId).toBe(state.activeEventId)
  })

  it('redacts sensitive API key when exporting state as JSON for security', () => {
    const state = getInitialAppState()
    state.aiSettings.apiKey = 'SUPER_SECRET_KEY_12345'
    state.aiSettings.useCustomKey = true

    const exportedJSON = exportAppStateAsJSON(state)
    const parsed = JSON.parse(exportedJSON)

    expect(parsed.aiSettings.apiKey).toBe('')
    expect(exportedJSON).not.toContain('SUPER_SECRET_KEY_12345')
  })

  it('gracefully handles corrupted JSON in localStorage by falling back to initial state', () => {
    localStorage.setItem('occasionai_state_v1', '{ invalid json garbage ###')
    const state = loadAppState()
    expect(state.events.length).toBe(3)
  })
})

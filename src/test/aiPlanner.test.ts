import { describe, expect, it } from 'vitest'
import { generateLocalIdeas } from '../services/aiPlanner'
import { DEFAULT_BIRTHDAY_EVENT, DEFAULT_COMMUNITY_EVENT, DEFAULT_WEDDING_EVENT } from '../services/storage'

describe('AI Planner Service', () => {
  it('generates rich local recommendations for Wedding events', () => {
    const rec = generateLocalIdeas(DEFAULT_WEDDING_EVENT)
    expect(rec.themeName).toBeTruthy()
    expect(rec.tagline).toBeTruthy()
    expect(rec.colorPalette.length).toBeGreaterThan(2)
    expect(rec.decorConcepts.length).toBeGreaterThan(1)
    expect(rec.menuIdeas.length).toBeGreaterThan(1)
    expect(rec.entertainmentSchedule.length).toBeGreaterThan(2)
    expect(rec.recommendedVendors.length).toBeGreaterThan(2)
    expect(rec.recommendedMilestones.length).toBeGreaterThan(2)
  })

  it('generates tailored ideas for Birthday events', () => {
    const rec = generateLocalIdeas(DEFAULT_BIRTHDAY_EVENT)
    expect(rec.themeName).toBeTruthy()
    expect(rec.costSavingTips.length).toBeGreaterThan(0)
  })

  it('generates civic and community tailored ideas for Community events', () => {
    const rec = generateLocalIdeas(DEFAULT_COMMUNITY_EVENT)
    expect(rec.themeName).toBeTruthy()
    // Should include safety / permits / entertainment vendors
    const categories = rec.recommendedVendors.map((v) => v.category)
    expect(categories.some((c) => ['permits_safety', 'entertainment', 'venue'].includes(c))).toBe(true)
  })

  it('scales vendor price estimates according to target budget', () => {
    const smallBudgetEvent = { ...DEFAULT_WEDDING_EVENT, targetBudget: 5000 }
    const largeBudgetEvent = { ...DEFAULT_WEDDING_EVENT, targetBudget: 50000 }

    const smallRec = generateLocalIdeas(smallBudgetEvent)
    const largeRec = generateLocalIdeas(largeBudgetEvent)

    const smallTotal = smallRec.recommendedVendors.reduce((acc, v) => acc + v.estimate, 0)
    const largeTotal = largeRec.recommendedVendors.reduce((acc, v) => acc + v.estimate, 0)

    expect(largeTotal).toBeGreaterThan(smallTotal)
  })
})

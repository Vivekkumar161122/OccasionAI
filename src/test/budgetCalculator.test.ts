import { describe, expect, it } from 'vitest'
import {
  calculateBudgetSummary,
  formatCurrency,
} from '../services/budgetCalculator'
import { BudgetItem } from '../types'

describe('Budget Calculator Service', () => {
  it('formats currency correctly across different codes', () => {
    expect(formatCurrency(1500, 'USD')).toBe('$1,500')
    expect(formatCurrency(25000, 'EUR')).toBe('€25,000')
    expect(formatCurrency(3200.5, 'GBP')).toBe('£3,200.5')
    expect(formatCurrency(100000, 'INR')).toBe('₹100,000')
  })

  it('calculates totals, variance, and status correctly when under budget', () => {
    const targetBudget = 10000
    const items: BudgetItem[] = [
      { id: '1', eventId: 'e1', name: 'Venue', category: 'venue', estimatedCost: 4000, actualCost: 3800, isPaid: true },
      { id: '2', eventId: 'e1', name: 'Catering', category: 'catering', estimatedCost: 3000, actualCost: 2800, isPaid: false },
    ]

    const summary = calculateBudgetSummary(targetBudget, items)

    expect(summary.targetBudget).toBe(10000)
    expect(summary.totalEstimated).toBe(7000)
    expect(summary.totalActual).toBe(6600)
    expect(summary.totalPaid).toBe(3800)
    expect(summary.remainingTarget).toBe(3400)
    expect(summary.variance).toBe(3400)
    expect(summary.percentSpent).toBe(66)
    expect(summary.status).toBe('safe')
  })

  it('detects danger status when actual spending exceeds target budget', () => {
    const targetBudget = 5000
    const items: BudgetItem[] = [
      { id: '1', eventId: 'e1', name: 'DJ Sound', category: 'entertainment', estimatedCost: 3000, actualCost: 3500, isPaid: true },
      { id: '2', eventId: 'e1', name: 'Bar Tab', category: 'catering', estimatedCost: 2000, actualCost: 2200, isPaid: true },
    ]

    const summary = calculateBudgetSummary(targetBudget, items)

    expect(summary.totalActual).toBe(5700)
    expect(summary.remainingTarget).toBe(-700)
    expect(summary.percentSpent).toBe(114)
    expect(summary.status).toBe('danger')
  })

  it('groups items into categories with correct percentages', () => {
    const targetBudget = 10000
    const items: BudgetItem[] = [
      { id: '1', eventId: 'e1', name: 'Hall', category: 'venue', estimatedCost: 5000, actualCost: 5000, isPaid: true },
      { id: '2', eventId: 'e1', name: 'Flowers', category: 'decor', estimatedCost: 1000, actualCost: 1000, isPaid: true },
    ]

    const summary = calculateBudgetSummary(targetBudget, items)
    expect(summary.categories.length).toBe(2)

    const venueCat = summary.categories.find((c) => c.category === 'venue')
    expect(venueCat).toBeDefined()
    expect(venueCat?.percentageOfBudget).toBe(50)

    const decorCat = summary.categories.find((c) => c.category === 'decor')
    expect(decorCat).toBeDefined()
    expect(decorCat?.percentageOfBudget).toBe(10)
  })
})

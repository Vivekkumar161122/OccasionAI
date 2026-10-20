import { BudgetCategory, BudgetItem, CURRENCIES, CurrencyCode } from '../types'

export interface CategorySummary {
  category: BudgetCategory
  label: string
  estimated: number
  actual: number
  itemCount: number
  percentageOfBudget: number
  color: string
}

export interface BudgetSummary {
  targetBudget: number
  totalEstimated: number
  totalActual: number
  totalPaid: number
  remainingTarget: number
  variance: number // positive means under budget, negative means over budget
  percentSpent: number
  status: 'safe' | 'warning' | 'danger'
  categories: CategorySummary[]
}

export const CATEGORY_METADATA: Record<BudgetCategory, { label: string; color: string }> = {
  venue: { label: 'Venue & Facilities', color: '#6366f1' },
  catering: { label: 'Catering & Beverages', color: '#f59e0b' },
  decor: { label: 'Decor, Floral & Lighting', color: '#ec4899' },
  entertainment: { label: 'Music & Entertainment', color: '#8b5cf6' },
  photo_video: { label: 'Photography & Videography', color: '#06b6d4' },
  attire_beauty: { label: 'Attire & Styling', color: '#10b981' },
  invitations_marketing: { label: 'Invitations & Marketing', color: '#3b82f6' },
  favors_gifts: { label: 'Favors, Swag & Gifts', color: '#14b8a6' },
  permits_safety: { label: 'Permits, Insurance & Safety', color: '#ef4444' },
  miscellaneous: { label: 'Emergency Fund & Misc', color: '#64748b' },
}

export function formatCurrency(amount: number, currency: CurrencyCode = 'USD'): string {
  const config = CURRENCIES[currency] || CURRENCIES.USD
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
  return `${config.symbol}${formatted}`
}

export function calculateBudgetSummary(
  targetBudget: number,
  items: BudgetItem[]
): BudgetSummary {
  const safeTarget = Math.max(0, targetBudget)

  let totalEstimated = 0
  let totalActual = 0
  let totalPaid = 0

  const catMap: Record<BudgetCategory, { estimated: number; actual: number; count: number }> = {
    venue: { estimated: 0, actual: 0, count: 0 },
    catering: { estimated: 0, actual: 0, count: 0 },
    decor: { estimated: 0, actual: 0, count: 0 },
    entertainment: { estimated: 0, actual: 0, count: 0 },
    photo_video: { estimated: 0, actual: 0, count: 0 },
    attire_beauty: { estimated: 0, actual: 0, count: 0 },
    invitations_marketing: { estimated: 0, actual: 0, count: 0 },
    favors_gifts: { estimated: 0, actual: 0, count: 0 },
    permits_safety: { estimated: 0, actual: 0, count: 0 },
    miscellaneous: { estimated: 0, actual: 0, count: 0 },
  }

  for (const item of items) {
    const est = Math.max(0, item.estimatedCost || 0)
    const act = Math.max(0, item.actualCost || 0)
    totalEstimated += est
    totalActual += act
    if (item.isPaid) {
      totalPaid += act > 0 ? act : est
    }

    if (catMap[item.category]) {
      catMap[item.category].estimated += est
      catMap[item.category].actual += act
      catMap[item.category].count += 1
    }
  }

  const effectiveSpent = totalActual > 0 ? totalActual : totalEstimated
  const remainingTarget = safeTarget - effectiveSpent
  const variance = safeTarget - effectiveSpent
  const percentSpent = safeTarget > 0 ? Math.round((effectiveSpent / safeTarget) * 100) : 0

  let status: 'safe' | 'warning' | 'danger' = 'safe'
  if (percentSpent > 100) {
    status = 'danger'
  } else if (percentSpent >= 85) {
    status = 'warning'
  }

  const categories: CategorySummary[] = (Object.keys(catMap) as BudgetCategory[])
    .map((catKey) => {
      const data = catMap[catKey]
      const catSpent = data.actual > 0 ? data.actual : data.estimated
      const pct = safeTarget > 0 ? Math.round((catSpent / safeTarget) * 100) : 0
      return {
        category: catKey,
        label: CATEGORY_METADATA[catKey].label,
        estimated: data.estimated,
        actual: data.actual,
        itemCount: data.count,
        percentageOfBudget: pct,
        color: CATEGORY_METADATA[catKey].color,
      }
    })
    .filter((c) => c.itemCount > 0 || c.estimated > 0 || c.actual > 0)
    .sort((a, b) => (b.actual || b.estimated) - (a.actual || a.estimated))

  return {
    targetBudget: safeTarget,
    totalEstimated,
    totalActual,
    totalPaid,
    remainingTarget,
    variance,
    percentSpent,
    status,
    categories,
  }
}

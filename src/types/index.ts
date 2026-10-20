export type EventType = 'wedding' | 'birthday' | 'community' | 'custom'

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD' | 'JPY'

export interface CurrencyConfig {
  code: CurrencyCode
  symbol: string
  label: string
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', label: 'USD ($)' },
  EUR: { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  GBP: { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  INR: { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  CAD: { code: 'CAD', symbol: 'C$', label: 'CAD (C$)' },
  AUD: { code: 'AUD', symbol: 'A$', label: 'AUD (A$)' },
  JPY: { code: 'JPY', symbol: '¥', label: 'JPY (¥)' },
}

export type BudgetCategory =
  | 'venue'
  | 'catering'
  | 'decor'
  | 'entertainment'
  | 'photo_video'
  | 'attire_beauty'
  | 'invitations_marketing'
  | 'favors_gifts'
  | 'permits_safety'
  | 'miscellaneous'

export interface BudgetItem {
  id: string
  eventId: string
  name: string
  category: BudgetCategory
  estimatedCost: number
  actualCost: number
  isPaid: boolean
  vendorId?: string
  notes?: string
}

export type TimelinePhase =
  | 'pre_planning' // 6+ months out
  | 'middle_planning' // 2-3 months out
  | 'final_prep' // 2-4 weeks out
  | 'week_of' // Week of event
  | 'day_of' // Day of event run-of-show

export type PriorityLevel = 'low' | 'medium' | 'high'

export interface TimelineItem {
  id: string
  eventId: string
  title: string
  description?: string
  phase: TimelinePhase
  dueDate?: string
  time?: string // For day-of hourly run-of-show (e.g. "14:00")
  completed: boolean
  priority: PriorityLevel
  assignedTo?: string
}

export type VendorStatus =
  | 'researching'
  | 'inquired'
  | 'quoted'
  | 'booked'
  | 'deposit_paid'
  | 'completed'
  | 'declined'

export interface VendorItem {
  id: string
  eventId: string
  name: string
  category: BudgetCategory
  contactPerson?: string
  email?: string
  phone?: string
  website?: string
  status: VendorStatus
  quotedAmount?: number
  notes?: string
  deliverables?: string[]
}

export interface OccasionEvent {
  id: string
  title: string
  type: EventType
  date: string // ISO string "YYYY-MM-DD"
  location: string
  guestCount: number
  vibe: string
  targetBudget: number
  currency: CurrencyCode
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface GenAIRecommendation {
  themeName: string
  tagline: string
  colorPalette: { name: string; hex: string }[]
  decorConcepts: string[]
  menuIdeas: string[]
  entertainmentSchedule: { time: string; activity: string; description: string }[]
  costSavingTips: string[]
  recommendedVendors: { role: string; category: BudgetCategory; estimate: number; tips: string }[]
  recommendedMilestones: { title: string; phase: TimelinePhase; priority: PriorityLevel }[]
}

export interface AISettings {
  apiKey: string
  useCustomKey: boolean
  model: 'gemini-2.5-flash' | 'gemini-2.5-pro'
}

export interface AppState {
  events: OccasionEvent[]
  activeEventId: string | null
  budgetItems: BudgetItem[]
  timelineItems: TimelineItem[]
  vendors: VendorItem[]
  aiSettings: AISettings
}
